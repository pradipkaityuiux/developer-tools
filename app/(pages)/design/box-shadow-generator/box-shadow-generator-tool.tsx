"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload, X } from "lucide-react";

const MAX_BG_BYTES = 12 * 1024 * 1024;

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "").trim();
  if (h.length !== 6 || !/^[0-9a-fA-F]+$/.test(h)) {
    return `rgba(0, 0, 0, ${alpha})`;
  }
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type Preset = {
  label: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  hex: string;
  opacityPct: number;
  inset: boolean;
};

const PRESETS: Preset[] = [
  {
    label: "Soft card",
    offsetX: 0,
    offsetY: 4,
    blur: 14,
    spread: 0,
    hex: "#000000",
    opacityPct: 10,
    inset: false,
  },
  {
    label: "Floating",
    offsetX: 0,
    offsetY: 12,
    blur: 40,
    spread: -8,
    hex: "#000000",
    opacityPct: 18,
    inset: false,
  },
  {
    label: "Crisp drop",
    offsetX: 2,
    offsetY: 6,
    blur: 8,
    spread: 0,
    hex: "#000000",
    opacityPct: 22,
    inset: false,
  },
  {
    label: "Inset well",
    offsetX: 0,
    offsetY: 2,
    blur: 6,
    spread: 0,
    hex: "#000000",
    opacityPct: 12,
    inset: true,
  },
];

function buildBoxShadow(
  inset: boolean,
  offsetX: number,
  offsetY: number,
  blur: number,
  spread: number,
  hex: string,
  opacityPct: number,
): string {
  const a = Math.min(100, Math.max(0, opacityPct)) / 100;
  const color = hexToRgba(hex, a);
  const parts = [
    inset ? "inset" : null,
    `${offsetX}px`,
    `${offsetY}px`,
    `${blur}px`,
    `${spread}px`,
    color,
  ].filter(Boolean);
  return parts.join(" ");
}

export function BoxShadowGeneratorTool() {
  const baseId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(8);
  const [blur, setBlur] = useState(24);
  const [spread, setSpread] = useState(0);
  const [hex, setHex] = useState("#000000");
  const [opacityPct, setOpacityPct] = useState(14);
  const [inset, setInset] = useState(false);
  const [bgUrl, setBgUrl] = useState<string | null>(null);
  const [bgName, setBgName] = useState<string | null>(null);
  const [copyOk, setCopyOk] = useState(false);

  useEffect(() => {
    return () => {
      if (bgUrl) URL.revokeObjectURL(bgUrl);
    };
  }, [bgUrl]);

  useEffect(() => {
    if (!copyOk) return;
    const t = window.setTimeout(() => setCopyOk(false), 2000);
    return () => window.clearTimeout(t);
  }, [copyOk]);

  const boxShadowCss = useMemo(
    () => buildBoxShadow(inset, offsetX, offsetY, blur, spread, hex, opacityPct),
    [inset, offsetX, offsetY, blur, spread, hex, opacityPct],
  );

  const fullDeclaration = useMemo(
    () => `box-shadow: ${boxShadowCss};`,
    [boxShadowCss],
  );

  const applyPreset = useCallback((p: Preset) => {
    setOffsetX(p.offsetX);
    setOffsetY(p.offsetY);
    setBlur(p.blur);
    setSpread(p.spread);
    setHex(p.hex);
    setOpacityPct(p.opacityPct);
    setInset(p.inset);
  }, []);

  const onBgFile = useCallback((file: File | null) => {
    if (bgUrl) {
      URL.revokeObjectURL(bgUrl);
      setBgUrl(null);
      setBgName(null);
    }
    if (!file) return;
    if (file.size > MAX_BG_BYTES) {
      window.alert(
        `Image is too large (max ${Math.round(MAX_BG_BYTES / (1024 * 1024))} MB).`,
      );
      return;
    }
    if (!file.type.startsWith("image/")) {
      window.alert("Please choose an image file.");
      return;
    }
    setBgUrl(URL.createObjectURL(file));
    setBgName(file.name);
  }, [bgUrl]);

  const clearBg = useCallback(() => {
    if (bgUrl) URL.revokeObjectURL(bgUrl);
    setBgUrl(null);
    setBgName(null);
    if (fileRef.current) fileRef.current.value = "";
  }, [bgUrl]);

  const copyCss = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullDeclaration);
      setCopyOk(true);
    } catch {
      window.alert("Could not copy to the clipboard.");
    }
  }, [fullDeclaration]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileRef}
                id={`${baseId}-bg`}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => onBgFile(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Upload className="size-4 shrink-0" aria-hidden />
                Upload background
              </button>
              {bgUrl ? (
                <button
                  type="button"
                  onClick={clearBg}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  <X className="size-4 shrink-0" aria-hidden />
                  Clear background
                </button>
              ) : null}
              {bgName ? (
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {bgName}
                </span>
              ) : null}
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                checked={inset}
                onChange={(e) => setInset(e.target.checked)}
                className="size-4 rounded border-zinc-300 accent-zinc-900 dark:border-zinc-600 dark:accent-zinc-100"
              />
              Inset shadow
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${baseId}-ox`}
                  className="block text-sm font-medium text-foreground"
                >
                  Offset X: {offsetX}px
                </label>
                <input
                  id={`${baseId}-ox`}
                  type="range"
                  min={-80}
                  max={80}
                  value={offsetX}
                  onChange={(e) => setOffsetX(Number(e.target.value))}
                  className="mt-2 w-full accent-zinc-900 dark:accent-zinc-100"
                />
              </div>
              <div>
                <label
                  htmlFor={`${baseId}-oy`}
                  className="block text-sm font-medium text-foreground"
                >
                  Offset Y: {offsetY}px
                </label>
                <input
                  id={`${baseId}-oy`}
                  type="range"
                  min={-80}
                  max={80}
                  value={offsetY}
                  onChange={(e) => setOffsetY(Number(e.target.value))}
                  className="mt-2 w-full accent-zinc-900 dark:accent-zinc-100"
                />
              </div>
              <div>
                <label
                  htmlFor={`${baseId}-blur`}
                  className="block text-sm font-medium text-foreground"
                >
                  Blur: {blur}px
                </label>
                <input
                  id={`${baseId}-blur`}
                  type="range"
                  min={0}
                  max={96}
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="mt-2 w-full accent-zinc-900 dark:accent-zinc-100"
                />
              </div>
              <div>
                <label
                  htmlFor={`${baseId}-spread`}
                  className="block text-sm font-medium text-foreground"
                >
                  Spread: {spread}px
                </label>
                <input
                  id={`${baseId}-spread`}
                  type="range"
                  min={-40}
                  max={40}
                  value={spread}
                  onChange={(e) => setSpread(Number(e.target.value))}
                  className="mt-2 w-full accent-zinc-900 dark:accent-zinc-100"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label
                  htmlFor={`${baseId}-hex`}
                  className="block text-sm font-medium text-foreground"
                >
                  Shadow color
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    id={`${baseId}-hex`}
                    type="color"
                    value={hex}
                    onChange={(e) => setHex(e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded border border-zinc-300 bg-white p-1 dark:border-zinc-600"
                    aria-label="Shadow color"
                  />
                  <input
                    type="text"
                    value={hex}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setHex(v);
                    }}
                    className="w-28 rounded-lg border border-zinc-300 bg-white px-2 py-2 font-mono text-sm text-foreground dark:border-zinc-600 dark:bg-zinc-900"
                    spellCheck={false}
                    maxLength={7}
                    aria-label="Shadow color hex"
                  />
                </div>
              </div>
              <div className="min-w-[200px] flex-1">
                <label
                  htmlFor={`${baseId}-op`}
                  className="block text-sm font-medium text-foreground"
                >
                  Opacity: {opacityPct}%
                </label>
                <input
                  id={`${baseId}-op`}
                  type="range"
                  min={0}
                  max={100}
                  value={opacityPct}
                  onChange={(e) => setOpacityPct(Number(e.target.value))}
                  className="mt-2 w-full accent-zinc-900 dark:accent-zinc-100"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Live preview</p>
            <div
              className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 p-8 dark:border-zinc-700 dark:bg-zinc-900/80"
              style={
                bgUrl
                  ? {
                      backgroundImage: `url(${bgUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              {!bgUrl ? (
                <p className="pointer-events-none absolute inset-x-4 top-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
                  Optional: upload a background image to judge the shadow on
                  real content.
                </p>
              ) : null}
              <div
                className="relative z-[1] flex h-36 w-full max-w-xs items-center justify-center rounded-xl bg-white text-sm font-medium text-zinc-800 shadow-none dark:bg-zinc-800 dark:text-zinc-100"
                style={{ boxShadow: boxShadowCss }}
              >
                Card
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-foreground">CSS</p>
                <button
                  type="button"
                  onClick={() => void copyCss()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {copyOk ? (
                    <Check className="size-4 shrink-0" aria-hidden />
                  ) : (
                    <Copy className="size-4 shrink-0" aria-hidden />
                  )}
                  {copyOk ? "Copied" : "Copy CSS"}
                </button>
              </div>
              <pre
                className="mt-2 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs leading-relaxed text-foreground dark:border-zinc-800 dark:bg-zinc-900/60 sm:text-sm"
                tabIndex={0}
              >
                {fullDeclaration}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
