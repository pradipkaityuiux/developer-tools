"use client";

import { useState } from "react";

type CanonicalRow = {
  index: number;
  rawHref: string;
  absoluteHref: string | null;
  resolveError: string | null;
};

type InspectResponse = {
  urlRequested: string;
  finalUrl: string;
  pageStatus: number;
  pageOk: boolean;
  canonicals: CanonicalRow[];
  canonicalCount: number;
  hasMultipleCanonicals: boolean;
  hasCanonical: boolean;
  selfReferencing: boolean | null;
  selfReferencingNormalized: boolean | null;
  notes: string[];
  truncatedHtml?: boolean;
  error?: string;
};

export function CanonicalTagCheckerTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InspectResponse | null>(null);

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
      const res = await fetch("/api/website/canonical-tag/inspect", {
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

  const healthy =
    result &&
    result.pageOk &&
    result.hasCanonical &&
    !result.hasMultipleCanonicals &&
    result.selfReferencing === true;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="canonical-tag-url"
            className="block text-sm font-medium text-foreground"
          >
            Page URL
          </label>
          <input
            id="canonical-tag-url"
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
          {loading ? "Checking…" : "Check canonical"}
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
              HTTP status:{" "}
              <span
                className={
                  result.pageOk
                    ? "font-medium text-emerald-600 dark:text-emerald-400"
                    : "font-medium text-amber-700 dark:text-amber-400"
                }
              >
                {result.pageStatus}
              </span>
            </span>
            <span>
              Canonical tags found:{" "}
              <span className="font-medium text-foreground">
                {result.canonicalCount}
              </span>
            </span>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="font-medium text-foreground">Requested</p>
            <p className="mt-1 break-all font-mono text-zinc-700 dark:text-zinc-300">
              {result.urlRequested}
            </p>
            <p className="mt-3 font-medium text-foreground">Final URL (after redirects)</p>
            <p className="mt-1 break-all font-mono text-zinc-700 dark:text-zinc-300">
              {result.finalUrl}
            </p>
          </div>

          {healthy ? (
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              One canonical tag present and it matches the final URL—strong
              self-reference signal for duplicate-content control.
            </p>
          ) : result.pageOk && result.hasCanonical && result.hasMultipleCanonicals ? (
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Multiple canonicals detected—consolidate to a single{" "}
              <code className="text-xs">&lt;link rel=&quot;canonical&quot;&gt;</code>{" "}
              in the document head.
            </p>
          ) : result.pageOk && !result.hasCanonical ? (
            <p className="text-sm text-amber-800 dark:text-amber-300">
              No canonical link found in HTML. Consider adding a self-referencing
              canonical if this URL should be indexed.
            </p>
          ) : result.pageOk &&
            result.hasCanonical &&
            result.selfReferencing === false ? (
            <p className="text-sm text-sky-800 dark:text-sky-300">
              Canonical points to a different absolute URL than the final
              address—review whether that consolidation is intentional.
            </p>
          ) : null}

          {result.truncatedHtml ? (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              HTML was truncated for safety while scanning; canonicals in very
              large documents should still usually appear in the head.
            </p>
          ) : null}

          {result.canonicals.length > 0 ? (
            <ul className="space-y-3">
              {result.canonicals.map((row) => (
                <li
                  key={`${row.index}-${row.rawHref}`}
                  className="rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800"
                >
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    #{row.index}
                  </span>
                  <p className="mt-1 break-all font-mono text-xs text-zinc-800 dark:text-zinc-200">
                    href={JSON.stringify(row.rawHref)}
                  </p>
                  {row.absoluteHref ? (
                    <p className="mt-2 break-all text-xs text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium text-foreground">
                        Resolved:
                      </span>{" "}
                      {row.absoluteHref}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                      {row.resolveError ?? "Could not resolve href."}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : null}

          {result.notes.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
              {result.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          ) : null}

          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Next: trace redirects with the{" "}
            <a
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </a>
            , compare response headers with the{" "}
            <a
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </a>
            , or pull a broader tag set from the{" "}
            <a
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </a>
            .
          </p>
        </div>
      ) : null}
    </div>
  );
}
