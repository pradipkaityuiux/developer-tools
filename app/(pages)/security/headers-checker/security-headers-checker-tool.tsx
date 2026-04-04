"use client";

import type { HeaderRow } from "@/lib/collect-http-response-headers";
import {
  analyzeSecurityHeaders,
  buildSecurityReportMarkdown,
  parseRawHeadersText,
  type SecurityHeadersAnalysis,
} from "@/lib/security-headers-checker-core";
import { Copy, Loader2, Shield, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";

type UrlAnalyzeResponse = {
  urlRequested: string;
  finalUrl: string;
  status: number;
  statusText: string;
  probeMethod: "HEAD" | "GET";
  headerCount: number;
  headers: HeaderRow[];
  analysis: SecurityHeadersAnalysis;
  error?: string;
};

function badgeClass(status: string): string {
  switch (status) {
    case "pass":
      return "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200";
    case "warn":
      return "bg-amber-100 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100";
    case "fail":
      return "bg-red-100 text-red-950 dark:bg-red-950/40 dark:text-red-100";
    default:
      return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-200";
  }
}

function gradeClass(grade: string): string {
  if (grade === "A" || grade === "B")
    return "text-emerald-600 dark:text-emerald-400";
  if (grade === "C") return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export function SecurityHeadersCheckerTool() {
  const [mode, setMode] = useState<"url" | "paste">("url");
  const [url, setUrl] = useState("");
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [result, setResult] = useState<{
    kind: "url" | "paste";
    finalUrl: string;
    status: number;
    statusText?: string;
    headers: HeaderRow[];
    analysis: SecurityHeadersAnalysis;
  } | null>(null);

  const reportMarkdown = useMemo(() => {
    if (!result) return "";
    return buildSecurityReportMarkdown({
      finalUrl: result.finalUrl,
      status: result.status,
      statusText: result.statusText,
      analysis: result.analysis,
      headers: result.headers,
    });
  }, [result]);

  async function copyReport() {
    if (!reportMarkdown) return;
    try {
      await navigator.clipboard.writeText(reportMarkdown);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setError("Could not copy — try selecting the report manually.");
    }
  }

  async function onSubmitUrl(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter a URL to analyze.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/security/headers-checker/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data: UrlAnalyzeResponse = await res.json();
      if (!res.ok) {
        setError(data.error ?? `Request failed (${res.status}).`);
        return;
      }
      setResult({
        kind: "url",
        finalUrl: data.finalUrl,
        status: data.status,
        statusText: data.statusText,
        headers: data.headers,
        analysis: data.analysis,
      });
    } catch {
      setError("Network error — try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  function onAnalyzePaste(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const parsed = parseRawHeadersText(rawText);
    if (parsed.error) {
      setError(parsed.error);
      return;
    }
    const analysis = analyzeSecurityHeaders({
      headers: parsed.headers,
      finalUrl: "https://pasted-headers.local/",
      status: 200,
      mode: "paste",
    });
    setResult({
      kind: "paste",
      finalUrl: "https://pasted-headers.local/ (paste mode)",
      status: 200,
      headers: parsed.headers,
      analysis,
    });
  }

  function onPickFile() {
    fileRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setRawText(text);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Analysis mode"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "url"}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "url"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
            onClick={() => {
              setMode("url");
              setError(null);
            }}
          >
            Live URL
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "paste"}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "paste"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
            onClick={() => {
              setMode("paste");
              setError(null);
            }}
          >
            Paste or upload
          </button>
        </div>

        {mode === "url" ? (
          <form
            onSubmit={onSubmitUrl}
            className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div className="min-w-0 flex-1">
              <label
                htmlFor="sec-header-url"
                className="block text-sm font-medium text-foreground"
              >
                Public URL
              </label>
              <input
                id="sec-header-url"
                type="url"
                name="url"
                inputMode="url"
                placeholder="https://example.com"
                autoComplete="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Scanning…
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" aria-hidden />
                  Analyze headers
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={onAnalyzePaste} className="mt-4 space-y-3">
            <input
              ref={fileRef}
              type="file"
              accept=".txt,text/plain"
              className="sr-only"
              aria-hidden
              onChange={onFileChange}
            />
            <div className="flex flex-wrap items-center gap-2">
              <label
                htmlFor="sec-header-raw"
                className="text-sm font-medium text-foreground"
              >
                Raw response headers
              </label>
              <button
                type="button"
                onClick={onPickFile}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Upload className="h-3.5 w-3.5" aria-hidden />
                Upload .txt
              </button>
            </div>
            <textarea
              id="sec-header-raw"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={10}
              placeholder={
                "Strict-Transport-Security: max-age=31536000\n" +
                "Content-Security-Policy: default-src 'self'\n" +
                "X-Content-Type-Options: nosniff"
              }
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-xs text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Shield className="h-4 w-4" aria-hidden />
              Analyze pasted headers
            </button>
          </form>
        )}

        {error ? (
          <p
            className="mt-4 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>

      {result ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {result.kind === "url" ? "Final URL" : "Source"}
              </p>
              <p className="mt-0.5 break-all font-mono text-sm text-foreground">
                {result.finalUrl}
              </p>
              {result.kind === "url" ? (
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  HTTP {result.status}
                  {result.statusText ? ` ${result.statusText}` : ""}
                </p>
              ) : null}
            </div>
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Score
              </p>
              <p
                className={`text-3xl font-semibold tabular-nums ${gradeClass(result.analysis.grade)}`}
              >
                {result.analysis.score}
                <span className="text-lg text-zinc-500 dark:text-zinc-400">
                  /100
                </span>
              </p>
              <p className="text-sm font-medium text-foreground">
                Grade {result.analysis.grade}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {result.analysis.summary}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyReport}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <Copy className="h-4 w-4" aria-hidden />
              {copyDone ? "Copied" : "Copy report"}
            </button>
          </div>

          <ul className="mt-6 space-y-3">
            {result.analysis.checks.map((c) => (
              <li
                key={c.id}
                className="rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-foreground">{c.title}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-xs font-medium uppercase ${badgeClass(c.status)}`}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {c.message}
                </p>
              </li>
            ))}
          </ul>

          <details className="mt-8">
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              Raw headers ({result.headers.length})
            </summary>
            <div className="mt-3 max-h-64 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
              {result.headers.map((h, i) => (
                <div key={`${h.name}-${i}`} className="break-all py-0.5">
                  <span className="text-zinc-800 dark:text-zinc-200">{h.name}</span>
                  <span className="text-zinc-500">: </span>
                  <span className="text-zinc-700 dark:text-zinc-300">{h.value}</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      ) : null}
    </div>
  );
}
