"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";

const SAMPLE_PLAIN = `<p title="Tom & Jerry">Café & "tea"</p>`;

const SAMPLE_ENTITIES =
  '&lt;p title=&quot;Tom &amp; Jerry&quot;&gt;Caf&#233; &amp; &quot;tea&quot;&lt;/p&gt;';

function encodeHtmlEntities(input: string, numericNonAscii: boolean): string {
  let out = "";
  for (let i = 0; i < input.length; ) {
    const cp = input.codePointAt(i)!;
    const step = cp > 0xffff ? 2 : 1;

    if (cp === 0x26) out += "&amp;";
    else if (cp === 0x3c) out += "&lt;";
    else if (cp === 0x3e) out += "&gt;";
    else if (cp === 0x22) out += "&quot;";
    else if (cp === 0x27) out += "&#39;";
    else if (numericNonAscii && cp > 0x7f) out += `&#${cp};`;
    else out += String.fromCodePoint(cp);

    i += step;
  }
  return out;
}

function decodeHtmlEntities(input: string): string {
  const ta = document.createElement("textarea");
  ta.innerHTML = input;
  return ta.value;
}

export function HtmlEntitiesTool() {
  const inputId = useId();
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [numericNonAscii, setNumericNonAscii] = useState(false);
  const [input, setInput] = useState(SAMPLE_PLAIN);
  const [output, setOutput] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);

  const runEncode = useCallback(() => {
    setLastError(null);
    setCopyDone(false);
    if (!input.trim()) {
      setOutput("");
      setLastError("Enter text to encode.");
      return;
    }
    setOutput(encodeHtmlEntities(input, numericNonAscii));
  }, [input, numericNonAscii]);

  const runDecode = useCallback(() => {
    setLastError(null);
    setCopyDone(false);
    if (!input.trim()) {
      setOutput("");
      setLastError("Enter entity text to decode.");
      return;
    }
    try {
      setOutput(decodeHtmlEntities(input));
    } catch (e) {
      setOutput("");
      setLastError(e instanceof Error ? e.message : String(e));
    }
  }, [input]);

  const applyAction = useCallback(() => {
    if (mode === "encode") runEncode();
    else runDecode();
  }, [mode, runDecode, runEncode]);

  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);
    setLastError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setInput(text);
      setOutput("");
      setCopyDone(false);
    };
    reader.onerror = () => {
      setFileError("Could not read the file.");
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopyDone(true);
      window.setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setLastError("Clipboard access failed—select the output and copy manually.");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <fieldset>
          <legend className="text-sm font-medium text-foreground">Mode</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(
              [
                ["encode", "Encode to entities"],
                ["decode", "Decode entities"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  mode === value
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                    : "border-zinc-300 bg-white text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                }`}
              >
                <input
                  type="radio"
                  name="html-entities-mode"
                  value={value}
                  checked={mode === value}
                  onChange={() => {
                    setMode(value);
                    setLastError(null);
                    setCopyDone(false);
                  }}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {mode === "encode" ? (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={numericNonAscii}
              onChange={(e) => setNumericNonAscii(e.target.checked)}
              className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900"
            />
            Encode non-ASCII as decimal numeric entities (Unicode code points above 127)
          </label>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor={inputId}
                className="block text-sm font-medium text-foreground"
              >
                Input
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileRef}
                  id={fileId}
                  type="file"
                  accept=".html,.htm,.txt,.md,.xml,text/plain,text/html"
                  className="sr-only"
                  onChange={onFile}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  <Upload className="size-4 shrink-0" aria-hidden />
                  Upload file
                </button>
              </div>
            </div>
            <textarea
              id={inputId}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setLastError(null);
                setCopyDone(false);
              }}
              spellCheck={false}
              rows={10}
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder={
                mode === "decode"
                  ? "Paste text with &amp;lt; &amp;#39; &amp;#x263A; style references…"
                  : "Paste raw HTML, attributes, or plain text to escape…"
              }
            />
            {fileError ? (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
                {fileError}
              </p>
            ) : null}
          </div>

          <div>
            <span
              id="html-entities-output-label"
              className="text-sm font-medium text-foreground"
            >
              Output
            </span>
            <div className="relative mt-1.5">
              <textarea
                readOnly
                spellCheck={false}
                rows={10}
                value={output}
                aria-labelledby="html-entities-output-label"
                className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none dark:border-zinc-800 dark:bg-zinc-900/60"
                placeholder={
                  mode === "decode"
                    ? "Run Decode to see plain text here."
                    : "Run Encode to see entity-safe text here."
                }
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
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={applyAction}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {mode === "encode" ? "Encode" : "Decode"}
          </button>
          <button
            type="button"
            onClick={() => {
              setInput(output);
              setOutput("");
              setLastError(null);
              setCopyDone(false);
            }}
            disabled={!output}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Swap to input
          </button>
          <button
            type="button"
            onClick={copyOutput}
            disabled={!output}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            {copyDone ? (
              <Check
                className="size-4 text-emerald-600 dark:text-emerald-400"
                aria-hidden
              />
            ) : (
              <Copy className="size-4" aria-hidden />
            )}
            Copy output
          </button>
          <button
            type="button"
            onClick={() => {
              setInput("");
              setOutput("");
              setLastError(null);
              setFileError(null);
              setCopyDone(false);
            }}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => {
              setInput(mode === "decode" ? SAMPLE_ENTITIES : SAMPLE_PLAIN);
              setOutput("");
              setLastError(null);
              setCopyDone(false);
            }}
            className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Load sample
          </button>
        </div>

        {lastError ? (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            <p className="font-medium">Could not complete operation</p>
            <p className="mt-1 font-mono text-xs break-all opacity-90">{lastError}</p>
          </div>
        ) : !input.trim() ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
            Paste text, upload a file, or load the sample, then Encode or Decode.
          </p>
        ) : null}

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          <strong className="font-medium text-foreground">Encode</strong> turns{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">&amp;</code>,{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">&lt;</code>,{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">&gt;</code>,{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">&quot;</code>, and{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">&apos;</code> into
          entities; optional numeric mode covers letters outside ASCII.{" "}
          <strong className="font-medium text-foreground">Decode</strong> uses the browser’s HTML
          entity parsing (named and numeric references).
        </p>
      </div>
    </div>
  );
}
