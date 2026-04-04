"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Trash2, Upload } from "lucide-react";

const STORAGE_KEY = "webhook-payload-tester-log-v1";
const MAX_BODY_CHARS = 512 * 1024;
const MAX_ENTRIES = 80;

type WebhookLogEntry = {
  id: string;
  receivedAt: string;
  contentType: string;
  body: string;
  headersText: string;
  label: string;
};

const CONTENT_TYPES = [
  "application/json",
  "application/x-www-form-urlencoded",
  "text/plain",
  "application/xml",
  "application/graphql+json",
  "multipart/form-data",
  "custom…",
] as const;

const TEMPLATES: { name: string; contentType: string; body: string; headersText: string }[] =
  [
    {
      name: "Stripe-style JSON",
      contentType: "application/json",
      headersText: "Stripe-Signature: t=1234567890,v1=example",
      body: `{
  "id": "evt_123",
  "object": "event",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_123",
      "amount": 2000,
      "currency": "usd",
      "status": "succeeded"
    }
  }
}`,
    },
    {
      name: "GitHub push hook (JSON)",
      contentType: "application/json",
      headersText: "X-GitHub-Event: push\nX-Hub-Signature-256: sha256=…",
      body: `{
  "ref": "refs/heads/main",
  "repository": {
    "full_name": "org/repo",
    "clone_url": "https://github.com/org/repo.git"
  },
  "commits": []
}`,
    },
    {
      name: "Slack URL verification",
      contentType: "application/json",
      headersText: "",
      body: `{
  "token": "one-time-token",
  "challenge": "paste-challenge-string-here",
  "type": "url_verification"
}`,
    },
  ];

function loadEntries(): WebhookLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is WebhookLogEntry =>
        typeof e === "object" &&
        e !== null &&
        typeof (e as WebhookLogEntry).id === "string" &&
        typeof (e as WebhookLogEntry).body === "string",
    );
  } catch {
    return [];
  }
}

function saveEntries(entries: WebhookLogEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* quota or private mode */
  }
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function WebhookPayloadTesterTool() {
  const uploadId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [entries, setEntries] = useState<WebhookLogEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const [label, setLabel] = useState("");
  const [contentTypeChoice, setContentTypeChoice] =
    useState<(typeof CONTENT_TYPES)[number]>("application/json");
  const [customContentType, setCustomContentType] = useState("");
  const [headersText, setHeadersText] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [copyBodyDone, setCopyBodyDone] = useState(false);
  const [copyEntryId, setCopyEntryId] = useState<string | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setEntries(loadEntries());
      setHydrated(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!copyBodyDone) return;
    const t = window.setTimeout(() => setCopyBodyDone(false), 2000);
    return () => window.clearTimeout(t);
  }, [copyBodyDone]);

  useEffect(() => {
    if (!copyEntryId) return;
    const t = window.setTimeout(() => setCopyEntryId(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyEntryId]);

  const resolvedContentType = useMemo(() => {
    if (contentTypeChoice === "custom…") return customContentType.trim() || "application/octet-stream";
    return contentTypeChoice;
  }, [contentTypeChoice, customContentType]);

  const jsonHint = useMemo(() => {
    if (!resolvedContentType.includes("json")) return null;
    const t = body.trim();
    if (!t) return null;
    try {
      JSON.parse(t);
      return { ok: true as const, message: "Valid JSON." };
    } catch (e) {
      return {
        ok: false as const,
        message: e instanceof Error ? e.message : "Invalid JSON",
      };
    }
  }, [body, resolvedContentType]);

  const persist = useCallback((next: WebhookLogEntry[]) => {
    const trimmed =
      next.length > MAX_ENTRIES ? next.slice(0, MAX_ENTRIES) : next;
    setEntries(trimmed);
    saveEntries(trimmed);
  }, []);

  function recordEvent() {
    setStatus(null);
    const trimmed = body.slice(0, MAX_BODY_CHARS);
    if (!trimmed.trim()) {
      setStatus("Add a request body (or load a template) before recording.");
      return;
    }
    const entry: WebhookLogEntry = {
      id: newId(),
      receivedAt: new Date().toISOString(),
      contentType: resolvedContentType,
      body: trimmed,
      headersText: headersText.trim(),
      label: label.trim() || "Untitled event",
    };
    persist([entry, ...entries]);
    setStatus(`Recorded “${entry.label}” at ${new Date(entry.receivedAt).toLocaleString()}.`);
  }

  function formatJson() {
    setStatus(null);
    const t = body.trim();
    if (!t) return;
    try {
      setBody(JSON.stringify(JSON.parse(t), null, 2));
      setStatus("Body formatted as indented JSON.");
    } catch (e) {
      setStatus(
        e instanceof Error ? `Cannot format: ${e.message}` : "Cannot format JSON.",
      );
    }
  }

  function applyTemplate(tpl: (typeof TEMPLATES)[number]) {
    setContentTypeChoice(
      CONTENT_TYPES.includes(tpl.contentType as (typeof CONTENT_TYPES)[number])
        ? (tpl.contentType as (typeof CONTENT_TYPES)[number])
        : "custom…",
    );
    if (!CONTENT_TYPES.includes(tpl.contentType as (typeof CONTENT_TYPES)[number])) {
      setCustomContentType(tpl.contentType);
    }
    setHeadersText(tpl.headersText);
    setBody(tpl.body);
    setLabel(tpl.name);
    setStatus(`Loaded template: ${tpl.name}`);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    setStatus(null);
    if (!file) return;
    if (file.size > MAX_BODY_CHARS) {
      setStatus(`File is larger than ${Math.round(MAX_BODY_CHARS / 1024)} KB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setBody(text.slice(0, MAX_BODY_CHARS));
      setStatus(`Loaded ${file.name} (${file.size} bytes).`);
    };
    reader.onerror = () => setStatus("Could not read that file.");
    reader.readAsText(file, "utf-8");
  }

  async function copyText(text: string, setDone: () => void) {
    try {
      await navigator.clipboard.writeText(text);
      setDone();
    } catch {
      setStatus("Clipboard not available—select text manually.");
    }
  }

  function deleteEntry(id: string) {
    persist(entries.filter((e) => e.id !== id));
    setStatus("Removed one event from the log.");
  }

  function clearLog() {
    persist([]);
    setStatus("Cleared local log.");
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div
        className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300"
        role="status"
      >
        <strong className="font-medium text-foreground">Privacy:</strong> payloads
        and logs stay in your browser (localStorage). Nothing is sent to our servers.
        Do not paste live secrets or production tokens.
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label
              htmlFor="wpt-label"
              className="block text-sm font-medium text-foreground"
            >
              Event label
            </label>
            <input
              id="wpt-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              autoComplete="off"
              placeholder="e.g. Stripe test — payment succeeded"
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            />
          </div>

          <div>
            <span className="block text-sm font-medium text-foreground">
              Content-Type
            </span>
            <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-center">
              <select
                value={contentTypeChoice}
                onChange={(e) =>
                  setContentTypeChoice(e.target.value as (typeof CONTENT_TYPES)[number])
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600 sm:max-w-xs"
              >
                {CONTENT_TYPES.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
              {contentTypeChoice === "custom…" ? (
                <input
                  type="text"
                  value={customContentType}
                  onChange={(e) => setCustomContentType(e.target.value)}
                  placeholder="application/vnd.api+json"
                  className="w-full flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
                />
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="wpt-headers"
              className="block text-sm font-medium text-foreground"
            >
              Headers (optional, one per line)
            </label>
            <textarea
              id="wpt-headers"
              value={headersText}
              onChange={(e) => setHeadersText(e.target.value)}
              spellCheck={false}
              rows={4}
              placeholder={"X-Custom-Header: value\nAuthorization: Bearer …"}
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-xs leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="wpt-body"
                className="text-sm font-medium text-foreground"
              >
                Raw body (POST payload)
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    void copyText(body, () => setCopyBodyDone(true))
                  }
                  disabled={!body.trim()}
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  {copyBodyDone ? (
                    <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  ) : (
                    <Copy className="size-3.5 shrink-0" aria-hidden />
                  )}
                  Copy body
                </button>
                <input
                  ref={fileRef}
                  id={uploadId}
                  type="file"
                  accept=".json,.txt,.xml,text/plain,application/json"
                  className="sr-only"
                  onChange={onFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  <Upload className="size-3.5 shrink-0" aria-hidden />
                  Upload file
                </button>
                <button
                  type="button"
                  onClick={formatJson}
                  disabled={!body.trim() || !resolvedContentType.includes("json")}
                  className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  Format JSON
                </button>
              </div>
            </div>
            <textarea
              id="wpt-body"
              value={body}
              onChange={(e) => setBody(e.target.value.slice(0, MAX_BODY_CHARS))}
              spellCheck={false}
              rows={14}
              placeholder='{"event": "invoice.paid", "id": "evt_…"}'
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-xs leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            />
            <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span>
                {body.length.toLocaleString()} / {MAX_BODY_CHARS.toLocaleString()} characters
              </span>
              {jsonHint ? (
                <span
                  className={
                    jsonHint.ok ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"
                  }
                >
                  {jsonHint.message}
                </span>
              ) : null}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
            <h3 className="text-sm font-medium text-foreground">Quick templates</h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Replace placeholders with your own test data before recording.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.name}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className="rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={recordEvent}
              className="rounded-lg border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              Record to local log
            </button>
            <button
              type="button"
              onClick={clearLog}
              disabled={!hydrated || entries.length === 0}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Clear entire log
            </button>
          </div>
          {status ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
              {status}
            </p>
          ) : null}
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground">Local webhook log</h3>
          <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Newest first. Each row stores the raw body and metadata you entered—use
            Copy JSON to paste into tickets or diff tools.
          </p>
          {!hydrated ? (
            <p className="mt-4 text-sm text-zinc-500">Loading saved entries…</p>
          ) : entries.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/80 px-3 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
              No events yet. Paste a payload, optionally set headers, then record.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {entries.map((e) => {
                const json = JSON.stringify(e, null, 2);
                return (
                  <li
                    key={e.id}
                    className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/40"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="font-medium text-foreground">{e.label}</div>
                        <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                          {new Date(e.receivedAt).toLocaleString()} ·{" "}
                          <span className="font-mono">{e.contentType}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            void copyText(json, () => setCopyEntryId(e.id))
                          }
                          className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                          aria-label="Copy event as JSON"
                        >
                          {copyEntryId === e.id ? (
                            <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden />
                          ) : (
                            <Copy className="size-3.5 shrink-0" aria-hidden />
                          )}
                          Copy JSON
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteEntry(e.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-red-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-red-950/40"
                          aria-label="Delete event"
                        >
                          <Trash2 className="size-3.5 shrink-0" aria-hidden />
                        </button>
                      </div>
                    </div>
                    {e.headersText ? (
                      <pre className="mt-2 max-h-24 overflow-auto rounded border border-zinc-200 bg-white p-2 font-mono text-[11px] leading-relaxed text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                        {e.headersText}
                      </pre>
                    ) : null}
                    <pre className="mt-2 max-h-40 overflow-auto rounded border border-zinc-200 bg-white p-2 font-mono text-[11px] leading-relaxed text-zinc-800 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">
                      {e.body.length > 1200 ? `${e.body.slice(0, 1200)}…` : e.body}
                    </pre>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
