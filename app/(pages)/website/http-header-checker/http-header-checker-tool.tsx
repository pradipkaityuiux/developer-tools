"use client";

import { useMemo, useState } from "react";

type HeaderRow = { name: string; value: string };

type InspectResponse = {
  urlRequested: string;
  finalUrl: string;
  status: number;
  statusText: string;
  probeMethod: "HEAD" | "GET";
  headerCount: number;
  headers: HeaderRow[];
  error?: string;
};

function highlightKind(
  name: string,
): "security" | "cache" | "cors" | "default" {
  const n = name.toLowerCase();
  if (
    n === "strict-transport-security" ||
    n === "content-security-policy" ||
    n === "content-security-policy-report-only" ||
    n === "x-content-type-options" ||
    n === "x-frame-options" ||
    n === "cross-origin-opener-policy" ||
    n === "cross-origin-embedder-policy" ||
    n === "cross-origin-resource-policy" ||
    n === "referrer-policy" ||
    n === "permissions-policy" ||
    n.startsWith("permissions-policy")
  ) {
    return "security";
  }
  if (
    n === "cache-control" ||
    n === "expires" ||
    n === "age" ||
    n === "etag" ||
    n === "last-modified" ||
    n === "vary"
  ) {
    return "cache";
  }
  if (
    n.startsWith("access-control-") ||
    n === "timing-allow-origin" ||
    n === "cross-origin-resource-policy"
  ) {
    return "cors";
  }
  return "default";
}

export function HttpHeaderCheckerTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InspectResponse | null>(null);
  const [filter, setFilter] = useState("");

  const filteredHeaders = useMemo(() => {
    if (!result?.headers) return [];
    const q = filter.trim().toLowerCase();
    if (!q) return result.headers;
    return result.headers.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.value.toLowerCase().includes(q),
    );
  }, [result, filter]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter a URL to inspect.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/website/http-headers/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data: InspectResponse = await res.json();
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

  const statusOk = result ? result.status >= 200 && result.status < 300 : false;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="http-header-url"
            className="block text-sm font-medium text-foreground"
          >
            URL to inspect
          </label>
          <input
            id="http-header-url"
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
          {loading ? "Fetching…" : "Check headers"}
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
              Requested:{" "}
              <span className="font-medium text-foreground">
                {result.urlRequested}
              </span>
            </span>
            {result.finalUrl !== result.urlRequested ? (
              <span>
                Final URL:{" "}
                <span className="font-medium text-foreground">
                  {result.finalUrl}
                </span>
              </span>
            ) : null}
            <span>
              Status:{" "}
              <span
                className={
                  statusOk
                    ? "font-medium text-emerald-600 dark:text-emerald-400"
                    : "font-medium text-foreground"
                }
              >
                {result.status} {result.statusText}
              </span>
            </span>
            <span>
              Probe:{" "}
              <span className="font-medium text-foreground">
                {result.probeMethod}
              </span>
            </span>
            <span>
              Headers:{" "}
              <span className="font-medium text-foreground">
                {result.headerCount}
              </span>
            </span>
          </div>

          <div>
            <label
              htmlFor="http-header-filter"
              className="block text-sm font-medium text-foreground"
            >
              Filter headers
            </label>
            <input
              id="http-header-filter"
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="e.g. cache, cors, csp, set-cookie"
              className="mt-1.5 w-full max-w-md rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            />
          </div>

          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80">
                  <th className="px-3 py-2 font-medium text-foreground">
                    Name
                  </th>
                  <th className="px-3 py-2 font-medium text-foreground">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredHeaders.map((row, i) => {
                  const kind = highlightKind(row.name);
                  const rowClass =
                    kind === "security"
                      ? "bg-emerald-50/80 dark:bg-emerald-950/20"
                      : kind === "cache"
                        ? "bg-sky-50/80 dark:bg-sky-950/20"
                        : kind === "cors"
                          ? "bg-violet-50/80 dark:bg-violet-950/20"
                          : "";
                  return (
                    <tr
                      key={`${row.name}-${i}`}
                      className={`border-b border-zinc-100 dark:border-zinc-800/80 ${rowClass}`}
                    >
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-xs font-medium text-foreground">
                        {row.name}
                      </td>
                      <td className="max-w-[min(100vw-4rem,48rem)] break-all px-3 py-2 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                        {row.value}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredHeaders.length === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No headers match your filter. Clear the filter box to see the full
              list.
            </p>
          ) : null}

          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Redirect path not listed here? Trace every hop with our{" "}
            <a
              href="/website/redirect-chain-checker"
              className="font-medium text-zinc-900 underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:text-zinc-100 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </a>{" "}
            and validate status behavior with the{" "}
            <a
              href="/website/response-code-checker"
              className="font-medium text-zinc-900 underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:text-zinc-100 dark:hover:decoration-zinc-500"
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
