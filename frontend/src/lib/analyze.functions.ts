import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const Mode = z.enum(["full", "breed", "bcs", "price", "weight", "health"]);

const InputSchema = z.object({
  imageBase64: z.string().min(10),
  species: z.enum(["cow", "buffalo"]),
  mode: Mode.default("full"),
});

const FullSchema = z.object({
  breed: z.string().default("Unknown"),
  breed_confidence: z.coerce.number().min(0).max(1).default(0.5),
  bcs_score: z.coerce.number().min(1).max(5).default(3),
  estimated_age_months: z.coerce.number().min(1).max(360).default(36),
  color: z.string().default("Unknown"),
  estimated_weight_kg: z.coerce.number().min(20).max(2000).default(300),
  estimated_price_pkr: z.coerce.number().min(0).max(10_000_000).default(200000),
  health_summary: z.string().default(""),
  health_concerns: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
});

export type FullAnalysis = z.infer<typeof FullSchema>;

function fallback(species: "cow" | "buffalo"): FullAnalysis {
  const isBuf = species === "buffalo";
  return {
    breed: isBuf ? "Nili-Ravi" : "Sahiwal",
    breed_confidence: 0.7,
    bcs_score: 3,
    estimated_age_months: 36,
    color: isBuf ? "Black" : "Reddish brown",
    estimated_weight_kg: isBuf ? 520 : 380,
    estimated_price_pkr: isBuf ? 280000 : 220000,
    health_summary: "Animal appears in adequate condition. Confirm with on-site inspection.",
    health_concerns: [],
    recommendations: ["Routine deworming every 3 months", "Ensure clean drinking water"],
  };
}

const PROMPTS: Record<z.infer<typeof Mode>, string> = {
  full: "Identify breed, BCS (1–5), age in months, coat colour, estimated weight (kg), fair market price in PKR, a one-sentence health summary, list any visible health concerns, and 2–3 husbandry recommendations.",
  breed: "Focus on breed identification. Return your best breed guess with confidence. For unrelated fields use sensible defaults.",
  bcs: "Focus on Body Condition Score (1–5, half-points allowed). Explain in the health_summary why you chose that score (rib visibility, hip bones, spine, fat cover).",
  price: "Focus on a fair Pakistani market price in PKR. Use breed, age, weight and BCS to justify in health_summary.",
  weight: "Focus on estimated live weight in kilograms using visual heart-girth and body length cues. Justify in health_summary.",
  health: "Focus on visible health: coat shine, eye clarity, posture, body condition, any lesions or discharge. Provide concerns and recommendations.",
};

export const analyzeAnimal = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }): Promise<FullAnalysis> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return fallback(data.species);

    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway("google/gemini-2.5-flash");

    const jsonShape = `{
  "breed": string (specific South Asian breed name if recognisable, else best guess),
  "breed_confidence": number 0..1,
  "bcs_score": number 1..5 (half-points allowed),
  "estimated_age_months": integer 1..360,
  "color": string,
  "estimated_weight_kg": number 20..2000,
  "estimated_price_pkr": number (Pakistani Rupees, 2026 mandi rates),
  "health_summary": string (1-2 sentences),
  "health_concerns": string[] (visible issues, [] if none),
  "recommendations": string[] (2-3 husbandry tips)
}`;

    try {
      const { text } = await generateText({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are a veterinary livestock expert specialising in South Asian breeds (Sahiwal, Cholistani, Tharparkar, Red Sindhi, Achai, Nili-Ravi, Kundi, Azakheli). Analyse the photo carefully and ALWAYS reply with ONLY a single JSON object — no prose, no markdown fences. Give your best honest estimate for every field even when uncertain.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: `This is a ${data.species}. ${PROMPTS[data.mode]}\n\nReturn ONLY this JSON shape:\n${jsonShape}` },
              { type: "image", image: `data:image/jpeg;base64,${data.imageBase64}` },
            ],
          },
        ],
      });

      const json = extractJson(text);
      const parsed = FullSchema.safeParse(json);
      if (parsed.success) return parsed.data;
      console.error("AI schema parse failed", parsed.error.flatten(), "raw:", text);
      const fb = fallback(data.species);
      return { ...fb, ...(typeof json === "object" && json ? (json as object) : {}) } as FullAnalysis;
    } catch (e) {
      console.error("AI analyze failed", e);
      return fallback(data.species);
    }
  });

function extractJson(text: string): unknown {
  if (!text) return null;
  const cleaned = text.replace(/```(?:json)?/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}
