/**
 * Client-side SVG cleanup and compact serialization (no SVGO).
 * Strips comments/scripts, optional metadata/editor cruft, and emits dense markup.
 */

export type SvgOptimizeOptions = {
  stripMetadata: boolean;
  stripEditorData: boolean;
};

const EDITOR_NS_HINTS = /sodipodi|inkscape|sketch|figma|adobe|illustrator/i;

function stripXmlDeclAndBom(input: string): string {
  return input
    .replace(/^\uFEFF/, "")
    .replace(/<\?xml[^?]*\?>\s*/gi, "")
    .trim();
}

function shortenHexColor(value: string): string {
  const v = value.trim();
  const m6 = /^#([0-9a-fA-F]{6})$/.exec(v);
  if (m6) {
    const h = m6[1];
    if (
      h[0] === h[1] &&
      h[2] === h[3] &&
      h[4] === h[5]
    ) {
      return `#${h[0]}${h[2]}${h[4]}`;
    }
  }
  return v;
}

function normalizeAttrValue(name: string, value: string): string {
  const n = name.toLowerCase();
  if (
    n === "fill" ||
    n === "stroke" ||
    n === "stop-color" ||
    n === "flood-color" ||
    n === "lighting-color"
  ) {
    return shortenHexColor(value);
  }
  return value.trim();
}

function shouldStripEditorElement(el: Element): boolean {
  const ns = el.namespaceURI ?? "";
  if (EDITOR_NS_HINTS.test(ns)) return true;
  const tag = el.tagName.toLowerCase();
  if (tag.includes("namedview") || tag.includes("grid")) return true;
  return false;
}

function cleanAttributes(el: Element, opts: SvgOptimizeOptions): void {
  const toRemove: Attr[] = [];
  for (let i = 0; i < el.attributes.length; i++) {
    const a = el.attributes[i];
    if (!a) continue;
    const ln = a.name.toLowerCase();
    if (ln.startsWith("on")) {
      toRemove.push(a);
      continue;
    }
    if (opts.stripEditorData) {
      if (/^xmlns:/.test(a.name) && EDITOR_NS_HINTS.test(a.value)) {
        toRemove.push(a);
        continue;
      }
      if (
        /^(inkscape|sodipodi|sketch|figma):/i.test(a.name) ||
        EDITOR_NS_HINTS.test(a.name)
      ) {
        toRemove.push(a);
        continue;
      }
    }
  }
  for (const a of toRemove) {
    el.removeAttributeNode(a);
  }
}

function cleanTree(el: Element, opts: SvgOptimizeOptions): void {
  cleanAttributes(el, opts);

  const children = Array.from(el.childNodes);
  for (const child of children) {
    if (child.nodeType === Node.COMMENT_NODE) {
      child.parentNode?.removeChild(child);
      continue;
    }
    if (child.nodeType === Node.TEXT_NODE) {
      const t = child.textContent ?? "";
      if (!t.trim()) {
        child.parentNode?.removeChild(child);
      }
      continue;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) {
      continue;
    }
    const ce = child as Element;
    const local = ce.localName.toLowerCase();

    if (local === "script") {
      ce.parentNode?.removeChild(ce);
      continue;
    }

    if (opts.stripMetadata && local === "metadata") {
      ce.parentNode?.removeChild(ce);
      continue;
    }

    if (opts.stripEditorData && shouldStripEditorElement(ce)) {
      ce.parentNode?.removeChild(ce);
      continue;
    }

    cleanTree(ce, opts);
  }
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function serializeElement(el: Element): string {
  const tag = el.tagName.includes(":")
    ? el.tagName
    : el.tagName.toLowerCase();

  const attrs = Array.from(el.attributes)
    .map((a) => ({
      name: a.name,
      value: normalizeAttrValue(a.name, a.value),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const attrStr =
    attrs.length > 0
      ? attrs.map((a) => ` ${a.name}="${escapeAttr(a.value)}"`).join("")
      : "";

  const serializedChildren: string[] = [];
  for (const child of el.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      const raw = child.textContent ?? "";
      const compact = raw.replace(/\s+/g, " ").trim();
      if (compact) serializedChildren.push(compact);
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      serializedChildren.push(serializeElement(child as Element));
    }
  }
  const inner = serializedChildren.join("");

  if (!inner) {
    return `<${tag}${attrStr}/>`;
  }
  return `<${tag}${attrStr}>${inner}</${tag}>`;
}

export type SvgOptimizeResult =
  | {
      ok: true;
      svg: string;
      savedBytes: number;
      originalBytes: number;
      optimizedBytes: number;
    }
  | { ok: false; error: string };

export function optimizeSvgMarkup(
  input: string,
  opts: SvgOptimizeOptions,
): SvgOptimizeResult {
  const raw = stripXmlDeclAndBom(input);
  if (!raw) {
    return { ok: false, error: "Paste or upload SVG markup first." };
  }

  const enc = new TextEncoder();
  const originalBytes = enc.encode(raw).length;

  const doc = new DOMParser().parseFromString(raw, "image/svg+xml");
  const err = doc.querySelector("parsererror");
  if (err) {
    return {
      ok: false,
      error:
        "Could not parse SVG. Check for typos, unclosed tags, or invalid XML.",
    };
  }

  const root = doc.documentElement;
  if (!root || root.localName.toLowerCase() !== "svg") {
    return {
      ok: false,
      error: "Root element must be an <svg> (SVG document or fragment).",
    };
  }

  const clone = root.cloneNode(true) as Element;
  cleanTree(clone, opts);

  let svg = serializeElement(clone);
  svg = svg.replace(/>\s+</g, "><").trim();

  const optimizedBytes = enc.encode(svg).length;
  const savedBytes = Math.max(0, originalBytes - optimizedBytes);

  return { ok: true, svg, savedBytes, originalBytes, optimizedBytes };
}
