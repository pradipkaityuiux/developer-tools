"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  DEFAULT_LOREM_WORD_POOL,
  generateLorem,
  parseUploadedWords,
  type LoremHtmlMode,
  type LoremUnit,
} from "@/lib/lorem-ipsum-generate";

const LIMITS: Record<LoremUnit, { min: number; max: number; label: string }> = {
  words: { min: 1, max: 2000, label: "Words" },
  sentences: { min: 1, max: 250, label: "Sentences" },
  paragraphs: { min: 1, max: 100, label: "Paragraphs" },
};

function clampCount(unit: LoremUnit, n: number): number {
  const { min, max } = LIMITS[unit];
  const x = Number.isFinite(n) ? Math.floor(n) : min;
  return Math.min(max, Math.max(min, x));
}

export function LoremIpsumTool() {
  const outputId = useId();
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [unit, setUnit] = useState<LoremUnit>("paragraphs");
  const [count, setCount] = useState(3);
  const [htmlMode, setHtmlMode] = useState<LoremHtmlMode>("none");
  const [classicStart, setClassicStart] = useState(true);
  const [customPool, setCustomPool] = useState<string[] | null>(null);
  const [fileHint, setFileHint] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);
  const [regenTick, setRegenTick] = useState(0);

  const effectiveCount = useMemo(() => clampCount(unit, count), [unit, count]);
  const wordPool = customPool ?? DEFAULT_LOREM_WORD_POOL;

  const output = useMemo(() => {
    void regenTick;
    return generateLorem({
      unit,
      count: effectiveCount,
      html: htmlMode,
      classicStart,
      wordPool,
    });
  }, [
    unit,
    effectiveCount,
    htmlMode,
    classicStart,
    wordPool,
    regenTick,
  ]);

  useEffect(() => {
    if (!copyDone) return;
    const t = window.setTimeout(() => setCopyDone(false), 2000);
    return () => window.clearTimeout(t);
  }, [copyDone]);

  const regenerate = useCallback(() => {
    setRegenTick((x) => x + 1);
  }, []);

  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileHint(null);
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      const words = parseUploadedWords(text);
      if (words.length < 10) {
        setCustomPool(null);
        setFileHint(
          "Need at least 10 words after parsing—using the default dictionary.",
        );
        return;
      }
      const unique = [...new Set(words)];
      setCustomPool(unique.length >= 10 ? unique : words);
      setFileHint(`Loaded ${unique.length} unique words from file.`);
    };
    reader.onerror = () => {
      setFileHint("Could not read the file.");
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopyDone(true);
    } catch {
      setFileHint("Clipboard unavailable—select the output and copy manually.");
      window.setTimeout(() => setFileHint(null), 3000);
    }
  }

  const lim = LIMITS[unit];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <span className="block text-sm font-medium text-foreground">
              Generate
            </span>
            <div
              className="mt-1.5 flex flex-wrap gap-2"
              role="group"
              aria-label="Placeholder unit"
            >
              {(
                [
                  ["paragraphs", "Paragraphs"],
                  ["sentences", "Sentences"],
                  ["words", "Words"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setUnit(value);
                    setCount((c) => clampCount(value, c));
                  }}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    unit === value
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border-zinc-300 bg-white text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label
              htmlFor="lorem-count"
              className="block text-sm font-medium text-foreground"
            >
              Count ({lim.min}–{lim.max} {lim.label.toLowerCase()})
            </label>
            <input
              id="lorem-count"
              type="number"
              min={lim.min}
              max={lim.max}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              onBlur={() => setCount((c) => clampCount(unit, c))}
              className="mt-1.5 w-36 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div>
            <span className="block text-sm font-medium text-foreground">
              HTML output
            </span>
            <div
              className="mt-1.5 flex flex-wrap gap-2"
              role="group"
              aria-label="HTML wrapping"
            >
              {(
                [
                  ["none", "Plain text"],
                  ["p", "<p> paragraphs"],
                  ["br", "<br> breaks"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setHtmlMode(value)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    htmlMode === value
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border-zinc-300 bg-white text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-2 pb-0.5 text-sm text-foreground">
            <input
              type="checkbox"
              checked={classicStart}
              onChange={(e) => setClassicStart(e.target.checked)}
              className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
            />
            Classic &quot;Lorem ipsum&quot; opening
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            id={fileId}
            type="file"
            accept=".txt,.md,text/plain"
            className="sr-only"
            onChange={onFile}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <Upload className="size-4 shrink-0" aria-hidden />
            Upload word list
          </button>
          {customPool ? (
            <button
              type="button"
              onClick={() => {
                setCustomPool(null);
                setFileHint("Using default dictionary.");
              }}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Reset dictionary
            </button>
          ) : null}
          <button
            type="button"
            onClick={regenerate}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Regenerate
          </button>
        </div>

        {fileHint ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
            {fileHint}
          </p>
        ) : null}

        <div>
          <span
            id={`${outputId}-label`}
            className="text-sm font-medium text-foreground"
          >
            Output
          </span>
          <div className="relative mt-1.5">
            <textarea
              id={outputId}
              readOnly
              value={output}
              spellCheck={false}
              rows={14}
              aria-labelledby={`${outputId}-label`}
              className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none dark:border-zinc-800 dark:bg-zinc-900/80"
            />
            <button
              type="button"
              onClick={copyOutput}
              disabled={!output}
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
        </div>

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Generation uses{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
            crypto.getRandomValues
          </code>{" "}
          in your browser. Uploaded words are HTML-escaped when you choose HTML
          modes so special characters cannot break markup.
        </p>
      </div>
    </div>
  );
}
