// Pure helpers for water-usage math. All sample data here is SIMULATED.

export type UsageRecord = { usage_date: string; liters: number; category?: string };

/** Daily per-person benchmark (litres) used for analysis — WHO/BIS-style 135 L/person/day. */
export const DAILY_BENCHMARK_PER_PERSON = 135;

export function totalLiters(records: UsageRecord[]): number {
  return records.reduce((s, r) => s + Number(r.liters || 0), 0);
}

export function groupByDay(records: UsageRecord[]): { date: string; liters: number }[] {
  const map = new Map<string, number>();
  for (const r of records) map.set(r.usage_date, (map.get(r.usage_date) ?? 0) + Number(r.liters));
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, liters]) => ({ date, liters }));
}

export function groupByMonth(records: UsageRecord[]): { month: string; liters: number }[] {
  const map = new Map<string, number>();
  for (const r of records) {
    const m = r.usage_date.slice(0, 7);
    map.set(m, (map.get(m) ?? 0) + Number(r.liters));
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, liters]) => ({ month, liters }));
}

export type FlowStatus = "Normal" | "Warning" | "Leakage";

/** Classify a flow reading against its expected baseline. */
export function classifyFlow(actual: number, expected: number): FlowStatus {
  if (expected <= 0) return actual > 0 ? "Leakage" : "Normal";
  const ratio = actual / expected;
  if (ratio >= 1.5) return "Leakage";
  if (ratio >= 1.2) return "Warning";
  return "Normal";
}

/** Simple linear-regression forecast (simulation stand-in for an ML model). */
export function linearForecast(values: number[], steps: number): number[] {
  const n = values.length;
  if (n === 0) return Array(steps).fill(0);
  const xs = values.map((_, i) => i);
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = values.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (values[i] - my);
    den += (xs[i] - mx) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = my - slope * mx;
  return Array.from({ length: steps }, (_, k) => Math.max(0, Math.round(intercept + slope * (n + k))));
}

export function toCsv(rows: Record<string, string | number>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}

export function downloadCsv(filename: string, rows: Record<string, string | number>[]) {
  const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------- Simulated demo data (deterministic) ----------
function seeded(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export const hourlyUsage = Array.from({ length: 24 }, (_, h) => {
  const peak = (h >= 6 && h <= 9) || (h >= 18 && h <= 21);
  return { hour: `${String(h).padStart(2, "0")}:00`, liters: Math.round((peak ? 38 : 8) + seeded(h) * 14) };
});

export const weeklyUsage = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
  day,
  liters: Math.round(480 + seeded(i + 40) * 160 + (i >= 5 ? 90 : 0)),
  target: 520,
}));

export const monthlyUsage = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
  (month, i) => ({
    month,
    liters: Math.round(14500 + Math.sin((i - 2) / 1.9) * 2600 + seeded(i + 80) * 900),
  }),
);

export function sampleRecords(days = 60): UsageRecord[] {
  const out: UsageRecord[] = [];
  const now = new Date("2026-10-31T00:00:00Z");
  for (let d = days - 1; d >= 0; d--) {
    const dt = new Date(now.getTime() - d * 86400000);
    out.push({ usage_date: dt.toISOString().slice(0, 10), liters: Math.round(430 + seeded(d + 7) * 200) });
  }
  return out;
}

export const flowReadings = [
  { zone: "Kitchen inlet", expected: 12, actual: 11.4 },
  { zone: "Bathroom 1", expected: 9, actual: 10.2 },
  { zone: "Garden line", expected: 6, actual: 7.6 },
  { zone: "Overhead tank feed", expected: 20, actual: 19.1 },
  { zone: "Washing machine", expected: 8, actual: 8.3 },
  { zone: "Bathroom 2 (night)", expected: 0.5, actual: 2.1 },
];
