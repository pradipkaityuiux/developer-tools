"use client";

import { useCallback, useId, useState, type ChangeEvent } from "react";
import { Check, Copy, Upload } from "lucide-react";
import { encodeJwtHs256 } from "@/lib/jwt-encoder-core";
import { preventFocusScrollOnMouseDown } from "@/lib/prevent-focus-scroll";

const DEFAULT_HEADER = `{
  "alg": "HS256",
  "typ": "JWT"
}`;

const DEFAULT_PAYLOAD = `{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}`;

export function JwtEncoderTool() {
  const headerUploadId = useId();
  const payloadUploadId = useId();

  const [headerText, setHeaderText] = useState(DEFAULT_HEADER);
  const [payloadText, setPayloadText] = useState(DEFAULT_PAYLOAD);
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const runEncode = useCallback(async () => {
    setError(null);
    setToken(null);
    setBusy(true);
    try {
      const result = await encodeJwtHs256(headerText, payloadText, secret);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setToken(result.token);
    } finally {
      setBusy(false);
    }
  }, [headerText, payloadText, secret]);

  async function copyToken() {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Clipboard blocked — select the token and copy manually.");
    }
  }

  function loadFromFile(
    e: ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void,
  ) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") return;
      setter(result);
    };
    reader.readAsText(file, "UTF-8");
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div
        className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"
        role="status"
      >
        <strong className="font-medium">Security note:</strong> use only test
        secrets here. Anyone who knows the HS256 secret can forge tokens. Never
        ship production keys in the browser or commit them to repos.
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="jwt-enc-header"
              className="text-sm font-medium text-foreground"
            >
              Header (JSON object)
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                id={headerUploadId}
                type="file"
                accept=".json,.txt,application/json,text/plain"
                className="sr-only"
                onChange={(e) => loadFromFile(e, setHeaderText)}
              />
              <button
                type="button"
                onMouseDown={preventFocusScrollOnMouseDown}
                onClick={() =>
                  document.getElementById(headerUploadId)?.click()
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Upload className="size-3.5 shrink-0" aria-hidden />
                Upload
              </button>
            </div>
          </div>
          <textarea
            id="jwt-enc-header"
            value={headerText}
            onChange={(e) => setHeaderText(e.target.value)}
            spellCheck={false}
            rows={8}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
          />
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="jwt-enc-payload"
              className="text-sm font-medium text-foreground"
            >
              Payload (JSON object)
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                id={payloadUploadId}
                type="file"
                accept=".json,.txt,application/json,text/plain"
                className="sr-only"
                onChange={(e) => loadFromFile(e, setPayloadText)}
              />
              <button
                type="button"
                onMouseDown={preventFocusScrollOnMouseDown}
                onClick={() =>
                  document.getElementById(payloadUploadId)?.click()
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Upload className="size-3.5 shrink-0" aria-hidden />
                Upload
              </button>
            </div>
          </div>
          <textarea
            id="jwt-enc-payload"
            value={payloadText}
            onChange={(e) => setPayloadText(e.target.value)}
            spellCheck={false}
            rows={8}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="jwt-enc-secret"
          className="text-sm font-medium text-foreground"
        >
          Secret (HS256 key)
        </label>
        <input
          id="jwt-enc-secret"
          type="password"
          autoComplete="off"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => void runEncode()}
          className="rounded-lg border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {busy ? "Signing…" : "Sign & build JWT"}
        </button>
        <button
          type="button"
          onClick={() => {
            setHeaderText(DEFAULT_HEADER);
            setPayloadText(DEFAULT_PAYLOAD);
            setSecret("your-256-bit-secret");
            setToken(null);
            setError(null);
          }}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          Load sample
        </button>
        <button
          type="button"
          onClick={() => {
            setHeaderText("");
            setPayloadText("");
            setSecret("");
            setToken(null);
            setError(null);
          }}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          Clear all
        </button>
      </div>

      {error && (
        <p
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100"
          role="alert"
        >
          {error}
        </p>
      )}

      {token && (
        <div className="mt-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-foreground">JWT</h3>
            <button
              type="button"
              onClick={() => void copyToken()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              {copied ? (
                <Check className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
              ) : (
                <Copy className="size-3.5 shrink-0" aria-hidden />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="mt-1.5 max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs leading-relaxed text-foreground dark:border-zinc-800 dark:bg-zinc-900/80 sm:text-sm">
            {token}
          </pre>
        </div>
      )}
    </div>
  );
}
