"use client";

import { Check, Copy, Upload, X } from "lucide-react";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BORDER_RADIUS_PREVIEW_BOX_PX,
  type BorderRadiusUnit,
  type CornerRadii,
  buildBorderRadiusDeclaration,
  cornerValueToPx,
  formatCornerToken,
  pxToCornerValue,
  PILL_CSS,
} from "@/lib/border-radius-core";

const MAX_BY_UNIT: Record<BorderRadiusUnit, number> = {
  px: 200,
  rem: 12,
  "%": 50,
};

const PRESET_PX = [0, 4, 8, 16, 24] as const;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function BorderRadiusGeneratorTool() {
  const fileInputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [unit, setUnit] = useState<BorderRadiusUnit>("px");
  const [linked, setLinked] = useState(true);
  const [pillMode, setPillMode] = useState(false);
  const [corners, setCorners] = useState<CornerRadii>({
    tl: 12,
    tr: 12,
    br: 12,
    bl: 12,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLabel, setPreviewLabel] = useState<string | null>(null);
  const [copyOk, setCopyOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const max = MAX_BY_UNIT[unit];

  useEffect(() => {
    if (!copyOk) return;
    const t = window.setTimeout(() => setCopyOk(false), 2000);
    return () => window.clearTimeout(t);
  }, [copyOk]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onUnitChange = useCallback((next: BorderRadiusUnit) => {
    setUnit((prevUnit) => {
      if (prevUnit === next) return prevUnit;
      setCorners((c) => {
        const px = {
          tl: cornerValueToPx(c.tl, prevUnit),
          tr: cornerValueToPx(c.tr, prevUnit),
          br: cornerValueToPx(c.br, prevUnit),
          bl: cornerValueToPx(c.bl, prevUnit),
        };
        return {
          tl: pxToCornerValue(px.tl, next),
          tr: pxToCornerValue(px.tr, next),
          br: pxToCornerValue(px.br, next),
          bl: pxToCornerValue(px.bl, next),
        };
      });
      return next;
    });
  }, []);

  const cssOutput = useMemo(() => {
    if (pillMode) return PILL_CSS;
    return buildBorderRadiusDeclaration(corners, unit);
  }, [pillMode, corners, unit]);

  const previewStyle = useMemo((): CSSProperties => {
    if (pillMode) {
      return {
        borderRadius: "9999px",
        width: BORDER_RADIUS_PREVIEW_BOX_PX,
        maxWidth: "100%",
        height: 220,
      };
    }
    const px = {
      tl: cornerValueToPx(corners.tl, unit),
      tr: cornerValueToPx(corners.tr, unit),
      br: cornerValueToPx(corners.br, unit),
      bl: cornerValueToPx(corners.bl, unit),
    };
    return {
      borderTopLeftRadius: px.tl,
      borderTopRightRadius: px.tr,
      borderBottomRightRadius: px.br,
      borderBottomLeftRadius: px.bl,
      width: BORDER_RADIUS_PREVIEW_BOX_PX,
      maxWidth: "100%",
      height: 220,
    };
  }, [pillMode, corners, unit]);

  const copyCss = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cssOutput);
      setCopyOk(true);
      setError(null);
    } catch {
      setError("Could not copy to clipboard.");
    }
  }, [cssOutput]);

  const setCorner = useCallback(
    (key: keyof CornerRadii, value: number) => {
      setPillMode(false);
      const v = clamp(value, 0, max);
      setCorners((c) => (linked ? { tl: v, tr: v, br: v, bl: v } : { ...c, [key]: v }));
    },
    [linked, max],
  );

  const setLinkedValue = useCallback(
    (value: number) => {
      setPillMode(false);
      const v = clamp(value, 0, max);
      setCorners({ tl: v, tr: v, br: v, bl: v });
    },
    [max],
  );

  const applyPresetPx = useCallback(
    (px: number) => {
      setPillMode(false);
      const v = pxToCornerValue(px, unit);
      setLinked(true);
      setCorners({
        tl: v,
        tr: v,
        br: v,
        bl: v,
      });
    },
    [unit],
  );

  const onPickFile = useCallback((file: File | undefined) => {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPEG, WebP, GIF).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Image is too large (max 8 MB).");
      return;
    }
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setPreviewLabel(file.name);
  }, []);

  const clearPreview = useCallback(() => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setPreviewLabel(null);
  }, []);

  const linkedSliderValue = corners.tl;

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,400px)]">
        <div
          className="relative overflow-hidden border border-zinc-200 bg-zinc-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          style={previewStyle}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[repeating-conic-gradient(#e4e4e7_0%_25%,#fafafa_0%_50%)] bg-[length:20px_20px] dark:bg-[repeating-conic-gradient(#27272a_0%_25%,#18181b_0%_50%)]"
            style={{ borderRadius: "inherit" }}
          />
          {previewUrl ? (
            <img
              src={previewUrl}
              alt=""
              className="absolute inset-0 size-full object-cover"
              style={{ borderRadius: "inherit" }}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-zinc-600 dark:text-zinc-300"
              style={{ borderRadius: "inherit" }}
            >
              Live preview — rounded corners follow your values (or Pill mode).
            </div>
          )}
          <p className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {pillMode ? "Pill (9999px)" : "Live preview"}
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <span className="text-sm font-medium text-foreground">Unit</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["px", "rem", "%"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => onUnitChange(u)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    unit === u
                      ? "bg-foreground text-background"
                      : "border border-zinc-200 bg-white text-foreground hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                checked={linked}
                onChange={(e) => {
                  const on = e.target.checked;
                  setLinked(on);
                  if (on) {
                    const v = corners.tl;
                    setCorners({ tl: v, tr: v, br: v, bl: v });
                  }
                }}
                className="rounded border-zinc-300 accent-foreground dark:border-zinc-600"
              />
              Link all corners
            </label>
            <button
              type="button"
              onClick={() => {
                setPillMode(true);
              }}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pillMode
                  ? "bg-foreground text-background"
                  : "border border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              }`}
            >
              Pill
            </button>
          </div>

          {pillMode ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Pill mode outputs{" "}
              <code className="rounded bg-zinc-100 px-1 font-mono text-xs dark:bg-zinc-800">
                {PILL_CSS.trim()}
              </code>{" "}
              — ideal for buttons and tags. Adjust sliders or pick another preset
              to leave Pill mode.
            </p>
          ) : null}

          {!pillMode && linked ? (
            <div>
              <label
                htmlFor="radius-linked"
                className="block text-sm font-medium text-foreground"
              >
                Radius: {formatCornerToken(linkedSliderValue, unit)}
              </label>
              <input
                id="radius-linked"
                type="range"
                min={0}
                max={max}
                step={unit === "rem" ? 0.125 : unit === "%" ? 0.5 : 1}
                value={linkedSliderValue}
                onChange={(e) => setLinkedValue(Number(e.target.value))}
                disabled={pillMode}
                className="mt-2 w-full accent-foreground disabled:opacity-40"
              />
            </div>
          ) : null}

          {!pillMode && !linked ? (
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Corners (clockwise from top-left)
              </p>
              {(
                [
                  ["tl", "Top left"],
                  ["tr", "Top right"],
                  ["br", "Bottom right"],
                  ["bl", "Bottom left"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label
                    htmlFor={`corner-${key}`}
                    className="block text-sm font-medium text-foreground"
                  >
                    {label}: {formatCornerToken(corners[key], unit)}
                  </label>
                  <input
                    id={`corner-${key}`}
                    type="range"
                    min={0}
                    max={max}
                    step={unit === "rem" ? 0.125 : unit === "%" ? 0.5 : 1}
                    value={corners[key]}
                    onChange={(e) =>
                      setCorner(key, Number(e.target.value))
                    }
                    className="mt-2 w-full accent-foreground"
                  />
                </div>
              ))}
            </div>
          ) : null}

          <div>
            <span className="text-sm font-medium text-foreground">Quick presets</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {PRESET_PX.map((px) => (
                <button
                  key={px}
                  type="button"
                  onClick={() => applyPresetPx(px)}
                  className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                >
                  {px === 0 ? "None" : `${px}px`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
                onPickFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            {previewUrl ? (
              <button
                type="button"
                onClick={clearPreview}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                <X className="size-4" aria-hidden />
                Remove image
              </button>
            ) : null}
            {previewLabel ? (
              <span className="text-xs text-zinc-500">{previewLabel}</span>
            ) : null}
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
            Copy CSS
          </button>
        </div>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-zinc-100 p-3 font-mono text-sm text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
          <code>{cssOutput}</code>
        </pre>
      </div>
    </div>
  );
}
