"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Check, Copy, Download, Upload } from "lucide-react";

const MAX_BYTES = 15 * 1024 * 1024;

type OutputMime = "image/png" | "image/jpeg" | "image/webp";

function extensionForMime(m: OutputMime): string {
  if (m === "image/png") return "png";
  if (m === "image/jpeg") return "jpg";
  return "webp";
}

function stripExtension(name: string): string {
  const i = name.lastIndexOf(".");
  if (i <= 0) return name;
  return name.slice(0, i);
}

async function canvasToBlob(
  img: HTMLImageElement,
  mime: OutputMime,
  quality: number,
): Promise<Blob | null> {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (!w || !h) return null;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  if (mime === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(img, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob(
      (b) => resolve(b),
      mime,
      mime === "image/png" ? undefined : quality,
    );
  });
}

export function ImageConverterTool() {
  const fileInputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [fileLabel, setFileLabel] = useState<string | null>(null);
  const [fileBytes, setFileBytes] = useState<number | null>(null);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [outputMime, setOutputMime] = useState<OutputMime>("image/webp");
  const [quality, setQuality] = useState(0.92);
  const [outBlob, setOutBlob] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);

  const [copyDone, setCopyDone] = useState(false);

  useEffect(() => {
    if (!copyDone) return;
    const t = window.setTimeout(() => setCopyDone(false), 2000);
    return () => window.clearTimeout(t);
  }, [copyDone]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const loadFile = useCallback(
    (file: File) => {
      setError(null);
      setOutBlob(null);
      setLoadedImg(null);
      if (!file.type.startsWith("image/")) {
        setError(
          "Please choose an image file (PNG, JPEG, WebP, GIF, or similar).",
        );
        return;
      }
      if (file.size > MAX_BYTES) {
        setError(
          `File is larger than ${Math.round(MAX_BYTES / (1024 * 1024))} MB. Try compressing or resizing first.`,
        );
        return;
      }

      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      setFileLabel(file.name);
      setFileBytes(file.size);

      const im = new Image();
      im.crossOrigin = "anonymous";
      im.onload = () => {
        setLoadedImg(im);
        setError(null);
      };
      im.onerror = () => {
        setError(
          "Could not decode that image. Try PNG, JPEG, or WebP, or open it in an editor and re-export.",
        );
        setLoadedImg(null);
      };
      im.src = url;
    },
    [],
  );

  useEffect(() => {
    if (!loadedImg) {
      setOutBlob(null);
      return;
    }
    let cancelled = false;
    setBusy(true);
    void (async () => {
      try {
        const blob = await canvasToBlob(loadedImg, outputMime, quality);
        if (cancelled) return;
        if (!blob) {
          setError(
            outputMime === "image/webp"
              ? "WebP export is not supported in this browser. Try PNG or JPEG, or use a newer browser."
              : "Could not encode the image. Try another format.",
          );
          setOutBlob(null);
          return;
        }
        setOutBlob(blob);
        setError(null);
      } catch {
        if (!cancelled) {
          setError("Encoding failed. Try a different output format.");
          setOutBlob(null);
        }
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadedImg, outputMime, quality]);

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

  const previewUrl = objectUrl;
  const outObjectUrl = useRef<string | null>(null);
  const [previewOut, setPreviewOut] = useState<string | null>(null);

  useEffect(() => {
    if (outObjectUrl.current) {
      URL.revokeObjectURL(outObjectUrl.current);
      outObjectUrl.current = null;
    }
    if (!outBlob) {
      setPreviewOut(null);
      return;
    }
    const u = URL.createObjectURL(outBlob);
    outObjectUrl.current = u;
    setPreviewOut(u);
    return () => {
      if (outObjectUrl.current) {
        URL.revokeObjectURL(outObjectUrl.current);
        outObjectUrl.current = null;
      }
    };
  }, [outBlob]);

  async function copyImageToClipboard() {
    if (!outBlob) return;
    try {
      const item = new ClipboardItem({ [outBlob.type]: outBlob });
      await navigator.clipboard.write([item]);
      setCopyDone(true);
      setError(null);
    } catch {
      setError(
        "Clipboard image copy failed—use Download, or allow clipboard permissions.",
      );
    }
  }

  function downloadResult() {
    if (!outBlob || !fileLabel) return;
    const base = stripExtension(fileLabel);
    const ext = extensionForMime(outputMime);
    const name = `${base}.${ext}`;
    const url = URL.createObjectURL(outBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearAll() {
    setObjectUrl(null);
    setFileLabel(null);
    setFileBytes(null);
    setLoadedImg(null);
    setOutBlob(null);
    setError(null);
    setCopyDone(false);
  }

  const showQuality = outputMime !== "image/png";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            id={fileInputId}
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

        {loadedImg && previewUrl ? (
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Original</p>
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={fileLabel ? `Original ${fileLabel}` : "Original image"}
                  className="mx-auto max-h-56 w-auto max-w-full object-contain p-2"
                />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {fileLabel ? (
                  <>
                    <span className="font-medium text-foreground">
                      {fileLabel}
                    </span>
                    {fileBytes != null ? (
                      <>
                        {" "}
                        · {(fileBytes / 1024).toFixed(1)} KB
                      </>
                    ) : null}
                    {" "}
                    · {loadedImg.naturalWidth}×{loadedImg.naturalHeight}px
                  </>
                ) : null}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor={`${fileInputId}-format`}
                  className="block text-sm font-medium text-foreground"
                >
                  Output format
                </label>
                <select
                  id={`${fileInputId}-format`}
                  value={outputMime}
                  onChange={(e) =>
                    setOutputMime(e.target.value as OutputMime)
                  }
                  className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none dark:border-zinc-600 dark:bg-zinc-900"
                >
                  <option value="image/webp">WebP (.webp)</option>
                  <option value="image/jpeg">JPEG (.jpg)</option>
                  <option value="image/png">PNG (.png)</option>
                </select>
              </div>

              {showQuality ? (
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor={`${fileInputId}-q`}
                      className="text-sm font-medium text-foreground"
                    >
                      Quality
                    </label>
                    <span className="text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                      {Math.round(quality * 100)}%
                    </span>
                  </div>
                  <input
                    id={`${fileInputId}-q`}
                    type="range"
                    min={0.5}
                    max={1}
                    step={0.02}
                    value={quality}
                    onChange={(e) =>
                      setQuality(Number.parseFloat(e.target.value))
                    }
                    className="mt-2 w-full accent-zinc-900 dark:accent-zinc-100"
                  />
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Applies to JPEG and WebP. PNG stays lossless.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  PNG export is lossless; quality slider is hidden.
                </p>
              )}

              <div>
                <p className="text-sm font-medium text-foreground">
                  Converted preview
                </p>
                <div className="mt-1.5 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
                  {busy ? (
                    <p className="p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                      Encoding…
                    </p>
                  ) : previewOut ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={previewOut}
                      alt="Converted output preview"
                      className="mx-auto max-h-56 w-auto max-w-full object-contain p-2"
                    />
                  ) : (
                    <p className="p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                      Could not build preview.
                    </p>
                  )}
                </div>
                {outBlob ? (
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    Output size · {(outBlob.size / 1024).toFixed(1)} KB (
                    {outputMime.replace("image/", "").toUpperCase()})
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={downloadResult}
                  disabled={!outBlob || busy}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  <Download className="size-4 shrink-0" aria-hidden />
                  Download
                </button>
                <button
                  type="button"
                  onClick={copyImageToClipboard}
                  disabled={!outBlob || busy}
                  title={copyDone ? "Copied" : "Copy image to clipboard"}
                  aria-label={
                    copyDone ? "Copied image" : "Copy image to clipboard"
                  }
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
                  {copyDone ? "Copied" : "Copy image"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
            No image loaded yet. Upload a PNG, JPEG, WebP, or other
            browser-supported raster image to convert between JPG, PNG, and WebP.
          </p>
        )}

        {loadedImg ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={clearAll}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Clear
            </button>
          </div>
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
          Processing stays in your browser. JPEG flattens transparency onto
          white. Clipboard image paste depends on the app you paste into.
        </p>
      </div>
    </div>
  );
}
