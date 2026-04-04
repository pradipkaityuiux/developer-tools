export type UrlExtractorOptions = {
  /** Match `www.example.com/path` and prefix `https://` in results */
  includeBareWww: boolean;
  /** Pull values from `href="..."` attributes (HTML / partial markup) */
  extractHrefAttributes: boolean;
};

const TRAILING_STRIP = /[.,;:!?)>\]}]+$/;

function trimUrlTail(raw: string): string {
  let s = raw.trim();
  while (s.length > 0) {
    const next = s.replace(TRAILING_STRIP, "");
    if (next === s) break;
    s = next;
  }
  return s;
}

const ABS_HTTP_RE =
  /\bhttps?:\/\/[^\s<>"'`{}|\\^\[\]]+/gi;

const WWW_RE = /\bwww\.[^\s<>"'`{}|\\^\[\]]+/gi;

const HREF_RE = /\bhref\s*=\s*(["'])([^"']+)\1/gi;

/**
 * Extract http(s) URLs and optional `www.` hosts from plain text or HTML-ish blobs.
 * Order is preserved; duplicates (case-sensitive string match after trim) removed.
 */
export function extractUrls(
  input: string,
  options: UrlExtractorOptions,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  function pushCandidate(raw: string) {
    const cleaned = trimUrlTail(raw);
    if (!cleaned || seen.has(cleaned)) return;
    seen.add(cleaned);
    out.push(cleaned);
  }

  const text = input;
  let match: RegExpExecArray | null;
  if (options.extractHrefAttributes) {
    const re = new RegExp(HREF_RE.source, HREF_RE.flags);
    while ((match = re.exec(input)) !== null) {
      const value = match[2]?.trim();
      if (!value) continue;
      const unescaped = value
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">");
      if (/^https?:\/\//i.test(unescaped)) {
        pushCandidate(unescaped);
      } else if (options.includeBareWww && /^www\./i.test(unescaped)) {
        pushCandidate(`https://${unescaped}`);
      }
    }
  }

  const absRe = new RegExp(ABS_HTTP_RE.source, ABS_HTTP_RE.flags);
  while ((match = absRe.exec(text)) !== null) {
    pushCandidate(match[0]);
  }

  if (options.includeBareWww) {
    const w = new RegExp(WWW_RE.source, WWW_RE.flags);
    while ((match = w.exec(text)) !== null) {
      pushCandidate(`https://${trimUrlTail(match[0])}`);
    }
  }

  return out;
}

export function formatUrlList(urls: string[], onePerLine: boolean): string {
  if (urls.length === 0) return "";
  return onePerLine ? urls.join("\n") : urls.join(", ");
}
