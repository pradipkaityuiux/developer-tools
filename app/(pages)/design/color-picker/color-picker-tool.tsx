"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Check, Copy, Pipette, Upload } from "lucide-react";
import {
  cmykToRgb,
  formatCmykPercent,
  formatHslCss,
  formatRgbCss,
  hslToRgb,
  parseHex,
  rgbToCmyk,
  rgbToHex,
  rgbToHsl,
  type Cmyk,
  type Rgb,
} from "@/lib/color-picker-core";

const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

type CopyKey = "hex" | "rgb" | "hsl" | "cmyk" | null;

function CopyValueButton({
  copyKey,
  text,
  label,
  copied,
  onCopy,
}: {
  copyKey: Exclude<CopyKey, null>;
  text: string;
  label: string;
  copied: CopyKey;
  onCopy: (key: Exclude<CopyKey, null>, value: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onCopy(copyKey, text)}
      title={copied === copyKey ? "Copied" : label}
      aria-label={copied === copyKey ? `Copied ${label}` : label}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
    >
      {copied === copyKey ? (
        <Check
          className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
          aria-hidden
        />
      ) : (
        <Copy className="size-3.5 shrink-0" aria-hidden />
      )}
      Copy
    </button>
  );
}

function useCopyFeedback() {
  const [copied, setCopied] = useState<CopyKey>(null);
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(null), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);
  return { copied, setCopied };
}

export function ColorPickerTool() {
  const baseId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [rgb, setRgb] = useState<Rgb>({ r: 99, g: 102, b: 241 });
  const [hexDraft, setHexDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageLabel, setImageLabel] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const { copied, setCopied } = useCopyFeedback();

  const hexCanonical = rgbToHex(rgb.r, rgb.g, rgb.b);
  const hexShown = hexDraft ?? hexCanonical;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  const commitRgb = useCallback((next: Rgb) => {
    setHexDraft(null);
    setRgb(next);
    setError(null);
  }, []);

  async function copyText(key: Exclude<CopyKey, null>, text: string) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setError(null);
    } catch {
      setError("Clipboard blocked—select the value and copy manually.");
    }
  }

  const drawImageToCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const src = imageSrc;
    if (!canvas || !src) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const maxW = 560;
      const maxH = 320;
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      const scale = Math.min(1, maxW / w, maxH / h);
      w = Math.max(1, Math.floor(w * scale));
      h = Math.max(1, Math.floor(h * scale));
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
    };
    img.onerror = () => setError("Could not decode that image.");
    img.src = src;
  }, [imageSrc]);

  useEffect(() => {
    drawImageToCanvas();
  }, [drawImageToCanvas]);

  function loadImageFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPEG, WebP, GIF, etc.).");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError(
        `Image is larger than ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))} MB.`,
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        setError("Could not read that file.");
        return;
      }
      setImageSrc(result);
      setImageLabel(file.name);
    };
    reader.onerror = () =>
      setError(reader.error?.message ?? "Could not read the file.");
    reader.readAsDataURL(file);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    loadImageFile(file);
  }

  function onCanvasClick(e: React.MouseEvent<HTMLElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(
      ((e.clientX - rect.left) / rect.width) * canvas.width,
    );
    const y = Math.floor(
      ((e.clientY - rect.top) / rect.height) * canvas.height,
    );
    const data = ctx.getImageData(x, y, 1, 1).data;
    commitRgb({ r: data[0], g: data[1], b: data[2] });
  }

  async function pickFromScreen() {
    setError(null);
    const EyeDropperCtor = (
      globalThis as unknown as {
        EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
      }
    ).EyeDropper;
    if (!EyeDropperCtor) {
      setError("EyeDropper is not supported in this browser.");
      return;
    }
    try {
      const eye = new EyeDropperCtor();
      const result = await eye.open();
      const p = parseHex(result.sRGBHex);
      if (p) commitRgb(p);
    } catch {
      /* user cancelled */
    }
  }

  function clearImage() {
    setImageSrc(null);
    setImageLabel(null);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="flex flex-col items-start gap-3">
            <div
              className="h-36 w-full max-w-sm rounded-xl border border-zinc-200 shadow-inner sm:h-40 dark:border-zinc-700"
              style={{ backgroundColor: hexCanonical }}
            />
            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor={`${baseId}-native`}
                className="text-sm font-medium text-foreground"
              >
                Color
              </label>
              <input
                id={`${baseId}-native`}
                type="color"
                value={hexCanonical}
                onChange={(e) => {
                  const p = parseHex(e.target.value);
                  if (p) commitRgb(p);
                }}
                className="h-10 w-16 cursor-pointer rounded border border-zinc-300 bg-white p-1 dark:border-zinc-600"
              />
              <button
                type="button"
                onClick={pickFromScreen}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Pipette className="size-4 shrink-0" aria-hidden />
                Sample from screen
              </button>
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor={`${baseId}-hex`}
                  className="text-sm font-medium text-foreground"
                >
                  HEX
                </label>
                <CopyValueButton
                  copyKey="hex"
                  text={hexCanonical}
                  label="Copy HEX"
                  copied={copied}
                  onCopy={copyText}
                />
              </div>
              <input
                id={`${baseId}-hex`}
                type="text"
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                value={hexShown}
                onChange={(e) => {
                  const v = e.target.value;
                  setHexDraft(v);
                  const p = parseHex(v);
                  if (p) commitRgb(p);
                }}
                onBlur={() => setHexDraft(null)}
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-sm text-foreground outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/60 dark:focus:ring-zinc-600"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {(["r", "g", "b"] as const).map((ch) => (
                <div key={ch}>
                  <label
                    htmlFor={`${baseId}-${ch}`}
                    className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
                  >
                    {ch.toUpperCase()}
                  </label>
                  <input
                    id={`${baseId}-${ch}`}
                    type="number"
                    min={0}
                    max={255}
                    value={rgb[ch]}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (Number.isNaN(n)) return;
                      commitRgb({ ...rgb, [ch]: n });
                    }}
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium text-foreground">RGB</span>
              <CopyValueButton
                copyKey="rgb"
                text={formatRgbCss(rgb)}
                label="Copy RGB"
                copied={copied}
                onCopy={copyText}
              />
            </div>
            <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
              {formatRgbCss(rgb)}
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label
                  htmlFor={`${baseId}-h`}
                  className="text-xs font-medium text-zinc-500 dark:text-zinc-400"
                >
                  H (deg)
                </label>
                <input
                  id={`${baseId}-h`}
                  type="number"
                  step={0.1}
                  value={hsl.h}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (Number.isNaN(n)) return;
                    commitRgb(hslToRgb(n, hsl.s, hsl.l));
                  }}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
                />
              </div>
              <div>
                <label
                  htmlFor={`${baseId}-s`}
                  className="text-xs font-medium text-zinc-500 dark:text-zinc-400"
                >
                  S (%)
                </label>
                <input
                  id={`${baseId}-s`}
                  type="number"
                  min={0}
                  max={100}
                  value={hsl.s}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (Number.isNaN(n)) return;
                    commitRgb(hslToRgb(hsl.h, n, hsl.l));
                  }}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
                />
              </div>
              <div>
                <label
                  htmlFor={`${baseId}-l`}
                  className="text-xs font-medium text-zinc-500 dark:text-zinc-400"
                >
                  L (%)
                </label>
                <input
                  id={`${baseId}-l`}
                  type="number"
                  min={0}
                  max={100}
                  value={hsl.l}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (Number.isNaN(n)) return;
                    commitRgb(hslToRgb(hsl.h, hsl.s, n));
                  }}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium text-foreground">HSL</span>
              <CopyValueButton
                copyKey="hsl"
                text={formatHslCss(hsl)}
                label="Copy HSL"
                copied={copied}
                onCopy={copyText}
              />
            </div>
            <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
              {formatHslCss(hsl)}
            </p>

            <CmykEditor cmyk={cmyk} baseId={baseId} commitRgb={commitRgb} />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium text-foreground">CMYK</span>
              <CopyValueButton
                copyKey="cmyk"
                text={formatCmykPercent(cmyk)}
                label="Copy CMYK"
                copied={copied}
                onCopy={copyText}
              />
            </div>
            <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
              {formatCmykPercent(cmyk)}
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileRef}
              id={`${baseId}-file`}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onFileChange}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Upload className="size-4 shrink-0" aria-hidden />
              Upload image
            </button>
            {imageSrc ? (
              <button
                type="button"
                onClick={clearImage}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                Remove image
              </button>
            ) : null}
            {imageLabel ? (
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-medium text-foreground">{imageLabel}</span>
              </span>
            ) : null}
          </div>
          {imageSrc ? (
            <div className="mt-4">
              <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
                Click the image to sample a pixel. Values update HEX, RGB, HSL,
                and CMYK.
              </p>
              <button
                type="button"
                onClick={onCanvasClick}
                className="max-w-full cursor-crosshair rounded-lg border border-zinc-200 p-0 dark:border-zinc-700"
                aria-label="Click to sample a color from the uploaded image"
              >
                <canvas
                  ref={canvasRef}
                  className="pointer-events-none block max-h-80 max-w-full"
                />
              </button>
            </div>
          ) : (
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              Optional: upload a screenshot or asset, then click to grab an exact
              pixel—useful for matching brand colors from mockups.
            </p>
          )}
        </div>

        {error ? (
          <p
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Conversions assume sRGB. CMYK is an approximate reference for print
          handoffs; always proof with your printer profile.
        </p>
      </div>
    </div>
  );
}

function CmykEditor({
  cmyk,
  baseId,
  commitRgb,
}: {
  cmyk: Cmyk;
  baseId: string;
  commitRgb: (next: Rgb) => void;
}) {
  const row = (key: keyof Cmyk, label: string) => (
    <div key={key}>
      <label
        htmlFor={`${baseId}-cmyk-${key}`}
        className="text-xs font-medium text-zinc-500 dark:text-zinc-400"
      >
        {label}
      </label>
      <input
        id={`${baseId}-cmyk-${key}`}
        type="number"
        min={0}
        max={100}
        step={0.1}
        value={cmyk[key]}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isNaN(n)) return;
          const next: Cmyk = { ...cmyk, [key]: n };
          commitRgb(cmykToRgb(next.c, next.m, next.y, next.k));
        }}
        className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
    </div>
  );

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {row("c", "C (%)")}
      {row("m", "M (%)")}
      {row("y", "Y (%)")}
      {row("k", "K (%)")}
    </div>
  );
}
