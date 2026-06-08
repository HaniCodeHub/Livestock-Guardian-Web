import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { computeMuzzleHash, hammingSimilarity } from "@/lib/muzzle";
import { Button } from "@/components/ui/button";
import { Camera, ScanLine, AlertTriangle, ShieldCheck, Loader2, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { StatusBadge, type AnimalStatus } from "@/components/StatusBadge";

export const Route = createFileRoute("/scan")({
  head: () => ({ meta: [{ title: "Scan a muzzle — Livestock Guardian" }, { name: "description", content: "Identify any registered cow or buffalo from a single muzzle photo." }] }),
  component: Scan,
});

type ScanResult =
  | { kind: "match"; animal: AnimalRow; sim: number; ownerName: string | null; ownerPhone: string | null }
  | { kind: "low"; sim: number }
  | { kind: "none" };

type AnimalRow = {
  id: string; name: string | null; tag_id: string | null;
  species: "cow"|"buffalo"; breed: string | null;
  status: AnimalStatus; muzzle_image_url: string;
  front_image_url: string | null;
  left_image_url: string | null;
  right_image_url: string | null;
  muzzle_hash: string; owner_id: string;
};

function Scan() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<"idle"|"working">("idle");
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);

  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [loading, user, nav]);

  const onFile = async (f: File) => {
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setStage("working");
    const h = await computeMuzzleHash(f);
    const { data } = await supabase.from("animals").select("id,name,tag_id,species,breed,status,muzzle_image_url,front_image_url,left_image_url,right_image_url,muzzle_hash,owner_id");
    const best = (data ?? []).reduce<{ sim: number; row: AnimalRow | null }>((acc, a) => {
      const sim = hammingSimilarity(h, a.muzzle_hash);
      return sim > acc.sim ? { sim, row: a as AnimalRow } : acc;
    }, { sim: 0, row: null });

    if (best.sim < 0.85 || !best.row) {
      setResult({ kind: "none" });
    } else if (best.sim < 0.95) {
      setResult({ kind: "low", sim: best.sim });
    } else {
      const { data: prof } = await supabase.from("profiles").select("full_name,phone").eq("id", best.row.owner_id).maybeSingle();
      setResult({ kind: "match", animal: best.row, sim: best.sim, ownerName: prof?.full_name ?? null, ownerPhone: prof?.phone ?? null });
    }
    setStage("idle");
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl">Scan a muzzle</h1>
      <p className="text-muted-foreground">Verify an animal's identity, owner and theft status.</p>

      <div className="mt-8 rounded-3xl border bg-card p-6 shadow-soft">
        <div
          onClick={() => fileRef.current?.click()}
          className="grid aspect-[16/9] cursor-pointer place-items-center overflow-hidden rounded-2xl border-2 border-dashed bg-muted/40 transition hover:border-primary"
        >
          {preview ? (
            <img src={preview} alt="scan" className="h-full w-full object-cover" />
          ) : (
            <div className="text-center">
              <Camera className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
              <p className="font-medium">Capture a muzzle photo to begin</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e)=>e.target.files?.[0]&&onFile(e.target.files[0])} />

        {stage === "working" && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-accent/40 px-4 py-3 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Biometric matching in progress…
          </div>
        )}
      </div>

      {result && <ResultPanel result={result} onRetry={() => fileRef.current?.click()} />}
    </div>
  );
}

function ResultPanel({ result, onRetry }: { result: ScanResult; onRetry: () => void }) {
  if (result.kind === "none") {
    return (
      <div className="mt-6 rounded-3xl border bg-card p-6 text-center shadow-soft">
        <ScanLine className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
        <h3 className="font-display text-2xl">No match found</h3>
        <p className="mt-1 text-muted-foreground">This muzzle isn't registered yet.</p>
        <Link to="/register"><Button className="mt-4">Register this animal</Button></Link>
      </div>
    );
  }

  if (result.kind === "low") {
    return (
      <div className="mt-6 rounded-3xl border bg-warning/10 p-6 text-center shadow-soft">
        <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-warning" />
        <h3 className="font-display text-2xl">Low confidence ({(result.sim*100).toFixed(0)}%)</h3>
        <p className="mt-1 text-muted-foreground">Re-capture the muzzle in better lighting for a definitive match.</p>
        <Button onClick={onRetry} className="mt-4" variant="outline"><RefreshCw className="mr-2 h-4 w-4" />High-quality re-scan</Button>
      </div>
    );
  }

  const a = result.animal;
  const stolen = a.status === "theft";
  return (
    <div className={`mt-6 overflow-hidden rounded-3xl border shadow-elegant ${stolen ? "bg-danger text-destructive-foreground border-destructive" : "bg-card"}`}>
      {stolen && (
        <div className="bg-destructive p-4 text-center text-sm font-bold uppercase tracking-wider text-destructive-foreground">
          <AlertTriangle className="mr-2 inline h-4 w-4" /> THEFT ALERT — This animal is reported stolen
        </div>
      )}
      <div className="grid gap-6 p-6 md:grid-cols-[220px_1fr]">
        <MatchGallery a={a} />

        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-display text-3xl">{a.name || "Unnamed"}</h3>
            <StatusBadge status={a.status} />
            <span className="ml-auto rounded-full bg-success/20 px-3 py-1 text-xs font-semibold text-success">
              {(result.sim*100).toFixed(1)}% match
            </span>
          </div>
          <p className={`text-sm capitalize ${stolen ? "opacity-90" : "text-muted-foreground"}`}>
            {a.species} · {a.breed ?? "Unknown breed"} · Tag {a.tag_id ?? "—"}
          </p>
          <div className={`mt-4 grid gap-2 text-sm ${stolen ? "" : "text-muted-foreground"}`}>
            <p><ShieldCheck className="mr-1 inline h-4 w-4" /> Owner: <strong className={stolen ? "" : "text-foreground"}>{result.ownerName || "—"}</strong></p>
            {result.ownerPhone && <p>Contact: <strong className={stolen ? "" : "text-foreground"}>{result.ownerPhone}</strong></p>}
          </div>
          <div className="mt-5 flex gap-2">
            <Link to="/animal/$id" params={{ id: a.id }}><Button variant={stolen ? "secondary" : "default"}>View full profile</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchGallery({ a }: { a: AnimalRow }) {
  const shots = [
    { url: a.front_image_url, label: "Front" },
    { url: a.left_image_url, label: "Left side" },
    { url: a.right_image_url, label: "Right side" },
  ].filter((s) => !!s.url) as { url: string; label: string }[];
  if (shots.length === 0) shots.push({ url: a.muzzle_image_url, label: "Muzzle" });

  const [idx, setIdx] = useState(0);
  const go = (dir: 1 | -1) => setIdx((i) => (i + dir + shots.length) % shots.length);
  const showMuzzleThumb = !!a.muzzle_image_url && shots[0].label !== "Muzzle";

  return (
    <div className="space-y-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted shadow-soft">
        <img src={shots[idx].url} alt={`${a.name ?? "match"} – ${shots[idx].label}`} className="h-full w-full object-cover" />
        <div className="absolute left-2 top-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur">
          {shots[idx].label}
        </div>
        {showMuzzleThumb && (
          <div className="absolute right-2 top-2 h-16 w-16 overflow-hidden rounded-lg border-2 border-background shadow-elegant">
            <img src={a.muzzle_image_url} alt="Muzzle on file" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-background/85 py-0.5 text-center text-[8px] font-semibold uppercase tracking-wider text-foreground">
              Muzzle
            </div>
          </div>
        )}
        {shots.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-background/85 text-foreground shadow-soft backdrop-blur transition hover:bg-background">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-background/85 text-foreground shadow-soft backdrop-blur transition hover:bg-background">
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
    </div>
  );
}
