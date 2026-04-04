"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Eye, EyeOff, Shield, Upload } from "lucide-react";
import {
  analyzePassword,
  buildStrengthReport,
  crackTimeLabel,
} from "@/lib/password-strength-core";
import { preventFocusScrollOnMouseDown } from "@/lib/prevent-focus-scroll";

function scoreHue(score: number): string {
  if (score >= 70) return "bg-emerald-500 dark:bg-emerald-400";
  if (score >= 50) return "bg-amber-500 dark:bg-amber-400";
  if (score >= 30) return "bg-orange-500 dark:bg-orange-400";
  if (score >= 15) return "bg-red-500 dark:bg-red-400";
  return "bg-zinc-400 dark:bg-zinc-600";
}

export function PasswordStrengthTool() {
  const uploadId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadNote, setUploadNote] = useState<string | null>(null);

  const analysis = useMemo(() => analyzePassword(password), [password]);
  const report = useMemo(
    () => buildStrengthReport(password, analysis),
    [password, analysis],
  );

  const copyReport = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [report]);

  const onFile = useCallback((file: File) => {
    setUploadNote(null);
    if (file.size > 64 * 1024) {
      setUploadNote("File is larger than 64 KB — paste the password instead.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      const line = text.split(/\r?\n/).find((l) => l.trim().length > 0) ?? "";
      setPassword(line.trim());
      setUploadNote(`Loaded first non-empty line from ${file.name}.`);
    };
    reader.onerror = () =>
      setUploadNote(reader.error?.message ?? "Could not read the file.");
    reader.readAsText(file, "UTF-8");
  }, []);

  return (
    <section
      className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6"
      aria-labelledby="pwd-strength-heading"
    >
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950/80">
          <Shield className="h-5 w-5 text-violet-700 dark:text-violet-300" aria-hidden />
        </div>
        <div>
          <h2
            id="pwd-strength-heading"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Password strength meter
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Type a candidate password or load the first line from a UTF-8 text file.
            Everything runs locally—nothing is sent to our servers.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <label className="block text-sm font-medium text-foreground" htmlFor="pwd-input">
          Password
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <div className="relative min-w-0 flex-1">
            <input
              id="pwd-input"
              name="password"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              type={visible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type or paste a password to analyze"
              className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 pr-24 font-mono text-sm text-foreground shadow-inner outline-none ring-offset-2 placeholder:text-zinc-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-violet-400 dark:focus:ring-violet-400/30"
            />
            <div className="absolute right-1 top-1/2 flex -translate-y-1/2 gap-0.5">
              <button
                type="button"
                onMouseDown={preventFocusScrollOnMouseDown}
                onClick={() => setVisible((v) => !v)}
                className="inline-flex h-9 items-center justify-center rounded-md px-2 text-zinc-500 hover:bg-zinc-100 hover:text-foreground dark:hover:bg-zinc-800"
                aria-pressed={visible}
                aria-label={visible ? "Hide password" : "Show password"}
              >
                {visible ? (
                  <EyeOff className="h-4 w-4" aria-hidden />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden />
                )}
              </button>
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <input
              ref={fileRef}
              id={uploadId}
              type="file"
              accept=".txt,text/plain,.text"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) onFile(f);
              }}
            />
            <button
              type="button"
              onMouseDown={preventFocusScrollOnMouseDown}
              onClick={() => fileRef.current?.click()}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-zinc-50 px-4 text-sm font-medium text-foreground hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 sm:flex-initial"
            >
              <Upload className="h-4 w-4 shrink-0" aria-hidden />
              Upload .txt
            </button>
            <button
              type="button"
              onMouseDown={preventFocusScrollOnMouseDown}
              onClick={() => {
                setPassword("");
                setUploadNote(null);
              }}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-transparent px-3 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Clear
            </button>
          </div>
        </div>
        {uploadNote ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
            {uploadNote}
          </p>
        ) : null}
      </div>

      <div className="mt-8">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-foreground">Strength</span>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {password.length === 0 ? (
              "Enter a password"
            ) : (
              <>
                <span className="font-medium text-foreground">{analysis.label}</span>
                {" · "}
                {analysis.score}/100
              </>
            )}
          </span>
        </div>
        <div
          className="h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={password.length ? analysis.score : 0}
          aria-label="Password strength score"
        >
          <div
            className={`h-full rounded-full transition-all duration-300 ${scoreHue(analysis.score)}`}
            style={{ width: `${password.length ? analysis.score : 0}%` }}
          />
        </div>
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Charset size (approx.)
          </dt>
          <dd className="mt-1 font-mono text-lg text-foreground">
            {password.length ? analysis.charsetSize.toLocaleString() : "—"}
          </dd>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Entropy (adjusted bits)
          </dt>
          <dd className="mt-1 font-mono text-lg text-foreground">
            {password.length ? analysis.adjustedBits.toFixed(1) : "—"}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-foreground">Crack time (rough)</h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Modeled as brute-force guesses divided by three attack speeds. Real attacks often
          start with dictionaries and leaks.
        </p>
        <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          <li className="flex justify-between gap-4">
            <span>Throttled online (~1k/s)</span>
            <span className="font-mono text-foreground">
              {password.length ? crackTimeLabel(analysis.crackSeconds.online) : "—"}
            </span>
          </li>
          <li className="flex justify-between gap-4">
            <span>Fast offline (~1e9/s)</span>
            <span className="font-mono text-foreground">
              {password.length ? crackTimeLabel(analysis.crackSeconds.offlineFast) : "—"}
            </span>
          </li>
          <li className="flex justify-between gap-4">
            <span>Extreme (~1e12/s)</span>
            <span className="font-mono text-foreground">
              {password.length
                ? crackTimeLabel(analysis.crackSeconds.offlineExtreme)
                : "—"}
            </span>
          </li>
        </ul>
      </div>

      {analysis.warnings.length > 0 ? (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/60 dark:bg-amber-950/40">
          <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
            Hardening tips
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-950/90 dark:text-amber-100/90">
            {analysis.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onMouseDown={preventFocusScrollOnMouseDown}
          onClick={copyReport}
          disabled={password.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-violet-700 disabled:pointer-events-none disabled:opacity-40 dark:bg-violet-600 dark:hover:bg-violet-500"
        >
          {copied ? (
            <Check className="h-4 w-4" aria-hidden />
          ) : (
            <Copy className="h-4 w-4" aria-hidden />
          )}
          {copied ? "Copied report" : "Copy report"}
        </button>
      </div>
    </section>
  );
}
