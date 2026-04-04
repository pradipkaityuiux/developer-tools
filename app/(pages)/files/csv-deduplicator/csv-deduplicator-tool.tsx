"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Copy, Upload } from "lucide-react";
import { detectDelimiter, parseDelimitedText } from "@/lib/csv-parse";

type DelimiterOption = "auto" | "," | ";" | "\t" | "|";

const delimiterLabels: Record<Exclude<DelimiterOption, "auto">, string> = {
  ",": "Comma",
  ";": "Semicolon",
  "\t": "Tab",
  "|": "Pipe",
};

function quotesBalanced(text: string): boolean {
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        i++;
        continue;
      }
      inQuotes = !inQuotes;
    }
  }
  return !inQuotes;
}

function escapeField(raw: string, delimiter: string): string {
  const needsQuote =
    raw.includes('"') ||
    raw.includes("\r") ||
    raw.includes("\n") ||
    raw.includes(delimiter);
  if (!needsQuote) return raw;
  return `"${raw.replace(/"/g, '""')}"`;
}

function rowsToDelimitedText(rows: string[][], delimiter: string): string {
  return rows
    .map((row) =>
      row.map((cell) => escapeField(cell ?? "", delimiter)).join(delimiter),
    )
    .join("\r\n");
}

function makeKey(
  row: string[],
  indices: number[],
  trim: boolean,
  width: number,
): string {
  const cells = Array.from({ length: width }, (_, i) => row[i] ?? "");
  if (indices.length === 0) {
    return cells.map((c) => (trim ? c.trim() : c)).join("\u0001");
  }
  return indices
    .map((i) => {
      const v = cells[i] ?? "";
      return trim ? v.trim() : v;
    })
    .join("\u0001");
}

function dedupeDataRows(
  dataRows: string[][],
  indices: number[],
  trim: boolean,
  width: number,
  keep: "first" | "last",
): string[][] {
  if (keep === "first") {
    const seen = new Set<string>();
    const out: string[][] = [];
    for (const row of dataRows) {
      const k = makeKey(row, indices, trim, width);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(row);
    }
    return out;
  }
  const rev = [...dataRows].reverse();
  const seen = new Set<string>();
  const out: string[][] = [];
  for (const row of rev) {
    const k = makeKey(row, indices, trim, width);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(row);
  }
  return out.reverse();
}

function padRow(row: string[], width: number): string[] {
  const next = row.slice(0, width);
  while (next.length < width) next.push("");
  return next;
}

const SAMPLE = `email,name,source
alice@example.com,Alice,webform
bob@example.com,Bob,import
alice@example.com,Alice Smith,crm
carol@example.com,Carol,webform
`;

export function CsvDeduplicatorTool() {
  const inputId = useId();
  const fileId = useId();
  const keepGroupId = useId();
  const prevWidthRef = useRef(0);
  const [csvText, setCsvText] = useState(SAMPLE);
  const [delimiter, setDelimiter] = useState<DelimiterOption>("auto");
  const [hasHeader, setHasHeader] = useState(true);
  const [trimCompare, setTrimCompare] = useState(true);
  const [keep, setKeep] = useState<"first" | "last">("first");
  const [selectedCols, setSelectedCols] = useState<Set<number>>(() => {
    const s = new Set<number>();
    for (let i = 0; i < 3; i++) s.add(i);
    return s;
  });
  const [fileError, setFileError] = useState<string | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const effectiveDelimiter = useMemo(() => {
    if (delimiter !== "auto") return delimiter;
    return detectDelimiter(csvText);
  }, [delimiter, csvText]);

  const parsed = useMemo(() => {
    if (!csvText.trim()) {
      return { rows: [] as string[][], quoteWarning: null as string | null };
    }
    const quoteWarning = quotesBalanced(csvText)
      ? null
      : "Warning: quotes may be unbalanced; verify fields match your source file.";
    const rows = parseDelimitedText(csvText, effectiveDelimiter);
    return { rows, quoteWarning };
  }, [csvText, effectiveDelimiter]);

  const { rows } = parsed;

  const width = useMemo(() => {
    if (rows.length === 0) return 0;
    return Math.max(...rows.map((r) => r.length));
  }, [rows]);

  useEffect(() => {
    if (width === 0) {
      prevWidthRef.current = 0;
      return;
    }
    const prev = prevWidthRef.current;
    prevWidthRef.current = width;
    if (prev === 0) return;
    if (width > prev) {
      setSelectedCols((s) => {
        const next = new Set(s);
        for (let i = prev; i < width; i++) next.add(i);
        return next;
      });
    } else if (width < prev) {
      setSelectedCols((s) => new Set([...s].filter((i) => i < width)));
    }
  }, [width]);

  const columnLabels = useMemo(() => {
    const labels: string[] = [];
    const head = hasHeader && rows.length > 0 ? rows[0] : null;
    for (let c = 0; c < width; c++) {
      if (head) {
        const raw = head[c]?.trim() ?? "";
        labels.push(raw === "" ? `Column ${c + 1}` : raw);
      } else {
        labels.push(`Column ${c + 1}`);
      }
    }
    return labels;
  }, [rows, hasHeader, width]);

  const dataRows = useMemo(() => {
    if (rows.length === 0) return [];
    if (hasHeader && rows.length <= 1) return [];
    return hasHeader ? rows.slice(1) : rows;
  }, [rows, hasHeader]);

  const selectedIndices = useMemo(() => {
    const sorted = [...selectedCols].filter((i) => i >= 0 && i < width).sort((a, b) => a - b);
    return sorted;
  }, [selectedCols, width]);

  const deduped = useMemo(() => {
    if (width === 0) return { outRows: [] as string[][], removed: 0 };
    const paddedData = dataRows.map((r) => padRow(r, width));
    const indices = selectedIndices;
    const unique = dedupeDataRows(paddedData, indices, trimCompare, width, keep);
    const removed = paddedData.length - unique.length;
    const headerRow = hasHeader && rows.length > 0 ? padRow(rows[0]!, width) : null;
    const outRows =
      headerRow !== null ? [headerRow, ...unique] : unique;
    return { outRows, removed };
  }, [
    dataRows,
    width,
    selectedIndices,
    trimCompare,
    keep,
    hasHeader,
    rows,
  ]);

  const outputText = useMemo(() => {
    if (deduped.outRows.length === 0) return "";
    return rowsToDelimitedText(deduped.outRows, effectiveDelimiter);
  }, [deduped.outRows, effectiveDelimiter]);

  const stats = useMemo(() => {
    const inCount = dataRows.length;
    const outCount =
      deduped.outRows.length - (hasHeader && deduped.outRows.length > 0 ? 1 : 0);
    return {
      inCount,
      outCount,
      removed: deduped.removed,
    };
  }, [dataRows.length, deduped, hasHeader]);

  const toggleCol = useCallback((idx: number) => {
    setSelectedCols((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }, []);

  const selectAllCols = useCallback(() => {
    setSelectedCols(new Set(Array.from({ length: width }, (_, i) => i)));
  }, [width]);

  const clearCols = useCallback(() => {
    setSelectedCols(new Set());
  }, []);

  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setCsvText(text);
    };
    reader.onerror = () => {
      setFileError("Could not read the file.");
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const copyOut = useCallback(async () => {
    if (!outputText) return;
    setCopyHint(null);
    try {
      await navigator.clipboard.writeText(outputText.replace(/\r\n$/, ""));
      setCopyHint("Copied to clipboard.");
      window.setTimeout(() => setCopyHint(null), 2000);
    } catch {
      setCopyHint("Clipboard not available—select the output and copy manually.");
    }
  }, [outputText]);

  const downloadCsv = useCallback(() => {
    if (!outputText) return;
    const blob = new Blob([outputText.endsWith("\r\n") ? outputText : `${outputText}\r\n`], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "deduplicated.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [outputText]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <label
                htmlFor={inputId}
                className="block text-sm font-medium text-foreground"
              >
                CSV input
              </label>
              <textarea
                id={inputId}
                value={csvText}
                onChange={(e) => {
                  setCsvText(e.target.value);
                  setFileError(null);
                }}
                spellCheck={false}
                rows={12}
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
                placeholder="Paste CSV or upload a file…"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileRef}
                id={fileId}
                type="file"
                accept=".csv,.tsv,.txt,text/csv,text/plain"
                className="sr-only"
                onChange={onFile}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Upload className="h-4 w-4 shrink-0" aria-hidden />
                Upload file
              </button>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Delimiter:{" "}
                <span className="font-medium text-foreground">
                  {delimiter === "auto"
                    ? `Auto (${delimiterLabels[effectiveDelimiter as Exclude<DelimiterOption, "auto">]})`
                    : delimiterLabels[delimiter as Exclude<DelimiterOption, "auto">]}
                </span>
              </span>
            </div>
          </div>

          <div className="w-full shrink-0 space-y-3 lg:w-64">
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-foreground">
                Delimiter
              </legend>
              <select
                value={delimiter}
                onChange={(e) =>
                  setDelimiter(e.target.value as DelimiterOption)
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="auto">Auto-detect</option>
                <option value=",">Comma</option>
                <option value=";">Semicolon</option>
                <option value="\t">Tab</option>
                <option value="|">Pipe</option>
              </select>
            </fieldset>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={hasHeader}
                onChange={(e) => setHasHeader(e.target.checked)}
                className="rounded border-zinc-400"
              />
              First row is header
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={trimCompare}
                onChange={(e) => setTrimCompare(e.target.checked)}
                className="rounded border-zinc-400"
              />
              Trim values when comparing
            </label>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-foreground">
                On duplicate rows
              </legend>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                <input
                  type="radio"
                  name={keepGroupId}
                  checked={keep === "first"}
                  onChange={() => setKeep("first")}
                  className="border-zinc-400"
                />
                Keep first
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                <input
                  type="radio"
                  name={keepGroupId}
                  checked={keep === "last"}
                  onChange={() => setKeep("last")}
                  className="border-zinc-400"
                />
                Keep last
              </label>
            </fieldset>
          </div>
        </div>

        {fileError ? (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
            {fileError}
          </p>
        ) : null}

        {parsed.quoteWarning ? (
          <p
            className="mt-4 text-sm text-amber-700 dark:text-amber-400"
            role="status"
          >
            {parsed.quoteWarning}
          </p>
        ) : null}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <h2 className="text-sm font-medium text-foreground">
          Columns used for duplicate detection
        </h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Rows match if every selected column matches. With none selected, the
          entire row must match to count as a duplicate.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={selectAllCols}
            disabled={width === 0}
            className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-foreground hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Select all
          </button>
          <button
            type="button"
            onClick={clearCols}
            disabled={width === 0}
            className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-foreground hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Clear
          </button>
        </div>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {columnLabels.map((label, idx) => (
            <li key={idx}>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-foreground hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900/80">
                <input
                  type="checkbox"
                  checked={selectedCols.has(idx)}
                  onChange={() => toggleCol(idx)}
                  className="rounded border-zinc-400"
                />
                <span className="truncate" title={label}>
                  {label}
                </span>
              </label>
            </li>
          ))}
        </ul>
        {width === 0 ? (
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Paste or upload CSV to list columns.
          </p>
        ) : null}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-medium text-foreground">Deduplicated CSV</h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Data rows: {stats.inCount} in → {stats.outCount} out
              {stats.removed > 0 ? ` (${stats.removed} duplicates removed)` : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {copyHint ? (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {copyHint}
              </span>
            ) : null}
            <button
              type="button"
              onClick={copyOut}
              disabled={!outputText}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Copy className="h-4 w-4 shrink-0" aria-hidden />
              Copy CSV
            </button>
            <button
              type="button"
              onClick={downloadCsv}
              disabled={!outputText}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Download .csv
            </button>
          </div>
        </div>
        <textarea
          readOnly
          value={outputText}
          rows={14}
          className="mt-3 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-sm text-foreground dark:border-zinc-800 dark:bg-zinc-900/50"
          placeholder="Deduplicated CSV appears here…"
        />
      </div>
    </div>
  );
}
