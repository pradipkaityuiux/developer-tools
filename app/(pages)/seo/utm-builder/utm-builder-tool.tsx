"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  buildUtmUrl,
  emptyUtmFields,
  extractFirstUrlFromText,
  splitUrlAndUtm,
  type UtmFields,
} from "@/lib/utm-builder-core";

const MAX_FILE_BYTES = 256 * 1024;

const fieldHelp: Record<keyof UtmFields, string> = {
  utm_source: "e.g. newsletter, google, partner_site",
  utm_medium: "e.g. email, cpc, social, referral",
  utm_campaign: "e.g. spring_sale, product_launch_2026",
  utm_term: "optional — often used for paid keyword labels",
  utm_content: "optional — banner vs text link, or A/B variant",
};

const fieldLabels: Record<keyof UtmFields, string> = {
  utm_source: "UTM source",
  utm_medium: "UTM medium",
  utm_campaign: "UTM campaign",
  utm_term: "UTM term",
  utm_content: "UTM content",
};

const fieldOrder: (keyof UtmFields)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

export function UtmBuilderTool() {
  const uploadId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [baseUrl, setBaseUrl] = useState("");
  const [utm, setUtm] = useState<UtmFields>(() => emptyUtmFields());
  const [importPaste, setImportPaste] = useState("");
  const [importNote, setImportNote] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);

  useEffect(() => {
    if (!copyDone) return;
    const t = window.setTimeout(() => setCopyDone(false), 2000);
    return () => window.clearTimeout(t);
  }, [copyDone]);

  const built = useMemo(() => buildUtmUrl(baseUrl, utm), [baseUrl, utm]);

  async function copyResult() {
    if (!built.ok) return;
    try {
      await navigator.clipboard.writeText(built.url);
      setCopyDone(true);
    } catch {
      setCopyDone(false);
    }
  }

  function setField<K extends keyof UtmFields>(key: K, value: string) {
    setUtm((prev) => ({ ...prev, [key]: value }));
  }

  function applyImport() {
    setImportNote(null);
    const text = importPaste.trim();
    if (!text) {
      setImportNote("Paste a full URL with or without UTM parameters.");
      return;
    }
    const r = splitUrlAndUtm(text);
    if (!r.ok) {
      setImportNote(r.error);
      return;
    }
    setBaseUrl(r.baseUrl);
    setUtm(r.utm);
    setImportNote("Imported base URL and UTM fields from your link.");
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    setImportNote(null);
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setImportNote(`File is larger than ${Math.round(MAX_FILE_BYTES / 1024)} KB. Use a smaller text file.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      const first = extractFirstUrlFromText(text);
      if (!first) {
        setImportNote("No http(s) URL found on the first lines of the file.");
        return;
      }
      const r = splitUrlAndUtm(first);
      if (!r.ok) {
        setImportNote(r.error);
        return;
      }
      setBaseUrl(r.baseUrl);
      setUtm(r.utm);
      setImportPaste(first);
      setImportNote("Loaded the first URL from your file.");
    };
    reader.onerror = () => setImportNote("Could not read that file.");
    reader.readAsText(file, "utf-8");
  }

  function clearAll() {
    setBaseUrl("");
    setUtm(emptyUtmFields());
    setImportPaste("");
    setImportNote(null);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div
        className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300"
        role="status"
      >
        <strong className="font-medium text-foreground">Privacy:</strong> URLs are
        processed in your browser only—nothing is sent to our servers.
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label
              htmlFor="utm-base-url"
              className="block text-sm font-medium text-foreground"
            >
              Destination URL (landing page)
            </label>
            <input
              id="utm-base-url"
              type="url"
              inputMode="url"
              autoComplete="off"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://example.com/pricing or example.com/pricing"
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            />
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              We default to <span className="font-mono">https://</span> when the scheme
              is omitted.
            </p>
          </div>

          {fieldOrder.map((key) => (
            <div key={key}>
              <label
                htmlFor={`utm-${key}`}
                className="block text-sm font-medium text-foreground"
              >
                {fieldLabels[key]}
              </label>
              <input
                id={`utm-${key}`}
                type="text"
                value={utm[key]}
                onChange={(e) => setField(key, e.target.value)}
                autoComplete="off"
                placeholder={fieldHelp[key]}
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-medium text-foreground">Generated tracking link</h3>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Query parameters are percent-encoded. Empty UTM fields are left out of the
              final URL.
            </p>
            <div className="mt-3 flex gap-2">
              <div
                className="min-h-[44px] flex-1 break-all rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-xs leading-relaxed text-foreground dark:border-zinc-700 dark:bg-zinc-900/50"
                aria-live="polite"
                role="status"
              >
                {built.ok ? built.url : <span className="text-zinc-500">{built.error}</span>}
              </div>
              <button
                type="button"
                onClick={() => void copyResult()}
                disabled={!built.ok}
                className="inline-flex shrink-0 items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                aria-label="Copy generated URL"
              >
                {copyDone ? (
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
                ) : (
                  <Copy className="size-4 shrink-0" aria-hidden />
                )}
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
            <h3 className="text-sm font-medium text-foreground">Import tagged URL</h3>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Paste a link that already includes{" "}
              <span className="font-mono text-xs">utm_</span> parameters—we split them
              into the fields above so you can tweak one value and rebuild.
            </p>
            <textarea
              value={importPaste}
              onChange={(e) => setImportPaste(e.target.value)}
              spellCheck={false}
              rows={4}
              className="mt-3 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-xs leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder="https://example.com/?utm_source=newsletter&utm_medium=email&utm_campaign=spring"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={applyImport}
                disabled={!importPaste.trim()}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                Import from paste
              </button>
              <input
                ref={fileRef}
                id={uploadId}
                type="file"
                accept=".txt,text/plain,.csv,.url"
                className="sr-only"
                onChange={onFileChange}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Upload className="size-4 shrink-0" aria-hidden />
                Upload URL file
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                Clear all
              </button>
            </div>
            {importNote ? (
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400" role="status">
                {importNote}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
