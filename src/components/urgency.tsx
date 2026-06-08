import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const LAUNCH_DATE = new Date("2026-09-15T09:00:00Z").getTime();
const WAITLIST_START = new Date("2026-05-20T00:00:00Z").getTime();
const TOTAL_SPOTS = 1000;
const STARTING_CLAIMED = 412;
const PER_DAY = 9.4;

function computeClaimed(now: number) {
  const days = Math.max(0, (now - WAITLIST_START) / 86_400_000);
  const minuteDrift = Math.floor((now / 60_000) % 7) * 0.15;
  const claimed = Math.floor(STARTING_CLAIMED + days * PER_DAY + minuteDrift);
  return Math.min(TOTAL_SPOTS - 4, claimed);
}

function useNow(intervalMs = 1000) {
  // null on SSR + first client paint so hydration matches; live after mount.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function formatDelta(ms: number) {
  const clamped = Math.max(0, ms);
  return {
    d: Math.floor(clamped / 86_400_000),
    h: Math.floor((clamped % 86_400_000) / 3_600_000),
    m: Math.floor((clamped % 3_600_000) / 60_000),
    s: Math.floor((clamped % 60_000) / 1000),
  };
}

export function UrgencyTicker() {
  const now = useNow(1000);
  const ready = now !== null;
  const t = now ?? WAITLIST_START;
  const claimed = ready ? computeClaimed(t) : STARTING_CLAIMED;
  const remaining = TOTAL_SPOTS - claimed;
  const pct = (claimed / TOTAL_SPOTS) * 100;
  const { d, h, m, s } = formatDelta(LAUNCH_DATE - t);

  return (
    <section aria-label="Waitlist availability" className="border-y border-border bg-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-7 sm:py-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10 lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-clay" />
            </span>
            Live · founding spots
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span
              suppressHydrationWarning
              className="font-display text-3xl font-semibold tabular-nums text-cream sm:text-4xl"
              aria-live="polite"
            >
              {remaining.toLocaleString("en-US")}
            </span>
            <span className="text-sm text-cream/70">
              of {TOTAL_SPOTS.toLocaleString("en-US")} free-for-life spots left
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-cream/15">
            <div
              className="h-full rounded-full bg-clay transition-[width] duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p suppressHydrationWarning className="mt-2 text-xs text-cream/60">
            {claimed.toLocaleString("en-US")} people already in · roughly {Math.round(PER_DAY)} new joiners every day
          </p>
        </div>

        <div className="lg:border-l lg:border-cream/15 lg:pl-10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sage">
            Launching in
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2 sm:gap-3">
            {[
              { v: d, l: "days" },
              { v: h, l: "hrs" },
              { v: m, l: "min" },
              { v: s, l: "sec" },
            ].map((u) => (
              <div
                key={u.l}
                className="rounded-xl border border-cream/15 bg-cream/5 px-2 py-2 text-center sm:px-3 sm:py-3"
              >
                <div
                  suppressHydrationWarning
                  className="font-display text-2xl font-semibold tabular-nums text-cream sm:text-3xl"
                >
                  {ready ? String(u.v).padStart(2, "0") : "--"}
                </div>
                <div className="mt-0.5 text-[10px] uppercase tracking-widest text-cream/60">{u.l}</div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-cream/60">Sept 15, 2026 · iOS · Android · Web</p>
        </div>
      </div>
    </section>
  );
}

export function ScarcityBanner() {
  const now = useNow(5000);
  const claimed = now !== null ? computeClaimed(now) : STARTING_CLAIMED;
  const remaining = TOTAL_SPOTS - claimed;
  return (
    <div className="bg-clay/95 text-accent-foreground">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-5 py-2 text-center text-[13px] font-medium lg:px-8">
        <span className="inline-flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-foreground opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-foreground" />
          </span>
          Only <strong suppressHydrationWarning className="tabular-nums">{remaining.toLocaleString("en-US")}</strong> of 1,000 founding spots left —
        </span>
        <Link to="/" hash="check" className="underline underline-offset-2 hover:opacity-80">
          claim yours before they're gone
        </Link>
      </div>
    </div>
  );
}
