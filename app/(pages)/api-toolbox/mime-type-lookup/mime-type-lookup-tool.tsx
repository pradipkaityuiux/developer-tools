"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  looksLikeMimeType,
  lookupFromFilename,
  lookupFromMimeInput,
  type MimeLookupResult,
} from "@/lib/mime-type-lookup-core";

const SAMPLE = "report.pdf";

function formatBytes(n: number): string {
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${n} B`;
}

export function MimeTypeLookupTool() {
  const fileInputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(SAMPLE);
  const [lastFile, setLastFile] = useState<{
    name: string;
    size: number;
    browserType: string;
  } | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!copyHint) return;
    const t = window.setTimeout(() => setCopyHint(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyHint]);

  useEffect(() => {
    if (!copiedKey) return;
    const t = window.setTimeout(() => setCopiedKey(null), 2000);
    return () => window.clearTimeout(t);
  }, [copiedKey]);

  const trimmed = query.trim();

  const forward: MimeLookupResult | null = useMemo(() => {
    if (!trimmed || looksLikeMimeType(trimmed)) return null;
    return lookupFromFilename(trimmed);
  }, [trimmed]);

  const reverse = useMemo(() => {
    if (!trimmed || !looksLikeMimeType(trimmed)) return null;
    return lookupFromMimeInput(trimmed);
  }, [trimmed]);

  async function copyText(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyHint("Copied");
      setCopiedKey(key);
    } catch {
      setCopyHint("Copy blocked — select text manually");
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setLastFile({
      name: f.name,
      size: f.size,
      browserType: f.type,
    });
    setQuery(f.name);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="mime-query"
              className="block text-sm font-medium text-foreground"
            >
              Filename, extension, or MIME type
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileRef}
                id={fileInputId}
                type="file"
                className="sr-only"
                onChange={onFileChange}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Upload className="size-3.5 shrink-0" aria-hidden />
                Upload file
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuery(SAMPLE);
                  setLastFile(null);
                }}
                className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                Load example
              </button>
            </div>
          </div>
          <input
            id="mime-query"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLastFile(null);
            }}
            autoComplete="off"
            spellCheck={false}
            placeholder="e.g. archive.tar.gz, .svg, or application/json"
            className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
          />
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            Enter a path or basename (slashes are OK), a lone extension like{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono dark:bg-zinc-900">
              png
            </code>{" "}
            or{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono dark:bg-zinc-900">
              .wasm
            </code>
            , or a full MIME type to list matching extensions. Use{" "}
            <strong className="font-medium text-foreground">Upload file</strong>{" "}
            to compare the browser&apos;s{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono dark:bg-zinc-900">
              file.type
            </code>{" "}
            with the table lookup.
          </p>
        </div>

        {lastFile ? (
          <div
            className="rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900/50"
            role="status"
          >
            <p className="font-medium text-foreground">Last uploaded file</p>
            <dl className="mt-2 grid gap-1 text-xs text-zinc-600 dark:text-zinc-400 sm:grid-cols-2">
              <div>
                <dt className="text-zinc-500">Name</dt>
                <dd className="font-mono text-foreground">{lastFile.name}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Size</dt>
                <dd>{formatBytes(lastFile.size)}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-zinc-500">Browser MIME (File.type)</dt>
                <dd className="font-mono text-foreground">
                  {lastFile.browserType || "(empty — unknown to the browser)"}
                </dd>
              </div>
            </dl>
          </div>
        ) : null}

        {trimmed && forward && !reverse ? (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="text-sm font-semibold text-foreground">
              Extension → MIME
            </h3>
            {!forward.extension ? (
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                No extension detected. Add a dot suffix (e.g.{" "}
                <code className="rounded bg-zinc-100 px-1 font-mono dark:bg-zinc-900">
                  data.json
                </code>
                ) or enter a MIME type for reverse lookup.
              </p>
            ) : (
              <>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <dt className="text-zinc-500">Extension</dt>
                    <dd className="flex items-center gap-2 font-mono text-foreground">
                      .{forward.extension}
                      <button
                        type="button"
                        onClick={() =>
                          void copyText("ext", forward.extension)
                        }
                        className="inline-flex items-center rounded-md border border-zinc-300 bg-white p-1 text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                        aria-label="Copy extension"
                      >
                        {copiedKey === "ext" ? (
                          <Check className="size-3.5" aria-hidden />
                        ) : (
                          <Copy className="size-3.5" aria-hidden />
                        )}
                      </button>
                    </dd>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <dt className="text-zinc-500">Primary MIME</dt>
                    <dd className="flex items-center gap-2">
                      <span className="break-all font-mono text-foreground">
                        {forward.mime ?? "Not in catalog"}
                      </span>
                      {forward.mime ? (
                        <button
                          type="button"
                          onClick={() =>
                            void copyText("mime", forward.mime!)
                          }
                          className="inline-flex shrink-0 items-center rounded-md border border-zinc-300 bg-white p-1 text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                          aria-label="Copy MIME type"
                        >
                          {copiedKey === "mime" ? (
                            <Check className="size-3.5" aria-hidden />
                          ) : (
                            <Copy className="size-3.5" aria-hidden />
                          )}
                        </button>
                      ) : null}
                    </dd>
                  </div>
                </dl>
                {forward.alternatives.length > 0 ? (
                  <div className="mt-4 border-t border-zinc-200 pt-3 dark:border-zinc-700">
                    <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Common alternatives
                    </p>
                    <ul className="mt-2 space-y-2">
                      {forward.alternatives.map((a) => (
                        <li
                          key={a.mime}
                          className="text-sm text-zinc-600 dark:text-zinc-400"
                        >
                          <span className="font-mono text-foreground">
                            {a.mime}
                          </span>
                          {" — "}
                          {a.note}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </>
            )}
          </div>
        ) : null}

        {trimmed && reverse ? (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="text-sm font-semibold text-foreground">
              MIME → extensions
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Normalized type:{" "}
              <span className="font-mono text-foreground">{reverse.mime}</span>
            </p>
            {reverse.extensions.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                No extensions in this catalog match that exact type. Try a
                shorter subtype or check IANA for aliases.
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap items-start gap-2">
                <p className="flex-1 font-mono text-sm leading-relaxed text-foreground">
                  {reverse.extensions.map((e) => `.${e}`).join(", ")}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    void copyText(
                      "exts",
                      reverse.extensions.map((e) => `.${e}`).join(", "),
                    )
                  }
                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  {copiedKey === "exts" ? (
                    <Check className="size-3.5" aria-hidden />
                  ) : (
                    <Copy className="size-3.5" aria-hidden />
                  )}
                  Copy list
                </button>
              </div>
            )}
          </div>
        ) : null}

        {copyHint ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400" role="status">
            {copyHint}
          </p>
        ) : null}
      </div>
    </div>
  );
}
