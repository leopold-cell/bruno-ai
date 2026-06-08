import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { MessageCircle, Sun, ClipboardCheck, Wrench, Settings, BookHeart, PhoneCall } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BrunoMark } from "@/components/site-header";
import { getHotlines } from "@/lib/hotlines";

const tabs = [
  { to: "/app/chat", label: "Chat", Icon: MessageCircle },
  { to: "/app/today", label: "Today", Icon: Sun },
  { to: "/app/check-in", label: "Check-in", Icon: ClipboardCheck },
  { to: "/app/journal", label: "Journal", Icon: BookHeart },
  { to: "/app/tools", label: "Tools", Icon: Wrench },
] as const;

export function AppShell({
  children,
  region,
  title,
}: {
  children: ReactNode;
  region?: string | null;
  title?: string;
}) {
  const loc = useLocation();
  const navigate = useNavigate();
  const [crisisOpen, setCrisisOpen] = useState(false);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/app/chat" className="flex items-center gap-2">
            <BrunoMark className="h-7 w-7" />
            <span className="font-display text-base font-semibold text-ink">{title ?? "Bruno"}</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCrisisOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border border-clay/40 bg-clay/10 px-3 py-1.5 text-xs font-medium text-clay-foreground hover:bg-clay/20"
            >
              <PhoneCall className="h-3.5 w-3.5" /> In crisis?
            </button>
            <Link to="/app/settings" className="rounded-full p-2 hover:bg-muted" aria-label="Settings">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </Link>
          </div>
        </div>
        {crisisOpen && <CrisisCard region={region} onClose={() => setCrisisOpen(false)} />}
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col">{children}</main>

      <nav className="sticky bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-stretch justify-between px-1 py-1 pb-[max(env(safe-area-inset-bottom),0.25rem)]">
          {tabs.map(({ to, label, Icon }) => {
            const active = loc.pathname === to || (to === "/app/chat" && loc.pathname === "/app");
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-[11px] font-medium ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "stroke-[2.2]" : ""}`} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function CrisisCard({ region, onClose }: { region?: string | null; onClose: () => void }) {
  const h = getHotlines(region);
  return (
    <div className="border-t border-clay/30 bg-clay/10">
      <div className="mx-auto max-w-3xl px-4 py-3 text-sm">
        <p className="font-medium text-ink">
          If you're in danger or thinking of self-harm, please reach out to a human right now.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{h.label}</p>
        <ul className="mt-2 space-y-1">
          {h.lines.map((l) => (
            <li key={l.name} className="flex items-baseline justify-between gap-3">
              <span>{l.name}</span>
              <span className="font-semibold tabular-nums">{l.number}</span>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="mt-2 text-xs text-muted-foreground underline">
          Close
        </button>
      </div>
    </div>
  );
}

export async function signOutAndLeave(navigate: ReturnType<typeof useNavigate>) {
  await supabase.auth.signOut();
  navigate({ to: "/auth", replace: true });
}

export function useRequireOnboarded(profile: { onboarding_done?: boolean } | null | undefined) {
  const navigate = useNavigate();
  const loc = useLocation();
  useEffect(() => {
    if (!profile) return;
    if (!profile.onboarding_done && !loc.pathname.startsWith("/app/onboarding")) {
      navigate({ to: "/app/onboarding", replace: true });
    }
  }, [profile, loc.pathname, navigate]);
}
