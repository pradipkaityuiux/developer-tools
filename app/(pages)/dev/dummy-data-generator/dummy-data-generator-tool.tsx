"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  ALL_STANDARD_FIELDS,
  createBrowserRng,
  generateCustomRow,
  generateOneRow,
  mergeRows,
  parseColumnNamesFromUpload,
  rowsToCsv,
  type StandardField,
  STANDARD_FIELD_LABELS,
} from "@/lib/dummy-data-generator-core";

const MAX_ROWS = 500;
const MAX_CUSTOM_COLS = 40;

const DEFAULT_SELECTED: Record<StandardField, boolean> = {
  firstName: true,
  lastName: true,
  email: true,
  phone: false,
  company: false,
  jobTitle: false,
  street: true,
  city: true,
  state: true,
  zipCode: true,
  country: true,
};

function parseCustomColumns(text: string): string[] {
  const cols = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  return cols.slice(0, MAX_CUSTOM_COLS);
}

export function DummyDataGeneratorTool() {
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rowCount, setRowCount] = useState(10);
  const [selected, setSelected] = useState<Record<StandardField, boolean>>(
    () => ({ ...DEFAULT_SELECTED }),
  );
  const [customColumnsText, setCustomColumnsText] = useState("");
  const [format, setFormat] = useState<"json" | "csv">("json");
  const [prettyJson, setPrettyJson] = useState(true);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [fileError, setFileError] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);

  const activeStandard = useMemo(
    () => ALL_STANDARD_FIELDS.filter((f) => selected[f]),
    [selected],
  );
  const customColumns = useMemo(
    () => parseCustomColumns(customColumnsText),
    [customColumnsText],
  );

  const rows = useMemo(() => {
    void shuffleKey;
    if (activeStandard.length === 0 && customColumns.length === 0) return [];
    const n = Math.min(
      MAX_ROWS,
      Math.max(1, Math.floor(Number.isFinite(rowCount) ? rowCount : 1)),
    );
    const rng = createBrowserRng();
    return Array.from({ length: n }, () => {
      const std =
        activeStandard.length > 0 ? generateOneRow(activeStandard, rng) : {};
      const cust =
        customColumns.length > 0
          ? generateCustomRow(customColumns, rng)
          : {};
      return mergeRows(std, cust);
    });
  }, [activeStandard, customColumns, rowCount, shuffleKey]);

  const outputText = useMemo(() => {
    if (rows.length === 0) return "";
    if (format === "csv") return rowsToCsv(rows);
    return prettyJson
      ? `${JSON.stringify(rows, null, 2)}\n`
      : JSON.stringify(rows);
  }, [rows, format, prettyJson]);

  const regenerate = useCallback(() => {
    setShuffleKey((k) => k + 1);
  }, []);

  const onUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      const cols = parseColumnNamesFromUpload(text);
      if (cols.length === 0) {
        setFileError("No column names found in the file.");
        return;
      }
      setCustomColumnsText(cols.join("\n"));
    };
    reader.onerror = () => setFileError("Could not read the file.");
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const copyOutput = useCallback(async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText.trimEnd());
      setCopyDone(true);
      window.setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setFileError(
        "Clipboard not available—select the output and copy manually.",
      );
      window.setTimeout(() => setFileError(null), 4000);
    }
  }, [outputText]);

  const download = useCallback(() => {
    if (!outputText) return;
    const ext = format === "json" ? "json" : "csv";
    const mime =
      format === "json" ? "application/json" : "text/csv;charset=utf-8";
    const blob = new Blob([outputText], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dummy-data.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [outputText, format]);

  const toggleField = (f: StandardField) => {
    setSelected((s) => ({ ...s, [f]: !s[f] }));
  };

  const hasColumns = activeStandard.length > 0 || customColumns.length > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label
                  htmlFor="dummy-row-count"
                  className="block text-sm font-medium text-foreground"
                >
                  Rows (1–{MAX_ROWS})
                </label>
                <input
                  id="dummy-row-count"
                  type="number"
                  min={1}
                  max={MAX_ROWS}
                  value={rowCount}
                  onChange={(e) =>
                    setRowCount(Number(e.target.value) || 1)
                  }
                  className="mt-1.5 w-32 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
                />
              </div>
              <div>
                <span className="block text-sm font-medium text-foreground">
                  Output format
                </span>
                <div
                  className="mt-1.5 flex flex-wrap gap-2"
                  role="group"
                  aria-label="Output format"
                >
                  {(
                    [
                      ["json", "JSON"],
                      ["csv", "CSV"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormat(value)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        format === value
                          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                          : "border-zinc-300 bg-white text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {format === "json" ? (
                <label className="flex cursor-pointer items-center gap-2 pb-0.5 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={prettyJson}
                    onChange={(e) => setPrettyJson(e.target.checked)}
                    className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
                  />
                  Pretty-print
                </label>
              ) : null}
            </div>

            <fieldset>
              <legend className="text-sm font-medium text-foreground">
                Standard fields
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_STANDARD_FIELDS.map((f) => (
                  <label
                    key={f}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-sm text-foreground dark:border-zinc-700"
                  >
                    <input
                      type="checkbox"
                      checked={selected[f]}
                      onChange={() => toggleField(f)}
                      className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
                    />
                    {STANDARD_FIELD_LABELS[f]}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="dummy-custom-cols"
                  className="text-sm font-medium text-foreground"
                >
                  Custom column names (one per line, max {MAX_CUSTOM_COLS})
                </label>
                <div className="flex flex-wrap gap-2">
                  <input
                    ref={fileRef}
                    id={fileId}
                    type="file"
                    accept=".csv,.txt,text/csv,text/plain"
                    className="sr-only"
                    onChange={onUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  >
                    <Upload className="size-4 shrink-0" aria-hidden />
                    Upload columns
                  </button>
                </div>
              </div>
              <textarea
                id="dummy-custom-cols"
                value={customColumnsText}
                onChange={(e) => {
                  setCustomColumnsText(e.target.value);
                  setFileError(null);
                }}
                spellCheck={false}
                rows={4}
                placeholder={
                  "Optional — e.g.\ncustomer_id\nnotes\nsignup_url"
                }
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={regenerate}
                disabled={!hasColumns}
                className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Regenerate data
              </button>
              <button
                type="button"
                onClick={() => setSelected({ ...DEFAULT_SELECTED })}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                Reset field presets
              </button>
            </div>
          </div>
        </div>

        {fileError ? (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
            {fileError}
          </p>
        ) : null}

        {!hasColumns ? (
          <p
            className="mt-4 text-sm text-amber-800 dark:text-amber-300"
            role="status"
          >
            Select at least one standard field or add custom column names to
            generate output.
          </p>
        ) : null}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-medium text-foreground">Output</h2>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {hasColumns
                ? `${rows.length} row${rows.length === 1 ? "" : "s"} · ${format.toUpperCase()}`
                : "Waiting for column selection"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={download}
              disabled={!outputText}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Download
            </button>
          </div>
        </div>

        <div className="relative mt-3">
          <textarea
            readOnly
            value={outputText}
            rows={16}
            spellCheck={false}
            aria-label="Generated dummy data"
            placeholder={
              hasColumns
                ? "Click Regenerate data if the preview is empty."
                : "Select fields or custom columns to see JSON or CSV here."
            }
            className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none dark:border-zinc-800 dark:bg-zinc-900/50"
          />
          <button
            type="button"
            onClick={copyOutput}
            disabled={!outputText}
            title={copyDone ? "Copied" : "Copy output"}
            aria-label={copyDone ? "Copied to clipboard" : "Copy output"}
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

        <p className="mt-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Random values use{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
            crypto.getRandomValues
          </code>
          . Emails use safe test-style domains—not real inboxes. Regenerate
          whenever you need a fresh batch for a new test run.
        </p>
      </div>
    </div>
  );
}
