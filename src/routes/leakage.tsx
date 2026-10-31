import { createFileRoute } from "@tanstack/react-router";
import { AlertOctagon, AlertTriangle, CheckCircle2, RefreshCw, Wrench } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";
import { ChartCard, PageHero, Section, SimBadge, StatCard } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { C, axis, tooltipStyle } from "@/lib/chart-theme";
import { classifyFlow, flowReadings, type FlowStatus } from "@/lib/water";

export const Route = createFileRoute("/leakage")({
  head: () => ({
    meta: [
      { title: "Leakage Detection — AquaSmart" },
      { name: "description", content: "Flow readings, anomaly detection and leakage alerts with Normal, Warning and Leakage statuses." },
      { property: "og:title", content: "Water Leakage Detection" },
      { property: "og:description", content: "Spot unusual consumption and possible leaks early." },
    ],
  }),
  component: Leakage,
});

const statusStyle: Record<FlowStatus, string> = {
  Normal: "bg-success/15 text-success border-success/30",
  Warning: "bg-warning/20 text-foreground border-warning/40",
  Leakage: "bg-destructive/15 text-destructive border-destructive/30",
};

const advice: Record<FlowStatus, string> = {
  Normal: "No action needed.",
  Warning: "Inspect fixtures and check for running taps or a faulty float valve.",
  Leakage: "Close the zone valve and call a plumber. Check flush tanks and hidden pipes.",
};

function Leakage() {
  const [readings, setReadings] = useState(flowReadings);
  const rows = readings.map((r) => ({ ...r, status: classifyFlow(r.actual, r.expected) }));
  const count = (s: FlowStatus) => rows.filter((r) => r.status === s).length;

  const refresh = () =>
    setReadings((rs) => rs.map((r) => ({ ...r, actual: Math.max(0, +(r.actual * (0.9 + Math.random() * 0.25)).toFixed(1)) })));

  return (
    <>
      <PageHero eyebrow="Leakage detection" title="Find leaks before they cost you" subtitle="Each zone's flow is compared with its expected baseline. Above 120% is a warning; above 150% is flagged as a likely leak." />
      <Section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SimBadge label="Simulated flow sensors" />
          <Button variant="glass" onClick={refresh}><RefreshCw /> Refresh readings</Button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label="Normal zones" value={String(count("Normal"))} tone="success" />
          <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="Warnings" value={String(count("Warning"))} tone="warning" />
          <StatCard icon={<AlertOctagon className="h-5 w-5" />} label="Possible leaks" value={String(count("Leakage"))} tone="destructive" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ChartCard title="Flow readings (L/min)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rows}>
                <CartesianGrid stroke={C.grid} vertical={false} />
                <XAxis dataKey="zone" {...axis} tick={{ fontSize: 10 }} interval={0} angle={-15} height={50} />
                <YAxis {...axis} width={35} />
                <Tooltip {...tooltipStyle} />
                <Legend />
                <Bar dataKey="expected" fill={C.cyan} radius={[6, 6, 0, 0]} />
                <Bar dataKey="actual" fill={C.primary} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Zone status">
            <ul className="space-y-2">
              {rows.map((r) => (
                <li key={r.zone} className="flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <div className="font-medium">{r.zone}</div>
                    <div className="text-xs text-muted-foreground">{r.actual} / {r.expected} L/min expected</div>
                  </div>
                  <Badge variant="outline" className={statusStyle[r.status]}>{r.status}</Badge>
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>

        <div className="mt-6 rounded-2xl border bg-card p-6 shadow-soft">
          <h3 className="flex items-center gap-2 font-semibold"><Wrench className="h-5 w-5 text-primary" /> Alerts & recommendations</h3>
          <ul className="mt-4 space-y-3">
            {rows.filter((r) => r.status !== "Normal").map((r) => (
              <li key={r.zone} className="flex gap-3 rounded-xl bg-secondary/50 p-3 text-sm">
                {r.status === "Leakage" ? <AlertOctagon className="h-5 w-5 shrink-0 text-destructive" /> : <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />}
                <span><strong>{r.zone}:</strong> {advice[r.status]}</span>
              </li>
            ))}
            {rows.every((r) => r.status === "Normal") && <li className="text-sm text-muted-foreground">All zones normal. 🎉</li>}
          </ul>
        </div>
      </Section>
    </>
  );
}
