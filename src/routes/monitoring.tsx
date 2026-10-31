import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarDays, Droplets, Loader2, Trash2, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { ChartCard, PageHero, Section, SimBadge, StatCard } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { C, axis, tooltipStyle } from "@/lib/chart-theme";
import { DAILY_BENCHMARK_PER_PERSON, groupByDay, groupByMonth, sampleRecords, totalLiters, type UsageRecord } from "@/lib/water";

export const Route = createFileRoute("/monitoring")({
  head: () => ({
    meta: [
      { title: "Water Monitoring — AquaSmart" },
      { name: "description", content: "Log water consumption and view daily, monthly and historical usage analysis." },
      { property: "og:title", content: "Water Consumption Monitoring" },
      { property: "og:description", content: "Track and analyse your daily and monthly water usage." },
    ],
  }),
  component: Monitoring,
});

const schema = z.object({
  usage_date: z.string().min(1, "Pick a date"),
  liters: z.coerce.number({ invalid_type_error: "Enter a number" }).positive("Must be greater than 0").max(100000, "Too large"),
  category: z.enum(["household", "garden", "agriculture", "other"]),
  note: z.string().trim().max(200).optional(),
});
type FormValues = z.infer<typeof schema>;

type Row = UsageRecord & { id: string; category: string; note: string | null };

function Monitoring() {
  const { user, loading: authLoading } = useAuth();
  const qc = useQueryClient();
  const [people, setPeople] = useState(4);

  const { data, isLoading, error } = useQuery({
    queryKey: ["usage", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("water_usage").select("id, usage_date, liters, category, note").order("usage_date", { ascending: false }).limit(500);
      if (error) throw error;
      return (data ?? []).map((r) => ({ ...r, liters: Number(r.liters) })) as Row[];
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { usage_date: new Date().toISOString().slice(0, 10), category: "household", note: "" },
  });

  const add = useMutation({
    mutationFn: async (v: FormValues) => {
      const { error } = await supabase.from("water_usage").insert({ ...v, user_id: user!.id, note: v.note || null });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Reading saved");
      form.reset({ ...form.getValues(), liters: undefined as unknown as number, note: "" });
      qc.invalidateQueries({ queryKey: ["usage"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("water_usage").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["usage"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const usingSample = !user || (data && data.length === 0);
  const records: UsageRecord[] = usingSample ? sampleRecords(60) : (data ?? []);
  const daily = groupByDay(records).slice(-30);
  const monthly = groupByMonth(records);
  const avgDaily = daily.length ? totalLiters(daily.map((d) => ({ usage_date: d.date, liters: d.liters }))) / daily.length : 0;
  const benchmark = DAILY_BENCHMARK_PER_PERSON * people;
  const diff = benchmark ? ((avgDaily - benchmark) / benchmark) * 100 : 0;
  const thisMonth = monthly.at(-1)?.liters ?? 0;

  return (
    <>
      <PageHero eyebrow="Water monitoring" title="Track your consumption" subtitle="Enter meter readings and see your daily and monthly usage with instant analysis." />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="rounded-2xl border bg-card p-6 shadow-soft">
            <h2 className="text-lg font-semibold">Add a reading</h2>
            {authLoading ? (
              <Loader2 className="mt-4 animate-spin text-primary" />
            ) : !user ? (
              <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                <p>Sign in to save your own readings. Until then, the charts show sample data.</p>
                <Button variant="hero" className="w-full" asChild><Link to="/login">Login to save readings</Link></Button>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit((v) => add.mutate(v))} className="mt-4 space-y-4" noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="usage_date">Date</Label>
                  <Input id="usage_date" type="date" {...form.register("usage_date")} />
                  <FieldError msg={form.formState.errors.usage_date?.message} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="liters">Litres used</Label>
                  <Input id="liters" type="number" step="0.1" placeholder="e.g. 450" {...form.register("liters")} />
                  <FieldError msg={form.formState.errors.liters?.message} />
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select value={form.watch("category")} onValueChange={(v) => form.setValue("category", v as FormValues["category"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="household">Household</SelectItem>
                      <SelectItem value="garden">Garden</SelectItem>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="note">Note (optional)</Label>
                  <Input id="note" placeholder="e.g. laundry day" {...form.register("note")} />
                  <FieldError msg={form.formState.errors.note?.message} />
                </div>
                <Button type="submit" variant="hero" className="w-full" disabled={add.isPending}>
                  {add.isPending && <Loader2 className="animate-spin" />} Save reading
                </Button>
              </form>
            )}
            <div className="mt-6 space-y-1.5 border-t pt-4">
              <Label htmlFor="people">People in household</Label>
              <Input id="people" type="number" min={1} max={20} value={people} onChange={(e) => setPeople(Math.max(1, Math.min(20, Number(e.target.value) || 1)))} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              {usingSample ? <SimBadge label="Showing sample data" /> : <span className="text-sm text-muted-foreground">Showing your {data?.length} saved readings</span>}
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
              {error && <span className="text-sm text-destructive">Couldn't load your readings: {(error as Error).message}</span>}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard icon={<CalendarDays className="h-5 w-5" />} label="Avg daily usage" value={`${Math.round(avgDaily)} L`} hint="Last 30 entries" />
              <StatCard icon={<Droplets className="h-5 w-5" />} label="Latest month" value={`${Math.round(thisMonth).toLocaleString()} L`} hint={monthly.at(-1)?.month} />
              <StatCard icon={<Users className="h-5 w-5" />} label="vs benchmark" value={`${diff > 0 ? "+" : ""}${diff.toFixed(0)}%`} hint={`${benchmark} L/day for ${people} people`} tone={diff > 10 ? "destructive" : diff > 0 ? "warning" : "success"} />
            </div>
            <ChartCard title="Daily usage history">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={daily}>
                  <CartesianGrid stroke={C.grid} vertical={false} />
                  <XAxis dataKey="date" {...axis} tickFormatter={(d: string) => d.slice(5)} />
                  <YAxis {...axis} width={45} />
                  <Tooltip {...tooltipStyle} />
                  <Line type="monotone" dataKey="liters" stroke={C.primary} strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Monthly usage">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthly}>
                  <CartesianGrid stroke={C.grid} vertical={false} />
                  <XAxis dataKey="month" {...axis} />
                  <YAxis {...axis} width={55} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="liters" fill={C.cyan} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <div className="rounded-2xl border bg-card p-5 shadow-soft">
              <h3 className="flex items-center gap-2 font-semibold"><TrendingUp className="h-5 w-5 text-primary" /> Consumption analysis</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {diff > 10
                  ? `Your average daily use is ${diff.toFixed(0)}% above the recommended ${DAILY_BENCHMARK_PER_PERSON} L per person. Check for leaks and review shower and laundry habits.`
                  : diff > 0
                    ? "You're slightly above the benchmark. Small changes like shorter showers can bring you under target."
                    : "Great work — your usage is within the recommended per-person benchmark."}
              </p>
            </div>
            {!usingSample && data && (
              <div className="rounded-2xl border bg-card p-5 shadow-soft">
                <h3 className="font-semibold">Your recent readings</h3>
                <ul className="mt-3 divide-y">
                  {data.slice(0, 10).map((r) => (
                    <li key={r.id} className="flex items-center justify-between py-2 text-sm">
                      <span>{r.usage_date} · <span className="capitalize text-muted-foreground">{r.category}</span>{r.note ? ` · ${r.note}` : ""}</span>
                      <span className="flex items-center gap-2 font-medium">{r.liters} L
                        <Button variant="ghost" size="icon" aria-label="Delete reading" onClick={() => del.mutate(r.id)}><Trash2 className="text-destructive" /></Button>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-destructive">{msg}</p> : null;
}
