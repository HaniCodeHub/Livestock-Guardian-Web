import { createFileRoute } from "@tanstack/react-router";
import { AiToolPanel } from "@/components/AiToolPanel";

export const Route = createFileRoute("/tools/health")({
  head: () => ({ meta: [{ title: "Live health check — Livestock Guardian" }, { name: "description", content: "AI-powered visible health and welfare check from camera or photo." }] }),
  component: () => <AiToolPanel mode="health" kicker="AI health tool" title="Live health check" />,
});
