import { createFileRoute } from "@tanstack/react-router";
import { AiToolPanel } from "@/components/AiToolPanel";

export const Route = createFileRoute("/tools/breed")({
  head: () => ({ meta: [{ title: "Breed identifier — Livestock Guardian" }, { name: "description", content: "Identify cattle and buffalo breeds with AI from a single photo." }] }),
  component: () => <AiToolPanel mode="breed" kicker="AI breed tool" title="What breed is this?" />,
});
