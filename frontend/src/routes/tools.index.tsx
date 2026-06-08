import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Banknote, Dna, HeartPulse, Scale, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: "AI tools — Livestock Guardian" },
      { name: "description", content: "Instant AI tools for breed identification, body condition scoring, weight, price and live health checks." },
    ],
  }),
  component: ToolsHub,
});

const TOOLS = [
  { to: "/tools/breed",  icon: Dna,        label: "Breed identifier", body: "Identify South Asian cattle and buffalo breeds from a single photo." },
  { to: "/tools/bcs",    icon: Activity,   label: "Body condition score", body: "Get a 1–5 BCS reading with reasoning. No registration needed." },
  { to: "/tools/weight", icon: Scale,      label: "Weight estimator", body: "Visual heart-girth estimation in kilograms." },
  { to: "/tools/price",  icon: Banknote,   label: "Market value",    body: "Fair Pakistani mandi price in PKR based on breed, BCS, age & weight." },
  { to: "/tools/health", icon: HeartPulse, label: "Live health check", body: "Capture or upload — surface visible concerns and husbandry tips." },
] as const;

function ToolsHub() {
  return (
    <div className="container mx-auto px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Standalone AI tools</p>
      <h1 className="mt-1 max-w-3xl font-display text-5xl">Use the AI without registering.</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Five focused tools — breed, BCS, weight, price and health — each tuned for a single question.
        Nothing is saved unless you decide to register the animal afterwards.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map(({ to, icon: Icon, label, body }) => (
          <Link key={to} to={to} className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-elegant">
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-hero text-primary-foreground shadow-elegant">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-2xl">{label}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Open tool <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
            <Sparkles className="absolute -right-3 -top-3 h-16 w-16 text-primary/5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
