"use client";

import {
  redirectTypeLabel,
  responseKind,
  isRedirectStatus,
} from "@/lib/redirect-type-checker-core";
import { Check, Copy, Upload } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type Hop = {
  url: string;
  status: number;
  location: string | null;
  statusText?: string;
  durationMs: number;
};

type RedirectCheckResult = {
  inputUrl: string;
  hops: Hop[];
  hopCount: number;
  redirectCount: number;
  finalUrl: string;
  finalStatus: number;
  error: string | null;
  totalDurationMs: number;
};

const MAX_LIST_LINES = 8;
const MAX_LIST_FILE_BYTES = 96 * 1024;

function buildTextReport(r: RedirectCheckResult): string {
  const lines: string[] = [];
  lines.push(`URL: ${r.inputUrl}`);
  lines.push(
    `Final response: ${r.finalStatus} → ${r.finalUrl}`,
  );
  lines.push(
    `Redirect responses: ${r.redirectCount} · Hops: ${r.hopCount} · Total time (headers): ${r.totalDurationMs} ms`,
  );
  if (r.error) {
    lines.push(`Note: ${r.error}`);
  }
  lines.push("");
  r.hops.forEach((h, i) => {
    const type = isRedirectStatus(h.status)
      ? redirectTypeLabel(h.status) || responseKind(h.status)
      : responseKind(h.status);
    lines.push(
      `${i + 1}. ${h.status} ${type} — ${h.durationMs} ms`,
    );
    lines.push(`   ${h.url}`);
    if (h.location) {
      lines.push(`   Location: ${h.location}`);
    }
  });
  return lines.join("\n");
}

function buildBatchReport(
  results: RedirectCheckResult[],
  lineErrors: { index: number; message: string }[],
): string {
  const blocks = results.map((r) => buildTextReport(r));
  if (lineErrors.length) {
    const errLines = lineErrors.map(
      (e) => `Line ${e.index + 1}: ${e.message}`,
    );
    blocks.push("---", "Errors:", ...errLines);
  }
  return blocks.join("\n\n---\n\n");
}

export function RedirectCheckerTool() {
  const uploadId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"single" | "list">("single");
  const [url, setUrl] = useState("");
  const [listText, setListText] = useState("");
  const [listNote, setListNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [singleResult, setSingleResult] = useState<RedirectCheckResult | null>(
    null,
  );
  const [batchResults, setBatchResults] = useState<RedirectCheckResult[]>([]);
  const [batchErrors, setBatchErrors] = useState<
    { index: number; message: string }[]
  >([]);
  const [expandedBatch, setExpandedBatch] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  async function runSingle(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSingleResult(null);
    setBatchResults([]);
    setBatchErrors([]);
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter a URL to check.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/seo/redirect-checker/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = (await res.json()) as Record<string, unknown>;
      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : `Request failed (${res.status}).`,
        );
        return;
      }
      if (!Array.isArray(data.hops)) {
        setError("Unexpected response from server.");
        return;
      }
      setSingleResult(data as unknown as RedirectCheckResult);
    } catch {
      setError("Network error — try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  async function runList(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSingleResult(null);
    setBatchResults([]);
    setBatchErrors([]);
    setExpandedBatch(null);
    const lines = listText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, MAX_LIST_LINES);
    if (lines.length === 0) {
      setError("Add at least one URL (one per line).");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/seo/redirect-checker/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: lines }),
      });
      const data = (await res.json()) as {
        mode?: string;
        results?: RedirectCheckResult[];
        errors?: { index: number; message: string }[];
        error?: string;
      };
      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : `Request failed (${res.status}).`,
        );
        return;
      }
      setBatchResults(data.results ?? []);
      setBatchErrors(data.errors ?? []);
    } catch {
      setError("Network error — try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  function onListFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_LIST_FILE_BYTES) {
      setListNote(
        `File is larger than ${Math.round(MAX_LIST_FILE_BYTES / 1024)} KB. Split into smaller lists.`,
      );
      return;
    }
    setListNote(null);
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setListText(text);
    };
    reader.onerror = () => {
      setListNote("Could not read that file.");
    };
    reader.readAsText(file, "utf-8");
  }

  async function copyReport() {
    let text = "";
    if (singleResult) {
      text = buildTextReport(singleResult);
    } else if (batchResults.length || batchErrors.length) {
      text = buildBatchReport(batchResults, batchErrors);
    }
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const hasReport =
    singleResult !== null || batchResults.length > 0 || batchErrors.length > 0;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div
        className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300"
        role="status"
      >
        <strong className="font-medium text-foreground">How it works:</strong>{" "}
        our server requests your public HTTP(S) URLs (with SSRF protections) and
        records each redirect status,{" "}
        <code className="rounded bg-zinc-100 px-1 font-mono text-xs dark:bg-zinc-900">
          Location
        </code>{" "}
        target, and time to headers. We do not use your URLs for marketing lists.
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("single");
            setError(null);
          }}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            mode === "single"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "border border-zinc-300 bg-white text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          }`}
        >
          Single URL
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("list");
            setError(null);
          }}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            mode === "list"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "border border-zinc-300 bg-white text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          }`}
        >
          Migration list (max {MAX_LIST_LINES})
        </button>
      </div>

      {mode === "single" ? (
        <form
          onSubmit={runSingle}
          className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="min-w-0 flex-1">
            <label
              htmlFor="redirect-check-url"
              className="block text-sm font-medium text-foreground"
            >
              URL to check
            </label>
            <input
              id="redirect-check-url"
              type="url"
              name="url"
              inputMode="url"
              placeholder="https://example.com/old-path"
              autoComplete="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? "Checking…" : "Check redirect type"}
          </button>
        </form>
      ) : (
        <form onSubmit={runList} className="mt-5 space-y-3">
          <div>
            <label
              htmlFor="redirect-check-list"
              className="block text-sm font-medium text-foreground"
            >
              One URL per line
            </label>
            <textarea
              id="redirect-check-list"
              value={listText}
              onChange={(e) => setListText(e.target.value)}
              spellCheck={false}
              rows={6}
              placeholder={
                "https://example.com/a\nhttps://example.com/b"
              }
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <input
                ref={fileRef}
                id={uploadId}
                type="file"
                accept=".txt,text/plain"
                className="sr-only"
                onChange={onListFileChange}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Upload className="size-4 shrink-0" aria-hidden />
                Upload .txt
              </button>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                First {MAX_LIST_LINES} non-empty lines are analyzed.
              </span>
            </div>
            {listNote ? (
              <p className="mt-2 text-sm text-amber-800 dark:text-amber-300" role="status">
                {listNote}
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? "Checking…" : "Analyze list"}
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

      {hasReport ? (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void copyReport()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            {copied ? (
              <Check className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
            ) : (
              <Copy className="size-4 shrink-0" aria-hidden />
            )}
            Copy report
          </button>
        </div>
      ) : null}

      {singleResult ? (
        <ResultDetails result={singleResult} />
      ) : null}

      {batchResults.length > 0 || batchErrors.length > 0 ? (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium text-foreground">
            Batch summary
          </h3>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
                <tr>
                  <th className="px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">URL</th>
                  <th className="px-3 py-2 font-medium">Redirects</th>
                  <th className="px-3 py-2 font-medium">Final</th>
                  <th className="px-3 py-2 font-medium">Total ms</th>
                  <th className="px-3 py-2 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {batchResults.map((r, i) => {
                  const firstRedirect = r.hops.find((h) =>
                    isRedirectStatus(h.status),
                  );
                  return (
                    <tr key={`${r.inputUrl}-${i}`} className="bg-white dark:bg-zinc-950">
                      <td className="px-3 py-2 tabular-nums text-zinc-500">
                        {i + 1}
                      </td>
                      <td className="max-w-[14rem] truncate px-3 py-2 font-mono text-xs">
                        {r.inputUrl}
                      </td>
                      <td className="px-3 py-2 tabular-nums">
                        {r.redirectCount}
                        {firstRedirect ? (
                          <span className="ml-1 text-xs text-zinc-500">
                            (first {firstRedirect.status})
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-2 tabular-nums">{r.finalStatus}</td>
                      <td className="px-3 py-2 tabular-nums">
                        {r.totalDurationMs}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedBatch(expandedBatch === i ? null : i)
                          }
                          className="text-xs font-medium text-foreground underline decoration-zinc-400 underline-offset-2"
                        >
                          {expandedBatch === i ? "Hide" : "Details"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {batchErrors.map((be) => (
            <p
              key={`err-${be.index}`}
              className="text-sm text-amber-800 dark:text-amber-300"
              role="status"
            >
              Line {be.index + 1}: {be.message}
            </p>
          ))}
          {expandedBatch !== null && batchResults[expandedBatch] ? (
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <ResultDetails result={batchResults[expandedBatch]!} />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ResultDetails({ result }: { result: RedirectCheckResult }) {
  const chainHealthy =
    !result.error &&
    result.redirectCount <= 1 &&
    result.finalStatus >= 200 &&
    result.finalStatus < 400;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
        <span>
          Hops:{" "}
          <span className="font-medium text-foreground">{result.hopCount}</span>
        </span>
        <span>
          Redirect responses:{" "}
          <span className="font-medium text-foreground">
            {result.redirectCount}
          </span>
        </span>
        <span>
          Total time (headers):{" "}
          <span className="font-medium tabular-nums text-foreground">
            {result.totalDurationMs} ms
          </span>
        </span>
        <span>
          Final status:{" "}
          <span
            className={
              result.finalStatus >= 200 && result.finalStatus < 400
                ? "font-medium text-emerald-600 dark:text-emerald-400"
                : "font-medium text-amber-700 dark:text-amber-400"
            }
          >
            {result.finalStatus}
          </span>
        </span>
      </div>

      {result.error ? (
        <p className="text-sm text-amber-800 dark:text-amber-300">
          {result.error} Intermediate steps are shown below.
        </p>
      ) : chainHealthy ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          Short path: zero or one redirect before a successful response—typically
          good for crawl efficiency and latency.
        </p>
      ) : !result.error && result.redirectCount > 1 ? (
        <p className="text-sm text-amber-800 dark:text-amber-300">
          Multiple redirects add round trips. Prefer direct 301s to the canonical
          URL when you control the edge or origin rules.
        </p>
      ) : null}

      <ol className="space-y-3">
        {result.hops.map((hop, i) => {
          const isLast = i === result.hops.length - 1;
          const redirectLabel = isRedirectStatus(hop.status)
            ? redirectTypeLabel(hop.status)
            : null;
          return (
            <li key={`${hop.url}-${i}`} className="relative">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                  {i + 1}
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                    isRedirectStatus(hop.status)
                      ? "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200"
                      : hop.status >= 200 && hop.status < 300
                        ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                        : hop.status >= 400
                          ? "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200"
                          : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                  }`}
                >
                  {hop.status}
                  {redirectLabel ? ` · ${redirectLabel}` : ` · ${responseKind(hop.status)}`}
                </span>
                <span className="text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                  {hop.durationMs} ms
                </span>
              </div>
              <p className="mt-1.5 break-all font-mono text-xs text-zinc-800 dark:text-zinc-200">
                {hop.url}
              </p>
              {hop.location ? (
                <p className="mt-1 break-all text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium text-foreground">Location:</span>{" "}
                  {hop.location}
                </p>
              ) : null}
              {!isLast ? (
                <div
                  className="my-2 ml-3 border-l-2 border-dashed border-zinc-300 pl-3 text-xs text-zinc-400 dark:border-zinc-600"
                  aria-hidden
                >
                  →
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Compare hop-by-hop traces with the{" "}
        <a
          href="/website/redirect-chain-checker"
          className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
        >
          redirect chain checker
        </a>
        , final status codes with the{" "}
        <a
          href="/website/response-code-checker"
          className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
        >
          HTTP status code checker
        </a>
        , and response headers with the{" "}
        <a
          href="/website/http-header-checker"
          className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
        >
          HTTP header checker
        </a>
        .
      </p>
    </div>
  );
}
