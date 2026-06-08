import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { BreathingTool, GroundingTool, ThoughtRecordTool } from "@/components/tools-inline";

type ToolId = "breathing-478" | "breathing-box" | "physiological-sigh" | "grounding" | "thought-record" | null;

export const Route = createFileRoute("/_authenticated/app/tools")({
  head: () => ({ meta: [{ title: "Tools — Bruno" }] }),
  component: ToolsPage,
});

const items: Array<{ id: ToolId; title: string; desc: string }> = [
  { id: "breathing-478", title: "4-7-8 breathing", desc: "Slow your nervous system in under 2 minutes." },
  { id: "breathing-box", title: "Box breathing", desc: "Even rhythm for focus and grounding." },
  { id: "physiological-sigh", title: "Physiological sigh", desc: "The fastest reset known to science." },
  { id: "grounding", title: "5-4-3-2-1 grounding", desc: "Land back in your body when you spiral." },
  { id: "thought-record", title: "Thought record", desc: "Catch and reframe an automatic thought." },
];

function ToolsPage() {
  const [active, setActive] = useState<ToolId>(null);
  return (
    <AppShell title="Tools">
      <div className="space-y-4 p-4">
        <h1 className="font-display text-2xl font-semibold text-ink">Tools</h1>
        {!active && (
          <div className="grid gap-3">
            {items.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className="rounded-2xl border border-border bg-background p-4 text-left shadow-sm transition hover:border-primary/40"
              >
                <p className="font-display text-lg font-semibold text-ink">{t.title}</p>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
              </button>
            ))}
          </div>
        )}
        {active && (
          <div>
            <button onClick={() => setActive(null)} className="mb-3 text-sm text-muted-foreground underline">← All tools</button>
            {active === "breathing-478" && <BreathingTool pattern="4-7-8" />}
            {active === "breathing-box" && <BreathingTool pattern="box" />}
            {active === "physiological-sigh" && <BreathingTool pattern="physiological-sigh" />}
            {active === "grounding" && <GroundingTool />}
            {active === "thought-record" && <ThoughtRecordTool />}
          </div>
        )}
      </div>
    </AppShell>
  );
}
