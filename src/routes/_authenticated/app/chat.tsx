import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, useRequireOnboarded } from "@/components/app-shell";
import { getMyProfile } from "@/lib/profile.functions";
import { loadConversationMessages } from "@/lib/chat-history.functions";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput } from "@/components/ai-elements/tool";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { BreathingTool, GroundingTool, ThoughtRecordTool } from "@/components/tools-inline";
import { getHotlines } from "@/lib/hotlines";

export const Route = createFileRoute("/_authenticated/app/chat")({
  head: () => ({ meta: [{ title: "Bruno" }] }),
  component: ChatPage,
});

function ChatPage() {
  const fetchProfile = useServerFn(getMyProfile);
  const fetchHistory = useServerFn(loadConversationMessages);
  const profileQ = useQuery({ queryKey: ["me"], queryFn: () => fetchProfile() });
  const historyQ = useQuery({ queryKey: ["chat-history"], queryFn: () => fetchHistory() });

  useRequireOnboarded(profileQ.data?.profile ?? null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        // Inject the bearer token on each fetch — TanStack's serverFn attacher doesn't cover raw routes.
        fetch: async (input: any, init: any = {}) => {
          const { data } = await supabase.auth.getSession();
          const headers = new Headers(init.headers);
          if (data.session?.access_token) headers.set("Authorization", `Bearer ${data.session.access_token}`);
          return fetch(input, { ...init, headers });
        },
      }),
    [],
  );

  // Rebuild chat when initial history arrives.
  const initialMessages = (historyQ.data?.messages ?? []) as any[];
  const key = historyQ.data ? "ready" : "loading";

  return (
    <AppShell region={profileQ.data?.profile?.crisis_region} title="Bruno">
      <ChatInner key={key} transport={transport} initial={initialMessages} region={profileQ.data?.profile?.crisis_region} />
    </AppShell>
  );
}

function ChatInner({
  transport,
  initial,
  region,
}: {
  transport: DefaultChatTransport<any>;
  initial: any[];
  region?: string | null;
}) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport,
    messages: initial,
    onError: (e: Error) => console.error("[chat]", e),
  });

  const empty = messages.length === 0;
  const showSafetyCard = messages.some((m: any) => {
    const sev = (m as any)?.metadata?.safetySeverity;
    return sev === "high" || sev === "imminent";
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {showSafetyCard && <SafetyCard region={region} />}
      <Conversation className="flex-1">
        <ConversationContent>
          {empty && <EmptyState />}
          {messages.map((m: any) => (
            <Message from={m.role} key={m.id}>
              <MessageContent>
                {m.parts.map((part: any, i: number) => {
                  if (part.type === "text")
                    return m.role === "assistant" ? (
                      <MessageResponse key={i}>{part.text}</MessageResponse>
                    ) : (
                      <p key={i} className="whitespace-pre-wrap">{part.text}</p>
                    );

                  // Tool parts in AI SDK v5+: type is `tool-${name}`
                  if (typeof part.type === "string" && part.type.startsWith("tool-")) {
                    const toolName = part.type.replace("tool-", "");
                    if (part.state === "output-available") {
                      if (toolName === "start_breathing")
                        return <BreathingTool key={i} pattern={part.input?.pattern ?? "4-7-8"} />;
                      if (toolName === "start_grounding") return <GroundingTool key={i} />;
                      if (toolName === "start_thought_record")
                        return <ThoughtRecordTool key={i} prefill={part.input ?? {}} />;
                    }
                    return (
                      <Tool key={i} defaultOpen={false}>
                        <ToolHeader type={part.type} state={part.state} />
                        <ToolContent>
                          <ToolInput input={part.input} />
                          {part.output !== undefined && <ToolOutput output={JSON.stringify(part.output)} errorText={undefined} />}
                        </ToolContent>
                      </Tool>
                    );
                  }
                  return null;
                })}
              </MessageContent>
            </Message>
          ))}
          {status === "submitted" && (
            <div className="px-4 py-2"><Shimmer>Bruno is thinking…</Shimmer></div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border/60 bg-background/95 p-3">
        <PromptInput
          onSubmit={(message: { text?: string }) => {
            const text = (message.text ?? input).trim();
            if (!text) return;
            sendMessage({ text });
            setInput("");
          }}
        >
          <PromptInputTextarea
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            placeholder="Tell Bruno what's going on…"
            autoFocus
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} disabled={status === "submitted" || status === "streaming"} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-md px-6 pt-10 text-center">
      <p className="font-display text-2xl font-semibold text-ink">Hi, I'm Bruno.</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Tell me how you're feeling, what's on your mind, or what kept you up last night. I'll meet you where you are.
      </p>
      <div className="mt-6 grid gap-2 text-left text-sm">
        {[
          "I can't stop overthinking a conversation from earlier",
          "I'm anxious right now and don't know why",
          "Help me sleep — my mind won't shut up",
          "Walk me through a quick thought record",
        ].map((s) => (
          <div key={s} className="rounded-xl border border-border/60 bg-background px-3 py-2 text-muted-foreground">
            "{s}"
          </div>
        ))}
      </div>
    </div>
  );
}

function SafetyCard({ region }: { region?: string | null }) {
  const h = getHotlines(region);
  return (
    <div className="border-b border-clay/40 bg-clay/10 px-4 py-3 text-sm">
      <p className="font-semibold text-ink">I hear you. Please talk to a human who can support you right now.</p>
      <ul className="mt-2 space-y-1">
        {h.lines.map((l) => (
          <li key={l.name} className="flex items-baseline justify-between gap-3">
            <span>{l.name}</span>
            <span className="font-semibold tabular-nums">{l.number}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
