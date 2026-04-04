"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { Check, Copy, Upload } from "lucide-react";

const SAMPLE = `alpha@example.com
beta@example.com
gamma@example.com
beta@example.com
Alpha@example.com
delta@example.com
gamma@example.com`;

function splitLines(text: string): string[] {
  return text.split(/\r\n|\r|\n/);
}

function dedupeLines(
  text: string,
  opts: {
    caseInsensitive: boolean;
    trimForCompare: boolean;
    trimOutput: boolean;
  },
): string {
  const raw = splitLines(text);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of raw) {
    const compareSource = opts.trimForCompare ? line.trim() : line;
    const key = opts.caseInsensitive
      ? compareSource.toLowerCase()
      : compareSource;
    if (seen.has(key)) continue;
    seen.add(key);
    const pushLine = opts.trimOutput ? line.trim() : line;
    out.push(pushLine);
  }
  return out.join("\n");
}

export function DuplicateLineRemoverTool() {
  const [input, setInput] = useState(SAMPLE);
  const [caseInsensitive, setCaseInsensitive] = useState(true);
  const [trimForCompare, setTrimForCompare] = useState(true);
  const [trimOutput, setTrimOutput] = useState(false);
  const [copyDone, setCopyDone] = useState(false);

  const output = useMemo(
    () =>
      dedupeLines(input, {
        caseInsensitive,
        trimForCompare,
        trimOutput,
      }),
    [input, caseInsensitive, trimForCompare, trimOutput],
  );

  const stats = useMemo(() => {
    const inLines = splitLines(input);
    const outLines = splitLines(output);
    const removed = Math.max(0, inLines.length - outLines.length);
    return { inCount: inLines.length, outCount: outLines.length, removed };
  }, [input, output]);

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopyDone(true);
      window.setTimeout(() => setCopyDone(false), 2000);
    } catch {
      /* user can select manually */
    }
  }

  function onUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") return;
      setInput(result);
    };
    reader.readAsText(file, "UTF-8");
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={caseInsensitive}
              onChange={(e) => setCaseInsensitive(e.target.checked)}
              className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            />
            Ignore case when matching
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={trimForCompare}
              onChange={(e) => setTrimForCompare(e.target.checked)}
              className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            />
            Trim edges for comparison
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={trimOutput}
              onChange={(e) => setTrimOutput(e.target.checked)}
              className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            />
            Trim each kept line (full trim)
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800">
            <Upload className="size-4 shrink-0" aria-hidden />
            <span>Upload .txt</span>
            <input
              type="file"
              accept=".txt,text/plain"
              className="sr-only"
              onChange={onUpload}
            />
          </label>
          <button
            type="button"
            onClick={() => setInput(SAMPLE)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Load sample
          </button>
          <button
            type="button"
            onClick={() => setInput("")}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <label
            htmlFor="dlr-input"
            className="text-sm font-medium text-foreground"
          >
            Input (one item per line)
          </label>
          <textarea
            id="dlr-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            rows={16}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            placeholder="Paste a list, log lines, or IDs—one per line."
          />
        </div>
        <div className="min-w-0">
          <span
            id="dlr-output-label"
            className="text-sm font-medium text-foreground"
          >
            Deduplicated output
          </span>
          <div className="relative mt-1.5">
            <textarea
              readOnly
              value={output}
              rows={16}
              spellCheck={false}
              aria-labelledby="dlr-output-label"
              className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none dark:border-zinc-800 dark:bg-zinc-950"
              placeholder="Unique lines appear here as you type."
            />
            <button
              type="button"
              onClick={copyOutput}
              disabled={!output}
              title={copyDone ? "Copied" : "Copy deduplicated text"}
              aria-label={
                copyDone ? "Copied to clipboard" : "Copy deduplicated text"
              }
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
        </div>
      </div>

      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
        <span className="font-medium text-foreground">{stats.inCount}</span>{" "}
        lines in →{" "}
        <span className="font-medium text-foreground">{stats.outCount}</span>{" "}
        lines out
        {stats.removed > 0 ? (
          <>
            {" "}
            (<span className="font-medium text-foreground">{stats.removed}</span>{" "}
            duplicates removed)
          </>
        ) : null}
        . First occurrence of each line is kept; order is preserved.
      </p>
    </div>
  );
}
