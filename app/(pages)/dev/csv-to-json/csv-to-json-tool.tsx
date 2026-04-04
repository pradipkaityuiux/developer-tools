"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import {
  detectDelimiter,
  parseDelimitedText,
  rowsToJsonArrays,
  rowsToJsonObjects,
} from "@/lib/csv-parse";

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

export function CsvToJsonTool() {
  const inputId = useId();
  const fileId = useId();
  const [csvText, setCsvText] = useState(
    "name,age,active\nAda,42,true\nBob,7,false\n",
  );
  const [delimiter, setDelimiter] = useState<DelimiterOption>("auto");
  const [hasHeader, setHasHeader] = useState(true);
  const [typed, setTyped] = useState(true);
  const [asArrays, setAsArrays] = useState(false);
  const [pretty, setPretty] = useState(true);
  const [fileError, setFileError] = useState<string | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const effectiveDelimiter = useMemo(() => {
    if (delimiter !== "auto") return delimiter;
    return detectDelimiter(csvText);
  }, [delimiter, csvText]);

  const { jsonText, quoteWarning } = useMemo(() => {
    if (!csvText.trim()) {
      return { jsonText: "", quoteWarning: null as string | null };
    }

    const quoteWarning = quotesBalanced(csvText)
      ? null
      : "Warning: quotes may be unbalanced; verify fields match your source file.";

    const rows = parseDelimitedText(csvText, effectiveDelimiter);
    if (rows.length === 0) {
      return {
        jsonText: pretty ? "[]\n" : "[]",
        quoteWarning,
      };
    }

    let payload: unknown;
    if (asArrays) {
      payload = rowsToJsonArrays(rows, typed);
    } else {
      payload = rowsToJsonObjects(rows, hasHeader, typed);
    }

    const jsonText = pretty
      ? `${JSON.stringify(payload, null, 2)}\n`
      : JSON.stringify(payload);

    return { jsonText, quoteWarning };
  }, [csvText, effectiveDelimiter, hasHeader, typed, asArrays, pretty]);

  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const text =
        typeof reader.result === "string" ? reader.result : "";
      setCsvText(text);
    };
    reader.onerror = () => {
      setFileError("Could not read the file.");
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const copyJson = useCallback(async () => {
    if (!jsonText) return;
    setCopyHint(null);
    try {
      await navigator.clipboard.writeText(jsonText.trimEnd());
      setCopyHint("Copied to clipboard.");
      window.setTimeout(() => setCopyHint(null), 2000);
    } catch {
      setCopyHint("Clipboard not available—select the output and copy manually.");
    }
  }, [jsonText]);

  const downloadJson = useCallback(() => {
    if (!jsonText) return;
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [jsonText]);

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
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
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

          <div className="w-full shrink-0 space-y-3 lg:w-56">
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
                disabled={asArrays}
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
              Smart typing (numbers, booleans, null)
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={asArrays}
                onChange={(e) => {
                  setAsArrays(e.target.checked);
                  if (e.target.checked) setHasHeader(false);
                }}
                className="rounded border-zinc-400"
              />
              Array of arrays
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={pretty}
                onChange={(e) => setPretty(e.target.checked)}
                className="rounded border-zinc-400"
              />
              Pretty-print JSON
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
          <h2 className="text-sm font-medium text-foreground">JSON output</h2>
          <div className="flex flex-wrap items-center gap-2">
            {copyHint ? (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {copyHint}
              </span>
            ) : null}
            <button
              type="button"
              onClick={copyJson}
              disabled={!jsonText}
              className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Copy JSON
            </button>
            <button
              type="button"
              onClick={downloadJson}
              disabled={!jsonText}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Download .json
            </button>
          </div>
        </div>
        <textarea
          readOnly
          value={jsonText}
          rows={14}
          className="mt-3 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-sm text-foreground dark:border-zinc-800 dark:bg-zinc-900/50"
          placeholder="Parsed JSON appears here…"
        />
      </div>
    </div>
  );
}
