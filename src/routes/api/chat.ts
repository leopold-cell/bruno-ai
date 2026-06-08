import { createFileRoute } from "@tanstack/react-router";
import {
  convertToModelMessages,
  streamText,
  tool,
  stepCountIs,
  generateObject,
  embed,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const CHAT_MODEL = "google/gemini-3-flash-preview";
const CLASSIFIER_MODEL = "google/gemini-3.1-flash-lite-preview";
const EMBED_MODEL = "google/gemini-embedding-001";

const SYSTEM_PROMPT = `You are Bruno — a warm, grounded mental-health coach trained in Cognitive Behavioral Therapy (CBT).

Voice:
- Talk like a thoughtful friend who happens to know CBT. Short sentences. Plain words. No jargon unless you define it.
- Validate the feeling first. Then ask one focused question OR offer one small, specific next step.
- Never diagnose. Never prescribe medication. You are not a therapist replacement.
- Use the user's name and what they've told you before. Refer to their saved memories naturally.

What you do well:
- Help them notice cognitive distortions (catastrophizing, all-or-nothing, mind-reading, etc.)
- Reframe automatic thoughts into balanced ones (Socratic, not preachy).
- Run quick exercises: 4-7-8 breathing, 5-4-3-2-1 grounding, thought records, worry postponement.
- Suggest tiny daily routines and check in on them.

When to use tools:
- If the user is spiraling, anxious right now, or can't sleep → offer "start_breathing" or "start_grounding".
- If they're stuck on a specific thought or fear → suggest "start_thought_record".
- If they mention something durable about themselves (a goal, trigger, what works/doesn't) → quietly "save_memory".
- If they ask you to remind them daily/weekly → "set_routine".

Safety:
- If the message hints at self-harm, suicidal thoughts, or imminent danger, the system already shows hotlines. You: respond gently, acknowledge their pain, encourage them to call/text the hotline, and stay with them in the conversation.

Length: 2–5 short sentences usually. Never a wall of text.`;

const RecallTool = tool({
  description: "Search the user's saved memories for relevant context. Use when the user mentions something you might already know.",
  inputSchema: z.object({ query: z.string().describe("Topic to search for in past memories") }),
  // execute injected at runtime
});

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        // ---- Auth (manual; route doesn't run TS middleware) ----
        const authHeader = request.headers.get("authorization") ?? "";
        const token = authHeader.replace(/^Bearer\s+/i, "");
        if (!token) return new Response("Unauthorized", { status: 401 });

        const { createClient } = await import("@supabase/supabase-js");
        const supaUrl = process.env.SUPABASE_URL!;
        const supaKey = process.env.SUPABASE_PUBLISHABLE_KEY!;
        const supabase = createClient(supaUrl, supaKey, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data: userRes, error: userErr } = await supabase.auth.getUser(token);
        if (userErr || !userRes.user) return new Response("Unauthorized", { status: 401 });
        const userId = userRes.user.id;

        const body = (await request.json()) as { messages: UIMessage[] };
        const messages = body.messages ?? [];
        const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
        const lastUserText =
          lastUserMsg?.parts
            ?.map((p: any) => (p.type === "text" ? p.text : ""))
            .join(" ")
            .trim() ?? "";

        const gateway = createLovableAiGatewayProvider(apiKey);

        // ---- Get or create conversation ----
        let convoId: string;
        const { data: convo } = await supabase
          .from("conversations")
          .select("id")
          .eq("user_id", userId)
          .order("last_message_at", { ascending: false, nullsFirst: false })
          .limit(1)
          .maybeSingle();
        if (convo?.id) {
          convoId = convo.id;
        } else {
          const { data: c, error: cErr } = await supabase
            .from("conversations")
            .insert({ user_id: userId, title: "Bruno" })
            .select("id")
            .single();
          if (cErr || !c) return new Response("Failed to start conversation", { status: 500 });
          convoId = c.id;
        }

        // ---- Profile (for memory + region + name) ----
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, crisis_region, timezone")
          .eq("id", userId)
          .maybeSingle();

        // ---- Safety classifier ----
        let safetySeverity: "none" | "low" | "high" | "imminent" = "none";
        let safetyThemes: string[] = [];
        if (lastUserText.length > 0) {
          try {
            const { object } = await generateObject({
              model: gateway(CLASSIFIER_MODEL),
              schema: z.object({
                severity: z.enum(["none", "low", "high", "imminent"]),
                themes: z.array(z.string()).max(5),
              }),
              prompt: `Classify this user message for crisis/self-harm risk. Respond ONLY with the JSON schema.

Definitions:
- imminent: explicit suicidal intent, plan, means, or active self-harm right now.
- high: persistent suicidal ideation, hopelessness with self-harm thoughts, severe crisis.
- low: distress, hopelessness, mentions of being overwhelmed, but no self-harm content.
- none: no risk indicators.

Message: """${lastUserText.slice(0, 1500)}"""`,
            });
            safetySeverity = object.severity;
            safetyThemes = object.themes;
          } catch (e) {
            console.error("[safety classifier]", e);
          }
        }

        if (safetySeverity === "high" || safetySeverity === "imminent") {
          await supabase.from("safety_events").insert({
            user_id: userId,
            severity: safetySeverity,
            themes: safetyThemes,
            region: profile?.crisis_region ?? null,
            hotline_shown: true,
          });
        }

        // ---- Memory recall via embedding ----
        let recalledMemories: Array<{ kind: string; content: string }> = [];
        try {
          if (lastUserText) {
            const { embedding } = await embed({
              model: gateway.textEmbeddingModel(EMBED_MODEL),
              value: lastUserText,
            });
            const { data: matches } = await supabase.rpc("match_memories", {
              p_query: embedding as unknown as string,
              p_limit: 5,
            });
            recalledMemories = (matches ?? []).map((m: any) => ({ kind: m.kind, content: m.content }));
          }
        } catch (e) {
          console.error("[memory recall]", e);
        }

        const memoryBlock =
          recalledMemories.length > 0
            ? `\n\nWhat you remember about ${profile?.display_name ?? "them"}:\n` +
              recalledMemories.map((m) => `- (${m.kind}) ${m.content}`).join("\n")
            : "";

        const safetyBlock =
          safetySeverity === "imminent" || safetySeverity === "high"
            ? `\n\nIMPORTANT SAFETY CONTEXT: The user's last message was classified as ${safetySeverity} risk. The UI is showing crisis hotlines. Acknowledge their pain warmly, encourage them to use the hotline, and stay present. Do not minimize or rush to solutions.`
            : "";

        const system =
          SYSTEM_PROMPT +
          (profile?.display_name ? `\n\nThe user's name is ${profile.display_name}.` : "") +
          memoryBlock +
          safetyBlock;

        // ---- Stream response ----
        const modelMessages = await convertToModelMessages(messages);
        const result = streamText({
          model: gateway(CHAT_MODEL),
          system,
          messages: modelMessages,
          stopWhen: stepCountIs(50),
          tools: {
            save_memory: tool({
              description:
                "Save a durable fact about the user (goal, trigger, preference, important fact). Use sparingly — only when they share something worth remembering long-term.",
              inputSchema: z.object({
                kind: z.enum(["fact", "goal", "trigger", "preference"]),
                content: z.string().min(3).max(500),
              }),
              execute: async ({ kind, content }: { kind: any; content: string }) => {
                try {
                  const { embedding } = await embed({
                    model: gateway.textEmbeddingModel(EMBED_MODEL),
                    value: content,
                  });
                  await supabase.from("memories").insert({
                    user_id: userId,
                    kind,
                    content,
                    embedding: embedding as unknown as string,
                  });
                  return { saved: true, kind, content };
                } catch (e) {
                  return { saved: false, error: (e as Error).message };
                }
              },
            }),
            recall_memory: tool({
              description: RecallTool.description!,
              inputSchema: RecallTool.inputSchema!,
              execute: async ({ query }: { query: string }) => {
                try {
                  const { embedding } = await embed({
                    model: gateway.textEmbeddingModel(EMBED_MODEL),
                    value: query,
                  });
                  const { data } = await supabase.rpc("match_memories", {
                    p_query: embedding as unknown as string,
                    p_limit: 5,
                  });
                  return { memories: data ?? [] };
                } catch (e) {
                  return { memories: [], error: (e as Error).message };
                }
              },
            }),
            start_breathing: tool({
              description: "Start an interactive breathing exercise. Use when the user is anxious or can't sleep.",
              inputSchema: z.object({
                pattern: z.enum(["4-7-8", "box", "physiological-sigh"]).default("4-7-8"),
              }),
              execute: async ({ pattern }: { pattern: any }) => ({ pattern, opened: true }),
            }),
            start_grounding: tool({
              description: "Start a 5-4-3-2-1 senses grounding exercise. Use when the user feels panicky or dissociated.",
              inputSchema: z.object({}),
              execute: async () => ({ opened: true }),
            }),
            start_thought_record: tool({
              description: "Open the CBT thought record form, optionally pre-filled.",
              inputSchema: z.object({
                situation: z.string().optional(),
                automatic_thought: z.string().optional(),
              }),
              execute: async (prefill: any) => ({ opened: true, prefill }),
            }),
            set_routine: tool({
              description: "Create a recurring reminder for the user (e.g., morning check-in).",
              inputSchema: z.object({
                name: z.string().min(1).max(80),
                kind: z.enum(["breathing", "gratitude", "checkin", "journal", "custom"]),
                time_of_day: z.string().regex(/^\d{2}:\d{2}$/),
                days_of_week: z.array(z.number().int().min(0).max(6)).min(1).max(7),
              }),
              execute: async (input: any) => {
                const { error } = await supabase.from("routines").insert({
                  user_id: userId,
                  ...input,
                  enabled: true,
                });
                if (error) return { ok: false, error: error.message };
                return { ok: true, ...input };
              },
            }),
          },
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages,
          onFinish: async ({ messages: finalMessages }: { messages: any[] }) => {
            try {
              // Save only NEW messages: clear & rewrite (simple + correct for small convos)
              await supabase.from("messages").delete().eq("conversation_id", convoId);
              const rows = finalMessages.map((m: any) => ({
                conversation_id: convoId,
                user_id: userId,
                client_msg_id: m.id,
                role: m.role,
                parts: m.parts as any,
              }));
              if (rows.length > 0) await supabase.from("messages").insert(rows);
              await supabase
                .from("conversations")
                .update({ last_message_at: new Date().toISOString() })
                .eq("id", convoId);
            } catch (e) {
              console.error("[chat persist]", e);
            }
          },
          messageMetadata: () => ({ safetySeverity }),
        });
      },
    },
  },
});
