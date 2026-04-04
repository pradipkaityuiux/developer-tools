"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  performFindReplace,
  type FindReplaceMode,
} from "@/lib/find-replace-core";

const SAMPLE = `Order #1001 for customer@a.com
Order #1002 for customer@b.com
Support line: 555-0100 (old) vs 555-0199 (new).
TODO: fix typo "recieve" before release.`;

export function FindReplaceTool() {
  const [text, setText] = useState(SAMPLE);
  const [find, setFind] = useState("Order");
  const [replace, setReplace] = useState("Invoice");
  const [mode, setMode] = useState<FindReplaceMode>("literal");
  const [literalCaseSensitive, setLiteralCaseSensitive] = useState(true);
  const [regexIgnoreCase, setRegexIgnoreCase] = useState(false);
  const [regexMultiline, setRegexMultiline] = useState(false);
  const [regexDotAll, setRegexDotAll] = useState(false);
  const [copyDone, setCopyDone] = useState(false);

  const regexExtraFlags = useMemo(() => {
    let f = "";
    if (regexIgnoreCase) f += "i";
    if (regexMultiline) f += "m";
    if (regexDotAll) f += "s";
    return f;
  }, [regexIgnoreCase, regexMultiline, regexDotAll]);

  const result = useMemo(
    () =>
      performFindReplace({
        text,
        find,
        replace,
        mode,
        literalCaseSensitive,
        regexExtraFlags,
      }),
    [text, find, replace, mode, literalCaseSensitive, regexExtraFlags],
  );

  async function copyOutput() {
    if (!result.ok && result.output === "") return;
    const out = result.output;
    if (!out) return;
    try {
      await navigator.clipboard.writeText(out);
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
      const r = reader.result;
      if (typeof r !== "string") return;
      setText(r);
    };
    reader.readAsText(file, "UTF-8");
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <span className="text-sm font-medium text-foreground">Mode</span>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="radio"
              name="fr-mode"
              checked={mode === "literal"}
              onChange={() => setMode("literal")}
              className="size-4 border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            />
            Plain text
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="radio"
              name="fr-mode"
              checked={mode === "regex"}
              onChange={() => setMode("regex")}
              className="size-4 border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            />
            Regular expression
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
            onClick={() => {
              setText(SAMPLE);
              setFind("Order");
              setReplace("Invoice");
              setMode("literal");
              setLiteralCaseSensitive(true);
            }}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Load sample
          </button>
          <button
            type="button"
            onClick={() => {
              setText("");
              setFind("");
              setReplace("");
            }}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Clear all
          </button>
        </div>
      </div>

      {mode === "literal" ? (
        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={literalCaseSensitive}
            onChange={(e) => setLiteralCaseSensitive(e.target.checked)}
            className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
          />
          Match case (plain text)
        </label>
      ) : (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-foreground">
          <span className="w-full font-medium sm:w-auto">Regex flags:</span>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={regexIgnoreCase}
              onChange={(e) => setRegexIgnoreCase(e.target.checked)}
              className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            />
            Ignore case (i)
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={regexMultiline}
              onChange={(e) => setRegexMultiline(e.target.checked)}
              className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            />
            Multiline (m)
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={regexDotAll}
              onChange={(e) => setRegexDotAll(e.target.checked)}
              className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            />
            Dot matches newline (s)
          </label>
          <span className="text-zinc-500 dark:text-zinc-400">
            Global replace (g) is always on.
          </span>
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="fr-find"
            className="text-sm font-medium text-foreground"
          >
            Find
          </label>
          <input
            id="fr-find"
            type="text"
            value={find}
            onChange={(e) => setFind(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            placeholder={
              mode === "regex" ? "Pattern, e.g. \\d+ or TODO:.*" : "Literal text"
            }
          />
        </div>
        <div>
          <label
            htmlFor="fr-replace"
            className="text-sm font-medium text-foreground"
          >
            Replace with
          </label>
          <input
            id="fr-replace"
            type="text"
            value={replace}
            onChange={(e) => setReplace(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            placeholder="Replacement (supports $1, $& in regex mode)"
          />
        </div>
      </div>

      {!result.ok ? (
        <p
          className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200"
          role="alert"
        >
          {result.error}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <label
            htmlFor="fr-input"
            className="text-sm font-medium text-foreground"
          >
            Document
          </label>
          <textarea
            id="fr-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            rows={14}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            placeholder="Paste logs, articles, config, or CSV exports."
          />
        </div>
        <div className="min-w-0">
          <span
            id="fr-output-label"
            className="text-sm font-medium text-foreground"
          >
            Result
          </span>
          <div className="relative mt-1.5">
            <textarea
              readOnly
              value={result.output}
              rows={14}
              spellCheck={false}
              aria-labelledby="fr-output-label"
              className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none dark:border-zinc-800 dark:bg-zinc-950"
              placeholder="Updated text appears here."
            />
            <button
              type="button"
              onClick={copyOutput}
              disabled={!result.output}
              title={copyDone ? "Copied" : "Copy result"}
              aria-label={copyDone ? "Copied to clipboard" : "Copy result"}
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
        {result.ok ? (
          <>
            <span className="font-medium text-foreground">
              {result.matchCount}
            </span>{" "}
            match{result.matchCount === 1 ? "" : "es"} replaced
            {result.matchCount === 0 ? " (output unchanged)" : ""}.
          </>
        ) : (
          <span className="text-foreground">Fix the find field to update.</span>
        )}{" "}
        Input length{" "}
        <span className="font-medium text-foreground">{text.length}</span> →
        output{" "}
        <span className="font-medium text-foreground">
          {result.output.length}
        </span>{" "}
        characters.
      </p>
    </div>
  );
}
