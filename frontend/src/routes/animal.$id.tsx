import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { StatusBadge, type AnimalStatus } from "@/components/StatusBadge";
import { AlertTriangle, ArrowLeft, Banknote, Repeat, Skull, ShieldCheck, ShieldAlert, Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/animal/$id")({
  head: () => ({ meta: [{ title: "Animal profile — Livestock Guardian" }, { name: "description", content: "Full digital identity, health insights and ownership history for a registered animal." }] }),
  component: AnimalDetail,
});

type Animal = {
  id: string; owner_id: string; owner_name: string | null; name: string | null; tag_id: string | null;
  species: "cow"|"buffalo"; gender: "male"|"female"|"unknown"; breed: string | null; ai_breed_confidence: number | null;
  age_months: number | null; color: string | null;
  muzzle_image_url: string; bcs_score: number | null; weight_kg: number | null;
  front_image_url: string | null; left_image_url: string | null; right_image_url: string | null;
  estimated_price_pkr: number | null; status: AnimalStatus; notes: string | null;
  created_at: string;
};

type EditForm = {
  name: string; tag_id: string; owner_name: string;
  gender: "male"|"female"|"unknown"; breed: string; color: string;
  age_months: string; bcs_score: string; weight_kg: string;
  estimated_price_pkr: string; notes: string;
};

function AnimalDetail() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [a, setA] = useState<Animal | null>(null);
  const [owner, setOwner] = useState<{ full_name: string | null; phone: string | null } | null>(null);
  const [transferEmail, setTransferEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EditForm | null>(null);

  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [loading, user, nav]);

  const load = async () => {
    const { data } = await supabase.from("animals").select("*").eq("id", id).maybeSingle();
    setA(data as Animal | null);
    if (data) {
      const { data: p } = await supabase.from("profiles").select("full_name,phone").eq("id", data.owner_id).maybeSingle();
      setOwner(p);
    }
  };
  useEffect(() => { load(); }, [id]);

  if (!a) return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading…</div>;

  const isOwner = user?.id === a.owner_id;
  const stolen = a.status === "theft";

  const setStatus = async (status: AnimalStatus) => {
    setBusy(true);
    const { error } = await supabase.from("animals").update({ status }).eq("id", a.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Marked as ${status}`);
    load();
  };

  const initiateTransfer = async () => {
    if (!user) return;
    setBusy(true);
    const recipientId = transferEmail.trim();
    if (!recipientId || recipientId === user.id) { setBusy(false); return toast.error("Enter a valid recipient user ID"); }
    const { error } = await supabase.from("ownership_transfers").insert({
      animal_id: a.id, from_user: user.id, to_user: recipientId, status: "pending",
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Transfer initiated. Recipient will see it on their dashboard.");
    setTransferEmail("");
  };

  const startEdit = () => {
    if (!a) return;
    setForm({
      name: a.name ?? "", tag_id: a.tag_id ?? "", owner_name: a.owner_name ?? "",
      gender: a.gender ?? "unknown", breed: a.breed ?? "", color: a.color ?? "",
      age_months: a.age_months?.toString() ?? "",
      bcs_score: a.bcs_score?.toString() ?? "",
      weight_kg: a.weight_kg?.toString() ?? "",
      estimated_price_pkr: a.estimated_price_pkr?.toString() ?? "",
      notes: a.notes ?? "",
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!a || !form) return;
    setBusy(true);
    const { error } = await supabase.from("animals").update({
      name: form.name || null,
      tag_id: form.tag_id || null,
      owner_name: form.owner_name || null,
      gender: form.gender,
      breed: form.breed || null,
      color: form.color || null,
      age_months: form.age_months ? Number(form.age_months) : null,
      bcs_score: form.bcs_score ? Number(form.bcs_score) : null,
      weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
      estimated_price_pkr: form.estimated_price_pkr ? Number(form.estimated_price_pkr) : null,
      notes: form.notes || null,
    }).eq("id", a.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Animal updated");
    setEditing(false);
    load();
  };

  const deleteAnimal = async () => {
    if (!a) return;
    setBusy(true);
    const { error } = await supabase.from("animals").delete().eq("id", a.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Animal deleted");
    nav({ to: "/dashboard" });
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <Link to="/dashboard" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="mr-1 h-4 w-4" />Back to herd</Link>

      {stolen && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-danger p-4 text-destructive-foreground shadow-elegant">
          <AlertTriangle className="h-6 w-6" />
          <div>
            <p className="font-bold uppercase tracking-wider">Theft alert active</p>
            <p className="text-sm opacity-90">Any scan of this muzzle by anyone, anywhere, will surface this warning.</p>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border bg-card shadow-soft">
            <div className="aspect-[16/9] bg-muted">
              <img src={a.front_image_url ?? a.muzzle_image_url} alt={a.name ?? "Animal"} className="h-full w-full object-cover" />
            </div>
            {(a.front_image_url || a.left_image_url || a.right_image_url || a.muzzle_image_url) && (
              <div className="grid grid-cols-4 gap-1 p-1">
                {[
                  { url: a.front_image_url, label: "Front" },
                  { url: a.left_image_url, label: "Left" },
                  { url: a.right_image_url, label: "Right" },
                  { url: a.muzzle_image_url, label: "Muzzle" },
                ].filter(x => x.url).map(x => (
                  <div key={x.label} className="relative aspect-square overflow-hidden rounded-lg">
                    <img src={x.url!} alt={x.label} className="h-full w-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1 text-center text-[9px] font-bold uppercase tracking-wider text-white">{x.label}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-4xl">{a.name || "Unnamed"}</h1>
                <StatusBadge status={a.status} />
                {a.gender && a.gender !== "unknown" && (
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold capitalize">{a.gender}</span>
                )}
              </div>
              <p className="text-muted-foreground capitalize">{a.species} · {a.breed ?? "Unknown breed"} · Tag {a.tag_id ?? "—"}</p>
              {a.notes && <p className="mt-4 rounded-xl bg-accent/40 p-4 text-sm">{a.notes}</p>}
            </div>
          </div>

          {editing && form && (
            <div className="rounded-3xl border bg-card p-6 shadow-soft">
              <h3 className="font-display text-2xl">Edit animal</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <FF label="Name"><Input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} /></FF>
                <FF label="Tag ID"><Input value={form.tag_id} onChange={(e)=>setForm({...form, tag_id: e.target.value})} /></FF>
                <FF label="Owner name"><Input value={form.owner_name} onChange={(e)=>setForm({...form, owner_name: e.target.value})} /></FF>
                <FF label="Gender">
                  <Select value={form.gender} onValueChange={(v)=>setForm({...form, gender: v as "male"|"female"|"unknown"})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </FF>
                <FF label="Breed"><Input value={form.breed} onChange={(e)=>setForm({...form, breed: e.target.value})} /></FF>
                <FF label="Coat colour"><Input value={form.color} onChange={(e)=>setForm({...form, color: e.target.value})} /></FF>
                <FF label="Age (months)"><Input type="number" value={form.age_months} onChange={(e)=>setForm({...form, age_months: e.target.value})} /></FF>
                <FF label="BCS (1–5)"><Input type="number" step="0.5" value={form.bcs_score} onChange={(e)=>setForm({...form, bcs_score: e.target.value})} /></FF>
                <FF label="Weight (kg)"><Input type="number" value={form.weight_kg} onChange={(e)=>setForm({...form, weight_kg: e.target.value})} /></FF>
                <FF label="Market value (Rs)"><Input type="number" value={form.estimated_price_pkr} onChange={(e)=>setForm({...form, estimated_price_pkr: e.target.value})} /></FF>
                <div className="md:col-span-2"><FF label="Notes"><Textarea rows={3} value={form.notes} onChange={(e)=>setForm({...form, notes: e.target.value})} /></FF></div>
              </div>
              <div className="mt-5 flex gap-2">
                <Button onClick={saveEdit} disabled={busy}><Save className="mr-1 h-4 w-4" />Save changes</Button>
                <Button variant="outline" onClick={()=>setEditing(false)} disabled={busy}><X className="mr-1 h-4 w-4" />Cancel</Button>
              </div>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Stat k="BCS" v={a.bcs_score ? `${a.bcs_score}/5` : "—"} />
            <Stat k="Weight" v={a.weight_kg ? `${a.weight_kg} kg` : "—"} />
            <Stat k="Age" v={a.age_months ? `${a.age_months} mo` : "—"} />
            <Stat k="Color" v={a.color ?? "—"} />
            <Stat k="Breed conf." v={a.ai_breed_confidence ? `${(a.ai_breed_confidence*100).toFixed(0)}%` : "—"} />
          </div>

          <div className="rounded-2xl border bg-gold/10 p-6">
            <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground"><Banknote className="h-3.5 w-3.5" />AI Suggested Market Value</p>
            <p className="mt-1 font-display text-4xl">Rs {Number(a.estimated_price_pkr ?? 0).toLocaleString()}</p>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Owner of record</p>
            <p className="mt-1 font-display text-xl">{a.owner_name || owner?.full_name || "Unknown"}</p>
            {owner?.phone && <p className="text-sm text-muted-foreground">{owner.phone}</p>}
            <p className="mt-3 break-all text-xs text-muted-foreground">User ID: <code className="rounded bg-muted px-1">{a.owner_id}</code></p>
          </div>

          {isOwner && !editing && (
            <div className="rounded-2xl border bg-card p-5 shadow-soft">
              <h3 className="font-display text-lg">Manage record</h3>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={startEdit}><Pencil className="mr-1 h-3.5 w-3.5" />Edit</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={busy}><Trash2 className="mr-1 h-3.5 w-3.5" />Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this animal?</AlertDialogTitle>
                      <AlertDialogDescription>This permanently removes <strong>{a.name || "this animal"}</strong> and all its biometric records. This cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteAnimal} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete forever</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}

          {isOwner && (
            <>
              <div className="rounded-2xl border bg-card p-5 shadow-soft">
                <h3 className="font-display text-lg">Status controls</h3>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button variant={a.status==="active"?"default":"outline"} size="sm" disabled={busy} onClick={()=>setStatus("active")}><ShieldCheck className="mr-1 h-3.5 w-3.5" />Active</Button>
                  <Button variant={a.status==="theft"?"destructive":"outline"} size="sm" disabled={busy} onClick={()=>setStatus("theft")}><ShieldAlert className="mr-1 h-3.5 w-3.5" />Stolen</Button>
                  <Button variant={a.status==="sold"?"default":"outline"} size="sm" disabled={busy} onClick={()=>setStatus("sold")}><Banknote className="mr-1 h-3.5 w-3.5" />Sold</Button>
                  <Button variant={a.status==="dead"?"secondary":"outline"} size="sm" disabled={busy} onClick={()=>setStatus("dead")}><Skull className="mr-1 h-3.5 w-3.5" />Deceased</Button>
                </div>
              </div>

              <div className="rounded-2xl border bg-card p-5 shadow-soft">
                <h3 className="flex items-center gap-2 font-display text-lg"><Repeat className="h-4 w-4" />Transfer ownership</h3>
                <p className="mt-1 text-sm text-muted-foreground">Hand this animal to another farmer. The chain of custody is preserved.</p>
                <div className="mt-3 space-y-2">
                  <Label className="text-xs">Recipient user ID</Label>
                  <Input value={transferEmail} onChange={(e)=>setTransferEmail(e.target.value)} placeholder="paste their user ID" />
                  <Button className="w-full" disabled={busy} onClick={initiateTransfer}>Initiate transfer</Button>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{k}</p>
      <p className="mt-1 font-display text-2xl">{v}</p>
    </div>
  );
}

function FF({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
