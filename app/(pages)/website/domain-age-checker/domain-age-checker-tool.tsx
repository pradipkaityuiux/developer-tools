"use client";

import { useState } from "react";

type LookupOk = {
  domainInput: string;
  domainMatched: string;
  ldhName: string | null;
  registrationDate: string | null;
  expirationDate: string | null;
  lastChangedDate: string | null;
  ageDays: number | null;
  ageDescription: string | null;
  domainStatuses: string[];
  registrarName: string | null;
};

type LookupResponse = LookupOk & { error?: string };

function formatIso(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function DomainAgeCheckerTool() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LookupOk | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const trimmed = domain.trim();
    if (!trimmed) {
      setError("Enter a domain to check.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/website/domain-age/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: trimmed }),
      });
      const data: LookupResponse = await res.json();
      if (!res.ok) {
        setError(data.error ?? `Request failed (${res.status}).`);
        return;
      }
      if (data.error) {
        setError(data.error);
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
            htmlFor="domain-age-input"
            className="block text-sm font-medium text-foreground"
          >
            Domain name
          </label>
          <input
            id="domain-age-input"
            type="text"
            name="domain"
            inputMode="url"
            autoComplete="url"
            placeholder="example.com or https://www.example.com"
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
          {loading ? "Looking up…" : "Check domain age"}
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
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/40">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Estimated age
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {result.ageDescription ?? "—"}
            </p>
            {typeof result.ageDays === "number" ? (
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                About {result.ageDays.toLocaleString()} days since registration
              </p>
            ) : null}
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800">
              <dt className="text-zinc-500 dark:text-zinc-400">You entered</dt>
              <dd className="mt-0.5 font-medium text-foreground">
                {result.domainInput}
              </dd>
            </div>
            <div className="rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800">
              <dt className="text-zinc-500 dark:text-zinc-400">RDAP match</dt>
              <dd className="mt-0.5 font-medium text-foreground">
                {result.ldhName ?? result.domainMatched}
                {result.domainMatched !== result.domainInput ? (
                  <span className="mt-1 block text-xs font-normal text-zinc-500 dark:text-zinc-400">
                    Resolved from your input (subdomain walk-up when needed).
                  </span>
                ) : null}
              </dd>
            </div>
            <div className="rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800">
              <dt className="text-zinc-500 dark:text-zinc-400">Registered</dt>
              <dd className="mt-0.5 font-medium text-foreground">
                {formatIso(result.registrationDate)}
              </dd>
            </div>
            <div className="rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800">
              <dt className="text-zinc-500 dark:text-zinc-400">Expires</dt>
              <dd className="mt-0.5 font-medium text-foreground">
                {formatIso(result.expirationDate)}
              </dd>
            </div>
            <div className="rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800 sm:col-span-2">
              <dt className="text-zinc-500 dark:text-zinc-400">Last changed</dt>
              <dd className="mt-0.5 font-medium text-foreground">
                {formatIso(result.lastChangedDate)}
              </dd>
            </div>
            {result.registrarName ? (
              <div className="rounded-lg border border-zinc-200 px-3 py-2 sm:col-span-2 dark:border-zinc-800">
                <dt className="text-zinc-500 dark:text-zinc-400">Registrar</dt>
                <dd className="mt-0.5 font-medium text-foreground">
                  {result.registrarName}
                </dd>
              </div>
            ) : null}
          </dl>

          {result.domainStatuses.length > 0 ? (
            <div>
              <p className="text-sm font-medium text-foreground">
                Domain status flags
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                {result.domainStatuses.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            RDAP data comes from public registries and may be redacted or delayed.
            Cross-check critical renewals in your registrar panel and review DNS
            with our{" "}
            <a
              href="/website/dns-lookup"
              className="font-medium text-zinc-900 underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:text-zinc-100 dark:hover:decoration-zinc-500"
            >
              DNS lookup tool
            </a>
            .
          </p>
        </div>
      ) : null}
    </div>
  );
}
