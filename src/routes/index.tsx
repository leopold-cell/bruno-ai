import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { UrgencyTicker, ScarcityBanner } from "@/components/urgency";
import {
  Hero,
  PainPoints,
  WhyExplainer,
  HowToReduceAnxiety,
  HowItHelps,
  PrivacyTrust,
  WaitlistOffer,
  FoundingPerks,
  MerchShowcase,
  AppMockups,
  FAQ,
  MentalHealthCheck,
  FAQ_DATA,
} from "@/components/landing-sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bruno — A pocket CBT coach for anxiety, overthinking & low mood" },
      {
        name: "description",
        content:
          "Bruno is an AI coach trained in Cognitive Behavioral Therapy that helps you reduce anxiety, stop overthinking, and break low-mood cycles — 24/7, private, free for 6 months at launch.",
      },
      { property: "og:title", content: "Bruno — A pocket CBT coach for the moments therapy can't reach" },
      {
        property: "og:description",
        content:
          "Free 2-minute mental health check + 6 months free at launch. Built on Cognitive Behavioral Therapy. Private by design.",
      },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_DATA.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScarcityBanner />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <UrgencyTicker />
        <PainPoints />
        <WhyExplainer />
        <HowToReduceAnxiety />
        <HowItHelps />
        <PrivacyTrust />
        <section className="bg-cream py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">Free, 2 minutes</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-balance sm:text-5xl">
                Get a snapshot of where your mind is.
              </h2>
              <p className="mt-5 text-pretty text-lg text-muted-foreground">
                Eight short, gentle questions. A clear wellbeing snapshot. Three things Bruno would help you with first. Save it — and lock in your free six months — at the end.
              </p>
            </div>
            <MentalHealthCheck />
          </div>
        </section>
        <UrgencyTicker />
        <WaitlistOffer />
        <FoundingPerks />
        <MerchShowcase />
        <AppMockups />
        <FAQ />
      </main>
      <SiteFooter />
    </div>
  );
}
