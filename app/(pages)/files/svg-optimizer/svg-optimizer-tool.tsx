"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  optimizeSvgMarkup,
  type SvgOptimizeOptions,
} from "@/lib/svg-optimize";

const MAX_BYTES = 2 * 1024 * 1024;

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), ms);
    return () => window.clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

export function SvgOptimizerTool() {
  const inputId = useId();
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [source, setSource] = useState("");
  const [fileLabel, setFileLabel] = useState<string | null>(null);
  const [stripMetadata, setStripMetadata] = useState(true);
  const [stripEditorData, setStripEditorData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copyOk, setCopyOk] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const debouncedSource = useDebounced(source, 280);

  const opts: SvgOptimizeOptions = useMemo(
    () => ({ stripMetadata, stripEditorData }),
    [stripMetadata, stripEditorData],
  );

  const result = useMemo(() => {
    if (!debouncedSource.trim()) {
      return null;
    }
    const out = optimizeSvgMarkup(debouncedSource, opts);
    if (!out.ok) {
      return { kind: "err" as const, message: out.error };
    }
    return { kind: "ok" as const, ...out };
  }, [debouncedSource, opts]);

  useEffect(() => {
    let url: string | null = null;
    if (result?.kind === "ok") {
      url = URL.createObjectURL(
        new Blob([result.svg], { type: "image/svg+xml" }),
      );
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [result]);

  useEffect(() => {
    if (result?.kind === "err") {
      setError(result.message);
    } else {
      setError(null);
    }
  }, [result]);

  useEffect(() => {
    if (!copyOk) return;
    const t = window.setTimeout(() => setCopyOk(false), 2000);
    return () => window.clearTimeout(t);
  }, [copyOk]);

  const loadFile = useCallback((file: File) => {
    setError(null);
    const name = file.name.toLowerCase();
    const isSvg =
      file.type === "image/svg+xml" ||
      file.type === "text/xml" ||
      file.type === "application/xml" ||
      name.endsWith(".svg");
    if (!isSvg) {
      setError("Please choose an SVG file (.svg) or XML containing SVG.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(
        `File is larger than ${Math.round(MAX_BYTES / (1024 * 1024))} MB. Try a smaller file or paste a fragment.`,
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      if (typeof text !== "string") {
        setError("Could not read that file as text.");
        return;
      }
      setSource(text);
      setFileLabel(file.name);
    };
    reader.onerror = () =>
      setError(reader.error?.message ?? "Could not read the file.");
    reader.readAsText(file, "UTF-8");
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

  async function copyOutput() {
    if (result?.kind !== "ok") return;
    try {
      await navigator.clipboard.writeText(result.svg);
      setCopyOk(true);
      setError(null);
    } catch {
      setError("Clipboard blocked—select the output text and copy manually.");
    }
  }

  function clearAll() {
    setSource("");
    setFileLabel(null);
    setError(null);
    setCopyOk(false);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            id={fileId}
            type="file"
            accept=".svg,image/svg+xml,text/xml,application/xml"
            className="sr-only"
            onChange={onFileChange}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Upload className="size-4 shrink-0" aria-hidden />
            Upload SVG
          </button>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={stripMetadata}
              onChange={(e) => setStripMetadata(e.target.checked)}
              className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900"
            />
            Remove metadata
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={stripEditorData}
              onChange={(e) => setStripEditorData(e.target.checked)}
              className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900"
            />
            Strip editor attributes
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
            Drag and drop an .svg here, or use{" "}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Upload SVG
            </button>
            .
          </p>
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor={`${inputId}-in`}
              className="text-sm font-medium text-foreground"
            >
              SVG input
            </label>
            {fileLabel ? (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Loaded:{" "}
                <span className="font-medium text-foreground">{fileLabel}</span>
              </span>
            ) : null}
          </div>
          <textarea
            id={`${inputId}-in`}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            spellCheck={false}
            rows={12}
            placeholder='Paste SVG markup, e.g. <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">...</svg>'
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-xs leading-relaxed text-foreground outline-none dark:border-zinc-700 dark:bg-zinc-900/60"
          />
        </div>

        {result?.kind === "ok" ? (
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Preview</p>
              <div className="flex min-h-[160px] items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-[repeating-conic-gradient(#f4f4f5_0%_25%,#fafafa_0%_50%)] bg-[length:20px_20px] p-4 dark:border-zinc-700 dark:bg-zinc-900 dark:bg-none">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Optimized SVG preview"
                    className="max-h-56 max-w-full object-contain"
                  />
                ) : null}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                <span className="font-medium text-foreground">
                  {(result.originalBytes / 1024).toFixed(2)} KB
                </span>{" "}
                →{" "}
                <span className="font-medium text-foreground">
                  {(result.optimizedBytes / 1024).toFixed(2)} KB
                </span>
                {result.savedBytes > 0 ? (
                  <>
                    {" "}
                    (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      −{result.savedBytes} bytes
                    </span>
                    )
                  </>
                ) : (
                  " (no size change)"
                )}
              </p>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor={`${inputId}-out`}
                  className="block text-sm font-medium text-foreground"
                >
                  Optimized output
                </label>
                <button
                  type="button"
                  onClick={copyOutput}
                  title={copyOk ? "Copied" : "Copy optimized SVG"}
                  aria-label={
                    copyOk ? "Copied optimized SVG" : "Copy optimized SVG"
                  }
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
                  Copy
                </button>
              </div>
              <textarea
                id={`${inputId}-out`}
                readOnly
                value={result.svg}
                rows={14}
                className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-xs leading-relaxed text-foreground outline-none break-all dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
          </div>
        ) : source.trim() ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
            Fix the input to see optimized output.
          </p>
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
            Paste SVG or upload a file to generate minified markup.
          </p>
        )}

        {source.trim() ? (
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
          Scripts are always removed from output for safety. Preview reflects
          optimized markup only—treat untrusted SVG like any other user content
          in production.
        </p>
      </div>
    </div>
  );
}
