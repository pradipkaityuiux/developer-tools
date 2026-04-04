"use client";

import { useState } from "react";

type Row = {
  href: string;
  resolved: string | null;
  skipped: boolean;
  skipReason?: string;
  status: number | null;
  ok: boolean | null;
  error?: string;
};

type ScanResponse = {
  pageUrl: string;
  linksExtracted: number;
  uniqueChecked: number;
  truncatedChecks: boolean;
  httpRows?: number;
  brokenCount?: number;
  rows: Row[];
  error?: string;
};

export function BrokenLinkCheckerTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResponse | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter a page URL to scan.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/website/broken-links/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data: ScanResponse & { error?: string; pageStatus?: number } =
        await res.json();
      if (!res.ok) {
        setError(data.error ?? `Request failed (${res.status}).`);
        return;
      }
      setResult(data);
    } catch {
      setError("Network error — try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  const broken =
    result?.rows.filter((r) => !r.skipped && r.ok === false) ?? [];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label
            htmlFor="broken-link-page-url"
            className="block text-sm font-medium text-foreground"
          >
            Page URL to scan
          </label>
          <input
            id="broken-link-page-url"
            type="url"
            name="url"
            inputMode="url"
            placeholder="https://example.com/blog/post"
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
          {loading ? "Scanning…" : "Check links"}
        </button>
      </form>

      {error ? (
        <p
          className="mt-4 text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <span>
              Fetched:{" "}
              <span className="font-medium text-foreground">
                {result.pageUrl}
              </span>
            </span>
            <span>
              Anchors found:{" "}
              <span className="font-medium text-foreground">
                {result.linksExtracted}
              </span>
            </span>
            <span>
              Unique URLs checked:{" "}
              <span className="font-medium text-foreground">
                {result.uniqueChecked}
              </span>
            </span>
            {typeof result.brokenCount === "number" ? (
              <span>
                Broken / error:{" "}
                <span
                  className={
                    result.brokenCount > 0
                      ? "font-medium text-red-600 dark:text-red-400"
                      : "font-medium text-emerald-600 dark:text-emerald-400"
                  }
                >
                  {result.brokenCount}
                </span>
              </span>
            ) : null}
          </div>
          {result.truncatedChecks ? (
            <p className="text-sm text-amber-700 dark:text-amber-400">
              This page has many distinct links; only the first{" "}
              {result.uniqueChecked} unique HTTP(S) targets were checked. Split
              audits by section or sitemap for full coverage.
            </p>
          ) : null}

          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80">
                  <th className="px-3 py-2 font-medium text-foreground">
                    Href (as in HTML)
                  </th>
                  <th className="px-3 py-2 font-medium text-foreground">
                    Resolved URL
                  </th>
                  <th className="px-3 py-2 font-medium text-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row, i) => (
                  <tr
                    key={`${row.href}-${i}`}
                    className="border-b border-zinc-100 dark:border-zinc-800/80"
                  >
                    <td className="max-w-[200px] break-all px-3 py-2 font-mono text-xs text-zinc-800 dark:text-zinc-200">
                      {row.href}
                    </td>
                    <td className="max-w-[280px] break-all px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400">
                      {row.resolved ?? "—"}
                      {row.skipped && row.skipReason ? (
                        <span className="mt-1 block text-zinc-500">
                          {row.skipReason}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {row.skipped ? (
                        <span className="text-zinc-500">Skipped</span>
                      ) : row.error ? (
                        <span className="text-red-600 dark:text-red-400">
                          {row.error}
                        </span>
                      ) : row.status != null ? (
                        <span
                          className={
                            row.ok
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        >
                          {row.status}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {broken.length > 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Fix or remove{" "}
              <strong className="text-foreground">broken outbound links</strong>{" "}
              to protect user experience and crawl budget. Pair this check with
              our{" "}
              <a
                href="/website/redirect-chain-checker"
                className="font-medium text-zinc-900 underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:text-zinc-100 dark:hover:decoration-zinc-500"
              >
                redirect chain checker
              </a>{" "}
              and{" "}
              <a
                href="/website/response-code-checker"
                className="font-medium text-zinc-900 underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:text-zinc-100 dark:hover:decoration-zinc-500"
              >
                response code checker
              </a>{" "}
              for deeper HTTP debugging.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
