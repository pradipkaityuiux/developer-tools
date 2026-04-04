"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import {
  format,
  supportedDialects,
  type KeywordCase,
  type SqlLanguage,
} from "sql-formatter";

const DIALECT_LABELS: Record<string, string> = {
  sql: "SQL (generic)",
  postgresql: "PostgreSQL",
  mysql: "MySQL",
  mariadb: "MariaDB",
  sqlite: "SQLite",
  transactsql: "Transact-SQL (SQL Server)",
  plsql: "PL/SQL (Oracle)",
  bigquery: "BigQuery",
  snowflake: "Snowflake",
  redshift: "Amazon Redshift",
  spark: "Spark SQL",
  hive: "Hive",
  trino: "Trino",
  db2: "IBM Db2",
  duckdb: "DuckDB",
  clickhouse: "ClickHouse",
  tidb: "TiDB",
  n1ql: "N1QL (Couchbase)",
  singlestoredb: "SingleStore",
};

const SAMPLE_SQL = `SELECT u.id, u.email, p.title
FROM users AS u
LEFT JOIN posts AS p ON p.user_id = u.id
WHERE u.active = TRUE AND p.published_at >= '2024-01-01'
GROUP BY u.id, u.email, p.title
HAVING COUNT(*) > 0
ORDER BY p.published_at DESC
LIMIT 50;`;

function sortedDialects(): string[] {
  return [...supportedDialects].sort((a, b) => {
    const la = DIALECT_LABELS[a] ?? a;
    const lb = DIALECT_LABELS[b] ?? b;
    return la.localeCompare(lb);
  });
}

export function SqlFormatterTool() {
  const dialectOptions = useMemo(() => sortedDialects(), []);
  const [input, setInput] = useState(SAMPLE_SQL);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<SqlLanguage>("sql");
  const [keywordCase, setKeywordCase] = useState<KeywordCase>("upper");
  const [tabWidth, setTabWidth] = useState(2);
  const [useTabs, setUseTabs] = useState(false);
  const [copyDone, setCopyDone] = useState(false);

  function runFormat() {
    setError(null);
    setCopyDone(false);
    const trimmed = input.trim();
    if (!trimmed) {
      setOutput("");
      setError("Paste a SQL query to format.");
      return;
    }
    try {
      const formatted = format(trimmed, {
        language,
        keywordCase,
        tabWidth: useTabs ? 1 : tabWidth,
        useTabs,
      });
      setOutput(formatted);
    } catch (e) {
      setOutput("");
      setError(
        e instanceof Error ? e.message : "Could not parse SQL—check dialect and quotes.",
      );
    }
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setError("Clipboard access failed—select the output and copy manually.");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          <div>
            <label
              htmlFor="sql-dialect"
              className="block text-sm font-medium text-foreground"
            >
              SQL dialect
            </label>
            <select
              id="sql-dialect"
              value={language}
              onChange={(e) => setLanguage(e.target.value as SqlLanguage)}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            >
              {dialectOptions.map((d) => (
                <option key={d} value={d}>
                  {DIALECT_LABELS[d] ?? d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="sql-keyword-case"
              className="block text-sm font-medium text-foreground"
            >
              Keyword case
            </label>
            <select
              id="sql-keyword-case"
              value={keywordCase}
              onChange={(e) =>
                setKeywordCase(e.target.value as KeywordCase)
              }
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            >
              <option value="upper">UPPERCASE</option>
              <option value="lower">lowercase</option>
              <option value="preserve">Preserve input</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="sql-tab-width"
              className="block text-sm font-medium text-foreground"
            >
              Indent width
            </label>
            <input
              id="sql-tab-width"
              type="number"
              min={1}
              max={8}
              disabled={useTabs}
              value={tabWidth}
              onChange={(e) =>
                setTabWidth(Math.min(8, Math.max(1, Number(e.target.value) || 2)))
              }
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            />
          </div>
          <div className="flex items-end pb-0.5">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={useTabs}
                onChange={(e) => setUseTabs(e.target.checked)}
                className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900"
              />
              Use tab characters
            </label>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setInput(SAMPLE_SQL)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Load sample
          </button>
          <button
            type="button"
            onClick={runFormat}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Format SQL
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <label
            htmlFor="sql-input"
            className="text-sm font-medium text-foreground"
          >
            Input SQL
          </label>
          <textarea
            id="sql-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            rows={16}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            placeholder="SELECT * FROM ..."
          />
        </div>
        <div className="min-w-0">
          <span
            id="sql-output-label"
            className="text-sm font-medium text-foreground"
          >
            Formatted SQL
          </span>
          <div className="relative mt-1.5">
            <textarea
              readOnly
              value={output}
              rows={16}
              spellCheck={false}
              aria-labelledby="sql-output-label"
              className="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 py-2 pr-12 pl-3 font-mono text-sm leading-relaxed text-foreground outline-none dark:border-zinc-800 dark:bg-zinc-950"
              placeholder="Click “Format SQL” to see output here."
            />
            <button
              type="button"
              onClick={copyOutput}
              disabled={!output}
              title={copyDone ? "Copied" : "Copy formatted SQL"}
              aria-label={
                copyDone ? "Copied to clipboard" : "Copy formatted SQL"
              }
              className="absolute right-2 top-2 inline-flex items-center justify-center rounded-md border border-zinc-200 bg-zinc-50/95 p-1.5 text-foreground backdrop-blur-sm transition-colors hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-950/95 dark:hover:bg-zinc-900"
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
        </div>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        Formatting uses the{" "}
        <a
          href="https://github.com/sql-formatter-org/sql-formatter"
          className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          sql-formatter
        </a>{" "}
        library in your browser. Complex procedural scripts may need a
        different dialect or manual splits.
      </p>
    </div>
  );
}
