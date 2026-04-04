"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import { type SlugMode, slugifyText } from "@/lib/slug-generator-core";

const SAMPLE = `10 Tips for Faster Next.js Builds
API Rate Limiting — A Practical Guide
café_reviews (2024)`;

export function SlugGeneratorTool() {
  const inputId = useId();
  const outputId = useId();
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState(SAMPLE);
  const [mode, setMode] = useState<SlugMode>("single");
  const [notice, setNotice] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);

  const output = useMemo(() => slugifyText(input, mode), [input, mode]);

  async function copyOutput() {
    if (!output) {
      setNotice("Nothing to copy—add letters or numbers to the input.");
      setTimeout(() => setNotice(null), 3500);
      return;
    }
    try {
      await navigator.clipboard.writeText(output);
      setNotice(null);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setNotice("Clipboard blocked. Select the output and copy manually.");
      setTimeout(() => setNotice(null), 4000);
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setNotice(null);
    const reader = new FileReader();
    reader.onload = () => {
      const body = typeof reader.result === "string" ? reader.result : "";
      setInput(body);
    };
    reader.onerror = () => {
      setNotice("Could not read the file.");
      setTimeout(() => setNotice(null), 4000);
    };
    reader.readAsText(file, "UTF-8");
  }

  const slugCount =
    mode === "per-line"
      ? output.split(/\r?\n/).filter((s) => s.length > 0).length
      : output
        ? 1
        : 0;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <label
              htmlFor={inputId}
              className="block text-sm font-medium text-foreground"
            >
              Titles or lines
            </label>
            <textarea
              id={inputId}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setNotice(null);
              }}
              spellCheck={true}
              rows={12}
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder="Paste a headline, product name, or one title per line…"
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-foreground">
              Output mode
            </legend>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
                <input
                  type="radio"
                  name="slug-mode"
                  checked={mode === "single"}
                  onChange={() => setMode("single")}
                  className="border-zinc-300 text-zinc-900 dark:border-zinc-600"
                />
                <span className="text-foreground">Single slug</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  (join lines)
                </span>
              </label>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
                <input
                  type="radio"
                  name="slug-mode"
                  checked={mode === "per-line"}
                  onChange={() => setMode("per-line")}
                  className="border-zinc-300 text-zinc-900 dark:border-zinc-600"
                />
                <span className="text-foreground">One slug per line</span>
              </label>
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
              onClick={copyOutput}
              disabled={!output}
              title={copyDone ? "Copied" : "Copy slugs"}
              aria-label={copyDone ? "Copied slugs" : "Copy slugs"}
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
              Copy slugs
            </button>
            <button
              type="button"
              onClick={() => {
                setInput("");
                setNotice(null);
              }}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                setInput(SAMPLE);
                setNotice(null);
              }}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Load sample
            </button>
          </div>

          {notice ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {notice}
            </p>
          ) : null}
        </div>

        <div className="w-full shrink-0 space-y-3 lg:w-[min(100%,28rem)]">
          <div>
            <label
              htmlFor={outputId}
              className="block text-sm font-medium text-foreground"
            >
              Slug output
            </label>
            <textarea
              id={outputId}
              readOnly
              value={output}
              rows={mode === "per-line" ? 12 : 4}
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none dark:border-zinc-700 dark:bg-zinc-900/60"
              placeholder="Your slug(s) appear here…"
            />
          </div>
          <p
            className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400"
            aria-live="polite"
          >
            {output
              ? mode === "per-line"
                ? `${slugCount} slug${slugCount === 1 ? "" : "s"} (newline-separated)`
                : "Single path segment"
              : "Add text with letters or numbers to generate a slug."}
          </p>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        Slugs are computed in your browser. Always verify uniqueness and reserved
        words in your CMS or router before publishing.
      </p>
    </div>
  );
}
