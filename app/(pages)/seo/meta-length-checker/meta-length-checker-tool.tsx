"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  DESC_IDEAL_MAX,
  DESC_IDEAL_MIN,
  TITLE_IDEAL_MAX,
  TITLE_WARNING_MAX,
  bandLabel,
  descriptionBand,
  titleBand,
  type LengthBand,
} from "@/lib/meta-length-checker-core";

const MAX_HTML_BYTES = 2 * 1024 * 1024;

function bandStyles(band: LengthBand): string {
  switch (band) {
    case "empty":
      return "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300";
    case "short":
      return "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100";
    case "ideal":
      return "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100";
    case "long":
      return "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100";
    case "very-long":
      return "border-red-200 bg-red-50 text-red-950 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100";
    default:
      return "";
  }
}

function metaContentByName(doc: Document, name: string): string {
  const want = name.toLowerCase();
  for (const el of doc.querySelectorAll("meta")) {
    const n = el.getAttribute("name")?.toLowerCase();
    if (n === want) return el.getAttribute("content")?.trim() ?? "";
  }
  return "";
}

function metaContentByProperty(doc: Document, property: string): string {
  const want = property.toLowerCase();
  for (const el of doc.querySelectorAll("meta")) {
    const p = el.getAttribute("property")?.toLowerCase();
    if (p === want) return el.getAttribute("content")?.trim() ?? "";
  }
  return "";
}

function extractFromHtml(html: string): {
  title: string;
  description: string;
  notes: string[];
} {
  const notes: string[] = [];
  if (typeof DOMParser === "undefined") {
    return { title: "", description: "", notes: ["HTML parsing is not available in this environment."] };
  }

  const doc = new DOMParser().parseFromString(html, "text/html");
  const parserErr = doc.querySelector("parsererror");
  if (parserErr) {
    notes.push("The browser reported a parse warning; results may be partial.");
  }

  let title = doc.querySelector("title")?.textContent?.trim() ?? "";
  const ogTitle = metaContentByProperty(doc, "og:title");
  if (!title && ogTitle) {
    title = ogTitle;
    notes.push("Used og:title because <title> was empty.");
  } else if (title && ogTitle && title !== ogTitle) {
    notes.push("og:title differs from <title>; fields below use the document title.");
  }

  let description = metaContentByName(doc, "description");
  if (!description) {
    const ogDesc = metaContentByProperty(doc, "og:description");
    if (ogDesc) {
      description = ogDesc;
      notes.push("Used og:description because meta name=\"description\" was missing.");
    }
  }

  return { title, description, notes };
}

export function MetaLengthCheckerTool() {
  const uploadId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pageTitle, setPageTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [htmlPaste, setHtmlPaste] = useState("");
  const [htmlNotes, setHtmlNotes] = useState<string[]>([]);
  const [copyWhich, setCopyWhich] = useState<"title" | "description" | "both" | null>(null);

  useEffect(() => {
    if (!copyWhich) return;
    const t = window.setTimeout(() => setCopyWhich(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyWhich]);

  const titleLen = pageTitle.length;
  const descLen = metaDescription.length;
  const tBand = useMemo(() => titleBand(titleLen), [titleLen]);
  const dBand = useMemo(() => descriptionBand(descLen), [descLen]);

  async function copyText(value: string, id: "title" | "description" | "both") {
    if (!value.trim() && id !== "both") return;
    try {
      await navigator.clipboard.writeText(value);
      setCopyWhich(id);
    } catch {
      setCopyWhich(null);
    }
  }

  async function copyBoth() {
    const block = [`Title (${titleLen} chars)`, pageTitle, "", `Meta description (${descLen} chars)`, metaDescription].join("\n");
    try {
      await navigator.clipboard.writeText(block);
      setCopyWhich("both");
    } catch {
      setCopyWhich(null);
    }
  }

  const applyHtml = useCallback(() => {
    const { title, description, notes } = extractFromHtml(htmlPaste);
    setPageTitle(title);
    setMetaDescription(description);
    setHtmlNotes(notes);
  }, [htmlPaste]);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_HTML_BYTES) {
      setHtmlNotes([`File is larger than ${Math.round(MAX_HTML_BYTES / (1024 * 1024))} MB. Paste a smaller fragment instead.`]);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setHtmlPaste(text);
      const { title, description, notes } = extractFromHtml(text);
      setPageTitle(title);
      setMetaDescription(description);
      setHtmlNotes(notes);
    };
    reader.onerror = () => {
      setHtmlNotes(["Could not read that file."]);
    };
    reader.readAsText(file, "utf-8");
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div
        className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300"
        role="status"
      >
        <strong className="font-medium text-foreground">Privacy:</strong> title,
        description, and HTML are analyzed in your browser—nothing is uploaded to
        our servers.
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="meta-title-input"
              className="block text-sm font-medium text-foreground"
            >
              Page title ({`<title>`})
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                id="meta-title-input"
                type="text"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                autoComplete="off"
                className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
                placeholder="Example: Free meta title & description length checker"
              />
              <button
                type="button"
                onClick={() => copyText(pageTitle, "title")}
                disabled={!pageTitle.trim()}
                className="inline-flex shrink-0 items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                aria-label="Copy title"
              >
                {copyWhich === "title" ? (
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
                ) : (
                  <Copy className="size-4 shrink-0" aria-hidden />
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Planning guide: about {TITLE_IDEAL_MAX} characters or fewer for many SERP
              layouts; up to ~{TITLE_WARNING_MAX} may still show depending on pixels and
              query.
            </p>
            <div
              className={`mt-2 rounded-lg border px-3 py-2 text-sm ${bandStyles(tBand)}`}
              role="status"
            >
              <span className="font-medium tabular-nums">{titleLen}</span> characters —{" "}
              {bandLabel("title", tBand)}
            </div>
          </div>

          <div>
            <label
              htmlFor="meta-desc-input"
              className="block text-sm font-medium text-foreground"
            >
              Meta description
            </label>
            <div className="mt-1.5 flex gap-2">
              <textarea
                id="meta-desc-input"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={5}
                className="min-h-[120px] min-w-0 flex-1 resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
                placeholder="Summarize the page in one or two sentences with a clear benefit…"
              />
              <button
                type="button"
                onClick={() => copyText(metaDescription, "description")}
                disabled={!metaDescription.trim()}
                className="inline-flex h-fit shrink-0 items-start justify-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                aria-label="Copy meta description"
              >
                {copyWhich === "description" ? (
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
                ) : (
                  <Copy className="size-4 shrink-0" aria-hidden />
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Many teams aim for about {DESC_IDEAL_MIN}–{DESC_IDEAL_MAX} characters so the
              snippet can include a benefit line without excessive truncation on mobile.
            </p>
            <div
              className={`mt-2 rounded-lg border px-3 py-2 text-sm ${bandStyles(dBand)}`}
              role="status"
            >
              <span className="font-medium tabular-nums">{descLen}</span> characters —{" "}
              {bandLabel("description", dBand)}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setPageTitle("");
                setMetaDescription("");
                setHtmlPaste("");
                setHtmlNotes([]);
              }}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Clear fields
            </button>
            <button
              type="button"
              onClick={() => void copyBoth()}
              disabled={!pageTitle.trim() && !metaDescription.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              {copyWhich === "both" ? (
                <Check className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
              ) : (
                <Copy className="size-4 shrink-0" aria-hidden />
              )}
              Copy title + description
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground">
            Import from HTML (paste or upload)
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Paste saved markup from your template, a crawled page, or a static export. We
            read <code className="rounded bg-zinc-100 px-1 font-mono text-xs dark:bg-zinc-900">&lt;title&gt;</code>,{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-xs dark:bg-zinc-900">
              meta name=&quot;description&quot;
            </code>
            , and fall back to{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-xs dark:bg-zinc-900">
              og:title
            </code>{" "}
            /{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-xs dark:bg-zinc-900">
              og:description
            </code>{" "}
            when needed.
          </p>

          <textarea
            value={htmlPaste}
            onChange={(e) => setHtmlPaste(e.target.value)}
            spellCheck={false}
            rows={12}
            className="mt-3 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-xs leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            placeholder="<!DOCTYPE html>&#10;<html>…</html>"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={applyHtml}
              disabled={!htmlPaste.trim()}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Apply HTML to fields
            </button>
            <input
              ref={fileRef}
              id={uploadId}
              type="file"
              accept=".html,.htm,text/html,text/plain,.txt"
              className="sr-only"
              onChange={onFileChange}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <Upload className="size-4 shrink-0" aria-hidden />
              Upload HTML file
            </button>
          </div>

          {htmlNotes.length > 0 ? (
            <ul
              className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400"
              role="status"
            >
              {htmlNotes.map((n, i) => (
                <li key={`${i}-${n.slice(0, 24)}`}>{n}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
