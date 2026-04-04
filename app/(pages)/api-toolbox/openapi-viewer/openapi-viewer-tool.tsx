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
import { Check, Copy, Upload } from "lucide-react";
import {
  SAMPLE_OPENAPI_YAML,
  type HttpMethod,
  type OpenApiFormat,
  type OperationEntry,
  type ParsedOpenApi,
  listOperations,
  listSchemaNames,
  getSchemaByName,
  parseOpenApiText,
  safeStringify,
} from "@/lib/openapi-viewer-core";

type Panel =
  | { kind: "operation"; path: string; method: HttpMethod }
  | { kind: "schema"; name: string };

function methodBadgeClass(method: HttpMethod): string {
  const map: Record<HttpMethod, string> = {
    get: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200",
    post: "bg-sky-100 text-sky-900 dark:bg-sky-950/80 dark:text-sky-200",
    put: "bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200",
    patch:
      "bg-violet-100 text-violet-900 dark:bg-violet-950/80 dark:text-violet-200",
    delete: "bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-200",
    options:
      "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
    head: "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
    trace:
      "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
  };
  return map[method];
}

export function OpenapiViewerTool() {
  const fileInputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [raw, setRaw] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedOpenApi | null>(null);
  const [operations, setOperations] = useState<OperationEntry[]>([]);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [copyRawDone, setCopyRawDone] = useState(false);
  const [copyDetailDone, setCopyDetailDone] = useState(false);
  const [fileHint, setFileHint] = useState<string | null>(null);

  useEffect(() => {
    if (!fileHint) return;
    const t = window.setTimeout(() => setFileHint(null), 4000);
    return () => window.clearTimeout(t);
  }, [fileHint]);

  const runParse = useCallback(() => {
    const result = parseOpenApiText(raw);
    if (!result.ok) {
      setParseError(result.message);
      setParsed(null);
      setOperations([]);
      setPanel(null);
      return;
    }
    setParseError(null);
    setParsed(result.data);
    const ops = listOperations(result.data.doc);
    setOperations(ops);
    if (ops.length > 0) {
      setPanel({
        kind: "operation",
        path: ops[0].path,
        method: ops[0].method,
      });
    } else {
      const names = listSchemaNames(result.data.doc, result.data.format);
      if (names.length > 0) {
        setPanel({ kind: "schema", name: names[0] });
      } else {
        setPanel(null);
      }
    }
  }, [raw]);

  const schemaNames = useMemo(() => {
    if (!parsed) return [];
    return listSchemaNames(parsed.doc, parsed.format);
  }, [parsed]);

  const selectedOperation = useMemo(() => {
    if (!panel || panel.kind !== "operation") return null;
    return operations.find(
      (o) => o.path === panel.path && o.method === panel.method,
    );
  }, [panel, operations]);

  const detailJson = useMemo(() => {
    if (!parsed) return "";
    if (panel?.kind === "operation" && selectedOperation) {
      return safeStringify(selectedOperation.operation);
    }
    if (panel?.kind === "schema") {
      const sch = getSchemaByName(parsed.doc, parsed.format, panel.name);
      return safeStringify(sch);
    }
    return "";
  }, [parsed, panel, selectedOperation]);

  const copyRaw = useCallback(async () => {
    if (!raw.trim()) return;
    try {
      await navigator.clipboard.writeText(raw);
      setCopyRawDone(true);
      window.setTimeout(() => setCopyRawDone(false), 2000);
    } catch {
      setFileHint("Could not copy to clipboard.");
    }
  }, [raw]);

  const copyDetail = useCallback(async () => {
    if (!detailJson) return;
    try {
      await navigator.clipboard.writeText(detailJson);
      setCopyDetailDone(true);
      window.setTimeout(() => setCopyDetailDone(false), 2000);
    } catch {
      setFileHint("Could not copy to clipboard.");
    }
  }, [detailJson]);

  const onFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setRaw(text);
      setFileHint(`Loaded ${file.name}`);
    };
    reader.onerror = () => setFileHint("Could not read file.");
    reader.readAsText(file, "UTF-8");
  }, []);

  const infoBlock = parsed?.doc.info;
  const info =
    infoBlock && typeof infoBlock === "object"
      ? (infoBlock as Record<string, unknown>)
      : null;

  const servers =
    parsed?.format === "openapi3" &&
    Array.isArray(parsed.doc.servers)
      ? (parsed.doc.servers as unknown[])
      : null;

  return (
    <section
      className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      aria-label="OpenAPI viewer"
    >
      <div className="border-b border-zinc-200 px-4 py-4 dark:border-zinc-800 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Paste OpenAPI (YAML or JSON)
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Client-side parse—then browse paths, operations, and schemas.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRaw(SAMPLE_OPENAPI_YAML)}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Load sample
            </button>
            <button
              type="button"
              onClick={runParse}
              className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              Parse spec
            </button>
            <button
              type="button"
              onClick={copyRaw}
              disabled={!raw.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              title="Copy raw document"
            >
              {copyRawDone ? (
                <Check className="size-4 text-emerald-600" aria-hidden />
              ) : (
                <Copy className="size-4" aria-hidden />
              )}
              Copy
            </button>
            <input
              id={fileInputId}
              ref={fileRef}
              type="file"
              accept=".yaml,.yml,.json,application/json,text/yaml"
              className="sr-only"
              onChange={onFile}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
            >
              <Upload className="size-4" aria-hidden />
              Upload
            </button>
          </div>
        </div>
        {fileHint ? (
          <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">
            {fileHint}
          </p>
        ) : null}
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          spellCheck={false}
          className="mt-4 h-48 w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 font-mono text-sm leading-relaxed text-foreground placeholder:text-zinc-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/40 dark:focus-visible:outline-zinc-100"
          placeholder="openapi: 3.0.3&#10;info:&#10;  title: My API&#10;  version: 1.0.0&#10;paths: {}"
        />
        {parseError ? (
          <p
            className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-100"
            role="alert"
          >
            {parseError}
          </p>
        ) : null}
      </div>

      {parsed ? (
        <div className="flex flex-col lg:flex-row lg:min-h-[28rem]">
          <aside className="w-full shrink-0 border-b border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/30 lg:w-80 lg:border-b-0 lg:border-r">
            <div className="max-h-[40vh] overflow-y-auto p-4 lg:max-h-none">
              {info ? (
                <div className="rounded-lg border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-950">
                  <p className="font-semibold text-foreground">
                    {String(info.title ?? "API")}
                  </p>
                  <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                    Version {String(info.version ?? "—")}
                  </p>
                  {typeof info.description === "string" && info.description ? (
                    <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {info.description}
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs text-zinc-500">
                    {parsed.format === "openapi3" ? "OpenAPI 3" : "Swagger 2.0"}
                  </p>
                </div>
              ) : null}

              {servers && servers.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Servers
                  </h3>
                  <ul className="mt-2 space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
                    {servers.slice(0, 8).map((s, i) => {
                      const sv = s as Record<string, unknown>;
                      const url = typeof sv.url === "string" ? sv.url : "";
                      return (
                        <li key={`${url}-${i}`} className="font-mono break-all">
                          {url || "(no url)"}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              <div className="mt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Operations ({operations.length})
                </h3>
                <ul className="mt-2 space-y-1">
                  {operations.map((op) => {
                    const active =
                      panel?.kind === "operation" &&
                      panel.path === op.path &&
                      panel.method === op.method;
                    return (
                      <li key={`${op.method}:${op.path}`}>
                        <button
                          type="button"
                          onClick={() =>
                            setPanel({
                              kind: "operation",
                              path: op.path,
                              method: op.method,
                            })
                          }
                          className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                            active
                              ? "bg-zinc-200 dark:bg-zinc-800"
                              : "hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
                          }`}
                        >
                          <span
                            className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${methodBadgeClass(op.method)}`}
                          >
                            {op.method}
                          </span>
                          <span className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
                            {op.path}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {schemaNames.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Schemas ({schemaNames.length})
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {schemaNames.map((name) => {
                      const active =
                        panel?.kind === "schema" && panel.name === name;
                      return (
                        <li key={name}>
                          <button
                            type="button"
                            onClick={() => setPanel({ kind: "schema", name })}
                            className={`w-full rounded-lg px-2 py-1.5 text-left font-mono text-xs ${
                              active
                                ? "bg-zinc-200 dark:bg-zinc-800"
                                : "text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
                            }`}
                          >
                            {name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </div>
          </aside>

          <div className="min-w-0 flex-1 p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                {panel?.kind === "operation"
                  ? `${panel.method.toUpperCase()} ${panel.path}`
                  : panel?.kind === "schema"
                    ? `Schema: ${panel.name}`
                    : "Detail"}
              </h3>
              <button
                type="button"
                onClick={copyDetail}
                disabled={!detailJson}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                {copyDetailDone ? (
                  <Check className="size-3.5 text-emerald-600" aria-hidden />
                ) : (
                  <Copy className="size-3.5" aria-hidden />
                )}
                Copy JSON
              </button>
            </div>

            {panel?.kind === "operation" && selectedOperation ? (
              <OperationSummary
                operation={selectedOperation.operation}
                format={parsed.format}
              />
            ) : null}

            <pre className="mt-4 max-h-[min(60vh,32rem)] overflow-auto rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 font-mono text-xs leading-relaxed text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200">
              {detailJson || "Select an operation or schema."}
            </pre>
          </div>
        </div>
      ) : (
        <p className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400 sm:px-6">
          Parse a valid OpenAPI 3.x or Swagger 2.0 document to browse paths and
          schemas.
        </p>
      )}
    </section>
  );
}

function OperationSummary({
  operation,
  format,
}: {
  operation: Record<string, unknown>;
  format: OpenApiFormat;
}) {
  const summary =
    typeof operation.summary === "string" ? operation.summary : null;
  const description =
    typeof operation.description === "string" ? operation.description : null;
  const opId =
    typeof operation.operationId === "string" ? operation.operationId : null;
  const params = Array.isArray(operation.parameters)
    ? operation.parameters
    : [];

  return (
    <div className="mt-3 space-y-3 text-sm">
      {summary ? (
        <p className="font-medium text-foreground">{summary}</p>
      ) : null}
      {opId ? (
        <p className="text-xs text-zinc-500">
          operationId:{" "}
          <code className="rounded bg-zinc-100 px-1 font-mono dark:bg-zinc-900">
            {opId}
          </code>
        </p>
      ) : null}
      {description ? (
        <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      ) : null}

      {params.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Parameters
          </p>
          <div className="mt-2 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full min-w-[32rem] text-left text-xs">
              <thead className="bg-zinc-100 dark:bg-zinc-900/80">
                <tr>
                  <th className="px-2 py-1.5 font-medium">Name</th>
                  <th className="px-2 py-1.5 font-medium">In</th>
                  <th className="px-2 py-1.5 font-medium">Required</th>
                  <th className="px-2 py-1.5 font-medium">Schema / type</th>
                </tr>
              </thead>
              <tbody>
                {params.map((p, i) => {
                  const row = p as Record<string, unknown>;
                  const name = String(row.name ?? "—");
                  const inn = String(row.in ?? "—");
                  const req = Boolean(row.required);
                  const schema =
                    row.schema && typeof row.schema === "object"
                      ? (row.schema as Record<string, unknown>)
                      : null;
                  const typeHint = schema?.type
                    ? String(schema.type)
                    : format === "swagger2" && row.type
                      ? String(row.type)
                      : "—";
                  return (
                    <tr
                      key={`${name}-${inn}-${i}`}
                      className="border-t border-zinc-200 dark:border-zinc-800"
                    >
                      <td className="px-2 py-1.5 font-mono">{name}</td>
                      <td className="px-2 py-1.5">{inn}</td>
                      <td className="px-2 py-1.5">{req ? "yes" : "no"}</td>
                      <td className="px-2 py-1.5 font-mono text-zinc-600 dark:text-zinc-400">
                        {typeHint}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {format === "openapi3" && operation.requestBody ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Request body
          </p>
          <pre className="mt-1 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-2 font-mono text-[11px] dark:border-zinc-800 dark:bg-zinc-900/50">
            {safeStringify(operation.requestBody, 8_000)}
          </pre>
        </div>
      ) : null}

      {operation.responses ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Responses
          </p>
          <pre className="mt-1 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-2 font-mono text-[11px] dark:border-zinc-800 dark:bg-zinc-900/50">
            {safeStringify(operation.responses, 12_000)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
