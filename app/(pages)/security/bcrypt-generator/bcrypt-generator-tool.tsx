"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { Check, Copy, Loader2, Upload } from "lucide-react";
import {
  BCRYPT_COST_MAX,
  BCRYPT_COST_MIN,
  compareBcrypt,
  hashBcrypt,
  looksLikeBcryptHash,
} from "@/lib/bcrypt-generator-core";

const SAMPLE_PLAIN = "correct horse battery staple";

export function BcryptGeneratorTool() {
  const [mode, setMode] = useState<"generate" | "verify">("generate");
  const [plain, setPlain] = useState(SAMPLE_PLAIN);
  const [cost, setCost] = useState(10);
  const [hashOut, setHashOut] = useState<string | null>(null);
  const [hashError, setHashError] = useState<string | null>(null);
  const [hashing, setHashing] = useState(false);

  const [verifyHash, setVerifyHash] = useState("");
  const [verifyPlain, setVerifyPlain] = useState(SAMPLE_PLAIN);
  const [verifyResult, setVerifyResult] = useState<"idle" | "match" | "mismatch" | "error">(
    "idle",
  );
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const [copyHashDone, setCopyHashDone] = useState(false);
  const [statusHint, setStatusHint] = useState<string | null>(null);

  const utf8Bytes = new TextEncoder().encode(plain).length;

  useEffect(() => {
    if (!statusHint) return;
    const t = window.setTimeout(() => setStatusHint(null), 2500);
    return () => window.clearTimeout(t);
  }, [statusHint]);

  async function runGenerate() {
    setHashError(null);
    setHashOut(null);
    setHashing(true);
    try {
      const h = await hashBcrypt(plain, cost);
      setHashOut(h);
    } catch (e) {
      setHashError(e instanceof Error ? e.message : "Hash failed");
    } finally {
      setHashing(false);
    }
  }

  async function runVerify() {
    setVerifyResult("idle");
    setVerifyMessage(null);
    const h = verifyHash.trim();
    if (!h) {
      setVerifyMessage("Paste a bcrypt hash to compare.");
      setVerifyResult("error");
      return;
    }
    if (!looksLikeBcryptHash(h)) {
      setVerifyMessage(
        "That does not look like a bcrypt hash (expected $2a$, $2b$, or $2y$).",
      );
      setVerifyResult("error");
      return;
    }
    setVerifying(true);
    try {
      const ok = await compareBcrypt(verifyPlain, h);
      setVerifyResult(ok ? "match" : "mismatch");
      setVerifyMessage(
        ok
          ? "The password matches this bcrypt hash."
          : "The password does not match this bcrypt hash.",
      );
    } catch (e) {
      setVerifyResult("error");
      setVerifyMessage(e instanceof Error ? e.message : "Compare failed");
    } finally {
      setVerifying(false);
    }
  }

  async function copyHash() {
    if (!hashOut) return;
    try {
      await navigator.clipboard.writeText(hashOut);
      setCopyHashDone(true);
      setStatusHint("Hash copied to clipboard");
      window.setTimeout(() => setCopyHashDone(false), 2000);
    } catch {
      setStatusHint("Copy blocked — select the hash manually");
    }
  }

  function onUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") return;
      if (mode === "generate") {
        setPlain(result);
        setHashOut(null);
        setHashError(null);
      } else {
        setVerifyPlain(result);
        setVerifyResult("idle");
        setVerifyMessage(null);
      }
    };
    reader.readAsText(file, "UTF-8");
  }

  function loadSample() {
    if (mode === "generate") {
      setPlain(SAMPLE_PLAIN);
      setHashOut(null);
      setHashError(null);
    } else {
      void (async () => {
        setVerifyPlain(SAMPLE_PLAIN);
        setVerifyHash("");
        setVerifyResult("idle");
        setVerifyMessage(null);
        setVerifying(true);
        try {
          const h = await hashBcrypt(SAMPLE_PLAIN, 10);
          setVerifyHash(h);
          const ok = await compareBcrypt(SAMPLE_PLAIN, h);
          setVerifyResult(ok ? "match" : "mismatch");
          setVerifyMessage(
            ok
              ? "The password matches this bcrypt hash."
              : "The password does not match this bcrypt hash.",
          );
        } catch (err) {
          setVerifyResult("error");
          setVerifyMessage(err instanceof Error ? err.message : "Sample failed");
        } finally {
          setVerifying(false);
        }
      })();
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <fieldset className="flex flex-wrap gap-3 border-0 p-0">
        <legend className="sr-only">Mode</legend>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <input
            type="radio"
            name="bcrypt-mode"
            checked={mode === "generate"}
            onChange={() => {
              setMode("generate");
              setVerifyResult("idle");
              setVerifyMessage(null);
            }}
            className="size-4 border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
          />
          Generate hash
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <input
            type="radio"
            name="bcrypt-mode"
            checked={mode === "verify"}
            onChange={() => {
              setMode("verify");
              setHashOut(null);
              setHashError(null);
            }}
            className="size-4 border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
          />
          Verify password
        </label>
      </fieldset>

      {mode === "generate" ? (
        <div className="mt-6 flex flex-col gap-4">
          <div>
            <label
              htmlFor="bcrypt-plain"
              className="block text-sm font-medium text-foreground"
            >
              Plaintext (password or test string)
            </label>
            <textarea
              id="bcrypt-plain"
              value={plain}
              onChange={(e) => {
                setPlain(e.target.value);
                setHashOut(null);
                setHashError(null);
              }}
              spellCheck={false}
              rows={5}
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder="Type or paste a password — only the first 72 UTF-8 bytes are used by bcrypt."
            />
            <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              UTF-8 byte length:{" "}
              <span className="font-mono text-foreground">{utf8Bytes}</span>
              {utf8Bytes > 72 ? (
                <span className="text-amber-600 dark:text-amber-400">
                  {" "}
                  — bcrypt uses at most 72 bytes; extra bytes are ignored.
                </span>
              ) : null}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="min-w-[12rem] flex-1">
              <label
                htmlFor="bcrypt-cost"
                className="block text-sm font-medium text-foreground"
              >
                Cost factor (salt rounds):{" "}
                <span className="font-mono text-foreground">{cost}</span>
              </label>
              <input
                id="bcrypt-cost"
                type="range"
                min={BCRYPT_COST_MIN}
                max={BCRYPT_COST_MAX}
                value={cost}
                onChange={(e) => {
                  setCost(Number(e.target.value));
                  setHashOut(null);
                  setHashError(null);
                }}
                className="mt-2 w-full accent-zinc-900 dark:accent-zinc-100"
              />
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Range {BCRYPT_COST_MIN}–{BCRYPT_COST_MAX}. Higher = slower, stronger against
                brute force.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800">
              <Upload className="size-4 shrink-0" aria-hidden />
              <span>Upload .txt</span>
              <input
                type="file"
                accept=".txt,text/plain"
                className="sr-only"
                onChange={onUpload}
              />
            </label>
            <button
              type="button"
              onClick={loadSample}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Load sample
            </button>
            <button
              type="button"
              onClick={() => {
                setPlain("");
                setHashOut(null);
                setHashError(null);
              }}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => void runGenerate()}
              disabled={hashing}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {hashing ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : null}
              {hashing ? "Hashing…" : "Generate bcrypt hash"}
            </button>
          </div>

          {hashError ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {hashError}
            </p>
          ) : null}

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium text-foreground">Bcrypt hash</span>
              <button
                type="button"
                onClick={() => void copyHash()}
                disabled={!hashOut}
                title={copyHashDone ? "Copied" : "Copy hash"}
                aria-label={copyHashDone ? "Copied to clipboard" : "Copy bcrypt hash"}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                {copyHashDone ? (
                  <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden />
                ) : (
                  <Copy className="size-3.5" aria-hidden />
                )}
                {copyHashDone ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="relative mt-1.5">
              <textarea
                readOnly
                value={hashOut ?? ""}
                rows={4}
                spellCheck={false}
                placeholder='Click "Generate bcrypt hash" — output appears here.'
                className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-3 pr-3 font-mono text-xs leading-relaxed text-foreground outline-none sm:text-sm dark:border-zinc-800 dark:bg-zinc-950"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          <div>
            <label
              htmlFor="bcrypt-verify-plain"
              className="block text-sm font-medium text-foreground"
            >
              Plaintext password
            </label>
            <textarea
              id="bcrypt-verify-plain"
              value={verifyPlain}
              onChange={(e) => {
                setVerifyPlain(e.target.value);
                setVerifyResult("idle");
                setVerifyMessage(null);
              }}
              spellCheck={false}
              rows={4}
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            />
          </div>
          <div>
            <label
              htmlFor="bcrypt-verify-hash"
              className="block text-sm font-medium text-foreground"
            >
              Stored bcrypt hash
            </label>
            <textarea
              id="bcrypt-verify-hash"
              value={verifyHash}
              onChange={(e) => {
                setVerifyHash(e.target.value);
                setVerifyResult("idle");
                setVerifyMessage(null);
              }}
              spellCheck={false}
              rows={3}
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-xs leading-relaxed text-foreground outline-none sm:text-sm focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
              placeholder="$2a$10$..."
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800">
              <Upload className="size-4 shrink-0" aria-hidden />
              <span>Upload .txt to plaintext</span>
              <input
                type="file"
                accept=".txt,text/plain"
                className="sr-only"
                onChange={onUpload}
              />
            </label>
            <button
              type="button"
              onClick={loadSample}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Load sample
            </button>
            <button
              type="button"
              onClick={() => void runVerify()}
              disabled={verifying}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {verifying ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : null}
              {verifying ? "Comparing…" : "Compare"}
            </button>
          </div>

          {verifyMessage ? (
            <p
              className={
                verifyResult === "match"
                  ? "text-sm text-emerald-700 dark:text-emerald-400"
                  : verifyResult === "mismatch"
                    ? "text-sm text-amber-800 dark:text-amber-300"
                    : "text-sm text-red-600 dark:text-red-400"
              }
              role="status"
            >
              {verifyMessage}
            </p>
          ) : null}
        </div>
      )}

      {statusHint ? (
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400" role="status">
          {statusHint}
        </p>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        Runs in your browser with bcryptjs — nothing is uploaded. Use only for development and
        testing; production sign-up flows should hash on a trusted server.
      </p>
    </div>
  );
}
