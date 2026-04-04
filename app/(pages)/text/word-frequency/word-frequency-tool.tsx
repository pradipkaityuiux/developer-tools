"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  computeWordFrequencies,
  formatFrequencyExport,
  totalCountedTokens,
  type WordFrequencyOptions,
} from "@/lib/word-frequency-core";

const SAMPLE = `SEO content should read naturally for readers first. Natural reading beats keyword stuffing. Good SEO rewards clear structure, useful answers, and natural language.

This sample repeats content and SEO so you can see ranked word frequency in the table. Upload your own draft to audit repetition before you publish.`;

const LIMIT_OPTIONS = [
  { label: "Top 25", value: 25 },
  { label: "Top 50", value: 50 },
  { label: "Top 100", value: 100 },
  { label: "Top 250", value: 250 },
  { label: "All words", value: 0 },
] as const;

export function WordFrequencyTool() {
  const inputId = useId();
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(SAMPLE);
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [minLength, setMinLength] = useState(2);
  const [omitStopWords, setOmitStopWords] = useState(false);
  const [rowLimit, setRowLimit] = useState<number>(50);
  const [fileError, setFileError] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);

  const options: WordFrequencyOptions = useMemo(
    () => ({
      ignoreCase,
      minLength: Math.max(1, Math.min(24, minLength)),
      omitStopWords,
    }),
    [ignoreCase, minLength, omitStopWords],
  );

  const allRows = useMemo(
    () => computeWordFrequencies(text, options),
    [text, options],
  );

  const totalTokens = useMemo(
    () => totalCountedTokens(allRows),
    [allRows],
  );

  const displayRows = useMemo(() => {
    if (rowLimit === 0) return allRows;
    return allRows.slice(0, rowLimit);
  }, [allRows, rowLimit]);

  const exportText = useMemo(
    () => formatFrequencyExport(allRows, totalTokens),
    [allRows, totalTokens],
  );

  async function copyTsv() {
    if (allRows.length === 0) return;
    try {
      await navigator.clipboard.writeText(exportText);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setFileError("Clipboard blocked. Select the preview table or copy manually.");
      setTimeout(() => setFileError(null), 4000);
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const body = typeof reader.result === "string" ? reader.result : "";
      setText(body);
    };
    reader.onerror = () => {
      setFileError("Could not read the file.");
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const uniqueWords = allRows.length;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <label
              htmlFor={inputId}
              className="block text-sm font-medium text-foreground"
            >
              Your text
            </label>
            <textarea
              id={inputId}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setFileError(null);
              }}
              spellCheck={true}
              rows={12}
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder="Paste an article, product description, meta block, or research notes."
            />
          </div>

          <fieldset className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
            <legend className="px-1 text-xs font-medium text-foreground">
              Analysis options
            </legend>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={ignoreCase}
                onChange={(e) => setIgnoreCase(e.target.checked)}
                className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900"
              />
              Ignore case (merge Word and word)
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={omitStopWords}
                onChange={(e) => setOmitStopWords(e.target.checked)}
                className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900"
              />
              Omit common English words (the, and, is, …)
            </label>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label
                  htmlFor="wf-min-len"
                  className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  Minimum length
                </label>
                <input
                  id="wf-min-len"
                  type="number"
                  min={1}
                  max={24}
                  value={minLength}
                  onChange={(e) =>
                    setMinLength(Number(e.target.value) || 1)
                  }
                  className="mt-1 w-20 rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm tabular-nums text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
                />
              </div>
              <div className="min-w-[10rem] flex-1">
                <label
                  htmlFor="wf-row-limit"
                  className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  Table rows
                </label>
                <select
                  id="wf-row-limit"
                  value={rowLimit}
                  onChange={(e) => setRowLimit(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
                >
                  {LIMIT_OPTIONS.map((o) => (
                    <option key={o.label} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              id={fileId}
              type="file"
              accept=".txt,.md,.markdown,text/plain"
              className="sr-only"
              onChange={onFile}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <Upload className="size-4 shrink-0" aria-hidden />
              Upload file
            </button>
            <button
              type="button"
              onClick={copyTsv}
              disabled={allRows.length === 0}
              title={copyDone ? "Copied" : "Copy full TSV (all words)"}
              aria-label={copyDone ? "Copied TSV" : "Copy full TSV"}
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
              Copy TSV
            </button>
            <button
              type="button"
              onClick={() => setText("")}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setText(SAMPLE)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Load sample
            </button>
          </div>

          {fileError ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {fileError}
            </p>
          ) : null}
        </div>

        <div className="w-full shrink-0 space-y-3 lg:w-80">
          <div
            className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/40"
            aria-live="polite"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Summary
            </p>
            <dl className="mt-2 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-400">
                  Tokens analyzed
                </dt>
                <dd className="font-semibold tabular-nums text-foreground">
                  {totalTokens.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-400">
                  Unique words
                </dt>
                <dd className="font-semibold tabular-nums text-foreground">
                  {uniqueWords.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-400">
                  Rows shown
                </dt>
                <dd className="font-semibold tabular-nums text-foreground">
                  {displayRows.length.toLocaleString()}
                  {rowLimit > 0 && allRows.length > rowLimit
                    ? ` of ${allRows.length.toLocaleString()}`
                    : null}
                </dd>
              </div>
            </dl>
          </div>

          <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="max-h-[min(24rem,50vh)] overflow-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="sticky top-0 z-10 bg-zinc-100 dark:bg-zinc-900">
                  <tr>
                    <th className="border-b border-zinc-200 px-2 py-2 font-medium text-foreground dark:border-zinc-800">
                      #
                    </th>
                    <th className="border-b border-zinc-200 px-2 py-2 font-medium text-foreground dark:border-zinc-800">
                      Word
                    </th>
                    <th className="border-b border-zinc-200 px-2 py-2 text-right font-medium text-foreground dark:border-zinc-800">
                      Count
                    </th>
                    <th className="border-b border-zinc-200 px-2 py-2 text-right font-medium text-foreground dark:border-zinc-800">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-6 text-center text-zinc-500 dark:text-zinc-400"
                      >
                        Add text to see ranked frequencies.
                      </td>
                    </tr>
                  ) : (
                    displayRows.map((row, i) => {
                      const pct =
                        totalTokens > 0
                          ? (row.count / totalTokens) * 100
                          : 0;
                      return (
                        <tr
                          key={row.word}
                          className="border-b border-zinc-100 dark:border-zinc-800/80"
                        >
                          <td className="px-2 py-1.5 tabular-nums text-zinc-500 dark:text-zinc-400">
                            {i + 1}
                          </td>
                          <td className="max-w-[9rem] truncate px-2 py-1.5 font-medium text-foreground">
                            {row.word}
                          </td>
                          <td className="px-2 py-1.5 text-right tabular-nums text-foreground">
                            {row.count.toLocaleString()}
                          </td>
                          <td className="px-2 py-1.5 text-right tabular-nums text-zinc-600 dark:text-zinc-400">
                            {pct.toFixed(1)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        Analysis runs in your browser. Token rules are simple heuristics—not a
        substitute for linguistic tooling or search-engine diagnostics.
      </p>
    </div>
  );
}
