import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/app-shell";
import { getMyProfile, updateMyProfile } from "@/lib/profile.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { REGION_OPTIONS } from "@/lib/hotlines";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/settings")({
  head: () => ({ meta: [{ title: "Settings — Bruno" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchProfile = useServerFn(getMyProfile);
  const update = useServerFn(updateMyProfile);
  const me = useQuery({ queryKey: ["me"], queryFn: () => fetchProfile() });

  const [displayName, setDisplayName] = useState("");
  const [region, setRegion] = useState("US");
  const [tz, setTz] = useState("UTC");

  useEffect(() => {
    if (me.data?.profile) {
      setDisplayName(me.data.profile.display_name ?? "");
      setRegion(me.data.profile.crisis_region);
      setTz(me.data.profile.timezone);
    }
  }, [me.data]);

  async function save() {
    try {
      await update({ data: { display_name: displayName, crisis_region: region, timezone: tz } });
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["me"] });
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <AppShell title="Settings">
      <div className="space-y-5 p-4">
        <h1 className="font-display text-2xl font-semibold text-ink">Settings</h1>

        <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
          <Label htmlFor="dn">Display name</Label>
          <Input id="dn" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1.5" />

          <Label htmlFor="rg" className="mt-4 block">Region (for crisis hotlines)</Label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger id="rg" className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              {REGION_OPTIONS.map((r) => (
                <SelectItem key={r.code} value={r.code}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label htmlFor="tz" className="mt-4 block">Timezone</Label>
          <Input id="tz" value={tz} onChange={(e) => setTz(e.target.value)} className="mt-1.5" placeholder="e.g. Europe/Berlin" />

          <Button onClick={save} className="mt-4 w-full">Save</Button>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Signed in as <span className="font-medium text-foreground">{me.data?.profile ? (me.data.profile.display_name || "you") : "..."}</span></p>
          <Button variant="outline" onClick={signOut} className="mt-3 w-full">Sign out</Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Bruno is a coach, not a therapist. In a crisis, please use the In crisis? button up top.
        </p>
      </div>
    </AppShell>
  );
}
