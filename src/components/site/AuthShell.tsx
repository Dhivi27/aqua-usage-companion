import type { ReactNode } from "react";
import { Droplets } from "lucide-react";
import { toast } from "sonner";
import { lovable } from "@/integrations/lovable/index";
import "@lovable.dev/cloud-auth-js/styles.css";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-water.jpg";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-0 overflow-hidden px-4 py-12 sm:px-6 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden rounded-l-3xl lg:block">
        <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" width={1600} height={1008} />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/90 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-deep-foreground">
          <Droplets className="h-8 w-8 text-primary-glow" />
          <p className="mt-3 font-display text-2xl font-bold">Conserve today, secure tomorrow.</p>
        </div>
      </div>
      <div className="rounded-3xl border bg-card p-8 shadow-elegant lg:rounded-l-none sm:p-10">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-1 text-muted-foreground">{subtitle}</p>
        <div className="mt-6 space-y-3">
          <Button variant="outline" className="h-11 w-full rounded-full" onClick={() => social("google")}>
            <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.66 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 6.26 12 6.26c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.68 3.7 14.54 2.75 12 2.75 6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25c6.92 0 9.5-4.86 9.5-7.4 0-.5-.06-.88-.15-1.25z" /></svg>
            Continue with Google
          </Button>
          <button type="button" className="lovable-auth-button w-full" onClick={() => social("lovable")}>Continue with Lovable</button>
        </div>
        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or with email<span className="h-px flex-1 bg-border" /></div>
        {children}
      </div>
    </div>
  );
}

async function social(provider: "google" | "lovable") {
  const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
  if (result.error) toast.error(result.error.message ?? "Sign-in failed");
}
