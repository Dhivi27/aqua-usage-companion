import { createFileRoute } from "@tanstack/react-router";
import { BrainCircuit, CalendarRange, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { Area, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo, useState } from "react";
import { ChartCard, PageHero, Section, SimBadge, StatCard } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { C, axis, tooltipStyle } from "@/lib/chart-theme";
import { linearForecast, monthlyUsage } from "@/lib/water";

export const Route = createFileRoute("/prediction")({
  head: () => ({
    meta: [
      { title: "AI Prediction — AquaSmart" },
      { name: "description", content: "Forecast future water consumption and compare actual versus predicted usage." },
      { property: "og:title", content: "AI Water Consumption Prediction" },
      { property: "og:description", content: "Simulated AI forecasts of upcoming water demand." },
    ],
  }),
  component: Prediction,
});

function Prediction() {
  const [horizon, setHorizon] = useState(3);
  const history = monthlyUsage.slice(0, 10);

  const { chart, future } = useMemo(() => {
    // Fitted values = rolling 3-month forecast to show actual vs predicted
    const fitted = history.map((_, i) => (i < 3 ? null : linearForecast(history.slice(i - 3, i).map((h) => h.liters), 1)[0]!));
    const future = linearForecast(history.slice(-6).map((h) => h.liters), horizon);
    const nextLabels = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
    const chart = [
      ...history.map((h, i) => ({ month: h.month, actual: h.liters, predicted: fitted[i] })),
      ...future.map((v, i) => ({ month: nextLabels[i], actual: null, predicted: v })),
    ];
    return { chart, future };
  }, [horizon, history]);

  const last = history.at(-1)!.liters;
  const change = ((future[0]! - last) / last) * 100;
  const errs = chart.filter((c) => c.actual && c.predicted).map((c) => Math.abs((c.actual! - c.predicted!) / c.actual!));
  const accuracy = 100 - (errs.reduce((a, b) => a + b, 0) / errs.length) * 100;

  return (
    <>
      <PageHero eyebrow="AI prediction" title="See tomorrow's demand today" subtitle="Forecast upcoming consumption to plan supply, set budgets and avoid shortages.">
        <div className="mt-6"><SimBadge label="Simulated predictions — real ML backend not yet connected" /></div>
      </PageHero>
      <Section>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={<BrainCircuit className="h-5 w-5" />} label="Next month forecast" value={`${future[0]!.toLocaleString()} L`} />
          <StatCard icon={change < 0 ? <TrendingDown className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />} label="Change vs last month" value={`${change > 0 ? "+" : ""}${change.toFixed(1)}%`} tone={change < 0 ? "success" : "warning"} />
          <StatCard icon={<Sparkles className="h-5 w-5" />} label="Model fit (simulated)" value={`${accuracy.toFixed(1)}%`} hint="1 − mean absolute % error" />
        </div>
        <div className="mt-6">
          <ChartCard
            title="Actual vs predicted consumption"
            action={
              <div className="flex items-center gap-1">
                <CalendarRange className="h-4 w-4 text-muted-foreground" />
                {[1, 3, 6].map((h) => (
                  <Button key={h} size="sm" variant={h === horizon ? "default" : "outline"} onClick={() => setHorizon(h)}>{h}M</Button>
                ))}
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={340}>
              <ComposedChart data={chart}>
                <CartesianGrid stroke={C.grid} vertical={false} />
                <XAxis dataKey="month" {...axis} />
                <YAxis {...axis} width={55} />
                <Tooltip {...tooltipStyle} />
                <Legend />
                <Area type="monotone" dataKey="actual" fill={C.cyan} fillOpacity={0.25} stroke={C.primary} strokeWidth={2.5} name="Actual" />
                <Line type="monotone" dataKey="predicted" stroke={C.amber} strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 3 }} name="Predicted" />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6 shadow-soft">
            <h3 className="font-semibold">AI analysis</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>• Consumption peaks in May–June due to summer heat and garden watering.</li>
              <li>• Monsoon months (Jul–Sep) show lower demand as rainfall replaces irrigation.</li>
              <li>• Forecast for the next {horizon} month(s) totals {future.reduce((a, b) => a + b, 0).toLocaleString()} L.</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-gradient-deep p-6 text-deep-foreground shadow-elegant">
            <h3 className="font-semibold">Recommendations</h3>
            <ul className="mt-3 space-y-2 text-sm opacity-90">
              <li>• Pre-fill storage before forecast peak weeks.</li>
              <li>• Set a monthly budget 5% below the forecast to drive savings.</li>
              <li>• Install rainwater harvesting to offset summer demand.</li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
