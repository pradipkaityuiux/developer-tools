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
  buildHtaccessContent,
  DEFAULT_HTACCESS_OPTIONS,
  type CanonicalHostMode,
  type CustomRedirect,
  type HtaccessGeneratorOptions,
} from "@/lib/htaccess-generator-core";

function setsEqual(a: HtaccessGeneratorOptions, b: HtaccessGeneratorOptions): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

const defaultRedirects: CustomRedirect[] = [{ fromPath: "/old-path", toTarget: "/" }];

export function HtaccessGeneratorTool() {
  const fileInputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [opts, setOpts] = useState<HtaccessGeneratorOptions>(DEFAULT_HTACCESS_OPTIONS);
  const [redirects, setRedirects] = useState<CustomRedirect[]>([]);
  const merged = useMemo(
    () => buildHtaccessContent(opts, redirects),
    [opts, redirects],
  );
  const [edited, setEdited] = useState(false);
  const [overrideText, setOverrideText] = useState<string | null>(null);
  const text = edited && overrideText !== null ? overrideText : merged;
  const [copyDone, setCopyDone] = useState(false);
  const [fileHint, setFileHint] = useState<string | null>(null);

  useEffect(() => {
    if (!fileHint) return;
    const t = window.setTimeout(() => setFileHint(null), 4000);
    return () => window.clearTimeout(t);
  }, [fileHint]);

  const resetToGenerated = useCallback(() => {
    setEdited(false);
    setOverrideText(null);
  }, []);

  const onTextChange = useCallback((value: string) => {
    setOverrideText(value);
    setEdited(true);
  }, []);

  const onUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const raw = typeof reader.result === "string" ? reader.result : "";
      setOverrideText(raw);
      setEdited(true);
      setFileHint(`Loaded “${file.name}”. Edit freely, or use Reset to sync from the form.`);
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
    a.download = ".htaccess";
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

  const isDefaultOptions = useMemo(
    () =>
      setsEqual(opts, DEFAULT_HTACCESS_OPTIONS) && redirects.length === 0,
    [opts, redirects.length],
  );

  const patchOpts = useCallback((patch: Partial<HtaccessGeneratorOptions>) => {
    setOpts((o) => ({ ...o, ...patch }));
    setEdited(false);
    setOverrideText(null);
  }, []);

  const addRedirectRow = useCallback(() => {
    setRedirects((r) => [...r, { fromPath: "", toTarget: "" }]);
    setEdited(false);
    setOverrideText(null);
  }, []);

  const updateRedirect = useCallback((index: number, field: keyof CustomRedirect, value: string) => {
    setRedirects((rows) => {
      const next = [...rows];
      const row = { ...next[index], [field]: value };
      next[index] = row;
      return next;
    });
    setEdited(false);
    setOverrideText(null);
  }, []);

  const removeRedirect = useCallback((index: number) => {
    setRedirects((rows) => rows.filter((_, i) => i !== index));
    setEdited(false);
    setOverrideText(null);
  }, []);

  const loadPreset = useCallback((kind: "wordpress" | "spa" | "minimal") => {
    if (kind === "minimal") {
      setOpts({
        ...DEFAULT_HTACCESS_OPTIONS,
        enableGzip: false,
        enableBrowserCache: false,
        securityHeaders: false,
      });
      setRedirects([]);
    } else if (kind === "spa") {
      setOpts({
        ...DEFAULT_HTACCESS_OPTIONS,
        forceHttps: true,
        removeTrailingSlash: true,
      });
      setRedirects([]);
    } else {
      setOpts({
        ...DEFAULT_HTACCESS_OPTIONS,
        blockSensitiveFiles: true,
        disableDirectoryListing: true,
        blockHotlinking: false,
      });
      setRedirects([]);
    }
    setEdited(false);
    setOverrideText(null);
  }, []);

  const fillExampleRedirects = useCallback(() => {
    setRedirects([...defaultRedirects]);
    setEdited(false);
    setOverrideText(null);
  }, []);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="min-w-0 shrink-0 space-y-6 lg:w-[min(100%,26rem)]">
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">
              Core behavior
            </legend>
            <label className="flex cursor-pointer gap-2 text-sm leading-snug">
              <input
                type="checkbox"
                checked={opts.enableRewrite}
                onChange={(e) =>
                  patchOpts({ enableRewrite: e.target.checked })
                }
                className="mt-0.5 size-4 shrink-0 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
              />
              <span>
                <span className="font-medium text-foreground">Explicit mod_rewrite</span>
                <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                  Keeps RewriteEngine on when you only need other toggles that still use rewrite.
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer gap-2 text-sm leading-snug">
              <input
                type="checkbox"
                checked={opts.forceHttps}
                onChange={(e) =>
                  patchOpts({ forceHttps: e.target.checked })
                }
                className="mt-0.5 size-4 shrink-0 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
              />
              <span className="font-medium text-foreground">Force HTTPS (301)</span>
            </label>
            <div>
              <label htmlFor="canonical-host" className="text-sm font-medium text-foreground">
                Canonical hostname
              </label>
              <select
                id="canonical-host"
                value={opts.canonicalHost}
                onChange={(e) =>
                  patchOpts({
                    canonicalHost: e.target.value as CanonicalHostMode,
                  })
                }
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
              >
                <option value="none">No host redirect</option>
                <option value="force-non-www">Redirect www → apex</option>
                <option value="force-www">Redirect apex → www</option>
              </select>
            </div>
            <label className="flex cursor-pointer gap-2 text-sm leading-snug">
              <input
                type="checkbox"
                checked={opts.removeTrailingSlash}
                onChange={(e) =>
                  patchOpts({ removeTrailingSlash: e.target.checked })
                }
                className="mt-0.5 size-4 shrink-0 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
              />
              <span className="font-medium text-foreground">Remove trailing slash</span>
            </label>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">
              Security &amp; access
            </legend>
            <label className="flex cursor-pointer gap-2 text-sm leading-snug">
              <input
                type="checkbox"
                checked={opts.blockSensitiveFiles}
                onChange={(e) =>
                  patchOpts({ blockSensitiveFiles: e.target.checked })
                }
                className="mt-0.5 size-4 shrink-0 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
              />
              <span className="font-medium text-foreground">Block .env &amp; .git paths</span>
            </label>
            <label className="flex cursor-pointer gap-2 text-sm leading-snug">
              <input
                type="checkbox"
                checked={opts.disableDirectoryListing}
                onChange={(e) =>
                  patchOpts({
                    disableDirectoryListing: e.target.checked,
                  })
                }
                className="mt-0.5 size-4 shrink-0 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
              />
              <span className="font-medium text-foreground">Disable directory listing</span>
            </label>
            <label className="flex cursor-pointer gap-2 text-sm leading-snug">
              <input
                type="checkbox"
                checked={opts.blockHotlinking}
                onChange={(e) =>
                  patchOpts({ blockHotlinking: e.target.checked })
                }
                className="mt-0.5 size-4 shrink-0 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
              />
              <span className="font-medium text-foreground">Hotlink protection (images/CSS/JS)</span>
            </label>
            <div>
              <label htmlFor="primary-host" className="text-sm font-medium text-foreground">
                Primary host (for hotlink &amp; docs)
              </label>
              <input
                id="primary-host"
                type="text"
                value={opts.hotlinkPrimaryHost}
                onChange={(e) =>
                  patchOpts({ hotlinkPrimaryHost: e.target.value })
                }
                placeholder="example.com"
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
              />
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">
              Performance &amp; headers
            </legend>
            <label className="flex cursor-pointer gap-2 text-sm leading-snug">
              <input
                type="checkbox"
                checked={opts.enableGzip}
                onChange={(e) =>
                  patchOpts({ enableGzip: e.target.checked })
                }
                className="mt-0.5 size-4 shrink-0 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
              />
              <span className="font-medium text-foreground">mod_deflate (gzip)</span>
            </label>
            <label className="flex cursor-pointer gap-2 text-sm leading-snug">
              <input
                type="checkbox"
                checked={opts.enableBrowserCache}
                onChange={(e) =>
                  patchOpts({ enableBrowserCache: e.target.checked })
                }
                className="mt-0.5 size-4 shrink-0 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
              />
              <span className="font-medium text-foreground">mod_expires (static cache)</span>
            </label>
            <label className="flex cursor-pointer gap-2 text-sm leading-snug">
              <input
                type="checkbox"
                checked={opts.securityHeaders}
                onChange={(e) =>
                  patchOpts({ securityHeaders: e.target.checked })
                }
                className="mt-0.5 size-4 shrink-0 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
              />
              <span className="font-medium text-foreground">Security headers</span>
            </label>
            <label className="flex cursor-pointer gap-2 text-sm leading-snug">
              <input
                type="checkbox"
                checked={opts.utf8Charset}
                onChange={(e) =>
                  patchOpts({ utf8Charset: e.target.checked })
                }
                className="mt-0.5 size-4 shrink-0 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
              />
              <span className="font-medium text-foreground">UTF-8 default charset</span>
            </label>
            <div>
              <label htmlFor="err404" className="text-sm font-medium text-foreground">
                Custom 404 path (optional)
              </label>
              <input
                id="err404"
                type="text"
                value={opts.customError404}
                onChange={(e) =>
                  patchOpts({ customError404: e.target.value })
                }
                placeholder="/404.html"
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-600"
              />
            </div>
          </fieldset>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium text-foreground">301 redirects</span>
              <button
                type="button"
                onClick={addRedirectRow}
                className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                Add row
              </button>
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              From path (e.g. /blog/old) and target URL or path. Empty rows are ignored.
            </p>
            <ul className="mt-2 space-y-2">
              {redirects.length === 0 ? (
                <li className="text-sm text-zinc-500 dark:text-zinc-400">
                  No redirect rows.{" "}
                  <button
                    type="button"
                    onClick={fillExampleRedirects}
                    className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2"
                  >
                    Insert example
                  </button>
                </li>
              ) : (
                redirects.map((row, i) => (
                  <li
                    key={i}
                    className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-2 sm:flex-row sm:items-center dark:border-zinc-800"
                  >
                    <input
                      type="text"
                      value={row.fromPath}
                      onChange={(e) => updateRedirect(i, "fromPath", e.target.value)}
                      placeholder="/from-path"
                      aria-label={`Redirect from path ${i + 1}`}
                      className="min-w-0 flex-1 rounded border border-zinc-300 bg-white px-2 py-1.5 font-mono text-xs text-foreground dark:border-zinc-600 dark:bg-zinc-900"
                    />
                    <span className="hidden text-zinc-400 sm:inline" aria-hidden>
                      →
                    </span>
                    <input
                      type="text"
                      value={row.toTarget}
                      onChange={(e) => updateRedirect(i, "toTarget", e.target.value)}
                      placeholder="https://… or /new-path"
                      aria-label={`Redirect target ${i + 1}`}
                      className="min-w-0 flex-1 rounded border border-zinc-300 bg-white px-2 py-1.5 font-mono text-xs text-foreground dark:border-zinc-600 dark:bg-zinc-900"
                    />
                    <button
                      type="button"
                      onClick={() => removeRedirect(i)}
                      className="shrink-0 rounded border border-zinc-300 px-2 py-1 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
                    >
                      Remove
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadPreset("minimal")}
              className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Minimal HTTPS
            </button>
            <button
              type="button"
              onClick={() => loadPreset("spa")}
              className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              SPA / static
            </button>
            <button
              type="button"
              onClick={() => loadPreset("wordpress")}
              className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Hardening preset
            </button>
            <button
              type="button"
              onClick={() => {
                setOpts(DEFAULT_HTACCESS_OPTIONS);
                setRedirects([]);
                setEdited(false);
                setOverrideText(null);
              }}
              className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Reset all
            </button>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="htaccess-output"
              className="text-sm font-medium text-foreground"
            >
              Preview (.htaccess)
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileRef}
                id={fileInputId}
                type="file"
                accept=".htaccess,text/plain,*/*"
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
                  onClick={resetToGenerated}
                  className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Reset to form
                </button>
              ) : null}
            </div>
          </div>

          <div className="relative">
            <textarea
              id="htaccess-output"
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              spellCheck={false}
              rows={28}
              className="w-full resize-y rounded-lg border border-zinc-300 bg-white py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder="# Toggle options or upload an existing .htaccess…"
            />
            <button
              type="button"
              onClick={() => void copy()}
              disabled={!text.trim()}
              title={copyDone ? "Copied" : "Copy .htaccess"}
              aria-label={copyDone ? "Copied to clipboard" : "Copy .htaccess"}
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
              ? "You edited the preview. Use Reset to form to replace it with output from the controls."
              : isDefaultOptions
                ? "Defaults: HTTPS, cache, gzip, headers, UTF-8, block .env/.git, no directory indexes."
                : "Preview updates when you change the form."}
          </p>
        </div>
      </div>
    </div>
  );
}
