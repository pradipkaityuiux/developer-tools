"use client";

import { useId, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  reverseText,
  type TextReverseMode,
} from "@/lib/text-reverser-core";

const SAMPLE = `Hello world — line one
The quick brown fox jumps
Mirror puzzles and UI demos`;

const MODES: { value: TextReverseMode; label: string; hint: string }[] = [
  {
    value: "full",
    label: "Reverse full text",
    hint: "Flip every character, including newlines",
  },
  {
    value: "words-per-line",
    label: "Reverse words per line",
    hint: "Swap word order on each line",
  },
  {
    value: "lines",
    label: "Reverse each line",
    hint: "Mirror characters inside each line",
  },
];

export function TextReverserTool() {
  const inputId = useId();
  const modeGroupId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState(SAMPLE);
  const [mode, setMode] = useState<TextReverseMode>("full");
  const [copyDone, setCopyDone] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const output = useMemo(() => reverseText(input, mode), [input, mode]);

  const stats = useMemo(() => {
    const inLen = [...input].length;
    const outLen = [...output].length;
    return { inLen, outLen };
  }, [input, output]);

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopyDone(true);
      window.setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setFileError("Clipboard blocked. Select the output and copy manually.");
      window.setTimeout(() => setFileError(null), 4000);
    }
  }

  function onUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setFileError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") return;
      setInput(result);
    };
    reader.onerror = () => {
      setFileError("Could not read the file.");
    };
    reader.readAsText(file, "UTF-8");
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <fieldset className="space-y-3">
        <legend
          id={modeGroupId}
          className="text-sm font-medium text-foreground"
        >
          Reversal mode
        </legend>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {MODES.map((m) => (
            <label
              key={m.value}
              className={`flex min-w-0 flex-1 cursor-pointer flex-col rounded-lg border px-3 py-2.5 text-sm transition-colors sm:min-w-[11rem] ${
                mode === m.value
                  ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900"
                  : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              }`}
            >
              <span className="flex items-center gap-2 font-medium text-foreground">
                <input
                  type="radio"
                  name="text-reverse-mode"
                  value={m.value}
                  checked={mode === m.value}
                  onChange={() => setMode(m.value)}
                  className="size-4 border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                  aria-describedby={`${modeGroupId}-${m.value}-hint`}
                />
                {m.label}
              </span>
              <span
                id={`${modeGroupId}-${m.value}-hint`}
                className="mt-1 pl-6 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400"
              >
                {m.hint}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 flex flex-wrap gap-2">
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.md,.markdown,text/plain"
          className="sr-only"
          onChange={onUpload}
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
          onClick={() => setInput(SAMPLE)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          Load sample
        </button>
        <button
          type="button"
          onClick={() => {
            setInput("");
            setFileError(null);
          }}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          Clear
        </button>
      </div>

      {fileError ? (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
          {fileError}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            Input
          </label>
          <textarea
            id={inputId}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setFileError(null);
            }}
            spellCheck={true}
            rows={14}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm leading-relaxed text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            placeholder="Paste sentences, lyrics, log lines, or test strings."
          />
        </div>
        <div className="min-w-0">
          <span
            id="text-reverser-output-label"
            className="text-sm font-medium text-foreground"
          >
            Output
          </span>
          <div className="relative mt-1.5">
            <textarea
              readOnly
              value={output}
              rows={14}
              spellCheck={false}
              aria-labelledby="text-reverser-output-label"
              className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 text-sm leading-relaxed text-foreground outline-none dark:border-zinc-800 dark:bg-zinc-950"
              placeholder="Reversed text appears here."
            />
            <button
              type="button"
              onClick={copyOutput}
              disabled={!output}
              title={copyDone ? "Copied" : "Copy reversed text"}
              aria-label={
                copyDone ? "Copied to clipboard" : "Copy reversed text"
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
        <span className="font-medium text-foreground">{stats.inLen}</span>{" "}
        input characters →{" "}
        <span className="font-medium text-foreground">{stats.outLen}</span>{" "}
        output characters (Unicode code points). Processing stays in your
        browser.
      </p>
    </div>
  );
}
