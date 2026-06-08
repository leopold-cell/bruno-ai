import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";


export const getOrCreateConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: existing } = await context.supabase
      .from("conversations")
      .select("id")
      .eq("user_id", context.userId)
      .order("last_message_at", { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();

    if (existing?.id) return { id: existing.id };

    const { data: created, error } = await context.supabase
      .from("conversations")
      .insert({ user_id: context.userId, title: "Bruno" })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: created.id };
  });

export const loadConversationMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: convo } = await context.supabase
      .from("conversations")
      .select("id")
      .eq("user_id", context.userId)
      .order("last_message_at", { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();

    if (!convo) return { conversationId: null as string | null, messages: [] as Array<{ id: string; role: string; parts: unknown }> };

    const { data, error } = await context.supabase
      .from("messages")
      .select("client_msg_id, role, parts, created_at")
      .eq("conversation_id", convo.id)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);

    const messages = (data ?? []).map((row, i) => ({
      id: row.client_msg_id ?? `srv_${i}`,
      role: row.role as string,
      parts: (row.parts as any) ?? [],
    }));

    return { conversationId: convo.id as string | null, messages };
  });
