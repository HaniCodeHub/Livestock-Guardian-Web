import { createFileRoute } from "@tanstack/react-router";
import { AiToolPanel } from "@/components/AiToolPanel";

export const Route = createFileRoute("/tools/price")({
  head: () => ({ meta: [{ title: "Market value — Livestock Guardian" }, { name: "description", content: "Fair Pakistani mandi price estimate from a single photo." }] }),
  component: () => <AiToolPanel mode="price" kicker="AI price tool" title="Estimated market value (PKR)" />,
});
