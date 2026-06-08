import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell, useRequireOnboarded } from "@/components/app-shell";
import { getMyProfile } from "@/lib/profile.functions";
import { listCheckins } from "@/lib/journal.functions";

export const Route = createFileRoute("/_authenticated/app/today")({
  head: () => ({ meta: [{ title: "Today — Bruno" }] }),
  component: TodayPage,
});

function TodayPage() {
  const fetchProfile = useServerFn(getMyProfile);
  const fetchCheckins = useServerFn(listCheckins);
  const profile = useQuery({ queryKey: ["me"], queryFn: () => fetchProfile() });
  const checkins = useQuery({ queryKey: ["checkins"], queryFn: () => fetchCheckins() });
  useRequireOnboarded(profile.data?.profile ?? null);

  const streak = computeStreak(checkins.data?.checkins ?? []);
  const todayDone = (checkins.data?.checkins ?? []).some(
    (c) => new Date(c.created_at).toDateString() === new Date().toDateString(),
  );

  const name = profile.data?.profile?.display_name ?? "friend";

  return (
    <AppShell region={profile.data?.profile?.crisis_region} title="Today">
      <div className="space-y-4 p-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Morning, {name}.</h1>
        </div>

        <Card>
          <p className="text-xs uppercase tracking-widest text-primary">Streak</p>
          <p className="mt-1 font-display text-4xl font-semibold text-ink">{streak} {streak === 1 ? "day" : "days"}</p>
          <p className="text-sm text-muted-foreground">of showing up for yourself</p>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary">Daily check-in</p>
              <p className="mt-1 font-display text-xl font-semibold text-ink">
                {todayDone ? "Done for today ✓" : "Take 30 seconds"}
              </p>
              <p className="text-sm text-muted-foreground">
                {todayDone ? "Come back tomorrow." : "Bruno uses this to know how to help."}
              </p>
            </div>
            {!todayDone && (
              <Link to="/app/check-in" className="self-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                Start
              </Link>
            )}
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-widest text-primary">Talk to Bruno</p>
          <p className="mt-1 text-sm text-muted-foreground">
            "What's bothering you right now?" — pick a thread, however small.
          </p>
          <Link to="/app/chat" className="mt-3 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-semibold text-background">
            Open chat
          </Link>
        </Card>
      </div>
    </AppShell>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">{children}</div>;
}

function computeStreak(items: { created_at: string }[]) {
  if (!items.length) return 0;
  const days = new Set(items.map((c) => new Date(c.created_at).toDateString()));
  let streak = 0;
  const d = new Date();
  while (days.has(d.toDateString())) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
