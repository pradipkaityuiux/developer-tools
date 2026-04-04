"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Search, Upload, X } from "lucide-react";
import {
  categoryLabel,
  httpStatusCodes,
  matchesSearch,
  type HttpStatusCategory,
  type HttpStatusEntry,
} from "@/lib/http-status-codes-data";

const CATEGORIES: Array<"all" | HttpStatusCategory> = [
  "all",
  "informational",
  "success",
  "redirection",
  "client-error",
  "server-error",
];

function shortClassLabel(cat: HttpStatusCategory): string {
  switch (cat) {
    case "informational":
      return "1xx";
    case "success":
      return "2xx";
    case "redirection":
      return "3xx";
    case "client-error":
      return "4xx";
    case "server-error":
      return "5xx";
    default:
      return cat;
  }
}

function extractCodesFromText(text: string): number[] {
  const found = new Set<number>();
  for (const m of text.matchAll(/\b([1-5]\d{2})\b/g)) {
    found.add(parseInt(m[1]!, 10));
  }
  return [...found].sort((a, b) => a - b);
}

function formatCopyBlock(entry: HttpStatusEntry): string {
  return [
    `${entry.code} ${entry.phrase}`,
    categoryLabel(entry.category),
    "",
    entry.summary,
    "",
    "Typical causes:",
    entry.typicalCauses,
    "",
    "What to do next:",
    entry.whatToDo,
  ].join("\n");
}

export function HttpStatusCodesTool() {
  const searchId = useId();
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | HttpStatusCategory>("all");
  const [importCodes, setImportCodes] = useState<number[] | null>(null);
  const [importLabel, setImportLabel] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [copyingCode, setCopyingCode] = useState<number | null>(null);

  const knownCodes = useMemo(
    () => new Set(httpStatusCodes.map((e) => e.code)),
    [],
  );

  const filtered = useMemo(() => {
    return httpStatusCodes.filter((entry) => {
      if (category !== "all" && entry.category !== category) return false;
      if (importCodes !== null && !importCodes.includes(entry.code))
        return false;
      return matchesSearch(entry, query);
    });
  }, [category, importCodes, query]);

  async function copyEntry(entry: HttpStatusEntry) {
    try {
      await navigator.clipboard.writeText(formatCopyBlock(entry));
      setCopyingCode(entry.code);
      setTimeout(() => setCopyingCode(null), 2000);
    } catch {
      setFileError("Clipboard blocked. Select the text and copy manually.");
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
      const extracted = extractCodesFromText(body).filter((c) =>
        knownCodes.has(c),
      );
      if (extracted.length === 0) {
        setFileError(
          "No recognized HTTP status codes (100–599) from this reference were found in the file.",
        );
        setImportCodes(null);
        setImportLabel(null);
        return;
      }
      setImportCodes(extracted);
      setImportLabel(file.name);
      setCategory("all");
      setQuery("");
    };
    reader.onerror = () => {
      setFileError("Could not read the file.");
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function clearImport() {
    setImportCodes(null);
    setImportLabel(null);
    setFileError(null);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <label
              htmlFor={searchId}
              className="block text-sm font-medium text-foreground"
            >
              Search codes, phrases, or symptoms
            </label>
            <div className="relative mt-1.5">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                aria-hidden
              />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='e.g. "429", "redirect", "gateway"'
                className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/30"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              id={fileId}
              type="file"
              accept=".txt,.log,.md,text/plain"
              className="sr-only"
              onChange={onFile}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <Upload className="h-4 w-4 shrink-0" aria-hidden />
              Import log
            </button>
            {importCodes !== null && (
              <button
                type="button"
                onClick={clearImport}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900"
              >
                <X className="h-4 w-4" aria-hidden />
                Clear import
              </button>
            )}
          </div>
        </div>

        {importLabel && importCodes !== null && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Showing{" "}
            <strong className="text-foreground">{importCodes.length}</strong>{" "}
            codes from{" "}
            <strong className="text-foreground">{importLabel}</strong> that
            appear in this reference.
          </p>
        )}

        {fileError && (
          <p className="text-sm text-red-600 dark:text-red-400" role="status">
            {fileError}
          </p>
        )}

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by status class">
          {CATEGORIES.map((c) => {
            const active = category === c;
            const label =
              c === "all" ? "All classes" : shortClassLabel(c);
            return (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(c)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {filtered.length} of {httpStatusCodes.length} reference entries
          match your filters.
        </p>
      </div>

      <ul className="mt-6 space-y-3">
        {filtered.map((entry) => (
          <li
            key={entry.code}
            className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-lg font-semibold tabular-nums text-foreground">
                    {entry.code}
                  </span>
                  <span className="text-lg font-medium text-foreground">
                    {entry.phrase}
                  </span>
                  <span className="rounded-md bg-zinc-200/80 px-2 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                    {shortClassLabel(entry.category)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {entry.summary}
                </p>
                <dl className="mt-3 space-y-2 text-sm">
                  <div>
                    <dt className="font-medium text-foreground">
                      Typical causes
                    </dt>
                    <dd className="mt-0.5 text-zinc-600 dark:text-zinc-400">
                      {entry.typicalCauses}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-foreground">
                      What to do next
                    </dt>
                    <dd className="mt-0.5 text-zinc-600 dark:text-zinc-400">
                      {entry.whatToDo}
                    </dd>
                  </div>
                </dl>
              </div>
              <button
                type="button"
                onClick={() => copyEntry(entry)}
                className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                {copyingCode === entry.code ? (
                  <Check className="h-4 w-4 text-emerald-600" aria-hidden />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden />
                )}
                {copyingCode === entry.code ? "Copied" : "Copy"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          No entries match. Try another keyword, switch the class filter, or{" "}
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
              clearImport();
            }}
            className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2"
          >
            reset filters
          </button>
          .
        </p>
      )}
    </div>
  );
}
