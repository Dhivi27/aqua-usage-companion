import { Link } from "@tanstack/react-router";
import { Droplets } from "lucide-react";
import { toolLinks } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-gradient-deep text-deep-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <Droplets className="h-6 w-6 text-primary-glow" /> AquaSmart
          </div>
          <p className="mt-3 max-w-md text-sm opacity-80">
            AI-Based Water Resource Management and Conservation — an Engineering Environmental Studies
            project demonstrating how AI, Machine Learning and IoT can monitor, predict and conserve water.
          </p>
          <p className="mt-4 text-xs opacity-60">Sensor readings and predictions shown are simulated for demonstration.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm opacity-80">
            <li><Link to="/about" className="hover:opacity-100">About</Link></li>
            <li><Link to="/features" className="hover:opacity-100">Features</Link></li>
            <li><Link to="/solutions" className="hover:opacity-100">Solutions</Link></li>
            <li><Link to="/dashboard" className="hover:opacity-100">Dashboard</Link></li>
            <li><Link to="/contact" className="hover:opacity-100">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Tools</h4>
          <ul className="mt-3 space-y-2 text-sm opacity-80">
            {toolLinks.map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:opacity-100">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-deep-foreground/10 py-5 text-center text-xs opacity-60">
        © 2026 AquaSmart · Academic project
      </div>
    </footer>
  );
}
