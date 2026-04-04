"use client";

import { useState } from "react";

type TypeResult =
  | { ok: true; records: unknown }
  | { ok: false; error: string };

type LookupResponse =
  | {
      hostname: string;
      recordType: string;
      bundled: false;
      ok: true;
      records: unknown;
      tookMs: number;
      error?: undefined;
    }
  | {
      hostname: string;
      recordType: string;
      bundled: false;
      ok: false;
      error: string;
      tookMs: number;
      records?: undefined;
    }
  | {
      hostname: string;
      recordType: "ALL";
      bundled: true;
      byType: Record<string, TypeResult>;
      tookMs: number;
    }
  | { error: string };

const RECORD_OPTIONS: { value: string; label: string }[] = [
  { value: "ALL", label: "All common types (A, AAAA, MX, …)" },
  { value: "A", label: "A — IPv4 addresses" },
  { value: "AAAA", label: "AAAA — IPv6 addresses" },
  { value: "MX", label: "MX — mail exchangers" },
  { value: "CNAME", label: "CNAME — canonical name" },
  { value: "TXT", label: "TXT — text (SPF, DKIM, verification)" },
  { value: "NS", label: "NS — nameservers" },
  { value: "SOA", label: "SOA — start of authority" },
];

function RecordsTable({ data }: { data: unknown }) {
  if (data === null || data === undefined) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">No data.</p>
    );
  }
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Empty result set.
        </p>
      );
    }
    const first = data[0];
    if (
      typeof first === "object" &&
      first !== null &&
      "priority" in first &&
      "exchange" in first
    ) {
      return (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900/80">
              <tr>
                <th className="px-3 py-2 font-medium text-foreground">
                  Priority
                </th>
                <th className="px-3 py-2 font-medium text-foreground">
                  Exchange
                </th>
              </tr>
            </thead>
            <tbody>
              {(data as { priority: number; exchange: string }[]).map(
                (row, i) => (
                  <tr
                    key={`${row.exchange}-${i}`}
                    className="border-t border-zinc-200 dark:border-zinc-800"
                  >
                    <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                      {row.priority}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-foreground">
                      {row.exchange}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      );
    }
    if (
      typeof first === "object" &&
      first !== null &&
      "strings" in first &&
      "joined" in first
    ) {
      return (
        <ul className="space-y-2 text-sm">
          {(data as { strings: string[]; joined: string }[]).map((row, i) => (
            <li
              key={i}
              className="rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Concatenated:{" "}
              </span>
              <span className="break-all font-mono text-xs text-foreground">
                {row.joined}
              </span>
              {row.strings.length > 1 ? (
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Chunks: {row.strings.join(" | ")}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <ul className="list-inside list-disc space-y-1 font-mono text-xs text-foreground">
        {(data as unknown[]).map((row, i) => (
          <li key={i} className="break-all">
            {typeof row === "string" ? row : JSON.stringify(row)}
          </li>
        ))}
      </ul>
    );
  }
  if (typeof data === "object") {
    const o = data as Record<string, unknown>;
    return (
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        {Object.entries(o).map(([k, v]) => (
          <div
            key={k}
            className="rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800"
          >
            <dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {k}
            </dt>
            <dd className="mt-0.5 font-mono text-xs break-all text-foreground">
              {String(v)}
            </dd>
          </div>
        ))}
      </dl>
    );
  }
  return (
    <p className="font-mono text-sm text-foreground">{String(data)}</p>
  );
}

export function DnsLookupTool() {
  const [hostname, setHostname] = useState("");
  const [recordType, setRecordType] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LookupResponse | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const trimmed = hostname.trim();
    if (!trimmed) {
      setError("Enter a domain, hostname, or URL.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/website/dns-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostname: trimmed,
          recordType,
        }),
      });
      const data = (await res.json()) as LookupResponse & { error?: string };
      if (!res.ok) {
        setError(data.error ?? `Request failed (${res.status}).`);
        return;
      }
      setResult(data as LookupResponse);
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
        className="flex flex-col gap-4 lg:flex-row lg:items-end"
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="dns-lookup-hostname"
            className="block text-sm font-medium text-foreground"
          >
            Domain or hostname
          </label>
          <input
            id="dns-lookup-hostname"
            type="text"
            name="hostname"
            autoComplete="url"
            placeholder="example.com or https://www.example.com/path"
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
          />
        </div>
        <div className="min-w-0 w-full lg:max-w-md">
          <label
            htmlFor="dns-record-type"
            className="block text-sm font-medium text-foreground"
          >
            Record type
          </label>
          <select
            id="dns-record-type"
            name="recordType"
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {RECORD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Looking up…" : "Lookup DNS"}
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
          {"bundled" in result && result.bundled ? (
            <>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Resolved{" "}
                <span className="font-medium text-foreground">
                  {result.hostname}
                </span>
                {" · "}
                <span className="font-mono text-xs">
                  {result.tookMs} ms
                </span>
              </p>
              <div className="space-y-6">
                {(
                  [
                    "A",
                    "AAAA",
                    "MX",
                    "CNAME",
                    "TXT",
                    "NS",
                    "SOA",
                  ] as const
                ).map((t) => {
                  const block = result.byType[t];
                  if (!block) return null;
                  return (
                    <section
                      key={t}
                      className="rounded-xl border border-zinc-200 dark:border-zinc-800"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
                        <h3 className="text-sm font-semibold text-foreground">
                          {t}
                        </h3>
                        {block.ok ? (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400">
                            Records found
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {block.error}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        {block.ok ? (
                          <RecordsTable data={block.records} />
                        ) : null}
                      </div>
                    </section>
                  );
                })}
              </div>
            </>
          ) : "ok" in result && result.ok ? (
            <>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-medium text-foreground">
                  {result.recordType}
                </span>{" "}
                for{" "}
                <span className="font-medium text-foreground">
                  {result.hostname}
                </span>
                {" · "}
                <span className="font-mono text-xs">{result.tookMs} ms</span>
              </p>
              <RecordsTable data={result.records} />
            </>
          ) : "ok" in result && !result.ok ? (
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              <p>
                <span className="font-medium text-foreground">
                  {result.recordType}
                </span>{" "}
                for{" "}
                <span className="font-medium text-foreground">
                  {result.hostname}
                </span>
                {" · "}
                <span className="font-mono text-xs">{result.tookMs} ms</span>
              </p>
              <p className="mt-2">{result.error}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
