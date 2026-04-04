"use client";

import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { CopyIconButton } from "@/components/copy-icon-button";
import {
  computeAllHashes,
  type HashAlgorithmId,
} from "@/lib/hash-generator-core";

const SAMPLE = `The quick brown fox jumps over the lazy dog`;

const ALGOS: HashAlgorithmId[] = ["MD5", "SHA-1", "SHA-256", "SHA-512"];

const DIGEST_LENGTH_HINT: Record<HashAlgorithmId, string> = {
  MD5: "128-bit (32 hex chars)",
  "SHA-1": "160-bit (40 hex chars)",
  "SHA-256": "256-bit (64 hex chars)",
  "SHA-512": "512-bit (128 hex chars)",
};

export function HashGeneratorTool() {
  const [text, setText] = useState(SAMPLE);
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const [rows, setRows] = useState<
    Record<HashAlgorithmId, string | null> | null
  >(null);
  const [errors, setErrors] = useState<
    Partial<Record<HashAlgorithmId, string>>
  >({});
  const [utf8Length, setUtf8Length] = useState(0);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (!copyHint) return;
    const t = window.setTimeout(() => setCopyHint(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyHint]);

  useEffect(() => {
    let cancelled = false;
    const handle = window.setTimeout(() => {
      setWorking(true);
      void computeAllHashes(text).then(({ utf8, results, errors: err }) => {
        if (cancelled) return;
        setUtf8Length(utf8.length);
        setRows(results);
        setErrors(err);
        setWorking(false);
      });
    }, 200);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [text]);

  async function copyToClipboard(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyHint("Copied to clipboard");
    } catch {
      setCopyHint("Copy blocked — select text manually");
    }
  }

  function copyAll() {
    if (!rows) return;
    const block = ALGOS.map((a) => {
      const v = rows[a];
      const e = errors[a];
      if (e) return `${a}: (error: ${e})`;
      return `${a}: ${v ?? ""}`;
    }).join("\n");
    void copyToClipboard(block);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="hash-input"
            className="block text-sm font-medium text-foreground"
          >
            Text to hash (UTF-8)
          </label>
          <textarea
            id="hash-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            rows={8}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            placeholder="Paste any string — whitespace and newlines affect the digest."
          />
          <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            UTF-8 byte length:{" "}
            <span className="font-mono text-foreground">{utf8Length}</span>
            {working ? (
              <span className="ml-2 text-zinc-400">· updating…</span>
            ) : null}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setText(SAMPLE)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Load sample
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
            onClick={copyAll}
            disabled={!rows}
            title="Copy all digests"
            aria-label="Copy all digests"
            className="inline-flex items-center justify-center rounded-lg bg-zinc-900 p-2 text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Copy className="size-4 shrink-0" aria-hidden />
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                <th className="px-3 py-2 font-medium text-foreground">
                  Algorithm
                </th>
                <th className="px-3 py-2 font-medium text-foreground">
                  Hex digest
                </th>
                <th className="w-14 px-3 py-2 font-medium text-foreground">
                  <span className="sr-only">Copy digest</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ALGOS.map((algo) => {
                const value = rows?.[algo] ?? null;
                const err = errors[algo];
                return (
                  <tr
                    key={algo}
                    className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/80"
                  >
                    <td className="align-top px-3 py-2">
                      <div className="font-mono text-foreground">{algo}</div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {DIGEST_LENGTH_HINT[algo]}
                      </div>
                    </td>
                    <td className="break-all px-3 py-2 font-mono text-xs text-foreground sm:text-sm">
                      {err ? (
                        <span className="text-red-600 dark:text-red-400">
                          {err}
                        </span>
                      ) : value ? (
                        value
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <CopyIconButton
                        placement="inline"
                        copied={false}
                        disabled={!value}
                        onClick={() => value && void copyToClipboard(value)}
                        title={`Copy ${algo} digest`}
                        aria-label={`Copy ${algo} digest`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {copyHint ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
            {copyHint}
          </p>
        ) : null}

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Digests are lowercase hexadecimal. Input is encoded as UTF-8 before
          hashing—the same string in another tool must use the same encoding to
          match. MD5 and SHA-1 are deprecated for security-sensitive uses; keep
          SHA-256 or SHA-512 for integrity and verification workflows.
        </p>
      </div>
    </div>
  );
}
