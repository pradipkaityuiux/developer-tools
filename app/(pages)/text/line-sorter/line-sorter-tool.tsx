"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { Check, Copy, Upload } from "lucide-react";

const SAMPLE = `zebra
apple
Banana
cherry
date
apple
node
npm
42`;

type SortMode = "az" | "za" | "len-asc" | "len-desc" | "random";

function splitLines(text: string): string[] {
  return text.split(/\r\n|\r|\n/);
}

function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sortLinesStable(
  lines: string[],
  mode: Exclude<SortMode, "random">,
  ignoreCase: boolean,
): string[] {
  const arr = [...lines];
  const cmpAlpha = (a: string, b: string) => {
    const x = ignoreCase ? a.toLowerCase() : a;
    const y = ignoreCase ? b.toLowerCase() : b;
    return x.localeCompare(y, undefined, {
      sensitivity: ignoreCase ? "base" : "variant",
      numeric: true,
    });
  };
  switch (mode) {
    case "az":
      return arr.sort((a, b) => cmpAlpha(a, b));
    case "za":
      return arr.sort((a, b) => cmpAlpha(b, a));
    case "len-asc":
      return arr.sort(
        (a, b) => a.length - b.length || cmpAlpha(a, b),
      );
    case "len-desc":
      return arr.sort(
        (a, b) => b.length - a.length || cmpAlpha(a, b),
      );
  }
}

export function LineSorterTool() {
  const [input, setInput] = useState(SAMPLE);
  const [mode, setMode] = useState<SortMode>("az");
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [copyDone, setCopyDone] = useState(false);
  const [randomSnapshot, setRandomSnapshot] = useState<{
    output: string;
    sourceInput: string;
  } | null>(null);

  const deterministicOutput = useMemo(() => {
    const lines = splitLines(input);
    if (mode === "random") return "";
    return sortLinesStable(lines, mode, ignoreCase).join("\n");
  }, [input, mode, ignoreCase]);

  function shuffleFromCurrentInput() {
    const lines = splitLines(input);
    setRandomSnapshot({
      output: fisherYates(lines).join("\n"),
      sourceInput: input,
    });
  }

  function onModeChange(next: SortMode) {
    setMode(next);
    if (next === "random") {
      const lines = splitLines(input);
      setRandomSnapshot({
        output: fisherYates(lines).join("\n"),
        sourceInput: input,
      });
    } else {
      setRandomSnapshot(null);
    }
  }

  const output =
    mode === "random"
      ? (randomSnapshot?.output ?? "")
      : deterministicOutput;

  const inputStaleRandom =
    mode === "random" &&
    randomSnapshot !== null &&
    input !== randomSnapshot.sourceInput;

  const stats = useMemo(() => {
    const inLines = splitLines(input);
    const outLines = splitLines(output);
    return { inCount: inLines.length, outCount: outLines.length };
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

  const ignoreCaseApplies = mode === "az" || mode === "za";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="ls-sort-mode"
              className="text-sm font-medium text-foreground"
            >
              Sort mode
            </label>
            <select
              id="ls-sort-mode"
              value={mode}
              onChange={(e) => onModeChange(e.target.value as SortMode)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            >
              <option value="az">A–Z (alphabetical)</option>
              <option value="za">Z–A (reverse alphabetical)</option>
              <option value="len-asc">Shortest line first (by length)</option>
              <option value="len-desc">Longest line first (by length)</option>
              <option value="random">Random order (shuffle)</option>
            </select>
          </div>
          <label
            className={`flex cursor-pointer items-center gap-2 text-sm text-foreground ${!ignoreCaseApplies ? "opacity-50" : ""}`}
          >
            <input
              type="checkbox"
              checked={ignoreCase}
              disabled={!ignoreCaseApplies}
              onChange={(e) => setIgnoreCase(e.target.checked)}
              className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 disabled:cursor-not-allowed dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            />
            Ignore case (A–Z / Z–A only)
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === "random" ? (
            <button
              type="button"
              onClick={shuffleFromCurrentInput}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Shuffle again
            </button>
          ) : null}
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
            onClick={() => {
              setInput("");
              if (mode === "random") {
                setRandomSnapshot({ output: "", sourceInput: "" });
              }
            }}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Clear
          </button>
        </div>
      </div>

      {inputStaleRandom ? (
        <p className="mt-3 text-sm text-amber-700 dark:text-amber-400">
          Input changed since the last shuffle. Click{" "}
          <strong className="font-medium">Shuffle again</strong> to reorder the
          current lines.
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <label
            htmlFor="ls-input"
            className="text-sm font-medium text-foreground"
          >
            Input (one line per row)
          </label>
          <textarea
            id="ls-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            rows={16}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            placeholder="Paste a list, log tail, import paths, or IDs—one per line."
          />
        </div>
        <div className="min-w-0">
          <span
            id="ls-output-label"
            className="text-sm font-medium text-foreground"
          >
            Sorted output
          </span>
          <div className="relative mt-1.5">
            <textarea
              readOnly
              value={output}
              rows={16}
              spellCheck={false}
              aria-labelledby="ls-output-label"
              className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none dark:border-zinc-800 dark:bg-zinc-950"
              placeholder="Sorted lines appear here."
            />
            <button
              type="button"
              onClick={copyOutput}
              disabled={!output}
              title={copyDone ? "Copied" : "Copy sorted text"}
              aria-label={
                copyDone ? "Copied to clipboard" : "Copy sorted text"
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
        lines out. Duplicates are kept; only order changes.
      </p>
    </div>
  );
}
