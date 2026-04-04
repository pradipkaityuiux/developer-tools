"use client";

import { useCallback, useId, useMemo, useState } from "react";
import {
  type JsonToCsvDelimiter,
  jsonTextToCsv,
} from "@/lib/json-to-csv";

const SAMPLE = `[
  { "id": 1, "product": "Keyboard", "price": 79.99, "tags": ["input", "usb"] },
  { "id": 2, "product": "Monitor", "price": 249, "inStock": true },
  { "id": 3, "product": "Dock", "price": 189.5, "meta": { "watts": 65 } }
]`;

function downloadText(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function JsonToCsvTool() {
  const idJson = useId();
  const idDelim = useId();
  const idBom = useId();
  const [input, setInput] = useState("");
  const [delimiter, setDelimiter] = useState<JsonToCsvDelimiter>(",");
  const [utf8Bom, setUtf8Bom] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [csvOut, setCsvOut] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    columnCount: number;
    rowCount: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const previewLines = useMemo(() => {
    if (!csvOut) return [];
    return csvOut.split(/\r?\n/).slice(0, 8);
  }, [csvOut]);

  const convert = useCallback(() => {
    setCopied(false);
    const result = jsonTextToCsv(input, delimiter);
    if (!result.ok) {
      setError(result.error);
      setCsvOut(null);
      setStats(null);
      return;
    }
    setError(null);
    setCsvOut(result.csv);
    setStats({
      columnCount: result.columnCount,
      rowCount: result.rowCount,
    });
  }, [input, delimiter]);

  function loadSample() {
    setInput(SAMPLE);
    setError(null);
    setCsvOut(null);
    setStats(null);
    setCopied(false);
  }

  async function copyCsv() {
    if (!csvOut) return;
    const payload = utf8Bom ? `\uFEFF${csvOut}` : csvOut;
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy to clipboard—try Download instead.");
    }
  }

  function downloadCsv() {
    if (!csvOut) return;
    const body = utf8Bom ? `\uFEFF${csvOut}` : csvOut;
    downloadText("export.csv", body, "text/csv;charset=utf-8");
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Paste JSON array
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Objects become rows; keys become columns. Wrapper objects with{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-xs dark:bg-zinc-900">
              data
            </code>
            /
            <code className="rounded bg-zinc-100 px-1 font-mono text-xs dark:bg-zinc-900">
              items
            </code>
            / similar arrays are detected automatically.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSample}
          className="shrink-0 self-start rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          Load sample
        </button>
      </div>

      <label htmlFor={idJson} className="sr-only">
        JSON input
      </label>
      <textarea
        id={idJson}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        spellCheck={false}
        placeholder='[ { "id": 1, "name": "Ada" }, { "id": 2, "name": "Bob" } ]'
        rows={12}
        className="mt-4 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
      />

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label
              htmlFor={idDelim}
              className="block text-sm font-medium text-foreground"
            >
              Delimiter
            </label>
            <select
              id={idDelim}
              value={delimiter}
              onChange={(e) =>
                setDelimiter(e.target.value as JsonToCsvDelimiter)
              }
              className="mt-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
            </select>
          </div>
          <label className="flex cursor-pointer items-center gap-2 pt-6 text-sm text-foreground lg:pt-0">
            <input
              id={idBom}
              type="checkbox"
              checked={utf8Bom}
              onChange={(e) => setUtf8Bom(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900"
            />
            UTF-8 BOM for Excel
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={convert}
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Convert to CSV
          </button>
          <button
            type="button"
            disabled={!csvOut}
            onClick={copyCsv}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            {copied ? "Copied" : "Copy CSV"}
          </button>
          <button
            type="button"
            disabled={!csvOut}
            onClick={downloadCsv}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Download .csv
          </button>
        </div>
      </div>

      {error ? (
        <p
          className="mt-4 text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {stats ? (
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="font-medium text-foreground">{stats.rowCount}</span>{" "}
          rows ×{" "}
          <span className="font-medium text-foreground">
            {stats.columnCount}
          </span>{" "}
          columns
        </p>
      ) : null}

      {csvOut ? (
        <section className="mt-6" aria-labelledby="csv-preview-heading">
          <h3
            id="csv-preview-heading"
            className="text-sm font-semibold text-foreground"
          >
            Preview (first lines)
          </h3>
          <pre className="mt-2 max-h-56 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs leading-relaxed text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            {previewLines.join("\n")}
            {csvOut.split(/\r?\n/).length > previewLines.length
              ? "\n…"
              : ""}
          </pre>
        </section>
      ) : null}
    </div>
  );
}
