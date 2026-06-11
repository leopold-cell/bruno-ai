import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — Bruno" },
      { name: "description", content: "How Bruno handles your data. Plain English. Short." },
      { property: "og:title", content: "Privacy — Bruno" },
      { property: "og:description", content: "How Bruno handles your data." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl flex-1 px-5 py-16 lg:px-8 lg:py-24">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Privacy</h1>
        <div className="mt-8 space-y-5 text-pretty text-lg text-muted-foreground">
          <p>This page is a placeholder while we prepare our full privacy policy. Here's the short version we'll keep:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Your conversations and journal entries are encrypted.</li>
            <li>We never sell your data — not to advertisers, not to anyone.</li>
            <li>We never use your private conversations to train third-party AI models.</li>
            <li>You can export or delete everything you've ever shared with one tap.</li>
          </ul>
          <p>Questions? Email <a className="underline" href="mailto:hi@brunomind.com">hi@brunomind.com</a>.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
