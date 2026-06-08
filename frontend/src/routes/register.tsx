import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useServerFn } from "@tanstack/react-start";
import { analyzeAnimal, type FullAnalysis } from "@/lib/analyze.functions";
import { computeMuzzleHash, hammingSimilarity } from "@/lib/muzzle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MuzzleGuide } from "@/components/MuzzleGuide";
import { Camera, Loader2, ScanLine, Sparkles, RotateCcw, Wand2, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register animal — Livestock Guardian" }, { name: "description", content: "Register a new cow or buffalo. AI suggests breed, BCS, age, weight & price — you confirm or edit before saving." }] }),
  component: Register,
});

type Stage = "idle"|"hashing"|"matching"|"analyzing"|"ready"|"saving";

const BREEDS_COW = ["Sahiwal","Cholistani","Tharparkar","Red Sindhi","Achai","Dhanni","Bhagnari","Crossbreed","Other"];
const BREEDS_BUF = ["Nili-Ravi","Kundi","Azakheli","Crossbreed","Other"];

function Register() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const muzzleRef = useRef<HTMLInputElement>(null);
  const frontRef = useRef<HTMLInputElement>(null);
  const leftRef = useRef<HTMLInputElement>(null);
  const rightRef = useRef<HTMLInputElement>(null);
  const analyze = useServerFn(analyzeAnimal);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string>("");
  const [leftFile, setLeftFile] = useState<File | null>(null);
  const [leftPreview, setLeftPreview] = useState<string>("");
  const [rightFile, setRightFile] = useState<File | null>(null);
  const [rightPreview, setRightPreview] = useState<string>("");
  const [stage, setStage] = useState<Stage>("idle");
  const [hash, setHash] = useState<string>("");

  // Editable fields — initially empty, hydrated by AI as suggestions
  const [species, setSpecies] = useState<"cow"|"buffalo">("cow");
  const [gender, setGender] = useState<"male"|"female"|"unknown">("unknown");
  const [ownerName, setOwnerName] = useState("");
  const [name, setName] = useState("");
  const [tagId, setTagId] = useState("");
  const [breed, setBreed] = useState("");
  const [color, setColor] = useState("");
  const [ageMonths, setAgeMonths] = useState<string>("");
  const [bcs, setBcs] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);
  const [aiHasSuggestions, setAiHasSuggestions] = useState(false);

  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [loading, user, nav]);

  // Pre-fill owner name from profile
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle()
      .then(({ data }) => { if (data?.full_name && !ownerName) setOwnerName(data.full_name); });
  }, [user]);

  const reset = () => {
    setFile(null); setPreview(""); setStage("idle"); setHash("");
    setFrontFile(null); setFrontPreview("");
    setLeftFile(null); setLeftPreview("");
    setRightFile(null); setRightPreview("");
    setBreed(""); setColor(""); setAgeMonths(""); setBcs(""); setWeight(""); setPrice("");
    setAiConfidence(null); setAiHasSuggestions(false); setNotes("");
  };

  const uploadOne = async (f: File): Promise<string> => {
    const path = `${user!.id}/${crypto.randomUUID()}.jpg`;
    const { error } = await supabase.storage.from("muzzles").upload(path, f, { contentType: f.type });
    if (error) throw error;
    return supabase.storage.from("muzzles").getPublicUrl(path).data.publicUrl;
  };

  const applySuggestions = (r: FullAnalysis) => {
    setBreed(r.breed);
    setColor(r.color);
    setAgeMonths(String(r.estimated_age_months));
    setBcs(String(r.bcs_score));
    setWeight(String(r.estimated_weight_kg));
    setPrice(String(r.estimated_price_pkr));
    setAiConfidence(r.breed_confidence);
    setAiHasSuggestions(true);
    setNotes(r.health_summary);
  };

  const onFile = async (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStage("hashing");
    const h = await computeMuzzleHash(f);
    setHash(h);
    setStage("matching");

    const { data: existing } = await supabase.from("animals").select("id,muzzle_hash").limit(2000);
    const best = (existing ?? []).reduce<{ sim: number; id: string | null }>((acc, a) => {
      const sim = hammingSimilarity(h, a.muzzle_hash);
      return sim > acc.sim ? { sim, id: a.id } : acc;
    }, { sim: 0, id: null });

    if (best.sim >= 0.95 && best.id) {
      toast.error("This animal is already registered.", { description: "Redirecting to its profile." });
      nav({ to: "/animal/$id", params: { id: best.id } });
      return;
    }
    if (best.sim >= 0.85 && best.sim < 0.95) {
      toast.warning("Possible duplicate detected", { description: `${(best.sim*100).toFixed(0)}% similar — please re-capture in better light.` });
      setStage("idle");
      return;
    }

    setStage("analyzing");
    const b64 = await fileToBase64(f);
    const r = await analyze({ data: { imageBase64: b64, species, mode: "full" } });
    applySuggestions(r);
    setStage("ready");
  };

  const reanalyze = async () => {
    if (!file) return;
    setStage("analyzing");
    const b64 = await fileToBase64(file);
    const r = await analyze({ data: { imageBase64: b64, species, mode: "full" } });
    applySuggestions(r);
    setStage("ready");
  };

  const save = async () => {
    if (!user || !file) return;
    if (!breed) return toast.error("Please confirm the breed before saving.");
    if (!ownerName.trim()) return toast.error("Please enter the owner name.");
    setStage("saving");
    try {
      const muzzleUrl = await uploadOne(file);
      const frontUrl = frontFile ? await uploadOne(frontFile) : null;
      const leftUrl = leftFile ? await uploadOne(leftFile) : null;
      const rightUrl = rightFile ? await uploadOne(rightFile) : null;
      const { data: row, error } = await supabase.from("animals").insert({
        owner_id: user.id,
        owner_name: ownerName || null,
        name: name || null,
        tag_id: tagId || null,
        species,
        gender,
        breed,
        ai_breed_confidence: aiConfidence,
        age_months: ageMonths ? Number(ageMonths) : null,
        color: color || null,
        muzzle_image_url: muzzleUrl,
        muzzle_hash: hash,
        front_image_url: frontUrl,
        left_image_url: leftUrl,
        right_image_url: rightUrl,
        bcs_score: bcs ? Number(bcs) : null,
        weight_kg: weight ? Number(weight) : null,
        estimated_price_pkr: price ? Number(price) : null,
        notes: notes || null,
      }).select("id").single();
      if (error) throw error;
      toast.success("Animal registered");
      nav({ to: "/animal/$id", params: { id: row.id } });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
      setStage("ready");
    }
  };

  const breeds = species === "cow" ? BREEDS_COW : BREEDS_BUF;
  const canSave = stage !== "saving" && stage !== "analyzing" && stage !== "hashing" && file !== null && breed !== "";

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">New registration</p>
          <h1 className="mt-1 font-display text-4xl md:text-5xl">Register a new animal</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            AI fills in <em>suggestions</em> from the photo. You stay in control — confirm, edit, or override every value before saving.
          </p>
        </div>
        {file && <Button variant="outline" onClick={reset}><RotateCcw className="mr-1 h-4 w-4" />Start over</Button>}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
        {/* Left: capture */}
        <div className="space-y-4">
          <div className="rounded-3xl border bg-card p-6 shadow-soft">
            <h2 className="flex items-center gap-2 font-display text-xl"><span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>Muzzle photo</h2>
            <div className="mt-4">
              <Label className="mb-2 block">Species</Label>
              <Select value={species} onValueChange={(v) => setSpecies(v as "cow"|"buffalo")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cow">Cow</SelectItem>
                  <SelectItem value="buffalo">Buffalo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div
              onClick={() => muzzleRef.current?.click()}
              className="relative mt-4 grid aspect-[4/3] cursor-pointer place-items-center overflow-hidden rounded-2xl border-2 border-dashed bg-muted/40 transition hover:border-primary"
            >
              {preview ? (
                <>
                  <img src={preview} alt="muzzle preview" className="h-full w-full object-cover" />
                  {stage === "analyzing" && (
                    <div className="absolute inset-0 grid place-items-center bg-background/60 backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-2 text-sm font-medium">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" /> Reading the muzzle…
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center">
                  <Camera className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                  <p className="font-medium">Tap to capture or upload</p>
                  <p className="text-sm text-muted-foreground">Close-up of the muzzle, well lit.</p>
                </div>
              )}
            </div>
            <input ref={muzzleRef} type="file" accept="image/*" capture="environment" className="hidden"
                   onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
            <ProcessingBanner stage={stage} />
          </div>

          {/* Identity gallery */}
          <div className="rounded-3xl border bg-card p-6 shadow-soft">
            <h2 className="flex items-center gap-2 font-display text-xl">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
              Identity gallery
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a front portrait and both side profiles. The front photo is shown to anyone who scans this animal.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <PhotoTile label="Front" hint="Face the camera" preview={frontPreview}
                onClick={() => frontRef.current?.click()} />
              <PhotoTile label="Left side" hint="Full left profile" preview={leftPreview}
                onClick={() => leftRef.current?.click()} />
              <PhotoTile label="Right side" hint="Full right profile" preview={rightPreview}
                onClick={() => rightRef.current?.click()} />
            </div>
            <input ref={frontRef} type="file" accept="image/*" capture="environment" className="hidden"
              onChange={(e)=> e.target.files?.[0] && (setFrontFile(e.target.files[0]), setFrontPreview(URL.createObjectURL(e.target.files[0])))} />
            <input ref={leftRef} type="file" accept="image/*" capture="environment" className="hidden"
              onChange={(e)=> e.target.files?.[0] && (setLeftFile(e.target.files[0]), setLeftPreview(URL.createObjectURL(e.target.files[0])))} />
            <input ref={rightRef} type="file" accept="image/*" capture="environment" className="hidden"
              onChange={(e)=> e.target.files?.[0] && (setRightFile(e.target.files[0]), setRightPreview(URL.createObjectURL(e.target.files[0])))} />
          </div>

          <MuzzleGuide />
        </div>

        {/* Right: editable form */}
        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
              Confirm details
            </h2>
            {aiHasSuggestions && (
              <Button size="sm" variant="outline" onClick={reanalyze} disabled={stage === "analyzing"}>
                <Wand2 className="mr-1 h-3.5 w-3.5" /> Re-run AI
              </Button>
            )}
          </div>

          {!aiHasSuggestions && (
            <p className="mt-2 text-sm text-muted-foreground">Upload a photo first, or fill the fields manually.</p>
          )}
          {aiHasSuggestions && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1 text-xs font-medium">
              <Sparkles className="h-3 w-3 text-primary" />
              AI suggestions filled in — please verify
            </div>
          )}

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Name (optional)">
              <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g. Lakshmi" />
            </Field>
            <Field label="Tag ID (optional)">
              <Input value={tagId} onChange={(e)=>setTagId(e.target.value)} placeholder="PB-2026-0042" />
            </Field>

            <Field label="Owner name *">
              <Input value={ownerName} onChange={(e)=>setOwnerName(e.target.value)} placeholder="e.g. Muhammad Ali" />
            </Field>

            <Field label="Gender *">
              <Select value={gender} onValueChange={(v)=>setGender(v as "male"|"female"|"unknown")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Breed *" suggested={aiHasSuggestions}>
              <Select value={breed} onValueChange={setBreed}>
                <SelectTrigger><SelectValue placeholder="Select a breed…" /></SelectTrigger>
                <SelectContent>
                  {breeds.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  {aiHasSuggestions && breed && !breeds.includes(breed) && (
                    <SelectItem value={breed}>{breed} (AI)</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {aiConfidence !== null && (
                <p className="mt-1 text-xs text-muted-foreground">AI confidence: {(aiConfidence*100).toFixed(0)}%</p>
              )}
            </Field>

            <Field label="Coat colour" suggested={aiHasSuggestions}>
              <Input value={color} onChange={(e)=>setColor(e.target.value)} placeholder="Reddish brown" />
            </Field>

            <Field label="Age (months)" suggested={aiHasSuggestions}>
              <Input type="number" min={1} max={300} value={ageMonths} onChange={(e)=>setAgeMonths(e.target.value)} placeholder="36" />
            </Field>

            <Field label="BCS (1–5)" suggested={aiHasSuggestions}>
              <Input type="number" min={1} max={5} step="0.5" value={bcs} onChange={(e)=>setBcs(e.target.value)} placeholder="3.5" />
            </Field>

            <Field label="Weight (kg)" suggested={aiHasSuggestions}>
              <Input type="number" min={20} max={1500} value={weight} onChange={(e)=>setWeight(e.target.value)} placeholder="380" />
            </Field>

            <Field label="Market value (Rs)" suggested={aiHasSuggestions}>
              <Input type="number" min={0} value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="220000" />
            </Field>

            <div className="md:col-span-2">
              <Field label="Notes / health summary">
                <Textarea value={notes} onChange={(e)=>setNotes(e.target.value)} rows={3} placeholder="Calving history, vaccinations, any visible issues…" />
              </Field>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button size="lg" className="shadow-elegant" disabled={!canSave} onClick={save}>
              {stage === "saving" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : "Register & generate digital ID"}
            </Button>
            <p className="text-xs text-muted-foreground">* Breed is required. All other fields can be added or edited later.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhotoTile({ label, hint, preview, onClick }: { label: string; hint: string; preview: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-dashed bg-muted/40 text-left transition hover:border-primary">
      {preview ? (
        <>
          <img src={preview} alt={label} className="h-full w-full object-cover" />
          <div className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-success text-success-foreground shadow">
            <Check className="h-3.5 w-3.5" />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-[11px] font-semibold uppercase tracking-wide text-white">
            {label}
          </div>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-1 p-2 text-center">
          <Camera className="h-5 w-5 text-muted-foreground" />
          <p className="text-xs font-semibold">{label}</p>
          <p className="text-[10px] leading-tight text-muted-foreground">{hint}</p>
        </div>
      )}
    </button>
  );
}

function Field({ label, suggested, children }: { label: string; suggested?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
        {suggested && <span className="rounded-full bg-gold/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold-foreground">AI</span>}
      </div>
      {children}
    </div>
  );
}

function ProcessingBanner({ stage }: { stage: Stage }) {
  if (stage === "idle" || stage === "ready") return null;
  const map: Record<string, { label: string; icon: React.ReactNode }> = {
    hashing:   { label: "Generating biometric fingerprint…", icon: <Loader2 className="h-4 w-4 animate-spin" /> },
    matching:  { label: "Checking the global registry for duplicates…", icon: <ScanLine className="h-4 w-4 animate-pulse" /> },
    analyzing: { label: "AI reading breed, BCS, weight, age & price…", icon: <Sparkles className="h-4 w-4 animate-pulse" /> },
    saving:    { label: "Saving to the ownership ledger…", icon: <Loader2 className="h-4 w-4 animate-spin" /> },
  };
  const m = map[stage];
  if (!m) return null;
  return (
    <div className="mt-4 flex items-center gap-2 rounded-xl bg-accent/40 px-4 py-3 text-sm">{m.icon}<span>{m.label}</span></div>
  );
}

async function fileToBase64(f: File): Promise<string> {
  const buf = await f.arrayBuffer();
  let bin = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
