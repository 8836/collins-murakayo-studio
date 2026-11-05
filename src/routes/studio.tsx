import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Download, Loader2, ShieldCheck, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { Reveal } from "@/components/site/reveal";
import {
  detectContactRegions,
  DETECTION_TARGETS,
  type ContactRegion,
} from "@/lib/blur.functions";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Blur Tool — Collins Murakayo" },
      {
        name: "description",
        content:
          "Upload a project image and an AI model finds phone numbers, emails, addresses and QR codes so they can be blurred before publishing — everything else stays untouched.",
      },
      { property: "og:title", content: "Blur Tool — Collins Murakayo" },
      {
        property: "og:description",
        content:
          "Identify and blur contact details in project artwork with AI, preserving the rest of the design.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StudioPage,
});

const TARGET_LABELS: Record<string, string> = {
  "phone numbers": "Phone numbers",
  "email addresses": "Email addresses",
  "addresses and P.O. boxes": "Addresses & P.O. boxes",
  "QR codes and barcodes": "QR codes & barcodes",
  "social media handles": "Social handles",
  "contact person names and job titles": "Names & job titles",
};

const MAX_EDGE = 1600;

type Stage = "idle" | "working" | "done" | "error";

function StudioPage() {
  const detect = useServerFn(detectContactRegions);

  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [regionCount, setRegionCount] = useState(0);
  const [targets, setTargets] = useState<string[]>(DETECTION_TARGETS.slice(0, 4));
  const [strong, setStrong] = useState(true);

  const sourceRef = useRef<HTMLImageElement | null>(null);
  const pristineRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const reset = useCallback(() => {
    setStage("idle");
    setError(null);
    setRegionCount(0);
    sourceRef.current = null;
    pristineRef.current = null;
    setFileName(null);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, []);

  const loadImage = useCallback((file: File) => {
    setError(null);
    setRegionCount(0);
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(image, 0, 0, width, height);

      sourceRef.current = image;
      pristineRef.current = canvas;
      setFileName(file.name);

      const view = canvasRef.current;
      if (view) {
        view.width = width;
        view.height = height;
        view.getContext("2d")?.drawImage(canvas, 0, 0);
      }
      setStage("idle");
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      setError("That file could not be read as an image.");
      setStage("error");
    };
    image.src = url;
  }, []);

  const runDetection = useCallback(async () => {
    const pristine = pristineRef.current;
    if (!pristine) return;
    setStage("working");
    setError(null);

    let imageDataUrl: string;
    try {
      imageDataUrl = pristine.toDataURL("image/jpeg", 0.88);
    } catch {
      setError("This image could not be prepared for analysis.");
      setStage("error");
      return;
    }

    let regions: ContactRegion[];
    try {
      const result = await detect({ data: { image: imageDataUrl, targets } });
      regions = result.regions;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong — try again.");
      setStage("error");
      return;
    }

    const view = canvasRef.current;
    if (!view) return;
    view.width = pristine.width;
    view.height = pristine.height;
    const ctx = view.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(pristine, 0, 0);
    applyBlur(view, regions, strong);
    setRegionCount(regions.length);
    setStage("done");
  }, [detect, strong, targets]);

  const showRegions = useCallback(() => {
    const pristine = pristineRef.current;
    const view = canvasRef.current;
    if (!pristine || !view) return;
    view.width = pristine.width;
    view.height = pristine.height;
    const ctx = view.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(pristine, 0, 0);
    ctx.fillStyle = "rgba(37, 99, 235, 0.28)";
    ctx.strokeStyle = "rgba(37, 99, 235, 0.9)";
    for (const box of lastRegions) {
      ctx.fillRect(box.x * view.width, box.y * view.height, box.w * view.width, box.h * view.height);
      ctx.strokeRect(box.x * view.width, box.y * view.height, box.w * view.width, box.h * view.height);
    }
  }, []);

  const restore = useCallback(() => {
    const pristine = pristineRef.current;
    const view = canvasRef.current;
    if (!pristine || !view) return;
    view.getContext("2d")?.drawImage(pristine, 0, 0);
  }, []);

  const download = useCallback(() => {
    const view = canvasRef.current;
    if (!view) return;
    view.toBlob(
      (blob) => {
        if (!blob) return;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        const base = (fileName ?? "project-image").replace(/\.[a-z0-9]+$/i, "");
        link.download = `${base}-blurred.jpg`;
        link.click();
        URL.revokeObjectURL(link.href);
      },
      "image/jpeg",
      0.92,
    );
  }, [fileName]);

  const busy = stage === "working";
  const hasImage = pristineRef.current !== null;

  return (
    <section className="shell pt-16 pb-28">
      <Reveal>
        <p className="eyebrow">Studio tool</p>
        <h1 className="display-xl mt-6 max-w-3xl">Blur client details before publishing.</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Upload a project image and an AI model finds the contact details — phone numbers, emails,
          addresses, QR codes — then only those areas are blurred. The rest of the design stays
          pixel-for-pixel identical.
        </p>
      </Reveal>

      <Reveal delay={0.08} className="mt-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-5">
            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const file = event.dataTransfer.files?.[0];
                if (file) loadImage(file);
              }}
              className="rounded-2xl border border-dashed border-hairline bg-card/40 p-8 text-center"
            >
              <Upload className="mx-auto size-6 text-muted-foreground" aria-hidden />
              <p className="mt-4 text-sm text-muted-foreground">
                Drop an image here, or choose a file. PNG, JPEG or WebP.
              </p>
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) loadImage(file);
                  event.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-5 inline-flex min-h-11 items-center rounded-full border border-hairline px-6 text-sm font-medium transition-colors hover:bg-foreground/5"
              >
                Choose image
              </button>
              {fileName ? (
                <p className="mt-4 truncate text-xs text-muted-foreground">{fileName}</p>
              ) : null}
            </div>

            <div>
              <p className="eyebrow">What should be blurred?</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {DETECTION_TARGETS.map((target) => {
                  const active = targets.includes(target);
                  return (
                    <button
                      key={target}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        setTargets((current) =>
                          current.includes(target)
                            ? current.filter((value) => value !== target)
                            : [...current, target],
                        )
                      }
                      className={`min-h-9 rounded-full border px-4 text-xs font-medium transition-colors ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-hairline text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {TARGET_LABELS[target] ?? target}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="eyebrow">Blur strength</p>
              <div className="mt-4 inline-flex rounded-full border border-hairline p-1">
                {[
                  { label: "Soft", value: false },
                  { label: "Strong", value: true },
                ].map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    aria-pressed={strong === option.value}
                    onClick={() => setStrong(option.value)}
                    className={`min-h-9 rounded-full px-5 text-xs font-medium transition-colors ${
                      strong === option.value ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                disabled={!hasImage || busy}
                onClick={() => void runDetection()}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-transform duration-300 enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ShieldCheck className="size-4" aria-hidden />}
                {busy ? "Finding contact details…" : "Detect & blur"}
              </button>
              {error ? <p className="text-sm text-red-500">{error}</p> : null}
              {stage === "done" ? (
                <p className="text-sm text-muted-foreground">
                  {regionCount === 0
                    ? "No contact details were found — the image is unchanged."
                    : `Blurred ${regionCount} region${regionCount === 1 ? "" : "s"}. Check the preview before publishing.`}
                </p>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-hairline bg-card/40">
              {hasImage ? (
                <canvas ref={canvasRef} className="mx-auto block max-h-[70vh] w-auto max-w-full" />
              ) : (
                <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
                  Your image preview appears here.
                </div>
              )}
            </div>
            {stage === "done" ? (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={download}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <Download className="size-4" aria-hidden />
                  Download blurred image
                </button>
                <button
                  type="button"
                  onClick={showRegions}
                  className="min-h-11 rounded-full border border-hairline px-5 text-sm font-medium transition-colors hover:bg-foreground/5"
                >
                  Show what was found
                </button>
                <button
                  type="button"
                  onClick={restore}
                  className="min-h-11 rounded-full px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Restore
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="min-h-11 rounded-full px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Start over
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ blurring */

let lastRegions: ContactRegion[] = [];

function applyBlur(canvas: HTMLCanvasElement, regions: ContactRegion[], strong: boolean) {
  const ctx = canvas.getContext("2d");
  if (!ctx || regions.length === 0) return;
  lastRegions = regions;

  const pad = 0.012;
  for (const region of regions) {
    const x = Math.max(0, (region.x - pad) * canvas.width);
    const y = Math.max(0, (region.y - pad) * canvas.height);
    const w = Math.min(canvas.width - x, (region.w + pad * 2) * canvas.width);
    const h = Math.min(canvas.height - y, (region.h + pad * 2) * canvas.height);
    if (w < 2 || h < 2) continue;

    // Downscale the region, then scale it back up: a smooth, unrecognisable smear
    // that keeps the surrounding colours and lighting.
    const factor = strong ? 24 : 10;
    const small = document.createElement("canvas");
    small.width = Math.max(1, Math.round(w / factor));
    small.height = Math.max(1, Math.round(h / factor));
    const smallCtx = small.getContext("2d");
    if (!smallCtx) continue;
    smallCtx.drawImage(canvas, x, y, w, h, 0, 0, small.width, small.height);

    ctx.save();
    ctx.filter = `blur(${Math.max(4, Math.round(w * (strong ? 0.03 : 0.012)))}px)`;
    ctx.drawImage(small, 0, 0, small.width, small.height, x, y, w, h);
    ctx.restore();
  }
  ctx.filter = "none";
}
