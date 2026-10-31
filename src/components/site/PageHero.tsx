import type { ReactNode } from "react";
import { Droplet } from "lucide-react";

export function PageHero({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-gradient-sky">
      <Droplet className="animate-float absolute -right-6 top-6 h-40 w-40 text-primary-glow/20" />
      <Droplet className="animate-float absolute left-10 bottom-0 h-16 w-16 text-primary/10 [animation-delay:1.5s]" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">{eyebrow}</span>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}

export function SimBadge({ label = "Simulated data" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-warning" /> {label}
    </span>
  );
}

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`mx-auto max-w-7xl px-4 py-14 sm:px-6 ${className}`}>{children}</section>;
}

export function StatCard({ icon, label, value, hint, tone = "primary" }: { icon: ReactNode; label: string; value: string; hint?: string | undefined; tone?: "primary" | "success" | "warning" | "destructive" }) {
  const toneCls = {
    primary: "bg-secondary text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-foreground",
    destructive: "bg-destructive/15 text-destructive",
  }[tone];
  return (
    <div className="card-hover rounded-2xl border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${toneCls}`}>{icon}</span>
      </div>
      <div className="mt-3 font-display text-2xl font-bold">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function ChartCard({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="font-semibold">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
