"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  type Changefreq,
  buildSitemapXml,
  parseUrlList,
} from "@/lib/sitemap-generator-core";

const MAX_IMPORT_BYTES = 512 * 1024;

const CHANGEFREQ_OPTIONS: { value: Changefreq; label: string }[] = [
  { value: "", label: "Omit (optional)" },
  { value: "always", label: "always" },
  { value: "hourly", label: "hourly" },
  { value: "daily", label: "daily" },
  { value: "weekly", label: "weekly" },
  { value: "monthly", label: "monthly" },
  { value: "yearly", label: "yearly" },
  { value: "never", label: "never" },
];

function todayIsoDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function SitemapGeneratorTool() {
  const uploadId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [urlInput, setUrlInput] = useState("");
  const [baseOrigin, setBaseOrigin] = useState("");
  const [includeLastmod, setIncludeLastmod] = useState(false);
  const [lastmodDate, setLastmodDate] = useState(todayIsoDate);
  const [changefreq, setChangefreq] = useState<Changefreq>("");
  const [priority, setPriority] = useState("");
  const [copyOk, setCopyOk] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    if (!copyOk) return;
    const t = window.setTimeout(() => setCopyOk(false), 2000);
    return () => window.clearTimeout(t);
  }, [copyOk]);

  useEffect(() => {
    if (!hint) return;
    const t = window.setTimeout(() => setHint(null), 4000);
    return () => window.clearTimeout(t);
  }, [hint]);

  const { urls, errors } = useMemo(
    () => parseUrlList(urlInput, baseOrigin.trim() || undefined),
    [urlInput, baseOrigin],
  );

  const xml = useMemo(() => {
    if (urls.length === 0) {
      return "";
    }
    return buildSitemapXml(urls, {
      lastmod: includeLastmod ? lastmodDate : null,
      changefreq,
      priority: priority.trim(),
    });
  }, [urls, includeLastmod, lastmodDate, changefreq, priority]);

  async function copyXml() {
    if (!xml) {
      setHint("Add at least one valid URL first.");
      return;
    }
    try {
      await navigator.clipboard.writeText(xml);
      setCopyOk(true);
    } catch {
      setHint("Clipboard blocked — select the XML and copy manually.");
    }
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_IMPORT_BYTES) {
      setHint("File too large — paste URLs instead.");
      return;
    }
    try {
      const text = await file.text();
      setUrlInput(text);
      setHint(`Loaded ${file.name}`);
    } catch {
      setHint("Could not read file.");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="sitemap-base-origin"
              className="text-sm font-medium text-foreground"
            >
              Site origin (optional)
            </label>
            <input
              id="sitemap-base-origin"
              type="url"
              inputMode="url"
              autoComplete="off"
              placeholder="https://example.com"
              value={baseOrigin}
              onChange={(e) => setBaseOrigin(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:border-zinc-500"
            />
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Use when lines are paths like <code className="font-mono">/blog/post</code>{" "}
              instead of full URLs.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">
              Import URL list
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileRef}
                id={uploadId}
                type="file"
                accept=".txt,text/plain"
                className="sr-only"
                onChange={onFileChange}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Upload className="size-4 shrink-0" aria-hidden />
                Upload .txt
              </button>
              {hint ? (
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  {hint}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="sitemap-urls"
            className="text-sm font-medium text-foreground"
          >
            URLs (one per line)
          </label>
          <textarea
            id="sitemap-urls"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            rows={10}
            spellCheck={false}
            placeholder={
              "https://example.com/\nhttps://example.com/about\n/pricing"
            }
            className="min-h-[200px] rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:border-zinc-500"
          />
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Valid lines: absolute <code className="font-mono">http(s)://…</code>{" "}
            or paths starting with <code className="font-mono">/</code> when a site
            origin is set. Duplicates are removed.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">lastmod</span>
            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={includeLastmod}
                onChange={(e) => setIncludeLastmod(e.target.checked)}
                className="rounded border-zinc-400"
              />
              Include (same date for all URLs)
            </label>
            {includeLastmod ? (
              <input
                type="date"
                value={lastmodDate}
                onChange={(e) => setLastmodDate(e.target.value)}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-600 dark:bg-zinc-900"
              />
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="sitemap-changefreq"
              className="text-sm font-medium text-foreground"
            >
              changefreq
            </label>
            <select
              id="sitemap-changefreq"
              value={changefreq}
              onChange={(e) => setChangefreq(e.target.value as Changefreq)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-600 dark:bg-zinc-900"
            >
              {CHANGEFREQ_OPTIONS.map((o) => (
                <option key={o.value || "omit"} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="sitemap-priority"
              className="text-sm font-medium text-foreground"
            >
              priority (optional)
            </label>
            <input
              id="sitemap-priority"
              type="text"
              inputMode="decimal"
              placeholder="0.0 – 1.0, empty = omit"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:border-zinc-500"
            />
          </div>

          <div className="flex flex-col justify-end gap-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-medium text-foreground">{urls.length}</span>{" "}
              unique URL{urls.length === 1 ? "" : "s"}
              {errors.length > 0 ? (
                <>
                  {" "}
                  ·{" "}
                  <span className="text-amber-700 dark:text-amber-400">
                    {errors.length} line{errors.length === 1 ? "" : "s"} skipped
                  </span>
                </>
              ) : null}
            </p>
          </div>
        </div>

        {errors.length > 0 ? (
          <div
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"
            role="status"
          >
            <p className="font-medium">Skipped lines</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {errors.slice(0, 12).map((e, i) => (
                <li key={i}>
                  <code className="rounded bg-amber-100/80 px-1 font-mono text-xs dark:bg-amber-900/50">
                    {e.line.length > 80 ? `${e.line.slice(0, 80)}…` : e.line}
                  </code>
                  {" — "}
                  {e.reason}
                </li>
              ))}
            </ul>
            {errors.length > 12 ? (
              <p className="mt-2 text-xs">…and {errors.length - 12} more.</p>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="sitemap-xml-out"
              className="text-sm font-medium text-foreground"
            >
              Generated sitemap XML
            </label>
            <button
              type="button"
              onClick={() => void copyXml()}
              disabled={!xml}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-foreground hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              {copyOk ? (
                <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="size-4 shrink-0" aria-hidden />
              )}
              {copyOk ? "Copied" : "Copy XML"}
            </button>
          </div>
          <textarea
            id="sitemap-xml-out"
            readOnly
            value={xml}
            placeholder={
              urls.length === 0
                ? "Valid URLs will appear here as sitemaps.org XML."
                : undefined
            }
            rows={14}
            spellCheck={false}
            className="min-h-[220px] rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-xs text-foreground focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-600 dark:bg-zinc-900/80 dark:focus:border-zinc-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
}
