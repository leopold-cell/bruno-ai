import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { listPublishedPosts } from "@/lib/blog.functions";

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
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { posts } = Route.useLoaderData();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-cream py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">The Bruno Journal</p>
            <h1 className="mt-3 font-display text-4xl font-semibold text-balance sm:text-6xl">
              For the mind at 3am.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
              Plain-English, evidence-based writing about anxiety, depression, overthinking, sleep, and the small tools — drawn from Cognitive Behavioral Therapy — that actually move the needle.
            </p>
          </div>
        </section>
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            {posts.length === 0 && (
              <p className="text-muted-foreground">New articles are on the way. Check back soon.</p>
            )}
            <ul className="grid gap-6 sm:grid-cols-2">
              {posts.map((post) => (
                <li key={post.slug}>
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
                    <h2 className="mt-4 font-display text-2xl font-semibold text-balance text-ink group-hover:text-primary">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      Read article
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
