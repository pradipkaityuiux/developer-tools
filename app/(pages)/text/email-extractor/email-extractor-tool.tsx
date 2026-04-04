"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  extractEmailsFromText,
  formatEmailList,
  type EmailListSeparator,
} from "@/lib/email-extractor-core";

const SAMPLE = `<!DOCTYPE html>
<html>
<body>
<p>Contact <a href="mailto:support@example.com?subject=Hello">support</a> or sales@example.com.</p>
<!-- duplicates on purpose -->
<p>Reply to support@example.com or Sales@EXAMPLE.com for pricing.</p>
<p>Also try team_member@sub.example.co.uk and legacy.user+tag@company.io.</p>
</body>
</html>`;

const SEP_OPTIONS: { value: EmailListSeparator; label: string }[] = [
  { value: "newline", label: "One per line" },
  { value: "comma", label: "Comma separated" },
  { value: "semicolon", label: "Semicolon separated" },
];

export function EmailExtractorTool() {
  const inputId = useId();
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(SAMPLE);
  const [separator, setSeparator] = useState<EmailListSeparator>("newline");
  const [sortAz, setSortAz] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);

  const emails = useMemo(() => extractEmailsFromText(text), [text]);
  const displayEmails = useMemo(() => {
    if (!sortAz) return emails;
    return [...emails].sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase(), "en"),
    );
  }, [emails, sortAz]);

  const formatted = useMemo(
    () => formatEmailList(displayEmails, separator),
    [displayEmails, separator],
  );

  async function copyList() {
    if (!formatted) return;
    try {
      await navigator.clipboard.writeText(formatted);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setFileError("Clipboard blocked. Select the output and copy manually.");
      setTimeout(() => setFileError(null), 4000);
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const body = typeof reader.result === "string" ? reader.result : "";
      setText(body);
    };
    reader.onerror = () => {
      setFileError("Could not read the file.");
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <label
              htmlFor={inputId}
              className="block text-sm font-medium text-foreground"
            >
              Text or HTML
            </label>
            <textarea
              id={inputId}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setFileError(null);
              }}
              spellCheck={false}
              rows={14}
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder="Paste email threads, HTML snippets, or plain-text exports."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              id={fileId}
              type="file"
              accept=".txt,.html,.htm,.md,.markdown,text/plain,text/html"
              className="sr-only"
              onChange={onFile}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <Upload className="size-4 shrink-0" aria-hidden />
              Upload file
            </button>
            <button
              type="button"
              onClick={copyList}
              disabled={!formatted}
              title={copyDone ? "Copied" : "Copy extracted list"}
              aria-label={copyDone ? "Copied list" : "Copy extracted list"}
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
              Copy list
            </button>
            <button
              type="button"
              onClick={() => setText("")}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setText(SAMPLE)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Load sample
            </button>
          </div>

          {fileError ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {fileError}
            </p>
          ) : null}
        </div>

        <div className="w-full shrink-0 space-y-4 lg:w-80">
          <div>
            <label
              htmlFor="email-extractor-format"
              className="block text-sm font-medium text-foreground"
            >
              Export format
            </label>
            <select
              id="email-extractor-format"
              value={separator}
              onChange={(e) =>
                setSeparator(e.target.value as EmailListSeparator)
              }
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
            >
              {SEP_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={sortAz}
              onChange={(e) => setSortAz(e.target.checked)}
              className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900"
            />
            Sort A–Z (case-insensitive)
          </label>

          <div
            className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/40"
            aria-live="polite"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Results
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
              {emails.length.toLocaleString()}{" "}
              <span className="text-base font-normal text-zinc-600 dark:text-zinc-400">
                unique {emails.length === 1 ? "address" : "addresses"}
              </span>
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-foreground">Output</p>
            <textarea
              readOnly
              value={formatted}
              rows={12}
              aria-label="Extracted email addresses"
              className="mt-1.5 w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-zinc-800 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
              placeholder="No addresses detected yet."
            />
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        Extraction uses pattern matching only—not deliverability verification.
        Strip personal data when sharing screen recordings. Comply with
        anti-spam and privacy laws before sending mail to extracted addresses.
      </p>
    </div>
  );
}
