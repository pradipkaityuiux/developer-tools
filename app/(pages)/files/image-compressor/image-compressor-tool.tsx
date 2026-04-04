"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Check, Copy, Download, Upload } from "lucide-react";

const MAX_BYTES = 25 * 1024 * 1024;

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function extForMime(m: "image/jpeg" | "image/png"): string {
  return m === "image/jpeg" ? ".jpg" : ".png";
}

async function encodeCanvas(
  file: File,
  outputMime: "image/jpeg" | "image/png",
  quality01: number,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not available in this browser.");

    if (outputMime === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(bitmap, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (b) => resolve(b),
        outputMime,
        outputMime === "image/jpeg" ? quality01 : undefined,
      );
    });
    if (!blob) throw new Error("Could not encode the image.");
    return blob;
  } finally {
    bitmap.close();
  }
}

export function ImageCompressorTool() {
  const fileInputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [outputMime, setOutputMime] = useState<"image/jpeg" | "image/png">(
    "image/jpeg",
  );
  const [qualityPct, setQualityPct] = useState(82);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedPreviewUrl, setCompressedPreviewUrl] = useState<
    string | null
  >(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyOk, setCopyOk] = useState(false);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  useEffect(() => {
    if (!compressedBlob) {
      setCompressedPreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(compressedBlob);
    setCompressedPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [compressedBlob]);

  useEffect(() => {
    if (!copyOk) return;
    const t = window.setTimeout(() => setCopyOk(false), 2000);
    return () => window.clearTimeout(t);
  }, [copyOk]);

  const runCompress = useCallback(
    async (f: File, mime: "image/jpeg" | "image/png", q: number) => {
      setBusy(true);
      setError(null);
      try {
        const q01 = Math.min(100, Math.max(1, q)) / 100;
        const blob = await encodeCanvas(f, mime, q01);
        setCompressedBlob(blob);
      } catch (e) {
        setCompressedBlob(null);
        setError(e instanceof Error ? e.message : "Compression failed.");
      } finally {
        setBusy(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!file) {
      setCompressedBlob(null);
      return;
    }
    const id = window.setTimeout(() => {
      void runCompress(file, outputMime, qualityPct);
    }, outputMime === "image/jpeg" ? 120 : 0);
    return () => window.clearTimeout(id);
  }, [file, outputMime, qualityPct, runCompress]);

  const loadFile = useCallback((next: File) => {
    setError(null);
    if (!next.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (next.size > MAX_BYTES) {
      setError(
        `File is larger than ${Math.round(MAX_BYTES / (1024 * 1024))} MB. Try a smaller image first.`,
      );
      return;
    }
    setFile(next);
    setObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(next);
    });
    if (next.type === "image/png") {
      setOutputMime("image/png");
    } else {
      setOutputMime("image/jpeg");
    }
  }, []);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.files?.[0];
    e.target.value = "";
    if (!next) return;
    loadFile(next);
  }

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const next = e.dataTransfer.files?.[0];
      if (next) loadFile(next);
    },
    [loadFile],
  );

  const statsLine =
    file && compressedBlob
      ? `Before: ${formatBytes(file.size)} → After: ${formatBytes(compressedBlob.size)} (${file.size > 0 ? Math.round((1 - compressedBlob.size / file.size) * 100) : 0}% smaller) · ${outputMime === "image/jpeg" ? `JPEG ${qualityPct}% quality` : "PNG lossless re-encode"}`
      : "";

  async function copyStats() {
    if (!statsLine) return;
    try {
      await navigator.clipboard.writeText(statsLine);
      setCopyOk(true);
      setError(null);
    } catch {
      setError("Clipboard blocked—copy the text manually.");
    }
  }

  function downloadCompressed() {
    if (!compressedBlob || !file) return;
    const base = file.name.replace(/\.[^.]+$/, "") || "image";
    const name = `${base}-compressed${extForMime(outputMime)}`;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function clearAll() {
    setFile(null);
    setCompressedBlob(null);
    setError(null);
    setCopyOk(false);
    setObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }

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
          {file ? (
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
            . JPEG and PNG are ideal; WebP and other raster types work if the
            browser can decode them.
          </p>
        </div>

        {file && objectUrl ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
              <div className="min-w-[200px] flex-1">
                <label
                  htmlFor={`${fileInputId}-fmt`}
                  className="block text-sm font-medium text-foreground"
                >
                  Output format
                </label>
                <select
                  id={`${fileInputId}-fmt`}
                  value={outputMime}
                  onChange={(e) =>
                    setOutputMime(e.target.value as "image/jpeg" | "image/png")
                  }
                  className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none dark:border-zinc-600 dark:bg-zinc-900"
                >
                  <option value="image/jpeg">JPEG (lossy — quality slider)</option>
                  <option value="image/png">PNG (lossless re-encode)</option>
                </select>
              </div>
              {outputMime === "image/jpeg" ? (
                <div className="min-w-[220px] flex-1">
                  <label
                    htmlFor={`${fileInputId}-q`}
                    className="block text-sm font-medium text-foreground"
                  >
                    JPEG quality: {qualityPct}%
                  </label>
                  <input
                    id={`${fileInputId}-q`}
                    type="range"
                    min={40}
                    max={100}
                    value={qualityPct}
                    onChange={(e) => setQualityPct(Number(e.target.value))}
                    className="mt-2 w-full accent-zinc-900 dark:accent-zinc-100"
                  />
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Lower values shrink files more but add visible artifacts on
                    photos.
                  </p>
                </div>
              ) : (
                <p className="max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
                  PNG export is lossless in the browser. File size may drop if
                  metadata is stripped, or rise if the source was a heavily
                  optimized PNG—compare the before/after numbers below.
                </p>
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Original</p>
                <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={objectUrl}
                    alt={file.name ? `Original: ${file.name}` : "Original image"}
                    className="mx-auto max-h-64 w-auto max-w-full object-contain p-2"
                  />
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium text-foreground">{file.name}</span>
                  {" · "}
                  {formatBytes(file.size)}
                  {file.type ? (
                    <>
                      {" · "}
                      <code className="font-mono">{file.type}</code>
                    </>
                  ) : null}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Compressed preview
                </p>
                <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
                  {busy ? (
                    <p className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                      Encoding…
                    </p>
                  ) : compressedPreviewUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={compressedPreviewUrl}
                      alt="Compressed preview"
                      className="mx-auto max-h-64 w-auto max-w-full object-contain p-2"
                    />
                  ) : (
                    <p className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                      No preview yet.
                    </p>
                  )}
                </div>
                {compressedBlob && !busy ? (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {formatBytes(compressedBlob.size)}
                    {file.size > 0 && compressedBlob.size <= file.size ? (
                      <span className="text-emerald-700 dark:text-emerald-400">
                        {" "}
                        ·{" "}
                        {Math.round((1 - compressedBlob.size / file.size) * 100)}%
                        smaller
                      </span>
                    ) : file.size > 0 ? (
                      <span className="text-amber-800 dark:text-amber-200">
                        {" "}
                        · larger than original — try JPEG or lower quality
                      </span>
                    ) : null}
                  </p>
                ) : null}
              </div>
            </div>

            {statsLine && !busy ? (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900/50">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm leading-relaxed text-foreground">
                    {statsLine}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={copyStats}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                    >
                      {copyOk ? (
                        <Check
                          className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                          aria-hidden
                        />
                      ) : (
                        <Copy className="size-3.5 shrink-0" aria-hidden />
                      )}
                      Copy stats
                    </button>
                    <button
                      type="button"
                      onClick={downloadCompressed}
                      disabled={!compressedBlob}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      <Download className="size-3.5 shrink-0" aria-hidden />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
            No image loaded yet. Upload a JPEG, PNG, or other browser-supported
            raster image to compare size before and after compression.
          </p>
        )}

        {error ? (
          <p
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Processing stays in your browser. JPEG export blends transparent pixels
          against white. For exact byte-level workflows, verify hashes with the{" "}
          <Link
            href="/files/file-hash"
            className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
          >
            file hash checker
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
