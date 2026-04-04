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
import { Check, Copy, Download, Upload } from "lucide-react";
import {
  GITIGNORE_TEMPLATE_LIST,
  mergeGitignoreTemplates,
  type GitignoreTemplateId,
} from "@/lib/gitignore-generator-templates";

const DEFAULT_SELECTED: GitignoreTemplateId[] = ["node", "macos"];

function setsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}

export function GitignoreGeneratorTool() {
  const listId = useId();
  const fileInputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<Set<GitignoreTemplateId>>(
    () => new Set(DEFAULT_SELECTED),
  );
  const merged = useMemo(
    () => mergeGitignoreTemplates(selected),
    [selected],
  );
  const [text, setText] = useState(merged);
  const [edited, setEdited] = useState(false);
  const [copyDone, setCopyDone] = useState(false);
  const [fileHint, setFileHint] = useState<string | null>(null);

  useEffect(() => {
    if (!edited) setText(merged);
  }, [merged, edited]);

  useEffect(() => {
    if (!fileHint) return;
    const t = window.setTimeout(() => setFileHint(null), 3000);
    return () => window.clearTimeout(t);
  }, [fileHint]);

  const toggle = useCallback((id: GitignoreTemplateId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setEdited(false);
  }, []);

  const selectPreset = useCallback((ids: GitignoreTemplateId[]) => {
    setSelected(new Set(ids));
    setEdited(false);
  }, []);

  const clearAll = useCallback(() => {
    setSelected(new Set());
    setEdited(false);
  }, []);

  const resetToPresets = useCallback(() => {
    setEdited(false);
  }, []);

  const onTextChange = useCallback((value: string) => {
    setText(value);
    setEdited(true);
  }, []);

  const onUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const raw = typeof reader.result === "string" ? reader.result : "";
      setText(raw);
      setEdited(true);
      setFileHint(`Loaded “${file.name}”. Edit or adjust checkboxes (Reset syncs to selections).`);
    };
    reader.onerror = () => {
      setFileHint("Could not read the file.");
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const download = useCallback(() => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".gitignore";
    a.click();
    URL.revokeObjectURL(url);
  }, [text]);

  const copy = useCallback(async () => {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopyDone(true);
      window.setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setFileHint("Clipboard not available—select the text and copy manually.");
    }
  }, [text]);

  const isDefaultSelection = useMemo(
    () => setsEqual(selected, new Set(DEFAULT_SELECTED)),
    [selected],
  );

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 shrink-0 lg:w-[22rem]">
          <fieldset>
            <legend className="text-sm font-medium text-foreground">
              Stacks &amp; environments
            </legend>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Toggle sections; output merges in a sensible order. Uncheck all
              for a blank starter line.
            </p>
            <ul
              id={listId}
              className="mt-3 max-h-[min(24rem,50vh)] space-y-2 overflow-y-auto rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
            >
              {GITIGNORE_TEMPLATE_LIST.map((t) => {
                const on = selected.has(t.id);
                return (
                  <li key={t.id}>
                    <label className="flex cursor-pointer gap-2 text-sm leading-snug text-foreground">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(t.id)}
                        className="mt-0.5 size-4 shrink-0 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
                        aria-describedby={`${listId}-${t.id}-desc`}
                      />
                      <span>
                        <span className="font-medium">{t.label}</span>
                        <span
                          id={`${listId}-${t.id}-desc`}
                          className="block text-xs font-normal text-zinc-500 dark:text-zinc-400"
                        >
                          {t.short}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                selectPreset(["node", "nextjs", "macos", "vscode"])
              }
              className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Next.js kit
            </button>
            <button
              type="button"
              onClick={() =>
                selectPreset(["python", "macos", "vscode", "jetbrains"])
              }
              className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Python kit
            </button>
            <button
              type="button"
              onClick={() =>
                selectPreset(["rust", "macos", "vscode"])
              }
              className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Rust kit
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Clear all
            </button>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="gitignore-output"
              className="text-sm font-medium text-foreground"
            >
              Preview (.gitignore)
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileRef}
                id={fileInputId}
                type="file"
                accept=".gitignore,text/plain"
                className="sr-only"
                onChange={onUpload}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Upload className="size-4 shrink-0" aria-hidden />
                Upload
              </button>
              <button
                type="button"
                onClick={download}
                disabled={!text.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Download className="size-4 shrink-0" aria-hidden />
                Download
              </button>
              {edited ? (
                <button
                  type="button"
                  onClick={resetToPresets}
                  className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Reset to selections
                </button>
              ) : null}
            </div>
          </div>

          <div className="relative">
            <textarea
              id="gitignore-output"
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              spellCheck={false}
              rows={22}
              className="w-full resize-y rounded-lg border border-zinc-300 bg-white py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder="# Select stacks or upload a .gitignore…"
            />
            <button
              type="button"
              onClick={() => void copy()}
              disabled={!text.trim()}
              title={copyDone ? "Copied" : "Copy .gitignore"}
              aria-label={copyDone ? "Copied to clipboard" : "Copy .gitignore"}
              className="absolute right-2 top-2 inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white/95 p-1.5 text-foreground backdrop-blur-sm transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-950/95 dark:hover:bg-zinc-900"
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

          {fileHint ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
              {fileHint}
            </p>
          ) : null}

          <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {edited
              ? "You edited the preview manually. Use Reset to selections to replace it with a fresh merge from your checkboxes."
              : isDefaultSelection
                ? "Default: Node.js + macOS. Add Next.js, editors, or languages as needed."
                : "Preview updates when you change checkboxes."}
          </p>
        </div>
      </div>
    </div>
  );
}
