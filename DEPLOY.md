# Deploying bruno-ai

The site is a **TanStack Start** (Nitro + Vite SSR) app. It needs a Node SSR
host. Recommended: **Vercel** (or Netlify).

## 1. Supabase

This app uses the existing Bruno Supabase project (`gwlstrqktsvumpbiwoqu`).
Apply the migrations in `supabase/migrations/` (the new one is
`20260608120000_blog_posts.sql`) via the Supabase dashboard SQL editor or the
Supabase CLI.

Then seed the blog with the original articles (one-time):

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... bun run scripts/seed-blog.ts
```

## 2. Environment variables (set in the host dashboard)

| Var | Scope | Notes |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | build | public |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | build | public anon key |
| `SUPABASE_URL` | runtime | server |
| `SUPABASE_PUBLISHABLE_KEY` | runtime | anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | runtime | **secret** — waitlist insert, blog reads, admin |
| `ADMIN_EMAILS` | runtime | comma-separated admin emails for `/admin/leads` |
| `NITRO_PRESET` | build | `vercel` on Vercel, `netlify` on Netlify |

## 3. Vercel

- Import the GitHub repo.
- Build command: `bun run build` (or `npm run build`). Install: `bun install`.
- Set `NITRO_PRESET=vercel` in the project env so Nitro emits the Vercel
  build output. (The Lovable Vite config defaults Nitro to Cloudflare.)
- Add all env vars above.
- Add the custom domain in Project → Settings → Domains and point DNS
  (A/CNAME as Vercel instructs) at the registrar (e.g. Hostinger).

## 4. Netlify (alternative)

- Set `NITRO_PRESET=netlify`, build command `bun run build`.
- Add the same env vars and custom domain.

## Admin access

`/admin/leads` requires a signed-in account whose email is in `ADMIN_EMAILS`.
Create your account through the normal `/auth` sign-up first.
