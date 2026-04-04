"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Check, Copy, Loader2, Upload } from "lucide-react";
import { md5Hex, shaHex } from "@/lib/hash-generator-core";

const MAX_BYTES = 200 * 1024 * 1024; // 200 MB soft limit

type HashRow = {
  label: string;
  value: string | null;
  error: string | null;
};

type RowsState = {
  MD5: HashRow;
  "SHA-1": HashRow;
  "SHA-256": HashRow;
};

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(bytes >= 100 * 1024 * 1024 ? 0 : 2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export function FileHashTool() {
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [fileLabel, setFileLabel] = useState<string | null>(null);
  const [fileBytes, setFileBytes] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<RowsState | null>(null);
  const [copyWhich, setCopyWhich] = useState<
    "MD5" | "SHA-1" | "SHA-256" | "all" | null
  >(null);

  useEffect(() => {
    if (!copyWhich) return;
    const t = window.setTimeout(() => setCopyWhich(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyWhich]);

  const compute = useCallback(async (file: File) => {
    setError(null);
    setRows(null);
    if (file.size > MAX_BYTES) {
      setError(
        `File is larger than ${Math.round(MAX_BYTES / (1024 * 1024))} MB. Try a smaller file or a desktop/streaming checksum tool for very large images and ISOs.`,
      );
      return;
    }

    setBusy(true);
    setFileLabel(file.name);
    setFileBytes(file.size);

    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      await new Promise<void>((r) => {
        requestAnimationFrame(() => r());
      });

      let md5: string;
      try {
        md5 = md5Hex(bytes);
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "MD5 computation failed in this browser.";
        setRows({
          MD5: { label: "MD5", value: null, error: msg },
          "SHA-1": { label: "SHA-1", value: null, error: null },
          "SHA-256": { label: "SHA-256", value: null, error: null },
        });
        setBusy(false);
        return;
      }

      const next: typeof rows = {
        MD5: { label: "MD5", value: md5, error: null },
        "SHA-1": { label: "SHA-1", value: null, error: null },
        "SHA-256": { label: "SHA-256", value: null, error: null },
      };

      for (const algo of ["SHA-1", "SHA-256"] as const) {
        try {
          next[algo].value = await shaHex(algo, bytes);
        } catch (e) {
          next[algo].error =
            e instanceof Error ? e.message : "Digest failed in this browser.";
        }
      }

      setRows(next);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not read that file. Try again or pick a different file.",
      );
      setFileLabel(null);
      setFileBytes(null);
    } finally {
      setBusy(false);
    }
  }, []);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    void compute(file);
  }

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (file) void compute(file);
    },
    [compute],
  );

  async function copyText(value: string, which: typeof copyWhich) {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopyWhich(which);
      setError(null);
    } catch {
      setError("Clipboard blocked—select the hash and copy manually.");
    }
  }

  function copyAllBlock(): string | null {
    if (!rows) return null;
    const lines: string[] = [];
    for (const key of ["MD5", "SHA-1", "SHA-256"] as const) {
      const r = rows[key];
      if (r.value) lines.push(`${r.label}: ${r.value}`);
    }
    return lines.length ? lines.join("\n") : null;
  }

  function clearAll() {
    setFileLabel(null);
    setFileBytes(null);
    setRows(null);
    setError(null);
    setCopyWhich(null);
    setBusy(false);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            id={fileId}
            type="file"
            className="sr-only"
            onChange={onFileChange}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {busy ? (
              <Loader2
                className="size-4 shrink-0 animate-spin"
                aria-hidden
              />
            ) : (
              <Upload className="size-4 shrink-0" aria-hidden />
            )}
            {busy ? "Hashing…" : "Upload file"}
          </button>
          {fileLabel ? (
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-medium text-foreground">{fileLabel}</span>
              {fileBytes != null ? (
                <>
                  {" "}
                  · {formatFileSize(fileBytes)}
                </>
              ) : null}
            </span>
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
            Drag and drop a file here, or use{" "}
            <button
              type="button"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 disabled:opacity-50 dark:hover:decoration-zinc-500"
            >
              Upload file
            </button>
            .
          </p>
        </div>

        {rows ? (
          <div className="space-y-4">
            {(["MD5", "SHA-1", "SHA-256"] as const).map((key) => {
              const r = rows[key];
              return (
                <div key={key}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {r.label}{" "}
                      <span className="font-normal text-zinc-500 dark:text-zinc-400">
                        (hex, lowercase)
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        r.value && copyText(r.value, key)
                      }
                      disabled={!r.value}
                      title={copyWhich === key ? "Copied" : `Copy ${r.label}`}
                      aria-label={
                        copyWhich === key
                          ? `Copied ${r.label}`
                          : `Copy ${r.label}`
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                    >
                      {copyWhich === key ? (
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
                  {r.error ? (
                    <p
                      className="mt-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
                      role="alert"
                    >
                      {r.error}
                    </p>
                  ) : (
                    <textarea
                      readOnly
                      value={r.value ?? ""}
                      rows={key === "SHA-256" ? 3 : 2}
                      className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-xs leading-relaxed text-foreground outline-none break-all dark:border-zinc-700 dark:bg-zinc-900/60"
                    />
                  )}
                </div>
              );
            })}

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const block = copyAllBlock();
                  if (block) void copyText(block, "all");
                }}
                disabled={!copyAllBlock()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                {copyWhich === "all" ? (
                  <Check
                    className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                    aria-hidden
                  />
                ) : (
                  <Copy className="size-4 shrink-0" aria-hidden />
                )}
                Copy all checksums
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                Clear
              </button>
            </div>
          </div>
        ) : !busy ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
            No file hashed yet. Upload any file to compute MD5, SHA-1, and
            SHA-256 digests for integrity checks and release verification.
          </p>
        ) : (
          <p
            className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
            role="status"
          >
            <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
            Reading file and computing hashes…
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
          Files stay in your browser. Hashes detect accidental corruption, not
          malware—use antivirus and trusted sources in addition to checksums.
        </p>
      </div>
    </div>
  );
}
