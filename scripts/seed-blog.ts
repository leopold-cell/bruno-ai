/**
 * One-time seed: copies the original static blog posts into the Supabase
 * `blog_posts` table as PUBLISHED rows. Safe to re-run (upserts by slug).
 *
 * Run with:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... bun run scripts/seed-blog.ts
 */
import { createClient } from "@supabase/supabase-js";
import { blogPosts } from "../src/content/blog-posts";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const rows = blogPosts.map((p) => ({
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  description: p.description,
  category: p.category,
  reading_minutes: p.readingMinutes,
  tldr: p.tldr,
  body: p.body,
  status: "published" as const,
  source: "seed",
  published_at: new Date(p.publishedAt).toISOString(),
}));

const { error, count } = await supabase
  .from("blog_posts")
  .upsert(rows, { onConflict: "slug", count: "exact" });

if (error) {
  console.error("Seed failed:", error);
  process.exit(1);
}
console.log(`Seeded ${count ?? rows.length} blog posts.`);
