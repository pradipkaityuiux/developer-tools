"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { Check, Copy, Plus, Trash2, Upload } from "lucide-react";
import {
  buildHreflangLinkTags,
  DEFAULT_HREFLANG_EXAMPLES,
  parseHreflangImport,
  type HreflangEntry,
} from "@/lib/hreflang-generator-core";

const emptyRow = (): HreflangEntry => ({ url: "", hreflang: "" });

export function HreflangGeneratorTool() {
  const fileInputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<HreflangEntry[]>(() => [
    emptyRow(),
    emptyRow(),
    emptyRow(),
  ]);
  const [edited, setEdited] = useState(false);
  const [overrideText, setOverrideText] = useState<string | null>(null);

  const built = useMemo(() => buildHreflangLinkTags(rows), [rows]);
  const generated = built.html;
  const text = edited && overrideText !== null ? overrideText : generated;
  const [copyDone, setCopyDone] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    if (!hint) return;
    const t = window.setTimeout(() => setHint(null), 5000);
    return () => window.clearTimeout(t);
  }, [hint]);

  const resetToGenerated = useCallback(() => {
    setEdited(false);
    setOverrideText(null);
  }, []);

  const onTextChange = useCallback((value: string) => {
    setOverrideText(value);
    setEdited(true);
  }, []);

  const patchRow = useCallback((index: number, field: keyof HreflangEntry, value: string) => {
    setRows((r) => {
      const next = [...r];
      const row = { ...next[index], [field]: value };
      next[index] = row;
      return next;
    });
    setEdited(false);
    setOverrideText(null);
  }, []);

  const addRow = useCallback(() => {
    setRows((r) => [...r, emptyRow()]);
    setEdited(false);
    setOverrideText(null);
  }, []);

  const removeRow = useCallback((index: number) => {
    setRows((r) => (r.length <= 1 ? r : r.filter((_, i) => i !== index)));
    setEdited(false);
    setOverrideText(null);
  }, []);

  const loadExample = useCallback(() => {
    setRows([...DEFAULT_HREFLANG_EXAMPLES]);
    setEdited(false);
    setOverrideText(null);
    setHint("Loaded a four-locale example—replace URLs with your production paths.");
  }, []);

  const clearRows = useCallback(() => {
    setRows([emptyRow(), emptyRow()]);
    setEdited(false);
    setOverrideText(null);
  }, []);

  const onUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const raw = typeof reader.result === "string" ? reader.result : "";
      const parsed = parseHreflangImport(raw);
      if (parsed.length === 0) {
        setHint(
          "No “url + hreflang” pairs found. Use comma, tab, or space between columns (one pair per line).",
        );
      } else {
        setRows(parsed);
        setEdited(false);
        setOverrideText(null);
        setHint(`Imported ${parsed.length} row(s) from “${file.name}”.`);
      }
    };
    reader.onerror = () => {
      setHint("Could not read the file.");
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const copy = useCallback(async () => {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopyDone(true);
      window.setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setHint("Clipboard not available—select the output and copy manually.");
    }
  }, [text]);

  const isDefaultRows = useMemo(
    () => rows.length === 3 && rows.every((r) => !r.url.trim() && !r.hreflang.trim()),
    [rows],
  );

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="min-w-0 shrink-0 space-y-6 lg:w-[min(100%,28rem)]">
          <div>
            <h2 className="text-sm font-medium text-foreground">Locale rows</h2>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Add one row per language or region. Include every alternate in the cluster (including{" "}
              <span className="font-mono text-foreground">x-default</span> when you have a fallback page).
            </p>
          </div>

          <div className="space-y-3">
            {rows.map((row, index) => (
              <div
                key={index}
                className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-700 dark:bg-zinc-900/40"
              >
                <div className="flex items-center justify-between gap-2 pb-2">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Row {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    disabled={rows.length <= 1}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-200/80 disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    aria-label={`Remove row ${index + 1}`}
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                    Remove
                  </button>
                </div>
                <label className="block">
                  <span className="text-xs font-medium text-foreground">Page URL</span>
                  <input
                    type="url"
                    inputMode="url"
                    autoComplete="off"
                    value={row.url}
                    onChange={(e) => patchRow(index, "url", e.target.value)}
                    placeholder="https://www.example.com/de/"
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                  />
                </label>
                <label className="mt-2 block">
                  <span className="text-xs font-medium text-foreground">hreflang code</span>
                  <input
                    type="text"
                    autoComplete="off"
                    value={row.hreflang}
                    onChange={(e) => patchRow(index, "hreflang", e.target.value)}
                    placeholder="de"
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
                  />
                </label>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <Plus className="size-4" aria-hidden />
              Add row
            </button>
            <button
              type="button"
              onClick={loadExample}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Insert example
            </button>
            <button
              type="button"
              onClick={clearRows}
              disabled={isDefaultRows}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Clear all
            </button>
          </div>

          <div className="rounded-lg border border-dashed border-zinc-300 p-3 dark:border-zinc-600">
            <input
              ref={fileRef}
              id={fileInputId}
              type="file"
              accept=".csv,.txt,text/plain"
              className="sr-only"
              onChange={onUpload}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <Upload className="size-4 shrink-0" aria-hidden />
              Upload CSV or text
            </button>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              One pair per line: <span className="font-mono text-foreground">url,hreflang</span> or
              tab-separated. Lines starting with <span className="font-mono">#</span> are ignored.
            </p>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-medium text-foreground">HTML for &lt;head&gt;</h2>
            <div className="flex flex-wrap gap-2">
              {edited && (
                <button
                  type="button"
                  onClick={resetToGenerated}
                  className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-950 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100 dark:hover:bg-amber-950/60"
                >
                  Reset to generated
                </button>
              )}
              <button
                type="button"
                onClick={copy}
                disabled={!text.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-foreground hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                {copyDone ? (
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
                ) : (
                  <Copy className="size-4" aria-hidden />
                )}
                {copyDone ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {built.warnings.length > 0 && (
            <ul
              className="list-disc space-y-1 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100"
              role="status"
            >
              {built.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}

          {hint && (
            <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
              {hint}
            </p>
          )}

          <textarea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            spellCheck={false}
            rows={14}
            className="w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 font-mono text-xs leading-relaxed text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600 sm:text-sm"
            aria-label="Generated hreflang link tags"
          />

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {built.entryCount === 0
              ? "Enter at least one valid URL and hreflang pair to generate tags."
              : `${built.entryCount} alternate link${built.entryCount === 1 ? "" : "s"} — paste into each page’s <head> in this cluster.`}
          </p>
        </div>
      </div>
    </div>
  );
}
