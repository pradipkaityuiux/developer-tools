"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  computeReadability,
  formatReadabilitySummary,
} from "@/lib/readability-core";

const SAMPLE = `Clear web copy helps readers and search snippets alike.

Short sentences and familiar words usually score higher on readability tests. That does not mean you must sound casual in every paragraph. It means you choose one idea per sentence when possible, define jargon on first use, and break dense blocks with headings or lists.

This sample mixes sentence lengths on purpose. After you paste your own article, compare the Flesch Reading Ease number and grade level to your editorial brief.`;

export function ReadabilityCheckerTool() {
  const inputId = useId();
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(SAMPLE);
  const [fileError, setFileError] = useState<string | null>(null);
  const [copySummaryDone, setCopySummaryDone] = useState(false);

  const metrics = useMemo(() => computeReadability(text), [text]);
  const summary = useMemo(
    () => formatReadabilitySummary(metrics),
    [metrics],
  );

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopySummaryDone(true);
      setTimeout(() => setCopySummaryDone(false), 2000);
    } catch {
      setFileError("Clipboard blocked. Copy from the summary panel below.");
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

  const freDisplay =
    metrics.fleschReadingEase !== null
      ? metrics.fleschReadingEase.toFixed(1)
      : "—";
  const fkDisplay =
    metrics.fleschKincaidGrade !== null
      ? metrics.fleschKincaidGrade.toFixed(1)
      : "—";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-3">
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
              rows={14}
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder="Paste a blog post, product description, help article, or email draft."
            />
          </div>

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
              onClick={copySummary}
              disabled={metrics.words === 0}
              title={copySummaryDone ? "Copied" : "Copy analysis summary"}
              aria-label={
                copySummaryDone ? "Copied summary" : "Copy analysis summary"
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              {copySummaryDone ? (
                <Check
                  className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                />
              ) : (
                <Copy className="size-4 shrink-0" aria-hidden />
              )}
              Copy summary
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

        <div className="w-full shrink-0 space-y-4 lg:w-80">
          <div
            className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40"
            aria-live="polite"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Flesch-style scores
            </p>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-xs text-zinc-500 dark:text-zinc-400">
                  Flesch Reading Ease
                </dt>
                <dd className="text-2xl font-semibold tabular-nums text-foreground">
                  {freDisplay}
                </dd>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {metrics.words === 0
                    ? "Add text to compute."
                    : metrics.easeBand}
                </p>
              </div>
              <div>
                <dt className="text-xs text-zinc-500 dark:text-zinc-400">
                  Flesch–Kincaid grade level
                </dt>
                <dd className="text-2xl font-semibold tabular-nums text-foreground">
                  {fkDisplay}
                </dd>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {metrics.words === 0 ? "—" : metrics.gradeInterpretation}
                </p>
              </div>
              <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800">
                <dt className="text-xs text-zinc-500 dark:text-zinc-400">
                  Words / sentences (est.)
                </dt>
                <dd className="mt-1 text-sm font-medium tabular-nums text-foreground">
                  {metrics.words.toLocaleString()} /{" "}
                  {metrics.sentences.toLocaleString()}
                </dd>
                <dt className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                  Syllables (est.)
                </dt>
                <dd className="mt-1 text-sm font-medium tabular-nums text-foreground">
                  {metrics.syllables.toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <p className="text-xs font-medium text-foreground">
              Suggestions
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {metrics.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium text-foreground">
              Plain-text summary
            </p>
            <pre className="mt-1.5 max-h-48 overflow-auto rounded-lg border border-zinc-200 bg-white p-3 font-mono text-xs leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
              {metrics.words === 0 ? "Add text to generate a summary." : summary}
            </pre>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        Readability scores are educational estimates for English-like prose.
        Sentence boundaries follow simple punctuation rules; syllables use a
        heuristic, not a dictionary lookup.
      </p>
    </div>
  );
}
