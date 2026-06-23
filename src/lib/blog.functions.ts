import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { mapRowToPost, type BlogPost, type BlogPostRow } from "./blog.types";

const POST_COLUMNS =
  "slug, title, seo_title, excerpt, description, category, reading_minutes, tldr, body, faq, related_slugs, published_at, created_at";

// List all published posts, newest first. Used by /blog and /sitemap.xml.
export const listPublishedPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ posts: BlogPost[] }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select(POST_COLUMNS)
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("[blog] list failed", error);
      throw new Error("Could not load articles.");
    }
    return { posts: (data ?? []).map((r) => mapRowToPost(r as BlogPostRow)) };
  },
);

// Fetch a single published post by slug. Returns null when not found.
export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }): Promise<{ post: BlogPost | null }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("blog_posts")
      .select(POST_COLUMNS)
      .eq("status", "published")
      .eq("slug", data.slug)
      .maybeSingle();

    if (error) {
      console.error("[blog] get failed", error);
      throw new Error("Could not load this article.");
    }
    return { post: row ? mapRowToPost(row as BlogPostRow) : null };
  });
