/** Max meaningful head content for meta extraction; body is often unnecessary. */
const HEAD_SNIPPET_CHARS = 400_000;

export type ParsedPageMeta = {
  title: string | null;
  description: string | null;
  keywords: string | null;
  robots: string | null;
  viewport: string | null;
  charset: string | null;
  canonical: string | null;
  openGraph: Record<string, string>;
  twitter: Record<string, string>;
  otherMeta: Array<{
    name?: string;
    property?: string;
    content?: string;
    charset?: string;
    httpEquiv?: string;
  }>;
};

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "");
}

function decodeHtmlEntities(raw: string): string {
  let s = raw;
  s = s.replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
    const cp = parseInt(hex, 16);
    return Number.isFinite(cp) ? String.fromCodePoint(cp) : _;
  });
  s = s.replace(/&#(\d+);/g, (_, dec) => {
    const cp = parseInt(dec, 10);
    return Number.isFinite(cp) ? String.fromCodePoint(cp) : _;
  });
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/** Parse attributes from the inside of an opening tag (after tag name). */
function parseAttrString(inner: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re =
    /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(inner)) !== null) {
    const key = m[1].toLowerCase();
    const val = m[2] ?? m[3] ?? m[4] ?? "";
    attrs[key] = val;
  }
  return attrs;
}

function parseMetaAttrs(fragment: string): Record<string, string> {
  const inner = fragment
    .replace(/^<\s*meta\s+/i, "")
    .replace(/\s*\/?>\s*$/i, "");
  return parseAttrString(inner);
}

function parseLinkAttrs(fragment: string): Record<string, string> {
  const inner = fragment
    .replace(/^<\s*link\s+/i, "")
    .replace(/\s*\/?>\s*$/i, "");
  return parseAttrString(inner);
}

function snippetForScan(html: string): string {
  if (html.length <= HEAD_SNIPPET_CHARS) return html;
  return html.slice(0, HEAD_SNIPPET_CHARS);
}

/**
 * Extract title, description-class meta, Open Graph, Twitter Card, canonical,
 * and other common meta tags from HTML (typically the first ~400k chars).
 */
export function extractMetaFromHtml(html: string): ParsedPageMeta {
  const scan = snippetForScan(html);

  const titleMatch = scan.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const titleRaw = titleMatch?.[1];
  const title = titleRaw
    ? decodeHtmlEntities(stripTags(titleRaw).replace(/\s+/g, " ").trim()) ||
      null
    : null;

  let charset: string | null = null;
  let description: string | null = null;
  let keywords: string | null = null;
  let robots: string | null = null;
  let viewport: string | null = null;
  const openGraph: Record<string, string> = {};
  const twitter: Record<string, string> = {};
  const otherMeta: ParsedPageMeta["otherMeta"] = [];

  const metaRe = /<meta\s[^>]+>/gi;
  let mm: RegExpExecArray | null;
  while ((mm = metaRe.exec(scan)) !== null) {
    const attrs = parseMetaAttrs(mm[0]);
    if (attrs.charset) {
      charset = attrs.charset.trim() || charset;
    }
    const httpEquiv = (attrs["http-equiv"] || "").toLowerCase();
    if (httpEquiv === "content-type" && attrs.content) {
      const m = attrs.content.match(/charset\s*=\s*([\w-]+)/i);
      if (m?.[1]) charset = m[1].trim();
    }

    const property = (attrs.property || "").trim();
    const name = (attrs.name || "").trim();
    const content =
      attrs.content !== undefined ? attrs.content : "";

    const propLower = property.toLowerCase();
    const nameLower = name.toLowerCase();

    if (propLower.startsWith("og:")) {
      openGraph[property] = content;
      continue;
    }
    if (
      propLower.startsWith("twitter:") ||
      nameLower.startsWith("twitter:")
    ) {
      const key = nameLower.startsWith("twitter:") ? name : property;
      if (key) twitter[key] = content;
      continue;
    }

    if (nameLower === "description" && content) {
      description = decodeHtmlEntities(content.trim()) || description;
      continue;
    }
    if (nameLower === "keywords" && content) {
      keywords = decodeHtmlEntities(content.trim()) || keywords;
      continue;
    }
    if (nameLower === "robots" && content) {
      robots = content.trim() || robots;
      continue;
    }
    if (nameLower === "viewport" && content) {
      viewport = content.trim() || viewport;
      continue;
    }

    if (
      name ||
      property ||
      attrs.content !== undefined ||
      attrs.charset ||
      attrs["http-equiv"]
    ) {
      otherMeta.push({
        name: name || undefined,
        property: property || undefined,
        content: attrs.content,
        charset: attrs.charset,
        httpEquiv: attrs["http-equiv"],
      });
    }
  }

  if (!description && openGraph["og:description"]) {
    description = decodeHtmlEntities(openGraph["og:description"].trim()) || null;
  }

  let canonical: string | null = null;
  const linkRe = /<link\s[^>]+>/gi;
  let lm: RegExpExecArray | null;
  while ((lm = linkRe.exec(scan)) !== null) {
    const attrs = parseLinkAttrs(lm[0]);
    const rel = (attrs.rel || "").toLowerCase();
    if (rel === "canonical" && attrs.href) {
      canonical = attrs.href.trim() || canonical;
      break;
    }
  }

  return {
    title,
    description,
    keywords,
    robots,
    viewport,
    charset,
    canonical,
    openGraph,
    twitter,
    otherMeta,
  };
}
