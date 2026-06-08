# Bruno MVP — Web App Plan

A waitlist-gated, mobile-first web app where Bruno (CBT-trained AI coach) chats 24/7, runs structured exercises, remembers the user, sends routine reminders, and routes crisis moments to local hotlines. The landing page stays as-is and gains a "Sign in" entry point.

## 1. Auth & access (waitlist-gated)

- Email + password (Lovable Cloud) + Google sign-in.
- `/auth` page with sign-in / sign-up tabs and password reset.
- Sign-up flow:
  1. Check email against `waitlist_signups`.
  2. If not on the list → friendly "Join the waitlist first" screen with the landing form inline.
  3. If on the list → create account, mark `waitlist_signups.activated_at`, create `profiles` row.
- Protected app lives under `src/routes/_authenticated/` (integration-managed gate).
- Landing page keeps its FOMO ticker; header gets "Sign in" / "Open app".

## 2. Data model (Lovable Cloud)

New tables, all RLS-scoped to `auth.uid()`:

- `profiles` — display_name, timezone, locale, onboarding_done, crisis_region, push_enabled.
- `conversations` — one per user is enough for MVP, but schema supports many (id, user_id, title, last_message_at).
- `messages` — UIMessage rows (id uuid, conversation_id, role, parts jsonb, created_at). AI SDK msg-id stored in `client_msg_id text`.
- `memories` — durable facts Bruno extracts ("prefers breathing over journaling", "exam Nov 14"). Fields: user_id, kind (`fact|goal|trigger|preference`), content, embedding (pgvector), created_at, last_used_at. Top-K recalled per turn.
- `checkins` — daily mood/energy/anxiety/sleep (0–10) + free note.
- `journal_entries` — title, body, tags, created_at.
- `thought_records` — situation, automatic_thought, emotion, distortions[], reframe, outcome (classic CBT template).
- `routines` — name, time_of_day, days_of_week[], kind (`breathing|gratitude|checkin|custom`), enabled.
- `routine_runs` — completion log for streaks.
- `push_subscriptions` — Web Push endpoint, p256dh, auth, user_agent.
- `safety_events` — message_id, severity, region, hotline_shown, created_at (for follow-up).

Extend `waitlist_signups` with `activated_at timestamptz`.

## 3. App surface (mobile-first, bottom tab bar)

Routes under `_authenticated/`:

- `/app/chat` — Bruno chat (default home).
- `/app/today` — Today screen: streak, today's check-in card, next routine, last reframe.
- `/app/check-in` — Daily check-in flow (same 8-q vibe as landing, shorter).
- `/app/journal` — List + new entry; tag filter.
- `/app/tools` — Library: Thought Record, 4-7-8 Breathing, 5-4-3-2-1 Grounding, Sleep Wind-down, Worry Postponement.
- `/app/routines` — Configure reminders, enable push.
- `/app/settings` — Profile, timezone, region (for hotlines), data export, sign out.

## 4. Bruno chat (CBT coach with tools + memory)

Built with AI SDK on TanStack server route `src/routes/api/chat.ts`, model `google/gemini-3-flash-preview`, AI Elements on the client.

System prompt: CBT-trained, warm, second-person, never diagnoses, suggests tools proactively, uses user memory.

Tools Bruno can call (each renders as a card in chat):
- `start_thought_record` — opens the CBT thought-record form, result saved to `thought_records`.
- `start_breathing(pattern)` — interactive 4-7-8 / box-breathing widget.
- `start_grounding` — 5-4-3-2-1 senses prompt.
- `log_checkin(scores)` — quick mood log.
- `save_memory(kind, content)` — write durable fact to `memories`.
- `recall_memory(query)` — vector search over `memories` (auto-injected each turn, also callable).
- `set_routine(name, time, days, kind)` — creates/updates a routine.
- `crisis_resources(region)` — returns hotlines for the user's region.

Memory pipeline: every turn, the server fn embeds the latest user message, pulls top-5 memories, and prepends them to the system prompt. After assistant response, a lightweight extractor call decides whether to persist a new memory. "Never forgets user inputs" = persistent thread + memory store.

Single ongoing conversation per user (one row in `conversations`); messages persisted via `toUIMessageStreamResponse({ originalMessages, onFinish })`.

## 5. Routine reminders (push notifications)

Web Push (VAPID) — works in installable PWA on Android/desktop; iOS supports it when the user adds the site to home screen (iOS 16.4+).
- Service worker `public/sw.js` (kept narrow — push + notification click only; no app-shell caching, to stay safe in Lovable preview).
- `manifest.webmanifest` + icons so the site is installable.
- Server fn `subscribeToPush` stores subscription.
- pg_cron job (every minute) hits `/api/public/cron/send-routine-pushes` which:
  - Finds routines due in the user's timezone within the last minute and not yet sent today.
  - Sends Web Push via `web-push` library with VAPID keys.
- Notification click deep-links into `/app/check-in`, `/app/tools/breathing`, etc.

Requires two secrets (asked once): `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` (we can generate and pre-fill).

## 6. Safety layer (crisis detection + region-aware hotlines)

- Every user message runs through a fast classifier call (Gemini Flash Lite, structured output: `{severity: none|low|high|imminent, themes: [...]}`).
- `high` → Bruno's response is interrupted with a calm safety card: grounding line + region hotlines (US 988, UK 116 123, DE 0800 111 0 111, EU 116 123 fallback) + "Talk to a human now" button.
- `imminent` → safety card only, no normal chat reply; logged to `safety_events`.
- User's region taken from `profiles.crisis_region` (asked at onboarding, defaults via `Intl` locale).
- Static "In crisis? Tap here" link always visible in chat header.

## 7. Onboarding (first sign-in)

3 short screens:
1. Name + timezone (auto-detected) + region for hotlines.
2. "What brings you to Bruno?" multi-select → seeds initial `memories`.
3. Enable push reminders + pick one starter routine (morning check-in OR evening wind-down).

Then drop into chat with Bruno's first message referencing what they shared.

## 8. Landing page changes

- Header gains `Sign in` (and `Open app` if session exists).
- Waitlist confirmation screen tells users they'll get an invite email when their spot opens; for MVP testing, anyone on the list can sign up immediately.
- Fix the existing SSR hydration mismatch in `UrgencyTicker`/`ScarcityBanner` by rendering the live numbers only after mount (initial render shows a stable placeholder).

## 9. Out of scope for this build (call out explicitly)

- Stripe / billing (founding-member pricing) — separate pass.
- Native iOS/Android wrap (Capacitor) — separate pass.
- Welcome / transactional emails — separate pass (needs Resend or Lovable Email domain).
- Admin dashboard for `safety_events` follow-up — manual DB review for now.

## Technical section

- **Stack**: existing TanStack Start + Lovable Cloud (Supabase) + Tailwind. AI via Lovable AI Gateway (no key needed).
- **AI SDK**: `ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`. AI Elements (`conversation`, `message`, `prompt-input`, `tool`, `shimmer`) installed via `bunx ai-elements@latest add ...`.
- **Embeddings**: `google/gemini-embedding-001` via gateway; pgvector extension enabled on `memories.embedding vector(768)`.
- **Server boundaries**:
  - `src/routes/api/chat.ts` — streaming chat (POST), uses `requireSupabaseAuth`, calls memory recall + classifier + `streamText` with tools, persists in `onFinish`.
  - `src/lib/*.functions.ts` — `joinWaitlist` (existing), `signUpFromWaitlist`, `getMe`, `saveCheckin`, `saveJournal`, `saveThoughtRecord`, `upsertRoutine`, `subscribeToPush`, `getHotlines(region)`.
  - `src/routes/api/public/cron/send-routine-pushes.ts` — signed cron endpoint; uses `supabaseAdmin` + `web-push`.
- **Auth gate**: integration-managed `_authenticated/route.tsx`. `attachSupabaseAuth` already wired in `src/start.ts` (verify).
- **PWA**: minimal manifest + icons + push-only service worker. No Workbox / offline shell to keep preview safe.
- **RLS**: every new table — `auth.uid() = user_id` for SELECT/INSERT/UPDATE/DELETE; `service_role` granted for cron + admin paths; no `anon` grants.
- **Validation**: Zod on every server fn and route handler.
- **Secrets to request**: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` (I'll generate, you confirm). `LOVABLE_API_KEY` already present.
- **Models**: chat = `google/gemini-3-flash-preview`; classifier = `google/gemini-3.1-flash-lite-preview`; embeddings = `google/gemini-embedding-001`.
- **Build order** (one PR per step so you can review):
  1. Schema migration (profiles, conversations, messages, memories+pgvector, checkins, journal, thought_records, routines, routine_runs, push_subs, safety_events, waitlist.activated_at) + RLS + GRANTs.
  2. Auth pages + waitlist-gated sign-up + onboarding + `_authenticated` shell with bottom tab bar.
  3. Chat route + AI Elements UI + memory recall/save + tool cards (thought record, breathing, grounding).
  4. Today / Check-in / Journal / Tools / Routines / Settings screens.
  5. Push subscriptions + service worker + cron endpoint + VAPID secrets.
  6. Safety classifier + hotline card + `safety_events` logging + region setting.
  7. Landing page: Sign-in entry, hydration fix on urgency widgets.

Realistic size: ~7 focused build steps. I'll ship them in order and check in after each so you can test.
