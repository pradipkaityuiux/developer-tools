"use client";

import { useCallback, useState } from "react";
import { CopyIconButton } from "@/components/copy-icon-button";
import yaml, { YAMLException } from "js-yaml";

const SAMPLE_YAML = `# GitHub Actions-style fragment (example)
name: CI
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install
        run: npm ci
`;

function jsonReplacer(_key: string, value: unknown): unknown {
  if (typeof value === "bigint") return value.toString();
  if (value instanceof Date) return value.toISOString();
  return value;
}

function formatYamlError(e: unknown): string {
  if (e instanceof YAMLException) {
    const loc =
      e.mark?.line != null
        ? ` (line ${e.mark.line + 1}, column ${e.mark.column + 1})`
        : "";
    return `${e.reason || e.message}${loc}`;
  }
  if (e instanceof Error) return e.message;
  return "Could not parse YAML.";
}

export function YamlToJsonTool() {
  const [yamlInput, setYamlInput] = useState(SAMPLE_YAML);
  const [jsonOutput, setJsonOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);

  const convert = useCallback(() => {
    setError(null);
    setCopyDone(false);
    const trimmed = yamlInput.trim();
    if (!trimmed) {
      setJsonOutput("");
      setError("Paste YAML or load the sample—input is empty.");
      return;
    }
    try {
      const docs = yaml.loadAll(trimmed, null, {
        schema: yaml.DEFAULT_SCHEMA,
      });
      if (!docs.length) {
        setJsonOutput("");
        setError("No YAML document found in the input.");
        return;
      }
      const payload = docs.length === 1 ? docs[0] : docs;
      const json = JSON.stringify(payload, jsonReplacer, 2);
      setJsonOutput(json);
    } catch (e) {
      setJsonOutput("");
      setError(formatYamlError(e));
    }
  }, [yamlInput]);

  async function copyJson() {
    if (!jsonOutput) return;
    try {
      await navigator.clipboard.writeText(jsonOutput);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setError("Could not copy to the clipboard.");
    }
  }

  function downloadJson() {
    if (!jsonOutput) return;
    const blob = new Blob([jsonOutput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        <div className="min-w-0 flex-1">
          <label
            htmlFor="yaml-input"
            className="block text-sm font-medium text-foreground"
          >
            YAML input
          </label>
          <textarea
            id="yaml-input"
            value={yamlInput}
            onChange={(e) => setYamlInput(e.target.value)}
            spellCheck={false}
            className="mt-1.5 h-64 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600 lg:h-80"
            placeholder="Paste your YAML here..."
          />
        </div>
        <div className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-foreground">
            JSON output
          </span>
          <div className="relative mt-1.5">
            <textarea
              readOnly
              value={jsonOutput}
              aria-label="Converted JSON"
              className="h-64 w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-sm text-foreground dark:border-zinc-800 dark:bg-zinc-900/80 lg:h-80"
              placeholder="Click Convert to JSON to see output."
            />
            <CopyIconButton
              placement="corner"
              copied={copyDone}
              onClick={copyJson}
              disabled={!jsonOutput}
              title="Copy JSON"
              aria-label="Copy JSON output"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={convert}
          className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Convert to JSON
        </button>
        <button
          type="button"
          onClick={() => setYamlInput(SAMPLE_YAML)}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          Load sample
        </button>
        <button
          type="button"
          onClick={() => {
            setYamlInput("");
            setJsonOutput("");
            setError(null);
          }}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          Clear
        </button>
        <button
          type="button"
          disabled={!jsonOutput}
          onClick={downloadJson}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          Download .json
        </button>
      </div>

      {error ? (
        <p
          className="mt-4 text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        Parsing runs in your browser. For multi-document YAML (
        <code className="rounded bg-zinc-100 px-1 font-mono dark:bg-zinc-800">
          ---
        </code>{" "}
        separators), the JSON result is a single value if there is one document,
        otherwise an array of all documents.
      </p>
    </div>
  );
}
