"use client";

import { useCallback, useId, useRef, useState } from "react";
import Link from "next/link";
import { Check, Copy, Upload } from "lucide-react";
import {
  buildHarmonyPalettes,
  clampSl,
  formatPaletteCssVars,
  hexToHsl,
  hslToHex,
  normalizeHue,
  type Hsl,
  type NamedSwatch,
} from "@/lib/palette-generator-core";
import { preventFocusScrollOnMouseDown } from "@/lib/prevent-focus-scroll";

const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

function parseHexInput(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  const withHash = t.startsWith("#") ? t : `#${t}`;
  const hsl = hexToHsl(withHash);
  if (!hsl) return null;
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

type PaletteKey = "complementary" | "triadic" | "analogous" | "monochrome";

const PALETTE_LABELS: Record<PaletteKey, string> = {
  complementary: "Complementary",
  triadic: "Triadic",
  analogous: "Analogous",
  monochrome: "Monochrome",
};

export function PaletteGeneratorTool() {
  const uploadId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [hsl, setHsl] = useState<Hsl>({ h: 214, s: 84, l: 52 });
  const [hexInput, setHexInput] = useState(() => hslToHex(214, 84, 52));
  const [hexError, setHexError] = useState<string | null>(null);
  const [busySample, setBusySample] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const hex = hslToHex(hsl.h, hsl.s, hsl.l);
  const palettes = buildHarmonyPalettes(hsl);

  const syncFromHex = useCallback((nextHex: string) => {
    const parsed = hexToHsl(nextHex);
    if (!parsed) {
      setHexError("Enter a valid hex like #3b82f6 or #3bf.");
      return false;
    }
    setHexError(null);
    setHsl({
      h: normalizeHue(parsed.h),
      s: clampSl(parsed.s),
      l: clampSl(parsed.l),
    });
    setHexInput(hslToHex(parsed.h, parsed.s, parsed.l));
    return true;
  }, []);

  function onHexBlur() {
    const normalized = parseHexInput(hexInput);
    if (normalized) {
      syncFromHex(normalized);
    } else {
      setHexInput(hex);
      setHexError(null);
    }
  }

  function onColorPickerChange(e: React.ChangeEvent<HTMLInputElement>) {
    syncFromHex(e.target.value);
  }

  async function copyText(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 2000);
    } catch {
      setError("Clipboard blocked—copy the value manually.");
    }
  }

  async function sampleAverageColor(file: File) {
    setError(null);
    setBusySample(true);
    try {
      const bitmap = await createImageBitmap(file);
      try {
        const w = Math.min(bitmap.width, 256);
        const h = Math.min(bitmap.height, 256);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas is not available.");
        ctx.drawImage(bitmap, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);
        let r = 0;
        let g = 0;
        let b = 0;
        let n = 0;
        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3] / 255;
          const rr = data[i];
          const gg = data[i + 1];
          const bb = data[i + 2];
          r += rr * a + 255 * (1 - a);
          g += gg * a + 255 * (1 - a);
          b += bb * a + 255 * (1 - a);
          n += 1;
        }
        if (n === 0) throw new Error("Could not read pixels.");
        r /= n;
        g /= n;
        b /= n;
        const hexFromRgb = `#${[r, g, b]
          .map((x) =>
            Math.max(0, Math.min(255, Math.round(x)))
              .toString(16)
              .padStart(2, "0"),
          )
          .join("")}`;
        syncFromHex(hexFromRgb);
      } finally {
        bitmap.close();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not sample that image.");
    } finally {
      setBusySample(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (f.size > MAX_IMAGE_BYTES) {
      setError(
        `Image is larger than ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))} MB.`,
      );
      return;
    }
    void sampleAverageColor(f);
  }

  function SwatchCard({
    swatch,
    copyId,
  }: {
    swatch: NamedSwatch;
    copyId: string;
  }) {
    const isCopied = copiedKey === copyId;
    return (
      <div className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
        <div
          className="h-16 w-full sm:h-20"
          style={{ backgroundColor: swatch.hex }}
          aria-hidden
        />
        <div className="flex items-center justify-between gap-2 border-t border-zinc-200 bg-white px-2 py-2 dark:border-zinc-700 dark:bg-zinc-950">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {swatch.label}
            </p>
            <p className="truncate font-mono text-sm font-medium text-foreground">
              {swatch.hex}
            </p>
          </div>
          <button
            type="button"
            onMouseDown={preventFocusScrollOnMouseDown}
            onClick={() => void copyText(swatch.hex, copyId)}
            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            aria-label={`Copy ${swatch.hex}`}
          >
            {isCopied ? (
              <Check
                className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                aria-hidden
              />
            ) : (
              <Copy className="size-3.5 shrink-0" aria-hidden />
            )}
            Copy
          </button>
        </div>
      </div>
    );
  }

  function PaletteSection({ pkey }: { pkey: PaletteKey }) {
    const swatches = palettes[pkey];
    const title = PALETTE_LABELS[pkey];
    const slug = pkey;
    const allHex = swatches.map((s) => s.hex).join(", ");
    const cssBlock = `:root {\n${formatPaletteCssVars(title, swatches)}\n}`;

    return (
      <section
        className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30"
        aria-labelledby={`${uploadId}-${slug}-heading`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3
              id={`${uploadId}-${slug}-heading`}
              className="text-base font-semibold text-foreground"
            >
              {title}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {pkey === "complementary" &&
                "Base hue plus a 180° opposite—high contrast pairs."}
              {pkey === "triadic" &&
                "Three hues 120° apart—balanced, vibrant triads."}
              {pkey === "analogous" &&
                "Neighbors on the wheel—smooth, cohesive gradients."}
              {pkey === "monochrome" &&
                "Same hue and saturation; lightness steps for UI depth."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onMouseDown={preventFocusScrollOnMouseDown}
              onClick={() => void copyText(allHex, `${slug}-all`)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              {copiedKey === `${slug}-all` ? (
                <Check
                  className="size-3.5 text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                />
              ) : (
                <Copy className="size-3.5" aria-hidden />
              )}
              Copy HEX list
            </button>
            <button
              type="button"
              onMouseDown={preventFocusScrollOnMouseDown}
              onClick={() => void copyText(cssBlock, `${slug}-css`)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              {copiedKey === `${slug}-css` ? (
                <Check
                  className="size-3.5 text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                />
              ) : (
                <Copy className="size-3.5" aria-hidden />
              )}
              Copy CSS vars
            </button>
          </div>
        </div>
        <div
          className={`mt-4 grid gap-3 ${swatches.length <= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-5"}`}
        >
          {swatches.map((sw, i) => (
            <SwatchCard
              key={`${pkey}-${sw.label}-${i}`}
              swatch={sw}
              copyId={`${slug}-${i}`}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label
                htmlFor={`${uploadId}-hex`}
                className="block text-sm font-medium text-foreground"
              >
                Base color
              </label>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <input
                  type="color"
                  id={`${uploadId}-picker`}
                  value={hex}
                  onChange={onColorPickerChange}
                  className="h-10 w-14 cursor-pointer rounded border border-zinc-300 bg-white p-1 dark:border-zinc-600"
                  aria-label="Choose base color"
                />
                <input
                  id={`${uploadId}-hex`}
                  type="text"
                  value={hexInput}
                  onChange={(e) => {
                    setHexInput(e.target.value);
                    setHexError(null);
                  }}
                  onBlur={onHexBlur}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                  spellCheck={false}
                  className="w-36 rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none dark:border-zinc-600 dark:bg-zinc-900"
                  placeholder="#2563eb"
                  aria-invalid={!!hexError}
                />
              </div>
              {hexError ? (
                <p className="mt-1 text-xs text-amber-800 dark:text-amber-200">
                  {hexError}
                </p>
              ) : null}
            </div>

            <div className="min-w-[200px] flex-1">
              <label
                htmlFor={`${uploadId}-h`}
                className="block text-sm font-medium text-foreground"
              >
                Hue: {Math.round(normalizeHue(hsl.h))}°
              </label>
              <input
                id={`${uploadId}-h`}
                type="range"
                min={0}
                max={359}
                step={1}
                value={Math.round(normalizeHue(hsl.h))}
                onChange={(e) => {
                  const h = Number(e.target.value);
                  const next = { ...hsl, h };
                  setHsl(next);
                  setHexInput(hslToHex(next.h, next.s, next.l));
                  setHexError(null);
                }}
                className="mt-2 w-full accent-zinc-900 dark:accent-zinc-100"
              />
            </div>
            <div className="min-w-[200px] flex-1">
              <label
                htmlFor={`${uploadId}-s`}
                className="block text-sm font-medium text-foreground"
              >
                Saturation: {Math.round(hsl.s)}%
              </label>
              <input
                id={`${uploadId}-s`}
                type="range"
                min={0}
                max={100}
                value={Math.round(hsl.s)}
                onChange={(e) => {
                  const s = Number(e.target.value);
                  const next = { ...hsl, s };
                  setHsl(next);
                  setHexInput(hslToHex(next.h, next.s, next.l));
                  setHexError(null);
                }}
                className="mt-2 w-full accent-zinc-900 dark:accent-zinc-100"
              />
            </div>
            <div className="min-w-[200px] flex-1">
              <label
                htmlFor={`${uploadId}-l`}
                className="block text-sm font-medium text-foreground"
              >
                Lightness: {Math.round(hsl.l)}%
              </label>
              <input
                id={`${uploadId}-l`}
                type="range"
                min={0}
                max={100}
                value={Math.round(hsl.l)}
                onChange={(e) => {
                  const l = Number(e.target.value);
                  const next = { ...hsl, l };
                  setHsl(next);
                  setHexInput(hslToHex(next.h, next.s, next.l));
                  setHexError(null);
                }}
                className="mt-2 w-full accent-zinc-900 dark:accent-zinc-100"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <input
              ref={fileRef}
              id={uploadId}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onFileChange}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busySample}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <Upload className="size-4 shrink-0" aria-hidden />
              {busySample ? "Sampling…" : "Upload image"}
            </button>
            <p className="max-w-xs text-xs text-zinc-500 dark:text-zinc-400">
              Averages pixels to set the base color—then adjust HSL for your
              system.
            </p>
          </div>
        </div>

        {error ? (
          <p
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div className="space-y-6">
          <PaletteSection pkey="complementary" />
          <PaletteSection pkey="triadic" />
          <PaletteSection pkey="analogous" />
          <PaletteSection pkey="monochrome" />
        </div>

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Export HEX for Figma tokens or CSS. For RGB, HSL, and CMYK strings, use
          the{" "}
          <Link
            href="/design/color-picker"
            className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
          >
            color picker and converter
          </Link>
          . Check contrast with the{" "}
          <Link
            href="/design/contrast-checker"
            className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
          >
            contrast checker
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
