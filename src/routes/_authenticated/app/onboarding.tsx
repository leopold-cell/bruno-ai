import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile, markWaitlistActivated } from "@/lib/profile.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { REGION_OPTIONS } from "@/lib/hotlines";
import { BrunoMark } from "@/components/site-header";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/onboarding")({
  head: () => ({ meta: [{ title: "Welcome — Bruno" }] }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchProfile = useServerFn(getMyProfile);
  const update = useServerFn(updateMyProfile);
  const activate = useServerFn(markWaitlistActivated);

  const me = useQuery({ queryKey: ["me"], queryFn: () => fetchProfile() });

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [region, setRegion] = useState("US");
  const [tz, setTz] = useState("UTC");

  useEffect(() => {
    if (me.data?.profile?.onboarding_done) navigate({ to: "/app/chat", replace: true });
    if (me.data?.profile) {
      setName(me.data.profile.display_name ?? "");
      const guessTz = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC";
      setTz(me.data.profile.timezone === "UTC" ? guessTz : me.data.profile.timezone);
      const guessRegion = guessTz.startsWith("Europe/") ? (guessTz.includes("Berlin") || guessTz.includes("Vienna") || guessTz.includes("Zurich") ? "DE" : "EU") : guessTz.includes("London") ? "UK" : guessTz.includes("Australia") ? "AU" : guessTz.includes("Toronto") || guessTz.includes("Vancouver") ? "CA" : "US";
      setRegion(me.data.profile.crisis_region === "US" ? guessRegion : me.data.profile.crisis_region);
    }
  }, [me.data, navigate]);

  async function finish() {
    try {
      await update({ data: { display_name: name.trim() || "you", crisis_region: region, timezone: tz, onboarding_done: true } });
      activate({}).catch(() => {});
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success(`Nice to meet you, ${name || "friend"}.`);
      navigate({ to: "/app/chat", replace: true });
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream">
      <header className="border-b border-border/60 bg-background/80">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-5 py-4">
          <BrunoMark className="h-7 w-7" />
          <span className="font-display text-lg font-semibold text-ink">bruno</span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-md flex-1 px-5 py-10">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Step {step + 1} of 2</p>

        {step === 0 && (
          <div>
            <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Let's get you settled.</h1>
            <p className="mt-2 text-sm text-muted-foreground">A couple of small things so I can help properly.</p>
            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="n">What should I call you?</Label>
                <Input id="n" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="tz">Timezone</Label>
                <Input id="tz" value={tz} onChange={(e) => setTz(e.target.value)} className="mt-1.5" />
                <p className="mt-1 text-xs text-muted-foreground">Used for daily check-ins.</p>
              </div>
            </div>
            <Button onClick={() => setStep(1)} disabled={!name.trim()} className="mt-8 w-full">Continue</Button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Just in case.</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              If you ever need a human right now, I'll show you the right hotline for where you are.
            </p>
            <div className="mt-6">
              <Label htmlFor="rg">Where are you?</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger id="rg" className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REGION_OPTIONS.map((r) => (
                    <SelectItem key={r.code} value={r.code}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-8 flex gap-2">
              <Button variant="outline" onClick={() => setStep(0)} className="flex-1">Back</Button>
              <Button onClick={finish} className="flex-1">Open Bruno</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
