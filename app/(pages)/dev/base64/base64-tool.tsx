"use client";

import { useEffect, useState, type ChangeEvent } from "react";

const SAMPLE_PLAIN =
  'Hello — Base64 encodes UTF-8 bytes.\nLine 2: APIs, data URIs, & debugging.';

function utf8ToBase64Binary(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

function base64BinaryToUtf8(b64: string): string {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function stripDataUrlPrefix(s: string): string {
  const t = s.trim();
  const m = /^data:[^;]*;base64,([\s\S]*)$/i.exec(t);
  return m?.[1]?.trim() ?? t;
}

function normalizeForDecode(s: string): string {
  let t = stripDataUrlPrefix(s);
  t = t.replace(/\s/g, "");
  t = t.replace(/-/g, "+").replace(/_/g, "/");
  const pad = t.length % 4;
  if (pad === 2) t += "==";
  else if (pad === 3) t += "=";
  else if (pad === 1) throw new Error("Invalid Base64 length (extra character).");
  return t;
}

function toUrlSafe(standard: string): string {
  return standard.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fileToBase64Data(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl !== "string") {
        reject(new Error("Could not read file."));
        return;
      }
      const i = dataUrl.indexOf(",");
      resolve(i >= 0 ? dataUrl.slice(i + 1) : dataUrl);
    };
    reader.onerror = () =>
      reject(reader.error ?? new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

export function Base64Tool() {
  const [text, setText] = useState(SAMPLE_PLAIN);
  const [urlSafe, setUrlSafe] = useState(false);
  const [wrapLines, setWrapLines] = useState(false);
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<"encode" | "decode" | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!copyHint) return;
    const t = window.setTimeout(() => setCopyHint(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyHint]);

  async function copyToClipboard(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyHint("Copied to clipboard");
    } catch {
      setCopyHint("Copy blocked — select text manually");
    }
  }

  function applyLineWrap(b64: string): string {
    if (!wrapLines) return b64;
    const chunks: string[] = [];
    for (let i = 0; i < b64.length; i += 76) {
      chunks.push(b64.slice(i, i + 76));
    }
    return chunks.join("\n");
  }

  function onEncode() {
    setActionError(null);
    try {
      const raw = text;
      if (!raw.length) {
        setActionError("Enter text to encode.");
        return;
      }
      let out = utf8ToBase64Binary(raw);
      if (urlSafe) out = toUrlSafe(out);
      setText(applyLineWrap(out));
      setLastAction("encode");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : String(e));
    }
  }

  function onDecode() {
    setActionError(null);
    try {
      const raw = text.trim();
      if (!raw.length) {
        setActionError("Enter Base64 to decode.");
        return;
      }
      const normalized = normalizeForDecode(raw);
      const out = base64BinaryToUtf8(normalized);
      setText(out);
      setLastAction("decode");
    } catch (e) {
      setActionError(
        e instanceof Error ? e.message : "Invalid Base64 or corrupted data.",
      );
    }
  }

  async function onEncodeFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setActionError(null);
    try {
      let out = await fileToBase64Data(file);
      if (urlSafe) out = toUrlSafe(out);
      setText(applyLineWrap(out));
      setLastAction("encode");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Could not encode file.",
      );
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(e) => setUrlSafe(e.target.checked)}
              className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900"
            />
            URL-safe Base64 (Base64URL:{" "}
            <code className="font-mono text-xs">- _</code>, no padding)
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={wrapLines}
              onChange={(e) => setWrapLines(e.target.checked)}
              className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900"
            />
            Wrap encoded output at 76 characters (PEM-style readability)
          </label>
        </div>

        <div>
          <label
            htmlFor="base64-io"
            className="block text-sm font-medium text-foreground"
          >
            Text / Base64
          </label>
          <textarea
            id="base64-io"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setLastAction(null);
              setActionError(null);
            }}
            spellCheck={false}
            rows={14}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            placeholder="Type text to encode, or paste Base64 / data:...;base64,... to decode."
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onEncode}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Encode UTF-8 → Base64
          </button>
          <button
            type="button"
            onClick={onDecode}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Decode Base64 → UTF-8
          </button>
          <label className="inline-flex cursor-pointer items-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800">
            <span>Encode file</span>
            <input
              type="file"
              className="sr-only"
              onChange={onEncodeFile}
            />
          </label>
          <button
            type="button"
            onClick={() => {
              setText("");
              setLastAction(null);
              setActionError(null);
            }}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => copyToClipboard(text)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Copy
          </button>
          <button
            type="button"
            onClick={() => {
              setText(SAMPLE_PLAIN);
              setLastAction(null);
              setActionError(null);
            }}
            className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Load sample text
          </button>
        </div>

        {actionError ? (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            <p className="font-medium">Could not complete action</p>
            <p className="mt-1 font-mono text-xs break-all opacity-90">
              {actionError}
            </p>
          </div>
        ) : null}

        {!actionError ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
            {lastAction === "encode"
              ? "Output is Base64 (or URL-safe Base64) of your UTF-8 input."
              : lastAction === "decode"
                ? "Output is UTF-8 text decoded from Base64."
                : "Encode plain text or decode Base64; paste full data URIs when decoding embedded assets."}
          </p>
        ) : null}

        {copyHint ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{copyHint}</p>
        ) : null}

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Decoding accepts standard and URL-safe alphabets, ignores whitespace,
          and strips{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
            data:...;base64,
          </code>{" "}
          prefixes. This is not encryption—treat decoded content as sensitive
          only if the original was secret.
        </p>
      </div>
    </div>
  );
}
