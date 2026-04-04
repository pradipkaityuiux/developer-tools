"use client";

import { useEffect, useState } from "react";
import { CopyIconButton } from "@/components/copy-icon-button";
import { formatJs, minifyJs } from "@/lib/js-formatter-core";

const SAMPLE = `// Sample: fetch JSON and render a list
async function loadItems(url){const r=await fetch(url);if(!r.ok)throw new Error("HTTP "+r.status);return r.json()}
export async function renderList(root,url){const items=await loadItems(url);root.innerHTML=items.map(i=>"<li>"+String(i.name)+"</li>").join("")}`;

export function JsFormatterTool() {
  const [text, setText] = useState(SAMPLE);
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const [busy, setBusy] = useState<"format" | "minify" | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    if (!copyHint) return;
    const t = window.setTimeout(() => setCopyHint(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyHint]);

  async function copyToClipboard(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyHint("Copied to clipboard");
    } catch {
      setCopyHint("Copy blocked — select text manually");
    }
  }

  async function onFormat() {
    setLastError(null);
    setBusy("format");
    try {
      const r = await formatJs(text);
      if (r.ok) setText(r.value);
      else setLastError(r.error);
    } finally {
      setBusy(null);
    }
  }

  async function onMinify() {
    setLastError(null);
    setBusy("minify");
    try {
      const r = await minifyJs(text);
      if (r.ok) setText(r.value);
      else setLastError(r.error);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="js-input"
            className="block text-sm font-medium text-foreground"
          >
            JavaScript / TypeScript input
          </label>
          <div className="relative mt-1.5">
            <textarea
              id="js-input"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setLastError(null);
              }}
              spellCheck={false}
              rows={16}
              className="w-full resize-y rounded-lg border border-zinc-300 bg-white py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder={'function hello() {\n  console.log("world");\n}'}
            />
            <CopyIconButton
              placement="corner"
              copied={copyHint === "Copied to clipboard"}
              onClick={() => void copyToClipboard(text)}
              disabled={busy !== null || !text}
              title="Copy JavaScript"
              aria-label="Copy JavaScript"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void onFormat()}
            disabled={busy !== null}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {busy === "format" ? "Formatting…" : "Format"}
          </button>
          <button
            type="button"
            onClick={() => void onMinify()}
            disabled={busy !== null}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            {busy === "minify" ? "Minifying…" : "Minify"}
          </button>
          <button
            type="button"
            onClick={() => {
              setText("");
              setLastError(null);
            }}
            disabled={busy !== null}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => {
              setText(SAMPLE);
              setLastError(null);
            }}
            disabled={busy !== null}
            className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Load sample
          </button>
        </div>

        {lastError ? (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            <p className="font-medium">Could not process</p>
            <p className="mt-1 font-mono text-xs break-all opacity-90 whitespace-pre-wrap">
              {lastError}
            </p>
          </div>
        ) : text.trim() ? (
          <p
            className="text-sm font-medium text-emerald-700 dark:text-emerald-400"
            role="status"
          >
            {busy
              ? busy === "format"
                ? "Running Prettier…"
                : "Running Terser…"
              : "Ready — use Format for JS/TS pretty-print or Minify for smaller JavaScript output."}
          </p>
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
            Paste code or load the sample to get started.
          </p>
        )}

        {copyHint ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{copyHint}</p>
        ) : null}

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          <strong className="font-medium text-zinc-600 dark:text-zinc-300">
            Format
          </strong>{" "}
          accepts JavaScript and TypeScript (including many modern syntax
          features).{" "}
          <strong className="font-medium text-zinc-600 dark:text-zinc-300">
            Minify
          </strong>{" "}
          targets executable JavaScript—strip types or build first if Terser
          reports parse errors.
        </p>
      </div>
    </div>
  );
}
