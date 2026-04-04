"use client";

import { useEffect, useMemo, useState } from "react";
import { CopyIconButton } from "@/components/copy-icon-button";
import { markdownToHtml } from "@/lib/markdown-to-html-core";

const SAMPLE = `# Markdown → HTML sample

Intro paragraph with **bold**, *italic*, and a [link](https://example.com).

## Checklist

- [x] Headings and lists
- [ ] Ship to production

## Code

\`\`\`ts
export function greet(name: string) {
  return \`Hello, \${name}\`;
}
\`\`\`

| Column A | Column B |
| -------- | -------- |
| GFM      | Tables   |

> Blockquote for callouts.
`;

const PREVIEW_STYLES = `body{font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.6;padding:1rem;max-width:40rem;margin:0 auto;color:#18181b;background:#fff;}
@media (prefers-color-scheme:dark){body{color:#fafafa;background:#09090b;}}
h1{font-size:1.5rem;font-weight:600;margin:0 0 0.75rem;}
h2{font-size:1.25rem;font-weight:600;margin:1.25rem 0 0.5rem;}
p{margin:0.5rem 0;}
ul,ol{padding-left:1.25rem;margin:0.5rem 0;}
li{margin:0.25rem 0;}
pre{background:#f4f4f5;border-radius:0.375rem;padding:0.75rem;overflow:auto;font-size:0.8125rem;}
@media (prefers-color-scheme:dark){pre{background:#27272a;}}
code{font-family:ui-monospace,monospace;font-size:0.875em;}
pre code{font-size:0.8125rem;}
table{border-collapse:collapse;width:100%;margin:0.75rem 0;font-size:0.875rem;}
th,td{border:1px solid #d4d4d8;padding:0.375rem 0.5rem;text-align:left;}
@media (prefers-color-scheme:dark){th,td{border-color:#3f3f46;}}
blockquote{margin:0.75rem 0;padding-left:1rem;border-left:3px solid #a1a1aa;color:#52525b;}
@media (prefers-color-scheme:dark){blockquote{border-color:#71717a;color:#a1a1aa;}}
a{color:#2563eb;}
hr{border:none;border-top:1px solid #e4e4e7;margin:1rem 0;}
@media (prefers-color-scheme:dark){hr{border-top-color:#3f3f46;}}
img{max-width:100%;height:auto;}`;

function buildPreviewSrc(sanitizedBodyHtml: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${PREVIEW_STYLES}</style></head><body>${sanitizedBodyHtml}</body></html>`;
}

export function MarkdownToHtmlTool() {
  const [markdown, setMarkdown] = useState(SAMPLE);
  const [showPreview, setShowPreview] = useState(true);
  const [previewSrc, setPreviewSrc] = useState("");
  const [copyHint, setCopyHint] = useState<string | null>(null);

  const result = useMemo(() => markdownToHtml(markdown), [markdown]);

  useEffect(() => {
    if (!copyHint) return;
    const t = window.setTimeout(() => setCopyHint(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyHint]);

  useEffect(() => {
    let cancelled = false;
    if (!showPreview) {
      setPreviewSrc("");
      return;
    }
    if (!result.ok || !markdown.trim()) {
      setPreviewSrc("");
      return;
    }
    void import("dompurify").then(({ default: DOMPurify }) => {
      if (cancelled) return;
      const clean = DOMPurify.sanitize(result.html);
      setPreviewSrc(buildPreviewSrc(clean));
    });
    return () => {
      cancelled = true;
    };
  }, [markdown, result, showPreview]);

  async function copyToClipboard(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyHint("Copied to clipboard");
    } catch {
      setCopyHint("Copy blocked — select text manually");
    }
  }

  const htmlOut = result.ok ? result.html : "";
  const error = !result.ok ? result.error : null;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setMarkdown("")}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setMarkdown(SAMPLE)}
              className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Load sample
            </button>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <input
                type="checkbox"
                checked={showPreview}
                onChange={(e) => setShowPreview(e.target.checked)}
                className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600"
              />
              Live preview
            </label>
          </div>

          {error ? (
            <div
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
              role="alert"
            >
              <p className="font-medium">Could not convert Markdown</p>
              <p className="mt-1 font-mono text-xs break-all opacity-90">
                {error}
              </p>
            </div>
          ) : markdown.trim() ? (
            <p
              className="text-sm font-medium text-emerald-700 dark:text-emerald-400"
              role="status"
            >
              Markdown parsed — HTML is ready to copy.
            </p>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
              Paste Markdown or load the sample to generate HTML.
            </p>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label
                htmlFor="md-input"
                className="block text-sm font-medium text-foreground"
              >
                Markdown input
              </label>
              <textarea
                id="md-input"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                spellCheck={false}
                rows={16}
                className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
                placeholder="# Heading&#10;&#10;Write **Markdown** here…"
              />
            </div>
            <div>
              <label
                htmlFor="html-output"
                className="block text-sm font-medium text-foreground"
              >
                HTML output
              </label>
              <div className="relative mt-1.5">
                <textarea
                  id="html-output"
                  readOnly
                  value={htmlOut}
                  spellCheck={false}
                  rows={16}
                  className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none dark:border-zinc-800 dark:bg-zinc-900/60"
                  placeholder="HTML appears here…"
                />
                <CopyIconButton
                  placement="corner"
                  copied={copyHint === "Copied to clipboard"}
                  onClick={() => copyToClipboard(htmlOut)}
                  disabled={!htmlOut}
                  title="Copy HTML"
                  aria-label="Copy HTML output"
                />
              </div>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            Copy HTML is the raw parser output for your CMS or templates. The
            live preview is sanitized and shown in a sandboxed iframe (scripts
            do not run). Sanitize again before{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
              dangerouslySetInnerHTML
            </code>{" "}
            in production apps.
          </p>
        </div>
      </div>

      {showPreview && previewSrc ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Rendered preview
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            Sandboxed iframe with sanitized HTML — structure only, not your site
            stylesheet.
          </p>
          <iframe
            title="Markdown HTML preview"
            sandbox=""
            srcDoc={previewSrc}
            className="mt-4 h-[min(28rem,70vh)] w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800"
          />
        </div>
      ) : null}
    </div>
  );
}
