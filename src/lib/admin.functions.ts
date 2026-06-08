import { createServerFn } from "@tanstack/react-start";
import process from "node:process";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Json } from "@/integrations/supabase/types";

// Comma-separated allowlist of admin emails, e.g. "leo@bruno.ai,team@bruno.ai".
function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function assertAdmin(claims: Record<string, unknown>): void {
  const email = String(claims.email ?? "").toLowerCase();
  const allow = adminEmails();
  if (allow.length === 0) {
    throw new Error("Admin access is not configured (ADMIN_EMAILS is empty).");
  }
  if (!email || !allow.includes(email)) {
    throw new Error("Forbidden: this account is not an admin.");
  }
}

export type WaitlistLead = {
  id: string;
  name: string;
  email: string;
  check_score: number | null;
  check_answers: Json | null;
  source: string | null;
  created_at: string;
  activated_at: string | null;
};

// Returns every waitlist lead (admin-only). Reads via the service-role client
// to bypass RLS — the waitlist table has no SELECT grant for normal users.
export const listWaitlistLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ leads: WaitlistLead[]; total: number }> => {
    assertAdmin(context.claims as Record<string, unknown>);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("waitlist_signups")
      .select("id, name, email, check_score, check_answers, source, created_at, activated_at")
      .order("created_at", { ascending: false })
      .limit(5000);

    if (error) {
      console.error("[admin] list leads failed", error);
      throw new Error("Could not load leads.");
    }
    const leads = (data ?? []) as WaitlistLead[];
    return { leads, total: leads.length };
  });

// Lightweight check the client uses to decide whether to render the admin UI.
export const amIAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ isAdmin: boolean; email: string | null }> => {
    const email = String((context.claims as Record<string, unknown>).email ?? "").toLowerCase();
    return { isAdmin: !!email && adminEmails().includes(email), email: email || null };
  });
