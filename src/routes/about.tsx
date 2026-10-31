import { createFileRoute } from "@tanstack/react-router";
import { BrainCircuit, CheckCircle2, Cpu, Droplet, FileWarning, Radio, Target, XCircle } from "lucide-react";
import { PageHero, Section } from "@/components/site/PageHero";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — AquaSmart Water Conservation Project" },
      { name: "description", content: "Why water conservation matters and how AI, ML and IoT transform water management." },
      { property: "og:title", content: "About AquaSmart" },
      { property: "og:description", content: "Objectives and scope of the AI-Based Water Resource Management project." },
    ],
  }),
  component: About,
});

const problems = [
  "Manual meter readings, often only once a month",
  "Leaks go unnoticed for weeks",
  "No visibility into when and where water is used",
  "Supply planned on guesswork, not data",
  "Over-irrigation in agriculture",
];

const tech = [
  { icon: Radio, title: "IoT Sensors", text: "Flow meters, ultrasonic tank sensors and soil-moisture probes stream readings to the cloud every few seconds." },
  { icon: Cpu, title: "Machine Learning", text: "Models learn normal usage patterns and flag anomalies such as continuous night-time flow — a classic leak signature." },
  { icon: BrainCircuit, title: "Artificial Intelligence", text: "Forecasting predicts future demand from history, season and weather so supply can be planned in advance." },
];

const objectives = [
  "Monitor water consumption in real time",
  "Detect leakages early using anomaly detection",
  "Predict future water demand with ML",
  "Provide actionable conservation recommendations",
  "Generate daily, weekly and monthly reports",
  "Raise awareness of sustainable water use",
];

const scope = [
  ["Households", "Apartments and independent homes with smart meters."],
  ["Agriculture", "Smart irrigation driven by soil moisture and weather."],
  ["Institutions", "Campuses, hostels and offices with multiple zones."],
  ["Municipal", "Distribution network monitoring and loss reduction."],
];

function About() {
  return (
    <>
      <PageHero eyebrow="About the project" title="Every drop counts" subtitle="Water is finite. Smarter management is the fastest way to protect it for future generations." />
      <Section className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold"><Droplet className="text-primary" /> Importance of water conservation</h2>
          <p className="mt-4 text-muted-foreground">
            Only about 2.5% of Earth's water is fresh, and less than 1% is easily accessible. India holds roughly 18% of
            the world's population but only 4% of its freshwater resources. Rising demand, climate change and pollution
            make conservation essential for health, food security and the economy.
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-2xl font-bold"><FileWarning className="text-destructive" /> Conventional problems</h2>
          <ul className="mt-4 space-y-2">
            {problems.map((p) => (
              <li key={p} className="flex gap-2 text-muted-foreground"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" /> {p}</li>
            ))}
          </ul>
        </div>
      </Section>
      <Section>
        <h2 className="text-center text-3xl font-bold">How AI, ML & IoT help</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {tech.map((t) => (
            <div key={t.title} className="card-hover rounded-2xl border bg-card p-6 shadow-soft">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground"><t.icon className="h-5 w-5" /></span>
              <h3 className="mt-4 text-lg font-semibold">{t.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.text}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl bg-gradient-deep p-8 text-deep-foreground shadow-elegant">
          <h2 className="flex items-center gap-2 text-2xl font-bold"><Target /> Project objectives</h2>
          <ul className="mt-5 space-y-3">
            {objectives.map((o) => (
              <li key={o} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-glow" /> {o}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Project scope</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {scope.map(([t, d]) => (
              <div key={t} className="rounded-2xl border bg-card p-5 shadow-soft">
                <h3 className="font-semibold text-primary">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
