-- Blog posts: dynamic, Supabase-backed blog so the Bruno autopilot can publish
-- articles without redeploying the site. The website reads only PUBLISHED rows;
-- the autopilot inserts/updates rows using the service-role key (bypasses RLS).

-- Shared updated_at trigger helper (created here so this migration is
-- self-contained on projects where the earlier app-schema migration never ran).
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  reading_minutes INTEGER NOT NULL DEFAULT 5,
  tldr JSONB NOT NULL DEFAULT '[]'::jsonb,      -- string[]
  body JSONB NOT NULL DEFAULT '[]'::jsonb,      -- BlogBlock[] (see src/lib/blog.types.ts)
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  source TEXT,                                  -- 'seed' | 'autopilot' | 'manual'
  keyword TEXT,                                 -- the target keyword that drove the article
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX blog_posts_published_idx
  ON public.blog_posts (published_at DESC)
  WHERE status = 'published';
CREATE INDEX blog_posts_status_idx ON public.blog_posts (status);

CREATE TRIGGER trg_blog_posts_updated BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Public can read ONLY published posts; service_role manages everything.
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts are public"
  ON public.blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');
