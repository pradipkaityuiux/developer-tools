"use client";

import { useEffect, useMemo, useState } from "react";
import { CopyIconButton } from "@/components/copy-icon-button";
import {
  decodeJwt,
  jwtExpiryStatus,
  type JwtDecodeResult,
} from "@/lib/jwt-decoder-core";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMDAwMDAwMDAwfQ.signature-not-verified";

export function JwtDecoderTool() {
  const [input, setInput] = useState(SAMPLE);
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const [headerCopied, setHeaderCopied] = useState(false);
  const [payloadCopied, setPayloadCopied] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (!copyHint) return;
    const t = window.setTimeout(() => setCopyHint(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyHint]);

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const result: JwtDecodeResult = useMemo(() => decodeJwt(input), [input]);

  const expiryBanner = useMemo(() => {
    if (!result.ok) return null;
    return jwtExpiryStatus(nowMs, result.expiry, result.notBefore);
  }, [result, nowMs]);

  async function copyToClipboard(
    value: string,
    which: "header" | "payload",
  ) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyHint("Copied to clipboard");
      if (which === "header") {
        setHeaderCopied(true);
        window.setTimeout(() => setHeaderCopied(false), 2000);
      } else if (which === "payload") {
        setPayloadCopied(true);
        window.setTimeout(() => setPayloadCopied(false), 2000);
      }
    } catch {
      setCopyHint("Copy blocked — select text manually");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div
        className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"
        role="status"
      >
        <strong className="font-medium">Security note:</strong> this tool does{" "}
        <strong className="font-medium">not</strong> verify signatures. Anyone
        can forge an unsigned-looking payload; only your server (with keys)
        should trust tokens for auth.
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <div>
          <label
            htmlFor="jwt-input"
            className="block text-sm font-medium text-foreground"
          >
            JWT string
          </label>
          <textarea
            id="jwt-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            rows={6}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setInput(SAMPLE)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Load sample
          </button>
          <button
            type="button"
            onClick={() => setInput("")}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Clear
          </button>
        </div>

        {!result.ok ? (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100"
            role="alert"
          >
            {result.error}
          </p>
        ) : (
          <>
            {expiryBanner && expiryBanner.kind === "expired" && (
              <p
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100"
                role="status"
              >
                <strong className="font-medium">exp</strong> is in the past (
                {expiryBanner.expiredAtIso}). The resource owner may still accept
                the token via refresh logic—this banner is not a security check.
              </p>
            )}
            {expiryBanner && expiryBanner.kind === "not_yet_valid" && (
              <p
                className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"
                role="status"
              >
                <strong className="font-medium">nbf</strong> is in the future (
                {expiryBanner.notBeforeIso}). Token is not yet valid by clock
                comparison.
              </p>
            )}
            {expiryBanner && expiryBanner.kind === "active" && (
              <p
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100"
                role="status"
              >
                {expiryBanner.expiresAtIso ? (
                  <>
                    By <strong className="font-medium">exp</strong>, token
                    expires at {expiryBanner.expiresAtIso} (UTC). Compare with
                    your API’s actual validation rules.
                  </>
                ) : (
                  <>
                    No <strong className="font-medium">exp</strong> claim
                    detected; <strong className="font-medium">nbf</strong> (if
                    any) is already satisfied. Long-lived tokens need careful
                    review.
                  </>
                )}
              </p>
            )}
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/40">
                <dt className="text-zinc-500 dark:text-zinc-400">alg (header)</dt>
                <dd className="font-mono text-foreground">
                  {result.algorithm ?? "—"}
                </dd>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/40">
                <dt className="text-zinc-500 dark:text-zinc-400">typ (header)</dt>
                <dd className="font-mono text-foreground">
                  {result.tokenType ?? "—"}
                </dd>
              </div>
              {result.issuedAt && (
                <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/40">
                  <dt className="text-zinc-500 dark:text-zinc-400">iat</dt>
                  <dd className="font-mono text-xs text-foreground sm:text-sm">
                    {result.issuedAt.iso}
                  </dd>
                </div>
              )}
              {result.notBefore && (
                <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/40">
                  <dt className="text-zinc-500 dark:text-zinc-400">nbf</dt>
                  <dd className="font-mono text-xs text-foreground sm:text-sm">
                    {result.notBefore.iso}
                  </dd>
                </div>
              )}
              {result.expiry && (
                <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/40">
                  <dt className="text-zinc-500 dark:text-zinc-400">exp</dt>
                  <dd className="font-mono text-xs text-foreground sm:text-sm">
                    {result.expiry.iso}
                  </dd>
                </div>
              )}
            </dl>

            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-foreground">Header</h3>
                <div className="relative mt-1.5">
                  <pre className="max-h-64 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-xs leading-relaxed text-foreground dark:border-zinc-800 dark:bg-zinc-900/80 sm:text-sm">
                    {result.headerJson}
                  </pre>
                  <CopyIconButton
                    placement="corner"
                    copied={headerCopied}
                    onClick={() => copyToClipboard(result.headerJson, "header")}
                    title={headerCopied ? "Copied" : "Copy header JSON"}
                    aria-label={
                      headerCopied ? "Copied to clipboard" : "Copy header JSON"
                    }
                  />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">Payload</h3>
                <div className="relative mt-1.5">
                  <pre className="max-h-64 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-xs leading-relaxed text-foreground dark:border-zinc-800 dark:bg-zinc-900/80 sm:text-sm">
                    {result.payloadJson}
                  </pre>
                  <CopyIconButton
                    placement="corner"
                    copied={payloadCopied}
                    onClick={() =>
                      copyToClipboard(result.payloadJson, "payload")
                    }
                    title={payloadCopied ? "Copied" : "Copy payload JSON"}
                    aria-label={
                      payloadCopied ? "Copied to clipboard" : "Copy payload JSON"
                    }
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {copyHint && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{copyHint}</p>
        )}
      </div>
    </div>
  );
}
