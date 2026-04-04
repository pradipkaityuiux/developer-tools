"use client";

import { Copy, Upload } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

type Mode = "auto" | "json" | "xml";

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
      message: "Enter text to validate.",
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
    <div
      className={
        depth > 0
          ? "ml-3 border-l border-zinc-200 pl-3 dark:border-zinc-800"
          : ""
      }
    >
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

/* —— XML helpers (aligned with dev/xml-formatter) —— */

function escapeText(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(s: string): string {
  return escapeText(s).replace(/"/g, "&quot;");
}

function getParseErrorMessage(doc: Document): string | null {
  const err = doc.querySelector("parsererror");
  if (!err) return null;
  const text = err.textContent?.trim() ?? "Invalid XML.";
  return text.replace(/\s+/g, " ").trim();
}

function formatNode(node: Node, depth: number, indentStr: string): string {
  const pad = indentStr.repeat(depth);
  if (node.nodeType === Node.TEXT_NODE) {
    const t = node.textContent ?? "";
    if (!t.trim()) return "";
    return `${pad}${escapeText(t.trim())}\n`;
  }
  if (node.nodeType === Node.CDATA_SECTION_NODE) {
    const cd = node as CDATASection;
    return `${pad}<![CDATA[${cd.data}]]>\n`;
  }
  if (node.nodeType === Node.COMMENT_NODE) {
    const c = node as Comment;
    return `${pad}<!--${c.data}-->\n`;
  }
  if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
    const pi = node as ProcessingInstruction;
    const body = pi.data ? ` ${pi.data}` : "";
    return `${pad}<?${pi.target}${body}?>\n`;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  return formatElement(node as Element, depth, indentStr);
}

function formatElement(el: Element, depth: number, indentStr: string): string {
  const pad = indentStr.repeat(depth);
  const name = el.tagName;
  let attrs = "";
  for (let i = 0; i < el.attributes.length; i++) {
    const a = el.attributes[i];
    attrs += ` ${a.name}="${escapeAttr(a.value)}"`;
  }

  const children = [...el.childNodes];
  const nonEmpty = children.filter((n) => {
    if (n.nodeType === Node.TEXT_NODE)
      return Boolean((n.textContent ?? "").trim());
    return (
      n.nodeType === Node.ELEMENT_NODE ||
      n.nodeType === Node.COMMENT_NODE ||
      n.nodeType === Node.CDATA_SECTION_NODE ||
      n.nodeType === Node.PROCESSING_INSTRUCTION_NODE
    );
  });

  if (nonEmpty.length === 0) {
    return `${pad}<${name}${attrs}/>\n`;
  }

  if (nonEmpty.length === 1 && nonEmpty[0].nodeType === Node.TEXT_NODE) {
    const text = (nonEmpty[0] as Text).textContent ?? "";
    return `${pad}<${name}${attrs}>${escapeText(text.trim())}</${name}>\n`;
  }

  let out = `${pad}<${name}${attrs}>\n`;
  for (const child of children) {
    out += formatNode(child, depth + 1, indentStr);
  }
  out += `${pad}</${name}>\n`;
  return out;
}

function minifyXml(doc: Document): string {
  const root = doc.documentElement;
  if (!root) return "";

  function minNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent ?? "";
    }
    if (node.nodeType === Node.CDATA_SECTION_NODE) {
      return `<![CDATA[${(node as CDATASection).data}]]>`;
    }
    if (node.nodeType === Node.COMMENT_NODE) {
      return `<!--${(node as Comment).data}-->`;
    }
    if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
      const pi = node as ProcessingInstruction;
      const body = pi.data ? ` ${pi.data}` : "";
      return `<?${pi.target}${body}?>`;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const el = node as Element;
    const name = el.tagName;
    let attrs = "";
    for (let i = 0; i < el.attributes.length; i++) {
      const a = el.attributes[i];
      attrs += ` ${a.name}="${escapeAttr(a.value)}"`;
    }
    const children = [...el.childNodes];
    if (children.length === 0) return `<${name}${attrs}/>`;
    let inner = "";
    for (const c of children) inner += minNode(c);
    return `<${name}${attrs}>${inner}</${name}>`;
  }

  return minNode(root);
}

function extractXmlDeclaration(source: string): string | null {
  const m = source.trim().match(/^<\?xml[\s\S]*?\?>/);
  return m ? m[0] : null;
}

function stripXmlDeclaration(source: string): string {
  return source.trim().replace(/^<\?xml[\s\S]*?\?>\s*/, "");
}

function parseXmlDocument(raw: string): {
  ok: true;
  doc: Document;
  declaration: string | null;
} | { ok: false; message: string } {
  if (typeof DOMParser === "undefined") {
    return {
      ok: false,
      message: "XML parsing requires a browser (DOMParser is not available).",
    };
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, message: "Enter XML text to validate." };
  }
  const decl = extractXmlDeclaration(raw);
  const body = decl ? stripXmlDeclaration(raw) : raw.trim();
  const parser = new DOMParser();
  const doc = parser.parseFromString(body, "application/xml");
  const parseErr = getParseErrorMessage(doc);
  if (parseErr) {
    return { ok: false, message: parseErr };
  }
  if (!doc.documentElement) {
    return { ok: false, message: "No root element found." };
  }
  return { ok: true, doc, declaration: decl };
}

type ResolvedKind = "json" | "xml";

function resolveKind(text: string, mode: Mode): ResolvedKind | null {
  const t = text.trim();
  if (!t) return null;
  if (mode === "json") {
    return parseJson(text).ok ? "json" : null;
  }
  if (mode === "xml") {
    return parseXmlDocument(text).ok ? "xml" : null;
  }
  if (t.startsWith("<")) {
    return parseXmlDocument(text).ok ? "xml" : null;
  }
  if (parseJson(text).ok) return "json";
  if (parseXmlDocument(text).ok) return "xml";
  return null;
}

function XmlElementTree({
  el,
  path,
  depth,
  expanded,
  onToggle,
}: {
  el: Element;
  path: string;
  depth: number;
  expanded: Set<string>;
  onToggle: (p: string) => void;
}) {
  const name = el.tagName;
  const attrs = [...el.attributes];
  const childElements = [...el.children];
  const textOnly =
    childElements.length === 0
      ? [...el.childNodes]
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => (n.textContent ?? "").trim())
          .filter(Boolean)
          .join(" ")
      : "";

  const hasStructure = childElements.length > 0;
  const isOpen = expanded.has(path);
  const summary = hasStructure
    ? `${childElements.length} ${childElements.length === 1 ? "child" : "children"}`
    : textOnly
      ? "text"
      : "empty";

  const openTag = (
    <>
      <span className="text-rose-700 dark:text-rose-400">&lt;</span>
      <span className="text-sky-800 dark:text-sky-300">{name}</span>
      {attrs.map((a) => (
        <span key={a.name} className="text-zinc-600 dark:text-zinc-400">
          {" "}
          <span className="text-violet-700 dark:text-violet-400">{a.name}</span>
          <span className="text-zinc-500">=</span>
          <span className="text-emerald-700 dark:text-emerald-400">
            &quot;{escapeText(a.value)}&quot;
          </span>
        </span>
      ))}
      <span className="text-rose-700 dark:text-rose-400">
        {hasStructure || !textOnly ? ">" : "/>"}
      </span>
    </>
  );

  if (!hasStructure) {
    if (textOnly) {
      return (
        <div
          className={
            depth > 0
              ? "ml-3 border-l border-zinc-200 pl-3 dark:border-zinc-800"
              : ""
          }
        >
          <span className="font-mono text-sm break-all">
            <span className="text-rose-700 dark:text-rose-400">&lt;</span>
            <span className="text-sky-800 dark:text-sky-300">{name}</span>
            {attrs.map((a) => (
              <span key={a.name} className="text-zinc-600 dark:text-zinc-400">
                {" "}
                <span className="text-violet-700 dark:text-violet-400">
                  {a.name}
                </span>
                <span className="text-zinc-500">=</span>
                <span className="text-emerald-700 dark:text-emerald-400">
                  &quot;{escapeText(a.value)}&quot;
                </span>
              </span>
            ))}
            <span className="text-rose-700 dark:text-rose-400">&gt;</span>
            <span className="text-emerald-800 dark:text-emerald-300">
              {escapeText(textOnly)}
            </span>
            <span className="text-rose-700 dark:text-rose-400">
              &lt;/{name}&gt;
            </span>
          </span>
        </div>
      );
    }
    return (
      <div
        className={
          depth > 0
            ? "ml-3 border-l border-zinc-200 pl-3 dark:border-zinc-800"
            : ""
        }
      >
        <span className="font-mono text-sm text-zinc-600 dark:text-zinc-400">
          <span className="text-rose-700 dark:text-rose-400">&lt;</span>
          <span className="text-sky-800 dark:text-sky-300">{name}</span>
          {attrs.map((a) => (
            <span key={a.name}>
              {" "}
              <span className="text-violet-700 dark:text-violet-400">
                {a.name}
              </span>
              <span className="text-zinc-500">=</span>
              <span className="text-emerald-700 dark:text-emerald-400">
                &quot;{escapeText(a.value)}&quot;
              </span>
            </span>
          ))}
          <span className="text-rose-700 dark:text-rose-400"> /&gt;</span>
        </span>
      </div>
    );
  }

  return (
    <div
      className={
        depth > 0
          ? "ml-3 border-l border-zinc-200 pl-3 dark:border-zinc-800"
          : ""
      }
    >
      <button
        type="button"
        onClick={() => onToggle(path)}
        className="flex flex-wrap items-baseline gap-1 text-left font-mono text-sm text-foreground hover:underline"
        aria-expanded={isOpen}
      >
        <span className="text-zinc-500 dark:text-zinc-400">
          {isOpen ? "▼" : "▶"}
        </span>
        {!isOpen ? (
          <>
            <span className="text-rose-700 dark:text-rose-400">&lt;</span>
            <span className="text-sky-800 dark:text-sky-300">{name}</span>
            <span className="text-rose-700 dark:text-rose-400">…</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {summary}
            </span>
            <span className="text-rose-700 dark:text-rose-400">
              &lt;/{name}&gt;
            </span>
          </>
        ) : (
          openTag
        )}
      </button>
      {isOpen && (
        <ul className="mt-1 list-none space-y-1.5">
          {childElements.map((child, i) => {
            const cp = `${path}/c${i}`;
            return (
              <li key={cp}>
                <XmlElementTree
                  el={child}
                  path={cp}
                  depth={depth + 1}
                  expanded={expanded}
                  onToggle={onToggle}
                />
              </li>
            );
          })}
        </ul>
      )}
      {isOpen && hasStructure && (
        <span className="font-mono text-sm text-rose-700 dark:text-rose-400">
          &lt;/{name}&gt;
        </span>
      )}
    </div>
  );
}

function collectJsonPaths(val: unknown, p: string, paths: Set<string>) {
  paths.add(p);
  if (val === null || typeof val !== "object") return;
  const o = val as Record<string, unknown> | unknown[];
  if (Array.isArray(o)) {
    o.forEach((item, i) => {
      const cp = pathChild(p, i);
      collectJsonPaths(item, cp, paths);
    });
  } else {
    Object.keys(o).forEach((k) => {
      const cp = pathChild(p, k);
      collectJsonPaths(o[k], cp, paths);
    });
  }
}

function collectXmlPaths(el: Element, path: string, paths: Set<string>) {
  paths.add(path);
  [...el.children].forEach((child, i) => {
    collectXmlPaths(child, `${path}/c${i}`, paths);
  });
}

const SAMPLE_JSON = `{
  "status": 200,
  "data": {
    "user": { "id": 42, "name": "Ada" },
    "items": [1, 2, 3]
  }
}`;

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<response xmlns="https://example.com/api">
  <meta><requestId>req-001</requestId></meta>
  <result ok="true">
    <item id="a">First</item>
    <item id="b">Second</item>
  </result>
</response>`;

export function ApiResponseFormatterTool() {
  const [text, setText] = useState(SAMPLE_JSON);
  const [mode, setMode] = useState<Mode>("auto");
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(["$"]));
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadId = useId();

  const jsonResult = useMemo(() => parseJson(text), [text]);
  const xmlResult = useMemo(() => parseXmlDocument(text), [text]);

  const resolvedKind = useMemo(
    () => resolveKind(text, mode),
    [text, mode],
  );

  useEffect(() => {
    setExpanded(new Set(["$"]));
  }, [resolvedKind]);

  const displayError = useMemo(() => {
    if (!text.trim()) {
      return { kind: "empty" as const, message: "Paste a JSON or XML response." };
    }
    if (resolvedKind) return null;
    if (mode === "json") {
      return jsonResult.ok
        ? null
        : {
            kind: "json" as const,
            message: jsonResult.message,
            line: jsonResult.line,
            column: jsonResult.column,
            position: jsonResult.position,
          };
    }
    if (mode === "xml") {
      return xmlResult.ok
        ? null
        : { kind: "xml" as const, message: xmlResult.message };
    }
    const t = text.trim();
    if (t.startsWith("<")) {
      return xmlResult.ok
        ? null
        : { kind: "xml" as const, message: xmlResult.message };
    }
    if (!jsonResult.ok && !xmlResult.ok) {
      return {
        kind: "both" as const,
        jsonMsg: jsonResult.message,
        xmlMsg: xmlResult.message,
      };
    }
    return jsonResult.ok
      ? null
      : {
          kind: "json" as const,
          message: jsonResult.message,
          line: jsonResult.line,
          column: jsonResult.column,
          position: jsonResult.position,
        };
  }, [text, mode, resolvedKind, jsonResult, xmlResult]);

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

  const expandAllJson = useCallback(() => {
    if (jsonResult.ok !== true) return;
    const paths = new Set<string>();
    collectJsonPaths(jsonResult.value, "$", paths);
    setExpanded(paths);
  }, [jsonResult]);

  const expandAllXml = useCallback(() => {
    if (xmlResult.ok !== true) return;
    const root = xmlResult.doc.documentElement;
    const paths = new Set<string>();
    collectXmlPaths(root, "$", paths);
    setExpanded(paths);
  }, [xmlResult]);

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
    if (resolvedKind === "json" && jsonResult.ok) {
      setText(JSON.stringify(jsonResult.value, null, 2));
      return;
    }
    if (resolvedKind === "xml" && xmlResult.ok) {
      const decl = xmlResult.declaration;
      const root = xmlResult.doc.documentElement;
      const formatted = formatElement(root, 0, "  ");
      setText(decl ? `${decl}\n${formatted}` : formatted);
      return;
    }
  }

  function onMinify() {
    if (resolvedKind === "json" && jsonResult.ok) {
      setText(JSON.stringify(jsonResult.value));
      return;
    }
    if (resolvedKind === "xml" && xmlResult.ok) {
      const decl = xmlResult.declaration;
      const mini = minifyXml(xmlResult.doc);
      setText(decl ? `${decl}\n${mini}` : mini);
      return;
    }
  }

  function loadSample() {
    if (mode === "xml") {
      setText(SAMPLE_XML);
      return;
    }
    if (mode === "auto") {
      setText(SAMPLE_JSON);
      return;
    }
    setText(SAMPLE_JSON);
  }

  function onUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const s = typeof reader.result === "string" ? reader.result : "";
      setText(s);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const valid = resolvedKind !== null;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-foreground">Format</span>
          {(
            [
              ["auto", "Auto"],
              ["json", "JSON"],
              ["xml", "XML"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setMode(k)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === k
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {label}
            </button>
          ))}
          {valid && (
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Detected: {resolvedKind === "json" ? "JSON" : "XML"}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor="api-response-input"
            className="block text-sm font-medium text-foreground"
          >
            API response (JSON or XML)
          </label>
          <textarea
            id="api-response-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            rows={14}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            placeholder='Paste JSON {"a":1} or XML &lt;root/&gt;…'
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onFormat}
            disabled={!valid}
            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Format &amp; validate
          </button>
          <button
            type="button"
            onClick={onMinify}
            disabled={!valid}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
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
            onClick={() => copyToClipboard(text, "response")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <Copy className="size-4 shrink-0" aria-hidden />
            Copy
          </button>
          <input
            ref={fileInputRef}
            id={uploadId}
            type="file"
            accept=".json,.xml,.txt,application/json,text/xml,application/xml"
            className="sr-only"
            onChange={onUploadFile}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <Upload className="size-4 shrink-0" aria-hidden />
            Upload file
          </button>
          <button
            type="button"
            onClick={loadSample}
            className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Load sample
          </button>
        </div>

        {valid && resolvedKind === "json" && (
          <p
            className="text-sm font-medium text-emerald-700 dark:text-emerald-400"
            role="status"
          >
            Valid JSON — format to indent, or explore the tree below.
          </p>
        )}
        {valid && resolvedKind === "xml" && (
          <p
            className="text-sm font-medium text-emerald-700 dark:text-emerald-400"
            role="status"
          >
            Well-formed XML — format to indent, or explore the element tree
            below.
          </p>
        )}

        {displayError && (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            {displayError.kind === "empty" && (
              <p className="font-medium">{displayError.message}</p>
            )}
            {displayError.kind === "json" && (
              <>
                <p className="font-medium">Invalid JSON</p>
                <p className="mt-1 font-mono text-xs break-all opacity-90">
                  {displayError.message}
                </p>
                {displayError.position !== null && (
                  <p className="mt-1 text-xs">
                    Near line {displayError.line}, column {displayError.column}{" "}
                    (character {displayError.position})
                  </p>
                )}
              </>
            )}
            {displayError.kind === "xml" && (
              <>
                <p className="font-medium">Invalid XML</p>
                <p className="mt-1 font-mono text-xs break-all opacity-90">
                  {displayError.message}
                </p>
              </>
            )}
            {displayError.kind === "both" && (
              <>
                <p className="font-medium">Could not parse as JSON or XML</p>
                <p className="mt-2 text-xs font-semibold uppercase text-red-800 dark:text-red-300">
                  JSON
                </p>
                <p className="font-mono text-xs break-all opacity-90">
                  {displayError.jsonMsg}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase text-red-800 dark:text-red-300">
                  XML
                </p>
                <p className="font-mono text-xs break-all opacity-90">
                  {displayError.xmlMsg}
                </p>
              </>
            )}
          </div>
        )}

        {copyHint && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{copyHint}</p>
        )}

        {valid && resolvedKind === "json" && jsonResult.ok && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                JSON tree
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={expandAllJson}
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
                data={jsonResult.value}
                path="$"
                depth={0}
                expanded={expanded}
                onToggle={toggle}
              />
            </div>
          </div>
        )}

        {valid && resolvedKind === "xml" && xmlResult.ok && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                XML element tree
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={expandAllXml}
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
              <XmlElementTree
                el={xmlResult.doc.documentElement}
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
