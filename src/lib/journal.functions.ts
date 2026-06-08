import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SaveJournal = z.object({
  title: z.string().trim().max(200).optional().nullable(),
  body: z.string().trim().min(1).max(20000),
  tags: z.array(z.string().trim().min(1).max(40)).max(10).default([]),
});

export const saveJournalEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => SaveJournal.parse(data))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("journal_entries").insert({
      user_id: context.userId,
      title: data.title ?? null,
      body: data.body,
      tags: data.tags,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listJournalEntries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("journal_entries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { entries: data ?? [] };
  });

const SaveCheckin = z.object({
  mood: z.number().int().min(0).max(10),
  energy: z.number().int().min(0).max(10),
  anxiety: z.number().int().min(0).max(10),
  sleep: z.number().int().min(0).max(10),
  note: z.string().trim().max(2000).optional().nullable(),
});

export const saveCheckin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => SaveCheckin.parse(data))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("checkins").insert({
      user_id: context.userId,
      ...data,
      note: data.note ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listCheckins = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("checkins")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(60);
    if (error) throw new Error(error.message);
    return { checkins: data ?? [] };
  });

const SaveThoughtRecord = z.object({
  situation: z.string().trim().min(1).max(2000),
  automatic_thought: z.string().trim().min(1).max(2000),
  emotion: z.string().trim().max(80).optional().nullable(),
  emotion_intensity: z.number().int().min(0).max(100).optional().nullable(),
  distortions: z.array(z.string().trim().min(1).max(60)).max(15).default([]),
  reframe: z.string().trim().max(2000).optional().nullable(),
  outcome: z.string().trim().max(2000).optional().nullable(),
});

export const saveThoughtRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => SaveThoughtRecord.parse(data))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("thought_records").insert({
      user_id: context.userId,
      ...data,
      emotion: data.emotion ?? null,
      emotion_intensity: data.emotion_intensity ?? null,
      reframe: data.reframe ?? null,
      outcome: data.outcome ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listThoughtRecords = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("thought_records")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return { records: data ?? [] };
  });
