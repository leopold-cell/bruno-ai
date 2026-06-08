import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — Bruno" },
      { name: "description", content: "Terms of use for Bruno." },
      { property: "og:title", content: "Terms — Bruno" },
      { property: "og:description", content: "Terms of use for Bruno." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl flex-1 px-5 py-16 lg:px-8 lg:py-24">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Terms</h1>
        <div className="mt-8 space-y-5 text-pretty text-lg text-muted-foreground">
          <p>This page is a placeholder while we prepare our full terms of service.</p>
          <p>The short version: Bruno is a self-help tool, not a medical service. It does not diagnose, treat, or cure any condition. If you are in crisis, please contact a licensed professional. In the US: call or text 988.</p>
          <p>Questions? Email <a className="underline" href="mailto:hello@bruno.ai">hello@bruno.ai</a>.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
