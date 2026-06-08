import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase puts recovery tokens in the URL hash.
    if (typeof window === "undefined") return;
    if (window.location.hash.includes("type=recovery")) setReady(true);
    else
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) setReady(true);
      });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated.");
    navigate({ to: "/app/chat", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-border bg-background p-7 shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-ink">Set a new password</h1>
        {!ready ? (
          <p className="mt-4 text-sm text-muted-foreground">Open this page from the reset link in your email.</p>
        ) : (
          <>
            <Label htmlFor="pw" className="mt-6 block">New password</Label>
            <Input id="pw" type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
            <Button type="submit" disabled={loading} className="mt-5 w-full">{loading ? "..." : "Update password"}</Button>
          </>
        )}
      </form>
    </div>
  );
}
