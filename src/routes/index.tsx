import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, AlertTriangle, ArrowRight, BrainCircuit, Droplets, Gauge, Leaf, Sprout, TrendingDown, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/PageHero";
import hero from "@/assets/hero-water.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AquaSmart — Smart Water Management for a Sustainable Future" },
      { name: "description", content: "AI-powered platform for water monitoring, leakage detection, consumption prediction and conservation." },
      { property: "og:title", content: "AquaSmart — Smart Water Management" },
      { property: "og:description", content: "AI-powered water monitoring, leakage detection and conservation for homes, farms and cities." },
    ],
  }),
  component: Home,
});

const stats = [
  { value: "30%", label: "Average water saved with smart monitoring" },
  { value: "24/7", label: "Continuous flow & tank level tracking" },
  { value: "92%", label: "Leak detection accuracy (simulated model)" },
  { value: "6", label: "Monitoring zones per household" },
];

const why = [
  { icon: AlertTriangle, title: "Hidden leaks waste water", text: "A single dripping tap can waste over 11,000 litres a year without anyone noticing." },
  { icon: TrendingDown, title: "Groundwater is falling", text: "Many Indian cities face severe groundwater depletion due to over-extraction." },
  { icon: Sprout, title: "Farms use the most", text: "Agriculture consumes around 80% of freshwater — efficient irrigation matters most." },
  { icon: BrainCircuit, title: "AI makes it proactive", text: "Prediction lets us plan supply and act before shortages and wastage happen." },
];

function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <img src={hero} alt="Water drop over a river with smart city and farmland" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/10" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-36">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/70 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
            <Waves className="h-3.5 w-3.5" /> AI · Machine Learning · IoT
          </span>
          <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-tight md:text-6xl">
            Smart Water Management for a <span className="text-gradient">Sustainable Future</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            AquaSmart uses artificial intelligence and connected sensors to monitor consumption, detect leaks,
            predict demand and recommend ways to conserve every drop.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="hero" size="xl" asChild>
              <Link to="/register">Get Started <ArrowRight /></Link>
            </Button>
            <Button variant="glass" size="xl" asChild>
              <Link to="/features">Explore Features</Link>
            </Button>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card-hover rounded-2xl border bg-card p-6 text-center shadow-soft">
              <div className="font-display text-4xl font-bold text-gradient">{s.value}</div>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Project overview</span>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">One platform for every drop</h2>
          <p className="mt-4 text-muted-foreground">
            Conventional water management relies on manual meter readings and monthly bills — by the time a problem is
            visible, thousands of litres are lost. AquaSmart connects flow meters and tank sensors to an AI engine that
            analyses usage patterns in real time.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              [Gauge, "Live consumption and tank level monitoring"],
              [Activity, "Anomaly-based leakage detection"],
              [BrainCircuit, "Demand forecasting with machine learning"],
              [Leaf, "Personalised conservation recommendations"],
            ].map(([Icon, t]) => {
              const I = Icon as typeof Gauge;
              return (
                <li key={t as string} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-primary"><I className="h-4 w-4" /></span>
                  <span className="font-medium">{t as string}</span>
                </li>
              );
            })}
          </ul>
          <Button variant="link" className="mt-4 px-0" asChild>
            <Link to="/about">Read about the project <ArrowRight /></Link>
          </Button>
        </div>
        <div className="relative rounded-3xl bg-gradient-deep p-8 text-deep-foreground shadow-elegant">
          <Droplets className="animate-float absolute -top-6 right-6 h-14 w-14 text-primary-glow" />
          <p className="text-sm opacity-70">Today · simulated</p>
          <div className="mt-2 font-display text-5xl font-bold">486 L</div>
          <p className="text-sm opacity-70">household consumption</p>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[["78%", "Tank level"], ["0", "Active leaks"], ["−12%", "vs last week"]].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-deep-foreground/10 p-3">
                <div className="font-display text-xl font-bold">{v}</div>
                <div className="text-xs opacity-70">{l}</div>
              </div>
            ))}
          </div>
          <Button variant="secondary" className="mt-6 w-full rounded-full" asChild>
            <Link to="/dashboard">Open dashboard</Link>
          </Button>
        </div>
      </Section>

      <Section>
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Why it matters</span>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">Why Smart Water Management?</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {why.map((w) => (
            <div key={w.title} className="card-hover rounded-2xl border bg-card p-6 shadow-soft">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground"><w.icon className="h-5 w-5" /></span>
              <h3 className="mt-4 text-lg font-semibold">{w.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="flex flex-col items-center gap-5 rounded-3xl bg-gradient-primary px-6 py-14 text-center text-primary-foreground shadow-elegant">
          <h2 className="text-3xl font-bold md:text-4xl">Start tracking your water today</h2>
          <p className="max-w-xl opacity-90">Create a free account to log consumption, view analytics and download reports.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="secondary" size="xl" className="rounded-full" asChild><Link to="/register">Create account</Link></Button>
            <Button variant="glass" size="xl" asChild><Link to="/tips">Conservation tips</Link></Button>
          </div>
        </div>
      </Section>
    </>
  );
}
