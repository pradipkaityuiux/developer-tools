"use client";

import { Check, Copy, Upload } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  DEFAULT_PALETTE_LINES,
  simulateSrgbBytes,
  type SimulationMode,
} from "@/lib/color-blindness-core";
import { parseHexColor, rgbToHex } from "@/lib/contrast-checker-core";

const MAX_BYTES = 32 * 1024 * 1024;
const MAX_PREVIEW_W = 640;

const MODE_OPTIONS: { id: SimulationMode; label: string; hint: string }[] = [
  { id: "normal", label: "Normal (reference)", hint: "No CVD transform" },
  { id: "protanopia", label: "Protanopia (red–green)", hint: "L-cone model" },
  {
    id: "deuteranopia",
    label: "Deuteranopia (red–green)",
    hint: "M-cone model",
  },
  { id: "tritanopia", label: "Tritanopia (blue–yellow)", hint: "S-cone model" },
  { id: "achromatopsia", label: "Achromatopsia", hint: "Luminance only" },
];

function extractHexes(text: string): string[] {
  const parts = text.split(/[\s,;]+/).filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    const raw = p.startsWith("#") ? p : `#${p}`;
    const n = parseHexColor(raw);
    if (n) {
      const h = rgbToHex(n);
      if (!seen.has(h)) {
        seen.add(h);
        out.push(h);
      }
    }
  }
  return out;
}

function processImageData(
  data: Uint8ClampedArray,
  mode: SimulationMode,
  severity: number,
) {
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3]!;
    if (a === 0) continue;
    const r = data[i]!;
    const g = data[i + 1]!;
    const b = data[i + 2]!;
    const o = simulateSrgbBytes(r, g, b, mode, severity);
    data[i] = o.r;
    data[i + 1] = o.g;
    data[i + 2] = o.b;
  }
}

type Panel = "image" | "palette";

export function ColorBlindnessTool() {
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const origCanvasRef = useRef<HTMLCanvasElement>(null);
  const simCanvasRef = useRef<HTMLCanvasElement>(null);

  const [panel, setPanel] = useState<Panel>("image");
  const [mode, setMode] = useState<SimulationMode>("deuteranopia");
  const [severity, setSeverity] = useState(1);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageErr, setImageErr] = useState<string | null>(null);
  const [paletteText, setPaletteText] = useState(DEFAULT_PALETTE_LINES);
  const [copyKind, setCopyKind] = useState<"hex" | "css" | null>(null);

  const hexes = extractHexes(paletteText);

  useEffect(() => {
    if (!copyKind) return;
    const t = window.setTimeout(() => setCopyKind(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyKind]);

  const paintCanvases = useCallback(() => {
    const img = imgRef.current;
    const orig = origCanvasRef.current;
    const sim = simCanvasRef.current;
    if (!img?.complete || !orig || !sim || !img.naturalWidth) return;

    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const scale = Math.min(1, MAX_PREVIEW_W / nw);
    const w = Math.max(1, Math.round(nw * scale));
    const h = Math.max(1, Math.round(nh * scale));

    orig.width = w;
    orig.height = h;
    sim.width = w;
    sim.height = h;

    const ctxO = orig.getContext("2d");
    const ctxS = sim.getContext("2d");
    if (!ctxO || !ctxS) return;

    ctxO.imageSmoothingEnabled = true;
    ctxO.imageSmoothingQuality = "high";
    ctxO.drawImage(img, 0, 0, w, h);

    const snap = ctxO.getImageData(0, 0, w, h);
    const copy = new ImageData(
      new Uint8ClampedArray(snap.data),
      w,
      h,
    );
    processImageData(copy.data, mode, severity);
    ctxS.putImageData(copy, 0, 0);
  }, [mode, severity]);

  useEffect(() => {
    paintCanvases();
  }, [paintCanvases, imageUrl]);

  const onFile = useCallback(
    (file: File | undefined) => {
      setImageErr(null);
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setImageErr("Choose an image file (PNG, JPEG, WebP, GIF, …).");
        return;
      }
      if (file.size > MAX_BYTES) {
        setImageErr(`File is too large (max ${MAX_BYTES / 1024 / 1024} MB).`);
        return;
      }
      setImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  async function copyText(text: string, kind: "hex" | "css") {
    try {
      await navigator.clipboard.writeText(text);
      setCopyKind(kind);
    } catch {
      /* ignore */
    }
  }

  const simulatedHexes = hexes.map((h) => {
    const rgb = parseHexColor(h);
    if (!rgb) return h;
    const o = simulateSrgbBytes(rgb.r, rgb.g, rgb.b, mode, severity);
    return rgbToHex({ r: o.r, g: o.g, b: o.b });
  });

  const copyHexBlock = simulatedHexes.join("\n");
  const copyCssBlock =
    hexes.length === 0
      ? ""
      : [
          "/* Simulated palette (CVD preview — verify with users) */",
          ...hexes.map(
            (orig, i) =>
              `  /* ${orig} → ${simulatedHexes[i]} */`,
          ),
        ].join("\n");

  const severityDisabled =
    mode === "normal" || mode === "achromatopsia";

  return (
    <section
      className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6"
      aria-label="Color blindness simulator"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPanel("image")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              panel === "image"
                ? "bg-foreground text-background"
                : "bg-zinc-100 text-foreground hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            }`}
          >
            Image preview
          </button>
          <button
            type="button"
            onClick={() => setPanel("palette")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              panel === "palette"
                ? "bg-foreground text-background"
                : "bg-zinc-100 text-foreground hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            }`}
          >
            Palette swatches
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div>
          <label
            htmlFor="cvd-mode"
            className="text-sm font-medium text-foreground"
          >
            Simulation mode
          </label>
          <select
            id="cvd-mode"
            value={mode}
            onChange={(e) =>
              setMode(e.target.value as SimulationMode)
            }
            className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {MODE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {MODE_OPTIONS.find((m) => m.id === mode)?.hint}
          </p>
        </div>
        <div>
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="cvd-severity"
              className="text-sm font-medium text-foreground"
            >
              Severity
            </label>
            <span className="text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
              {severityDisabled ? "—" : `${Math.round(severity * 100)}%`}
            </span>
          </div>
          <input
            id="cvd-severity"
            type="range"
            min={0}
            max={1}
            step={0.05}
            disabled={severityDisabled}
            value={severityDisabled ? 1 : severity}
            onChange={(e) =>
              setSeverity(Number.parseFloat(e.target.value))
            }
            className="mt-3 w-full accent-foreground disabled:cursor-not-allowed disabled:opacity-40"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Interpolates between normal and strong deficiency for red–green and
            blue–yellow models. Grayscale ignores this slider.
          </p>
        </div>
      </div>

      {panel === "image" && (
        <div className="mt-8 space-y-4">
          <input
            ref={fileRef}
            id={fileId}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileRef.current?.click();
              }
            }}
            onClick={() => fileRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-10 text-center transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/40 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
          >
            <Upload className="h-10 w-10 text-zinc-400" aria-hidden />
            <span className="mt-3 text-sm font-medium text-foreground">
              Upload image
            </span>
            <span className="mt-1 max-w-sm text-xs text-zinc-500 dark:text-zinc-400">
              PNG, JPEG, WebP, or GIF — processed locally in your browser.
            </span>
          </div>
          {imageErr && (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {imageErr}
            </p>
          )}

          {imageUrl && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={imageUrl}
                alt=""
                className="hidden"
                onLoad={() => paintCanvases()}
              />
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Original
                  </p>
                  <canvas
                    ref={origCanvasRef}
                    className="max-h-[70vh] w-full rounded-lg border border-zinc-200 bg-[repeating-linear-gradient(45deg,#fafafa_0,#fafafa_8px,#f4f4f5_8px,#f4f4f5_16px)] dark:border-zinc-700 dark:bg-[repeating-linear-gradient(45deg,#18181b_0,#18181b_8px,#27272a_8px,#27272a_16px)]"
                  />
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Simulated
                  </p>
                  <canvas
                    ref={simCanvasRef}
                    className="max-h-[70vh] w-full rounded-lg border border-zinc-200 bg-[repeating-linear-gradient(45deg,#fafafa_0,#fafafa_8px,#f4f4f5_8px,#f4f4f5_16px)] dark:border-zinc-700 dark:bg-[repeating-linear-gradient(45deg,#18181b_0,#18181b_8px,#27272a_8px,#27272a_16px)]"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setImageUrl((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return null;
                  });
                }}
                className="text-sm font-medium text-zinc-600 underline underline-offset-2 hover:text-foreground dark:text-zinc-400"
              >
                Clear image
              </button>
            </>
          )}
        </div>
      )}

      {panel === "palette" && (
        <div className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="palette-input"
              className="text-sm font-medium text-foreground"
            >
              HEX colors (space, comma, or newline separated)
            </label>
            <textarea
              id="palette-input"
              value={paletteText}
              onChange={(e) => setPaletteText(e.target.value)}
              rows={6}
              className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
              spellCheck={false}
            />
          </div>

          {hexes.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Add at least one valid HEX color (for example #2563eb or #abc).
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-3">
                {hexes.map((h, i) => (
                  <div
                    key={`${h}-${i}`}
                    className="flex overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700"
                  >
                    <div
                      className="h-14 w-14 shrink-0"
                      style={{ backgroundColor: h }}
                      title={`Original ${h}`}
                    />
                    <div
                      className="h-14 w-14 shrink-0 border-l border-zinc-200 dark:border-zinc-700"
                      style={{ backgroundColor: simulatedHexes[i] }}
                      title={`Simulated ${simulatedHexes[i]}`}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Each tile: original (left) · simulated (right).
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copyText(copyHexBlock, "hex")}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  {copyKind === "hex" ? (
                    <Check className="h-4 w-4 text-emerald-600" aria-hidden />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden />
                  )}
                  Copy simulated HEX list
                </button>
                <button
                  type="button"
                  onClick={() => copyText(copyCssBlock, "css")}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  {copyKind === "css" ? (
                    <Check className="h-4 w-4 text-emerald-600" aria-hidden />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden />
                  )}
                  Copy CSS comment block
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
