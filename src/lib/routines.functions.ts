import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const UpsertRoutine = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(80),
  kind: z.enum(["breathing", "gratitude", "checkin", "journal", "custom"]),
  time_of_day: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "HH:MM"),
  days_of_week: z.array(z.number().int().min(0).max(6)).min(1).max(7),
  enabled: z.boolean().default(true),
});

export const upsertRoutine = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => UpsertRoutine.parse(data))
  .handler(async ({ context, data }) => {
    if (data.id) {
      const { error } = await context.supabase
        .from("routines")
        .update({
          name: data.name,
          kind: data.kind,
          time_of_day: data.time_of_day,
          days_of_week: data.days_of_week,
          enabled: data.enabled,
        })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await context.supabase.from("routines").insert({
        user_id: context.userId,
        name: data.name,
        kind: data.kind,
        time_of_day: data.time_of_day,
        days_of_week: data.days_of_week,
        enabled: data.enabled,
      });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteRoutine = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("routines").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listRoutines = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("routines")
      .select("*")
      .order("time_of_day", { ascending: true });
    if (error) throw new Error(error.message);
    return { routines: data ?? [] };
  });

const Subscribe = z.object({
  endpoint: z.string().url().max(2000),
  p256dh: z.string().min(1).max(500),
  auth: z.string().min(1).max(500),
  user_agent: z.string().max(500).optional(),
});

export const subscribeToPush = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => Subscribe.parse(data))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("push_subscriptions").upsert(
      {
        user_id: context.userId,
        endpoint: data.endpoint,
        p256dh: data.p256dh,
        auth: data.auth,
        user_agent: data.user_agent ?? null,
      },
      { onConflict: "endpoint" },
    );
    if (error) throw new Error(error.message);
    await context.supabase.from("profiles").update({ push_enabled: true }).eq("id", context.userId);
    return { ok: true };
  });

export const unsubscribeFromPush = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ endpoint: z.string().url() }).parse(data))
  .handler(async ({ context, data }) => {
    await context.supabase.from("push_subscriptions").delete().eq("endpoint", data.endpoint);
    await context.supabase.from("profiles").update({ push_enabled: false }).eq("id", context.userId);
    return { ok: true };
  });
