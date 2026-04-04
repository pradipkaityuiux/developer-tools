"use client";

import Link from "next/link";
import { useState } from "react";

type Hop = {
  url: string;
  status: number;
  location: string | null;
  statusText: string;
};

type CheckResponse = {
  inputUrl: string;
  hops: Hop[];
  hopCount: number;
  redirectCount: number;
  finalUrl: string;
  finalStatus: number;
  finalStatusText: string;
  chainError: string | null;
};

function statusLabel(status: number): string {
  if ([301, 302, 303, 307, 308].includes(status)) return "Redirect";
  if (status >= 200 && status < 300) return "Success";
  if (status >= 400 && status < 500) return "Client error";
  if (status >= 500) return "Server error";
  return "Response";
}

function finalSummary(status: number): string {
  if (status === 200)
    return "200 OK — the URL resolved successfully after any redirects.";
  if (status === 301 || status === 308)
    return "Permanent redirect — crawlers usually consolidate to the Location target.";
  if (status === 302 || status === 307)
    return "Temporary redirect — the original URL may return; equity may not fully consolidate.";
  if (status === 404)
    return "Not found — fix the link, restore content, or return 410 if intentionally removed.";
  if (status === 403)
    return "Forbidden — check WAF, IP allowlists, and auth rules if users should reach this URL.";
  if (status === 500 || status === 502 || status === 503 || status === 504)
    return "Server or gateway error — inspect origin health, upstreams, and deployment logs.";
  if (status >= 200 && status < 300)
    return "Success range — request completed; confirm caching and canonical behavior separately.";
  if (status >= 400 && status < 500)
    return "Client error — the server refused or could not satisfy the request as sent.";
  if (status >= 500)
    return "Server error — the origin reported a failure processing the request.";
  return "Review the status class and your hosting or CDN configuration.";
}

export function ResponseCodeCheckerTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResponse | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter a URL to check.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/website/response-code/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data: CheckResponse & { error?: string } = await res.json();
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

  const ok =
    result &&
    !result.chainError &&
    result.finalStatus >= 200 &&
    result.finalStatus < 400;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="response-code-url"
            className="block text-sm font-medium text-foreground"
          >
            URL to check
          </label>
          <input
            id="response-code-url"
            type="url"
            name="url"
            inputMode="url"
            placeholder="https://example.com/pricing"
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
          {loading ? "Checking…" : "Check status"}
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
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Final HTTP status
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <span
                className={`text-3xl font-semibold tabular-nums ${
                  result.finalStatus >= 200 && result.finalStatus < 300
                    ? "text-emerald-700 dark:text-emerald-400"
                    : result.finalStatus >= 400
                      ? "text-red-700 dark:text-red-400"
                      : "text-sky-800 dark:text-sky-300"
                }`}
              >
                {result.finalStatus}
              </span>
              {result.finalStatusText ? (
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {result.finalStatusText}
                </span>
              ) : null}
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                · {statusLabel(result.finalStatus)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {finalSummary(result.finalStatus)}
            </p>
            <p className="mt-3 break-all font-mono text-xs text-zinc-800 dark:text-zinc-200">
              <span className="font-sans font-medium text-foreground">
                Final URL:{" "}
              </span>
              {result.finalUrl}
            </p>
            {result.inputUrl !== result.finalUrl ? (
              <p className="mt-2 break-all font-mono text-xs text-zinc-600 dark:text-zinc-400">
                <span className="font-sans font-medium text-foreground">
                  Requested:{" "}
                </span>
                {result.inputUrl}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <span>
              Hops:{" "}
              <span className="font-medium text-foreground">
                {result.hopCount}
              </span>
            </span>
            <span>
              Redirect responses:{" "}
              <span className="font-medium text-foreground">
                {result.redirectCount}
              </span>
            </span>
          </div>

          {result.chainError ? (
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {result.chainError} Intermediate steps are shown below.
            </p>
          ) : ok && result.redirectCount <= 1 ? (
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              Healthy path: success status with at most one redirect—good for
              crawl efficiency and latency.
            </p>
          ) : !result.chainError && result.redirectCount > 1 ? (
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Multiple redirects add round trips. Use the{" "}
              <Link
                href="/website/redirect-chain-checker"
                className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
              >
                redirect chain checker
              </Link>{" "}
              to inspect every hop and shorten rules where possible.
            </p>
          ) : null}

          <ol className="space-y-3">
            {result.hops.map((hop, i) => {
              const isLast = i === result.hops.length - 1;
              return (
                <li key={`${hop.url}-${i}`} className="relative">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                      {i + 1}
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                        [301, 302, 303, 307, 308].includes(hop.status)
                          ? "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200"
                          : hop.status >= 200 && hop.status < 300
                            ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                            : hop.status >= 400
                              ? "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200"
                              : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                      }`}
                    >
                      {hop.status} · {statusLabel(hop.status)}
                    </span>
                    {isLast && hop.statusText ? (
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {hop.statusText}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 break-all font-mono text-xs text-zinc-800 dark:text-zinc-200">
                    {hop.url}
                  </p>
                  {hop.location ? (
                    <p className="mt-1 break-all text-xs text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium text-foreground">
                        Location:
                      </span>{" "}
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
            Inspect response headers on the final URL with our{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>{" "}
            or scan on-page links with the{" "}
            <Link
              href="/website/broken-link-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              broken link checker
            </Link>
            .
          </p>
        </div>
      ) : null}
    </div>
  );
}
