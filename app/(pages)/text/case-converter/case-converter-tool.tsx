"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  type CaseMode,
  convertTextCase,
} from "@/lib/text-case-converter-core";

const SAMPLE = `Hello World
user_profile
apiResponse
title case for headings`;

const MODE_LABELS: { id: CaseMode; label: string; hint: string }[] = [
  { id: "upper", label: "UPPERCASE", hint: "ALL CAPS" },
  { id: "lower", label: "lowercase", hint: "all small letters" },
  { id: "title", label: "Title Case", hint: "Capitalize Each Word" },
  { id: "camel", label: "camelCase", hint: "camelCaseIdentifier" },
  { id: "snake", label: "snake_case", hint: "underscore_separated" },
  { id: "kebab", label: "kebab-case", hint: "hyphen-separated" },
];

export function CaseConverterTool() {
  const [input, setInput] = useState(SAMPLE);
  const [mode, setMode] = useState<CaseMode>("camel");
  const [copyDone, setCopyDone] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const output = useMemo(() => convertTextCase(input, mode), [input, mode]);

  useEffect(() => {
    if (!copyDone) return;
    const t = window.setTimeout(() => setCopyDone(false), 2000);
    return () => window.clearTimeout(t);
  }, [copyDone]);

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output);
      setNotice(null);
      setCopyDone(true);
    } catch {
      setNotice("Clipboard blocked—select the output and copy manually.");
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNotice(null);
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("text/") && !file.name.endsWith(".txt")) {
      setNotice("Please choose a plain-text or .txt file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text =
        typeof reader.result === "string" ? reader.result : "";
      setInput(text);
    };
    reader.onerror = () =>
      setNotice("Could not read that file—try a smaller .txt file.");
    reader.readAsText(file, "UTF-8");
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <label
              htmlFor="case-input"
              className="block text-sm font-medium text-foreground"
            >
              Input text
            </label>
            <textarea
              id="case-input"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setNotice(null);
              }}
              spellCheck={false}
              rows={14}
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder="Paste sentences, variable names, or lists…"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".txt,text/plain"
              className="sr-only"
              onChange={onFileChange}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <Upload className="size-4 shrink-0" aria-hidden />
              Upload .txt
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
              onClick={() => setInput("")}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="w-full shrink-0 space-y-3 lg:w-72">
          <fieldset>
            <legend className="text-sm font-medium text-foreground">
              Target case
            </legend>
            <div className="mt-2 flex flex-col gap-1.5">
              {MODE_LABELS.map((m) => (
                <label
                  key={m.id}
                  className="flex cursor-pointer items-start gap-2 rounded-lg border border-transparent px-2 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900/80 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-zinc-400 dark:has-[:focus-visible]:ring-zinc-600"
                >
                  <input
                    type="radio"
                    name="case-mode"
                    value={m.id}
                    checked={mode === m.id}
                    onChange={() => setMode(m.id)}
                    className="mt-0.5 rounded-full border-zinc-400 text-zinc-900 dark:border-zinc-600 dark:text-zinc-100"
                  />
                  <span>
                    <span className="font-medium text-foreground">
                      {m.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-400">
                      {m.hint}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      <div className="mt-6 min-w-0">
        <span
          id="case-output-label"
          className="text-sm font-medium text-foreground"
        >
          Output
        </span>
        <div className="relative mt-1.5">
          <textarea
            readOnly
            value={output}
            rows={10}
            spellCheck={false}
            aria-labelledby="case-output-label"
            className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none dark:border-zinc-800 dark:bg-zinc-950"
            placeholder="Output appears as you type or change the case option."
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

      {notice ? (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
          {notice}
        </p>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        Uppercase, lowercase, and title case affect the whole textarea.
        camelCase, snake_case, and kebab-case split on spaces, hyphens, and
        underscores and detect camelCase word boundaries—ideal for labels and
        identifiers, not for arbitrary source code blocks.
      </p>
    </div>
  );
}
