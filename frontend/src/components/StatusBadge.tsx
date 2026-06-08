import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ShieldCheck, AlertTriangle, Banknote, Skull } from "lucide-react";

export type AnimalStatus = "active" | "theft" | "sold" | "dead";

export function StatusBadge({ status, className }: { status: AnimalStatus; className?: string }) {
  const map = {
    active:  { label: "Active",   icon: ShieldCheck,    style: "bg-success text-success-foreground" },
    theft:   { label: "STOLEN",   icon: AlertTriangle,  style: "bg-destructive text-destructive-foreground animate-pulse" },
    sold:    { label: "Sold",     icon: Banknote,       style: "bg-gold text-gold-foreground" },
    dead:    { label: "Deceased", icon: Skull,          style: "bg-muted text-muted-foreground" },
  } as const;
  const m = map[status];
  const Icon = m.icon;
  return (
    <Badge className={cn("gap-1 border-0 px-2.5 py-1 text-xs font-semibold", m.style, className)}>
      <Icon className="h-3 w-3" />{m.label}
    </Badge>
  );
}
