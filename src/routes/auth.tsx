import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { BrunoMark } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { checkWaitlistEmail } from "@/lib/profile.functions";

type Mode = "signin" | "signup" | "reset";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Sign in — Bruno" }, { name: "description", content: "Sign in to your Bruno coach." }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const checkWaitlist = useServerFn(checkWaitlistEmail);

  // If already signed in, bounce to the app.
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/app/chat", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Check your email for the reset link.");
        setMode("signin");
        return;
      }
      if (mode === "signup") {
        const check = await checkWaitlist({ data: { email: email.trim().toLowerCase() } });
        if (!check.onList) {
          toast.error("This email isn't on the waitlist yet. Join the list first — we'll let you in soon.");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name.trim() || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm.");
        // Try immediate sign-in (works if auto-confirm enabled).
        const { data: signedIn } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signedIn.user) navigate({ to: "/app/onboarding", replace: true });
        return;
      }
      // signin
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      navigate({ to: "/app/chat", replace: true });
    } catch (e: any) {
      toast.error(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/app/chat",
      });
      if (result.error) throw result.error;
      if (!result.redirected) navigate({ to: "/app/chat", replace: true });
    } catch (e: any) {
      toast.error(e?.message ?? "Google sign-in failed");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <header className="border-b border-border/60 bg-background/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <BrunoMark className="h-8 w-8" />
            <span className="font-display text-xl font-semibold text-ink">bruno</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back home
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-background p-7 shadow-sm">
          <h1 className="font-display text-3xl font-semibold text-ink">
            {mode === "signin" && "Welcome back."}
            {mode === "signup" && "Claim your spot."}
            {mode === "reset" && "Reset your password."}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin" && "Sign in to keep going with Bruno."}
            {mode === "signup" && "Waitlist members only — make sure your email is on the waitlist."}
            {mode === "reset" && "We'll email you a reset link."}
          </p>

          {mode !== "reset" && (
            <>
              <Button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                variant="outline"
                className="mt-6 w-full"
              >
                <GoogleIcon />
                Continue with Google
              </Button>
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or with email</span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name">Your first name</Label>
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>
            {mode !== "reset" && (
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "..." : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
            </Button>
          </form>

          <div className="mt-6 flex flex-col gap-2 text-center text-sm text-muted-foreground">
            {mode === "signin" && (
              <>
                <button type="button" onClick={() => setMode("reset")} className="hover:text-foreground">
                  Forgot your password?
                </button>
                <p>
                  New here?{" "}
                  <button type="button" onClick={() => setMode("signup")} className="font-medium text-foreground hover:underline">
                    Create account
                  </button>
                </p>
              </>
            )}
            {mode === "signup" && (
              <p>
                Already have an account?{" "}
                <button type="button" onClick={() => setMode("signin")} className="font-medium text-foreground hover:underline">
                  Sign in
                </button>
              </p>
            )}
            {mode === "reset" && (
              <button type="button" onClick={() => setMode("signin")} className="hover:text-foreground">
                ← Back to sign in
              </button>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Not on the waitlist?{" "}
            <Link to="/" hash="check" className="underline hover:text-foreground">
              Take the 2-min check first
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}
