import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, BrainCircuit, Container, Gauge, Leaf, ShieldAlert } from "lucide-react";
import { PageHero, Section } from "@/components/site/PageHero";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — AquaSmart" },
      { name: "description", content: "Consumption monitoring, leakage detection, AI prediction, tank monitoring and analytics." },
      { property: "og:title", content: "AquaSmart Features" },
      { property: "og:description", content: "Six smart capabilities for complete water management." },
    ],
  }),
  component: Features,
});

const features = [
  { icon: Gauge, title: "Water Consumption Monitoring", text: "Log and visualise daily and monthly usage with historical charts and benchmark analysis.", to: "/monitoring" },
  { icon: ShieldAlert, title: "Water Leakage Detection", text: "Compare live flow against expected baselines and raise Normal, Warning or Leakage alerts.", to: "/leakage" },
  { icon: BrainCircuit, title: "AI-Based Water Prediction", text: "Forecast upcoming consumption and compare actual versus predicted usage.", to: "/prediction" },
  { icon: Container, title: "Water Tank Level Monitoring", text: "Ultrasonic sensors report tank levels so you never run dry or overflow.", to: "/dashboard" },
  { icon: Leaf, title: "Smart Water Conservation", text: "Personalised tips for households, farms and leak prevention.", to: "/tips" },
  { icon: BarChart3, title: "Water Usage Analytics", text: "Daily, weekly and monthly reports with comparison charts and CSV export.", to: "/reports" },
] as const;

function Features() {
  return (
    <>
      <PageHero eyebrow="Features" title="Intelligence for every litre" subtitle="Six integrated modules that turn raw sensor data into savings." />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card-hover group flex flex-col rounded-2xl border bg-card p-7 shadow-soft">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft"><f.icon className="h-6 w-6" /></span>
              <h3 className="mt-5 text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 flex-1 text-muted-foreground">{f.text}</p>
              <Link to={f.to} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
