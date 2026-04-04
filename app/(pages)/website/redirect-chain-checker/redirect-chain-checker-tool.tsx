"use client";

import { useState } from "react";

type Hop = {
  url: string;
  status: number;
  location: string | null;
};

type TraceResponse = {
  inputUrl: string;
  hops: Hop[];
  hopCount: number;
  redirectCount: number;
  finalUrl: string;
  finalStatus: number;
  error: string | null;
};

function statusLabel(status: number): string {
  if ([301, 302, 303, 307, 308].includes(status)) return "Redirect";
  if (status >= 200 && status < 300) return "Success";
  if (status >= 400 && status < 500) return "Client error";
  if (status >= 500) return "Server error";
  return "Response";
}

export function RedirectChainCheckerTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TraceResponse | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter a URL to trace.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/website/redirect-chain/trace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data: TraceResponse & { error?: string } = await res.json();
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

  const chainHealthy =
    result &&
    !result.error &&
    result.redirectCount <= 1 &&
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
            htmlFor="redirect-chain-url"
            className="block text-sm font-medium text-foreground"
          >
            URL to trace
          </label>
          <input
            id="redirect-chain-url"
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
          {loading ? "Tracing…" : "Trace redirects"}
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
              Hops recorded:{" "}
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
              {result.error} Intermediate steps are shown below so you can see
              where the chain stopped.
            </p>
          ) : chainHealthy ? (
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              Short path: zero or one redirect before a successful response—good
              for SEO crawl efficiency and perceived performance.
            </p>
          ) : !result.error && result.redirectCount > 1 ? (
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Multiple redirects add latency. Point marketing links and{" "}
              <a
                href="/website/canonical-tag-checker"
                className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
              >
                canonical tags
              </a>{" "}
              at the final URL when you can.
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
            Cross-check headers on the final URL with our{" "}
            <a
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </a>{" "}
            and raw status with the{" "}
            <a
              href="/website/response-code-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              response code checker
            </a>
            .
          </p>
        </div>
      ) : null}
    </div>
  );
}
