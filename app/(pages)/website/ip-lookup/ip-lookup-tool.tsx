"use client";

import { useState } from "react";

type LookupResult = {
  ip: string;
  ipType: string;
  continent: string | null;
  continentCode: string | null;
  country: string | null;
  countryCode: string | null;
  region: string | null;
  regionCode: string | null;
  city: string | null;
  postal: string | null;
  latitude: number | null;
  longitude: number | null;
  isEu: boolean | null;
  asn: number | null;
  org: string | null;
  isp: string | null;
  networkDomain: string | null;
  timezoneId: string | null;
  timezoneUtc: string | null;
  timezoneCurrentTime: string | null;
  security: {
    anonymous: boolean | null;
    proxy: boolean | null;
    vpn: boolean | null;
    tor: boolean | null;
    hosting: boolean | null;
  } | null;
  reverseDnsHostnames: string[];
};

function Row({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | null | undefined;
}) {
  const display =
    value === null || value === undefined || value === ""
      ? "—"
      : typeof value === "boolean"
        ? value
          ? "Yes"
          : "No"
        : String(value);
  return (
    <>
      <dt className="border-b border-zinc-100 py-2.5 text-sm font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 sm:col-span-1">
        {label}
      </dt>
      <dd className="border-b border-zinc-100 py-2.5 text-sm break-all text-foreground dark:border-zinc-800 sm:col-span-1">
        {display}
      </dd>
    </>
  );
}

export function IpLookupTool() {
  const [ipInput, setIpInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LookupResult | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const trimmed = ipInput.trim();
    if (!trimmed) {
      setError("Enter an IPv4 or IPv6 address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/website/ip-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: trimmed }),
      });
      const data: LookupResult & { error?: string } = await res.json();
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
            htmlFor="ip-lookup-input"
            className="block text-sm font-medium text-foreground"
          >
            IP address
          </label>
          <input
            id="ip-lookup-input"
            type="text"
            name="ip"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="8.8.8.8 or 2001:4860:4860::8888"
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Looking up…" : "Look up IP"}
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
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-foreground">
            Results for{" "}
            <span className="font-mono font-normal">{result.ip}</span>
            <span className="ml-2 text-zinc-500 dark:text-zinc-400">
              ({result.ipType})
            </span>
          </h2>
          <dl className="mt-4 grid gap-x-4 sm:grid-cols-[minmax(0,11rem)_1fr]">
            <Row label="Country" value={result.country} />
            <Row label="Country code" value={result.countryCode} />
            <Row label="Region / state" value={result.region} />
            <Row label="City" value={result.city} />
            <Row label="Postal code" value={result.postal} />
            <Row label="Continent" value={result.continent} />
            <Row label="Latitude" value={result.latitude} />
            <Row label="Longitude" value={result.longitude} />
            <Row label="EU (data flag)" value={result.isEu} />
            <Row label="ISP" value={result.isp} />
            <Row label="Organization" value={result.org} />
            <Row label="ASN" value={result.asn} />
            <Row label="Network domain" value={result.networkDomain} />
            <Row label="Timezone" value={result.timezoneId} />
            <Row label="UTC offset" value={result.timezoneUtc} />
            <Row label="Local time (estimate)" value={result.timezoneCurrentTime} />
            <Row
              label="Reverse DNS (PTR)"
              value={
                result.reverseDnsHostnames.length
                  ? result.reverseDnsHostnames.join(", ")
                  : null
              }
            />
          </dl>
          {result.security ? (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground">
                Security hints (heuristic)
              </h3>
              <dl className="mt-2 grid gap-x-4 sm:grid-cols-[minmax(0,11rem)_1fr]">
                <Row label="Hosting / datacenter" value={result.security.hosting} />
                <Row label="Proxy" value={result.security.proxy} />
                <Row label="VPN" value={result.security.vpn} />
                <Row label="Tor" value={result.security.tor} />
                <Row label="Anonymous" value={result.security.anonymous} />
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                Flags come from the data provider and are not guaranteed
                accurate—use them as soft signals only.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
