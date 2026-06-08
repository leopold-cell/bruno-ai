import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { saveThoughtRecord } from "@/lib/journal.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Wind, Sparkles, FileText } from "lucide-react";

export function BreathingTool({ pattern }: { pattern: "4-7-8" | "box" | "physiological-sigh" }) {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<"in" | "hold" | "out" | "hold2">("in");
  const [count, setCount] = useState(0);
  const [cycle, setCycle] = useState(0);

  const sequence =
    pattern === "box"
      ? [
          { phase: "in" as const, secs: 4, label: "Breathe in" },
          { phase: "hold" as const, secs: 4, label: "Hold" },
          { phase: "out" as const, secs: 4, label: "Breathe out" },
          { phase: "hold2" as const, secs: 4, label: "Hold" },
        ]
      : pattern === "physiological-sigh"
      ? [
          { phase: "in" as const, secs: 2, label: "Breathe in" },
          { phase: "hold" as const, secs: 1, label: "Top up" },
          { phase: "out" as const, secs: 6, label: "Long breathe out" },
        ]
      : [
          { phase: "in" as const, secs: 4, label: "Breathe in" },
          { phase: "hold" as const, secs: 7, label: "Hold" },
          { phase: "out" as const, secs: 8, label: "Breathe out" },
        ];

  useEffect(() => {
    if (!running) return;
    const step = sequence[count % sequence.length];
    setPhase(step.phase);
    const t = setTimeout(() => {
      const next = count + 1;
      setCount(next);
      if (next % sequence.length === 0) setCycle((c) => c + 1);
    }, step.secs * 1000);
    return () => clearTimeout(t);
  }, [running, count]);

  if (cycle >= 4) {
    return (
      <ToolCard icon={<Wind className="h-4 w-4" />} title="Breathing — done">
        <p className="text-sm text-muted-foreground">Nice. Notice how your body feels now compared to a minute ago.</p>
      </ToolCard>
    );
  }

  const step = sequence[count % sequence.length];
  return (
    <ToolCard icon={<Wind className="h-4 w-4" />} title={`${pattern} breathing`}>
      <div className="flex flex-col items-center py-4">
        <div
          className={`flex h-32 w-32 items-center justify-center rounded-full bg-primary/15 text-primary transition-transform duration-[1000ms] ${
            phase === "in" ? "scale-100" : phase === "out" ? "scale-75" : "scale-90"
          }`}
        >
          <span className="font-display text-xl font-semibold">{running ? step.label : "Ready"}</span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Cycle {cycle + 1} of 4</p>
        {!running && <Button size="sm" className="mt-3" onClick={() => setRunning(true)}>Start</Button>}
      </div>
    </ToolCard>
  );
}

export function GroundingTool() {
  const steps = [
    { n: 5, sense: "things you can see" },
    { n: 4, sense: "things you can feel" },
    { n: 3, sense: "things you can hear" },
    { n: 2, sense: "things you can smell" },
    { n: 1, sense: "thing you can taste" },
  ];
  const [i, setI] = useState(0);
  if (i >= steps.length)
    return (
      <ToolCard icon={<Sparkles className="h-4 w-4" />} title="Grounded">
        <p className="text-sm text-muted-foreground">You're here. Right now, in this moment.</p>
      </ToolCard>
    );
  const s = steps[i];
  return (
    <ToolCard icon={<Sparkles className="h-4 w-4" />} title="5-4-3-2-1 grounding">
      <p className="text-base">
        Name <span className="font-semibold text-primary">{s.n}</span> {s.sense}.
      </p>
      <Button size="sm" className="mt-3" onClick={() => setI(i + 1)}>
        Done — next
      </Button>
    </ToolCard>
  );
}

export function ThoughtRecordTool({ prefill }: { prefill?: { situation?: string; automatic_thought?: string } }) {
  const save = useServerFn(saveThoughtRecord);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    situation: prefill?.situation ?? "",
    automatic_thought: prefill?.automatic_thought ?? "",
    emotion: "",
    distortions: [] as string[],
    reframe: "",
  });
  const distortionList = [
    "Catastrophizing",
    "All-or-nothing",
    "Mind reading",
    "Should statements",
    "Personalization",
    "Filtering",
    "Emotional reasoning",
  ];

  if (done)
    return (
      <ToolCard icon={<FileText className="h-4 w-4" />} title="Saved to your thought records">
        <p className="text-sm text-muted-foreground">Open it any time in Tools → Thought records.</p>
      </ToolCard>
    );

  async function submit() {
    try {
      await save({ data: form });
      toast.success("Saved");
      setDone(true);
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  return (
    <ToolCard icon={<FileText className="h-4 w-4" />} title="Thought record">
      <div className="space-y-3">
        <div>
          <Label className="text-xs">Situation</Label>
          <Textarea rows={2} value={form.situation} onChange={(e) => setForm({ ...form, situation: e.target.value })} />
        </div>
        <div>
          <Label className="text-xs">Automatic thought</Label>
          <Textarea rows={2} value={form.automatic_thought} onChange={(e) => setForm({ ...form, automatic_thought: e.target.value })} />
        </div>
        <div>
          <Label className="text-xs">Emotion</Label>
          <Input value={form.emotion} onChange={(e) => setForm({ ...form, emotion: e.target.value })} placeholder="anxious, sad, angry…" />
        </div>
        <div>
          <Label className="text-xs">Distortions (tap any that fit)</Label>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {distortionList.map((d) => {
              const on = form.distortions.includes(d);
              return (
                <button
                  type="button"
                  key={d}
                  onClick={() =>
                    setForm({
                      ...form,
                      distortions: on ? form.distortions.filter((x) => x !== d) : [...form.distortions, d],
                    })
                  }
                  className={`rounded-full border px-2.5 py-1 text-xs ${
                    on ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <Label className="text-xs">Balanced reframe</Label>
          <Textarea rows={2} value={form.reframe} onChange={(e) => setForm({ ...form, reframe: e.target.value })} />
        </div>
        <Button size="sm" onClick={submit} disabled={!form.situation || !form.automatic_thought}>
          Save
        </Button>
      </div>
    </ToolCard>
  );
}

function ToolCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="my-2 rounded-2xl border border-border bg-background p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}
