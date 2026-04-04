"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  binaryToTextUtf8,
  textToBinaryUtf8,
  type BinaryByteSeparator,
} from "@/lib/text-to-binary-core";

const SAMPLE_TEXT = `Hello, UTF-8
Emoji: 🚀`;

const SAMPLE_BINARY = `01001000 01100101 01101100 01101100 01101111`;

type Mode = "encode" | "decode";

export function TextToBinaryTool() {
  const inputId = useId();
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>("encode");
  const [separator, setSeparator] = useState<BinaryByteSeparator>("spaced");
  const [input, setInput] = useState(SAMPLE_TEXT);
  const [notice, setNotice] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);

  const { output, decodeError } = useMemo(() => {
    if (mode === "encode") {
      return { output: textToBinaryUtf8(input, separator), decodeError: null };
    }
    const result = binaryToTextUtf8(input);
    if (result.ok) {
      return { output: result.text, decodeError: null };
    }
    return { output: "", decodeError: result.error };
  }, [input, mode, separator]);

  useEffect(() => {
    if (!copyDone) return;
    const t = window.setTimeout(() => setCopyDone(false), 2000);
    return () => window.clearTimeout(t);
  }, [copyDone]);

  async function copyOutput() {
    if (!output) return;
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

  function loadSample() {
    setNotice(null);
    setInput(mode === "encode" ? SAMPLE_TEXT : SAMPLE_BINARY);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-foreground">Mode</span>
          <div
            className="inline-flex rounded-lg border border-zinc-300 p-0.5 dark:border-zinc-600"
            role="group"
            aria-label="Conversion mode"
          >
            <button
              type="button"
              onClick={() => {
                setMode("encode");
                setNotice(null);
              }}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === "encode"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-600 hover:text-foreground dark:text-zinc-400"
              }`}
            >
              Text → binary
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("decode");
                setNotice(null);
              }}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === "decode"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-600 hover:text-foreground dark:text-zinc-400"
              }`}
            >
              Binary → text
            </button>
          </div>

          {mode === "encode" ? (
            <>
              <span
                className="hidden h-4 w-px bg-zinc-300 sm:block dark:bg-zinc-600"
                aria-hidden
              />
              <label className="flex flex-wrap items-center gap-2 text-sm text-foreground">
                <span className="font-medium">Byte spacing</span>
                <select
                  value={separator}
                  onChange={(e) =>
                    setSeparator(e.target.value as BinaryByteSeparator)
                  }
                  className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-900"
                >
                  <option value="spaced">Spaces between bytes</option>
                  <option value="compact">Compact (no spaces)</option>
                </select>
              </label>
            </>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <label
                htmlFor={inputId}
                className="block text-sm font-medium text-foreground"
              >
                {mode === "encode" ? "Plain text (UTF-8)" : "Binary input"}
              </label>
              <textarea
                id={inputId}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setNotice(null);
                }}
                spellCheck={mode === "encode"}
                rows={12}
                className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
                placeholder={
                  mode === "encode"
                    ? "Type or paste any Unicode text…"
                    : "Paste 0/1 bits — spaces and line breaks are ignored…"
                }
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileRef}
                id={fileId}
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
                onClick={copyOutput}
                disabled={!output}
                title={copyDone ? "Copied" : "Copy output"}
                aria-label={copyDone ? "Copied output" : "Copy output"}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                {copyDone ? (
                  <Check
                    className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                    aria-hidden
                  />
                ) : (
                  <Copy className="size-4 shrink-0" aria-hidden />
                )}
                Copy output
              </button>
              <button
                type="button"
                onClick={() => setInput("")}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={loadSample}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                Load sample
              </button>
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <label
                htmlFor="text-to-binary-output"
                className="block text-sm font-medium text-foreground"
              >
                {mode === "encode" ? "Binary output" : "Decoded text"}
              </label>
              <textarea
                id="text-to-binary-output"
                readOnly
                value={output}
                rows={12}
                aria-invalid={mode === "decode" && !!decodeError}
                className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none dark:border-zinc-700 dark:bg-zinc-900/60"
              />
            </div>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              {mode === "encode"
                ? "Each UTF-8 byte becomes eight bits (high bit first). Multi-byte characters expand to multiple groups."
                : "Only characters 0 and 1 are counted; everything else is ignored. Length must be a multiple of eight bits."}
            </p>
          </div>
        </div>
      </div>

      {decodeError ? (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
          {decodeError}
        </p>
      ) : null}
      {notice ? (
        <p className="mt-4 text-sm text-amber-700 dark:text-amber-400" role="status">
          {notice}
        </p>
      ) : null}

      <p className="mt-6 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        Conversion runs in your browser. Binary here is a visualization of
        UTF-8 bytes, not encryption.
      </p>
    </div>
  );
}
