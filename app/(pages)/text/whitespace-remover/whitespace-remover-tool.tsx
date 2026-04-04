"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  normalizeWhitespace,
  splitLines,
  type BlankLinesMode,
} from "@/lib/whitespace-remover-core";

const SAMPLE = `  First Name     Last Name	  Email  

John    Smith    john@example.com
  Jane	Doe   jane@example.com   



Bob   Jones   bob@example.com  
`;

export function WhitespaceRemoverTool() {
  const [input, setInput] = useState(SAMPLE);
  const [trimDocument, setTrimDocument] = useState(true);
  const [trimEachLine, setTrimEachLine] = useState(true);
  const [collapseHorizontal, setCollapseHorizontal] = useState(true);
  const [blankLines, setBlankLines] = useState<BlankLinesMode>("collapse");
  const [copyDone, setCopyDone] = useState(false);

  const options = useMemo(
    () => ({
      trimDocument,
      trimEachLine,
      collapseHorizontal,
      blankLines,
    }),
    [trimDocument, trimEachLine, collapseHorizontal, blankLines],
  );

  const output = useMemo(
    () => normalizeWhitespace(input, options),
    [input, options],
  );

  const stats = useMemo(() => {
    const inLines = splitLines(input);
    const outLines = splitLines(output);
    return {
      inChars: input.length,
      outChars: output.length,
      inLines: inLines.length,
      outLines: outLines.length,
    };
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
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={trimDocument}
                onChange={(e) => setTrimDocument(e.target.checked)}
                className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
              />
              Trim start/end of whole text
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={trimEachLine}
                onChange={(e) => setTrimEachLine(e.target.checked)}
                className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
              />
              Trim each line
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={collapseHorizontal}
                onChange={(e) => setCollapseHorizontal(e.target.checked)}
                className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
              />
              Collapse spaces &amp; tabs (per line)
            </label>
          </div>
          <fieldset className="flex flex-wrap gap-3 border-0 p-0">
            <legend className="sr-only">Blank lines</legend>
            <span className="w-full text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Blank lines
            </span>
            {(
              [
                ["keep", "Keep all"],
                ["collapse", "Collapse runs"],
                ["remove", "Remove empty lines"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
              >
                <input
                  type="radio"
                  name="wr-blank"
                  value={value}
                  checked={blankLines === value}
                  onChange={() => setBlankLines(value)}
                  className="size-4 border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                />
                {label}
              </label>
            ))}
          </fieldset>
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
            htmlFor="wr-input"
            className="text-sm font-medium text-foreground"
          >
            Input
          </label>
          <textarea
            id="wr-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            rows={16}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            placeholder="Paste messy text from PDFs, Excel, Slack, or logs."
          />
        </div>
        <div className="min-w-0">
          <span
            id="wr-output-label"
            className="text-sm font-medium text-foreground"
          >
            Cleaned output
          </span>
          <div className="relative mt-1.5">
            <textarea
              readOnly
              value={output}
              rows={16}
              spellCheck={false}
              aria-labelledby="wr-output-label"
              className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none dark:border-zinc-800 dark:bg-zinc-950"
              placeholder="Normalized text appears here as you type."
            />
            <button
              type="button"
              onClick={copyOutput}
              disabled={!output}
              title={copyDone ? "Copied" : "Copy cleaned text"}
              aria-label={
                copyDone ? "Copied to clipboard" : "Copy cleaned text"
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
        <span className="font-medium text-foreground">{stats.inChars}</span> →{" "}
        <span className="font-medium text-foreground">{stats.outChars}</span>{" "}
        characters,{" "}
        <span className="font-medium text-foreground">{stats.inLines}</span> →{" "}
        <span className="font-medium text-foreground">{stats.outLines}</span>{" "}
        lines (before / after).
      </p>
    </div>
  );
}
