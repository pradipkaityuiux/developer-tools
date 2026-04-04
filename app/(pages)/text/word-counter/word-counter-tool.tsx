"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  computeTextStats,
  formatStatsSummary,
} from "@/lib/word-counter-core";

const SAMPLE = `Online word counter for writers and developers

Paste an article, email, or UI string to see words, characters, sentences, paragraphs, and reading time. Upload a .txt or .markdown file to analyze drafts without leaving the browser.

Does it handle code? Mostly yes: counts reflect whitespace-separated tokens, so minified JSON looks like one long word unless you format it first.`;

const WPM_OPTIONS = [180, 200, 225, 238, 250, 300] as const;

export function WordCounterTool() {
  const inputId = useId();
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(SAMPLE);
  const [wpm, setWpm] = useState<number>(200);
  const [fileError, setFileError] = useState<string | null>(null);
  const [copyTextDone, setCopyTextDone] = useState(false);
  const [copyStatsDone, setCopyStatsDone] = useState(false);

  const stats = useMemo(() => computeTextStats(text, wpm), [text, wpm]);
  const statsBlock = useMemo(
    () => formatStatsSummary(stats, wpm),
    [stats, wpm],
  );

  async function copyBody() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopyTextDone(true);
      setTimeout(() => setCopyTextDone(false), 2000);
    } catch {
      setFileError("Clipboard blocked. Select the text and copy manually.");
      setTimeout(() => setFileError(null), 4000);
    }
  }

  async function copyStats() {
    try {
      await navigator.clipboard.writeText(statsBlock);
      setCopyStatsDone(true);
      setTimeout(() => setCopyStatsDone(false), 2000);
    } catch {
      setFileError("Clipboard blocked. Copy the summary from the panel.");
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

  const statCards: { label: string; value: string; detail?: string }[] = [
    { label: "Words", value: stats.words.toLocaleString() },
    {
      label: "Characters",
      value: stats.characters.toLocaleString(),
      detail: `${stats.charactersNoSpaces.toLocaleString()} without spaces`,
    },
    { label: "Sentences (est.)", value: stats.sentences.toLocaleString() },
    { label: "Paragraphs", value: stats.paragraphs.toLocaleString() },
    {
      label: "Lines",
      value: stats.lines.toLocaleString(),
      detail: `${stats.nonEmptyLines.toLocaleString()} non-empty`,
    },
    {
      label: "Reading time",
      value: stats.words === 0 ? "—" : `${stats.readingMinutes} min`,
      detail: stats.words === 0 ? "Add text to estimate" : `@ ${wpm} WPM`,
    },
  ];

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
              placeholder="Paste copy for a landing page, essay, README section, or social post."
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
              onClick={copyBody}
              disabled={!text}
              title={copyTextDone ? "Copied" : "Copy full text"}
              aria-label={copyTextDone ? "Copied text" : "Copy full text"}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              {copyTextDone ? (
                <Check
                  className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                />
              ) : (
                <Copy className="size-4 shrink-0" aria-hidden />
              )}
              Copy text
            </button>
            <button
              type="button"
              onClick={copyStats}
              title={copyStatsDone ? "Copied" : "Copy count summary"}
              aria-label={
                copyStatsDone ? "Copied summary" : "Copy count summary"
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              {copyStatsDone ? (
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

        <div className="w-full shrink-0 space-y-4 lg:w-72">
          <div>
            <label
              htmlFor="word-counter-wpm"
              className="block text-sm font-medium text-foreground"
            >
              Reading speed (WPM)
            </label>
            <select
              id="word-counter-wpm"
              value={wpm}
              onChange={(e) => setWpm(Number(e.target.value))}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
            >
              {WPM_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} WPM
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Adjust to match blog guidelines (often 200 to 250) or skimming
              speed for UI microcopy reviews.
            </p>
          </div>

          <div
            className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/40"
            aria-live="polite"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Live counts
            </p>
            <dl className="mt-3 space-y-3">
              {statCards.map((row) => (
                <div key={row.label}>
                  <dt className="text-xs text-zinc-500 dark:text-zinc-400">
                    {row.label}
                  </dt>
                  <dd className="text-lg font-semibold tabular-nums text-foreground">
                    {row.value}
                    {row.detail ? (
                      <span className="mt-0.5 block text-xs font-normal text-zinc-500 dark:text-zinc-400">
                        {row.detail}
                      </span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <p className="text-xs font-medium text-foreground">
              Plain-text summary
            </p>
            <pre className="mt-1.5 max-h-40 overflow-auto rounded-lg border border-zinc-200 bg-white p-3 font-mono text-xs leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
              {statsBlock}
            </pre>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        Counts run entirely in your browser. Sentence and paragraph totals are
        heuristics; verify legal or academic documents in your editor of record.
      </p>
    </div>
  );
}
