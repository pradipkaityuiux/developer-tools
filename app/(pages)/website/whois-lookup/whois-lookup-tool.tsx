"use client";

import { useState } from "react";

type RdapSummary = {
  domainName?: string;
  unicodeName?: string;
  handle?: string;
  status: string[];
  registrar?: string;
  events: { action: string; date: string }[];
  nameservers: string[];
  notices: { title?: string; description?: string[] }[];
};

type LookupResponse = {
  queried: string;
  attempted: string[];
  source: "rdap";
  summary: RdapSummary;
  error?: string;
};

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function WhoisLookupTool() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LookupResponse | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const trimmed = domain.trim();
    if (!trimmed) {
      setError("Enter a domain or URL to look up.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/website/whois-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: trimmed }),
      });
      const data: LookupResponse & { error?: string } = await res.json();
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

  const s = result?.summary;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="whois-domain-input"
            className="block text-sm font-medium text-foreground"
          >
            Domain or URL
          </label>
          <input
            id="whois-domain-input"
            type="text"
            name="domain"
            inputMode="url"
            placeholder="example.com or https://example.com"
            autoComplete="off"
            spellCheck={false}
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Looking up…" : "WHOIS lookup"}
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

      {result && s ? (
        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <span>
              Queried:{" "}
              <span className="font-medium text-foreground">
                {result.queried}
              </span>
            </span>
            <span>
              Source:{" "}
              <span className="font-medium text-foreground">
                RDAP ({result.source})
              </span>
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
              <h3 className="text-sm font-medium text-foreground">
                Domain
              </h3>
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="font-mono">
                  {s.unicodeName ?? s.domainName ?? result.queried}
                </span>
                {s.domainName &&
                s.unicodeName &&
                s.unicodeName !== s.domainName ? (
                  <span className="mt-1 block font-mono text-xs text-zinc-500">
                    LDH: {s.domainName}
                  </span>
                ) : null}
              </p>
              {s.handle ? (
                <p className="mt-2 text-xs text-zinc-500">
                  Registry handle:{" "}
                  <span className="font-mono text-zinc-600 dark:text-zinc-400">
                    {s.handle}
                  </span>
                </p>
              ) : null}
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
              <h3 className="text-sm font-medium text-foreground">
                Registrar
              </h3>
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                {s.registrar ?? (
                  <span className="text-zinc-500">
                    Not published in this RDAP response (often redacted or
                    omitted).
                  </span>
                )}
              </p>
            </div>
          </div>

          {s.status.length > 0 ? (
            <div>
              <h3 className="text-sm font-medium text-foreground">
                Domain status
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                {s.status.map((st) => (
                  <li key={st}>{st}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {s.events.length > 0 ? (
            <div>
              <h3 className="text-sm font-medium text-foreground">
                Registration timeline
              </h3>
              <div className="mt-2 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full min-w-[280px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80">
                      <th className="px-3 py-2 font-medium text-foreground">
                        Event
                      </th>
                      <th className="px-3 py-2 font-medium text-foreground">
                        Date (UTC/local)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.events.map((ev) => (
                      <tr
                        key={`${ev.action}-${ev.date}`}
                        className="border-b border-zinc-100 dark:border-zinc-800/80"
                      >
                        <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                          {ev.action}
                        </td>
                        <td className="px-3 py-2 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                          {formatWhen(ev.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {s.nameservers.length > 0 ? (
            <div>
              <h3 className="text-sm font-medium text-foreground">
                Nameservers
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 font-mono text-sm text-zinc-600 dark:text-zinc-400">
                {s.nameservers.map((ns) => (
                  <li key={ns}>{ns}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {s.notices.length > 0 ? (
            <div className="space-y-3 rounded-lg border border-amber-200/80 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
              <h3 className="text-sm font-medium text-foreground">
                Registry notices
              </h3>
              {s.notices.map((n, i) => (
                <div key={i}>
                  {n.title ? (
                    <p className="text-sm font-medium text-foreground">
                      {n.title}
                    </p>
                  ) : null}
                  {n.description?.map((line, j) => (
                    <p
                      key={j}
                      className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
