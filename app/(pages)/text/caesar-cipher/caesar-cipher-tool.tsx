"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  type CaesarMode,
  caesarTransform,
} from "@/lib/caesar-cipher-core";

const SAMPLE = `Attack at dawn!
The quick brown fox jumps over 13 lazy dogs.
Caesar shift demo — keep punctuation & 2026 digits.`;

function mod26(n: number): number {
  return ((n % 26) + 26) % 26;
}

export function CaesarCipherTool() {
  const [input, setInput] = useState(SAMPLE);
  const [shiftRaw, setShiftRaw] = useState("3");
  const [mode, setMode] = useState<CaesarMode>("encrypt");
  const [copyDone, setCopyDone] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const shiftNum = useMemo(() => {
    const n = Number.parseInt(shiftRaw.replace(/^\+/, "").trim(), 10);
    return Number.isFinite(n) ? n : 0;
  }, [shiftRaw]);

  const effectiveShift = mod26(shiftNum);

  const output = useMemo(
    () => caesarTransform(input, shiftNum, mode),
    [input, shiftNum, mode],
  );

  useEffect(() => {
    if (!copyDone) return;
    const t = window.setTimeout(() => setCopyDone(false), 2000);
    return () => window.clearTimeout(t);
  }, [copyDone]);

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output);
      setNotice(null);
      setCopyDone(true);
    } catch {
      setNotice("Clipboard blocked—select the output and copy manually.");
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNotice(null);
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("text/") && !file.name.endsWith(".txt")) {
      setNotice("Please choose a plain-text or .txt file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setInput(text);
    };
    reader.onerror = () =>
      setNotice("Could not read that file—try a smaller .txt file.");
    reader.readAsText(file, "UTF-8");
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <label
              htmlFor="caesar-input"
              className="block text-sm font-medium text-foreground"
            >
              Input text
            </label>
            <textarea
              id="caesar-input"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setNotice(null);
              }}
              spellCheck={false}
              rows={14}
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder="Paste plaintext or ciphertext…"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".txt,text/plain"
              className="sr-only"
              onChange={onFileChange}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <Upload className="size-4 shrink-0" aria-hidden />
              Upload .txt
            </button>
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
        </div>

        <div className="w-full shrink-0 space-y-4 lg:w-72">
          <fieldset>
            <legend className="text-sm font-medium text-foreground">
              Direction
            </legend>
            <div className="mt-2 flex flex-col gap-1.5">
              {(
                [
                  ["encrypt", "Encrypt", "Shift letters forward"],
                  ["decrypt", "Decrypt", "Shift letters backward"],
                ] as const
              ).map(([id, label, hint]) => (
                <label
                  key={id}
                  className="flex cursor-pointer items-start gap-2 rounded-lg border border-transparent px-2 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900/80 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-zinc-400 dark:has-[:focus-visible]:ring-zinc-600"
                >
                  <input
                    type="radio"
                    name="caesar-mode"
                    value={id}
                    checked={mode === id}
                    onChange={() => setMode(id)}
                    className="mt-0.5 rounded-full border-zinc-400 text-zinc-900 dark:border-zinc-600 dark:text-zinc-100"
                  />
                  <span>
                    <span className="font-medium text-foreground">
                      {label}
                    </span>
                    <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-400">
                      {hint}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="caesar-shift"
              className="text-sm font-medium text-foreground"
            >
              Shift (any integer, uses mod 26)
            </label>
            <input
              id="caesar-shift"
              type="number"
              inputMode="numeric"
              value={shiftRaw}
              onChange={(e) => {
                setShiftRaw(e.target.value);
                setNotice(null);
              }}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            />
            <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              Effective letter shift:{" "}
              <span className="font-mono text-foreground">{effectiveShift}</span>
              {shiftNum !== effectiveShift && shiftRaw.trim() !== "" ? (
                <span> (from {shiftNum})</span>
              ) : null}
            </p>
            <input
              type="range"
              min={0}
              max={25}
              value={effectiveShift}
              onChange={(e) => {
                const v = Number(e.target.value);
                setShiftRaw(String(v));
              }}
              className="mt-3 w-full accent-zinc-800 dark:accent-zinc-200"
              aria-label="Shift amount 0 to 25"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 min-w-0">
        <span
          id="caesar-output-label"
          className="text-sm font-medium text-foreground"
        >
          Output
        </span>
        <div className="relative mt-1.5">
          <textarea
            readOnly
            value={output}
            rows={10}
            spellCheck={false}
            aria-labelledby="caesar-output-label"
            className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none dark:border-zinc-800 dark:bg-zinc-950"
            placeholder="Ciphertext or plaintext appears here."
          />
          <button
            type="button"
            onClick={copyOutput}
            disabled={!output}
            title={copyDone ? "Copied" : "Copy output"}
            aria-label={copyDone ? "Copied to clipboard" : "Copy output"}
            className="absolute right-2 top-2 inline-flex items-center justify-center rounded-md border border-zinc-200 bg-zinc-50/95 p-1.5 text-foreground backdrop-blur-sm transition-colors hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-950/95 dark:hover:bg-zinc-900"
          >
            {copyDone ? (
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

      {notice ? (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
          {notice}
        </p>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        Only basic Latin A–Z and a–z are shifted; everything else is preserved.
        This is an educational Caesar cipher encoder/decoder—not a substitute
        for modern encryption.
      </p>
    </div>
  );
}
