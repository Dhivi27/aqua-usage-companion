import { createFileRoute } from "@tanstack/react-router";
import { Cpu, Home, ShieldCheck, Sprout, Sun } from "lucide-react";
import { useState } from "react";
import { PageHero, Section } from "@/components/site/PageHero";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/tips")({
  head: () => ({
    meta: [
      { title: "Conservation Tips — AquaSmart" },
      { name: "description", content: "Daily, household, agricultural and leak-prevention water-saving tips." },
      { property: "og:title", content: "Water Conservation Tips" },
      { property: "og:description", content: "Practical ways to save water at home, on farms and with smart tech." },
    ],
  }),
  component: Tips,
});

const groups = [
  { icon: Sun, title: "Daily water-saving tips", tips: ["Turn off the tap while brushing (saves ~6 L/min)", "Take 5-minute showers instead of baths", "Use a bucket, not a hose, to wash vehicles", "Reuse RO reject water for mopping or plants"] },
  { icon: Home, title: "Household conservation", tips: ["Install aerators on taps and low-flow showerheads", "Use dual-flush toilets", "Run washing machines only on full loads", "Harvest rooftop rainwater"] },
  { icon: Sprout, title: "Agricultural water saving", tips: ["Switch to drip or sprinkler irrigation", "Mulch fields to reduce evaporation", "Irrigate early morning or evening", "Choose crops suited to local rainfall"] },
  { icon: ShieldCheck, title: "Leakage prevention", tips: ["Check the meter with all taps closed — it shouldn't move", "Add food colour to the flush tank to detect silent leaks", "Replace worn washers promptly", "Inspect overhead tank float valves monthly"] },
  { icon: Cpu, title: "Smart usage recommendations", tips: ["Set alerts for night-time flow", "Automate the pump with tank-level sensors", "Track weekly usage against a target", "Use soil-moisture sensors for gardens"] },
];

function Tips() {
  const all = groups.flatMap((g) => g.tips);
  const [done, setDone] = useState<Set<string>>(new Set());
  const toggle = (t: string) => setDone((s) => { const n = new Set(s); n.has(t) ? n.delete(t) : n.add(t); return n; });
  const pct = Math.round((done.size / all.length) * 100);

  return (
    <>
      <PageHero eyebrow="Conservation tips" title="Small habits, big savings" subtitle="Tick the habits you already follow to see your conservation score." />
      <Section>
        <div className="rounded-2xl border bg-card p-5 shadow-soft">
          <div className="flex justify-between text-sm font-medium"><span>Your conservation score</span><span className="text-primary">{pct}%</span></div>
          <Progress value={pct} className="mt-2 h-3" />
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <div key={g.title} className="card-hover rounded-2xl border bg-card p-6 shadow-soft">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground"><g.icon className="h-5 w-5" /></span>
              <h2 className="mt-4 text-lg font-semibold">{g.title}</h2>
              <ul className="mt-3 space-y-3">
                {g.tips.map((t) => (
                  <li key={t}>
                    <label className="flex cursor-pointer gap-3 text-sm text-muted-foreground">
                      <Checkbox checked={done.has(t)} onCheckedChange={() => toggle(t)} className="mt-0.5" />
                      <span className={done.has(t) ? "text-foreground line-through decoration-primary/40" : ""}>{t}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
