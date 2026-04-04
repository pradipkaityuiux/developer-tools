"use client";

import { useMemo, useState } from "react";

type OpenGraphPreviewPayload = {
  urlRequested: string;
  finalUrl: string;
  pageStatus: number;
  openGraph: {
    title: string | null;
    description: string | null;
    image: string | null;
    url: string | null;
    type: string | null;
    siteName: string | null;
  };
  twitter: {
    card: string | null;
    title: string | null;
    description: string | null;
    image: string | null;
  };
  fallback: {
    documentTitle: string | null;
    metaDescription: string | null;
  };
  preview: {
    title: string | null;
    description: string | null;
    image: string | null;
    canonicalHint: string | null;
  };
  error?: string;
};

function hostnameFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function FieldRow({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="border-b border-zinc-100 py-2 last:border-0 dark:border-zinc-800/80">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm text-foreground">
        {value ? (
          value
        ) : (
          <span className="text-zinc-400 italic dark:text-zinc-500">
            Not set
          </span>
        )}
      </dd>
    </div>
  );
}

export function OpenGraphPreviewTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OpenGraphPreviewPayload | null>(null);
  const [imageBroken, setImageBroken] = useState(false);

  const hostLabel = useMemo(() => {
    if (!result) return "";
    return hostnameFromUrl(result.finalUrl);
  }, [result]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setImageBroken(false);
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter a URL to preview.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/website/open-graph/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data: OpenGraphPreviewPayload = await res.json();
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
            htmlFor="og-preview-url"
            className="block text-sm font-medium text-foreground"
          >
            Page URL
          </label>
          <input
            id="og-preview-url"
            type="url"
            inputMode="url"
            placeholder="https://example.com/blog/your-post"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground shadow-sm outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
            autoComplete="url"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-foreground px-5 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Fetching…" : "Preview"}
        </button>
      </form>

      {error ? (
        <p
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-8 space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Share-style preview
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Final URL after redirects:{" "}
              <span className="font-mono text-[11px] text-foreground">
                {result.finalUrl}
              </span>
            </p>
            <div className="mt-4 max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="aspect-[1.91/1] w-full bg-zinc-200 dark:bg-zinc-800">
                {result.preview.image && !imageBroken ? (
                  <img
                    src={result.preview.image}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={() => setImageBroken(true)}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    {result.preview.image && imageBroken
                      ? "Image failed to load in the browser (blocked, CORS, or invalid URL)."
                      : "No og:image / twitter:image detected."}
                  </div>
                )}
              </div>
              <div className="space-y-1 px-3 py-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {hostLabel}
                </p>
                <p className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
                  {result.preview.title ?? "No title detected"}
                </p>
                <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {result.preview.description ??
                    "No description detected — add og:description or meta description."}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Open Graph tags
              </h3>
              <dl className="mt-3 rounded-lg border border-zinc-200 px-3 dark:border-zinc-800">
                <FieldRow label="og:title" value={result.openGraph.title} />
                <FieldRow
                  label="og:description"
                  value={result.openGraph.description}
                />
                <FieldRow label="og:image" value={result.openGraph.image} />
                <FieldRow label="og:url" value={result.openGraph.url} />
                <FieldRow label="og:type" value={result.openGraph.type} />
                <FieldRow
                  label="og:site_name"
                  value={result.openGraph.siteName}
                />
              </dl>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Twitter Card &amp; HTML fallbacks
              </h3>
              <dl className="mt-3 rounded-lg border border-zinc-200 px-3 dark:border-zinc-800">
                <FieldRow label="twitter:card" value={result.twitter.card} />
                <FieldRow label="twitter:title" value={result.twitter.title} />
                <FieldRow
                  label="twitter:description"
                  value={result.twitter.description}
                />
                <FieldRow label="twitter:image" value={result.twitter.image} />
                <FieldRow
                  label="&lt;title&gt;"
                  value={result.fallback.documentTitle}
                />
                <FieldRow
                  label='meta name="description"'
                  value={result.fallback.metaDescription}
                />
              </dl>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
