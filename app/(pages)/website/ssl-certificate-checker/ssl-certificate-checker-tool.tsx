"use client";

import { useState } from "react";

type SerializedCert = {
  position: number;
  subject: string;
  issuer: string;
  commonName: string;
  subjectAltNames: string[];
  validFrom: string;
  validTo: string;
  validFromMs: number | null;
  validToMs: number | null;
  serialNumber: string;
  fingerprint256: string;
  fingerprintSha1: string;
  signatureAlgorithm: string | undefined;
  bits: number | undefined;
};

type LookupResponse = {
  host: string;
  port: number;
  tlsVersion: string | undefined;
  alpnProtocol: string | undefined;
  authorized: boolean;
  authorizationError: string;
  chain: SerializedCert[];
  leafExpiresAtMs: number | null;
  leafDaysRemaining: number | null;
  leafExpired: boolean;
  leafNotYetValid: boolean;
  error?: string;
};

export function SslCertificateCheckerTool() {
  const [host, setHost] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LookupResponse | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const trimmed = host.trim();
    if (!trimmed) {
      setError("Enter a domain or HTTPS URL to inspect.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/website/ssl-certificate/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host: trimmed }),
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

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="min-w-0 flex-1">
          <label
            htmlFor="ssl-cert-host"
            className="block text-sm font-medium text-foreground"
          >
            Domain or HTTPS URL
          </label>
          <input
            id="ssl-cert-host"
            type="text"
            name="host"
            inputMode="url"
            placeholder="example.com or https://www.example.com"
            autoComplete="url"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Checking…" : "Check certificate"}
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
              Target:{" "}
              <span className="font-medium text-foreground">
                {result.host}:{result.port}
              </span>
            </span>
            {result.tlsVersion ? (
              <span>
                TLS:{" "}
                <span className="font-medium text-foreground">
                  {result.tlsVersion}
                </span>
              </span>
            ) : null}
            {result.alpnProtocol ? (
              <span>
                ALPN:{" "}
                <span className="font-medium text-foreground">
                  {result.alpnProtocol}
                </span>
              </span>
            ) : null}
            <span>
              Trust on server:{" "}
              <span
                className={
                  result.authorized
                    ? "font-medium text-emerald-600 dark:text-emerald-400"
                    : "font-medium text-amber-700 dark:text-amber-400"
                }
              >
                {result.authorized ? "Valid chain" : "Failed / untrusted"}
              </span>
            </span>
            {!result.authorized && result.authorizationError ? (
              <span className="w-full text-xs text-zinc-500 dark:text-zinc-500">
                {result.authorizationError}
              </span>
            ) : null}
          </div>

          {result.chain[0] ? (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                result.leafExpired
                  ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30"
                  : result.leafNotYetValid
                    ? "border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20"
                    : typeof result.leafDaysRemaining === "number" &&
                        result.leafDaysRemaining <= 30
                      ? "border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20"
                      : "border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/20"
              }`}
            >
              <p className="font-medium text-foreground">Leaf certificate</p>
              <p className="mt-1 text-zinc-700 dark:text-zinc-300">
                {result.leafExpired
                  ? "This certificate is expired."
                  : result.leafNotYetValid
                    ? "Not valid yet (starts in the future)."
                    : typeof result.leafDaysRemaining === "number"
                      ? `Expires in ${result.leafDaysRemaining} day${result.leafDaysRemaining === 1 ? "" : "s"}.`
                      : "Review validity window below."}
              </p>
            </div>
          ) : null}

          <div className="space-y-4">
            {result.chain.map((cert) => (
              <div
                key={`${cert.fingerprint256}-${cert.position}`}
                className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Certificate {cert.position} of {result.chain.length}
                </p>
                <dl className="mt-3 space-y-2 text-sm">
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">
                      Subject
                    </dt>
                    <dd className="break-words font-mono text-xs text-foreground">
                      {cert.subject || cert.commonName || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">
                      Issuer
                    </dt>
                    <dd className="break-words font-mono text-xs text-foreground">
                      {cert.issuer || "—"}
                    </dd>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <dt className="text-zinc-500 dark:text-zinc-400">
                        Valid from
                      </dt>
                      <dd className="text-foreground">{cert.validFrom}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500 dark:text-zinc-400">
                        Valid to
                      </dt>
                      <dd className="text-foreground">{cert.validTo}</dd>
                    </div>
                  </div>
                  {cert.subjectAltNames.length > 0 ? (
                    <div>
                      <dt className="text-zinc-500 dark:text-zinc-400">
                        SANs
                      </dt>
                      <dd className="break-words font-mono text-xs text-foreground">
                        {cert.subjectAltNames.join(", ")}
                      </dd>
                    </div>
                  ) : null}
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">
                      Serial
                    </dt>
                    <dd className="break-all font-mono text-xs text-foreground">
                      {cert.serialNumber}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">
                      SHA-256 fingerprint
                    </dt>
                    <dd className="break-all font-mono text-xs text-foreground">
                      {cert.fingerprint256 || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400">
                      SHA-1 fingerprint
                    </dt>
                    <dd className="break-all font-mono text-xs text-foreground">
                      {cert.fingerprintSha1 || "—"}
                    </dd>
                  </div>
                  {cert.signatureAlgorithm || cert.bits ? (
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      {cert.signatureAlgorithm ? (
                        <span>Sig: {cert.signatureAlgorithm}</span>
                      ) : null}
                      {cert.signatureAlgorithm && cert.bits ? " · " : null}
                      {cert.bits ? <span>{cert.bits} bits</span> : null}
                    </div>
                  ) : null}
                </dl>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
