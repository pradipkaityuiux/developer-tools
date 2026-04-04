"use client";

import { useCallback, useMemo, useState } from "react";

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Sample RSS-style fragment -->
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Example</title>
  <entry><id>1</id><title>Post</title></entry>
</feed>`;

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

  if (
    nonEmpty.length === 1 &&
    nonEmpty[0].nodeType === Node.TEXT_NODE
  ) {
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

type StructureStats = {
  rootName: string;
  elementCount: number;
  maxDepth: number;
  tagCounts: Record<string, number>;
};

function analyzeStructure(el: Element, depth: number): StructureStats {
  const tagCounts: Record<string, number> = {};
  let elementCount = 0;
  let maxDepth = depth;

  function walk(node: Element, d: number) {
    elementCount += 1;
    const tag = node.tagName;
    tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    if (d > maxDepth) maxDepth = d;
    for (const child of node.children) {
      walk(child, d + 1);
    }
  }

  walk(el, depth);
  return {
    rootName: el.tagName,
    elementCount,
    maxDepth,
    tagCounts,
  };
}

function extractXmlDeclaration(source: string): string | null {
  const m = source.trim().match(/^<\?xml[\s\S]*?\?>/);
  return m ? m[0] : null;
}

function stripXmlDeclaration(source: string): string {
  return source.trim().replace(/^<\?xml[\s\S]*?\?>\s*/, "");
}

export function XmlFormatterTool() {
  const [input, setInput] = useState(SAMPLE_XML);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StructureStats | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "ok" | "err">("idle");

  const tagCountRows = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);
  }, [stats]);

  const runParse = useCallback(
    (mode: "format" | "minify" | "validate") => {
      setError(null);
      setStats(null);
      setCopyState("idle");
      const raw = input;
      const trimmed = raw.trim();
      if (!trimmed) {
        setError("Paste XML in the input area first.");
        setOutput("");
        return;
      }

      const decl = extractXmlDeclaration(raw);
      const body = decl ? stripXmlDeclaration(raw) : raw.trim();

      const parser = new DOMParser();
      const doc = parser.parseFromString(body, "application/xml");
      const parseErr = getParseErrorMessage(doc);
      if (parseErr) {
        setError(parseErr);
        setOutput("");
        return;
      }

      const root = doc.documentElement;
      if (!root) {
        setError("No root element found.");
        setOutput("");
        return;
      }

      setStats(analyzeStructure(root, 1));

      if (mode === "validate") {
        setOutput(trimmed);
        return;
      }

      if (mode === "minify") {
        const mini = minifyXml(doc);
        setOutput(decl ? `${decl}\n${mini}` : mini);
        return;
      }

      const formatted = formatElement(root, 0, "  ");
      setOutput(decl ? `${decl}\n${formatted}` : formatted);
    },
    [input],
  );

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopyState("ok");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("err");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={() => runParse("format")}
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Format / beautify
          </button>
          <button
            type="button"
            onClick={() => runParse("minify")}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Minify
          </button>
          <button
            type="button"
            onClick={() => runParse("validate")}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Validate only
          </button>
          <button
            type="button"
            onClick={() => setInput(SAMPLE_XML)}
            className="text-sm font-medium text-zinc-600 underline decoration-zinc-400 underline-offset-2 hover:text-foreground dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Load sample
          </button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="min-w-0">
            <label
              htmlFor="xml-input"
              className="block text-sm font-medium text-foreground"
            >
              Input XML
            </label>
            <textarea
              id="xml-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              className="mt-1.5 h-64 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-xs leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600 sm:text-sm"
              placeholder="Paste XML here…"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="xml-output"
                className="block text-sm font-medium text-foreground"
              >
                Output
              </label>
              <button
                type="button"
                disabled={!output}
                onClick={copyOutput}
                className="text-sm font-medium text-zinc-600 underline decoration-zinc-400 underline-offset-2 hover:text-foreground disabled:pointer-events-none disabled:opacity-40 dark:text-zinc-400"
              >
                {copyState === "ok"
                  ? "Copied"
                  : copyState === "err"
                    ? "Copy failed"
                    : "Copy"}
              </button>
            </div>
            <textarea
              id="xml-output"
              readOnly
              value={output}
              spellCheck={false}
              className="mt-1.5 h-64 w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs leading-relaxed text-foreground dark:border-zinc-800 dark:bg-zinc-900/80 sm:text-sm"
              placeholder="Formatted or minified XML appears here…"
            />
          </div>
        </div>

        {error ? (
          <p
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>

      {stats ? (
        <div
          className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6"
          aria-live="polite"
        >
          <h2 className="text-sm font-semibold text-foreground">
            Structure insight
          </h2>
          <dl className="mt-3 grid gap-2 text-sm text-zinc-600 dark:text-zinc-400 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wide text-zinc-500">
                Root element
              </dt>
              <dd className="mt-0.5 font-mono text-foreground">{stats.rootName}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-zinc-500">
                Elements
              </dt>
              <dd className="mt-0.5 font-mono text-foreground">
                {stats.elementCount}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-zinc-500">
                Max depth
              </dt>
              <dd className="mt-0.5 font-mono text-foreground">
                {stats.maxDepth}
              </dd>
            </div>
          </dl>
          {tagCountRows.length > 0 ? (
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Top element names
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {tagCountRows.map(([tag, n]) => (
                  <li
                    key={tag}
                    className="rounded-md bg-zinc-100 px-2 py-1 font-mono text-xs text-foreground dark:bg-zinc-800"
                  >
                    {tag}
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {" "}
                      ×{n}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
