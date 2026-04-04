"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CopyIconButton } from "@/components/copy-icon-button";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const SAMPLE = `<article>
  <h1>API changelog</h1>
  <p>Version <strong>2.4</strong> is now <em>stable</em>. Highlights:</p>
  <ul>
    <li>OAuth2 <a href="/docs/auth">token refresh</a> improvements</li>
    <li>Deprecation of the legacy XML endpoint</li>
  </ul>
  <h2>Example request</h2>
  <pre><code class="language-json">{
  "page": 1,
  "limit": 25
}</code></pre>
  <table>
    <thead>
      <tr><th>Header</th><th>Value</th></tr>
    </thead>
    <tbody>
      <tr><td><code>Authorization</code></td><td>Bearer …</td></tr>
    </tbody>
  </table>
  <blockquote><p>Breaking changes are listed on the migration page.</p></blockquote>
</article>`;

type HeadingStyle = "atx" | "setext";
type BulletMarker = "-" | "+" | "*";
type CodeBlockStyle = "fenced" | "indented";

function buildTurndown(options: {
  headingStyle: HeadingStyle;
  bulletListMarker: BulletMarker;
  codeBlockStyle: CodeBlockStyle;
}): TurndownService {
  const service = new TurndownService({
    headingStyle: options.headingStyle,
    bulletListMarker: options.bulletListMarker,
    codeBlockStyle: options.codeBlockStyle,
    emDelimiter: "_",
    strongDelimiter: "**",
    linkStyle: "inlined",
  });
  service.use(gfm);
  return service;
}

export function HtmlToMarkdownTool() {
  const [html, setHtml] = useState(SAMPLE);
  const [markdown, setMarkdown] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const [headingStyle, setHeadingStyle] = useState<HeadingStyle>("atx");
  const [bulletListMarker, setBulletListMarker] = useState<BulletMarker>("-");
  const [codeBlockStyle, setCodeBlockStyle] =
    useState<CodeBlockStyle>("fenced");

  const service = useMemo(
    () =>
      buildTurndown({
        headingStyle,
        bulletListMarker,
        codeBlockStyle,
      }),
    [headingStyle, bulletListMarker, codeBlockStyle],
  );

  useEffect(() => {
    try {
      const initial = buildTurndown({
        headingStyle: "atx",
        bulletListMarker: "-",
        codeBlockStyle: "fenced",
      });
      const out = initial.turndown(SAMPLE);
      setMarkdown(out.trimEnd() + (out.length ? "\n" : ""));
    } catch {
      setMarkdown("");
    }
  }, []);

  const convert = useCallback(() => {
    setError(null);
    try {
      const out = service.turndown(html.trim() ? html : "");
      setMarkdown(out.trimEnd() + (out.length ? "\n" : ""));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Conversion failed";
      setError(msg);
      setMarkdown("");
    }
  }, [html, service]);

  useEffect(() => {
    if (!copyHint) return;
    const t = window.setTimeout(() => setCopyHint(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyHint]);

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopyHint("Markdown copied");
    } catch {
      setCopyHint("Copy blocked — select text manually");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label
              htmlFor="html-to-md-input"
              className="block text-sm font-medium text-foreground"
            >
              HTML input
            </label>
            <textarea
              id="html-to-md-input"
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              spellCheck={false}
              rows={14}
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder="<h1>Title</h1><p>Paragraph with <a href='#'>link</a>.</p>"
            />
          </div>
          <div>
            <label
              htmlFor="html-to-md-output"
              className="block text-sm font-medium text-foreground"
            >
              Markdown output
            </label>
            <div className="relative mt-1.5">
              <textarea
                id="html-to-md-output"
                value={markdown}
                readOnly
                spellCheck={false}
                rows={14}
                className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none dark:border-zinc-800 dark:bg-zinc-900/80"
                placeholder="Click Convert to generate Markdown…"
              />
              <CopyIconButton
                placement="corner"
                copied={copyHint === "Markdown copied"}
                onClick={copyOutput}
                disabled={!markdown}
                title="Copy Markdown"
                aria-label="Copy Markdown output"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <fieldset className="min-w-0 flex-1">
            <legend className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Options
            </legend>
            <div className="mt-2 flex flex-wrap gap-3">
              <label className="flex items-center gap-1.5 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="sr-only">Heading style</span>
                <span className="text-zinc-500 dark:text-zinc-400">Headings</span>
                <select
                  value={headingStyle}
                  onChange={(e) =>
                    setHeadingStyle(e.target.value as HeadingStyle)
                  }
                  className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                >
                  <option value="atx">ATX (# …)</option>
                  <option value="setext">Setext (underline)</option>
                </select>
              </label>
              <label className="flex items-center gap-1.5 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="text-zinc-500 dark:text-zinc-400">Bullets</span>
                <select
                  value={bulletListMarker}
                  onChange={(e) =>
                    setBulletListMarker(e.target.value as BulletMarker)
                  }
                  className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                >
                  <option value="-">-</option>
                  <option value="+">+</option>
                  <option value="*">*</option>
                </select>
              </label>
              <label className="flex items-center gap-1.5 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="text-zinc-500 dark:text-zinc-400">Code</span>
                <select
                  value={codeBlockStyle}
                  onChange={(e) =>
                    setCodeBlockStyle(e.target.value as CodeBlockStyle)
                  }
                  className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                >
                  <option value="fenced">Fenced code blocks</option>
                  <option value="indented">Indented</option>
                </select>
              </label>
            </div>
          </fieldset>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={convert}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Convert to Markdown
          </button>
          <button
            type="button"
            onClick={() => {
              setHtml("");
              setMarkdown("");
              setError(null);
            }}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={() => {
              setHtml(SAMPLE);
              setError(null);
              try {
                const out = service.turndown(SAMPLE);
                setMarkdown(out.trimEnd() + (out.length ? "\n" : ""));
              } catch (e) {
                const msg = e instanceof Error ? e.message : "Conversion failed";
                setError(msg);
                setMarkdown("");
              }
            }}
            className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Load sample
          </button>
        </div>

        {error ? (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            <p className="font-medium">Could not convert HTML</p>
            <p className="mt-1 font-mono text-xs break-all opacity-90">{error}</p>
          </div>
        ) : null}

        {copyHint ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{copyHint}</p>
        ) : null}

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Uses{" "}
          <a
            href="https://github.com/mixmark-io/turndown"
            className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            Turndown
          </a>{" "}
          with GFM (tables, strikethrough, task lists). Arbitrary layout and
          inline styles may flatten to plain text—review before publishing.
        </p>
      </div>
    </div>
  );
}
