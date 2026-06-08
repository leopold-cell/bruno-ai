import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const WaitlistInput = z.object({
  name: z.string().trim().min(1, "Please tell us your name").max(100),
  email: z.string().trim().toLowerCase().email("Please enter a valid email").max(255),
  checkScore: z.number().int().min(0).max(100).nullable().optional(),
  checkAnswers: z.record(z.string(), z.number()).nullable().optional(),
  source: z.string().max(120).optional(),
});

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => WaitlistInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("waitlist_signups").insert({
      name: data.name,
      email: data.email,
      check_score: data.checkScore ?? null,
      check_answers: data.checkAnswers ?? null,
      source: data.source ?? "landing",
    });

    if (error) {
      // Treat duplicate email as a soft-success so we don't leak who's on the list
      if (error.code === "23505") {
        return { ok: true, alreadyOnList: true as const };
      }
      console.error("[waitlist] insert failed", error);
      throw new Error("We couldn't save your sign-up. Please try again.");
    }

    return { ok: true, alreadyOnList: false as const };
  });
