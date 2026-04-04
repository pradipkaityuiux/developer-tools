"use client";

import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import Link from "next/link";
import { Check, Copy, Upload } from "lucide-react";

const WHITE = { r: 255, g: 255, b: 255 } as const;
const BLACK = { r: 0, g: 0, b: 0 } as const;

type RGB = { r: number; g: number; b: number };

function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function mixRgb(a: RGB, b: RGB, t: number): RGB {
  const u = Math.max(0, Math.min(1, t));
  return {
    r: clampByte(a.r + (b.r - a.r) * u),
    g: clampByte(a.g + (b.g - a.g) * u),
    b: clampByte(a.b + (b.b - a.b) * u),
  };
}

function rgbToHex({ r, g, b }: RGB): string {
  const h = (n: number) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
}

function parseHex(input: string): RGB | null {
  const s = input.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(s)) return null;
  return {
    r: parseInt(s.slice(0, 2), 16),
    g: parseInt(s.slice(2, 4), 16),
    b: parseInt(s.slice(4, 6), 16),
  };
}

/** Relative luminance for contrast hint (WCAG). */
function relativeLuminance({ r, g, b }: RGB): number {
  const lin = (c: number) => {
    const x = c / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  const R = lin(r);
  const G = lin(g);
  const B = lin(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(a: RGB, b: RGB): number {
  const L1 = relativeLuminance(a);
  const L2 = relativeLuminance(b);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

const MIN_STEPS = 3;
const MAX_STEPS = 12;

export function TintShadeGeneratorTool() {
  const baseId = useId();
  const hexInputId = `${baseId}-hex`;
  const stepsId = `${baseId}-steps`;
  const pickerId = `${baseId}-picker`;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hex, setHex] = useState("#2563EB");
  const [steps, setSteps] = useState(5);
  const [parseError, setParseError] = useState<string | null>(null);
  const [imageHint, setImageHint] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [bulkCopied, setBulkCopied] = useState<"hex" | "css" | null>(null);

  const baseRgb = useMemo(() => parseHex(hex), [hex]);

  const scale = useMemo(() => {
    if (!baseRgb) return null;
    const n = Math.min(MAX_STEPS, Math.max(MIN_STEPS, steps));
    const tints: { hex: string; rgb: RGB; label: string }[] = [];
    for (let i = n; i >= 1; i--) {
      const t = i / (n + 1);
      const rgb = mixRgb(baseRgb, WHITE, t);
      tints.push({
        rgb,
        hex: rgbToHex(rgb),
        label: `Tint ${n - i + 1}`,
      });
    }
    const shades: { hex: string; rgb: RGB; label: string }[] = [];
    for (let j = 1; j <= n; j++) {
      const t = j / (n + 1);
      const rgb = mixRgb(baseRgb, BLACK, t);
      shades.push({
        rgb,
        hex: rgbToHex(rgb),
        label: `Shade ${j}`,
      });
    }
    return {
      tints,
      base: { rgb: baseRgb, hex: rgbToHex(baseRgb), label: "Base" },
      shades,
    };
  }, [baseRgb, hex, steps]);

  const applyHex = useCallback((value: string) => {
    const normalized = value.trim().startsWith("#")
      ? value.trim()
      : `#${value.trim()}`;
    const rgb = parseHex(normalized);
    if (!rgb) {
      setParseError("Enter a 6-digit hex color (e.g. #2563EB).");
      return;
    }
    setParseError(null);
    setHex(rgbToHex(rgb));
  }, []);

  const copyText = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1600);
    } catch {
      setCopiedKey("err");
      window.setTimeout(() => setCopiedKey(null), 2000);
    }
  }, []);

  const allHexList = useMemo(() => {
    if (!scale) return "";
    const parts = [
      ...scale.tints.map((x) => x.hex),
      scale.base.hex,
      ...scale.shades.map((x) => x.hex),
    ];
    return parts.join("\n");
  }, [scale]);

  const cssVariables = useMemo(() => {
    if (!scale) return "";
    const lines: string[] = [":root {"];
    let i = 1;
    for (const t of scale.tints) {
      lines.push(`  --brand-${i}: ${t.hex};`);
      i += 1;
    }
    lines.push(`  --brand-base: ${scale.base.hex};`);
    let j = 1;
    for (const s of scale.shades) {
      lines.push(`  --brand-dark-${j}: ${s.hex};`);
      j += 1;
    }
    lines.push("}");
    return lines.join("\n");
  }, [scale]);

  const onPickColor = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    applyHex(v);
  };

  const onImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) {
      setImageHint("Choose an image file (PNG, JPEG, WebP, …).");
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const w = Math.min(64, img.naturalWidth);
        const h = Math.min(64, img.naturalHeight);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setImageHint("Could not read image data.");
          URL.revokeObjectURL(url);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;
        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;
        for (let p = 0; p < data.length; p += 4) {
          const a = data[p + 3] ?? 255;
          if (a < 8) continue;
          r += data[p]!;
          g += data[p + 1]!;
          b += data[p + 2]!;
          count += 1;
        }
        URL.revokeObjectURL(url);
        if (count === 0) {
          setImageHint("Image had no opaque pixels to sample.");
          return;
        }
        const rgb: RGB = {
          r: Math.round(r / count),
          g: Math.round(g / count),
          b: Math.round(b / count),
        };
        setParseError(null);
        setHex(rgbToHex(rgb));
        setImageHint("Average color from image applied as base.");
        window.setTimeout(() => setImageHint(null), 3000);
      } catch {
        URL.revokeObjectURL(url);
        setImageHint("Could not process that image.");
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setImageHint("Failed to load image.");
    };
    img.src = url;
  };

  const contrastOnWhite = baseRgb
    ? contrastRatio(baseRgb, WHITE).toFixed(2)
    : "—";
  const contrastOnBlack = baseRgb
    ? contrastRatio(baseRgb, BLACK).toFixed(2)
    : "—";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label
                htmlFor={pickerId}
                className="block text-sm font-medium text-foreground"
              >
                Base color
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  id={pickerId}
                  type="color"
                  value={hex.length === 7 ? hex : "#2563EB"}
                  onChange={onPickColor}
                  className="h-10 w-14 cursor-pointer rounded border border-zinc-300 bg-white p-0.5 dark:border-zinc-600"
                  aria-label="Pick base color"
                />
                <input
                  id={hexInputId}
                  type="text"
                  value={hex}
                  onChange={(e) => {
                    setHex(e.target.value.toUpperCase());
                    setParseError(null);
                  }}
                  onBlur={() => applyHex(hex)}
                  spellCheck={false}
                  autoComplete="off"
                  className="w-28 rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm uppercase text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
                  aria-invalid={parseError ? true : undefined}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor={stepsId}
                className="block text-sm font-medium text-foreground"
              >
                Steps per side
              </label>
              <input
                id={stepsId}
                type="number"
                min={MIN_STEPS}
                max={MAX_STEPS}
                value={steps}
                onChange={(e) =>
                  setSteps(
                    Math.min(
                      MAX_STEPS,
                      Math.max(MIN_STEPS, Number(e.target.value) || MIN_STEPS),
                    ),
                  )
                }
                className="mt-1.5 w-24 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onImage}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <Upload className="size-4 shrink-0" aria-hidden />
              Sample from image
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!allHexList) return;
                try {
                  await navigator.clipboard.writeText(allHexList);
                  setBulkCopied("hex");
                  window.setTimeout(() => setBulkCopied(null), 1600);
                } catch {
                  setCopiedKey("err");
                  window.setTimeout(() => setCopiedKey(null), 2000);
                }
              }}
              disabled={!scale}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              {bulkCopied === "hex" ? (
                <Check
                  className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                />
              ) : (
                <Copy className="size-4 shrink-0" aria-hidden />
              )}
              Copy all HEX
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!cssVariables) return;
                try {
                  await navigator.clipboard.writeText(cssVariables);
                  setBulkCopied("css");
                  window.setTimeout(() => setBulkCopied(null), 1600);
                } catch {
                  setCopiedKey("err");
                  window.setTimeout(() => setCopiedKey(null), 2000);
                }
              }}
              disabled={!scale}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              {bulkCopied === "css" ? (
                <Check
                  className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                />
              ) : (
                <Copy className="size-4 shrink-0" aria-hidden />
              )}
              Copy CSS variables
            </button>
          </div>
        </div>

        {parseError ? (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {parseError}
          </p>
        ) : null}
        {imageHint ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
            {imageHint}
          </p>
        ) : null}

        {scale && baseRgb ? (
          <>
            <div>
              <p className="text-sm font-medium text-foreground">
                Scale preview
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Tints (lighter) → base → shades (darker). Contrast vs white /
                black is for the base only.
              </p>
              <div
                className="mt-3 flex flex-wrap gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900/50"
                role="list"
              >
                {scale.tints.map((swatch) => (
                  <button
                    key={swatch.hex}
                    type="button"
                    role="listitem"
                    title={`Copy ${swatch.hex}`}
                    onClick={() => copyText(swatch.hex, swatch.hex)}
                    className="group relative flex h-20 min-w-[4.5rem] flex-1 flex-col items-center justify-end rounded-lg border border-zinc-200/80 shadow-sm transition hover:ring-2 hover:ring-zinc-400 dark:border-zinc-700"
                    style={{ backgroundColor: swatch.hex }}
                  >
                    <span className="sr-only">{swatch.label}</span>
                    <span className="mb-1 rounded bg-black/45 px-1.5 py-0.5 font-mono text-[10px] text-white backdrop-blur-sm">
                      {swatch.hex}
                    </span>
                    <span className="absolute right-1 top-1 rounded bg-black/35 p-0.5 text-white opacity-0 transition group-hover:opacity-100">
                      {copiedKey === swatch.hex ? (
                        <Check className="size-3.5" aria-hidden />
                      ) : (
                        <Copy className="size-3.5" aria-hidden />
                      )}
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  role="listitem"
                  title={`Copy ${scale.base.hex}`}
                  onClick={() => copyText(scale.base.hex, scale.base.hex)}
                  className="group relative flex h-20 min-w-[5rem] flex-[1.15] flex-col items-center justify-end rounded-lg border-2 border-zinc-900 shadow-md dark:border-zinc-100"
                  style={{ backgroundColor: scale.base.hex }}
                >
                  <span className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-white drop-shadow-md dark:text-zinc-900">
                    Base
                  </span>
                  <span className="mb-1 rounded bg-black/45 px-1.5 py-0.5 font-mono text-[10px] text-white backdrop-blur-sm">
                    {scale.base.hex}
                  </span>
                  <span className="absolute right-1 top-1 rounded bg-black/35 p-0.5 text-white opacity-0 transition group-hover:opacity-100">
                    {copiedKey === scale.base.hex ? (
                      <Check className="size-3.5" aria-hidden />
                    ) : (
                      <Copy className="size-3.5" aria-hidden />
                    )}
                  </span>
                </button>
                {scale.shades.map((swatch) => (
                  <button
                    key={swatch.hex}
                    type="button"
                    role="listitem"
                    title={`Copy ${swatch.hex}`}
                    onClick={() => copyText(swatch.hex, swatch.hex)}
                    className="group relative flex h-20 min-w-[4.5rem] flex-1 flex-col items-center justify-end rounded-lg border border-zinc-200/80 shadow-sm transition hover:ring-2 hover:ring-zinc-400 dark:border-zinc-700"
                    style={{ backgroundColor: swatch.hex }}
                  >
                    <span className="sr-only">{swatch.label}</span>
                    <span className="mb-1 rounded bg-black/45 px-1.5 py-0.5 font-mono text-[10px] text-white backdrop-blur-sm">
                      {swatch.hex}
                    </span>
                    <span className="absolute right-1 top-1 rounded bg-black/35 p-0.5 text-white opacity-0 transition group-hover:opacity-100">
                      {copiedKey === swatch.hex ? (
                        <Check className="size-3.5" aria-hidden />
                      ) : (
                        <Copy className="size-3.5" aria-hidden />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Base contrast:{" "}
              <strong className="font-medium text-foreground">
                {contrastOnWhite}:1
              </strong>{" "}
              on white ·{" "}
              <strong className="font-medium text-foreground">
                {contrastOnBlack}:1
              </strong>{" "}
              on black—validate real text/background pairs with the{" "}
              <Link
                href="/design/contrast-checker"
                className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
              >
                WCAG contrast checker
              </Link>
              .
            </p>

            <div>
              <span className="text-sm font-medium text-foreground">
                CSS custom properties
              </span>
              <pre className="mt-1.5 max-h-48 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs leading-relaxed text-foreground dark:border-zinc-800 dark:bg-zinc-950">
                {cssVariables}
              </pre>
            </div>
          </>
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Enter a valid hex color to generate tints and shades.
          </p>
        )}

        {copiedKey === "err" ? (
          <p className="text-sm text-amber-700 dark:text-amber-400" role="status">
            Clipboard blocked—select and copy manually.
          </p>
        ) : null}
      </div>
    </div>
  );
}
