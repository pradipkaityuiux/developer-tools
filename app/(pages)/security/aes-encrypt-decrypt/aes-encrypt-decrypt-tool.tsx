"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  DEFAULT_PBKDF2_ITERATIONS,
  encryptAes256Gcm,
  decryptAes256Gcm,
  MAX_PBKDF2_ITERATIONS,
  MIN_PBKDF2_ITERATIONS,
} from "@/lib/aes-encrypt-decrypt-core";
import { preventFocusScrollOnMouseDown } from "@/lib/prevent-focus-scroll";

export function AesEncryptDecryptTool() {
  const uploadId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [passphrase, setPassphrase] = useState("");
  const [iterations, setIterations] = useState(String(DEFAULT_PBKDF2_ITERATIONS));
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const iterNum = Number.parseInt(iterations, 10);
  const iterValid =
    Number.isInteger(iterNum) &&
    iterNum >= MIN_PBKDF2_ITERATIONS &&
    iterNum <= MAX_PBKDF2_ITERATIONS;

  const copyOutput = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Clipboard blocked—select the output and copy manually.");
    }
  }, [output]);

  const run = useCallback(async () => {
    setError(null);
    setOutput("");
    if (!passphrase.trim()) {
      setError("Enter a passphrase.");
      return;
    }
    if (!iterValid) {
      setError(
        `Iterations must be between ${MIN_PBKDF2_ITERATIONS.toLocaleString()} and ${MAX_PBKDF2_ITERATIONS.toLocaleString()}.`,
      );
      return;
    }
    setBusy(true);
    try {
      if (mode === "encrypt") {
        const bundle = await encryptAes256Gcm(passphrase, input, iterNum);
        setOutput(bundle);
      } else {
        const plain = await decryptAes256Gcm(passphrase, input);
        setOutput(plain);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }, [mode, passphrase, input, iterNum, iterValid]);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result;
      if (typeof r !== "string") {
        setError("Could not read that file as text.");
        return;
      }
      setInput(r);
    };
    reader.onerror = () =>
      setError(reader.error?.message ?? "Could not read the file.");
    reader.readAsText(f, "UTF-8");
  }

  const triggerUpload = () => fileRef.current?.click();

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-5">
        <div
          className="flex flex-wrap gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-900/50"
          role="tablist"
          aria-label="Mode"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "encrypt"}
            onMouseDown={preventFocusScrollOnMouseDown}
            onClick={() => {
              setMode("encrypt");
              setError(null);
              setOutput("");
            }}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "encrypt"
                ? "bg-white text-foreground shadow-sm dark:bg-zinc-800"
                : "text-zinc-600 hover:text-foreground dark:text-zinc-400"
            }`}
          >
            Encrypt
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "decrypt"}
            onMouseDown={preventFocusScrollOnMouseDown}
            onClick={() => {
              setMode("decrypt");
              setError(null);
              setOutput("");
            }}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "decrypt"
                ? "bg-white text-foreground shadow-sm dark:bg-zinc-800"
                : "text-zinc-600 hover:text-foreground dark:text-zinc-400"
            }`}
          >
            Decrypt
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="aes-pass"
              className="block text-sm font-medium text-foreground"
            >
              Passphrase
            </label>
            <input
              id="aes-pass"
              type="password"
              autoComplete="off"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder="Strong secret — never reuse across sites"
            />
          </div>
          <div>
            <label
              htmlFor="aes-iter"
              className="block text-sm font-medium text-foreground"
            >
              PBKDF2 iterations (encrypt only)
            </label>
            <input
              id="aes-iter"
              type="number"
              min={MIN_PBKDF2_ITERATIONS}
              max={MAX_PBKDF2_ITERATIONS}
              step={1000}
              disabled={mode === "decrypt"}
              value={iterations}
              onChange={(e) => setIterations(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Stored in the bundle. Higher is slower but harder to brute-force.
            </p>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="aes-input"
              className="text-sm font-medium text-foreground"
            >
              {mode === "encrypt"
                ? "Plaintext (UTF-8)"
                : "Ciphertext bundle (paste v1:…)"}
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileRef}
                id={`${uploadId}-file`}
                type="file"
                className="sr-only"
                onChange={onFileChange}
              />
              <button
                type="button"
                onMouseDown={preventFocusScrollOnMouseDown}
                onClick={triggerUpload}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Upload className="size-4 shrink-0" aria-hidden />
                Upload file
              </button>
            </div>
          </div>
          <textarea
            id="aes-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={mode === "encrypt"}
            rows={mode === "encrypt" ? 10 : 6}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            placeholder={
              mode === "encrypt"
                ? "Type or paste sensitive text — it stays in your browser until you encrypt."
                : "Paste the full line starting with v1:"
            }
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void run()}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {busy
              ? "Working…"
              : mode === "encrypt"
                ? "Encrypt"
                : "Decrypt"}
          </button>
          <button
            type="button"
            onClick={() => {
              setInput("");
              setOutput("");
              setError(null);
            }}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Clear fields
          </button>
        </div>

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium text-foreground">
              {mode === "encrypt" ? "Ciphertext bundle" : "Plaintext output"}
            </span>
            <button
              type="button"
              disabled={!output}
              onClick={() => void copyOutput()}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              {copied ? (
                <Check className="size-4 shrink-0 text-emerald-600" aria-hidden />
              ) : (
                <Copy className="size-4 shrink-0" aria-hidden />
              )}
              {copied ? "Copied" : "Copy output"}
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            rows={mode === "encrypt" ? 4 : 10}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-sm leading-relaxed text-foreground dark:border-zinc-800 dark:bg-zinc-900/50"
            placeholder={
              mode === "encrypt"
                ? "Encrypted bundle appears here."
                : "Decrypted UTF-8 text appears here."
            }
          />
        </div>

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Uses AES-256-GCM with a random 12-byte IV and PBKDF2-HMAC-SHA256. The
          v1 bundle encodes salt, iteration count, IV, and ciphertext—do not
          modify it. For large files, prefer encrypting a file locally with age
          or gpg; this UI is for text-sized payloads.
        </p>
      </div>
    </div>
  );
}
