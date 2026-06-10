# Deploying bruno-ai

This is a **TanStack Start** (Nitro SSR) app scaffolded by Lovable, which targets
**Cloudflare** natively. Recommended host: **Cloudflare Pages/Workers**. It needs
a Node/edge SSR runtime (the waitlist insert, blog reads, and admin viewer are
server functions).

## 1. Supabase (already done for the canonical project)

Backend lives on the Supabase project `ayvaceirodkskkloisep`:
- `blog_posts` table created + 6 starter articles seeded (`scripts/seed-blog.ts`).
- `waitlist_signups` table created.
The public `.env` here points at that project; the **secret** `service_role`
key is set only in the host env (never committed).

## 2. Environment variables (set in the host dashboard)

| Var | Scope | Notes |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | build | public |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | build | publishable key |
| `SUPABASE_URL` | runtime | server |
| `SUPABASE_PUBLISHABLE_KEY` | runtime | publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | runtime | **secret** — waitlist/blog/admin |
| `ADMIN_EMAILS` | runtime | comma-separated admin emails for `/admin/leads` |

## 3. Deploy to Cloudflare (recommended)

`vite.config.ts` forces `nitro: true` (the `cloudflare-module` preset), so the
build emits a Workers bundle at `dist/server/` + static assets at `dist/client/`.

**Option A — Cloudflare dashboard (Git):** Pages → connect the GitHub repo →
build command `bun run build`, then add the env vars and your custom domain.

**Option B — direct deploy (no GitHub needed):**
```bash
bun install && bun run build
CLOUDFLARE_API_TOKEN=... npx wrangler deploy   # from dist/ per nitro.json
```
This publishes to a `*.workers.dev` URL immediately; attach `brunomind.com`
afterwards (Workers → Custom Domains, or a CNAME from Hostinger DNS).

## 4. Vercel / Netlify (alternative)

Possible but not clean: the Lovable Vite wrapper force-redirects Nitro's output,
which breaks Vercel's `.vercel/output/functions` layout. If you must use Vercel,
set `nitro: { preset: "vercel" }` in `vite.config.ts` and expect to massage the
output dir. Cloudflare is the smoother path for this scaffold.

## Admin access

`/admin/leads` requires a signed-in account whose email is in `ADMIN_EMAILS`.
Sign up through `/auth` first (auth runs on the same Supabase project).
