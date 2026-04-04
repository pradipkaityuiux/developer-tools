"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Check, Copy, Upload } from "lucide-react";

type InputBase = 2 | 8 | 10 | 16;

const SAMPLE_BY_BASE: Record<InputBase, string> = {
  2: "0b1010_0100",
  8: "0o755",
  10: "255",
  16: "0xff",
};

function stripSeparators(s: string): string {
  return s.replace(/\s+/g, "").replace(/_/g, "");
}

function normalizeForBase(raw: string, base: InputBase): string {
  let t = raw.trim();
  const neg = t.startsWith("-") || t.startsWith("+");
  const sign = t.startsWith("-") ? "-" : "";
  if (neg) t = t.slice(1);
  t = stripSeparators(t);
  if (base === 2 && /^0b/i.test(t)) t = t.slice(2);
  if (base === 8 && /^0o/i.test(t)) t = t.slice(2);
  if (base === 16 && /^0x/i.test(t)) t = t.slice(2);
  return sign + t.toLowerCase();
}

function parseBigIntFromBase(s: string, radix: InputBase): bigint {
  const norm = normalizeForBase(s, radix);
  if (norm === "" || norm === "-" || norm === "+")
    throw new Error("Enter at least one digit.");
  const neg = norm.startsWith("-");
  const body = neg ? norm.slice(1) : norm;
  if (body === "") throw new Error("Enter at least one digit.");

  let n = BigInt(0);
  for (let i = 0; i < body.length; i++) {
    const ch = body[i]!;
    let digit: number;
    const code = ch.charCodeAt(0);
    if (code >= 48 && code <= 57) digit = code - 48;
    else if (code >= 97 && code <= 102) digit = 10 + (code - 97);
    else throw new Error(`Invalid character for base ${radix}: ${ch}`);
    if (digit >= radix) throw new Error(`Digit "${ch}" is not valid in base ${radix}.`);
    n = n * BigInt(radix) + BigInt(digit);
  }
  return neg ? -n : n;
}

function groupBinaryMsbFirst(bin: string, bits: number): string {
  const neg = bin.startsWith("-");
  const v = neg ? bin.slice(1) : bin;
  if (v === "0") return bin;
  const pad = (bits - (v.length % bits)) % bits;
  const padded = (pad ? "0".repeat(pad) : "") + v;
  const parts: string[] = [];
  for (let i = 0; i < padded.length; i += bits) {
    parts.push(padded.slice(i, i + bits));
  }
  return (neg ? "-" : "") + parts.join(" ");
}

type CopyKey = "bin" | "oct" | "dec" | "hex";

export function NumberConverterTool() {
  const [inputBase, setInputBase] = useState<InputBase>(10);
  const [input, setInput] = useState(SAMPLE_BY_BASE[10]);
  const [groupBinary, setGroupBinary] = useState(true);
  const [hexUpper, setHexUpper] = useState(false);
  const [hexPrefix, setHexPrefix] = useState(false);
  const [toolError, setToolError] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState<CopyKey | null>(null);

  const parseResult = useMemo(() => {
    try {
      return {
        ok: true as const,
        value: parseBigIntFromBase(input, inputBase),
      };
    } catch (e) {
      return {
        ok: false as const,
        message: e instanceof Error ? e.message : "Invalid number.",
      };
    }
  }, [input, inputBase]);

  const value = parseResult.ok ? parseResult.value : null;

  const binRaw = value !== null ? value.toString(2) : "";
  const binDisplay =
    value !== null && groupBinary ? groupBinaryMsbFirst(binRaw, 4) : binRaw;
  const octOut = value !== null ? value.toString(8) : "";
  const decOut = value !== null ? value.toString(10) : "";

  const hexDisplay = useMemo(() => {
    if (value === null) return "";
    const raw = value.toString(16);
    const neg = raw.startsWith("-");
    const body = neg ? raw.slice(1) : raw;
    const bodyCased = hexUpper ? body.toUpperCase() : body;
    if (hexPrefix) return `${neg ? "-" : ""}0x${bodyCased}`;
    return `${neg ? "-" : ""}${bodyCased}`;
  }, [value, hexUpper, hexPrefix]);

  const displayError = toolError ?? (parseResult.ok ? null : parseResult.message);

  useEffect(() => {
    if (!copyDone) return;
    const t = window.setTimeout(() => setCopyDone(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyDone]);

  async function copyText(key: CopyKey, text: string) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopyDone(key);
      setToolError(null);
    } catch {
      setToolError("Clipboard blocked — select the value and copy manually.");
    }
  }

  function onBaseChange(next: InputBase) {
    setInputBase(next);
    setInput(SAMPLE_BY_BASE[next]);
    setToolError(null);
  }

  function onUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") return;
      setInput(result.trim());
      setToolError(null);
    };
    reader.onerror = () =>
      setToolError("Could not read the file — try a plain text file.");
    reader.readAsText(file, "UTF-8");
  }

  function OutputRow({
    id,
    label,
    valueText,
    copyKey,
  }: {
    id: string;
    label: string;
    valueText: string;
    copyKey: CopyKey;
  }) {
    return (
      <div className="min-w-0">
        <label
          htmlFor={id}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
        <div className="relative mt-1.5">
          <input
            id={id}
            readOnly
            value={valueText}
            spellCheck={false}
            aria-readonly
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-sm text-foreground outline-none dark:border-zinc-800 dark:bg-zinc-950"
            placeholder="—"
          />
          <button
            type="button"
            onClick={() => copyText(copyKey, valueText)}
            disabled={!valueText}
            title={copyDone === copyKey ? "Copied" : `Copy ${label}`}
            aria-label={copyDone === copyKey ? "Copied" : `Copy ${label}`}
            className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50/95 p-1.5 text-foreground backdrop-blur-sm transition-colors hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-950/95 dark:hover:bg-zinc-900"
          >
            {copyDone === copyKey ? (
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
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="nc-input-base" className="text-sm text-foreground">
              Input base
            </label>
            <select
              id="nc-input-base"
              value={inputBase}
              onChange={(e) => onBaseChange(Number(e.target.value) as InputBase)}
              className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm text-foreground dark:border-zinc-600 dark:bg-zinc-900"
            >
              <option value={2}>Binary (2)</option>
              <option value={8}>Octal (8)</option>
              <option value={10}>Decimal (10)</option>
              <option value={16}>Hexadecimal (16)</option>
            </select>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={groupBinary}
              onChange={(e) => setGroupBinary(e.target.checked)}
              className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900"
            />
            Group binary by 4 bits (nibbles)
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={hexUpper}
              onChange={(e) => setHexUpper(e.target.checked)}
              className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900"
            />
            Uppercase hex
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={hexPrefix}
              onChange={(e) => setHexPrefix(e.target.checked)}
              className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900"
            />
            Show{" "}
            <code className="font-mono text-xs">0x</code> on hex
          </label>
        </div>

        <div>
          <label htmlFor="nc-input" className="block text-sm font-medium text-foreground">
            Value in selected base
          </label>
          <textarea
            id="nc-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setToolError(null);
            }}
            spellCheck={false}
            rows={3}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            placeholder="e.g. 255 (decimal), 0xff (hex), 0b11111111 (binary) …"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
            <Upload className="size-4 shrink-0" aria-hidden />
            <span>Load from file</span>
            <input
              type="file"
              accept=".txt,text/plain"
              className="sr-only"
              onChange={onUpload}
            />
          </label>
          <button
            type="button"
            onClick={() => {
              setInput(SAMPLE_BY_BASE[inputBase]);
              setToolError(null);
            }}
            className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Load sample
          </button>
          <button
            type="button"
            onClick={() => {
              setInput("");
              setToolError(null);
            }}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Clear
          </button>
        </div>

        {displayError ? (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            {displayError}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <OutputRow
            id="nc-out-bin"
            label="Binary"
            valueText={value !== null ? binDisplay : ""}
            copyKey="bin"
          />
          <OutputRow
            id="nc-out-oct"
            label="Octal"
            valueText={octOut}
            copyKey="oct"
          />
          <OutputRow
            id="nc-out-dec"
            label="Decimal"
            valueText={decOut}
            copyKey="dec"
          />
          <OutputRow
            id="nc-out-hex"
            label="Hexadecimal"
            valueText={value !== null ? hexDisplay : ""}
            copyKey="hex"
          />
        </div>

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Integers only, parsed with{" "}
          <strong className="font-medium text-foreground">BigInt</strong> for
          exact large values. Binary grouping affects spaces only. Hex prefix{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
            0x
          </code>{" "}
          applies after the sign, e.g.{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
            -0xff
          </code>{" "}
          for negative values.
        </p>
      </div>
    </div>
  );
}
