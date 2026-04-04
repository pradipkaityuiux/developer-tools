"use client";

import { useCallback, useId, useMemo, useState, type ChangeEvent } from "react";
import { Check, Copy, Download, Upload } from "lucide-react";
import { detectDelimiter, parseDelimitedText } from "@/lib/csv-parse";
import {
  csvTextToInsertSql,
  type InsertFormat,
  type SqlDialect,
} from "@/lib/csv-to-sql-core";

type DelimiterOption = "auto" | "," | ";" | "\t" | "|";

const delimiterLabels: Record<Exclude<DelimiterOption, "auto">, string> = {
  ",": "Comma",
  ";": "Semicolon",
  "\t": "Tab",
  "|": "Pipe",
};

const dialectLabels: Record<SqlDialect, string> = {
  ansi: "ANSI / PostgreSQL / SQLite",
  mysql: "MySQL",
  sqlserver: "SQL Server",
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

export function CsvToSqlTool() {
  const inputId = useId();
  const fileId = useId();
  const tableId = useId();
  const [csvText, setCsvText] = useState(
    "id,name,score\n1,Ada,100\n2,Bob,\n3,Carlos,false\n",
  );
  const [delimiter, setDelimiter] = useState<DelimiterOption>("auto");
  const [hasHeader, setHasHeader] = useState(true);
  const [typed, setTyped] = useState(true);
  const [tableName, setTableName] = useState("imported_rows");
  const [dialect, setDialect] = useState<SqlDialect>("ansi");
  const [insertFormat, setInsertFormat] = useState<InsertFormat>("batched");
  const [batchSize, setBatchSize] = useState(250);
  const [trailingSemicolons, setTrailingSemicolons] = useState(true);
  const [fileError, setFileError] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);

  const effectiveDelimiter = useMemo(() => {
    if (delimiter !== "auto") return delimiter;
    return detectDelimiter(csvText);
  }, [delimiter, csvText]);

  const { sqlText, quoteWarning } = useMemo(() => {
    const quoteWarning =
      csvText.trim() && !quotesBalanced(csvText)
        ? "Warning: quotes may be unbalanced; verify fields match your source file."
        : null;

    const sqlText = csvTextToInsertSql(
      csvText,
      effectiveDelimiter,
      hasHeader,
      typed,
      {
        tableName,
        dialect,
        format: insertFormat,
        batchSize,
        trailingSemicolons,
      },
    );

    return { sqlText, quoteWarning };
  }, [
    csvText,
    effectiveDelimiter,
    hasHeader,
    typed,
    tableName,
    dialect,
    insertFormat,
    batchSize,
    trailingSemicolons,
  ]);

  const rowStats = useMemo(() => {
    const rows = parseDelimitedText(csvText, effectiveDelimiter);
    if (rows.length === 0) return { dataRows: 0, cols: 0 };
    if (hasHeader) {
      return {
        dataRows: Math.max(0, rows.length - 1),
        cols: rows[0]?.length ?? 0,
      };
    }
    return { dataRows: rows.length, cols: rows[0]?.length ?? 0 };
  }, [csvText, effectiveDelimiter, hasHeader]);

  const onFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
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
    reader.readAsText(file, "UTF-8");
    e.target.value = "";
  }, []);

  const copySql = useCallback(async () => {
    if (!sqlText) return;
    setCopyDone(false);
    try {
      await navigator.clipboard.writeText(sqlText.trimEnd());
      setCopyDone(true);
      window.setTimeout(() => setCopyDone(false), 2000);
    } catch {
      /* user can select output manually */
    }
  }, [sqlText]);

  const downloadSql = useCallback(() => {
    if (!sqlText) return;
    const blob = new Blob([sqlText], { type: "application/sql;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "insert-from-csv.sql";
    a.click();
    URL.revokeObjectURL(url);
  }, [sqlText]);

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
                placeholder="Paste CSV here or upload a file…"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800">
                <Upload className="size-4 shrink-0" aria-hidden />
                <span>Upload file</span>
                <input
                  type="file"
                  accept=".csv,.tsv,.txt,text/csv,text/plain"
                  className="sr-only"
                  onChange={onFile}
                />
              </label>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Delimiter:{" "}
                <span className="font-medium text-foreground">
                  {delimiter === "auto"
                    ? `Auto (${delimiterLabels[effectiveDelimiter as Exclude<DelimiterOption, "auto">]})`
                    : delimiterLabels[delimiter as Exclude<DelimiterOption, "auto">]}
                </span>
                {" · "}
                <span className="font-medium text-foreground">
                  {rowStats.dataRows} data row(s), {rowStats.cols} column(s)
                </span>
              </span>
            </div>
          </div>

          <div className="w-full shrink-0 space-y-3 lg:w-64">
            <div>
              <label
                htmlFor={tableId}
                className="block text-sm font-medium text-foreground"
              >
                Table name
              </label>
              <input
                id={tableId}
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                spellCheck={false}
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
                placeholder="e.g. users"
              />
            </div>

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

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-foreground">
                Identifier quoting
              </legend>
              <select
                value={dialect}
                onChange={(e) => setDialect(e.target.value as SqlDialect)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
              >
                {(Object.keys(dialectLabels) as SqlDialect[]).map((d) => (
                  <option key={d} value={d}>
                    {dialectLabels[d]}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-foreground">
                INSERT style
              </legend>
              <select
                value={insertFormat}
                onChange={(e) =>
                  setInsertFormat(e.target.value as InsertFormat)
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="batched">Batched VALUES</option>
                <option value="per-row">One INSERT per row</option>
              </select>
            </fieldset>

            {insertFormat === "batched" ? (
              <label className="block text-sm text-foreground">
                <span className="font-medium">Rows per statement</span>
                <input
                  type="number"
                  min={1}
                  max={5000}
                  value={batchSize}
                  onChange={(e) =>
                    setBatchSize(
                      Math.min(
                        5000,
                        Math.max(1, Number.parseInt(e.target.value, 10) || 1),
                      ),
                    )
                  }
                  className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
                />
              </label>
            ) : null}

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
                checked={typed}
                onChange={(e) => setTyped(e.target.checked)}
                className="rounded border-zinc-400"
              />
              Smart typing (NULL, numbers, booleans)
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={trailingSemicolons}
                onChange={(e) => setTrailingSemicolons(e.target.checked)}
                className="rounded border-zinc-400"
              />
              Trailing semicolons
            </label>
          </div>
        </div>

        {fileError ? (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
            {fileError}
          </p>
        ) : null}

        {quoteWarning ? (
          <p
            className="mt-4 text-sm text-amber-700 dark:text-amber-400"
            role="status"
          >
            {quoteWarning}
          </p>
        ) : null}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-medium text-foreground">SQL output</h2>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={copySql}
              disabled={!sqlText}
              title={copyDone ? "Copied" : "Copy SQL"}
              aria-label={copyDone ? "Copied to clipboard" : "Copy SQL"}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {copyDone ? (
                <Check
                  className="size-4 text-emerald-600 dark:text-emerald-700"
                  aria-hidden
                />
              ) : (
                <Copy className="size-4" aria-hidden />
              )}
              Copy SQL
            </button>
            <button
              type="button"
              onClick={downloadSql}
              disabled={!sqlText}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <Download className="size-4 shrink-0" aria-hidden />
              Download .sql
            </button>
          </div>
        </div>
        <div className="relative mt-3">
          <textarea
            readOnly
            value={sqlText}
            rows={16}
            spellCheck={false}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-sm text-foreground dark:border-zinc-800 dark:bg-zinc-900/50"
            placeholder="INSERT statements appear here…"
          />
          <button
            type="button"
            onClick={copySql}
            disabled={!sqlText}
            title={copyDone ? "Copied" : "Copy SQL"}
            aria-label={copyDone ? "Copied to clipboard" : "Copy SQL"}
            className="absolute right-2 top-2 inline-flex items-center justify-center rounded-md border border-zinc-200 bg-zinc-50/95 p-1.5 text-foreground backdrop-blur-sm transition-colors hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-950/95 dark:hover:bg-zinc-900"
          >
            {copyDone ? (
              <Check
                className="size-[1.125rem] text-emerald-600 dark:text-emerald-400"
                aria-hidden
              />
            ) : (
              <Copy className="size-[1.125rem]" aria-hidden />
            )}
          </button>
        </div>
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          Review before running on production. Create the destination table (or
          align column types) before executing generated INSERTs.
        </p>
      </div>
    </div>
  );
}
