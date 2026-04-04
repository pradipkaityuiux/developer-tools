"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Check, Copy, Loader2, Upload } from "lucide-react";
import {
  generateRsaKeyPairPem,
  parsePemFromText,
} from "@/lib/rsa-key-generator-core";

const BIT_LENGTHS = [1024, 2048, 3072, 4096] as const;
type BitLength = (typeof BIT_LENGTHS)[number];

export function RsaKeyGeneratorTool() {
  const uploadId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [bits, setBits] = useState<BitLength>(2048);
  const [publicPem, setPublicPem] = useState("");
  const [privatePem, setPrivatePem] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyWhich, setCopyWhich] = useState<
    "public" | "private" | "both" | null
  >(null);

  useEffect(() => {
    if (!copyWhich) return;
    const t = window.setTimeout(() => setCopyWhich(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyWhich]);

  const generate = useCallback(async () => {
    setError(null);
    setBusy(true);
    try {
      const pair = await generateRsaKeyPairPem(bits);
      setPublicPem(pair.publicPem);
      setPrivatePem(pair.privatePem);
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : "Key generation failed in this browser.";
      setError(
        `${msg} Try a different modulus length (2048 or 4096) or update your browser. Some environments restrict very small RSA sizes.`,
      );
    } finally {
      setBusy(false);
    }
  }, [bits]);

  async function copyText(
    value: string,
    which: "public" | "private" | "both",
  ) {
    if (!value.trim()) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopyWhich(which);
      setError(null);
    } catch {
      setError("Clipboard blocked—select the PEM text and copy manually.");
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      const { publicPem: pub, privatePem: priv } = parsePemFromText(text);
      if (!pub && !priv) {
        setError(
          "No PEM blocks found. Expected BEGIN PUBLIC KEY and/or BEGIN PRIVATE KEY (or BEGIN RSA PRIVATE KEY).",
        );
        return;
      }
      if (pub) setPublicPem(pub);
      if (priv) setPrivatePem(priv);
    };
    reader.onerror = () =>
      setError("Could not read that file. Try a UTF-8 text PEM file.");
    reader.readAsText(file, "utf-8");
  }

  const bothPem =
    publicPem && privatePem
      ? `${publicPem}\n\n${privatePem}`
      : publicPem || privatePem;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <span className="block text-sm font-medium text-foreground">
              Modulus length
            </span>
            <div
              className="mt-1.5 flex flex-wrap gap-2"
              role="group"
              aria-label="RSA modulus length in bits"
            >
              {BIT_LENGTHS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setBits(n)}
                  disabled={busy}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                    bits === n
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border-zinc-300 bg-white text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  }`}
                >
                  {n} bit
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void generate()}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {busy ? (
              <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
            ) : null}
            {busy ? "Generating…" : "Generate key pair"}
          </button>

          <input
            ref={fileRef}
            id={uploadId}
            type="file"
            accept=".pem,.txt,text/plain"
            className="sr-only"
            onChange={onFileChange}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <Upload className="size-4 shrink-0" aria-hidden />
            Upload PEM file
          </button>

          <button
            type="button"
            disabled={!bothPem.trim()}
            onClick={() => bothPem && copyText(bothPem, "both")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            {copyWhich === "both" ? (
              <Check
                className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                aria-hidden
              />
            ) : (
              <Copy className="size-4 shrink-0" aria-hidden />
            )}
            Copy public + private
          </button>
        </div>

        {error ? (
          <p
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="rsa-public-pem"
                className="text-sm font-medium text-foreground"
              >
                Public key (PEM)
              </label>
              <button
                type="button"
                disabled={!publicPem.trim()}
                onClick={() => copyText(publicPem, "public")}
                title={copyWhich === "public" ? "Copied" : "Copy public key"}
                aria-label={
                  copyWhich === "public"
                    ? "Copied public key"
                    : "Copy public key"
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                {copyWhich === "public" ? (
                  <Check
                    className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                    aria-hidden
                  />
                ) : (
                  <Copy className="size-3.5 shrink-0" aria-hidden />
                )}
                Copy
              </button>
            </div>
            <textarea
              id="rsa-public-pem"
              value={publicPem}
              onChange={(e) => setPublicPem(e.target.value)}
              spellCheck={false}
              placeholder="-----BEGIN PUBLIC KEY-----…"
              rows={12}
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-xs leading-relaxed text-foreground outline-none dark:border-zinc-700 dark:bg-zinc-900/80"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="rsa-private-pem"
                className="text-sm font-medium text-foreground"
              >
                Private key (PEM)
              </label>
              <button
                type="button"
                disabled={!privatePem.trim()}
                onClick={() => copyText(privatePem, "private")}
                title={copyWhich === "private" ? "Copied" : "Copy private key"}
                aria-label={
                  copyWhich === "private"
                    ? "Copied private key"
                    : "Copy private key"
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                {copyWhich === "private" ? (
                  <Check
                    className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                    aria-hidden
                  />
                ) : (
                  <Copy className="size-3.5 shrink-0" aria-hidden />
                )}
                Copy
              </button>
            </div>
            <textarea
              id="rsa-private-pem"
              value={privatePem}
              onChange={(e) => setPrivatePem(e.target.value)}
              spellCheck={false}
              placeholder="-----BEGIN PRIVATE KEY-----…"
              rows={12}
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-xs leading-relaxed text-foreground outline-none dark:border-zinc-700 dark:bg-zinc-900/80"
            />
          </div>
        </div>

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Keys are generated with{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
            RSA-OAEP
          </code>{" "}
          and{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
            SHA-256
          </code>{" "}
          in the Web Cryptography API. PEM uses SPKI (public) and PKCS#8
          (private). Protect private keys like passwords.
        </p>
      </div>
    </div>
  );
}
