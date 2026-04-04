"use client";

import { useCallback, useMemo, useState } from "react";
import { CopyIconButton } from "@/components/copy-icon-button";

/** Empty value on these attributes is emitted without ="", per common HTML style. */
const BOOLEAN_LIKE_ATTRS = new Set([
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "inert",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected",
]);

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const RAW_INNER_HTML_TAGS = new Set(["style", "pre"]);
const RAW_TEXT_TAGS = new Set(["script", "textarea"]);

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatOpenTag(el: Element): string {
  const tag = el.tagName.toLowerCase();
  let s = `<${tag}`;
  for (const name of el.getAttributeNames()) {
    const val = el.getAttribute(name);
    if (val === null) continue;
    const lower = name.toLowerCase();
    if (val === "" && BOOLEAN_LIKE_ATTRS.has(lower)) {
      s += ` ${name}`;
    } else {
      s += ` ${name}="${escapeAttr(val)}"`;
    }
  }
  return s;
}

function isFullDocumentHtml(source: string): boolean {
  const t = source.trimStart();
  return /^<!doctype/i.test(t) || /^<html[\s>]/i.test(t);
}

function prettyPrintNode(node: Node, depth: number, indent: string): string {
  const pad = indent.repeat(depth);

  if (node.nodeType === Node.TEXT_NODE) {
    const raw = node.textContent ?? "";
    const t = raw.replace(/\s+/g, " ").trim();
    if (!t) return "";
    return `${pad}${t}\n`;
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    const data = (node as Comment).data;
    return `${pad}<!--${data}-->\n`;
  }

  if (node.nodeType === Node.DOCUMENT_TYPE_NODE) {
    const dt = node as DocumentType;
    const pub = dt.publicId ? ` PUBLIC "${dt.publicId}"` : "";
    const sys = dt.systemId ? ` "${dt.systemId}"` : "";
    return `<!DOCTYPE ${dt.name}${pub}${sys}>\n`;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const el = node as Element;
  const tag = el.tagName.toLowerCase();

  if (RAW_TEXT_TAGS.has(tag)) {
    const inner = el.textContent ?? "";
    return `${pad}${formatOpenTag(el)}>${inner}</${tag}>\n`;
  }

  if (RAW_INNER_HTML_TAGS.has(tag)) {
    const inner = el.innerHTML;
    return `${pad}${formatOpenTag(el)}>${inner}</${tag}>\n`;
  }

  const open = `${formatOpenTag(el)}>`;
  if (VOID_TAGS.has(tag)) {
    return `${pad}${open}\n`;
  }

  let body = "";
  for (const child of el.childNodes) {
    body += prettyPrintNode(child, depth + 1, indent);
  }

  if (!body.trim()) {
    return `${pad}${open}</${tag}>\n`;
  }

  return `${pad}${open}\n${body}${pad}</${tag}>\n`;
}

function minifyNode(node: Node, preserveSpace: boolean): string {
  if (node.nodeType === Node.TEXT_NODE) {
    let t = node.textContent ?? "";
    if (!preserveSpace) {
      t = t.replace(/\s+/g, " ").trim();
    }
    return t;
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    return "";
  }

  if (node.nodeType === Node.DOCUMENT_TYPE_NODE) {
    const dt = node as DocumentType;
    const pub = dt.publicId ? ` PUBLIC "${dt.publicId}"` : "";
    const sys = dt.systemId ? ` "${dt.systemId}"` : "";
    return `<!DOCTYPE ${dt.name}${pub}${sys}>`;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  const preserve =
    preserveSpace ||
    tag === "pre" ||
    tag === "script" ||
    tag === "style" ||
    tag === "textarea";

  if (RAW_TEXT_TAGS.has(tag)) {
    const inner = el.textContent ?? "";
    return `${formatOpenTag(el)}>${inner}</${tag}>`;
  }

  if (RAW_INNER_HTML_TAGS.has(tag)) {
    const inner = el.innerHTML;
    return `${formatOpenTag(el)}>${inner}</${tag}>`;
  }

  const open = `${formatOpenTag(el)}>`;
  if (VOID_TAGS.has(tag)) {
    return open;
  }

  let inner = "";
  for (const child of el.childNodes) {
    inner += minifyNode(child, preserve);
  }
  return `${open}${inner}</${tag}>`;
}

function serializeDocument(doc: Document, source: string, mode: "pretty" | "minify", indent: string): string {
  const full = isFullDocumentHtml(source);
  if (mode === "pretty") {
    if (full) {
      let out = "";
      if (doc.doctype) {
        out += prettyPrintNode(doc.doctype, 0, indent);
      }
      out += prettyPrintNode(doc.documentElement, 0, indent);
      return out.replace(/\n+$/, "") + "\n";
    }
    let out = "";
    for (const child of doc.body.childNodes) {
      out += prettyPrintNode(child, 0, indent);
    }
    return out.replace(/\n+$/, "") + "\n";
  }

  if (full) {
    let out = "";
    if (doc.doctype) {
      out += minifyNode(doc.doctype, true);
    }
    out += minifyNode(doc.documentElement, false);
    return out;
  }
  let out = "";
  for (const child of doc.body.childNodes) {
    out += minifyNode(child, false);
  }
  return out;
}

function transformHtml(source: string, mode: "pretty" | "minify", indent: string): { ok: true; out: string } | { ok: false; error: string } {
  const trimmed = source.trim();
  if (!trimmed) {
    return { ok: false, error: "Paste some HTML to format or minify." };
  }

  const doc = new DOMParser().parseFromString(source, "text/html");

  try {
    const out = serializeDocument(doc, source, mode, indent);
    return { ok: true, out };
  } catch {
    return { ok: false, error: "Could not serialize this document. Check for unusual nodes or deeply nested markup." };
  }
}

const SAMPLE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Sample</title>
<style>body{font-family:system-ui;margin:2rem}</style>
</head>
<body>
<main>
<h1>Hello</h1>
<p>This is a <strong>small</strong> sample for the formatter.</p>
<ul>
<li>One</li>
<li>Two</li>
</ul>
</main>
</body>
</html>`;

export function HtmlFormatterTool() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState("  ");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const previewSrc = useMemo(() => output || input, [output, input]);

  const run = useCallback(
    (mode: "pretty" | "minify") => {
      setCopied(false);
      setError(null);
      const result = transformHtml(input, mode, indent);
      if (!result.ok) {
        setError(result.error);
        setOutput("");
        return;
      }
      setOutput(result.out);
    },
    [input, indent],
  );

  async function copyOutput() {
    const text = output.trim() ? output : input;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Clipboard access was blocked. Select the output and copy manually.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => run("pretty")}
              className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Beautify
            </button>
            <button
              type="button"
              onClick={() => run("minify")}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Minify
            </button>
            <CopyIconButton
              placement="inline"
              copied={copied}
              onClick={copyOutput}
              disabled={!input.trim() && !output.trim()}
              title={copied ? "Copied" : "Copy output"}
              aria-label={copied ? "Copied to clipboard" : "Copy output"}
              className="rounded-lg p-2.5"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="shrink-0">Indent</span>
              <select
                value={indent}
                onChange={(e) => setIndent(e.target.value)}
                className="rounded-lg border border-zinc-300 bg-white px-2 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
              >
                <option value="  ">2 spaces</option>
                <option value="    ">4 spaces</option>
                <option value="\t">Tab</option>
              </select>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <input
                type="checkbox"
                checked={showPreview}
                onChange={(e) => setShowPreview(e.target.checked)}
                className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600"
              />
              Show preview
            </label>
          </div>
        </div>

        {error ? (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div>
            <label
              htmlFor="html-input"
              className="block text-sm font-medium text-foreground"
            >
              Input HTML
            </label>
            <textarea
              id="html-input"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              spellCheck={false}
              rows={14}
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder="Paste HTML here…"
            />
          </div>
          <div>
            <label
              htmlFor="html-output"
              className="block text-sm font-medium text-foreground"
            >
              Output {output ? "" : "(run Beautify or Minify)"}
            </label>
            <div className="relative mt-1.5">
              <textarea
                id="html-output"
                readOnly
                value={output}
                spellCheck={false}
                rows={14}
                className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none dark:border-zinc-800 dark:bg-zinc-900/60"
                placeholder="Result appears here…"
              />
              <CopyIconButton
                placement="corner"
                copied={copied}
                onClick={copyOutput}
                disabled={!input.trim() && !output.trim()}
                title={copied ? "Copied" : "Copy output"}
                aria-label={copied ? "Copied to clipboard" : "Copy output"}
              />
            </div>
          </div>
        </div>
      </div>

      {showPreview ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Rendered preview
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            Sandboxed iframe: scripts do not run. Compare structure and inline
            styles with your markup above.
          </p>
          <iframe
            title="HTML preview"
            sandbox=""
            srcDoc={previewSrc}
            className="mt-4 h-[min(28rem,70vh)] w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800"
          />
        </div>
      ) : null}
    </div>
  );
}
