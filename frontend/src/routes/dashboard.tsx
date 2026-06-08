import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge, type AnimalStatus } from "@/components/StatusBadge";
import { PlusCircle, Search, Beef, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Your herd — Livestock Guardian" }, { name: "description", content: "View and manage every animal in your registered herd." }] }),
  component: Dashboard,
});

type Animal = {
  id: string;
  name: string | null;
  tag_id: string | null;
  species: "cow" | "buffalo";
  breed: string | null;
  status: AnimalStatus;
  muzzle_image_url: string;
  front_image_url: string | null;
  left_image_url: string | null;
  right_image_url: string | null;
  bcs_score: number | null;
  estimated_price_pkr: number | null;
};

function Dashboard() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [loading, user, nav]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("animals")
        .select("id,name,tag_id,species,breed,status,muzzle_image_url,front_image_url,left_image_url,right_image_url,bcs_score,estimated_price_pkr")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });
      setAnimals((data ?? []) as Animal[]);
      setBusy(false);
    })();
  }, [user]);

  const filtered = animals.filter(a =>
    !q || [a.name, a.tag_id, a.breed].some(x => x?.toLowerCase().includes(q.toLowerCase()))
  );
  const stats = {
    total: animals.length,
    active: animals.filter(a=>a.status==="active").length,
    theft: animals.filter(a=>a.status==="theft").length,
    value: animals.reduce((s,a)=>s+(Number(a.estimated_price_pkr)||0),0),
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Your herd</h1>
          <p className="text-muted-foreground">Every animal, identified and protected.</p>
        </div>
        <Link to="/register"><Button size="lg" className="shadow-elegant"><PlusCircle className="mr-2 h-4 w-4" />Register new</Button></Link>
      </div>

      <div className="my-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total animals" value={stats.total} />
        <StatCard label="Active" value={stats.active} tone="success" />
        <StatCard label="Stolen" value={stats.theft} tone={stats.theft ? "danger" : "muted"} />
        <StatCard label="Estimated value" value={`Rs ${stats.value.toLocaleString()}`} />
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search by name, tag or breed…" className="pl-9" />
      </div>

      {busy ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({length:3}).map((_,i)=>(<div key={i} className="h-64 animate-pulse rounded-2xl bg-muted" />))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(a => <AnimalCard key={a.id} a={a} />)}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, tone = "default" }: { label: string; value: number | string; tone?: "default"|"success"|"danger"|"muted" }) {
  const toneCls = {
    default: "bg-card",
    success: "bg-card border-success/40",
    danger: "bg-card border-destructive/40",
    muted: "bg-muted/40",
  }[tone];
  return (
    <div className={`rounded-2xl border p-5 shadow-soft ${toneCls}`}>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl">{value}</p>
    </div>
  );
}

function AnimalCard({ a }: { a: Animal }) {
  const shots = [
    { url: a.front_image_url, label: "Front" },
    { url: a.left_image_url, label: "Left" },
    { url: a.right_image_url, label: "Right" },
  ].filter((s) => !!s.url) as { url: string; label: string }[];
  if (shots.length === 0) shots.push({ url: a.muzzle_image_url, label: "Muzzle" });

  const [idx, setIdx] = useState(0);
  const go = (e: React.MouseEvent, dir: 1 | -1) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i + dir + shots.length) % shots.length);
  };

  return (
    <Link to="/animal/$id" params={{ id: a.id }} className="group block overflow-hidden rounded-2xl border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-elegant">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={shots[idx].url} alt={`${a.name ?? "Animal"} – ${shots[idx].label}`} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
        <div className="absolute right-3 top-3"><StatusBadge status={a.status} /></div>
        <div className="absolute left-3 top-3 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
          {shots[idx].label}
        </div>
        {shots.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => go(e, -1)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-background/85 text-foreground opacity-0 shadow-soft backdrop-blur transition group-hover:opacity-100 hover:bg-background"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(e) => go(e, 1)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-background/85 text-foreground opacity-0 shadow-soft backdrop-blur transition group-hover:opacity-100 hover:bg-background"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {shots.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-4 bg-primary" : "w-1.5 bg-background/70"}`} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-xl">{a.name || "Unnamed"}</h3>
          <span className="text-xs text-muted-foreground">{a.tag_id ?? "—"}</span>
        </div>
        <p className="text-sm text-muted-foreground capitalize">{a.species} • {a.breed ?? "Unknown breed"}</p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span>BCS <span className="font-semibold text-foreground">{a.bcs_score ?? "—"}</span></span>
          <span className="font-semibold">Rs {Number(a.estimated_price_pkr ?? 0).toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed p-16 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-accent text-primary"><Beef className="h-7 w-7" /></div>
      <h3 className="font-display text-2xl">No animals yet</h3>
      <p className="mt-1 text-muted-foreground">Register your first cow or buffalo to begin.</p>
      <Link to="/register" className="mt-6 inline-block"><Button size="lg"><PlusCircle className="mr-2 h-4 w-4" />Register first animal</Button></Link>
    </div>
  );
}
