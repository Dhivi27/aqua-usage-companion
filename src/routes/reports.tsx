import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard, PageHero, Section, SimBadge } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { C, axis, tooltipStyle } from "@/lib/chart-theme";
import { downloadCsv, groupByDay, groupByMonth, hourlyUsage, monthlyUsage, sampleRecords, weeklyUsage } from "@/lib/water";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — AquaSmart" },
      { name: "description", content: "Daily, weekly and monthly water reports with comparison charts and CSV download." },
      { property: "og:title", content: "Water Usage Reports" },
      { property: "og:description", content: "Download daily, weekly and monthly water usage reports." },
    ],
  }),
  component: Reports,
});

const lastYear = monthlyUsage.map((m, i) => ({ ...m, previous: Math.round(m.liters * (1.08 + (i % 3) * 0.02)) }));

function Reports() {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["usage", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("water_usage").select("id, usage_date, liters, category, note").order("usage_date", { ascending: false }).limit(500);
      if (error) throw error;
      return (data ?? []).map((r) => ({ ...r, liters: Number(r.liters) }));
    },
  });
  const mine = data && data.length > 0;
  const records = mine ? data : sampleRecords(60);
  const dailyRows = groupByDay(records).slice(-14).map((d) => ({ date: d.date, liters: d.liters }));
  const monthlyRows = mine ? groupByMonth(records).map((m) => ({ month: m.month, liters: m.liters })) : monthlyUsage.map((m) => ({ month: m.month, liters: m.liters }));

  return (
    <>
      <PageHero eyebrow="Reports" title="Usage reports" subtitle="Review consumption over any period and export it as CSV for your project report." />
      <Section>
        <div className="mb-4">{mine ? <span className="text-sm text-muted-foreground">Daily and monthly tabs use your saved readings.</span> : <SimBadge label="Sample data — sign in and log readings for your own reports" />}</div>
        <Tabs defaultValue="daily">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="daily">
            <ReportTable title="Daily report (last 14 days)" cols={["date", "liters"]} rows={dailyRows} file="daily-report.csv" />
            <ChartCard title="Today by hour (simulated)">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={hourlyUsage}><CartesianGrid stroke={C.grid} vertical={false} /><XAxis dataKey="hour" {...axis} interval={3} /><YAxis {...axis} width={35} /><Tooltip {...tooltipStyle} /><Bar dataKey="liters" fill={C.primary} radius={[4, 4, 0, 0]} /></BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </TabsContent>
          <TabsContent value="weekly">
            <ReportTable title="Weekly report (simulated)" cols={["day", "liters", "target"]} rows={weeklyUsage} file="weekly-report.csv" />
          </TabsContent>
          <TabsContent value="monthly">
            <ReportTable title="Monthly report" cols={["month", "liters"]} rows={monthlyRows} file="monthly-report.csv" />
          </TabsContent>
        </Tabs>
        <div className="mt-6">
          <ChartCard title="Comparison: 2026 vs 2025 (simulated)" action={<Button variant="outline" size="sm" onClick={() => downloadCsv("comparison.csv", lastYear.map((m) => ({ month: m.month, y2026: m.liters, y2025: m.previous })))}><Download /> CSV</Button>}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lastYear}><CartesianGrid stroke={C.grid} vertical={false} /><XAxis dataKey="month" {...axis} /><YAxis {...axis} width={55} /><Tooltip {...tooltipStyle} /><Legend />
                <Bar dataKey="previous" name="2025" fill={C.cyan} radius={[6, 6, 0, 0]} />
                <Bar dataKey="liters" name="2026" fill={C.primary} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </Section>
    </>
  );
}

function ReportTable({ title, cols, rows, file }: { title: string; cols: string[]; rows: Record<string, string | number>[]; file: string }) {
  const total = rows.reduce((s, r) => s + Number(r["liters"] || 0), 0);
  return (
    <div className="my-4 rounded-2xl border bg-card p-5 shadow-soft">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-semibold">{title}</h3>
        <Button variant="hero" size="sm" onClick={() => downloadCsv(file, rows)}><Download /> Download CSV</Button>
      </div>
      <div className="max-h-80 overflow-auto">
        <Table>
          <TableHeader><TableRow>{cols.map((c) => <TableHead key={c} className="capitalize">{c}</TableHead>)}</TableRow></TableHeader>
          <TableBody>
            {rows.map((r, i) => <TableRow key={i}>{cols.map((c) => <TableCell key={c}>{typeof r[c] === "number" ? Number(r[c]).toLocaleString() : r[c]}</TableCell>)}</TableRow>)}
          </TableBody>
        </Table>
      </div>
      <p className="mt-3 text-sm font-medium">Total: {total.toLocaleString()} L</p>
    </div>
  );
}
