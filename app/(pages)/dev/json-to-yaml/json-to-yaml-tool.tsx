"use client";

import { useCallback, useId, useState } from "react";
import { CopyIconButton } from "@/components/copy-icon-button";
import yaml from "js-yaml";

const SAMPLE_JSON = `{
  "apiVersion": "v1",
  "kind": "ConfigMap",
  "metadata": {
    "name": "app-config",
    "labels": { "app": "demo" }
  },
  "data": {
    "log_level": "info",
    "max_workers": "4"
  }
}`;

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/yaml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function JsonToYamlTool() {
  const jsonId = useId();
  const yamlId = useId();
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);
  const [yamlOutput, setYamlOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sortKeys, setSortKeys] = useState(false);
  const [indent, setIndent] = useState<2 | 4>(2);
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    setError(null);
    setYamlOutput("");
    const raw = jsonInput.trim();
    if (!raw) {
      setError("Paste JSON to convert, or load the sample with “Use sample”.");
      return;
    }
    try {
      const data = JSON.parse(raw) as unknown;
      const out = yaml.dump(data, {
        indent,
        lineWidth: 120,
        noArrayIndent: false,
        sortKeys,
      });
      setYamlOutput(out.replace(/\n$/, "") + "\n");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid JSON.";
      setError(msg);
    }
  }, [jsonInput, indent, sortKeys]);

  async function copyYaml() {
    if (!yamlOutput) return;
    try {
      await navigator.clipboard.writeText(yamlOutput);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy to the clipboard. Select the YAML and copy manually.");
    }
  }

  return (
    <section
      className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6"
      aria-labelledby="json-to-yaml-tool-heading"
    >
      <h2
        id="json-to-yaml-tool-heading"
        className="text-lg font-semibold tracking-tight text-foreground"
      >
        Convert JSON to YAML
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        Valid JSON only—no comments or trailing commas. Conversion runs in your browser.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setJsonInput(SAMPLE_JSON)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          Use sample
        </button>
        <button
          type="button"
          onClick={() => {
            setJsonInput("");
            setYamlOutput("");
            setError(null);
          }}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          Clear
        </button>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input
            type="checkbox"
            checked={sortKeys}
            onChange={(e) => setSortKeys(e.target.checked)}
            className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
          />
          Sort keys (A–Z)
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="whitespace-nowrap">Indent</span>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value) as 2 | 4)}
            className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm text-foreground dark:border-zinc-600 dark:bg-zinc-900"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <label
            htmlFor={jsonId}
            className="text-sm font-medium text-foreground"
          >
            JSON input
          </label>
          <textarea
            id={jsonId}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            spellCheck={false}
            className="mt-2 h-64 w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 font-mono text-sm leading-relaxed text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:focus-visible:outline-zinc-200"
            placeholder='{"key": "value"}'
          />
        </div>
        <div>
          <label
            htmlFor={yamlId}
            className="text-sm font-medium text-foreground"
          >
            YAML output
          </label>
          <div className="relative mt-2">
            <textarea
              id={yamlId}
              readOnly
              value={yamlOutput}
              placeholder="Click “Convert to YAML” to generate output…"
              spellCheck={false}
              className="h-64 w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50/80 py-3 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:focus-visible:outline-zinc-200"
            />
            <CopyIconButton
              placement="corner"
              copied={copied}
              onClick={copyYaml}
              disabled={!yamlOutput}
              title="Copy YAML"
              aria-label="Copy YAML output"
            />
          </div>
        </div>
      </div>

      {error ? (
        <p
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={convert}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:focus-visible:outline-zinc-100"
        >
          Convert to YAML
        </button>
        <button
          type="button"
          onClick={() => {
            if (yamlOutput)
              downloadText("converted.yaml", yamlOutput);
          }}
          disabled={!yamlOutput}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          Download .yaml
        </button>
      </div>
    </section>
  );
}
