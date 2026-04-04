"use client";

import { useEffect, useMemo, useState } from "react";
import { CopyIconButton } from "@/components/copy-icon-button";
import {
  CODE_DIFF_MAX_LINES,
  computeLineDiff,
  type DiffChunk,
} from "@/lib/code-diff-core";

const SAMPLE_OLD = `function greet(name) {
  if (!name) {
    return "Hello";
  }
  return "Hello, " + name;
}

export { greet };
`;

const SAMPLE_NEW = `function greet(name: string): string {
  if (!name?.trim()) {
    return "Hello";
  }
  return \`Hello, \${name}\`;
}

export { greet };
`;

function countStats(chunks: DiffChunk[]) {
  let added = 0;
  let removed = 0;
  let kept = 0;
  for (const c of chunks) {
    if (c.type === "insert") added += 1;
    else if (c.type === "delete") removed += 1;
    else kept += 1;
  }
  return { added, removed, kept };
}

export function CodeDiffTool() {
  const [original, setOriginal] = useState(SAMPLE_OLD);
  const [modified, setModified] = useState(SAMPLE_NEW);
  const [copyHint, setCopyHint] = useState<string | null>(null);

  useEffect(() => {
    if (!copyHint) return;
    const t = window.setTimeout(() => setCopyHint(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyHint]);

  const result = useMemo(
    () => computeLineDiff(original, modified),
    [original, modified],
  );

  const rows = useMemo(() => {
    if (!result.ok) return [];
    type Row = {
      leftNum: number | null;
      rightNum: number | null;
      leftLine: string | null;
      rightLine: string | null;
      leftKind: "eq" | "del" | "empty";
      rightKind: "eq" | "ins" | "empty";
    };
    const out: Row[] = [];
    let lnL = 1;
    let lnR = 1;
    for (const c of result.chunks) {
      if (c.type === "equal") {
        out.push({
          leftNum: lnL,
          rightNum: lnR,
          leftLine: c.line,
          rightLine: c.line,
          leftKind: "eq",
          rightKind: "eq",
        });
        lnL += 1;
        lnR += 1;
      } else if (c.type === "delete") {
        out.push({
          leftNum: lnL,
          rightNum: null,
          leftLine: c.line,
          rightLine: null,
          leftKind: "del",
          rightKind: "empty",
        });
        lnL += 1;
      } else {
        out.push({
          leftNum: null,
          rightNum: lnR,
          leftLine: null,
          rightLine: c.line,
          leftKind: "empty",
          rightKind: "ins",
        });
        lnR += 1;
      }
    }
    return out;
  }, [result]);

  const stats =
    result.ok ? countStats(result.chunks) : { added: 0, removed: 0, kept: 0 };

  async function copyUnified() {
    if (!result.ok) return;
    const lines: string[] = [];
    for (const c of result.chunks) {
      if (c.type === "equal") lines.push(` ${c.line}`);
      else if (c.type === "delete") lines.push(`-${c.line}`);
      else lines.push(`+${c.line}`);
    }
    const text = lines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopyHint("Unified diff copied");
    } catch {
      setCopyHint("Copy blocked — select text manually");
    }
  }

  const origLines = original.replace(/\r\n/g, "\n").split("\n").length;
  const modLines = modified.replace(/\r\n/g, "\n").split("\n").length;
  const overLimit =
    origLines > CODE_DIFF_MAX_LINES || modLines > CODE_DIFF_MAX_LINES;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-5">
          <label
            htmlFor="diff-original"
            className="block text-sm font-medium text-foreground"
          >
            Original (old / left)
          </label>
          <textarea
            id="diff-original"
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            spellCheck={false}
            rows={14}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            placeholder="Paste the previous version…"
          />
          <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            {origLines.toLocaleString()} line{origLines === 1 ? "" : "s"}
            {overLimit ? ` — max ${CODE_DIFF_MAX_LINES.toLocaleString()} per side` : ""}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-5">
          <label
            htmlFor="diff-modified"
            className="block text-sm font-medium text-foreground"
          >
            Modified (new / right)
          </label>
          <textarea
            id="diff-modified"
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            spellCheck={false}
            rows={14}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            placeholder="Paste the updated version…"
          />
          <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            {modLines.toLocaleString()} line{modLines === 1 ? "" : "s"}
            {overLimit ? ` — max ${CODE_DIFF_MAX_LINES.toLocaleString()} per side` : ""}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setOriginal("");
            setModified("");
          }}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          Clear both
        </button>
        <button
          type="button"
          onClick={() => {
            setOriginal(SAMPLE_OLD);
            setModified(SAMPLE_NEW);
          }}
          className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Load sample
        </button>
        <CopyIconButton
          placement="inline"
          copied={copyHint === "Unified diff copied"}
          disabled={!result.ok}
          onClick={() => void copyUnified()}
          title="Copy unified diff"
          aria-label="Copy unified diff"
          className="rounded-lg p-2"
        />
        {copyHint ? (
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {copyHint}
          </span>
        ) : null}
      </div>

      {!result.ok ? (
        <div
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
          role="alert"
        >
          <p className="font-medium">Cannot compare</p>
          <p className="mt-1">{result.error}</p>
        </div>
      ) : (
        <>
          <p
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            role="status"
          >
            <span className="text-emerald-700 dark:text-emerald-400">
              {stats.kept} unchanged
            </span>
            <span aria-hidden className="mx-2 text-zinc-400">
              ·
            </span>
            <span className="text-red-700 dark:text-red-400">
              −{stats.removed} removed
            </span>
            <span aria-hidden className="mx-2 text-zinc-400">
              ·
            </span>
            <span className="text-emerald-700 dark:text-emerald-400">
              +{stats.added} added
            </span>
          </p>

          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="grid grid-cols-2 border-b border-zinc-200 bg-zinc-100/80 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400">
              <div className="border-r border-zinc-200 px-3 py-2 dark:border-zinc-800">
                Original
              </div>
              <div className="px-3 py-2">Modified</div>
            </div>
            <div className="max-h-[min(70vh,36rem)] overflow-auto">
              <table className="w-full border-collapse font-mono text-xs sm:text-sm">
                <tbody>
                  {rows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-zinc-100 dark:border-zinc-800/80"
                    >
                      <td
                        className={`w-[2.75rem] shrink-0 border-r border-zinc-200 px-2 py-0.5 text-right text-zinc-400 select-none dark:border-zinc-800 ${
                          row.leftKind === "del"
                            ? "bg-red-50 dark:bg-red-950/35"
                            : row.leftKind === "eq"
                              ? "bg-white dark:bg-zinc-950"
                              : "bg-zinc-100/50 dark:bg-zinc-900/50"
                        }`}
                      >
                        {row.leftNum ?? ""}
                      </td>
                      <td
                        className={`min-w-0 border-r border-zinc-200 px-2 py-0.5 align-top whitespace-pre-wrap break-all ${
                          row.leftKind === "del"
                            ? "bg-red-50 text-red-950 dark:bg-red-950/35 dark:text-red-100"
                            : row.leftKind === "eq"
                              ? "bg-white text-foreground dark:bg-zinc-950"
                              : "bg-zinc-50 text-zinc-400 dark:bg-zinc-900/80 dark:text-zinc-600"
                        }`}
                      >
                        {row.leftLine ?? ""}
                      </td>
                      <td
                        className={`w-[2.75rem] shrink-0 border-r border-zinc-200 px-2 py-0.5 text-right text-zinc-400 select-none dark:border-zinc-800 ${
                          row.rightKind === "ins"
                            ? "bg-emerald-50 dark:bg-emerald-950/30"
                            : row.rightKind === "eq"
                              ? "bg-white dark:bg-zinc-950"
                              : "bg-zinc-100/50 dark:bg-zinc-900/50"
                        }`}
                      >
                        {row.rightNum ?? ""}
                      </td>
                      <td
                        className={`min-w-0 px-2 py-0.5 align-top whitespace-pre-wrap break-all ${
                          row.rightKind === "ins"
                            ? "bg-emerald-50 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100"
                            : row.rightKind === "eq"
                              ? "bg-white text-foreground dark:bg-zinc-950"
                              : "bg-zinc-50 text-zinc-400 dark:bg-zinc-900/80 dark:text-zinc-600"
                        }`}
                      >
                        {row.rightLine ?? ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        Comparison is line-based (not character-by-character). Normalize formatting
        with our formatters first if whitespace-only changes should disappear. For
        version-controlled projects, Git remains the source of truth for merges
        and blame.
      </p>
    </div>
  );
}
