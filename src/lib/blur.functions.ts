import { createServerFn } from "@tanstack/react-start";
import { generateResponse, GatewayError } from "@lovable.dev/ai-gateway";

export type ContactRegion = {
  label: string;
  /** Normalised top-left corner and size, 0..1 relative to the full image. */
  x: number;
  y: number;
  w: number;
  h: number;
};

export type DetectResult = {
  regions: ContactRegion[];
};

/** What the model may mark. Kept in sync with the toggles on the studio page. */
export const DETECTION_TARGETS = [
  "phone numbers",
  "email addresses",
  "addresses and P.O. boxes",
  "QR codes and barcodes",
  "social media handles",
  "contact person names and job titles",
] as const;

/* ------------------------------------------------ structured output schema */

const REGIONS_SCHEMA = {
  type: "object",
  properties: {
    regions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string", description: "What the region contains, e.g. 'phone number'" },
          x: { type: "number", description: "Left edge, 0..1 of image width" },
          y: { type: "number", description: "Top edge, 0..1 of image height" },
          w: { type: "number", description: "Width, 0..1 of image width" },
          h: { type: "number", description: "Height, 0..1 of image height" },
        },
        required: ["label", "x", "y", "w", "h"],
        additionalProperties: false,
      },
    },
  },
  required: ["regions"],
  additionalProperties: false,
} as const;

/* ------------------------------------------------------------ rate limiting */

const RATE_LIMIT = 12;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return true;
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

/* ------------------------------------------------------------- the function */

function buildPrompt(targets: string[]): string {
  const list = targets.length > 0 ? targets.join(", ") : DETECTION_TARGETS.join(", ");
  return [
    "You are a privacy assistant for a graphic designer who publishes client work online.",
    "Study the attached design and locate every region that contains any of the following:",
    list + ".",
    "Return one tight bounding box per item, in normalised coordinates where x and y are the",
    "top-left corner and w and h are the size, all between 0 and 1 relative to the full image.",
    "Expand each box by a small margin so the blurred area fully covers the text or code.",
    "Blurred or already obscured regions can be ignored.",
    "Return an empty regions array when nothing matches. Never invent regions.",
  ].join(" ");
}

function extractText(output: unknown): string {
  if (!Array.isArray(output)) return "";
  let text = "";
  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const record = item as { type?: string; content?: unknown };
    if (record.type !== "message" || !Array.isArray(record.content)) continue;
    for (const part of record.content) {
      if (!part || typeof part !== "object") continue;
      const partRecord = part as { type?: string; text?: unknown };
      if (partRecord.type === "output_text" && typeof partRecord.text === "string") {
        text += partRecord.text;
      }
    }
  }
  return text;
}

function sanitizeRegions(parsed: unknown): ContactRegion[] {
  const raw = (parsed as { regions?: unknown } | null)?.regions;
  if (!Array.isArray(raw)) return [];
  const regions: ContactRegion[] = [];
  for (const entry of raw.slice(0, 60)) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    const label = typeof record["label"] === "string" ? record["label"].slice(0, 60) : "contact detail";
    const x = Number(record["x"]);
    const y = Number(record["y"]);
    const w = Number(record["w"]);
    const h = Number(record["h"]);
    if (![x, y, w, h].every((value) => Number.isFinite(value))) continue;
    const left = Math.min(Math.max(x, 0), 1);
    const top = Math.min(Math.max(y, 0), 1);
    const width = Math.min(Math.max(w, 0.005), 1 - left);
    const height = Math.min(Math.max(h, 0.005), 1 - top);
    if (width <= 0.002 || height <= 0.002) continue;
    regions.push({ label, x: left, y: top, w: width, h: height });
  }
  return regions;
}

export const detectContactRegions = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { image?: unknown; targets?: unknown }) => {
      const image = typeof input?.image === "string" ? input.image : "";
      if (!/^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+$/.test(image)) {
        throw new Error("Please upload a PNG, JPEG or WebP image first.");
      }
      if (image.length > 6_000_000) {
        throw new Error("That image is too large — try one under about 4 MB.");
      }
      const allowed = new Set<string>(DETECTION_TARGETS);
      const targets = Array.isArray(input?.targets)
        ? input.targets.filter(
            (value): value is string => typeof value === "string" && allowed.has(value),
          )
        : [];
      return { image, targets };
    },
  )
  .handler(async ({ data }): Promise<DetectResult> => {
    const ip =
      (await getRequestIp()) ?? "anonymous";
    if (rateLimited(ip)) {
      throw new Error("Too many checks in a row — give it a few minutes and try again.");
    }

    try {
      const response = await generateResponse({
        model: "openai/gpt-6-astra",
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: buildPrompt(data.targets) },
              { type: "input_image", image_url: data.image, detail: "high" },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "contact_regions",
            strict: true,
            schema: REGIONS_SCHEMA,
          },
        },
      });

      const text = extractText(response.output);
      if (!text.trim()) {
        throw new Error("The model could not read that image — try a clearer or smaller version.");
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new Error("The model returned an unreadable result — please try again.");
      }
      return { regions: sanitizeRegions(parsed) };
    } catch (error) {
      if (error instanceof GatewayError) {
        console.error("[blur-studio] gateway error", error.code, error.httpStatus, error.ids);
        throw new Error(
          "The AI service is unavailable right now — please try again in a moment.",
        );
      }
      throw error;
    }
  });

async function getRequestIp(): Promise<string | null> {
  const { getRequestHeader } = await import("@tanstack/react-start/server");
  return getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
}
