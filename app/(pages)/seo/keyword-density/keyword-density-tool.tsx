"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  analyzeKeywordDensity,
  formatKeywordDensityReport,
  type PhraseMatchResult,
} from "@/lib/keyword-density-core";

const SAMPLE = `Keyword density analysis helps you balance on-page SEO without awkward repetition. This paragraph mentions keyword density again so you can measure how often a phrase appears.

Prominence matters: when it fits naturally, place your primary keyword near the beginning of the body copy. Good pages answer the reader first and use target phrases where they read naturally.

Secondary ideas—related terms and semantic coverage—often matter more than repeating one exact string dozens of times.`;

export function KeywordDensityTool() {
  const bodyId = useId();
  const primaryId = useId();
  const extraId = useId();
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(SAMPLE);
  const [primaryPhrase, setPrimaryPhrase] = useState("keyword density");
  const [extraPhrases, setExtraPhrases] = useState(
    "on-page SEO, prominence, semantic coverage",
  );
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [fileError, setFileError] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);

  const rawPhrases = useMemo(() => {
    const parts: string[] = [];
    if (primaryPhrase.trim()) parts.push(primaryPhrase.trim());
    for (const seg of extraPhrases.split(",")) {
      const t = seg.trim();
      if (t) parts.push(t);
    }
    return parts;
  }, [primaryPhrase, extraPhrases]);

  const { totalWords, results } = useMemo(
    () =>
      analyzeKeywordDensity(text, rawPhrases, {
        ignoreCase,
      }),
    [text, rawPhrases, ignoreCase],
  );

  const reportText = useMemo(
    () => formatKeywordDensityReport(totalWords, results),
    [totalWords, results],
  );

  async function copyReport() {
    if (totalWords === 0 && results.length === 0) return;
    try {
      await navigator.clipboard.writeText(reportText);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setFileError("Clipboard blocked. Copy the table manually.");
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

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <label
              htmlFor={bodyId}
              className="block text-sm font-medium text-foreground"
            >
              Page or article body
            </label>
            <textarea
              id={bodyId}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setFileError(null);
              }}
              spellCheck={true}
              rows={12}
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder="Paste blog copy, product description, or landing page text."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor={primaryId}
                className="block text-sm font-medium text-foreground"
              >
                Primary keyword phrase
              </label>
              <input
                id={primaryId}
                type="text"
                value={primaryPhrase}
                onChange={(e) => setPrimaryPhrase(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
                placeholder="e.g. best running shoes"
              />
            </div>
            <div>
              <label
                htmlFor={extraId}
                className="block text-sm font-medium text-foreground"
              >
                Additional phrases (comma-separated)
              </label>
              <input
                id={extraId}
                type="text"
                value={extraPhrases}
                onChange={(e) => setExtraPhrases(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
                placeholder="related term, another phrase"
              />
            </div>
          </div>

          <fieldset className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
            <legend className="px-1 text-xs font-medium text-foreground">
              Matching
            </legend>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={ignoreCase}
                onChange={(e) => setIgnoreCase(e.target.checked)}
                className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900"
              />
              Ignore case when matching tokens
            </label>
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
              onClick={copyReport}
              disabled={totalWords === 0}
              title={copyDone ? "Copied" : "Copy TSV report"}
              aria-label={copyDone ? "Copied report" : "Copy TSV report"}
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
              Copy report
            </button>
            <button
              type="button"
              onClick={() => setText("")}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Clear text
            </button>
            <button
              type="button"
              onClick={() => {
                setText(SAMPLE);
                setPrimaryPhrase("keyword density");
                setExtraPhrases(
                  "on-page SEO, prominence, semantic coverage",
                );
              }}
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

        <div className="w-full shrink-0 space-y-3 lg:w-[28rem]">
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
                  Total words
                </dt>
                <dd className="font-semibold tabular-nums text-foreground">
                  {totalWords.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-zinc-500 dark:text-zinc-400">
                  Phrases tracked
                </dt>
                <dd className="font-semibold tabular-nums text-foreground">
                  {results.length.toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>

          <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="max-h-[min(28rem,55vh)] overflow-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="sticky top-0 z-10 bg-zinc-100 dark:bg-zinc-900">
                  <tr>
                    <th className="border-b border-zinc-200 px-2 py-2 font-medium text-foreground dark:border-zinc-800">
                      Phrase
                    </th>
                    <th className="border-b border-zinc-200 px-2 py-2 text-right font-medium text-foreground dark:border-zinc-800">
                      #
                    </th>
                    <th className="border-b border-zinc-200 px-2 py-2 text-right font-medium text-foreground dark:border-zinc-800">
                      Density
                    </th>
                    <th className="border-b border-zinc-200 px-2 py-2 text-right font-medium text-foreground dark:border-zinc-800">
                      First
                    </th>
                    <th className="border-b border-zinc-200 px-2 py-2 text-center font-medium text-foreground dark:border-zinc-800">
                      ≤100w
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-6 text-center text-zinc-500 dark:text-zinc-400"
                      >
                        {totalWords === 0
                          ? "Add body text to analyze."
                          : "Enter at least one keyword phrase."}
                      </td>
                    </tr>
                  ) : (
                    results.map((row: PhraseMatchResult) => (
                      <tr
                        key={row.phrase}
                        className="border-b border-zinc-100 dark:border-zinc-800/80"
                      >
                        <td className="max-w-[10rem] px-2 py-1.5 align-top font-medium text-foreground">
                          <span className="break-words">{row.phrase}</span>
                        </td>
                        <td className="px-2 py-1.5 text-right tabular-nums text-foreground">
                          {row.occurrences.toLocaleString()}
                        </td>
                        <td className="px-2 py-1.5 text-right tabular-nums text-zinc-700 dark:text-zinc-300">
                          {row.densityPercent.toFixed(2)}%
                        </td>
                        <td className="px-2 py-1.5 text-right tabular-nums text-zinc-600 dark:text-zinc-400">
                          {row.firstOccurrenceWordIndex === null
                            ? "—"
                            : row.firstOccurrenceWordIndex.toLocaleString()}
                        </td>
                        <td className="px-2 py-1.5 text-center text-zinc-700 dark:text-zinc-300">
                          {row.firstOccurrenceWordIndex === null
                            ? "—"
                            : row.inFirst100Words
                              ? "Yes"
                              : "No"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            Density = (occurrences × words in phrase) ÷ total words × 100.
            “First” is the word position of the first token in the first match.
            “≤100w” means that first match starts within the first 100 words.
          </p>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        Analysis runs in your browser. Token rules are simple heuristics—not a
        search-engine ranking model or NLP parser.
      </p>
    </div>
  );
}
