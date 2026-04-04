"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  SSL_DECODER_SAMPLE_PEM,
  decodeCertificatePems,
  type DecodedCertificate,
  sha256FingerprintColonHex,
} from "@/lib/ssl-decoder-core";

function summaryText(data: DecodedCertificate): string {
  const lines = [
    `Subject: ${data.subject}`,
    `Issuer: ${data.issuer}`,
    `Serial: ${data.serialNumber}`,
    `Not before: ${data.notBeforeIso}`,
    `Not after: ${data.notAfterIso}`,
    `Validity (browser clock): ${data.validityHint}`,
    `Signature: ${data.signatureAlgorithm}`,
    `Public key: ${data.publicKeySummary}`,
  ];
  if (data.basicConstraints) lines.push(`Basic constraints: ${data.basicConstraints}`);
  if (data.keyUsages?.length) lines.push(`Key usage: ${data.keyUsages.join(", ")}`);
  if (data.extendedKeyUsages?.length) {
    lines.push(`Extended key usage: ${data.extendedKeyUsages.join(", ")}`);
  }
  if (data.subjectAltNames.length) {
    lines.push("Subject Alternative Name:");
    for (const san of data.subjectAltNames) {
      lines.push(`  ${san.type}: ${san.value}`);
    }
  }
  return lines.join("\n");
}

export function SslDecoderTool() {
  const uploadId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState(SSL_DECODER_SAMPLE_PEM);
  const [copyWhich, setCopyWhich] = useState<string | null>(null);
  const [fingerprints, setFingerprints] = useState<(string | null)[]>([]);

  const parsed = useMemo(() => decodeCertificatePems(input), [input]);

  useEffect(() => {
    if (!copyWhich) return;
    const t = window.setTimeout(() => setCopyWhich(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyWhich]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { blocks } = decodeCertificatePems(input);
      const next: (string | null)[] = [];
      for (const b of blocks) {
        if (b.ok) {
          next.push(await sha256FingerprintColonHex(b.pem));
        } else {
          next.push(null);
        }
      }
      if (!cancelled) setFingerprints(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [input]);

  async function copyText(value: string, id: string) {
    if (!value.trim()) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopyWhich(id);
    } catch {
      setCopyWhich("error");
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setInput(text);
    };
    reader.onerror = () => setInput("");
    reader.readAsText(file, "utf-8");
  }

  const hasBlocks = parsed.blocks.length > 0;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div
        className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"
        role="status"
      >
        <strong className="font-medium">Privacy:</strong> certificates are
        decoded locally in your browser. This tool does{" "}
        <strong className="font-medium">not</strong> verify trust chains or
        signatures—use it to read PEM structure and metadata only.
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <div>
          <label
            htmlFor="ssl-pem-input"
            className="block text-sm font-medium text-foreground"
          >
            PEM certificate(s)
          </label>
          <textarea
            id="ssl-pem-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            rows={10}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setInput(SSL_DECODER_SAMPLE_PEM)}
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

          <input
            ref={fileRef}
            id={uploadId}
            type="file"
            accept=".pem,.crt,.cer,.txt,text/plain"
            className="sr-only"
            onChange={onFileChange}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <Upload className="size-4 shrink-0" aria-hidden />
            Upload file
          </button>
        </div>

        {parsed.empty ? (
          <p
            className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300"
            role="status"
          >
            Paste one or more PEM blocks (each starting with{" "}
            <code className="rounded bg-zinc-200/80 px-1 font-mono text-xs dark:bg-zinc-800">
              BEGIN CERTIFICATE
            </code>
            ), or use <strong className="font-medium">Upload file</strong>.
          </p>
        ) : null}

        {hasBlocks ? (
          <div className="space-y-6">
            {parsed.blocks.map((block, idx) => (
              <div
                key={`${idx}-${block.ok ? "ok" : "err"}`}
                className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    Certificate {idx + 1}
                    {parsed.blocks.length > 1 ? ` of ${parsed.blocks.length}` : ""}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {block.ok ? (
                      <button
                        type="button"
                        onClick={() =>
                          void copyText(summaryText(block.data), `sum-${idx}`)
                        }
                        className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                      >
                        {copyWhich === `sum-${idx}` ? (
                          <Check
                            className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                            aria-hidden
                          />
                        ) : (
                          <Copy className="size-3.5 shrink-0" aria-hidden />
                        )}
                        Copy summary
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => void copyText(block.pem, `pem-${idx}`)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                    >
                      {copyWhich === `pem-${idx}` ? (
                        <Check
                          className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                          aria-hidden
                        />
                      ) : (
                        <Copy className="size-3.5 shrink-0" aria-hidden />
                      )}
                      Copy PEM
                    </button>
                  </div>
                </div>

                {!block.ok ? (
                  <p
                    className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100"
                    role="alert"
                  >
                    {block.error}
                  </p>
                ) : (
                  <>
                    {block.data.validityHint === "expired" ? (
                      <p
                        className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100"
                        role="status"
                      >
                        By <strong className="font-medium">notAfter</strong>, this
                        certificate appears{" "}
                        <strong className="font-medium">expired</strong> relative
                        to your system clock—confirm against the live server or CA
                        tooling.
                      </p>
                    ) : null}
                    {block.data.validityHint === "not_yet_valid" ? (
                      <p
                        className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"
                        role="status"
                      >
                        <strong className="font-medium">notBefore</strong> is in
                        the future—certificate not yet valid by date comparison.
                      </p>
                    ) : null}
                    {block.data.validityHint === "valid_now" ? (
                      <p
                        className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100"
                        role="status"
                      >
                        Date window overlaps the current time (local clock)—still
                        not a trust or signature check.
                      </p>
                    ) : null}

                    <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                      <div className="rounded-md border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/80">
                        <dt className="text-zinc-500 dark:text-zinc-400">Subject</dt>
                        <dd className="mt-0.5 break-words font-mono text-xs text-foreground sm:text-sm">
                          {block.data.subject}
                        </dd>
                      </div>
                      <div className="rounded-md border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/80">
                        <dt className="text-zinc-500 dark:text-zinc-400">Issuer</dt>
                        <dd className="mt-0.5 break-words font-mono text-xs text-foreground sm:text-sm">
                          {block.data.issuer}
                        </dd>
                      </div>
                      <div className="rounded-md border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/80">
                        <dt className="text-zinc-500 dark:text-zinc-400">
                          Serial number
                        </dt>
                        <dd className="mt-0.5 font-mono text-xs text-foreground sm:text-sm">
                          {block.data.serialNumber}
                        </dd>
                      </div>
                      <div className="rounded-md border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/80">
                        <dt className="text-zinc-500 dark:text-zinc-400">
                          Public key
                        </dt>
                        <dd className="mt-0.5 font-mono text-xs text-foreground sm:text-sm">
                          {block.data.publicKeySummary}
                        </dd>
                      </div>
                      <div className="rounded-md border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/80">
                        <dt className="text-zinc-500 dark:text-zinc-400">
                          Not before (UTC)
                        </dt>
                        <dd className="mt-0.5 font-mono text-xs text-foreground sm:text-sm">
                          {block.data.notBeforeIso}
                        </dd>
                      </div>
                      <div className="rounded-md border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/80">
                        <dt className="text-zinc-500 dark:text-zinc-400">
                          Not after (UTC)
                        </dt>
                        <dd className="mt-0.5 font-mono text-xs text-foreground sm:text-sm">
                          {block.data.notAfterIso}
                        </dd>
                      </div>
                      <div className="sm:col-span-2 rounded-md border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/80">
                        <dt className="text-zinc-500 dark:text-zinc-400">
                          Signature algorithm
                        </dt>
                        <dd className="mt-0.5 font-mono text-xs text-foreground sm:text-sm">
                          {block.data.signatureAlgorithm}
                        </dd>
                      </div>
                      {fingerprints[idx] ? (
                        <div className="sm:col-span-2 rounded-md border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/80">
                          <dt className="text-zinc-500 dark:text-zinc-400">
                            SHA-256 fingerprint (DER)
                          </dt>
                          <dd className="mt-0.5 break-all font-mono text-xs text-foreground">
                            {fingerprints[idx]}
                          </dd>
                        </div>
                      ) : null}
                    </dl>

                    {block.data.basicConstraints ? (
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <strong className="text-foreground">Basic constraints:</strong>{" "}
                        {block.data.basicConstraints}
                      </p>
                    ) : null}

                    {block.data.keyUsages?.length ? (
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        <strong className="text-foreground">Key usage:</strong>{" "}
                        {block.data.keyUsages.join(", ")}
                      </p>
                    ) : null}

                    {block.data.extendedKeyUsages?.length ? (
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        <strong className="text-foreground">
                          Extended key usage:
                        </strong>{" "}
                        {block.data.extendedKeyUsages.join(", ")}
                      </p>
                    ) : null}

                    {block.data.subjectAltNames.length > 0 ? (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-foreground">
                          Subject Alternative Name
                        </p>
                        <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
                          {block.data.subjectAltNames.map((san, i) => (
                            <li key={`${san.type}-${i}-${san.value}`}>
                              <span className="font-mono text-xs text-foreground">
                                {san.type}
                              </span>
                              {": "}
                              <span className="break-all">{san.value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-500">
                        No Subject Alternative Name extension found on this
                        certificate (some older or specialized certs omit SAN).
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {copyWhich === "error" ? (
          <p className="text-sm text-amber-800 dark:text-amber-200" role="alert">
            Clipboard blocked—copy manually or adjust browser permissions.
          </p>
        ) : null}
      </div>
    </div>
  );
}
