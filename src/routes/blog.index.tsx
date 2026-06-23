import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { listPublishedPosts } from "@/lib/blog.functions";
import type { BlogPost } from "@/lib/blog.types";
import { abs } from "@/lib/site";

const CATEGORY_ORDER = ["Anxiety", "Sleep", "Depression", "CBT", "Self-check"];
const topicAnchor = (c: string) => "topic-" + c.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export const Route = createFileRoute("/blog/")({
  loader: async () => await listPublishedPosts(),
  head: () => ({
    meta: [
      { title: "The Bruno Journal — CBT, anxiety, depression, and the mind at 3am" },
      {
        name: "description",
        content:
          "Plain-English, evidence-based articles on how to reduce anxiety, stop overthinking, deal with depression, and rewire negative thinking using Cognitive Behavioral Therapy.",
      },
      { property: "og:title", content: "The Bruno Journal" },
      { property: "og:description", content: "CBT, anxiety, depression — written for the way your mind actually works." },
      { property: "og:url", content: abs("/blog") },
    ],
    links: [{ rel: "canonical", href: abs("/blog") }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { posts } = Route.useLoaderData();

  // Cluster posts by topic (category), in a sensible order.
  const byTopic = new Map<string, BlogPost[]>();
  for (const p of posts) {
    const arr = byTopic.get(p.category) ?? [];
    arr.push(p);
    byTopic.set(p.category, arr);
  }
  const clusters = [...byTopic.entries()].sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a[0]);
    const ib = CATEGORY_ORDER.indexOf(b[0]);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 [&>section:last-of-type]:border-b-0">
        <section className="border-b border-border bg-cream py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">The Bruno Journal</p>
            <h1 className="mt-3 font-display text-4xl font-semibold text-balance sm:text-6xl">
              For the mind at 3am.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
              Plain-English, evidence-based writing about anxiety, depression, overthinking, sleep, and the small tools — drawn from Cognitive Behavioral Therapy — that actually move the needle.
            </p>
            {/* Topic overview — jump to a cluster */}
            {clusters.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2">
                {clusters.map(([topic, items]) => (
                  <a
                    key={topic}
                    href={`#${topicAnchor(topic)}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-sage-deep transition hover:border-primary/40 hover:text-primary"
                  >
                    {topic}
                    <span className="rounded-full bg-mist px-1.5 text-xs tabular-nums text-muted-foreground">{items.length}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {posts.length === 0 && (
          <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
            <p className="text-muted-foreground">New articles are on the way. Check back soon.</p>
          </div>
        )}

        {clusters.map(([topic, items]) => (
          <section
            key={topic}
            id={topicAnchor(topic)}
            className="scroll-mt-24 border-b border-border py-12 sm:py-16"
          >
            <div className="mx-auto max-w-5xl px-5 lg:px-8">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{topic}</h2>
                <span className="shrink-0 text-sm text-muted-foreground">
                  {items.length} article{items.length === 1 ? "" : "s"}
                </span>
              </div>
              <ul className="mt-6 grid gap-6 sm:grid-cols-2">
                {items.map((post) => (
                  <li key={post.slug}>
                    <PostCard post={post} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </div>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group block h-full rounded-3xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-sm"
    >
      <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-sage-deep">
        <span>{post.category}</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{post.readingMinutes} min read</span>
      </div>
      <h3 className="mt-4 font-display text-2xl font-semibold text-balance text-ink group-hover:text-primary">
        {post.title}
      </h3>
      <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">{post.excerpt}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        Read article
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </span>
    </Link>
  );
}
