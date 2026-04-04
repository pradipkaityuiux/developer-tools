"use client";

import { useEffect, useMemo, useState } from "react";
import { CopyIconButton } from "@/components/copy-icon-button";

type ToolMode = "encode-component" | "encode-uri" | "decode";

const SAMPLE_ENCODE = `q=café résumé & price=$100
path segment: hello/world`;

const SAMPLE_DECODE =
  "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dcaf%C3%A9%20%26%20tea";

function decodeUrl(
  text: string,
  plusAsSpace: boolean,
): { ok: true; value: string } | { ok: false; message: string } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, message: "Enter text to decode." };
  }
  let s = trimmed;
  if (plusAsSpace) {
    s = s.replace(/\+/g, " ");
  }
  try {
    return { ok: true, value: decodeURIComponent(s) };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : String(e),
    };
  }
}

export function UrlEncoderTool() {
  const [input, setInput] = useState(SAMPLE_ENCODE);
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<ToolMode>("encode-component");
  const [plusAsSpace, setPlusAsSpace] = useState(true);
  const [lastError, setLastError] = useState<string | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);

  useEffect(() => {
    if (!copyHint) return;
    const t = window.setTimeout(() => setCopyHint(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyHint]);

  const previewDecode = useMemo(() => {
    if (mode !== "decode") return null;
    if (!input.trim()) return null;
    return decodeUrl(input, plusAsSpace);
  }, [input, mode, plusAsSpace]);

  async function copyToClipboard(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyHint("Copied to clipboard");
    } catch {
      setCopyHint("Copy blocked — select text manually");
    }
  }

  function runEncodeComponent() {
    setLastError(null);
    try {
      setOutput(encodeURIComponent(input));
    } catch (e) {
      setLastError(e instanceof Error ? e.message : String(e));
    }
  }

  function runEncodeUri() {
    setLastError(null);
    try {
      setOutput(encodeURI(input));
    } catch (e) {
      setLastError(e instanceof Error ? e.message : String(e));
    }
  }

  function runDecode() {
    const r = decodeUrl(input, plusAsSpace);
    if (r.ok) {
      setLastError(null);
      setOutput(r.value);
    } else {
      setLastError(r.message);
    }
  }

  function applyAction() {
    if (mode === "encode-component") runEncodeComponent();
    else if (mode === "encode-uri") runEncodeUri();
    else runDecode();
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <fieldset>
          <legend className="text-sm font-medium text-foreground">Mode</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(
              [
                ["encode-component", "Encode (query & segments)"],
                ["encode-uri", "Encode (full URI)"],
                ["decode", "Decode"],
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
                  name="url-tool-mode"
                  value={value}
                  checked={mode === value}
                  onChange={() => {
                    setMode(value);
                    setLastError(null);
                  }}
                  className="sr-only"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {mode === "decode" ? (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={plusAsSpace}
              onChange={(e) => setPlusAsSpace(e.target.checked)}
              className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900"
            />
            Treat <code className="mx-0.5 rounded bg-zinc-100 px-1 font-mono text-xs dark:bg-zinc-800">+</code>{" "}
            as space (form-urlencoded style)
          </label>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label
              htmlFor="url-input"
              className="block text-sm font-medium text-foreground"
            >
              Input
            </label>
            <textarea
              id="url-input"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setLastError(null);
              }}
              spellCheck={false}
              rows={10}
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder={
                mode === "decode"
                  ? "Paste percent-encoded text or a query substring…"
                  : "Paste plain text, a path segment, or a URL to encode…"
              }
            />
          </div>
          <div>
            <label
              htmlFor="url-output"
              className="block text-sm font-medium text-foreground"
            >
              Output
            </label>
            <div className="relative mt-1.5">
              <textarea
                id="url-output"
                value={output}
                readOnly
                spellCheck={false}
                rows={10}
                className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none dark:border-zinc-800 dark:bg-zinc-900/60"
                placeholder="Run Encode or Decode to see the result here."
              />
              <CopyIconButton
                placement="corner"
                copied={copyHint === "Copied to clipboard"}
                onClick={() => copyToClipboard(output)}
                disabled={!output}
                title="Copy output"
                aria-label="Copy output"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={applyAction}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {mode === "decode" ? "Decode" : "Encode"}
          </button>
          <button
            type="button"
            onClick={() => {
              setInput(output);
              setOutput("");
              setLastError(null);
            }}
            disabled={!output}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Swap to input
          </button>
          <button
            type="button"
            onClick={() => {
              setInput("");
              setOutput("");
              setLastError(null);
            }}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => {
              setInput(mode === "decode" ? SAMPLE_DECODE : SAMPLE_ENCODE);
              setOutput("");
              setLastError(null);
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
            <p className="mt-1 font-mono text-xs break-all opacity-90">
              {lastError}
            </p>
          </div>
        ) : mode === "decode" && previewDecode && previewDecode.ok ? (
          <p
            className="text-sm font-medium text-emerald-700 dark:text-emerald-400"
            role="status"
          >
            Input looks decodable — press Decode to write the result to output.
          </p>
        ) : mode === "decode" && previewDecode && !previewDecode.ok ? (
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300" role="status">
            Decode may fail: {previewDecode.message}. Check percent pairs or try
            the + as space option.
          </p>
        ) : !input.trim() ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
            Paste text or load the sample, then Encode or Decode.
          </p>
        ) : null}

        {copyHint ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{copyHint}</p>
        ) : null}

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          <strong className="font-medium text-foreground">Encode (query & segments)</strong> uses{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
            encodeURIComponent
          </code>
          . <strong className="font-medium text-foreground">Encode (full URI)</strong> uses{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
            encodeURI
          </code>
          . Decode uses{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
            decodeURIComponent
          </code>
          .
        </p>
      </div>
    </div>
  );
}
