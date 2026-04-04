"use client";

import { Check, Copy, Loader2, Send, Upload } from "lucide-react";
import { useCallback, useId, useRef, useState } from "react";

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

type BodyMode = "none" | "json" | "raw" | "form";

type HeaderRow = { id: string; key: string; value: string };
type FormRow = { id: string; key: string; value: string };

type ResponseState = {
  ok: boolean;
  status: number;
  statusText: string;
  durationMs: number;
  url: string;
  headerLines: string[];
  bodyText: string;
  bodyDisplay: string;
  bodyKind: "json" | "text";
};

const METHODS: HttpMethod[] = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
];

const REQUEST_TIMEOUT_MS = 120_000;

function newRowId(): string {
  return `r-${Math.random().toString(36).slice(2, 11)}`;
}

function escapeShellSingleQuotes(s: string): string {
  return `'${s.replace(/'/g, `'\\''`)}'`;
}

function formatBodyDisplay(text: string): { display: string; kind: "json" | "text" } {
  const t = text.trim();
  if (!t) return { display: "", kind: "text" };
  try {
    const parsed = JSON.parse(t);
    return {
      display: JSON.stringify(parsed, null, 2),
      kind: "json",
    };
  } catch {
    return { display: text, kind: "text" };
  }
}

function buildCurl(opts: {
  method: HttpMethod;
  url: string;
  headerRows: HeaderRow[];
  bodyMode: BodyMode;
  bodyText: string;
  formRows: FormRow[];
}): string {
  const { method, url, headerRows, bodyMode, bodyText, formRows } = opts;
  const parts: string[] = [`curl -X ${method}`, escapeShellSingleQuotes(url)];

  for (const row of headerRows) {
    const k = row.key.trim();
    if (!k) continue;
    const line = `${k}: ${row.value}`;
    parts.push(`-H ${escapeShellSingleQuotes(line)}`);
  }

  if (bodyMode === "form") {
    const params = new URLSearchParams();
    for (const r of formRows) {
      if (r.key.trim()) params.append(r.key.trim(), r.value);
    }
    const encoded = params.toString();
    if (encoded) {
      parts.push(`--data ${escapeShellSingleQuotes(encoded)}`);
      if (!headerRows.some((h) => h.key.trim().toLowerCase() === "content-type")) {
        parts.push(
          `-H ${escapeShellSingleQuotes("Content-Type: application/x-www-form-urlencoded")}`,
        );
      }
    }
  } else if (bodyMode === "json" || bodyMode === "raw") {
    const raw = bodyText;
    if (raw.trim()) {
      parts.push(`--data-raw ${escapeShellSingleQuotes(raw)}`);
      if (
        bodyMode === "json" &&
        !headerRows.some((h) => h.key.trim().toLowerCase() === "content-type")
      ) {
        parts.push(
          `-H ${escapeShellSingleQuotes("Content-Type: application/json")}`,
        );
      }
    }
  }

  return parts.join(` \\\n  `);
}

export function HttpRequestBuilderTool() {
  const baseId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [url, setUrl] = useState("https://httpbin.org/get");
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [headerRows, setHeaderRows] = useState<HeaderRow[]>([
    { id: newRowId(), key: "Accept", value: "application/json" },
  ]);
  const [bodyMode, setBodyMode] = useState<BodyMode>("none");
  const [bodyText, setBodyText] = useState("");
  const [formRows, setFormRows] = useState<FormRow[]>([
    { id: newRowId(), key: "foo", value: "bar" },
  ]);
  const [credentials, setCredentials] = useState<"omit" | "include">("omit");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ResponseState | null>(null);

  const [copyKey, setCopyKey] = useState<string | null>(null);

  const flashCopy = useCallback((key: string) => {
    setCopyKey(key);
    setTimeout(() => setCopyKey(null), 2000);
  }, []);

  async function copyText(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      flashCopy(key);
    } catch {
      setError("Could not copy — select the text manually.");
    }
  }

  function addHeader() {
    setHeaderRows((rows) => [...rows, { id: newRowId(), key: "", value: "" }]);
  }

  function removeHeader(id: string) {
    setHeaderRows((rows) => rows.filter((r) => r.id !== id));
  }

  function updateHeader(id: string, field: "key" | "value", value: string) {
    setHeaderRows((rows) =>
      rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  }

  function addFormRow() {
    setFormRows((rows) => [...rows, { id: newRowId(), key: "", value: "" }]);
  }

  function removeFormRow(id: string) {
    setFormRows((rows) => rows.filter((r) => r.id !== id));
  }

  function updateFormRow(id: string, field: "key" | "value", value: string) {
    setFormRows((rows) =>
      rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  }

  function onPickBodyFile() {
    fileRef.current?.click();
  }

  function onBodyFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setBodyText(text);
      if (bodyMode === "none") setBodyMode("raw");
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function loadExample(kind: "get" | "postJson") {
    setError(null);
    setResponse(null);
    if (kind === "get") {
      setMethod("GET");
      setUrl("https://httpbin.org/get");
      setBodyMode("none");
      setBodyText("");
      setHeaderRows([
        { id: newRowId(), key: "Accept", value: "application/json" },
      ]);
    } else {
      setMethod("POST");
      setUrl("https://httpbin.org/post");
      setBodyMode("json");
      setBodyText(
        JSON.stringify(
          { message: "Hello from HTTP Request Builder", ts: Date.now() },
          null,
          2,
        ),
      );
      setHeaderRows([
        { id: newRowId(), key: "Accept", value: "application/json" },
      ]);
    }
  }

  const showBody =
    method !== "GET" && method !== "HEAD" && method !== "OPTIONS";

  async function sendRequest(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResponse(null);

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError("Enter a request URL.");
      return;
    }
    let parsed: URL;
    try {
      parsed = new URL(trimmedUrl);
    } catch {
      setError("Enter a valid absolute URL (https://…).");
      return;
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      setError("Only http and https URLs are supported.");
      return;
    }

    const headers = new Headers();
    for (const row of headerRows) {
      const k = row.key.trim();
      if (k) headers.append(k, row.value);
    }

    let body: BodyInit | undefined;
    if (showBody && bodyMode === "json" && bodyText.trim()) {
      body = bodyText;
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
    } else if (showBody && bodyMode === "raw" && bodyText.trim()) {
      body = bodyText;
    } else if (showBody && bodyMode === "form") {
      const params = new URLSearchParams();
      for (const r of formRows) {
        if (r.key.trim()) params.append(r.key.trim(), r.value);
      }
      const encoded = params.toString();
      if (encoded) {
        body = params;
        if (!headers.has("Content-Type")) {
          headers.set(
            "Content-Type",
            "application/x-www-form-urlencoded;charset=UTF-8",
          );
        }
      }
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    setLoading(true);
    const t0 = performance.now();
    try {
      const res = await fetch(parsed.toString(), {
        method,
        headers,
        body:
          method === "GET" || method === "HEAD" || method === "OPTIONS"
            ? undefined
            : body,
        credentials,
        mode: "cors",
        signal: controller.signal,
      });
      const durationMs = Math.round(performance.now() - t0);
      const text = await res.text();
      const { display, kind } = formatBodyDisplay(text);

      const headerLines: string[] = [];
      res.headers.forEach((value, key) => {
        headerLines.push(`${key}: ${value}`);
      });
      headerLines.sort((a, b) => a.localeCompare(b));

      setResponse({
        ok: res.ok,
        status: res.status,
        statusText: res.statusText || "",
        durationMs,
        url: res.url,
        headerLines,
        bodyText: text,
        bodyDisplay: display,
        bodyKind: kind,
      });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.name === "AbortError"
            ? `Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s.`
            : err.message
          : String(err);
      setError(
        msg.includes("fetch") || msg.includes("Load failed")
          ? `${msg} If the endpoint blocks browser cross-origin access, you will need a CORS-enabled API, a server-side proxy, or curl/Postman instead.`
          : msg,
      );
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  const curlPreview = buildCurl({
    method,
    url: url.trim() || "https://example.com",
    headerRows,
    bodyMode: showBody ? bodyMode : "none",
    bodyText,
    formRows,
  });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-foreground">Request</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadExample("get")}
              className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Sample GET
            </button>
            <button
              type="button"
              onClick={() => loadExample("postJson")}
              className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Sample POST JSON
            </button>
          </div>
        </div>

        <form onSubmit={sendRequest} className="mt-4 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="shrink-0 sm:w-40">
              <label
                htmlFor={`${baseId}-method`}
                className="block text-sm font-medium text-foreground"
              >
                Method
              </label>
              <select
                id={`${baseId}-method`}
                value={method}
                onChange={(e) => setMethod(e.target.value as HttpMethod)}
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
              >
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-0 flex-1">
              <label
                htmlFor={`${baseId}-url`}
                className="block text-sm font-medium text-foreground"
              >
                URL
              </label>
              <input
                id={`${baseId}-url`}
                type="url"
                name="url"
                inputMode="url"
                autoComplete="url"
                placeholder="https://api.example.com/v1/resource"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden />
                  Send
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-foreground">Credentials</span>
            <label className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <input
                type="radio"
                name={`${baseId}-cred`}
                checked={credentials === "omit"}
                onChange={() => setCredentials("omit")}
                className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900"
              />
              Omit (default)
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <input
                type="radio"
                name={`${baseId}-cred`}
                checked={credentials === "include"}
                onChange={() => setCredentials("include")}
                className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900"
              />
              Include (cookies)
            </label>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium text-foreground">Headers</span>
              <button
                type="button"
                onClick={addHeader}
                className="text-sm font-medium text-zinc-600 underline decoration-zinc-400 underline-offset-2 hover:text-foreground dark:text-zinc-400"
              >
                Add header
              </button>
            </div>
            <ul className="mt-2 space-y-2">
              {headerRows.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center"
                >
                  <input
                    type="text"
                    placeholder="Header name"
                    value={row.key}
                    onChange={(e) => updateHeader(row.id, "key", e.target.value)}
                    className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={row.value}
                    onChange={(e) =>
                      updateHeader(row.id, "value", e.target.value)
                    }
                    className="min-w-0 flex-[2] rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
                  />
                  <button
                    type="button"
                    onClick={() => removeHeader(row.id)}
                    className="shrink-0 rounded-lg border border-zinc-300 px-2 py-2 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {showBody ? (
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-foreground">
                  Request body
                </span>
                <select
                  value={bodyMode}
                  onChange={(e) => setBodyMode(e.target.value as BodyMode)}
                  className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                >
                  <option value="none">None</option>
                  <option value="json">JSON</option>
                  <option value="raw">Raw</option>
                  <option value="form">Form URL-encoded</option>
                </select>
              </div>

              {bodyMode === "form" ? (
                <div className="mt-2 space-y-2">
                  {formRows.map((row) => (
                    <div
                      key={row.id}
                      className="flex flex-col gap-2 sm:flex-row sm:items-center"
                    >
                      <input
                        type="text"
                        placeholder="field"
                        value={row.key}
                        onChange={(e) =>
                          updateFormRow(row.id, "key", e.target.value)
                        }
                        className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
                      />
                      <input
                        type="text"
                        placeholder="value"
                        value={row.value}
                        onChange={(e) =>
                          updateFormRow(row.id, "value", e.target.value)
                        }
                        className="min-w-0 flex-[2] rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
                      />
                      <button
                        type="button"
                        onClick={() => removeFormRow(row.id)}
                        className="shrink-0 rounded-lg border border-zinc-300 px-2 py-2 text-xs dark:border-zinc-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFormRow}
                    className="text-sm font-medium text-zinc-600 underline dark:text-zinc-400"
                  >
                    Add field
                  </button>
                </div>
              ) : bodyMode === "json" || bodyMode === "raw" ? (
                <div className="mt-2">
                  <input
                    ref={fileRef}
                    type="file"
                    className="sr-only"
                    aria-hidden
                    onChange={onBodyFileChange}
                  />
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={onPickBodyFile}
                      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                    >
                      <Upload className="h-3.5 w-3.5" aria-hidden />
                      Upload file
                    </button>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      Loads text into the body (JSON, XML, plain text).
                    </span>
                  </div>
                  <textarea
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    rows={12}
                    placeholder={
                      bodyMode === "json"
                        ? '{\n  "hello": "world"\n}'
                        : "Request payload…"
                    }
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-xs text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {method} requests do not send a body in this tool. Switch to POST,
              PUT, PATCH, or DELETE to attach JSON, raw text, or form data.
            </p>
          )}

          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-foreground">cURL preview</p>
          <button
            type="button"
            onClick={() => copyText("curl", curlPreview)}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            {copyKey === "curl" ? (
              <Check className="h-4 w-4 text-emerald-600" aria-hidden />
            ) : (
              <Copy className="h-4 w-4" aria-hidden />
            )}
            Copy curl
          </button>
        </div>
        <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-zinc-50 p-3 font-mono text-xs leading-relaxed text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
          {curlPreview}
        </pre>
      </div>

      {response ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Response</p>
              <p className="mt-1 font-mono text-sm text-foreground">
                <span
                  className={
                    response.ok
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-700 dark:text-amber-300"
                  }
                >
                  HTTP {response.status}
                </span>
                {response.statusText ? ` ${response.statusText}` : ""}
                <span className="text-zinc-500 dark:text-zinc-400">
                  {" "}
                  · {response.durationMs} ms
                </span>
              </p>
              <p className="mt-1 break-all font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {response.url}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => copyText("body", response.bodyText)}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                {copyKey === "body" ? (
                  <Check className="h-4 w-4 text-emerald-600" aria-hidden />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden />
                )}
                Copy body
              </button>
              <button
                type="button"
                onClick={() =>
                  copyText("headers", response.headerLines.join("\n"))
                }
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                {copyKey === "headers" ? (
                  <Check className="h-4 w-4 text-emerald-600" aria-hidden />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden />
                )}
                Copy headers
              </button>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Response headers
            </p>
            <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-zinc-50 p-3 font-mono text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              {response.headerLines.join("\n")}
            </pre>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Response body
            </p>
            <pre
              className={`mt-2 max-h-[min(70vh,28rem)] overflow-auto rounded-lg p-3 font-mono text-xs leading-relaxed ${
                response.bodyKind === "json"
                  ? "bg-zinc-50 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                  : "bg-zinc-50 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              }`}
            >
              {response.bodyDisplay || "(empty body)"}
            </pre>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950/50 dark:text-zinc-400">
          Send a request to see status, headers, and body here. Try the sample
          buttons if your network allows https://httpbin.org.
        </div>
      )}
    </div>
  );
}
