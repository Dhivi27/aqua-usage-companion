import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, BrainCircuit, CheckCircle2, Container, Droplets, Info, Leaf, ShieldCheck } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { ChartCard, Section, SimBadge, StatCard } from "@/components/site/PageHero";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { C, axis, tooltipStyle } from "@/lib/chart-theme";
import { hourlyUsage, monthlyUsage, weeklyUsage } from "@/lib/water";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AquaSmart" },
      { name: "description", content: "Live water consumption, tank level, leakage status, predictions and alerts." },
      { property: "og:title", content: "AquaSmart Dashboard" },
      { property: "og:description", content: "Interactive water management dashboard with charts and alerts." },
    ],
  }),
  component: Dashboard,
});

const alerts = [
  { tone: "destructive", icon: AlertTriangle, title: "Possible leak — Bathroom 2", time: "02:14 AM", text: "Continuous flow of 2.1 L/min detected during idle hours." },
  { tone: "warning", icon: Info, title: "Garden line above baseline", time: "07:40 AM", text: "Flow 27% higher than expected." },
  { tone: "success", icon: CheckCircle2, title: "Tank refill complete", time: "06:05 AM", text: "Overhead tank reached 95% and pump stopped." },
] as const;

const recs = [
  "Fix the night-time flow in Bathroom 2 — could save ~3,000 L/month.",
  "Shift garden watering to after 6 PM to reduce evaporation.",
  "Weekend usage is 18% higher — try a full-load-only laundry rule.",
];

function Dashboard() {
  const [tank, setTank] = useState(78);
  useEffect(() => {
    const id = setInterval(() => setTank((t) => Math.max(40, Math.min(96, t + (Math.random() - 0.55) * 2))), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">Water Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Overview of your household water system.</p>
        </div>
        <SimBadge label="Simulated sensor readings" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={<Droplets className="h-5 w-5" />} label="Total consumption" value="14,860 L" hint="This month" />
        <div className="card-hover rounded-2xl border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Tank level</span>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary"><Container className="h-5 w-5" /></span>
          </div>
          <div className="mt-3 font-display text-2xl font-bold">{tank.toFixed(0)}%</div>
          <Progress value={tank} className="mt-2 h-2" />
          <div className="mt-1 text-xs text-muted-foreground">Live · 1,000 L tank</div>
        </div>
        <StatCard icon={<ShieldCheck className="h-5 w-5" />} label="Leakage status" value="1 warning" hint="Bathroom 2 night flow" tone="warning" />
        <StatCard icon={<BrainCircuit className="h-5 w-5" />} label="Predicted (next month)" value="14,200 L" hint="−4.4% forecast" />
        <StatCard icon={<Leaf className="h-5 w-5" />} label="Water saved" value="2,340 L" hint="vs. last month" tone="success" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Daily usage (today, by hour)">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={hourlyUsage}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.primary} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={C.cyan} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.grid} vertical={false} />
              <XAxis dataKey="hour" {...axis} interval={3} />
              <YAxis {...axis} unit=" L" width={50} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="liters" stroke={C.primary} strokeWidth={2} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Weekly usage vs target">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyUsage}>
              <CartesianGrid stroke={C.grid} vertical={false} />
              <XAxis dataKey="day" {...axis} />
              <YAxis {...axis} width={40} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="liters" fill={C.primary} radius={[8, 8, 0, 0]} />
              <Bar dataKey="target" fill={C.cyan} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6">
        <ChartCard title="Monthly consumption (2026)">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyUsage}>
              <CartesianGrid stroke={C.grid} vertical={false} />
              <XAxis dataKey="month" {...axis} />
              <YAxis {...axis} width={55} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="liters" stroke={C.primary} strokeWidth={3} dot={{ r: 4, fill: C.cyan }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Recent alerts" action={<Button variant="link" size="sm" asChild><Link to="/leakage">View all</Link></Button>}>
          <ul className="space-y-3">
            {alerts.map((a) => (
              <li key={a.title} className="flex gap-3 rounded-xl border p-3">
                <a.icon className={`mt-0.5 h-5 w-5 shrink-0 ${a.tone === "destructive" ? "text-destructive" : a.tone === "warning" ? "text-warning" : "text-success"}`} />
                <div className="flex-1">
                  <div className="flex justify-between gap-2"><span className="font-medium">{a.title}</span><span className="text-xs text-muted-foreground">{a.time}</span></div>
                  <p className="text-sm text-muted-foreground">{a.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </ChartCard>
        <ChartCard title="Conservation recommendations" action={<Button variant="link" size="sm" asChild><Link to="/tips">More tips</Link></Button>}>
          <ul className="space-y-3">
            {recs.map((r) => (
              <li key={r} className="flex gap-3 rounded-xl bg-secondary/60 p-3 text-sm"><Leaf className="h-5 w-5 shrink-0 text-success" /> {r}</li>
            ))}
          </ul>
        </ChartCard>
      </div>
    </Section>
  );
}
