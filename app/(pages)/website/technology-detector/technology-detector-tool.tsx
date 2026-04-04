"use client";

import { useMemo, useState } from "react";

type TechnologyHit = {
  name: string;
  category: string;
  confidence: "high" | "medium" | "low";
  evidence: string;
};

type DetectResponse = {
  urlRequested: string;
  finalUrl: string;
  pageStatus: number;
  pageStatusText?: string;
  truncatedHtml?: boolean;
  htmlBytesRead?: number;
  generatorMeta: string | null;
  serverHeader: string | null;
  hits: TechnologyHit[];
  error?: string;
};

const CATEGORY_LABEL: Record<string, string> = {
  cms: "CMS & storefronts",
  framework: "Frameworks & SSR",
  cdn: "CDN & edge",
  analytics: "Analytics & tags",
  marketing: "Marketing & chat",
  ecommerce: "Payments & commerce",
  fonts: "Fonts",
  security: "Security widgets",
  other: "Server & other",
};

function confidenceBadgeClass(c: TechnologyHit["confidence"]) {
  if (c === "high")
    return "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200";
  if (c === "medium")
    return "bg-amber-100 text-amber-950 dark:bg-amber-950/50 dark:text-amber-100";
  return "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200";
}

export function TechnologyDetectorTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DetectResponse | null>(null);

  const grouped = useMemo(() => {
    if (!result?.hits?.length) return [];
    const map = new Map<string, TechnologyHit[]>();
    for (const h of result.hits) {
      const list = map.get(h.category) ?? [];
      list.push(h);
      map.set(h.category, list);
    }
    const order = Object.keys(CATEGORY_LABEL);
    return order
      .filter((k) => map.has(k))
      .map((k) => ({
        key: k,
        label: CATEGORY_LABEL[k] ?? k,
        items: map.get(k)!,
      }));
  }, [result]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter a URL to scan.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/website/technology-detector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data: DetectResponse = await res.json();
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

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="tech-detector-url"
            className="block text-sm font-medium text-foreground"
          >
            Page URL
          </label>
          <input
            id="tech-detector-url"
            type="url"
            name="url"
            inputMode="url"
            autoComplete="url"
            spellCheck={false}
            placeholder="https://example.com or example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Scanning…" : "Detect technologies"}
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
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
            <p className="font-medium text-foreground">Fetch summary</p>
            <dl className="mt-2 grid gap-1 sm:grid-cols-2">
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Final URL</dt>
                <dd className="break-all font-mono text-xs text-foreground">
                  {result.finalUrl}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">HTTP status</dt>
                <dd className="font-mono text-xs text-foreground">
                  {result.pageStatus}
                  {result.pageStatusText ? ` ${result.pageStatusText}` : ""}
                </dd>
              </div>
              {result.htmlBytesRead != null ? (
                <div>
                  <dt className="text-zinc-500 dark:text-zinc-400">
                    HTML bytes read
                  </dt>
                  <dd className="font-mono text-xs text-foreground">
                    {result.htmlBytesRead.toLocaleString()}
                    {result.truncatedHtml ? " (truncated for scan cap)" : ""}
                  </dd>
                </div>
              ) : null}
              {result.serverHeader ? (
                <div>
                  <dt className="text-zinc-500 dark:text-zinc-400">Server</dt>
                  <dd className="break-all font-mono text-xs text-foreground">
                    {result.serverHeader}
                  </dd>
                </div>
              ) : null}
              {result.generatorMeta ? (
                <div className="sm:col-span-2">
                  <dt className="text-zinc-500 dark:text-zinc-400">
                    Meta generator
                  </dt>
                  <dd className="break-words text-xs text-foreground">
                    {result.generatorMeta}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          {result.hits.length === 0 ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No strong fingerprints in the first HTML chunk and response
              headers. The site may load its stack only in the browser, block
              automated clients, or use uncommon vendors—try another URL on the
              same domain or inspect headers manually.
            </p>
          ) : (
            grouped.map((section) => (
              <section key={section.key} aria-labelledby={`cat-${section.key}`}>
                <h2
                  id={`cat-${section.key}`}
                  className="text-sm font-semibold text-foreground"
                >
                  {section.label}
                </h2>
                <ul className="mt-2 divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
                  {section.items.map((hit) => (
                    <li
                      key={`${section.key}-${hit.name}-${hit.evidence}`}
                      className="px-3 py-2.5"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-foreground">
                          {hit.name}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${confidenceBadgeClass(hit.confidence)}`}
                        >
                          {hit.confidence}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {hit.evidence}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
