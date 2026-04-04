"use client";

import { useMemo, useState } from "react";

type OtherMetaRow = {
  name?: string;
  property?: string;
  content?: string;
  charset?: string;
  httpEquiv?: string;
};

type ExtractResponse = {
  urlRequested: string;
  finalUrl: string;
  status: number;
  statusText: string;
  contentType: string | null;
  truncated: boolean;
  title: string | null;
  description: string | null;
  keywords: string | null;
  robots: string | null;
  viewport: string | null;
  charset: string | null;
  canonical: string | null;
  openGraph: Record<string, string>;
  twitter: Record<string, string>;
  otherMeta: OtherMetaRow[];
  metaTagCount: number;
  error?: string;
};

function sortedEntries(obj: Record<string, string>): [string, string][] {
  return Object.entries(obj).sort(([a], [b]) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="border-b border-zinc-100 py-2 last:border-b-0 dark:border-zinc-800/80">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm text-foreground">
        {value && value.trim() ? (
          value
        ) : (
          <span className="text-zinc-400 dark:text-zinc-500">—</span>
        )}
      </dd>
    </div>
  );
}

export function MetaTagsExtractorTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractResponse | null>(null);
  const [filter, setFilter] = useState("");

  const ogRows = useMemo(
    () => (result ? sortedEntries(result.openGraph) : []),
    [result],
  );
  const twRows = useMemo(
    () => (result ? sortedEntries(result.twitter) : []),
    [result],
  );

  const filteredOther = useMemo(() => {
    if (!result?.otherMeta) return [];
    const q = filter.trim().toLowerCase();
    if (!q) return result.otherMeta;
    return result.otherMeta.filter((row) => {
      const hay = [
        row.name,
        row.property,
        row.content,
        row.charset,
        row.httpEquiv,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [result, filter]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter a URL to extract meta tags from.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/website/meta-tags/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data: ExtractResponse & { error?: string } = await res.json();
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

  const statusOk = result
    ? result.status >= 200 && result.status < 400
    : false;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="meta-tags-url"
            className="block text-sm font-medium text-foreground"
          >
            Page URL
          </label>
          <input
            id="meta-tags-url"
            type="url"
            name="url"
            inputMode="url"
            placeholder="https://example.com/blog/meta-tags-seo"
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
          {loading ? "Fetching…" : "Extract meta tags"}
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
        <div className="mt-6 space-y-6">
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
            {result.contentType ? (
              <span>
                Content-Type:{" "}
                <span className="font-medium text-foreground">
                  {result.contentType}
                </span>
              </span>
            ) : null}
            {result.truncated ? (
              <span className="font-medium text-amber-700 dark:text-amber-400">
                HTML truncated for parsing (large response)
              </span>
            ) : null}
          </div>

          <section aria-labelledby="meta-summary-heading">
            <h2
              id="meta-summary-heading"
              className="text-sm font-semibold text-foreground"
            >
              Core SEO & head tags
            </h2>
            <dl className="mt-2 divide-y divide-zinc-100 rounded-lg border border-zinc-200 px-3 dark:divide-zinc-800 dark:border-zinc-800">
              <SummaryRow label="Title" value={result.title} />
              <SummaryRow label="Meta description" value={result.description} />
              <SummaryRow label="Meta keywords" value={result.keywords} />
              <SummaryRow label="Robots" value={result.robots} />
              <SummaryRow label="Viewport" value={result.viewport} />
              <SummaryRow label="Charset (hint)" value={result.charset} />
              <SummaryRow label="Canonical (rel=canonical)" value={result.canonical} />
              <SummaryRow
                label="Open Graph URL (og:url)"
                value={result.openGraph["og:url"]}
              />
            </dl>
          </section>

          <section aria-labelledby="og-heading">
            <h2
              id="og-heading"
              className="text-sm font-semibold text-foreground"
            >
              Open Graph ({ogRows.length})
            </h2>
            {ogRows.length ? (
              <div className="mt-2 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80">
                      <th className="px-3 py-2 font-medium text-foreground">
                        Property
                      </th>
                      <th className="px-3 py-2 font-medium text-foreground">
                        Content
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ogRows.map(([prop, content]) => (
                      <tr
                        key={prop}
                        className="border-b border-zinc-100 dark:border-zinc-800/80"
                      >
                        <td className="whitespace-nowrap px-3 py-2 font-mono text-xs font-medium text-foreground">
                          {prop}
                        </td>
                        <td className="max-w-[min(100vw-4rem,48rem)] break-all px-3 py-2 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                          {content}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                No Open Graph properties found in the scanned HTML.
              </p>
            )}
          </section>

          <section aria-labelledby="tw-heading">
            <h2
              id="tw-heading"
              className="text-sm font-semibold text-foreground"
            >
              Twitter Card ({twRows.length})
            </h2>
            {twRows.length ? (
              <div className="mt-2 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80">
                      <th className="px-3 py-2 font-medium text-foreground">
                        Name / property
                      </th>
                      <th className="px-3 py-2 font-medium text-foreground">
                        Content
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {twRows.map(([name, content]) => (
                      <tr
                        key={name}
                        className="border-b border-zinc-100 dark:border-zinc-800/80"
                      >
                        <td className="whitespace-nowrap px-3 py-2 font-mono text-xs font-medium text-foreground">
                          {name}
                        </td>
                        <td className="max-w-[min(100vw-4rem,48rem)] break-all px-3 py-2 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                          {content}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                No Twitter Card tags found—many sites rely on Open Graph
                fallbacks instead.
              </p>
            )}
          </section>

          <section aria-labelledby="other-meta-heading">
            <h2
              id="other-meta-heading"
              className="text-sm font-semibold text-foreground"
            >
              Other meta tags ({result.otherMeta.length})
            </h2>
            <label
              htmlFor="meta-other-filter"
              className="mt-2 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
            >
              Filter (name, property, content)
            </label>
            <input
              id="meta-other-filter"
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="e.g. verification, theme-color, article:"
              className="mt-1 w-full max-w-md rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            />
            {filteredOther.length ? (
              <div className="mt-3 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80">
                      <th className="px-3 py-2 font-medium text-foreground">
                        Name
                      </th>
                      <th className="px-3 py-2 font-medium text-foreground">
                        Property
                      </th>
                      <th className="px-3 py-2 font-medium text-foreground">
                        Content / charset / http-equiv
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOther.map((row, i) => (
                      <tr
                        key={`${row.name}-${row.property}-${i}`}
                        className="border-b border-zinc-100 dark:border-zinc-800/80"
                      >
                        <td className="px-3 py-2 font-mono text-xs text-foreground">
                          {row.name ?? "—"}
                        </td>
                        <td className="px-3 py-2 font-mono text-xs text-foreground">
                          {row.property ?? "—"}
                        </td>
                        <td className="max-w-[min(100vw-4rem,36rem)] break-all px-3 py-2 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                          {row.content ??
                            row.charset ??
                            row.httpEquiv ??
                            "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                {result.otherMeta.length === 0
                  ? "No additional meta rows beyond the grouped tags."
                  : "No rows match your filter."}
              </p>
            )}
          </section>

          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Share previews still look wrong? Try the{" "}
            <a
              href="/website/open-graph-preview"
              className="font-medium text-zinc-900 underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:text-zinc-100 dark:hover:decoration-zinc-500"
            >
              Open Graph preview
            </a>
            , trace redirects with the{" "}
            <a
              href="/website/redirect-chain-checker"
              className="font-medium text-zinc-900 underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:text-zinc-100 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </a>
            , and confirm{" "}
            <a
              href="/website/canonical-tag-checker"
              className="font-medium text-zinc-900 underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:text-zinc-100 dark:hover:decoration-zinc-500"
            >
              canonical tags
            </a>{" "}
            separately.
          </p>
        </div>
      ) : null}
    </div>
  );
}
