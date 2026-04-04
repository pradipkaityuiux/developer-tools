"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { Check, Copy, Upload } from "lucide-react";
import { detectDelimiter } from "@/lib/csv-parse";
import {
  countInputLines,
  joinLinesToDelimited,
  splitDelimitedToLines,
  type QuoteStyle,
} from "@/lib/comma-separator-core";

const SAMPLE_JOIN = `north@example.com
south@example.com
east@example.com
west@example.com`;

const SAMPLE_SPLIT = `1001,1002,"1003, bundle",1004
alpha,beta,gamma`;

type Preset = "comma" | "semicolon" | "tab" | "pipe" | "custom";

const PRESET_CHAR: Record<Exclude<Preset, "custom">, string> = {
  comma: ",",
  semicolon: ";",
  tab: "\t",
  pipe: "|",
};

function delimiterFromPreset(
  preset: Preset,
  custom: string,
): string {
  if (preset === "custom") {
    const c = custom.slice(0, 1);
    return c === "" ? "," : c;
  }
  return PRESET_CHAR[preset];
}

export function CommaSeparatorTool() {
  const [mode, setMode] = useState<"join" | "split">("join");
  const [input, setInput] = useState(SAMPLE_JOIN);
  const [preset, setPreset] = useState<Preset>("comma");
  const [customDelimiter, setCustomDelimiter] = useState("");
  const [trimLines, setTrimLines] = useState(true);
  const [skipEmptyLines, setSkipEmptyLines] = useState(false);
  const [quoteStyle, setQuoteStyle] = useState<QuoteStyle>("minimal");
  const [trimValues, setTrimValues] = useState(true);
  const [blankLineBetweenRows, setBlankLineBetweenRows] = useState(false);
  const [copyDone, setCopyDone] = useState(false);

  const delimiter = delimiterFromPreset(preset, customDelimiter);

  const output = useMemo(() => {
    if (mode === "join") {
      return joinLinesToDelimited(input, {
        delimiter,
        trimLines,
        skipEmptyLines,
        quoteStyle,
      });
    }
    return splitDelimitedToLines(input, {
      delimiter,
      trimValues,
      blankLineBetweenRows,
    });
  }, [
    mode,
    input,
    delimiter,
    trimLines,
    skipEmptyLines,
    quoteStyle,
    trimValues,
    blankLineBetweenRows,
  ]);

  const stats = useMemo(() => {
    const linesIn = countInputLines(input);
    if (mode === "join") {
      const fields = skipEmptyLines
        ? input.split(/\r\n|\r|\n/).filter((l) => {
            const v = trimLines ? l.trim() : l;
            return v !== "";
          }).length
        : input === ""
          ? 0
          : input.split(/\r\n|\r|\n/).length;
      return {
        label: `${linesIn} input line(s) → ${fields} field(s) joined`,
      };
    }
    const outLines = output === "" ? 0 : output.split(/\r\n|\r|\n/).length;
    return {
      label: `${linesIn} input line(s) → ${outLines} output line(s) (one value per line)`,
    };
  }, [mode, input, output, skipEmptyLines, trimLines]);

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopyDone(true);
      window.setTimeout(() => setCopyDone(false), 2000);
    } catch {
      /* manual selection */
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

  function loadSample() {
    setInput(mode === "join" ? SAMPLE_JOIN : SAMPLE_SPLIT);
  }

  function onDetectDelimiter() {
    if (mode !== "split" || !input.trim()) return;
    const d = detectDelimiter(input);
    if (d === ",") setPreset("comma");
    else if (d === ";") setPreset("semicolon");
    else if (d === "\t") setPreset("tab");
    else if (d === "|") setPreset("pipe");
    else {
      setPreset("custom");
      setCustomDelimiter(d.slice(0, 1));
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
        <fieldset className="flex flex-wrap gap-3">
          <legend className="sr-only">Mode</legend>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="radio"
              name="cs-mode"
              checked={mode === "join"}
              onChange={() => setMode("join")}
              className="size-4 border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            />
            Join lines → delimited
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="radio"
              name="cs-mode"
              checked={mode === "split"}
              onChange={() => setMode("split")}
              className="size-4 border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            />
            Split delimited → lines
          </label>
        </fieldset>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm text-foreground">
            <span className="sr-only">Delimiter</span>
            <select
              value={preset}
              onChange={(e) =>
                setPreset(e.target.value as Preset)
              }
              className="rounded-lg border border-zinc-300 bg-white px-2 py-2 text-sm text-foreground dark:border-zinc-600 dark:bg-zinc-900"
            >
              <option value="comma">Comma (,)</option>
              <option value="semicolon">Semicolon (;)</option>
              <option value="tab">Tab</option>
              <option value="pipe">Pipe (|)</option>
              <option value="custom">Custom (1 character)</option>
            </select>
          </label>
          {preset === "custom" ? (
            <input
              type="text"
              value={customDelimiter}
              onChange={(e) => setCustomDelimiter(e.target.value)}
              maxLength={4}
              aria-label="Custom delimiter character"
              className="w-24 rounded-lg border border-zinc-300 bg-white px-2 py-2 font-mono text-sm text-foreground dark:border-zinc-600 dark:bg-zinc-900"
              placeholder=","
            />
          ) : null}
          {mode === "split" ? (
            <button
              type="button"
              onClick={onDetectDelimiter}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Detect delimiter
            </button>
          ) : null}
        </div>
      </div>

      {mode === "join" ? (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={trimLines}
              onChange={(e) => setTrimLines(e.target.checked)}
              className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            />
            Trim each line before join
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={skipEmptyLines}
              onChange={(e) => setSkipEmptyLines(e.target.checked)}
              className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            />
            Skip empty lines
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <span className="shrink-0">Quote fields</span>
            <select
              value={quoteStyle}
              onChange={(e) =>
                setQuoteStyle(e.target.value as QuoteStyle)
              }
              className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
            >
              <option value="minimal">When needed (CSV-safe)</option>
              <option value="always">Always</option>
            </select>
          </label>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={trimValues}
              onChange={(e) => setTrimValues(e.target.checked)}
              className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            />
            Trim each value after split
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={blankLineBetweenRows}
              onChange={(e) => setBlankLineBetweenRows(e.target.checked)}
              className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            />
            Blank line between row groups
          </label>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
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
          onClick={loadSample}
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

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <label
            htmlFor="cs-input"
            className="text-sm font-medium text-foreground"
          >
            {mode === "join"
              ? "Input (one value per line)"
              : "Input (delimited text, quoted fields supported)"}
          </label>
          <textarea
            id="cs-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            rows={16}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            placeholder={
              mode === "join"
                ? "Paste one item per line…"
                : "Paste CSV/TSV or multi-line delimited rows…"
            }
          />
        </div>
        <div className="min-w-0">
          <span
            id="cs-output-label"
            className="text-sm font-medium text-foreground"
          >
            Output
          </span>
          <div className="relative mt-1.5">
            <textarea
              readOnly
              value={output}
              rows={16}
              spellCheck={false}
              aria-labelledby="cs-output-label"
              className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none dark:border-zinc-800 dark:bg-zinc-950"
              placeholder="Result appears here."
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
      </div>

      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
        <span className="font-medium text-foreground">{stats.label}</span>
        . Delimiter in use:{" "}
        <span className="font-mono text-foreground">
          {delimiter === "\t" ? "TAB" : delimiter}
        </span>
        .
      </p>
    </div>
  );
}
