"use client";

import { useState } from "react";

type Directive =
  | { kind: "allow"; value: string }
  | { kind: "disallow"; value: string }
  | { kind: "crawl-delay"; value: string }
  | { kind: "host"; value: string }
  | { kind: "other"; field: string; value: string };

type Parsed = {
  sitemaps: string[];
  groups: { userAgents: string[]; directives: Directive[] }[];
};

type FetchOk = {
  inputUrl: string;
  robotsUrlRequested: string;
  finalUrl: string;
  status: number;
  statusText: string;
  contentType: string | null;
  byteLength: number;
  bodyTruncated: boolean;
  rawText: string;
  parsed: Parsed;
  hints: string[];
};

function directiveLabel(d: Directive): string {
  if (d.kind === "other") return d.field;
  return d.kind;
}

function statusTone(
  status: number,
): "ok" | "redirect" | "warn" | "err" {
  if (status >= 200 && status < 300) return "ok";
  if (status >= 300 && status < 400) return "redirect";
  if (status >= 400 && status < 500) return "warn";
  return "err";
}

export function RobotsTxtCheckerTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FetchOk | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter a website URL or hostname.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/website/robots-txt/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data: FetchOk & { error?: string } = await res.json();
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
            htmlFor="robots-txt-url"
            className="block text-sm font-medium text-foreground"
          >
            Website URL or /robots.txt link
          </label>
          <input
            id="robots-txt-url"
            type="text"
            name="url"
            inputMode="url"
            placeholder="https://example.com or example.com"
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
          {loading ? "Fetching…" : "Check robots.txt"}
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
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span>
              Status:{" "}
              <span
                className={
                  statusTone(result.status) === "ok"
                    ? "font-medium text-emerald-600 dark:text-emerald-400"
                    : statusTone(result.status) === "warn"
                      ? "font-medium text-amber-700 dark:text-amber-400"
                      : "font-medium text-foreground"
                }
              >
                {result.status} {result.statusText ? `· ${result.statusText}` : ""}
              </span>
            </span>
            <span>
              Bytes:{" "}
              <span className="font-medium text-foreground">
                {result.byteLength.toLocaleString()}
              </span>
              {result.bodyTruncated ? (
                <span className="text-amber-700 dark:text-amber-400">
                  {" "}
                  (truncated for display)
                </span>
              ) : null}
            </span>
            {result.contentType ? (
              <span className="max-w-full break-all">
                Content-Type:{" "}
                <span className="font-medium text-foreground">
                  {result.contentType}
                </span>
              </span>
            ) : null}
          </div>

          <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
            <p className="break-all">
              <span className="font-medium text-foreground">Requested: </span>
              {result.robotsUrlRequested}
            </p>
            {result.finalUrl !== result.robotsUrlRequested ? (
              <p className="break-all">
                <span className="font-medium text-foreground">Final URL: </span>
                {result.finalUrl}
              </p>
            ) : null}
          </div>

          {result.hints.length > 0 ? (
            <div>
              <h3 className="text-sm font-medium text-foreground">
                Audit hints
              </h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {result.hints.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {result.parsed.sitemaps.length > 0 ? (
            <div>
              <h3 className="text-sm font-medium text-foreground">
                Sitemap directives
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                {result.parsed.sitemaps.map((s) => (
                  <li key={s} className="break-all">
                    <a
                      href={s}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                    >
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {result.parsed.groups.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">
                Parsed User-agent groups
              </h3>
              {result.parsed.groups.map((g, gi) => (
                <div
                  key={`g-${gi}-${g.userAgents.join(",")}`}
                  className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/40"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    User-agent
                  </p>
                  <ul className="mt-1 list-inside list-disc text-sm text-foreground">
                    {g.userAgents.map((ua) => (
                      <li key={ua} className="font-mono text-xs">
                        {ua || "(empty)"}
                      </li>
                    ))}
                  </ul>
                  {g.directives.length > 0 ? (
                    <table className="mt-3 w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                          <th className="py-1 pr-2 font-medium">Directive</th>
                          <th className="py-1 font-medium">Value</th>
                        </tr>
                      </thead>
                      <tbody className="text-zinc-700 dark:text-zinc-300">
                        {g.directives.map((d, di) => (
                          <tr
                            key={`${gi}-${di}-${directiveLabel(d)}-${"value" in d ? d.value : ""}`}
                            className="border-b border-zinc-100 dark:border-zinc-800/80"
                          >
                            <td className="py-1.5 pr-2 align-top font-mono capitalize">
                              {directiveLabel(d)}
                            </td>
                            <td className="break-all py-1.5 font-mono">
                              {"value" in d ? d.value : ""}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                      No Allow, Disallow, or other rules under this group.
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : null}

          <div>
            <h3 className="text-sm font-medium text-foreground">Raw file</h3>
            <pre className="mt-2 max-h-80 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs leading-relaxed text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              {result.rawText || "(empty body)"}
            </pre>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Validate HTTP behavior with our{" "}
            <a
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </a>
            , trace redirects with the{" "}
            <a
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </a>
            , and spot status issues using the{" "}
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
