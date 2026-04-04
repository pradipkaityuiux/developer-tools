"use client";

import { Check, Copy, Plus, Trash2, Upload } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  buildBackgroundImageCss,
  buildGradientFunction,
  clamp,
  type CssGradientMode,
  type LinearDirectionMode,
  type LinearKeyword,
} from "@/lib/css-gradient-core";

type ColorStop = { id: string; color: string; position: number };

const MAX_STOPS = 12;
const MIN_STOPS = 2;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const LINEAR_KEYWORDS: { id: LinearKeyword; label: string }[] = [
  { id: "to-top", label: "To top" },
  { id: "to-top-right", label: "To top right" },
  { id: "to-right", label: "To right" },
  { id: "to-bottom-right", label: "To bottom right" },
  { id: "to-bottom", label: "To bottom" },
  { id: "to-bottom-left", label: "To bottom left" },
  { id: "to-left", label: "To left" },
  { id: "to-top-left", label: "To top left" },
];

function randomId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (x: number) =>
    clamp(Math.round(x), 0, 255)
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function sampleImageToStops(file: File): Promise<ColorStop[]> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const w = 200;
        const h = Math.max(
          1,
          Math.round((img.naturalHeight / img.naturalWidth) * w) || 200,
        );
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Canvas not available"));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const h3 = Math.floor(h / 3) || 1;

        const stripAvg = (y0: number, y1: number) => {
          const data = ctx.getImageData(0, y0, w, y1 - y0).data;
          let r = 0;
          let g = 0;
          let b = 0;
          const n = data.length / 4;
          for (let i = 0; i < data.length; i += 4) {
            r += data[i]!;
            g += data[i + 1]!;
            b += data[i + 2]!;
          }
          const d = n || 1;
          return rgbToHex(r / d, g / d, b / d);
        };

        const top = stripAvg(0, h3);
        const mid = stripAvg(h3, 2 * h3);
        const bot = stripAvg(2 * h3, h);
        URL.revokeObjectURL(url);
        resolve([
          { id: randomId(), color: top, position: 0 },
          { id: randomId(), color: mid, position: 50 },
          { id: randomId(), color: bot, position: 100 },
        ]);
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e instanceof Error ? e : new Error("Sample failed"));
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not decode image"));
    };
    img.src = url;
  });
}

function sortedStops(stops: ColorStop[]): ColorStop[] {
  return [...stops].sort((a, b) => a.position - b.position);
}

export function CssGradientTool() {
  const fileInputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<CssGradientMode>("linear");
  const [repeating, setRepeating] = useState(false);
  const [linearDirMode, setLinearDirMode] =
    useState<LinearDirectionMode>("angle");
  const [angleDeg, setAngleDeg] = useState(135);
  const [linearKeyword, setLinearKeyword] =
    useState<LinearKeyword>("to-bottom-right");
  const [radialShape, setRadialShape] = useState<"circle" | "ellipse">(
    "ellipse",
  );
  const [radialX, setRadialX] = useState(50);
  const [radialY, setRadialY] = useState(50);
  const [stops, setStops] = useState<ColorStop[]>([
    { id: randomId(), color: "#0ea5e9", position: 0 },
    { id: randomId(), color: "#6366f1", position: 35 },
    { id: randomId(), color: "#c026d3", position: 70 },
    { id: randomId(), color: "#f97316", position: 100 },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [copyOk, setCopyOk] = useState(false);
  const [sampleLabel, setSampleLabel] = useState<string | null>(null);

  const gradientValue = useMemo(
    () =>
      buildGradientFunction(
        mode,
        repeating,
        {
          dirMode: linearDirMode,
          angleDeg,
          keyword: linearKeyword,
        },
        { shape: radialShape, x: radialX, y: radialY },
        stops,
      ),
    [
      mode,
      repeating,
      linearDirMode,
      angleDeg,
      linearKeyword,
      radialShape,
      radialX,
      radialY,
      stops,
    ],
  );

  const backgroundCss = useMemo(
    () => buildBackgroundImageCss(gradientValue),
    [gradientValue],
  );

  useEffect(() => {
    if (!copyOk) return;
    const t = window.setTimeout(() => setCopyOk(false), 2000);
    return () => window.clearTimeout(t);
  }, [copyOk]);

  const copyCss = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(backgroundCss);
      setCopyOk(true);
    } catch {
      setError("Could not copy to clipboard.");
    }
  }, [backgroundCss]);

  const copyGradientOnly = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(gradientValue);
      setCopyOk(true);
    } catch {
      setError("Could not copy to clipboard.");
    }
  }, [gradientValue]);

  const addStop = useCallback(() => {
    if (stops.length >= MAX_STOPS) return;
    const sorted = sortedStops(stops);
    const last = sorted[sorted.length - 1]!;
    const pos = clamp(last.position - 8, 0, 100);
    setStops((s) => [
      ...s,
      { id: randomId(), color: last.color, position: pos },
    ]);
  }, [stops]);

  const removeStop = useCallback((id: string) => {
    setStops((s) => {
      if (s.length <= MIN_STOPS) return s;
      return s.filter((x) => x.id !== id);
    });
  }, []);

  const updateStop = useCallback(
    (id: string, patch: Partial<Pick<ColorStop, "color" | "position">>) => {
      setStops((prev) =>
        prev.map((x) => (x.id === id ? { ...x, ...patch } : x)),
      );
    },
    [],
  );

  const onPickFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPEG, WebP, GIF).");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image is too large (max 8 MB).");
      return;
    }
    try {
      const next = await sampleImageToStops(file);
      setStops(next);
      setSampleLabel(file.name);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not sample colors from image.",
      );
    }
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,420px)]">
        <div
          className="relative min-h-[240px] overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-800"
          style={{
            backgroundImage: gradientValue,
            backgroundSize: mode === "linear" ? "100% 100%" : "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[repeating-conic-gradient(#f4f4f5_0%_25%,#fafafa_0%_50%)] bg-[length:16px_16px] opacity-40 dark:bg-zinc-900 dark:bg-none dark:opacity-0" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: gradientValue,
              backgroundSize: mode === "linear" ? "100% 100%" : "cover",
            }}
          />
          <p className="absolute bottom-3 left-3 rounded-md bg-black/45 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            Live preview
          </p>
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("linear")}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                mode === "linear"
                  ? "bg-foreground text-background"
                  : "border border-zinc-200 bg-white text-foreground hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              }`}
            >
              Linear
            </button>
            <button
              type="button"
              onClick={() => setMode("radial")}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                mode === "radial"
                  ? "bg-foreground text-background"
                  : "border border-zinc-200 bg-white text-foreground hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              }`}
            >
              Radial
            </button>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              checked={repeating}
              onChange={(e) => setRepeating(e.target.checked)}
              className="size-4 rounded border-zinc-300 accent-foreground"
            />
            Repeating gradient
            <span className="font-normal text-zinc-500 dark:text-zinc-400">
              ({mode === "linear" ? "repeating-linear" : "repeating-radial"})
            </span>
          </label>

          {mode === "linear" ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setLinearDirMode("angle")}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    linearDirMode === "angle"
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950"
                  }`}
                >
                  Angle (deg)
                </button>
                <button
                  type="button"
                  onClick={() => setLinearDirMode("keyword")}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    linearDirMode === "keyword"
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950"
                  }`}
                >
                  Direction keywords
                </button>
              </div>

              {linearDirMode === "angle" ? (
                <div>
                  <label
                    htmlFor="css-grad-angle"
                    className="block text-sm font-medium text-foreground"
                  >
                    Angle: {angleDeg}°
                  </label>
                  <input
                    id="css-grad-angle"
                    type="range"
                    min={0}
                    max={360}
                    value={angleDeg}
                    onChange={(e) => setAngleDeg(Number(e.target.value))}
                    className="mt-2 w-full accent-foreground"
                  />
                </div>
              ) : (
                <div>
                  <span
                    className="block text-sm font-medium text-foreground"
                    id="kw-label"
                  >
                    CSS direction
                  </span>
                  <div
                    className="mt-2 flex flex-wrap gap-1.5"
                    role="group"
                    aria-labelledby="kw-label"
                  >
                    {LINEAR_KEYWORDS.map((k) => (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => setLinearKeyword(k.id)}
                        className={`rounded-md px-2 py-1 text-xs font-medium ${
                          linearKeyword === k.id
                            ? "bg-foreground text-background"
                            : "border border-zinc-200 bg-white text-foreground hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                        }`}
                      >
                        {k.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-foreground">Shape:</span>
                {(["ellipse", "circle"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRadialShape(s)}
                    className={`rounded-md px-2.5 py-1 text-sm capitalize ${
                      radialShape === s
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Center X: {radialX}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={radialX}
                  onChange={(e) => setRadialX(Number(e.target.value))}
                  className="mt-1 w-full accent-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Center Y: {radialY}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={radialY}
                  onChange={(e) => setRadialY(Number(e.target.value))}
                  className="mt-1 w-full accent-foreground"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium text-foreground">
                Color stops ({stops.length}/{MAX_STOPS})
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={addStop}
                  disabled={stops.length >= MAX_STOPS}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-medium text-foreground hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                >
                  <Plus className="size-4" aria-hidden />
                  Add stop
                </button>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                >
                  <Upload className="size-4" aria-hidden />
                  Upload image
                </button>
                <input
                  ref={fileRef}
                  id={fileInputId}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    void onPickFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>
            {sampleLabel ? (
              <p className="mt-1 text-xs text-zinc-500">
                Sampled from{" "}
                <span className="font-medium text-foreground">{sampleLabel}</span>
              </p>
            ) : null}

            <ul className="mt-3 max-h-[min(420px,50vh)] space-y-3 overflow-y-auto pr-1">
              {stops.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/40"
                >
                  <input
                    type="color"
                    value={s.color}
                    onChange={(e) =>
                      updateStop(s.id, { color: e.target.value })
                    }
                    className="h-9 w-12 cursor-pointer rounded border border-zinc-300 bg-white p-0.5 dark:border-zinc-600"
                    aria-label={`Color for stop at ${s.position}%`}
                  />
                  <input
                    type="text"
                    value={s.color}
                    onChange={(e) =>
                      updateStop(s.id, { color: e.target.value })
                    }
                    className="min-w-[7rem] flex-1 rounded-md border border-zinc-200 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
                    spellCheck={false}
                  />
                  <label className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="sr-only">Position</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={s.position}
                      onChange={(e) =>
                        updateStop(s.id, {
                          position: clamp(
                            Number(e.target.value) || 0,
                            0,
                            100,
                          ),
                        })
                      }
                      className="w-16 rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-right font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
                    />
                    %
                  </label>
                  <button
                    type="button"
                    onClick={() => removeStop(s.id)}
                    disabled={stops.length <= MIN_STOPS}
                    className="rounded-md p-2 text-zinc-500 hover:bg-zinc-200 hover:text-foreground disabled:opacity-30 dark:hover:bg-zinc-800"
                    aria-label="Remove stop"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {error ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-foreground">CSS output</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void copyGradientOnly()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              {copyOk ? (
                <Check className="size-4 text-emerald-600" aria-hidden />
              ) : (
                <Copy className="size-4" aria-hidden />
              )}
              Copy gradient
            </button>
            <button
              type="button"
              onClick={() => void copyCss()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              {copyOk ? (
                <Check className="size-4" aria-hidden />
              ) : (
                <Copy className="size-4" aria-hidden />
              )}
              Copy background-image
            </button>
          </div>
        </div>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-zinc-100 p-3 font-mono text-sm text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
          <code>{backgroundCss}</code>
        </pre>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Gradient only:{" "}
          <code className="rounded bg-zinc-200/80 px-1 dark:bg-zinc-800">
            {gradientValue}
          </code>
        </p>
      </div>
    </div>
  );
}
