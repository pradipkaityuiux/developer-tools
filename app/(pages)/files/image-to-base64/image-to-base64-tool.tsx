"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB soft limit

function parseDataUrl(dataUrl: string): { mime: string; base64: string } | null {
  const m = /^data:([^;]+);base64,([\s\S]*)$/i.exec(dataUrl.trim());
  if (!m?.[1] || m[2] === undefined) return null;
  return { mime: m[1], base64: m[2].replace(/\s/g, "") };
}

function wrapBase64(b64: string, width: number): string {
  const lines: string[] = [];
  for (let i = 0; i < b64.length; i += width) {
    lines.push(b64.slice(i, i + width));
  }
  return lines.join("\n");
}

export function ImageToBase64Tool() {
  const inputId = useId();
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [fileLabel, setFileLabel] = useState<string | null>(null);
  const [fileBytes, setFileBytes] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wrapLines, setWrapLines] = useState(false);
  const [copyWhich, setCopyWhich] = useState<"data" | "b64" | null>(null);

  const parsed = dataUrl ? parseDataUrl(dataUrl) : null;
  const base64Payload = parsed?.base64 ?? "";
  const mime = parsed?.mime ?? "";
  const displayBase64 = wrapLines ? wrapBase64(base64Payload, 76) : base64Payload;

  useEffect(() => {
    if (!copyWhich) return;
    const t = window.setTimeout(() => setCopyWhich(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyWhich]);

  const loadFile = useCallback((file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPEG, GIF, WebP, SVG, etc.).");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(
        `File is larger than ${Math.round(MAX_BYTES / (1024 * 1024))} MB. Try a smaller image or compress it first.`,
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
      setDataUrl(result);
      setFileLabel(file.name);
      setFileBytes(file.size);
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

  async function copyText(value: string, which: "data" | "b64") {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopyWhich(which);
      setError(null);
    } catch {
      setError("Clipboard blocked—select the text and copy manually.");
    }
  }

  function clearAll() {
    setDataUrl(null);
    setFileLabel(null);
    setFileBytes(null);
    setError(null);
    setCopyWhich(null);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
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
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={wrapLines}
              onChange={(e) => setWrapLines(e.target.checked)}
              className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900"
            />
            Wrap Base64 at 76 characters (readability)
          </label>
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

        {dataUrl ? (
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Preview</p>
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dataUrl}
                  alt={fileLabel ? `Preview of ${fileLabel}` : "Uploaded image preview"}
                  className="mx-auto max-h-64 w-auto max-w-full object-contain p-2"
                />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {fileLabel ? (
                  <>
                    <span className="font-medium text-foreground">{fileLabel}</span>
                    {fileBytes != null ? (
                      <>
                        {" "}
                        · {(fileBytes / 1024).toFixed(1)} KB
                      </>
                    ) : null}
                    {mime ? (
                      <>
                        {" "}
                        · <code className="font-mono">{mime}</code>
                      </>
                    ) : null}
                  </>
                ) : null}
              </p>
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label
                    htmlFor={`${inputId}-data`}
                    className="block text-sm font-medium text-foreground"
                  >
                    Full data URI
                  </label>
                  <button
                    type="button"
                    onClick={() => dataUrl && copyText(dataUrl, "data")}
                    disabled={!dataUrl}
                    title={copyWhich === "data" ? "Copied" : "Copy data URI"}
                    aria-label={
                      copyWhich === "data" ? "Copied data URI" : "Copy data URI"
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  >
                    {copyWhich === "data" ? (
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
                <textarea
                  id={`${inputId}-data`}
                  readOnly
                  value={dataUrl}
                  rows={6}
                  className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-xs leading-relaxed text-foreground outline-none break-all dark:border-zinc-700 dark:bg-zinc-900/60"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label
                    htmlFor={`${inputId}-b64`}
                    className="block text-sm font-medium text-foreground"
                  >
                    Base64 only (no data: prefix)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      base64Payload && copyText(displayBase64, "b64")
                    }
                    disabled={!base64Payload}
                    title={copyWhich === "b64" ? "Copied" : "Copy Base64"}
                    aria-label={
                      copyWhich === "b64" ? "Copied Base64" : "Copy Base64"
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  >
                    {copyWhich === "b64" ? (
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
                <textarea
                  id={`${inputId}-b64`}
                  readOnly
                  value={displayBase64}
                  rows={10}
                  className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-xs leading-relaxed text-foreground outline-none break-all dark:border-zinc-700 dark:bg-zinc-900"
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
            No image loaded yet. Upload a PNG, JPEG, WebP, GIF, SVG, or other
            browser-supported image to generate a Base64 data URI.
          </p>
        )}

        {dataUrl ? (
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
          Images are processed only in your browser. Base64 is not encryption—do
          not use it to hide sensitive screenshots in public repos or tickets.
        </p>
      </div>
    </div>
  );
}
