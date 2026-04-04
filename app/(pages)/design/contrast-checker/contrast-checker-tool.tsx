"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  ArrowLeftRight,
  Check,
  Copy,
  Pipette,
  Upload,
} from "lucide-react";
import {
  contrastRatio,
  parseHexColor,
  rgbToHex,
  wcagLevels,
  type Rgb,
} from "@/lib/contrast-checker-core";

function normalizeHexInput(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  const parsed = parseHexColor(t.startsWith("#") ? t : `#${t}`);
  return parsed ? rgbToHex(parsed) : null;
}

export function ContrastCheckerTool() {
  const fileId = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [fgHex, setFgHex] = useState("#0f172a");
  const [bgHex, setBgHex] = useState("#f8fafc");
  const [fgDraft, setFgDraft] = useState("#0f172a");
  const [bgDraft, setBgDraft] = useState("#f8fafc");
  const [fgErr, setFgErr] = useState<string | null>(null);
  const [bgErr, setBgErr] = useState<string | null>(null);
  const [copyWhich, setCopyWhich] = useState<"fg" | "bg" | "ratio" | null>(
    null,
  );
  const [imageBitmap, setImageBitmap] = useState<ImageBitmap | null>(null);
  const [imageLabel, setImageLabel] = useState<string | null>(null);
  const [pickTarget, setPickTarget] = useState<"foreground" | "background">(
    "foreground",
  );

  const fgRgb: Rgb | null = parseHexColor(fgHex) ?? null;
  const bgRgb: Rgb | null = parseHexColor(bgHex) ?? null;
  const ratio =
    fgRgb && bgRgb ? contrastRatio(fgRgb, bgRgb) : null;
  const levels = ratio != null ? wcagLevels(ratio) : null;

  useEffect(() => {
    if (!copyWhich) return;
    const t = window.setTimeout(() => setCopyWhich(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyWhich]);

  useEffect(() => {
    setFgDraft(fgHex);
  }, [fgHex]);

  useEffect(() => {
    setBgDraft(bgHex);
  }, [bgHex]);

  const commitFg = useCallback(() => {
    const n = normalizeHexInput(fgDraft);
    if (!n) {
      setFgErr("Enter a valid hex such as #1a2b3c or #abc.");
      return;
    }
    setFgErr(null);
    setFgHex(n);
  }, [fgDraft]);

  const commitBg = useCallback(() => {
    const n = normalizeHexInput(bgDraft);
    if (!n) {
      setBgErr("Enter a valid hex such as #1a2b3c or #abc.");
      return;
    }
    setBgErr(null);
    setBgHex(n);
  }, [bgDraft]);

  async function copyText(value: string, which: typeof copyWhich) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyWhich(which);
    } catch {
      /* ignore */
    }
  }

  const swapColors = useCallback(() => {
    const nextFg = bgHex;
    const nextBg = fgHex;
    setFgHex(nextFg);
    setBgHex(nextBg);
    setFgDraft(nextFg);
    setBgDraft(nextBg);
    setFgErr(null);
    setBgErr(null);
  }, [fgHex, bgHex]);

  const drawImageToCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const bmp = imageBitmap;
    if (!bmp || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const maxW = 720;
    const maxH = 360;
    const scale = Math.min(maxW / bmp.width, maxH / bmp.height, 1);
    const w = Math.max(1, Math.floor(bmp.width * scale));
    const h = Math.max(1, Math.floor(bmp.height * scale));
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(bmp, 0, 0, w, h);
  }, [imageBitmap]);

  useEffect(() => {
    drawImageToCanvas();
  }, [drawImageToCanvas]);

  useEffect(() => {
    return () => {
      imageBitmap?.close();
    };
  }, [imageBitmap]);

  function onCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const d = ctx.getImageData(
      Math.max(0, Math.min(canvas.width - 1, x)),
      Math.max(0, Math.min(canvas.height - 1, y)),
      1,
      1,
    ).data;
    const hex = rgbToHex({ r: d[0], g: d[1], b: d[2] });
    if (pickTarget === "foreground") {
      setFgHex(hex);
      setFgDraft(hex);
      setFgErr(null);
    } else {
      setBgHex(hex);
      setBgDraft(hex);
      setBgErr(null);
    }
  }

  async function loadImageFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    try {
      const bmp = await createImageBitmap(file);
      setImageBitmap((prev) => {
        prev?.close();
        return bmp;
      });
      setImageLabel(file.name);
    } catch {
      /* ignore decode errors */
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    void loadImageFile(file);
  }

  function clearImage() {
    setImageBitmap((prev) => {
      prev?.close();
      return null;
    });
    setImageLabel(null);
  }

  const ratioStr = ratio != null ? ratio.toFixed(2) : "—";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor={`${fileId}-fg`}
                className="text-sm font-medium text-foreground"
              >
                Text (foreground)
              </label>
              <button
                type="button"
                onClick={() => fgHex && copyText(fgHex, "fg")}
                disabled={!fgRgb}
                title={copyWhich === "fg" ? "Copied" : "Copy HEX"}
                aria-label={
                  copyWhich === "fg"
                    ? "Copied foreground color"
                    : "Copy foreground HEX"
                }
                className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                {copyWhich === "fg" ? (
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
            <div className="flex flex-wrap items-center gap-2">
              <input
                id={`${fileId}-fg`}
                type="color"
                value={fgRgb ? rgbToHex(fgRgb) : "#000000"}
                onChange={(e) => {
                  const h = e.target.value;
                  setFgHex(h);
                  setFgDraft(h);
                  setFgErr(null);
                }}
                className="h-10 w-14 cursor-pointer rounded border border-zinc-300 bg-white p-0.5 dark:border-zinc-600"
                aria-label="Foreground color picker"
              />
              <input
                type="text"
                value={fgDraft}
                onChange={(e) => setFgDraft(e.target.value)}
                onBlur={commitFg}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitFg();
                }}
                spellCheck={false}
                className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60"
                aria-invalid={!!fgErr}
              />
            </div>
            {fgErr ? (
              <p className="text-xs text-amber-700 dark:text-amber-300" role="alert">
                {fgErr}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor={`${fileId}-bg`}
                className="text-sm font-medium text-foreground"
              >
                Background
              </label>
              <button
                type="button"
                onClick={() => bgHex && copyText(bgHex, "bg")}
                disabled={!bgRgb}
                title={copyWhich === "bg" ? "Copied" : "Copy HEX"}
                aria-label={
                  copyWhich === "bg"
                    ? "Copied background color"
                    : "Copy background HEX"
                }
                className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                {copyWhich === "bg" ? (
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
            <div className="flex flex-wrap items-center gap-2">
              <input
                id={`${fileId}-bg`}
                type="color"
                value={bgRgb ? rgbToHex(bgRgb) : "#ffffff"}
                onChange={(e) => {
                  const h = e.target.value;
                  setBgHex(h);
                  setBgDraft(h);
                  setBgErr(null);
                }}
                className="h-10 w-14 cursor-pointer rounded border border-zinc-300 bg-white p-0.5 dark:border-zinc-600"
                aria-label="Background color picker"
              />
              <input
                type="text"
                value={bgDraft}
                onChange={(e) => setBgDraft(e.target.value)}
                onBlur={commitBg}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitBg();
                }}
                spellCheck={false}
                className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60"
                aria-invalid={!!bgErr}
              />
            </div>
            {bgErr ? (
              <p className="text-xs text-amber-700 dark:text-amber-300" role="alert">
                {bgErr}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={swapColors}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <ArrowLeftRight className="size-4 shrink-0" aria-hidden />
            Swap colors
          </button>
          <button
            type="button"
            onClick={() =>
              ratio != null && copyText(`${ratio.toFixed(2)}:1`, "ratio")
            }
            disabled={ratio == null}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            {copyWhich === "ratio" ? (
              <Check
                className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                aria-hidden
              />
            ) : (
              <Copy className="size-4 shrink-0" aria-hidden />
            )}
            Copy contrast ratio
          </button>
        </div>

        {fgRgb && bgRgb ? (
          <div
            className="rounded-xl border border-zinc-200 p-6 shadow-inner dark:border-zinc-700"
            style={{ backgroundColor: rgbToHex(bgRgb) }}
          >
            <p
              className="text-lg font-medium leading-relaxed sm:text-xl"
              style={{ color: rgbToHex(fgRgb) }}
            >
              Sample heading — check readability at a glance.
            </p>
            <p
              className="mt-3 text-sm leading-relaxed sm:text-base"
              style={{ color: rgbToHex(fgRgb) }}
            >
              Body copy at default size should hit 4.5:1 for WCAG AA. This
              paragraph uses your foreground on your background so you can judge
              real typography, not only numbers.
            </p>
          </div>
        ) : null}

        {levels && ratio != null ? (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Contrast ratio
              </span>
              <span className="font-mono text-3xl font-semibold tabular-nums text-foreground">
                {ratioStr}
                <span className="text-lg font-normal text-zinc-500">:1</span>
              </span>
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {(
                [
                  levels.aaNormal,
                  levels.aaaNormal,
                  levels.aaLarge,
                  levels.aaaLarge,
                ] as const
              ).map((l) => (
                <li
                  key={l.label}
                  className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                >
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {l.label}
                  </span>
                  <span
                    className={
                      l.passes
                        ? "font-medium text-emerald-700 dark:text-emerald-400"
                        : "font-medium text-rose-700 dark:text-rose-400"
                    }
                  >
                    {l.passes ? "Pass" : "Fail"}
                    <span className="ml-1 font-normal text-zinc-500">
                      (≥ {l.minRatio}:1)
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Large text: roughly 18pt+ regular or 14pt+ bold. Thresholds follow
              WCAG 2.1 success criteria 1.4.3 and 1.4.6.
            </p>
          </div>
        ) : null}

        <div className="space-y-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <div className="flex flex-wrap items-center gap-2">
            <Pipette className="size-4 text-zinc-500" aria-hidden />
            <span className="text-sm font-medium text-foreground">
              Pick from image
            </span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Upload a screenshot or mockup, then click the image to sample a pixel
            into the{" "}
            <strong className="font-medium text-foreground">text</strong> or{" "}
            <strong className="font-medium text-foreground">background</strong>{" "}
            slot.
          </p>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
              <Upload className="size-4 shrink-0" aria-hidden />
              Upload image
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onFileChange}
              />
            </label>
            {imageBitmap ? (
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
          <div className="flex flex-wrap gap-3 text-sm">
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name={`${fileId}-pick`}
                checked={pickTarget === "foreground"}
                onChange={() => setPickTarget("foreground")}
                className="accent-zinc-900 dark:accent-zinc-100"
              />
              Apply samples to text color
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name={`${fileId}-pick`}
                checked={pickTarget === "background"}
                onChange={() => setPickTarget("background")}
                className="accent-zinc-900 dark:accent-zinc-100"
              />
              Apply samples to background
            </label>
          </div>
          {imageBitmap ? (
            <div className="relative inline-block max-w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
              <canvas
                ref={canvasRef}
                onClick={onCanvasClick}
                className="max-h-[360px] max-w-full cursor-crosshair"
                aria-label="Click to sample a color from the image"
              />
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (!file) return;
                void loadImageFile(file);
              }}
              className="rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50/80 p-6 text-center dark:border-zinc-600 dark:bg-zinc-900/40"
            >
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Drag and drop an image here, or use{" "}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  Upload image
                </button>
                .
              </p>
            </div>
          )}
        </div>

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Calculations use WCAG sRGB relative luminance. All processing happens
          in your browser; colors are not sent to a server.
        </p>
      </div>
    </div>
  );
}
