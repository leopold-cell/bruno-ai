import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { saveCheckin } from "@/lib/journal.functions";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/check-in")({
  head: () => ({ meta: [{ title: "Check-in — Bruno" }] }),
  component: CheckinPage,
});

const dims: Array<{ key: "mood" | "energy" | "anxiety" | "sleep"; label: string; low: string; high: string }> = [
  { key: "mood", label: "Mood", low: "Low", high: "Lifted" },
  { key: "energy", label: "Energy", low: "Empty", high: "Charged" },
  { key: "anxiety", label: "Anxiety", low: "Calm", high: "Wired" },
  { key: "sleep", label: "Sleep last night", low: "Rough", high: "Restored" },
];

function CheckinPage() {
  const navigate = useNavigate();
  const save = useServerFn(saveCheckin);
  const [scores, setScores] = useState({ mood: 5, energy: 5, anxiety: 5, sleep: 5 });
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      await save({ data: { ...scores, note: note || null } });
      toast.success("Saved");
      navigate({ to: "/app/today" });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell title="Check-in">
      <div className="space-y-6 p-4">
        <h1 className="font-display text-2xl font-semibold text-ink">How are you, really?</h1>
        {dims.map((d) => (
          <div key={d.key}>
            <div className="flex items-baseline justify-between">
              <Label>{d.label}</Label>
              <span className="font-display text-lg font-semibold text-primary tabular-nums">{scores[d.key]}</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={scores[d.key]}
              onChange={(e) => setScores({ ...scores, [d.key]: Number(e.target.value) })}
              className="mt-2 w-full accent-primary"
            />
            <div className="mt-1 flex justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
              <span>{d.low}</span>
              <span>{d.high}</span>
            </div>
          </div>
        ))}
        <div>
          <Label htmlFor="note">Anything else? (optional)</Label>
          <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="mt-1.5" />
        </div>
        <Button onClick={submit} disabled={loading} className="w-full">{loading ? "..." : "Save check-in"}</Button>
      </div>
    </AppShell>
  );
}
