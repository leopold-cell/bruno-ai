import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getPostBySlug, listPublishedPosts } from "@/lib/blog.functions";
import type { BlogPost as BlogPostType } from "@/lib/blog.types";
import { abs } from "@/lib/site";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const [{ post }, { posts }] = await Promise.all([
      getPostBySlug({ data: { slug: params.slug } }),
      listPublishedPosts(),
    ]);
    if (!post) throw notFound();
    // Prefer the brief's chosen siblings; fall back to recent posts.
    const bySlug = new Map(posts.map((p) => [p.slug, p]));
    const chosen = (post.relatedSlugs ?? [])
      .map((s) => bySlug.get(s))
      .filter((p): p is NonNullable<typeof p> => !!p && p.slug !== post.slug);
    const related = (
      chosen.length ? chosen : posts.filter((p) => p.slug !== post.slug)
    ).slice(0, 3);
    return { post, related };
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    if (!post) {
      return {
        meta: [{ title: "Article not found — Bruno" }],
      };
    }
    const url = abs(`/blog/${params.slug}`);
    const scripts = [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          datePublished: post.publishedAt,
          author: { "@type": "Organization", name: "Bruno" },
          publisher: { "@type": "Organization", name: "Bruno" },
          articleSection: post.category,
          mainEntityOfPage: url,
        }),
      },
    ];
    if ((post.faq?.length ?? 0) > 0) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: (post.faq ?? []).map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      });
    }
    return {
      meta: [
        { title: `${post.seoTitle || post.title} | Bruno` },
        { name: "description", content: post.description },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: post.publishedAt },
        { property: "article:section", content: post.category },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts,
    };
  },
  notFoundComponent: PostNotFound,
  errorComponent: PostError,
  component: BlogPost,
});

function BlogPost() {
  const { post, related } = Route.useLoaderData() as { post: BlogPostType; related: BlogPostType[] };
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <article className="mx-auto max-w-2xl px-5 py-16 lg:px-8 lg:py-24">
          <Link to="/blog" className="text-sm font-medium text-sage-deep hover:text-foreground">
            ← All articles
          </Link>
          <div className="mt-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-deep">
            <span>{post.category}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{post.readingMinutes} min read</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] text-balance text-ink sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-pretty text-xl leading-relaxed text-muted-foreground">{post.excerpt}</p>

          <div className="mt-10 rounded-2xl border border-border bg-mist p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sage-deep">The short version</p>
            <ul className="mt-3 space-y-2 text-[15px] text-foreground">
              {post.tldr.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 space-y-6 text-lg leading-relaxed text-foreground">
            {post.body.map((block, i) => {
              if (block.type === "h2") return <h2 key={i} className="mt-10 font-display text-3xl font-semibold text-balance text-ink">{block.text}</h2>;
              if (block.type === "p") return <p key={i} className="text-pretty">{block.text}</p>;
              if (block.type === "ul") return (
                <ul key={i} className="list-disc space-y-2 pl-6 marker:text-sage">
                  {block.items.map((it, j) => <li key={j} className="text-pretty">{it}</li>)}
                </ul>
              );
              if (block.type === "ol") return (
                <ol key={i} className="list-decimal space-y-2 pl-6 marker:font-semibold marker:text-sage-deep">
                  {block.items.map((it, j) => <li key={j} className="text-pretty">{it}</li>)}
                </ol>
              );
              if (block.type === "quote") return (
                <blockquote key={i} className="border-l-4 border-clay pl-5 font-display text-2xl italic text-ink">
                  "{block.text}"
                </blockquote>
              );
              return null;
            })}
          </div>

          {(post.faq?.length ?? 0) > 0 && (
            <section className="mt-14">
              <h2 className="font-display text-3xl font-semibold text-ink">Frequently asked questions</h2>
              <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border">
                {(post.faq ?? []).map((f, i) => (
                  <div key={i} className="p-5">
                    <h3 className="font-display text-lg font-semibold text-ink">{f.q}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="mt-16 rounded-3xl border border-border bg-cream p-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">Try it for yourself</p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-balance sm:text-3xl">
              Take a free 2-minute mental health check.
            </h3>
            <p className="mt-3 text-pretty text-muted-foreground">
              No diagnosis. No login to start. Just a clear snapshot — and three personalized next steps.
            </p>
            <Link
              to="/"
              hash="check"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Start the check
            </Link>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h3 className="font-display text-xl font-semibold">Keep reading</h3>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: r.slug }}
                      className="group block rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sage-deep">{r.category}</p>
                      <p className="mt-2 font-display text-lg font-semibold text-balance group-hover:text-primary">
                        {r.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

function PostNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto flex max-w-xl flex-1 flex-col justify-center px-5 py-20 text-center">
        <h1 className="font-display text-4xl font-semibold">Article not found</h1>
        <p className="mt-3 text-muted-foreground">We couldn't find that article. It may have moved.</p>
        <Link to="/blog" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
          Back to all articles
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function PostError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto flex max-w-xl flex-1 flex-col justify-center px-5 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Something went wrong loading this article.</h1>
        <button onClick={reset} className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
          Try again
        </button>
      </main>
      <SiteFooter />
    </div>
  );
}
