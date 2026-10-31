import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Home, Lightbulb, Network, Sprout, Tractor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/site/PageHero";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions — AquaSmart" },
      { name: "description", content: "Water solutions for households, agriculture, smart irrigation and distribution networks." },
      { property: "og:title", content: "AquaSmart Solutions" },
      { property: "og:description", content: "Household, agricultural and municipal water management solutions." },
    ],
  }),
  component: Solutions,
});

const solutions = [
  { icon: Home, title: "Household Water Management", text: "Smart meters on the main inlet and key fixtures show exactly where water goes.", points: ["Zone-wise consumption", "Overhead tank automation", "Night-flow leak alerts"], to: "/monitoring" },
  { icon: Tractor, title: "Agricultural Water Management", text: "Plan water budgets per crop and field using soil, crop and weather data.", points: ["Crop water requirement estimates", "Borewell usage tracking", "Seasonal planning"], to: "/prediction" },
  { icon: Sprout, title: "Smart Irrigation", text: "Soil-moisture sensors trigger drip irrigation only when plants actually need water.", points: ["Moisture-based scheduling", "Rain-skip logic", "Up to 40–60% water saving"], to: "/tips" },
  { icon: Network, title: "Water Distribution Management", text: "Pressure and flow sensors across pipelines locate losses in municipal networks.", points: ["Non-revenue water detection", "Pressure zone balancing", "Pipe burst alerts"], to: "/leakage" },
  { icon: Lightbulb, title: "Water Conservation Recommendations", text: "AI turns your usage patterns into simple, personalised actions.", points: ["Benchmark comparisons", "Habit-based suggestions", "Monthly savings goals"], to: "/tips" },
] as const;

function Solutions() {
  return (
    <>
      <PageHero eyebrow="Solutions" title="Tailored for homes, farms and cities" subtitle="The same AI core, adapted to each environment's needs." />
      <Section className="space-y-6">
        {solutions.map((s, i) => (
          <div key={s.title} className={`grid items-center gap-6 rounded-3xl border bg-card p-8 shadow-soft md:grid-cols-[auto_1fr_auto] ${i % 2 ? "md:bg-secondary/40" : ""}`}>
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft"><s.icon className="h-7 w-7" /></span>
            <div>
              <h2 className="text-2xl font-bold">{s.title}</h2>
              <p className="mt-2 text-muted-foreground">{s.text}</p>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-1.5 text-sm"><CheckCircle2 className="h-4 w-4 text-success" /> {p}</li>
                ))}
              </ul>
            </div>
            <Button variant="glass" asChild><Link to={s.to}>Explore</Link></Button>
          </div>
        ))}
      </Section>
    </>
  );
}
