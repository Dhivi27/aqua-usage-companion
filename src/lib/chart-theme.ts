export const C = {
  primary: "var(--chart-1)",
  cyan: "var(--chart-2)",
  green: "var(--chart-3)",
  amber: "var(--chart-4)",
  red: "var(--chart-5)",
  grid: "var(--border)",
  text: "var(--muted-foreground)",
};
export const axis = { stroke: C.text, fontSize: 12, tickLine: false, axisLine: false } as const;
export const tooltipStyle = {
  contentStyle: { borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 },
};
