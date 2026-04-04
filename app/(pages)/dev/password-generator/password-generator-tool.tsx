"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";

const MAX_COUNT = 500;
const MIN_LENGTH = 4;
const MAX_LENGTH = 256;

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
/** URL- and shell-friendly symbol set; extend via "Extra characters". */
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?/~`|";

const AMBIGUOUS = new Set([
  "0",
  "O",
  "o",
  "1",
  "l",
  "I",
  "|",
]);

function stripAmbiguous(s: string): string {
  return [...s].filter((c) => !AMBIGUOUS.has(c)).join("");
}

function uniqueChars(s: string): string {
  const seen = new Set<string>();
  let out = "";
  for (const c of s) {
    if (seen.has(c)) continue;
    seen.add(c);
    out += c;
  }
  return out;
}

/** Uniform integer in [0, maxExclusive) using rejection sampling (32-bit). */
function randomBelow(maxExclusive: number): number {
  if (maxExclusive <= 0) throw new Error("invalid range");
  if (maxExclusive === 1) return 0;
  const max =
    Math.floor(0x1_0000_0000 / maxExclusive) * maxExclusive;
  const buf = new Uint32Array(1);
  let x: number;
  do {
    crypto.getRandomValues(buf);
    x = buf[0]!;
  } while (x >= max);
  return x % maxExclusive;
}

function pickFrom(charset: string): string {
  if (!charset) throw new Error("empty charset");
  const i = randomBelow(charset.length);
  return charset[i]!;
}

function shuffleStringChars(chars: string[]): void {
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomBelow(i + 1);
    [chars[i], chars[j]] = [chars[j]!, chars[i]!];
  }
}

function buildCharset(
  useLower: boolean,
  useUpper: boolean,
  useDigits: boolean,
  useSymbols: boolean,
  excludeAmbiguous: boolean,
  extra: string,
): string {
  let raw = "";
  if (useLower) raw += LOWER;
  if (useUpper) raw += UPPER;
  if (useDigits) raw += DIGITS;
  if (useSymbols) raw += SYMBOLS;
  const extraClean = uniqueChars(
    [...extra].filter((c) => !/\s/u.test(c)).join(""),
  );
  raw += extraClean;
  let charset = uniqueChars(raw);
  if (excludeAmbiguous) charset = stripAmbiguous(charset);
  return uniqueChars(charset);
}

function requiredPools(
  useLower: boolean,
  useUpper: boolean,
  useDigits: boolean,
  useSymbols: boolean,
  excludeAmbiguous: boolean,
): string[] {
  const pools: string[] = [];
  if (useLower) {
    let p = LOWER;
    if (excludeAmbiguous) p = stripAmbiguous(p);
    if (p) pools.push(p);
  }
  if (useUpper) {
    let p = UPPER;
    if (excludeAmbiguous) p = stripAmbiguous(p);
    if (p) pools.push(p);
  }
  if (useDigits) {
    let p = DIGITS;
    if (excludeAmbiguous) p = stripAmbiguous(p);
    if (p) pools.push(p);
  }
  if (useSymbols) {
    let p = SYMBOLS;
    if (excludeAmbiguous) p = stripAmbiguous(p);
    if (p) pools.push(p);
  }
  return pools;
}

function generateOnePassword(
  length: number,
  charset: string,
  pools: string[],
): string {
  if (length < pools.length) {
    throw new Error(
      `Length must be at least ${pools.length} to include each selected character type.`,
    );
  }
  const picks: string[] = [];
  for (const pool of pools) {
    const available = [...pool].filter((c) => charset.includes(c)).join("");
    if (!available) {
      throw new Error(
        "One of the selected character types has no symbols left after exclusions—adjust options.",
      );
    }
    picks.push(pickFrom(available));
  }
  while (picks.length < length) {
    picks.push(pickFrom(charset));
  }
  shuffleStringChars(picks);
  return picks.join("");
}

function entropyBits(length: number, alphabetSize: number): number {
  if (alphabetSize < 2 || length < 1) return 0;
  return length * (Math.log(alphabetSize) / Math.LN2);
}

function makeBatch(
  len: number,
  num: number,
  useLower: boolean,
  useUpper: boolean,
  useDigits: boolean,
  useSymbols: boolean,
  excludeAmbiguous: boolean,
  extra: string,
): { passwords: string[]; error: string | null } {
  const charset = buildCharset(
    useLower,
    useUpper,
    useDigits,
    useSymbols,
    excludeAmbiguous,
    extra,
  );
  if (!charset.length) {
    return {
      passwords: [],
      error:
        "Choose at least one character type or add non-whitespace extra characters.",
    };
  }
  const pools = requiredPools(
    useLower,
    useUpper,
    useDigits,
    useSymbols,
    excludeAmbiguous,
  );
  const effectivePools = pools.length > 0 ? pools : [];
  const out: string[] = [];
  try {
    for (let i = 0; i < num; i++) {
      if (effectivePools.length > 0) {
        out.push(generateOnePassword(len, charset, effectivePools));
      } else {
        const picks: string[] = [];
        while (picks.length < len) {
          picks.push(pickFrom(charset));
        }
        out.push(picks.join(""));
      }
    }
    return { passwords: out, error: null };
  } catch (e) {
    return {
      passwords: [],
      error: e instanceof Error ? e.message : "Could not generate passwords.",
    };
  }
}

export function PasswordGeneratorTool() {
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(5);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [extraChars, setExtraChars] = useState("");
  const [passwords, setPasswords] = useState<string[]>(() => {
    const { passwords: p } = makeBatch(16, 5, true, true, true, true, false, "");
    return p;
  });
  const [error, setError] = useState<string | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const [outputCopied, setOutputCopied] = useState(false);

  const boundedLength = useMemo(() => {
    const n = Number.isFinite(length) ? Math.floor(length) : MIN_LENGTH;
    return Math.min(MAX_LENGTH, Math.max(MIN_LENGTH, n));
  }, [length]);

  const boundedCount = useMemo(() => {
    const n = Number.isFinite(count) ? Math.floor(count) : 1;
    return Math.min(MAX_COUNT, Math.max(1, n));
  }, [count]);

  const charset = useMemo(
    () =>
      buildCharset(
        useLower,
        useUpper,
        useDigits,
        useSymbols,
        excludeAmbiguous,
        extraChars,
      ),
    [
      useLower,
      useUpper,
      useDigits,
      useSymbols,
      excludeAmbiguous,
      extraChars,
    ],
  );

  const pools = useMemo(
    () =>
      requiredPools(
        useLower,
        useUpper,
        useDigits,
        useSymbols,
        excludeAmbiguous,
      ),
    [useLower, useUpper, useDigits, useSymbols, excludeAmbiguous],
  );

  const bits = useMemo(
    () => entropyBits(boundedLength, charset.length),
    [boundedLength, charset.length],
  );

  useEffect(() => {
    if (!copyHint) return;
    const t = window.setTimeout(() => setCopyHint(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyHint]);

  const generate = useCallback(() => {
    setOutputCopied(false);
    const { passwords: next, error: err } = makeBatch(
      boundedLength,
      boundedCount,
      useLower,
      useUpper,
      useDigits,
      useSymbols,
      excludeAmbiguous,
      extraChars,
    );
    setPasswords(next);
    setError(err);
  }, [
    boundedLength,
    boundedCount,
    useLower,
    useUpper,
    useDigits,
    useSymbols,
    excludeAmbiguous,
    extraChars,
  ]);

  async function copyToClipboard(value: string, isOutput = false) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyHint("Copied to clipboard");
      if (isOutput) {
        setOutputCopied(true);
        window.setTimeout(() => setOutputCopied(false), 2000);
      }
    } catch {
      setCopyHint("Copy blocked — select text manually");
    }
  }

  const outputText = passwords.join("\n");

  const onCharsetFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setError(null);
      const reader = new FileReader();
      reader.onload = () => {
        const text = typeof reader.result === "string" ? reader.result : "";
        setExtraChars((prev) => (prev ? `${prev}${text}` : text));
      };
      reader.onerror = () => {
        setError("Could not read the charset file.");
      };
      reader.readAsText(file, "UTF-8");
      e.target.value = "";
    },
    [],
  );

  const poolWarning =
    pools.length === 0 && uniqueChars(extraChars.replace(/\s/g, "")).length > 0;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label
              htmlFor="pw-length"
              className="block text-sm font-medium text-foreground"
            >
              Length ({MIN_LENGTH}–{MAX_LENGTH})
            </label>
            <input
              id="pw-length"
              type="number"
              min={MIN_LENGTH}
              max={MAX_LENGTH}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="mt-1.5 w-32 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            />
          </div>
          <div>
            <label
              htmlFor="pw-count"
              className="block text-sm font-medium text-foreground"
            >
              How many passwords (1–{MAX_COUNT})
            </label>
            <input
              id="pw-count"
              type="number"
              min={1}
              max={MAX_COUNT}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="mt-1.5 w-36 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            />
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-foreground">
            Character sets
          </legend>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {(
              [
                [useLower, setUseLower, "Lowercase (a–z)"],
                [useUpper, setUseUpper, "Uppercase (A–Z)"],
                [useDigits, setUseDigits, "Digits (0–9)"],
                [useSymbols, setUseSymbols, "Symbols"],
              ] as const
            ).map(([checked, setChecked, label]) => (
              <label
                key={label}
                className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
                />
                {label}
              </label>
            ))}
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={excludeAmbiguous}
                onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
              />
              Exclude ambiguous (0/O, 1/l/I, |)
            </label>
          </div>
        </fieldset>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="pw-extra"
              className="text-sm font-medium text-foreground"
            >
              Extra characters (optional)
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileRef}
                id={fileId}
                type="file"
                accept=".txt,text/plain"
                className="sr-only"
                onChange={onCharsetFile}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Upload className="size-4 shrink-0" aria-hidden />
                Load charset file
              </button>
            </div>
          </div>
          <textarea
            id="pw-extra"
            value={extraChars}
            onChange={(e) => {
              setExtraChars(e.target.value);
              setError(null);
            }}
            spellCheck={false}
            rows={2}
            placeholder="e.g. äöü or policy-specific symbols…"
            className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Non-whitespace characters merge into the alphabet. File upload
            appends UTF-8 contents.
          </p>
        </div>

        {poolWarning ? (
          <p className="text-sm text-amber-700 dark:text-amber-400" role="status">
            All preset types are off; passwords use only your extra characters
            (and deduplicated set). Turn presets on if you need guaranteed
            classes.
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => generate()}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Generate passwords
          </button>
          <button
            type="button"
            onClick={() => copyToClipboard(outputText)}
            disabled={!outputText}
            title={copyHint === "Copied to clipboard" ? "Copied" : "Copy all passwords"}
            aria-label={
              copyHint === "Copied to clipboard"
                ? "Copied to clipboard"
                : "Copy all passwords"
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <Copy className="size-4 shrink-0" aria-hidden />
          </button>
        </div>

        <div>
          <span
            id="pw-output-label"
            className="block text-sm font-medium text-foreground"
          >
            Output (one password per line)
          </span>
          <div className="relative mt-1.5">
            <textarea
              readOnly
              value={outputText}
              spellCheck={false}
              rows={Math.min(16, Math.max(4, passwords.length + 2))}
              aria-labelledby="pw-output-label"
              className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none dark:border-zinc-800 dark:bg-zinc-950"
              placeholder='Click "Generate passwords" to fill this area.'
            />
            <button
              type="button"
              onClick={() => copyToClipboard(outputText, true)}
              disabled={!outputText}
              title={outputCopied ? "Copied" : "Copy all passwords"}
              aria-label={
                outputCopied ? "Copied to clipboard" : "Copy all passwords"
              }
              className="absolute right-2 top-2 inline-flex items-center justify-center rounded-md border border-zinc-200 bg-zinc-50/95 p-1.5 text-foreground backdrop-blur-sm transition-colors hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-950/95 dark:hover:bg-zinc-900"
            >
              {outputCopied ? (
                <Check
                  className="size-[1.125rem] text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                />
              ) : (
                <Copy className="size-[1.125rem]" aria-hidden />
              )}
            </button>
          </div>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
          Alphabet size:{" "}
          <strong className="font-medium text-foreground">
            {charset.length}
          </strong>
          {" · "}
          Approx. entropy:{" "}
          <strong className="font-medium text-foreground">
            {bits.toFixed(1)} bits
          </strong>{" "}
          (for length {boundedLength}, uniform model).
        </p>

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        {copyHint ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{copyHint}</p>
        ) : null}

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Random bytes from{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
            crypto.getRandomValues
          </code>
          . Store production user passwords with a slow hash (Argon2, bcrypt,
          scrypt)—this page is for strong random strings and developer fixtures,
          not server-side credential storage.
        </p>
      </div>
    </div>
  );
}
