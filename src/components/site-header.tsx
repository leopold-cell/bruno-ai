import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/blog", label: "Articles" },
  { to: "/about", label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5" aria-label="Bruno — home">
          <BrunoMark className="h-8 w-8" />
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            bruno
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
          {signedIn ? (
            <Link
              to="/app/chat"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              Open app
            </Link>
          ) : (
            <>
              <Link to="/auth" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Sign in
              </Link>
              <Link
                to="/"
                hash="check"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                Join the waitlist
              </Link>
            </>
          )}
        </nav>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {open ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            {signedIn ? (
              <Link
                to="/app/chat"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-base font-semibold text-primary-foreground"
              >
                Open app
              </Link>
            ) : (
              <>
                <Link to="/auth" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-muted">
                  Sign in
                </Link>
                <Link
                  to="/"
                  hash="check"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-base font-semibold text-primary-foreground"
                >
                  Join the waitlist
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export function BrunoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="bruno-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="oklch(0.42 0.06 160)" />
          <stop offset="1" stopColor="oklch(0.74 0.085 50)" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill="url(#bruno-mark)" />
      {/* Stylized "b" / sound wave hybrid */}
      <path
        d="M13 12v16M13 20c0-3 2-5 5-5s5 2 5 5-2 5-5 5"
        stroke="oklch(0.985 0.012 95)"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="28.5" cy="20" r="1.4" fill="oklch(0.985 0.012 95)" />
    </svg>
  );
}
