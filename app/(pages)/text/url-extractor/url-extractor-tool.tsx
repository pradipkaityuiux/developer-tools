"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  extractUrls,
  formatUrlList,
  type UrlExtractorOptions,
} from "@/lib/url-extractor-core";

const SAMPLE = `Documentation & releases
See https://example.com/docs/start and the changelog at https://example.com/releases?v=2 (mirror: http://mirror.example.org/path).

Marketing also listed www.example.net and <a href="https://cdn.example.com/assets/app.css">stylesheet</a>.
Contact: https://example.com/help#contact.`;

export function UrlExtractorTool() {
  const inputId = useId();
  const outputId = useId();
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(SAMPLE);
  const [includeBareWww, setIncludeBareWww] = useState(true);
  const [extractHrefAttributes, setExtractHrefAttributes] = useState(true);
  const [onePerLine, setOnePerLine] = useState(true);
  const [fileError, setFileError] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);

  const options: UrlExtractorOptions = useMemo(
    () => ({ includeBareWww, extractHrefAttributes }),
    [includeBareWww, extractHrefAttributes],
  );

  const urls = useMemo(() => extractUrls(text, options), [text, options]);
  const output = useMemo(
    () => formatUrlList(urls, onePerLine),
    [urls, onePerLine],
  );

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setFileError("Clipboard blocked. Select the output and copy manually.");
      setTimeout(() => setFileError(null), 4000);
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const body = typeof reader.result === "string" ? reader.result : "";
      setText(body);
    };
    reader.onerror = () => {
      setFileError("Could not read the file.");
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <label
              htmlFor={inputId}
              className="block text-sm font-medium text-foreground"
            >
              Source text or HTML
            </label>
            <textarea
              id={inputId}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setFileError(null);
              }}
              spellCheck={false}
              rows={12}
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder="Paste emails, logs, HTML, JSON, or any blob that contains http(s) links."
            />
          </div>

          <fieldset className="space-y-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
            <legend className="px-1 text-xs font-medium text-foreground">
              Extraction options
            </legend>
            <label className="flex cursor-pointer items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={extractHrefAttributes}
                onChange={(e) => setExtractHrefAttributes(e.target.checked)}
                className="mt-1 size-4 rounded border-zinc-300 text-zinc-900 dark:border-zinc-600"
              />
              <span>
                <span className="font-medium text-foreground">
                  Scan href attributes
                </span>
                <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-400">
                  Pull targets from{" "}
                  <code className="rounded bg-zinc-100 px-1 font-mono dark:bg-zinc-900">
                    href=&quot;...&quot;
                  </code>{" "}
                  in HTML fragments.
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={includeBareWww}
                onChange={(e) => setIncludeBareWww(e.target.checked)}
                className="mt-1 size-4 rounded border-zinc-300 text-zinc-900 dark:border-zinc-600"
              />
              <span>
                <span className="font-medium text-foreground">
                  Include bare www hosts
                </span>
                <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-400">
                  Match{" "}
                  <code className="rounded bg-zinc-100 px-1 font-mono dark:bg-zinc-900">
                    www.
                  </code>{" "}
                  URLs without a scheme and prefix{" "}
                  <code className="rounded bg-zinc-100 px-1 font-mono dark:bg-zinc-900">
                    https://
                  </code>{" "}
                  in the list.
                </span>
              </span>
            </label>
          </fieldset>

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              id={fileId}
              type="file"
              accept=".txt,.html,.htm,.md,.markdown,.log,.csv,.json,text/plain"
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
              onClick={() => setText("")}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setText(SAMPLE)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Load sample
            </button>
          </div>

          {fileError ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {fileError}
            </p>
          ) : null}
        </div>

        <div className="w-full shrink-0 space-y-4 lg:w-80">
          <div
            className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/40"
            aria-live="polite"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Results
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
              {urls.length.toLocaleString()}{" "}
              <span className="text-base font-normal text-zinc-500 dark:text-zinc-400">
                unique URLs
              </span>
            </p>
          </div>

          <div>
            <span className="block text-sm font-medium text-foreground">
              Output format
            </span>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-zinc-700 dark:text-zinc-300">
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="url-extractor-format"
                  checked={onePerLine}
                  onChange={() => setOnePerLine(true)}
                  className="size-4 border-zinc-300 text-zinc-900 dark:border-zinc-600"
                />
                One per line
              </label>
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="url-extractor-format"
                  checked={!onePerLine}
                  onChange={() => setOnePerLine(false)}
                  className="size-4 border-zinc-300 text-zinc-900 dark:border-zinc-600"
                />
                Comma separated
              </label>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor={outputId}
                className="text-sm font-medium text-foreground"
              >
                Extracted URLs
              </label>
              <button
                type="button"
                onClick={copyOutput}
                disabled={!output}
                title={copyDone ? "Copied" : "Copy URLs"}
                aria-label={copyDone ? "Copied URLs" : "Copy URLs"}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                {copyDone ? (
                  <Check
                    className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                    aria-hidden
                  />
                ) : (
                  <Copy className="size-3.5 shrink-0" aria-hidden />
                )}
                Copy URLs
              </button>
            </div>
            <textarea
              id={outputId}
              readOnly
              value={output}
              rows={12}
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="URLs appear here after you paste source text."
            />
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        Parsing is heuristic: very long tokens, unusual schemes, or line-broken
        URLs may need manual fixes. Validate mission-critical links in the
        browser or with your monitoring stack.
      </p>
    </div>
  );
}
