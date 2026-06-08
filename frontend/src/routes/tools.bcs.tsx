import { createFileRoute } from "@tanstack/react-router";
import { AiToolPanel } from "@/components/AiToolPanel";

export const Route = createFileRoute("/tools/bcs")({
  head: () => ({ meta: [{ title: "Body Condition Score — Livestock Guardian" }, { name: "description", content: "Get an instant 1–5 BCS reading from a side-profile photo." }] }),
  component: () => <AiToolPanel mode="bcs" kicker="AI BCS tool" title="Body condition score (1–5)" />,
});
