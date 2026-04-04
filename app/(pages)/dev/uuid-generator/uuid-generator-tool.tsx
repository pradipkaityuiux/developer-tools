"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CopyIconButton } from "@/components/copy-icon-button";

const MAX_COUNT = 500;

function bytesToUuidV4(bytes: Uint8Array): string {
  const b = bytes.slice();
  b[6] = (b[6]! & 0x0f) | 0x40;
  b[8] = (b[8]! & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/** Canonical lowercase UUID v4 with hyphens */
function generateOneV4(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().toLowerCase();
  }
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  return bytesToUuidV4(buf);
}

type FormatMode = "standard" | "compact" | "uppercase";

function formatCanonical(canon: string, mode: FormatMode): string {
  const lower = canon.toLowerCase();
  if (mode === "compact") return lower.replace(/-/g, "");
  if (mode === "uppercase") return lower.toUpperCase();
  return lower;
}

export function UuidGeneratorTool() {
  const [count, setCount] = useState(5);
  const [formatMode, setFormatMode] = useState<FormatMode>("standard");
  const [canonicalLines, setCanonicalLines] = useState<string[]>(() =>
    Array.from({ length: 5 }, () => generateOneV4()),
  );
  const [copyHint, setCopyHint] = useState<string | null>(null);

  useEffect(() => {
    if (!copyHint) return;
    const t = window.setTimeout(() => setCopyHint(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyHint]);

  const boundedCount = useMemo(() => {
    const n = Number.isFinite(count) ? Math.floor(count) : 1;
    return Math.min(MAX_COUNT, Math.max(1, n));
  }, [count]);

  const displayedLines = useMemo(
    () => canonicalLines.map((c) => formatCanonical(c, formatMode)),
    [canonicalLines, formatMode],
  );

  const regenerate = useCallback(() => {
    const n = boundedCount;
    setCanonicalLines(Array.from({ length: n }, () => generateOneV4()));
  }, [boundedCount]);

  async function copyToClipboard(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyHint("Copied to clipboard");
    } catch {
      setCopyHint("Copy blocked — select text manually");
    }
  }

  const outputText = displayedLines.join("\n");
  const textareaRows = Math.min(16, Math.max(4, displayedLines.length + 2));

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label
              htmlFor="uuid-count"
              className="block text-sm font-medium text-foreground"
            >
              How many UUIDs (1–{MAX_COUNT})
            </label>
            <input
              id="uuid-count"
              type="number"
              min={1}
              max={MAX_COUNT}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="mt-1.5 w-32 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            />
          </div>
          <div>
            <span className="block text-sm font-medium text-foreground">
              Output format
            </span>
            <div
              className="mt-1.5 flex flex-wrap gap-2"
              role="group"
              aria-label="UUID output format"
            >
              {(
                [
                  ["standard", "With hyphens"],
                  ["compact", "Compact (no hyphens)"],
                  ["uppercase", "Uppercase"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormatMode(value)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    formatMode === value
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border-zinc-300 bg-white text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={regenerate}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Generate new UUIDs
          </button>
        </div>

        <div>
          <label
            htmlFor="uuid-output"
            className="block text-sm font-medium text-foreground"
          >
            UUID v4 output (one per line)
          </label>
          <div className="relative mt-1.5">
            <textarea
              id="uuid-output"
              readOnly
              value={outputText}
              spellCheck={false}
              rows={textareaRows}
              className="w-full resize-y rounded-lg border border-zinc-300 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none dark:border-zinc-700 dark:bg-zinc-900/80"
            />
            <CopyIconButton
              placement="corner"
              copied={copyHint === "Copied to clipboard"}
              onClick={() => copyToClipboard(outputText)}
              disabled={!outputText}
              title="Copy all UUIDs"
              aria-label="Copy all UUIDs"
            />
          </div>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
          Showing {displayedLines.length} random UUID v4 value
          {displayedLines.length === 1 ? "" : "s"}. Each click on{" "}
          <strong className="font-medium text-foreground">Generate new UUIDs</strong>{" "}
          replaces the list using your current count.
        </p>

        {copyHint ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{copyHint}</p>
        ) : null}

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Uses{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
            crypto.randomUUID()
          </code>{" "}
          when available, otherwise{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
            getRandomValues
          </code>{" "}
          with RFC 4122 version 4 and variant bits.
        </p>
      </div>
    </div>
  );
}
