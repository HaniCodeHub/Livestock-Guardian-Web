import muzzleExample from "@/assets/muzzle-example.jpg";
import { Check, X } from "lucide-react";

export function MuzzleGuide() {
  return (
    <div className="rounded-2xl border bg-accent/30 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Reference: a perfect muzzle photo
      </p>
      <div className="grid gap-4 sm:grid-cols-[140px_1fr] sm:items-center">
        <img
          src={muzzleExample}
          alt="Example of a clear straight-on muzzle photo"
          width={800}
          height={600}
          loading="lazy"
          className="aspect-square w-full rounded-xl border object-cover shadow-soft"
        />
        <ul className="space-y-1.5 text-sm">
          <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> Straight-on, full nose visible</li>
          <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> Bright natural lighting</li>
          <li className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> Sharp focus on nostrils & ridges</li>
          <li className="flex items-start gap-2"><X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" /> No motion blur, mud, or shadows</li>
        </ul>
      </div>
    </div>
  );
}
