import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, BrunoMark } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { abs } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Bruno — Why we're building a pocket CBT coach" },
      {
        name: "description",
        content:
          "Most people wait 11 years to get help. We're building Bruno to close that gap — a private, evidence-based coach for the moments therapy can't reach.",
      },
      { property: "og:title", content: "About Bruno" },
      { property: "og:description", content: "Why we're building a pocket CBT coach for the moments therapy can't reach." },
      { property: "og:url", content: abs("/about") },
    ],
    links: [{ rel: "canonical", href: abs("/about") }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-5 py-16 sm:py-24 lg:px-8">
          <BrunoMark className="h-10 w-10" />
          <h1 className="mt-6 font-display text-4xl font-semibold text-balance sm:text-6xl">
            We're building the coach we wished existed at 3am.
          </h1>
          <div className="prose prose-lg mt-10 max-w-none space-y-5 text-pretty text-lg text-muted-foreground">
            <p>
              The average person waits <strong className="text-foreground">eleven years</strong> between noticing a mental health struggle and getting help. Eleven years of telling yourself you're fine, of pushing it down, of trying to muscle through.
            </p>
            <p>
              That gap exists because therapy is expensive, has long waitlists, and asking for it still feels like admitting defeat. Meditation apps don't fill it — they're monologues, not conversations. Most people who need support don't feel "sick enough" to start.
            </p>
            <p>
              Bruno exists for the gap. A pocket coach you can talk to at 2am when your mind won't stop. Trained in Cognitive Behavioral Therapy — the most-studied, most-validated therapy on earth. Private by design. Honest about what it is and what it isn't.
            </p>
            <p>
              We're not trying to replace therapists. We're trying to make the eleven-year wait shorter, and the in-between moments less lonely.
            </p>
            <p>
              We're building this slowly, in public, with a small team that takes mental health seriously and skepticism about AI even more seriously. We'd rather ship something 500 people use every day than something 50,000 people install and forget.
            </p>
            <p>
              If that sounds like something you want to be part of —
            </p>
          </div>
          <Link
            to="/"
            hash="check"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Take the 2-min check
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
