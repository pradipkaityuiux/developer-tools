"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Download, Upload } from "lucide-react";

const MAX_BYTES = 15 * 1024 * 1024;
const MAX_EDGE = 8192;
const MAX_PIXELS = 32_000_000;

type OutputFormat = "image/png" | "image/jpeg" | "image/webp";

function extensionForMime(m: OutputFormat): string {
  if (m === "image/jpeg") return "jpg";
  if (m === "image/webp") return "webp";
  return "png";
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: OutputFormat,
  quality?: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), mime, quality);
  });
}

export function ImageResizerTool() {
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [sourceDataUrl, setSourceDataUrl] = useState<string | null>(null);
  const [fileLabel, setFileLabel] = useState<string | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<"percent" | "pixels">("percent");
  const [percent, setPercent] = useState(100);
  const [pixelW, setPixelW] = useState(0);
  const [pixelH, setPixelH] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [outputMime, setOutputMime] = useState<OutputFormat>("image/png");
  const [jpegQuality, setJpegQuality] = useState(0.92);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);

  const target = useMemo(() => {
    if (!natural) return null;
    if (mode === "percent") {
      const f = Math.max(0.01, percent / 100);
      return {
        w: Math.max(1, Math.round(natural.w * f)),
        h: Math.max(1, Math.round(natural.h * f)),
      };
    }
    return {
      w: Math.max(1, Math.round(pixelW)),
      h: Math.max(1, Math.round(pixelH)),
    };
  }, [mode, percent, pixelW, pixelH, natural]);

  const dimensionWarning = useMemo(() => {
    if (!target) return null;
    if (target.w > MAX_EDGE || target.h > MAX_EDGE) {
      return `Output exceeds ${MAX_EDGE}px on one side—reduce size to avoid browser canvas limits.`;
    }
    if (target.w * target.h > MAX_PIXELS) {
      return "Very large output dimensions may freeze the tab or fail—try a lower percentage or smaller pixel values.";
    }
    return null;
  }, [target]);

  const loadFile = useCallback((file: File) => {
    setError(null);
    setCopyDone(false);
    setPreviewUrl(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose a raster image (PNG, JPEG, WebP, GIF, etc.). SVG is not supported for canvas resize here.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(
        `File is larger than ${Math.round(MAX_BYTES / (1024 * 1024))} MB. Compress or split it first.`,
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
      setSourceDataUrl(result);
      setFileLabel(file.name);
      setNatural(null);
    };
    reader.onerror = () =>
      setError(reader.error?.message ?? "Could not read the file.");
    reader.readAsDataURL(file);
  }, []);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    loadFile(file);
  }

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (file) loadFile(file);
    },
    [loadFile],
  );

  function onHiddenImgLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    setNatural({ w, h });
    setPixelW(w);
    setPixelH(h);
    setPercent(100);
    setError(null);
  }

  function onHiddenImgError() {
    setError("Could not decode that image. Try another format.");
    setNatural(null);
  }

  function setWidthLocked(nextW: number) {
    if (!natural) return;
    const w = Math.max(1, Math.round(nextW));
    setPixelW(w);
    if (lockAspect) {
      setPixelH(Math.max(1, Math.round((w * natural.h) / natural.w)));
    }
  }

  function setHeightLocked(nextH: number) {
    if (!natural) return;
    const h = Math.max(1, Math.round(nextH));
    setPixelH(h);
    if (lockAspect) {
      setPixelW(Math.max(1, Math.round((h * natural.w) / natural.h)));
    }
  }

  useEffect(() => {
    let cancelled = false;

    if (!sourceDataUrl || !natural || !target || dimensionWarning) {
      queueMicrotask(() => {
        if (cancelled) return;
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
      });
      return () => {
        cancelled = true;
      };
    }

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = target.w;
      canvas.height = target.h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, target.w, target.h);

      const q = outputMime === "image/jpeg" ? jpegQuality : undefined;
      void canvasToBlob(canvas, outputMime, q).then((blob) => {
        if (cancelled || !blob) return;
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
      });
    };
    img.src = sourceDataUrl;

    return () => {
      cancelled = true;
      img.onload = null;
    };
  }, [sourceDataUrl, natural, target, outputMime, jpegQuality, dimensionWarning]);

  useEffect(() => {
    return () => {
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, []);

  async function getOutputBlob(): Promise<Blob | null> {
    if (!sourceDataUrl || !natural || !target || dimensionWarning) return null;
    const img = new window.Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("decode"));
      img.src = sourceDataUrl;
    });
    const canvas = document.createElement("canvas");
    canvas.width = target.w;
    canvas.height = target.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, target.w, target.h);
    const q = outputMime === "image/jpeg" ? jpegQuality : undefined;
    return canvasToBlob(canvas, outputMime, q);
  }

  async function downloadResized() {
    setError(null);
    try {
      const blob = await getOutputBlob();
      if (!blob) {
        setError("Nothing to download—fix dimension warnings or load an image.");
        return;
      }
      const ext = extensionForMime(outputMime);
      const base =
        fileLabel?.replace(/\.[^.]+$/, "")?.replace(/[^\w.-]+/g, "-") || "image";
      const name = `${base}-resized-${target?.w ?? 0}x${target?.h ?? 0}.${ext}`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Download failed. Try a smaller size or different format.");
    }
  }

  async function copyImage() {
    setError(null);
    try {
      const blob = await getOutputBlob();
      if (!blob) {
        setError("Nothing to copy—fix dimension warnings or load an image.");
        return;
      }
      const pngBlob =
        outputMime === "image/png"
          ? blob
          : await (async () => {
              const img = new window.Image();
              await new Promise<void>((res, rej) => {
                img.onload = () => res();
                img.onerror = () => rej(new Error("decode"));
                img.src = sourceDataUrl!;
              });
              const c = document.createElement("canvas");
              c.width = target!.w;
              c.height = target!.h;
              const ctx = c.getContext("2d");
              if (!ctx) throw new Error("ctx");
              ctx.drawImage(img, 0, 0, target!.w, target!.h);
              const b = await canvasToBlob(c, "image/png");
              if (!b) throw new Error("blob");
              return b;
            })();

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": pngBlob }),
      ]);
      setCopyDone(true);
      window.setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setError(
        "Clipboard image copy failed (HTTPS required in some browsers, or permission denied). Use Download instead.",
      );
    }
  }

  function clearAll() {
    setSourceDataUrl(null);
    setFileLabel(null);
    setNatural(null);
    setError(null);
    setCopyDone(false);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }

  const canExport = Boolean(sourceDataUrl && natural && target && !dimensionWarning);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            id={fileId}
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
          {sourceDataUrl ? (
            <button
              type="button"
              onClick={clearAll}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Clear
            </button>
          ) : null}
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={onDrop}
          className="rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50/80 p-4 dark:border-zinc-600 dark:bg-zinc-900/40 sm:p-6"
        >
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
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

        <canvas ref={canvasRef} className="hidden" aria-hidden />

        {/* Decode dimensions before `natural` exists — must not sit inside `natural && …` or onLoad never runs */}
        {sourceDataUrl && !natural ? (
          <>
            <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
              Loading image…
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={sourceDataUrl}
              src={sourceDataUrl}
              alt=""
              className="sr-only"
              onLoad={onHiddenImgLoad}
              onError={onHiddenImgError}
            />
          </>
        ) : null}

        {sourceDataUrl && natural ? (
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">Original</p>
                <div className="mt-2 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={sourceDataUrl}
                    src={sourceDataUrl}
                    alt={fileLabel ? `Original ${fileLabel}` : "Original upload"}
                    className="mx-auto max-h-56 w-auto max-w-full object-contain p-2"
                  />
                </div>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium text-foreground">{fileLabel}</span>
                  {" · "}
                  {natural.w}×{natural.h}px
                </p>
              </div>

              <fieldset className="space-y-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <legend className="px-1 text-xs font-medium text-foreground">
                  Resize mode
                </legend>
                <div className="flex flex-wrap gap-4 text-sm text-zinc-700 dark:text-zinc-300">
                  <label className="inline-flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="resize-mode"
                      checked={mode === "percent"}
                      onChange={() => setMode("percent")}
                      className="size-4 border-zinc-300 text-zinc-900 dark:border-zinc-600"
                    />
                    Percentage
                  </label>
                  <label className="inline-flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="resize-mode"
                      checked={mode === "pixels"}
                      onChange={() => {
                        if (!natural) {
                          setMode("pixels");
                          return;
                        }
                        const f = Math.max(0.01, percent / 100);
                        setPixelW(Math.max(1, Math.round(natural.w * f)));
                        setPixelH(Math.max(1, Math.round(natural.h * f)));
                        setMode("pixels");
                      }}
                      className="size-4 border-zinc-300 text-zinc-900 dark:border-zinc-600"
                    />
                    Exact pixels
                  </label>
                </div>

                {mode === "percent" ? (
                  <div>
                    <label
                      htmlFor={`${fileId}-pct`}
                      className="text-sm font-medium text-foreground"
                    >
                      Scale ({percent}%)
                    </label>
                    <input
                      id={`${fileId}-pct`}
                      type="range"
                      min={1}
                      max={400}
                      value={percent}
                      onChange={(e) => setPercent(Number(e.target.value))}
                      className="mt-2 w-full accent-zinc-900 dark:accent-zinc-100"
                    />
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={400}
                        value={percent}
                        onChange={(e) =>
                          setPercent(
                            Math.min(400, Math.max(1, Number(e.target.value) || 1)),
                          )
                        }
                        className="w-24 rounded-lg border border-zinc-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-900"
                      />
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        1–400%
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                      <input
                        type="checkbox"
                        checked={lockAspect}
                        onChange={(e) => {
                          const on = e.target.checked;
                          setLockAspect(on);
                          if (on && natural) {
                            setPixelH(
                              Math.max(
                                1,
                                Math.round((pixelW * natural.h) / natural.w),
                              ),
                            );
                          }
                        }}
                        className="rounded border-zinc-300 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900"
                      />
                      Lock aspect ratio
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor={`${fileId}-w`}
                          className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
                        >
                          Width (px)
                        </label>
                        <input
                          id={`${fileId}-w`}
                          type="number"
                          min={1}
                          value={pixelW || ""}
                          onChange={(e) => setWidthLocked(Number(e.target.value))}
                          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-900"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`${fileId}-h`}
                          className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
                        >
                          Height (px)
                        </label>
                        <input
                          id={`${fileId}-h`}
                          type="number"
                          min={1}
                          value={pixelH || ""}
                          onChange={(e) => setHeightLocked(Number(e.target.value))}
                          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-600 dark:bg-zinc-900"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </fieldset>

              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Output size
                </p>
                <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
                  {target ? `${target.w} × ${target.h}` : "—"}
                  <span className="ml-2 text-base font-normal text-zinc-500 dark:text-zinc-400">
                    px
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-foreground">
                  Output format
                </span>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  {(
                    [
                      ["image/png", "PNG"],
                      ["image/jpeg", "JPEG"],
                      ["image/webp", "WebP"],
                    ] as const
                  ).map(([mime, label]) => (
                    <label key={mime} className="inline-flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="out-mime"
                        checked={outputMime === mime}
                        onChange={() => setOutputMime(mime)}
                        className="size-4 border-zinc-300 text-zinc-900 dark:border-zinc-600"
                      />
                      {label}
                    </label>
                  ))}
                </div>
                {outputMime === "image/jpeg" ? (
                  <div className="mt-3">
                    <label
                      htmlFor={`${fileId}-q`}
                      className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
                    >
                      JPEG quality ({Math.round(jpegQuality * 100)}%)
                    </label>
                    <input
                      id={`${fileId}-q`}
                      type="range"
                      min={0.5}
                      max={1}
                      step={0.02}
                      value={jpegQuality}
                      onChange={(e) => setJpegQuality(Number(e.target.value))}
                      className="mt-1 w-full accent-zinc-900 dark:accent-zinc-100"
                    />
                  </div>
                ) : null}
              </div>

              <div>
                <p className="text-sm font-medium text-foreground">Preview</p>
                <div className="mt-2 min-h-[12rem] overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
                  {previewUrl && !dimensionWarning ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={previewUrl}
                      alt="Resized preview"
                      className="mx-auto max-h-64 w-auto max-w-full object-contain p-2"
                    />
                  ) : (
                    <p className="p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                      {dimensionWarning
                        ? "Adjust dimensions to see preview."
                        : "Generating preview…"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void downloadResized()}
                  disabled={!canExport}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  <Download className="size-4 shrink-0" aria-hidden />
                  Download resized
                </button>
                <button
                  type="button"
                  onClick={() => void copyImage()}
                  disabled={!canExport}
                  title={copyDone ? "Copied" : "Copy image"}
                  aria-label={copyDone ? "Copied image" : "Copy image to clipboard"}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  {copyDone ? (
                    <Check
                      className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                      aria-hidden
                    />
                  ) : (
                    <Copy className="size-4 shrink-0" aria-hidden />
                  )}
                  Copy image
                </button>
              </div>
            </div>
          </div>
        ) : !sourceDataUrl ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
            Load a PNG, JPEG, WebP, or GIF to resize by percentage or exact pixel
            dimensions. Everything stays in your browser.
          </p>
        ) : null}

        {dimensionWarning ? (
          <p
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
            role="alert"
          >
            {dimensionWarning}
          </p>
        ) : null}

        {error ? (
          <p
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          JPEG export may replace transparent regions with a solid background.
          Animated GIFs collapse to a single frame. For EXIF and camera metadata
          on the original file, use the image metadata viewer in the catalog.
        </p>
      </div>
    </div>
  );
}
