import { createFileRoute } from "@tanstack/react-router";
import { AiToolPanel } from "@/components/AiToolPanel";

export const Route = createFileRoute("/tools/weight")({
  head: () => ({ meta: [{ title: "Weight estimator — Livestock Guardian" }, { name: "description", content: "Visual heart-girth weight estimation in kilograms." }] }),
  component: () => <AiToolPanel mode="weight" kicker="AI weight tool" title="Estimate live weight" />,
});
