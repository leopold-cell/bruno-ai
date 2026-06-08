import { Link } from "@tanstack/react-router";
import { MentalHealthCheck } from "./mental-health-check";
import { BrunoMark } from "./site-header";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grain opacity-60" />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-12 pt-10 sm:pt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:px-8 lg:pb-24 lg:pt-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-sage-deep">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Only 1,000 founding-member spots — going fast
          </div>
          <h1 className="mt-5 font-display text-[2.5rem] font-semibold leading-[1.05] tracking-tight text-balance text-ink sm:text-6xl lg:text-[4.25rem]">
            If your mind won't shut up tonight — read this before you open another tab.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground sm:text-xl">
            You already know what you want: the noise to stop, your chest to loosen, sleep that actually comes. You've tried the breathing videos, the journals, the &ldquo;just don't think about it.&rdquo; None of it talks back at 2:47am. Bruno does — with the exact protocol therapists use to break the loop, one tap away, for the next six months free.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/"
              hash="check"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              Take the 2-min check
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
            <a
              href="#how-it-helps"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-4 text-base font-semibold text-foreground transition hover:bg-mist"
            >
              See how it works
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Dot /> The same CBT therapists charge $200/hr for</li>
            <li className="flex items-center gap-2"><Dot /> Private. Encrypted. Yours.</li>
            <li className="flex items-center gap-2"><Dot /> Not a chatbot. Not a meditation app.</li>
          </ul>

        </div>
        <div className="relative mx-auto w-full max-w-sm">
          <PhoneMockupChat />
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-sage" />;
}

export function PhoneMockupChat() {
  return (
    <div className="relative">
      <div className="absolute -inset-10 -z-10 rounded-[60px] bg-gradient-to-br from-sage/40 via-cream to-clay/30 blur-2xl" />
      <div className="relative rounded-[42px] border border-border bg-ink p-2 shadow-[0_30px_60px_-30px_rgba(40,60,50,0.45)]">
        <div className="relative overflow-hidden rounded-[34px] bg-cream">
          <div className="flex items-center justify-between px-5 pt-4 text-[10px] font-semibold text-ink/60">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><rect x="0" y="6" width="2" height="4" rx="0.5"/><rect x="3.5" y="4" width="2" height="6" rx="0.5"/><rect x="7" y="2" width="2" height="8" rx="0.5"/><rect x="10.5" y="0" width="2" height="10" rx="0.5"/></svg>
            </span>
          </div>
          <div className="flex items-center gap-2 border-b border-border/60 px-5 py-3">
            <BrunoMark className="h-7 w-7" />
            <div>
              <p className="text-sm font-semibold text-ink">Bruno</p>
              <p className="text-[10px] text-sage-deep">Here whenever you need</p>
            </div>
          </div>
          <div className="space-y-3 px-4 py-5">
            <ChatBubble who="bruno">
              Hey. You said you'd had a rough day. Want to talk about it, or would a quick reset feel better right now?
            </ChatBubble>
            <ChatBubble who="me">
              i can't stop replaying that meeting. i sounded like an idiot.
            </ChatBubble>
            <ChatBubble who="bruno">
              That's your brain doing something called "labeling" — turning one moment into your whole identity. Let's slow it down. What's one piece of evidence it actually went badly?
            </ChatBubble>
            <ChatBubble who="me" pending />
          </div>
          <div className="border-t border-border/60 px-4 py-3">
            <div className="flex items-center gap-2 rounded-full bg-background px-3 py-2 text-xs text-muted-foreground">
              <span>Type a thought…</span>
              <span className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">↑</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ who, children, pending }: { who: "bruno" | "me"; children?: React.ReactNode; pending?: boolean }) {
  if (who === "bruno") {
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-mist px-3.5 py-2.5 text-[13px] leading-relaxed text-ink">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-primary px-3.5 py-2.5 text-[13px] leading-relaxed text-primary-foreground">
        {pending ? (
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-foreground/70" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-foreground/70 [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-foreground/70 [animation-delay:240ms]" />
          </span>
        ) : children}
      </div>
    </div>
  );
}

export function PainPoints() {
  const pains = [
    "It's 2:47am. You're rehearsing a conversation from 2019 like it's tomorrow's job interview.",
    "Sunday afternoon hits and your stomach drops — for no reason you can name out loud.",
    "You're exhausted by 9pm. In bed by 10. Eyes wide open at 1.",
    "Everyone says you're \u201Cdoing great.\u201D You haven't told anyone you cried in the car again.",
    "You've downloaded six meditation apps. None of them said anything back. None of them were there at 3am.",
    "Therapy is $200 an hour, a three-month waitlist, and a stranger you have to get vulnerable with on Zoom.",
  ];
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">You didn't make this up</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-balance sm:text-5xl">
          You came here because something inside you already knows.
        </h2>
        <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
          You don't need another article telling you to drink water and go for a walk. You need someone to read this list back to you and say: yes, that's real, and yes, there's a way out — and here's the first step you take tonight.
        </p>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {pains.map((p) => (
            <li key={p} className="flex gap-3 rounded-2xl border border-border bg-card p-5 text-base text-foreground">
              <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mist text-sage-deep">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
              <span className="text-pretty">{p}</span>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-pretty text-lg text-muted-foreground">
          None of this means you're broken. It means your nervous system is doing exactly what it was built to do under modern load. The good news: there's a 60-year-old, 2,000-study toolkit for catching it in the act. Below — and inside Bruno — is how you actually use it.
        </p>
      </div>
    </section>
  );
}

export function WhyExplainer() {
  return (
    <section id="why" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">Why your mind does this</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-balance sm:text-5xl">
            The loop is real. And it's breakable.
          </h2>
          <p className="mt-6 text-pretty text-lg text-muted-foreground">
            A thought shows up. It triggers a feeling. The feeling drives a behavior — usually avoidance, scrolling, snapping, or shutting down. The behavior then "confirms" the original thought. Around and around it goes.
          </p>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Cognitive Behavioral Therapy — the most-researched approach to anxiety, depression, insomnia, and rumination — is essentially a toolkit for catching the loop in the act and choosing a different next step. That's what Bruno walks you through, in plain English, in the moments it actually matters.
          </p>
        </div>
        <div className="relative">
          <LoopDiagram />
        </div>
      </div>
    </section>
  );
}

function LoopDiagram() {
  const nodes = [
    { label: "Thought", desc: "\"I'm going to fail this.\"", angle: -90 },
    { label: "Feeling", desc: "Tight chest. Dread.", angle: 30 },
    { label: "Behavior", desc: "Avoid. Scroll. Numb out.", angle: 150 },
  ];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md rounded-3xl border border-border bg-card p-6">
      <div className="absolute inset-6 rounded-full border-2 border-dashed border-sage/60" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="font-display text-2xl font-semibold text-ink">The loop</p>
        <p className="mt-1 text-xs text-muted-foreground">Catch it. Name it. Break it.</p>
      </div>
      {nodes.map((n) => {
        const r = 40;
        const rad = (n.angle * Math.PI) / 180;
        const x = 50 + r * Math.cos(rad);
        const y = 50 + r * Math.sin(rad);
        return (
          <div
            key={n.label}
            style={{ left: `${x}%`, top: `${y}%` }}
            className="absolute w-36 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-3 text-center shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-sage-deep">{n.label}</p>
            <p className="mt-1 text-sm text-foreground">{n.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

export function HowToReduceAnxiety() {
  const techniques = [
    {
      title: "Box breathing",
      time: "60 sec",
      body: "Inhale 4. Hold 4. Exhale 4. Hold 4. Tells your nervous system the threat has passed. Used by Navy SEALs before high-stakes moments.",
    },
    {
      title: "Name the distortion",
      time: "30 sec",
      body: "When your brain says \"I'll definitely fail,\" say (in your head): \"that's catastrophizing.\" Naming it creates a gap between you and the thought.",
    },
    {
      title: "5-4-3-2-1 grounding",
      time: "90 sec",
      body: "5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. Pulls your brain out of the imagined future and back into the actual present.",
    },
  ];
  return (
    <section className="bg-mist py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">Free, right now</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-balance sm:text-5xl">
          How to reduce anxiety in 5 minutes
        </h2>
        <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
          You don't need an app to try these. Use them the next time your chest tightens. (Then — if you'd like a coach who'll walk you through them in the moment — that's what Bruno is for.)
        </p>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {techniques.map((t, i) => (
            <div key={t.title} className="relative rounded-3xl border border-border bg-card p-6">
              <span className="font-display text-5xl font-semibold text-sage opacity-60">{i + 1}</span>
              <div className="mt-2 flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold">{t.title}</h3>
                <span className="rounded-full bg-mist px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-sage-deep">
                  {t.time}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItHelps() {
  const items = [
    {
      title: "Talk it out, any time",
      body: "3am spiral. 4pm slump. Sunday-night dread. A trained, judgment-free coach is one tap away.",
      icon: ClockIcon,
    },
    {
      title: "Real CBT, not pep talks",
      body: "Bruno guides you through the same techniques licensed therapists use — thought records, behavioral activation, cognitive restructuring, exposure ladders.",
      icon: BookIcon,
    },
    {
      title: "Mood check-ins that stick",
      body: "Two taps a day. Bruno spots the patterns you can't see from the inside — bad sleep on Thursdays, low moods after certain people.",
      icon: PulseIcon,
    },
    {
      title: "Journaling without staring at a blank page",
      body: "Smart prompts based on how you've been feeling. The hardest part of journaling is starting. We make starting easy.",
      icon: PenIcon,
    },
    {
      title: "Gentle nudges, never guilt",
      body: "If you miss a day, Bruno doesn't shame you. Shame is what got you here. We're playing the long game.",
      icon: HeartIcon,
    },
    {
      title: "Private by design",
      body: "Your conversations are encrypted. You can delete everything with one tap. Your thoughts stay yours.",
      icon: LockIcon,
    },
  ];
  return (
    <section id="how-it-helps" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">Meet Bruno</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold text-balance sm:text-5xl">
          A pocket CBT coach for the moments therapy can't reach.
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map(({ title, body, icon: Icon }) => (
            <div key={title} className="group rounded-3xl border border-border bg-card p-6 transition hover:border-primary/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mist text-sage-deep">
                <Icon />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClockIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function BookIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>; }
function PulseIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>; }
function PenIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>; }
function HeartIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function LockIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }

export function WaitlistOffer() {
  return (
    <section className="bg-ink py-20 text-cream sm:py-28">
      <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">The last 1,000 spots — then this offer is gone</p>
        <h2 className="mt-3 font-display text-4xl font-semibold text-balance sm:text-6xl">
          Six months. Free. Then $2.99 for life — while everyone else pays double.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-cream/70">
          You've spent more than this on a coffee you didn't finish. For 1,000 people, Bruno is free for the first six months at launch — then $2.99/month for life, locked in, instead of the $5.99 everyone else will pay. Once the counter hits zero, the door closes. We're not running a launch sale next year. We'd rather have a thousand people who actually use this than a hundred thousand who don't.
        </p>
        <div className="mx-auto mt-10 grid max-w-2xl gap-4 text-left sm:grid-cols-2">
          {[
            { k: "6", v: "months completely free" },
            { k: "$2.99", v: "/month after, locked in" },
            { k: "iOS · Android · Web", v: "use it wherever you are" },
            { k: "Sept 15–20, 2026", v: "we ship to you" },
          ].map((b) => (
            <div key={b.v} className="rounded-2xl border border-cream/15 bg-cream/5 p-5">
              <p className="font-display text-3xl font-semibold text-cream">{b.k}</p>
              <p className="mt-1 text-sm text-cream/70">{b.v}</p>
            </div>
          ))}
        </div>
        <Link
          to="/"
          hash="check"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-clay px-7 py-4 text-base font-semibold text-accent-foreground shadow-sm transition hover:opacity-90"
        >
          Claim your spot
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </Link>
      </div>
    </section>
  );
}

export function FoundingPerks() {
  const perks = [
    { title: "Behind-the-scenes", body: "Monthly notes from the team — what we're building, what we're getting wrong, what's coming next." },
    { title: "Early access", body: "New features land in your hands before anyone else's. Your feedback shapes what we ship." },
    { title: "Free merch drops", body: "Every month, a few founding members get a piece of Bruno merch in the mail. On the house." },
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">More than a free trial</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold text-balance sm:text-5xl">
          You're not joining a waitlist. You're joining the build.
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {perks.map((p) => (
            <div key={p.title} className="rounded-3xl border border-border bg-cream p-6">
              <h3 className="font-display text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MerchShowcase() {
  const items: { name: string; tag: string; mockup: React.ReactNode; bg: string }[] = [
    { name: "\"Mind Reset\" oversized hoodie", tag: "Apparel", bg: "bg-mist", mockup: <HoodieMockup /> },
    { name: "Breathing-pattern enamel pin", tag: "Accessory", bg: "bg-cream", mockup: <PinMockup /> },
    { name: "\"You are not your thoughts\" tote", tag: "Carry", bg: "bg-mist", mockup: <ToteMockup /> },
    { name: "Guided CBT journal", tag: "Paper", bg: "bg-cream", mockup: <JournalMockup /> },
    { name: "Calming sticker pack", tag: "Stickers", bg: "bg-mist", mockup: <StickersMockup /> },
  ];
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">Free merch drops</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold text-balance sm:text-5xl">
          Quiet, considered objects to carry the work into the rest of your day.
        </h2>
        <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
          Every month we send a few founding members a piece of Bruno merch — designed to look like something you'd actually wear or use, not therapy-app swag.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={item.name}
              className={`group relative overflow-hidden rounded-3xl border border-border ${item.bg} p-6 ${i === 0 ? "sm:col-span-2 sm:row-span-1" : ""}`}
            >
              <div className="aspect-[4/3] w-full">{item.mockup}</div>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-sage-deep">{item.tag}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold">{item.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HoodieMockup() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <defs>
        <linearGradient id="hood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.42 0.06 160)" />
          <stop offset="1" stopColor="oklch(0.32 0.05 160)" />
        </linearGradient>
      </defs>
      <path d="M120 80 Q160 50 200 50 Q240 50 280 80 L320 110 L300 230 Q300 260 270 260 L130 260 Q100 260 100 230 L80 110 Z" fill="url(#hood)" />
      <path d="M160 70 Q200 95 240 70 L240 100 Q200 120 160 100 Z" fill="oklch(0.28 0.04 160)" />
      <text x="200" y="180" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="28" fontWeight="600" fill="oklch(0.985 0.012 95)">mind reset</text>
      <line x1="180" y1="195" x2="220" y2="195" stroke="oklch(0.74 0.085 50)" strokeWidth="2" />
    </svg>
  );
}
function PinMockup() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <circle cx="200" cy="150" r="90" fill="oklch(0.74 0.085 50)" />
      <circle cx="200" cy="150" r="90" fill="none" stroke="oklch(0.55 0.07 35)" strokeWidth="3" />
      <g stroke="oklch(0.985 0.012 95)" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M140 150 Q170 110 200 150 Q230 190 260 150" />
        <path d="M140 165 Q170 130 200 165 Q230 200 260 165" opacity="0.55" />
      </g>
      <text x="200" y="225" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" letterSpacing="3" fill="oklch(0.985 0.012 95)">BREATHE</text>
    </svg>
  );
}
function ToteMockup() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <path d="M120 90 Q120 60 160 60 Q200 60 200 90" fill="none" stroke="oklch(0.22 0.022 155)" strokeWidth="4" />
      <path d="M200 90 Q200 60 240 60 Q280 60 280 90" fill="none" stroke="oklch(0.22 0.022 155)" strokeWidth="4" />
      <rect x="110" y="90" width="180" height="180" rx="6" fill="oklch(0.97 0.018 90)" stroke="oklch(0.22 0.022 155)" strokeWidth="2" />
      <text x="200" y="175" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="18" fontStyle="italic" fontWeight="500" fill="oklch(0.22 0.022 155)">you are not</text>
      <text x="200" y="200" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="18" fontStyle="italic" fontWeight="500" fill="oklch(0.22 0.022 155)">your thoughts</text>
    </svg>
  );
}
function JournalMockup() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <rect x="110" y="40" width="180" height="230" rx="4" fill="oklch(0.42 0.06 160)" />
      <rect x="118" y="48" width="164" height="214" rx="2" fill="oklch(0.985 0.012 95)" />
      <text x="200" y="110" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="22" fontWeight="600" fill="oklch(0.22 0.022 155)">today</text>
      <g stroke="oklch(0.78 0.045 155)" strokeWidth="1">
        <line x1="140" y1="140" x2="260" y2="140" />
        <line x1="140" y1="160" x2="260" y2="160" />
        <line x1="140" y1="180" x2="260" y2="180" />
        <line x1="140" y1="200" x2="240" y2="200" />
      </g>
      <text x="200" y="240" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" letterSpacing="3" fontWeight="600" fill="oklch(0.42 0.06 160)">A CBT JOURNAL · BRUNO</text>
    </svg>
  );
}
function StickersMockup() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <g>
        <circle cx="120" cy="120" r="55" fill="oklch(0.74 0.085 50)" />
        <text x="120" y="125" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="14" fontWeight="600" fill="oklch(0.985 0.012 95)">breathe</text>
      </g>
      <g transform="rotate(-8 240 110)">
        <rect x="200" y="80" width="120" height="60" rx="10" fill="oklch(0.42 0.06 160)" />
        <text x="260" y="115" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" letterSpacing="2" fill="oklch(0.985 0.012 95)">YOU'RE FINE</text>
      </g>
      <g transform="rotate(10 180 220)">
        <rect x="130" y="195" width="120" height="50" rx="25" fill="oklch(0.97 0.018 90)" stroke="oklch(0.22 0.022 155)" strokeWidth="2" />
        <text x="190" y="225" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="13" fontStyle="italic" fill="oklch(0.22 0.022 155)">be here now</text>
      </g>
      <g transform="rotate(-3 310 215)">
        <circle cx="310" cy="215" r="40" fill="oklch(0.78 0.045 155)" />
        <text x="310" y="220" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="22">🌿</text>
      </g>
    </svg>
  );
}

export function AppMockups() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">Inside the app</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold text-balance sm:text-5xl">
          Small surfaces. Built for the moment you actually need them.
        </h2>
        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <AppScreen title="Talk it out" body="A coach who's read every CBT manual, waiting in your pocket."><PhoneScreenChat /></AppScreen>
          <AppScreen title="Reframe a thought" body="Walk through a thought record in 4 guided steps."><PhoneScreenReframe /></AppScreen>
          <AppScreen title="Daily check-in" body="Two taps. Bruno notices patterns you can't."><PhoneScreenCheckin /></AppScreen>
          <AppScreen title="Build the streak" body="Tiny daily wins compound into a steadier baseline."><PhoneScreenStreak /></AppScreen>
        </div>
      </div>
    </section>
  );
}

function AppScreen({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mx-auto w-full max-w-[200px]">
        <div className="relative rounded-[28px] border border-border bg-ink p-1.5 shadow-[0_20px_40px_-20px_rgba(40,60,50,0.45)]">
          <div className="aspect-[9/19] overflow-hidden rounded-[22px] bg-cream">{children}</div>
        </div>
      </div>
      <h3 className="mt-5 text-center font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-center text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function PhoneScreenChat() {
  return (
    <div className="flex h-full flex-col p-3">
      <div className="text-[7px] font-semibold text-ink/40">Bruno</div>
      <div className="mt-2 space-y-1.5">
        <div className="max-w-[85%] rounded-lg rounded-tl bg-mist px-2 py-1.5 text-[8px] text-ink">How's your chest right now?</div>
        <div className="ml-auto max-w-[85%] rounded-lg rounded-tr bg-primary px-2 py-1.5 text-[8px] text-primary-foreground">still tight</div>
        <div className="max-w-[85%] rounded-lg rounded-tl bg-mist px-2 py-1.5 text-[8px] text-ink">Let's slow that down together. 60-second breathing exercise?</div>
      </div>
    </div>
  );
}
function PhoneScreenReframe() {
  return (
    <div className="flex h-full flex-col p-3">
      <div className="text-[7px] font-semibold uppercase tracking-wider text-sage-deep">Step 2 of 4</div>
      <p className="mt-2 font-display text-[11px] font-semibold leading-tight text-ink">What's the thought?</p>
      <div className="mt-2 rounded-lg bg-mist p-2 text-[8px] italic leading-tight text-ink">
        "I sounded like an idiot in that meeting."
      </div>
      <p className="mt-3 text-[8px] font-semibold text-sage-deep">Likely distortion</p>
      <div className="mt-1 rounded-md bg-clay/15 px-2 py-1 text-[7px] font-medium text-ink">Labeling</div>
      <div className="mt-auto flex justify-between">
        <div className="rounded-full bg-mist px-2 py-1 text-[7px]">Back</div>
        <div className="rounded-full bg-primary px-2 py-1 text-[7px] text-primary-foreground">Next →</div>
      </div>
    </div>
  );
}
function PhoneScreenCheckin() {
  return (
    <div className="flex h-full flex-col p-3">
      <p className="font-display text-[11px] font-semibold leading-tight text-ink">How are you, really?</p>
      <div className="mt-3 grid grid-cols-5 gap-1">
        {["😞","🙁","😐","🙂","😄"].map((e, i) => (
          <div key={e} className={`flex aspect-square items-center justify-center rounded-lg ${i === 2 ? "bg-primary text-primary-foreground" : "bg-mist"} text-[10px]`}>{e}</div>
        ))}
      </div>
      <p className="mt-3 text-[7px] font-semibold uppercase text-sage-deep">Last 7 days</p>
      <div className="mt-1 flex h-12 items-end gap-1">
        {[3,2,4,3,2,3,3].map((h,i) => (
          <div key={i} className="flex-1 rounded-sm bg-sage" style={{height: `${h*20}%`}} />
        ))}
      </div>
      <p className="mt-2 text-[7px] text-muted-foreground">Your Mondays are heaviest. Want to plan for it?</p>
    </div>
  );
}
function PhoneScreenStreak() {
  return (
    <div className="flex h-full flex-col p-3">
      <p className="text-[7px] font-semibold uppercase tracking-wider text-sage-deep">Your streak</p>
      <p className="mt-1 font-display text-3xl font-semibold leading-none text-primary">14</p>
      <p className="text-[8px] text-muted-foreground">days in a row</p>
      <div className="mt-3 grid grid-cols-7 gap-1">
        {Array.from({length: 21}).map((_,i) => (
          <div key={i} className={`aspect-square rounded-sm ${i < 14 ? "bg-primary" : "bg-mist"}`} />
        ))}
      </div>
      <div className="mt-auto rounded-lg bg-mist p-2 text-[8px] text-ink">
        <p className="font-semibold">Today</p>
        <p>2-min breathing reset</p>
      </div>
    </div>
  );
}

export function FAQ() {
  const items = [
    {
      q: "Is Bruno actual therapy?",
      a: "No. Bruno is a self-help coach trained in CBT techniques — it's a powerful complement to therapy, but it's not a replacement for a licensed clinician. If you're in crisis or your symptoms are severe, please see a professional. In the US, you can call or text 988 for free, 24/7 support.",
    },
    {
      q: "Is my data private?",
      a: "Yes. Your conversations are encrypted, never sold, and never used to train third-party AI models. You can export or delete everything you've ever shared with one tap, no questions asked.",
    },
    {
      q: "When does it launch and where?",
      a: "September 15–20, 2026, on iOS, Android, and the web. Waitlist members get access first.",
    },
    {
      q: "What happens after the free 6 months?",
      a: "Founding members lock in $2.99/month forever — about a fifth the price of one therapy session, per year. The regular launch price will be $5.99/month. You can cancel any time.",
    },
    {
      q: "Will it work for me if I'm not in crisis — just kind of stuck?",
      a: "That's exactly who Bruno is built for. The vast majority of people we talked to during research weren't in acute crisis. They were just tired, anxious, overthinking, and didn't feel \"sick enough\" to start therapy. Bruno meets you there.",
    },
    {
      q: "What if I'm in crisis right now?",
      a: "Please reach out to a human. In the US: call or text 988 (Suicide and Crisis Lifeline). In the UK: Samaritans on 116 123. Outside those: opencounseling.com lists free hotlines worldwide.",
    },
  ];
  return (
    <section className="bg-mist py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage-deep">Questions</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-balance sm:text-5xl">
          The honest answers
        </h2>
        <div className="mt-10 divide-y divide-border rounded-3xl border border-border bg-card">
          {items.map((it, i) => (
            <details key={i} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-display text-lg font-semibold text-ink">
                <span>{it.q}</span>
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mist text-sage-deep transition group-open:rotate-45">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </span>
              </summary>
              <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export const FAQ_DATA = [
  { q: "Is Bruno actual therapy?", a: "No. Bruno is a self-help coach trained in CBT techniques — it's a powerful complement to therapy but not a replacement for a licensed clinician." },
  { q: "Is my data private?", a: "Yes. Conversations are encrypted, never sold, and never used to train third-party AI models." },
  { q: "When does it launch and where?", a: "September 15–20, 2026, on iOS, Android, and the web." },
  { q: "What happens after the free 6 months?", a: "Founding members lock in $2.99/month forever, instead of the regular $5.99." },
];

export { MentalHealthCheck };
