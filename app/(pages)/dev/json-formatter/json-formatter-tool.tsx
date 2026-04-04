"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CopyIconButton } from "@/components/copy-icon-button";

type ParseOk = { ok: true; value: unknown };
type ParseErr = {
  ok: false;
  message: string;
  line: number;
  column: number;
  position: number | null;
};

function parseJson(text: string): ParseOk | ParseErr {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      ok: false,
      message: "Enter JSON text to validate.",
      line: 1,
      column: 1,
      position: null,
    };
  }
  try {
    const value = JSON.parse(trimmed);
    return { ok: true, value };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const posMatch = /position (\d+)/i.exec(msg);
    const position = posMatch ? parseInt(posMatch[1], 10) : null;
    if (position !== null && position >= 0 && position <= text.length) {
      const before = text.slice(0, position);
      const lines = before.split("\n");
      const line = lines.length;
      const lastLine = lines[lines.length - 1] ?? "";
      const column = lastLine.length + 1;
      return { ok: false, message: msg, line, column, position };
    }
    return { ok: false, message: msg, line: 1, column: 1, position };
  }
}

function pathChild(parent: string, key: string | number): string {
  if (parent === "$") {
    return typeof key === "number" ? `$[${key}]` : `$.${key}`;
  }
  return typeof key === "number" ? `${parent}[${key}]` : `${parent}.${key}`;
}

function JsonTreeNode({
  data,
  path,
  depth,
  expanded,
  onToggle,
}: {
  data: unknown;
  path: string;
  depth: number;
  expanded: Set<string>;
  onToggle: (p: string) => void;
}) {
  if (data === null) {
    return (
      <span className="font-mono text-sm text-violet-600 dark:text-violet-400">
        null
      </span>
    );
  }
  if (typeof data !== "object") {
    const raw = JSON.stringify(data);
    const color =
      typeof data === "string"
        ? "text-emerald-700 dark:text-emerald-400"
        : typeof data === "number"
          ? "text-sky-700 dark:text-sky-400"
          : "text-amber-700 dark:text-amber-400";
    return (
      <span className={`font-mono text-sm break-all ${color}`}>{raw}</span>
    );
  }

  const isArray = Array.isArray(data);
  const entries: [string | number, unknown][] = isArray
    ? data.map((v, i) => [i, v] as [number, unknown])
    : Object.entries(data);

  const isOpen = expanded.has(path);
  const summary = isArray
    ? `[${entries.length} ${entries.length === 1 ? "item" : "items"}]`
    : `{${entries.length} ${entries.length === 1 ? "key" : "keys"}}`;

  return (
    <div className={depth > 0 ? "ml-3 border-l border-zinc-200 pl-3 dark:border-zinc-800" : ""}>
      <button
        type="button"
        onClick={() => onToggle(path)}
        className="flex flex-wrap items-baseline gap-1.5 text-left text-sm text-foreground hover:underline"
        aria-expanded={isOpen}
      >
        <span className="font-mono text-zinc-500 dark:text-zinc-400">
          {isOpen ? "▼" : "▶"}
        </span>
        <span className="font-mono text-zinc-600 dark:text-zinc-300">
          {isArray ? "[" : "{"}
        </span>
        {!isOpen && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {summary}
          </span>
        )}
        {!isOpen && (
          <span className="font-mono text-zinc-600 dark:text-zinc-300">
            {isArray ? "]" : "}"}
          </span>
        )}
      </button>
      {isOpen && (
        <ul className="mt-1 list-none space-y-1.5">
          {entries.map(([key, val]) => {
            const childPath = pathChild(path, key);
            const keyLabel =
              typeof key === "number" ? `[${key}]` : JSON.stringify(key);
            return (
              <li key={childPath}>
                <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  {keyLabel}
                  <span className="text-zinc-400 dark:text-zinc-500">: </span>
                </span>
                <JsonTreeNode
                  data={val}
                  path={childPath}
                  depth={depth + 1}
                  expanded={expanded}
                  onToggle={onToggle}
                />
              </li>
            );
          })}
        </ul>
      )}
      {isOpen && (
        <span className="font-mono text-sm text-zinc-600 dark:text-zinc-300">
          {isArray ? "]" : "}"}
        </span>
      )}
    </div>
  );
}

const SAMPLE = `{
  "name": "developers-tools",
  "version": 1,
  "features": ["format", "minify", "tree"],
  "config": {
    "ssg": true,
    "private": false
  }
}`;

export function JsonFormatterTool() {
  const [text, setText] = useState(SAMPLE);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(["$"]));
  const [copyHint, setCopyHint] = useState<string | null>(null);

  const result = useMemo(() => parseJson(text), [text]);

  useEffect(() => {
    if (!copyHint) return;
    const t = window.setTimeout(() => setCopyHint(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyHint]);

  const toggle = useCallback((p: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    if (result.ok !== true) return;
    const paths = new Set<string>(["$"]);
    function walk(val: unknown, p: string) {
      if (val === null || typeof val !== "object") return;
      const o = val as Record<string, unknown> | unknown[];
      if (Array.isArray(o)) {
        o.forEach((item, i) => {
          const cp = pathChild(p, i);
          paths.add(cp);
          walk(item, cp);
        });
      } else {
        Object.keys(o).forEach((k) => {
          const cp = pathChild(p, k);
          paths.add(cp);
          walk(o[k], cp);
        });
      }
    }
    walk(result.value, "$");
    setExpanded(paths);
  }, [result]);

  const collapseToRoot = useCallback(() => {
    setExpanded(new Set(["$"]));
  }, []);

  async function copyToClipboard(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyHint(`Copied ${label}`);
    } catch {
      setCopyHint("Copy blocked — select text manually");
    }
  }

  function onFormat() {
    const r = parseJson(text);
    if (!r.ok) return;
    setText(JSON.stringify(r.value, null, 2));
  }

  function onMinify() {
    const r = parseJson(text);
    if (!r.ok) return;
    setText(JSON.stringify(r.value));
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="json-input"
            className="block text-sm font-medium text-foreground"
          >
            JSON input
          </label>
          <div className="relative mt-1.5">
            <textarea
              id="json-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
              rows={14}
              className="w-full resize-y rounded-lg border border-zinc-300 bg-white py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder='{"hello": "world"}'
            />
            <CopyIconButton
              placement="corner"
              copied={copyHint === "Copied JSON"}
              onClick={() => copyToClipboard(text, "JSON")}
              disabled={!text}
              title="Copy JSON"
              aria-label="Copy JSON"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onFormat}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Format &amp; validate
          </button>
          <button
            type="button"
            onClick={onMinify}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Minify
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
            className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Load sample
          </button>
        </div>

        {result.ok ? (
          <p
            className="text-sm font-medium text-emerald-700 dark:text-emerald-400"
            role="status"
          >
            Valid JSON — use Format for pretty-print or open the tree below.
          </p>
        ) : (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            <p className="font-medium">Invalid JSON</p>
            <p className="mt-1 font-mono text-xs break-all opacity-90">
              {result.message}
            </p>
            {result.position !== null && (
              <p className="mt-1 text-xs">
                Near line {result.line}, column {result.column} (character{" "}
                {result.position})
              </p>
            )}
          </div>
        )}

        {copyHint && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{copyHint}</p>
        )}

        {result.ok && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                Collapsible tree
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={expandAll}
                  className="text-xs font-medium text-zinc-600 underline decoration-zinc-400 underline-offset-2 hover:text-foreground dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  Expand all
                </button>
                <button
                  type="button"
                  onClick={collapseToRoot}
                  className="text-xs font-medium text-zinc-600 underline decoration-zinc-400 underline-offset-2 hover:text-foreground dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  Collapse to root
                </button>
              </div>
            </div>
            <div className="mt-3 max-h-[min(28rem,60vh)] overflow-auto rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <JsonTreeNode
                data={result.value}
                path="$"
                depth={0}
                expanded={expanded}
                onToggle={toggle}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
