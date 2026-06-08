import { createFileRoute, Link } from "@tanstack/react-router";
import { ScanLine, Repeat, Brain, AlertTriangle, Sparkles, ArrowRight, Dna, Activity, Scale, Banknote, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroScanFx } from "@/components/HeroScanFx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Livestock Guardian — AI biometric identity for cattle & buffalo" },
      { name: "description", content: "Register, protect and verify cows and buffaloes with muzzle biometrics, AI health scoring and a tamper-proof ownership ledger built for Pakistani farmers." },
      { property: "og:title", content: "Livestock Guardian" },
      { property: "og:description", content: "AI biometric identity & ownership ledger for South Asian livestock." },
    ],
  }),
  component: Landing,
});

const TOOLS = [
  { to: "/tools/breed",  icon: Dna,        label: "Breed" },
  { to: "/tools/bcs",    icon: Activity,   label: "BCS" },
  { to: "/tools/weight", icon: Scale,      label: "Weight" },
  { to: "/tools/price",  icon: Banknote,   label: "Price" },
  { to: "/tools/health", icon: HeartPulse, label: "Health" },
] as const;

function Landing() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="container mx-auto grid gap-10 px-4 py-16 md:grid-cols-2 md:py-24 lg:gap-16">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
              <Sparkles className="h-3 w-3 text-primary" /> Built for farmers in Pakistan
            </span>
            <h1 className="font-display text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              A <span className="text-primary">digital identity</span> for every cow & buffalo.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Muzzle biometrics, AI health scoring and a tamper-proof ownership ledger — ending theft, fraud and lost records, one scan at a time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login"><Button size="lg" className="shadow-elegant">Register your herd <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
              <Link to="/tools"><Button size="lg" variant="outline"><Sparkles className="mr-2 h-4 w-4" />Try AI tools — no signup</Button></Link>
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t pt-8 text-sm">
              <Stat k=">90%" v="Match accuracy" />
              <Stat k="<3s" v="Identity retrieval" />
              <Stat k="0" v="Duplicate IDs" />
            </dl>
          </div>
          <HeroScanFx />
        </div>
      </section>

      <section className="container mx-auto px-4 pb-4">
        <div className="rounded-3xl border bg-card p-5 shadow-soft md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Standalone AI tools</p>
              <h2 className="font-display text-2xl">Five focused readings, one photo each.</h2>
            </div>
            <Link to="/tools" className="text-sm font-semibold text-primary hover:underline">View all <ArrowRight className="inline h-3 w-3" /></Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {TOOLS.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to} className="group flex items-center gap-3 rounded-xl border bg-background p-3 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-soft">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-primary"><Icon className="h-4 w-4" /></div>
                <div className="flex-1 font-semibold">{label}</div>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <h2 className="mb-3 max-w-2xl font-display text-4xl">Three layers of protection.</h2>
        <p className="mb-12 max-w-2xl text-muted-foreground">From the field to the market — everything an animal needs to be uniquely, undeniably yours.</p>
        <div className="grid gap-6 md:grid-cols-3">
          <Feature icon={<ScanLine className="h-5 w-5" />} title="Muzzle biometrics" body="A perceptual fingerprint of each muzzle is matched against the global registry. Duplicates are rejected at the gate." />
          <Feature icon={<Brain className="h-5 w-5" />} title="AI insights" body="Breed, BCS, age, weight and a fair PKR market valuation — generated in seconds. Always editable, never auto-final." />
          <Feature icon={<Repeat className="h-5 w-5" />} title="Ownership ledger" body="Every transfer is signed, timestamped and verifiable. Theft reports flag the animal globally for any future scan." />
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="overflow-hidden rounded-3xl bg-danger p-10 text-destructive-foreground shadow-elegant md:p-14">
          <AlertTriangle className="h-10 w-10" />
          <h2 className="mt-4 max-w-2xl font-display text-4xl">If it's stolen, every scan tells the truth.</h2>
          <p className="mt-3 max-w-xl opacity-90">
            Mark an animal as stolen and our network instantly flags it. The next farmer, vet or
            mandi who scans that muzzle sees a high-visibility alert and your contact details.
          </p>
        </div>
      </section>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="font-display text-3xl text-primary">{k}</dt>
      <dd className="text-muted-foreground">{v}</dd>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="group rounded-2xl border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-elegant">
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary">{icon}</div>
      <h3 className="font-display text-xl">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
