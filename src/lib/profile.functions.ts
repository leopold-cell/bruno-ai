import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { profile: data };
  });

const UpdateInput = z.object({
  display_name: z.string().trim().min(1).max(100).optional(),
  timezone: z.string().max(80).optional(),
  locale: z.string().max(10).optional(),
  crisis_region: z.string().max(8).optional(),
  push_enabled: z.boolean().optional(),
  onboarding_done: z.boolean().optional(),
});

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => UpdateInput.parse(data))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update(data)
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const checkWaitlistEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ email: z.string().trim().toLowerCase().email() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("waitlist_signups")
      .select("id")
      .eq("email", data.email)
      .maybeSingle();
    return { onList: !!row };
  });

export const markWaitlistActivated = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = context.claims.email;
    if (!email) return { ok: false };
    await supabaseAdmin
      .from("waitlist_signups")
      .update({ activated_at: new Date().toISOString() })
      .eq("email", email.toLowerCase());
    return { ok: true };
  });
