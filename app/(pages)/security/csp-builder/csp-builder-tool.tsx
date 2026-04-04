"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  type CspBuilderState,
  type DirectiveId,
  CSP_PRESETS,
  DEFAULT_CSP_STATE,
  DIRECTIVE_DEFS,
  buildCspPolicyValue,
  parseCspPolicyString,
} from "@/lib/csp-builder-core";

const MAX_IMPORT_BYTES = 256 * 1024;

export function CspBuilderTool() {
  const uploadId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<CspBuilderState>(DEFAULT_CSP_STATE);
  const [headerMode, setHeaderMode] = useState<"enforce" | "reportOnly">(
    "enforce",
  );
  const [copyPolicyOk, setCopyPolicyOk] = useState(false);
  const [copyHeaderOk, setCopyHeaderOk] = useState(false);
  const [importHint, setImportHint] = useState<string | null>(null);

  const policyValue = useMemo(() => buildCspPolicyValue(state), [state]);
  const headerName =
    headerMode === "reportOnly"
      ? "Content-Security-Policy-Report-Only"
      : "Content-Security-Policy";
  const fullHeaderLine = `${headerName}: ${policyValue}`;

  useEffect(() => {
    if (!copyPolicyOk) return;
    const t = window.setTimeout(() => setCopyPolicyOk(false), 2000);
    return () => window.clearTimeout(t);
  }, [copyPolicyOk]);

  useEffect(() => {
    if (!copyHeaderOk) return;
    const t = window.setTimeout(() => setCopyHeaderOk(false), 2000);
    return () => window.clearTimeout(t);
  }, [copyHeaderOk]);

  useEffect(() => {
    if (!importHint) return;
    const t = window.setTimeout(() => setImportHint(null), 4000);
    return () => window.clearTimeout(t);
  }, [importHint]);

  function setDirective<K extends DirectiveId>(
    id: K,
    patch: Partial<CspBuilderState["directives"][K]>,
  ) {
    setState((prev) => ({
      ...prev,
      directives: {
        ...prev.directives,
        [id]: { ...prev.directives[id], ...patch },
      },
    }));
  }

  function applyPreset(presetState: CspBuilderState) {
    setState({
      directives: {
        ...presetState.directives,
      },
      extraDirectives: presetState.extraDirectives,
    });
    setImportHint("Preset applied.");
  }

  async function copyText(
    text: string,
    which: "policy" | "header",
  ): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      if (which === "policy") setCopyPolicyOk(true);
      else setCopyHeaderOk(true);
    } catch {
      setImportHint("Clipboard blocked — select and copy manually.");
    }
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_IMPORT_BYTES) {
      setImportHint("File too large — paste the policy text instead.");
      return;
    }
    try {
      const text = await file.text();
      const parsed = parseCspPolicyString(text);
      setState(parsed);
      setImportHint(`Imported from ${file.name}`);
    } catch {
      setImportHint("Could not read file.");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-medium text-foreground">
              Header mode
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Choose enforcing CSP or report-only while you tune violations.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setHeaderMode("enforce")}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                headerMode === "enforce"
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-300 bg-white text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              }`}
            >
              Content-Security-Policy
            </button>
            <button
              type="button"
              onClick={() => setHeaderMode("reportOnly")}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                headerMode === "reportOnly"
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-300 bg-white text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              }`}
            >
              Report-Only
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-foreground">Presets</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Load a starting point, then enable directives and edit sources.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CSP_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                title={p.description}
                onClick={() => applyPreset(p.state)}
                className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800 sm:text-sm"
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setState(DEFAULT_CSP_STATE);
                setImportHint("Reset to defaults.");
              }}
              className="rounded-lg border border-dashed border-zinc-300 px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800 sm:text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            id={uploadId}
            type="file"
            accept=".txt,.csp,text/plain"
            className="sr-only"
            onChange={onFileChange}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            aria-label="Upload a text file containing a CSP"
          >
            <Upload className="h-4 w-4 shrink-0" aria-hidden />
            Import from file
          </button>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            .txt or pasted header — parsed locally
          </span>
        </div>
        {importHint ? (
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            {importHint}
          </p>
        ) : null}

        <div className="space-y-4">
          <h2 className="text-sm font-medium text-foreground">Directives</h2>
          <div className="grid gap-3">
            {DIRECTIVE_DEFS.map((def) => {
              const row = state.directives[def.id];
              return (
                <div
                  key={def.id}
                  className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-900/30"
                >
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={row.enabled}
                      onChange={(e) =>
                        setDirective(def.id, { enabled: e.target.checked })
                      }
                      className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="font-mono text-sm font-medium text-foreground">
                        {def.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-zinc-600 dark:text-zinc-400">
                        {def.description}
                      </span>
                    </span>
                  </label>
                  {def.type === "sources" && row.enabled ? (
                    <input
                      type="text"
                      value={row.sources}
                      onChange={(e) =>
                        setDirective(def.id, { sources: e.target.value })
                      }
                      placeholder={def.placeholder}
                      className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-zinc-600"
                      spellCheck={false}
                      autoComplete="off"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block">
            <span className="text-sm font-medium text-foreground">
              Extra directives (advanced)
            </span>
            <span className="mt-0.5 block text-xs text-zinc-600 dark:text-zinc-400">
              Append any semicolon-separated directives not covered above—for
              example sandbox, nonce, or hash forms you paste from your build.
            </span>
            <textarea
              value={state.extraDirectives}
              onChange={(e) =>
                setState((s) => ({ ...s, extraDirectives: e.target.value }))
              }
              rows={3}
              className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-zinc-600"
              spellCheck={false}
              placeholder="script-src 'sha256-…'; require-trusted-types-for 'script'"
            />
          </label>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Policy value (header body)
          </p>
          <p className="mt-2 break-all font-mono text-sm leading-relaxed text-foreground sm:text-base">
            {policyValue || "(enable at least one directive)"}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copyText(policyValue, "policy")}
              disabled={!policyValue.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {copyPolicyOk ? (
                <Check className="h-4 w-4" aria-hidden />
              ) : (
                <Copy className="h-4 w-4" aria-hidden />
              )}
              Copy policy value
            </button>
            <button
              type="button"
              onClick={() => copyText(fullHeaderLine, "header")}
              disabled={!policyValue.trim()}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              {copyHeaderOk ? (
                <Check className="h-4 w-4" aria-hidden />
              ) : (
                <Copy className="h-4 w-4" aria-hidden />
              )}
              Copy full header line
            </button>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
            HTML meta (fallback only): use{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px] dark:bg-zinc-900">
              http-equiv=&quot;{headerName}&quot;
            </code>{" "}
            and a <code className="font-mono text-[11px]">content</code> string
            matching the policy above—escape embedded double quotes. Prefer
            sending the header from your server or CDN.
          </p>
        </div>
      </div>
    </div>
  );
}
