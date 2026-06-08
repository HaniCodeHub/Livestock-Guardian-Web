import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { analyzeAnimal, type FullAnalysis } from "@/lib/analyze.functions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Loader2, Sparkles, RotateCcw } from "lucide-react";

export type ToolMode = "breed" | "bcs" | "price" | "weight" | "health";

type Field = { label: string; render: (r: FullAnalysis) => React.ReactNode };

const VIEWS: Record<ToolMode, { fields: Field[]; tip: string }> = {
  breed: {
    tip: "Capture a clear side or 3/4 view of the animal showing head, hump and body markings.",
    fields: [
      { label: "Predicted breed", render: (r) => <span className="font-display text-3xl">{r.breed}</span> },
      { label: "Confidence", render: (r) => <Bar value={r.breed_confidence} /> },
      { label: "Coat colour", render: (r) => r.color },
      { label: "Notes", render: (r) => <p className="text-sm text-muted-foreground">{r.health_summary}</p> },
    ],
  },
  bcs: {
    tip: "Use the side profile reference. The full body from shoulder to hip should be visible.",
    fields: [
      { label: "BCS", render: (r) => <span className="font-display text-5xl">{r.bcs_score}<span className="text-2xl text-muted-foreground">/5</span></span> },
      { label: "Interpretation", render: (r) => <p className="text-sm text-muted-foreground">{r.health_summary}</p> },
    ],
  },
  price: {
    tip: "A clear full-body photo gives the best price estimate. Mention age & weight if known.",
    fields: [
      { label: "Fair market value", render: (r) => <span className="font-display text-4xl">Rs {r.estimated_price_pkr.toLocaleString()}</span> },
      { label: "Driving factors", render: (r) => <p className="text-sm">{r.breed} · ~{r.estimated_weight_kg} kg · BCS {r.bcs_score} · ~{r.estimated_age_months} mo</p> },
      { label: "Reasoning", render: (r) => <p className="text-sm text-muted-foreground">{r.health_summary}</p> },
    ],
  },
  weight: {
    tip: "Side-on photo with the full body in frame gives best heart-girth estimation.",
    fields: [
      { label: "Estimated live weight", render: (r) => <span className="font-display text-5xl">{r.estimated_weight_kg} <span className="text-xl text-muted-foreground">kg</span></span> },
      { label: "Reasoning", render: (r) => <p className="text-sm text-muted-foreground">{r.health_summary}</p> },
    ],
  },
  health: {
    tip: "Front and side photos help. Make sure eyes, coat and posture are clearly visible.",
    fields: [
      { label: "Overall health", render: (r) => <p>{r.health_summary}</p> },
      { label: "Concerns", render: (r) => r.health_concerns.length ? (
        <ul className="list-disc space-y-1 pl-5 text-sm">{r.health_concerns.map((c, i) => <li key={i}>{c}</li>)}</ul>
      ) : <p className="text-sm text-success">No visible concerns</p> },
      { label: "Recommendations", render: (r) => (
        <ul className="list-disc space-y-1 pl-5 text-sm">{r.recommendations.map((c, i) => <li key={i}>{c}</li>)}</ul>
      ) },
    ],
  },
};

export function AiToolPanel({ mode, title, kicker }: { mode: ToolMode; title: string; kicker: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const analyze = useServerFn(analyzeAnimal);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [species, setSpecies] = useState<"cow" | "buffalo">("cow");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<FullAnalysis | null>(null);

  const view = VIEWS[mode];

  const onFile = async (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setBusy(true);
    try {
      const b64 = await fileToBase64(f);
      const r = await analyze({ data: { imageBase64: b64, species, mode } });
      setResult(r);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => { setFile(null); setPreview(""); setResult(null); };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">{kicker}</p>
      <h1 className="mt-1 font-display text-4xl md:text-5xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{view.tip}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <div className="mb-4 flex items-end gap-3">
            <div className="flex-1">
              <Label className="mb-2 block">Species</Label>
              <Select value={species} onValueChange={(v) => setSpecies(v as "cow"|"buffalo")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cow">Cow</SelectItem>
                  <SelectItem value="buffalo">Buffalo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {file && <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="mr-1 h-4 w-4" />Reset</Button>}
          </div>

          <div
            onClick={() => !busy && fileRef.current?.click()}
            className="grid aspect-[4/3] cursor-pointer place-items-center overflow-hidden rounded-2xl border-2 border-dashed bg-muted/40 transition hover:border-primary"
          >
            {preview ? (
              <div className="relative h-full w-full">
                <img src={preview} alt="upload" className="h-full w-full object-cover" />
                {busy && (
                  <div className="absolute inset-0 grid place-items-center bg-background/60 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2 text-sm font-medium">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      AI is analysing…
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Camera className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                <p className="font-medium">Tap to capture or upload</p>
                <p className="text-sm text-muted-foreground">Live camera or gallery — both work.</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
                 onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> AI result
          </div>
          {!result && !busy && (
            <p className="text-muted-foreground">Upload a photo to get an instant {mode} reading. No data is saved unless you choose to register the animal.</p>
          )}
          {busy && <div className="space-y-3">{[0,1,2].map(i => <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />)}</div>}
          {result && (
            <div className="space-y-5">
              {view.fields.map((f, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{f.label}</p>
                  <div className="mt-1">{f.render(result)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Bar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-sm font-medium">{pct}%</p>
    </div>
  );
}

async function fileToBase64(f: File): Promise<string> {
  const buf = await f.arrayBuffer();
  let bin = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
