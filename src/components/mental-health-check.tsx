import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { joinWaitlist } from "@/lib/waitlist.functions";
import { z } from "zod";

type Option = { label: string; value: number };
type Question = {
  id: string;
  prompt: string;
  helper?: string;
  options: Option[];
};

const QUESTIONS: Question[] = [
  {
    id: "low_mood",
    prompt: "Over the past 2 weeks, how often have you felt down, low, or hopeless?",
    options: [
      { label: "Not at all", value: 0 },
      { label: "A few days", value: 1 },
      { label: "More than half the days", value: 2 },
      { label: "Nearly every day", value: 3 },
    ],
  },
  {
    id: "anhedonia",
    prompt: "Little interest or pleasure in doing things you used to enjoy?",
    options: [
      { label: "Not at all", value: 0 },
      { label: "A few days", value: 1 },
      { label: "More than half the days", value: 2 },
      { label: "Nearly every day", value: 3 },
    ],
  },
  {
    id: "anxious",
    prompt: "How often have you felt nervous, anxious, or on edge?",
    options: [
      { label: "Not at all", value: 0 },
      { label: "A few days", value: 1 },
      { label: "More than half the days", value: 2 },
      { label: "Nearly every day", value: 3 },
    ],
  },
  {
    id: "worry",
    prompt: "Not being able to stop or control worrying?",
    options: [
      { label: "Not at all", value: 0 },
      { label: "A few days", value: 1 },
      { label: "More than half the days", value: 2 },
      { label: "Nearly every day", value: 3 },
    ],
  },
  {
    id: "sleep",
    prompt: "How is your sleep right now?",
    options: [
      { label: "Mostly restorative", value: 0 },
      { label: "Inconsistent", value: 1 },
      { label: "Often poor", value: 2 },
      { label: "Rarely sleep well", value: 3 },
    ],
  },
  {
    id: "overthinking",
    prompt: "Does your mind race or replay things when you're trying to rest?",
    options: [
      { label: "Almost never", value: 0 },
      { label: "Sometimes", value: 1 },
      { label: "Most nights", value: 2 },
      { label: "Every night", value: 3 },
    ],
  },
  {
    id: "interference",
    prompt: "How much is this getting in the way of your daily life?",
    options: [
      { label: "Not at all", value: 0 },
      { label: "A little", value: 1 },
      { label: "Quite a bit", value: 2 },
      { label: "A lot", value: 3 },
    ],
  },
  {
    id: "support",
    prompt: "Do you have someone you can talk to honestly about how you feel?",
    options: [
      { label: "Yes, regularly", value: 0 },
      { label: "Sometimes", value: 1 },
      { label: "Rarely", value: 2 },
      { label: "Not really", value: 3 },
    ],
  },
];

type Phase = "intro" | "questions" | "result" | "form" | "done";

const FormSchema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(100),
  email: z.string().trim().toLowerCase().email("Please enter a valid email").max(255),
});

export function MentalHealthCheck() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [alreadyOnList, setAlreadyOnList] = useState(false);

  const submitWaitlist = useServerFn(joinWaitlist);

  const total = QUESTIONS.length;
  const totalScore = useMemo(
    () => Object.values(answers).reduce((a, b) => a + b, 0),
    [answers],
  );
  const maxScore = total * 3;
  const wellbeingScore = Math.max(0, Math.round(((maxScore - totalScore) / maxScore) * 100));

  const insights = useMemo(() => buildInsights(answers), [answers]);
  const band = wellbeingBand(wellbeingScore);

  function answer(value: number) {
    const q = QUESTIONS[step];
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      setPhase("result");
    }
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    const parsed = FormSchema.safeParse({ name, email });
    if (!parsed.success) {
      const fieldErrors: { name?: string; email?: string } = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as "name" | "email";
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const result = await submitWaitlist({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          checkScore: wellbeingScore,
          checkAnswers: answers,
          source: "landing-check",
        },
      });
      setAlreadyOnList(Boolean(result.alreadyOnList));
      setPhase("done");
    } catch (err) {
      console.error(err);
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div id="check" className="relative scroll-mt-24">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_2px_30px_-12px_rgba(40,60,50,0.18)] sm:p-10">
          {phase === "intro" && (
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">
                Free · 2 minutes · No diagnosis
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold text-balance sm:text-4xl">
                How is your mind, really?
              </h2>
              <p className="mt-4 text-pretty text-base text-muted-foreground">
                Eight short questions, inspired by the same short scales clinicians use (PHQ-2 &amp; GAD-2). You'll get a personal snapshot and three specific things Bruno would suggest for you.
              </p>
              <button
                type="button"
                onClick={() => setPhase("questions")}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                Start the check
                <ArrowRight />
              </button>
              <p className="mt-4 text-xs text-muted-foreground">
                Your answers stay on your device until you choose to save them.
              </p>
            </div>
          )}

          {phase === "questions" && (
            <div>
              <div className="mb-6 flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Question {step + 1} of {total}</span>
                <button onClick={back} disabled={step === 0} className="disabled:opacity-30">← Back</button>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-mist">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${((step + 1) / total) * 100}%` }}
                />
              </div>
              <h3 className="mt-8 font-display text-2xl font-semibold leading-snug text-balance sm:text-3xl">
                {QUESTIONS[step].prompt}
              </h3>
              {QUESTIONS[step].helper && (
                <p className="mt-2 text-sm text-muted-foreground">{QUESTIONS[step].helper}</p>
              )}
              <div className="mt-6 grid gap-2.5">
                {QUESTIONS[step].options.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => answer(opt.value)}
                    className="group flex items-center justify-between rounded-2xl border border-border bg-background px-5 py-4 text-left text-base font-medium text-foreground transition hover:border-primary hover:bg-mist"
                  >
                    <span>{opt.label}</span>
                    <span className="text-muted-foreground group-hover:text-primary">
                      <ArrowRight />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {phase === "result" && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">
                Your snapshot
              </p>
              <h3 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                {band.headline}
              </h3>
              <p className="mt-3 text-pretty text-muted-foreground">{band.body}</p>

              <div className="mt-6 flex items-end gap-3">
                <span className="font-display text-6xl font-semibold leading-none text-primary">
                  {wellbeingScore}
                </span>
                <span className="mb-1 text-sm text-muted-foreground">/ 100 wellbeing</span>
              </div>

              <div className="mt-8 rounded-2xl bg-mist p-5">
                <h4 className="font-display text-lg font-semibold text-ink">
                  What Bruno would help you with first
                </h4>
                <ul className="mt-3 space-y-2.5 text-sm">
                  {insights.map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span className="text-foreground">{i}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setPhase("form")}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                Save my snapshot &amp; join the waitlist
                <ArrowRight />
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                6 months free at launch · Lock in $2.99/mo forever (vs. $5.99)
              </p>
            </div>
          )}

          {phase === "form" && (
            <form onSubmit={onSubmit} noValidate>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">
                One last step
              </p>
              <h3 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                Save your snapshot &amp; claim your 6 free months
              </h3>
              <p className="mt-3 text-muted-foreground">
                We'll email you when Bruno launches in September 2026, plus the occasional behind-the-scenes update and free merch drop.
              </p>

              <div className="mt-6 grid gap-4">
                <Field
                  label="Your first name"
                  id="name"
                  value={name}
                  onChange={setName}
                  error={errors.name}
                  autoComplete="given-name"
                  placeholder="e.g. Alex"
                />
                <Field
                  label="Email"
                  id="email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  error={errors.email}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </div>

              {serverError && (
                <p className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? "Saving…" : "Join the waitlist"}
                {!submitting && <ArrowRight />}
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                We'll never sell your data. Unsubscribe in one click.
              </p>
            </form>
          )}

          {phase === "done" && (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h3 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">
                {alreadyOnList ? "You're already with us." : "You're in."}
              </h3>
              <p className="mt-3 text-pretty text-muted-foreground">
                {alreadyOnList
                  ? "Looks like this email is already on the waitlist. Keep an eye on your inbox — we'll be in touch soon."
                  : "Welcome aboard. We just saved your snapshot. Check your inbox over the next few weeks — we'll share progress, behind-the-scenes updates, and free merch drops as we build."}
              </p>
              <div className="mt-8 rounded-2xl border border-border bg-mist p-5 text-left">
                <h4 className="font-display text-base font-semibold">While you wait, try one thing today</h4>
                <p className="mt-2 text-sm text-foreground">
                  {firstSuggestion(answers)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  placeholder,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function wellbeingBand(score: number) {
  if (score >= 80) {
    return {
      headline: "You're doing well right now.",
      body: "Most signs point to a steady baseline. Bruno can help you protect it — and catch small dips before they grow.",
    };
  }
  if (score >= 60) {
    return {
      headline: "Some weight you might not be naming.",
      body: "There's a pattern of mild stress or low mood showing up. This is where small daily practices make the biggest difference.",
    };
  }
  if (score >= 40) {
    return {
      headline: "It sounds like you're carrying a lot.",
      body: "Several signs of meaningful struggle. You're not weak — your nervous system is working overtime. The right tools can take the edge off quickly.",
    };
  }
  return {
    headline: "Please be gentle with yourself today.",
    body: "Your answers suggest things are heavy right now. Bruno can help, and so can a human. If anything you're feeling worries you, please reach out to a clinician or call/text 988 (US).",
  };
}

function buildInsights(a: Record<string, number>): string[] {
  const out: string[] = [];
  if ((a.anxious ?? 0) + (a.worry ?? 0) >= 3) {
    out.push("Quick anxiety resets: 60-second breathwork and grounding when your chest tightens.");
  }
  if ((a.sleep ?? 0) + (a.overthinking ?? 0) >= 3) {
    out.push("A 4-step wind-down protocol so your mind stops racing at night.");
  }
  if ((a.low_mood ?? 0) + (a.anhedonia ?? 0) >= 3) {
    out.push("Behavioral activation: the smallest possible daily steps that pull you out of a low patch.");
  }
  if ((a.interference ?? 0) >= 2) {
    out.push("A weekly check-in to spot patterns before they take over the rest of your week.");
  }
  if ((a.support ?? 0) >= 2) {
    out.push("A judgment-free place to talk through what you can't say out loud yet.");
  }
  if (out.length === 0) {
    out.push("Daily 2-minute check-ins to keep your baseline steady.");
    out.push("Journaling prompts when something feels off and you can't name why.");
    out.push("CBT-based habit nudges so the good days compound.");
  }
  return out.slice(0, 3);
}

function firstSuggestion(a: Record<string, number>): string {
  if ((a.anxious ?? 0) >= 2 || (a.worry ?? 0) >= 2) {
    return "Try box breathing for 60 seconds: in 4, hold 4, out 4, hold 4. It tells your nervous system the threat has passed.";
  }
  if ((a.sleep ?? 0) >= 2 || (a.overthinking ?? 0) >= 2) {
    return "Tonight, do a 5-minute worry dump on paper before brushing your teeth. Empty every open loop. Don't solve them — just park them.";
  }
  if ((a.low_mood ?? 0) >= 2 || (a.anhedonia ?? 0) >= 2) {
    return "Pick one absurdly small good-for-you thing and do it today. A 5-minute walk. One glass of water. One text to someone who likes you. Action comes before motivation, not after.";
  }
  return "Take 60 seconds: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. A reset for the moments your mind starts to drift.";
}
