"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  computeHmac,
  utf8Encode,
  type HmacHashAlgorithm,
  type HmacOutputEncoding,
} from "@/lib/hmac-generator-core";

const SAMPLE_SECRET = "whsec_test_abc123";
const SAMPLE_MESSAGE = `{"id":"evt_1","type":"payment.succeeded","amount":1999}`;

export function HmacGeneratorTool() {
  const secretUploadId = useId();
  const messageUploadId = useId();
  const secretFileRef = useRef<HTMLInputElement>(null);
  const messageFileRef = useRef<HTMLInputElement>(null);

  const [secret, setSecret] = useState(SAMPLE_SECRET);
  const [message, setMessage] = useState(SAMPLE_MESSAGE);
  const [hash, setHash] = useState<HmacHashAlgorithm>("SHA-256");
  const [encoding, setEncoding] = useState<HmacOutputEncoding>("hex");
  const [showSecret, setShowSecret] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const utf8SecretLen = utf8Encode(secret).length;
  const utf8MessageLen = utf8Encode(message).length;

  useEffect(() => {
    if (!copyHint) return;
    const t = window.setTimeout(() => setCopyHint(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyHint]);

  useEffect(() => {
    let cancelled = false;
    const handle = window.setTimeout(() => {
      setWorking(true);
      setError(null);
      void computeHmac(hash, secret, message, encoding)
        .then((out) => {
          if (cancelled) return;
          setResult(out);
          setWorking(false);
        })
        .catch((e: unknown) => {
          if (cancelled) return;
          setResult(null);
          setWorking(false);
          setError(
            e instanceof Error ? e.message : "HMAC failed in this browser.",
          );
        });
    }, 200);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [hash, secret, message, encoding]);

  async function copyResult() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopyHint("Copied to clipboard");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyHint("Copy blocked — select text manually");
    }
  }

  function readFileAsUtf8(file: File, into: "secret" | "message") {
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result;
      if (typeof r !== "string") return;
      if (into === "secret") setSecret(r);
      else setMessage(r);
    };
    reader.onerror = () =>
      setError(reader.error?.message ?? "Could not read the file.");
    reader.readAsText(file, "UTF-8");
  }

  function onSecretFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f) {
      setError(null);
      readFileAsUtf8(f, "secret");
    }
  }

  function onMessageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f) {
      setError(null);
      readFileAsUtf8(f, "message");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="hmac-secret"
                className="block text-sm font-medium text-foreground"
              >
                Secret key (UTF-8)
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={secretFileRef}
                  id={secretUploadId}
                  type="file"
                  className="sr-only"
                  accept=".txt,.key,.pem,text/plain"
                  onChange={onSecretFile}
                />
                <button
                  type="button"
                  onClick={() => secretFileRef.current?.click()}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  <Upload className="size-3.5 shrink-0" aria-hidden />
                  Upload file
                </button>
                <button
                  type="button"
                  onClick={() => setShowSecret((s) => !s)}
                  className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  {showSecret ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <input
              id="hmac-secret"
              type={showSecret ? "text" : "password"}
              value={secret}
              onChange={(e) => {
                setSecret(e.target.value);
                setError(null);
              }}
              autoComplete="off"
              spellCheck={false}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder="Webhook signing secret or shared API key"
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              UTF-8 byte length:{" "}
              <span className="font-mono text-foreground">{utf8SecretLen}</span>
            </p>
          </div>

          <div>
            <label
              htmlFor="hmac-algo"
              className="block text-sm font-medium text-foreground"
            >
              HMAC algorithm
            </label>
            <select
              id="hmac-algo"
              value={hash}
              onChange={(e) =>
                setHash(e.target.value as HmacHashAlgorithm)
              }
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="SHA-256">HMAC-SHA256</option>
              <option value="SHA-512">HMAC-SHA512</option>
            </select>
            <label
              htmlFor="hmac-encoding"
              className="mt-4 block text-sm font-medium text-foreground"
            >
              Output encoding
            </label>
            <select
              id="hmac-encoding"
              value={encoding}
              onChange={(e) =>
                setEncoding(e.target.value as HmacOutputEncoding)
              }
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="hex">Lowercase hex (common for webhooks)</option>
              <option value="base64">Base64 (standard)</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="hmac-message"
              className="block text-sm font-medium text-foreground"
            >
              Message / payload (UTF-8)
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                ref={messageFileRef}
                id={messageUploadId}
                type="file"
                className="sr-only"
                accept=".json,.txt,text/plain,application/json"
                onChange={onMessageFile}
              />
              <button
                type="button"
                onClick={() => messageFileRef.current?.click()}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Upload className="size-3.5 shrink-0" aria-hidden />
                Upload file
              </button>
            </div>
          </div>
          <textarea
            id="hmac-message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setError(null);
            }}
            spellCheck={false}
            rows={10}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            placeholder="Raw body exactly as the server will verify (often JSON with no extra spaces)."
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            UTF-8 byte length:{" "}
            <span className="font-mono text-foreground">{utf8MessageLen}</span>
            {working ? (
              <span className="ml-2 text-zinc-400">· updating…</span>
            ) : null}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setSecret(SAMPLE_SECRET);
              setMessage(SAMPLE_MESSAGE);
              setError(null);
            }}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Load sample
          </button>
          <button
            type="button"
            onClick={() => {
              setSecret("");
              setMessage("");
              setError(null);
            }}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Clear all
          </button>
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium text-foreground">
              HMAC output
            </span>
            <button
              type="button"
              disabled={!result}
              onClick={() => void copyResult()}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {copied ? (
                <Check className="size-4 shrink-0" aria-hidden />
              ) : (
                <Copy className="size-4 shrink-0" aria-hidden />
              )}
              Copy signature
            </button>
          </div>
          <div className="mt-2 min-h-[3rem] break-all rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-sm text-foreground dark:border-zinc-800 dark:bg-zinc-900/50">
            {error ? (
              <span className="text-red-600 dark:text-red-400">{error}</span>
            ) : result ? (
              result
            ) : (
              <span className="text-zinc-400">—</span>
            )}
          </div>
          {copyHint ? (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400" role="status">
              {copyHint}
            </p>
          ) : null}
        </div>

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          HMAC uses your secret as raw key bytes after UTF-8 encoding. Match the
          exact payload bytes your provider signs (often the raw HTTP body before
          parsing). For unkeyed SHA-256 digests of text, use the hash generator
          tool instead.
        </p>
      </div>
    </div>
  );
}
