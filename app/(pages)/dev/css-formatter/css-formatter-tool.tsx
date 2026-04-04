"use client";

import { useEffect, useState } from "react";
import { CopyIconButton } from "@/components/copy-icon-button";
import { formatCss, minifyCss } from "@/lib/css-formatter-core";

const SAMPLE = `/* Sample card component */
.card{display:flex;flex-direction:column;gap:.75rem;padding:1rem 1.25rem;border:1px solid #e4e4e7;border-radius:.75rem;background:#fff;box-shadow:0 1px 2px rgb(0 0 0 / 6%)}
.card__title{font-size:1.125rem;font-weight:600;line-height:1.35;color:#18181b}
.card__meta{font-size:.875rem;color:#71717a}
@media (max-width:40rem){.card{padding:.875rem 1rem}}`;

export function CssFormatterTool() {
  const [text, setText] = useState(SAMPLE);
  const [copyHint, setCopyHint] = useState<string | null>(null);

  useEffect(() => {
    if (!copyHint) return;
    const t = window.setTimeout(() => setCopyHint(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyHint]);

  const formatResult = formatCss(text);
  const processError =
    text.trim() && !formatResult.ok ? formatResult.error : null;

  async function copyToClipboard(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyHint("Copied to clipboard");
    } catch {
      setCopyHint("Copy blocked — select text manually");
    }
  }

  function onFormat() {
    const r = formatCss(text);
    if (r.ok) setText(r.value);
  }

  function onMinify() {
    const r = minifyCss(text);
    if (r.ok) setText(r.value);
  }

  const canProcess = formatResult.ok;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="css-input"
            className="block text-sm font-medium text-foreground"
          >
            CSS input
          </label>
          <div className="relative mt-1.5">
            <textarea
              id="css-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
              rows={16}
              className="w-full resize-y rounded-lg border border-zinc-300 bg-white py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder=".btn { color: #fff; padding: 0.5rem 1rem; }"
            />
            <CopyIconButton
              placement="corner"
              copied={copyHint === "Copied to clipboard"}
              onClick={() => copyToClipboard(text)}
              disabled={!text}
              title="Copy CSS"
              aria-label="Copy CSS"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onFormat}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Format
          </button>
          <button
            type="button"
            onClick={onMinify}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Minify
          </button>
          <button
            type="button"
            onClick={() => {
              setText("");
            }}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setText(SAMPLE)}
            className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Load sample
          </button>
        </div>

        {processError ? (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            <p className="font-medium">Could not process CSS</p>
            <p className="mt-1 font-mono text-xs break-all opacity-90">{processError}</p>
          </div>
        ) : text.trim() ? (
          <p
            className={`text-sm font-medium ${canProcess ? "text-emerald-700 dark:text-emerald-400" : "text-zinc-600 dark:text-zinc-400"}`}
            role="status"
          >
            {canProcess
              ? "Braces and strings look balanced — use Format or Minify."
              : "Fix the issue above to enable Format and Minify."}
          </p>
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
            Paste CSS or load the sample to get started.
          </p>
        )}

        {copyHint ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{copyHint}</p>
        ) : null}

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Minify removes{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
            {"/* comments */"}
          </code>
          . Strings and{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
            url(...)
          </code>{" "}
          contents are preserved. For full build pipelines, keep using your bundler or PostCSS.
        </p>
      </div>
    </div>
  );
}
