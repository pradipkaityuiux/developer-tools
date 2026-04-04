/** Escape text for XML element bodies and attributes. */
export function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export type Changefreq =
  | ""
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export type ParseUrlResult =
  | { ok: true; url: string }
  | { ok: false; line: string; reason: string };

/** Non-OK parse results surfaced in the UI (skipped lines). */
export type ParseUrlError = { line: string; reason: string };

function normalizeBase(origin: string): string | null {
  const t = origin.trim();
  if (!t) return null;
  try {
    const withProto = /^https?:\/\//i.test(t) ? t : `https://${t}`;
    const u = new URL(withProto);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

/** Parse one line into an absolute http(s) URL, optionally resolving paths against baseOrigin. */
export function parseUrlLine(
  line: string,
  baseOrigin: string | undefined,
): ParseUrlResult {
  const trimmed = line.trim();
  if (!trimmed) {
    return { ok: false, line: "", reason: "empty" };
  }
  try {
    if (/^https?:\/\//i.test(trimmed)) {
      const u = new URL(trimmed);
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        return { ok: false, line, reason: "Only http and https URLs are allowed." };
      }
      u.hash = "";
      return { ok: true, url: u.toString() };
    }
    const base = normalizeBase(baseOrigin ?? "");
    if (!base) {
      return {
        ok: false,
        line,
        reason:
          "Relative path — add a site origin (e.g. https://example.com) or use full URLs.",
      };
    }
    if (!trimmed.startsWith("/")) {
      return {
        ok: false,
        line,
        reason:
          "Use an absolute URL or a path starting with / when a site origin is set.",
      };
    }
    const u = new URL(trimmed, `${base}/`);
    u.hash = "";
    return { ok: true, url: u.toString() };
  } catch {
    return { ok: false, line, reason: "Invalid URL." };
  }
}

export type SitemapBuildOptions = {
  /** YYYY-MM-DD or empty to omit lastmod */
  lastmod: string | null;
  changefreq: Changefreq;
  /** 0–1 as string e.g. "0.8", or empty to omit */
  priority: string;
};

export function buildSitemapXml(
  urls: string[],
  options: SitemapBuildOptions,
): string {
  const unique = [...new Set(urls)];
  const lines: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ];

  for (const raw of unique) {
    const loc = escapeXml(raw);
    lines.push(`  <url>`);
    lines.push(`    <loc>${loc}</loc>`);
    if (options.lastmod) {
      lines.push(`    <lastmod>${escapeXml(options.lastmod)}</lastmod>`);
    }
    if (options.changefreq) {
      lines.push(`    <changefreq>${options.changefreq}</changefreq>`);
    }
    if (options.priority !== "") {
      const p = Number.parseFloat(options.priority);
      if (!Number.isNaN(p) && p >= 0 && p <= 1) {
        lines.push(`    <priority>${p.toFixed(1)}</priority>`);
      }
    }
    lines.push(`  </url>`);
  }

  lines.push(`</urlset>`);
  return lines.join("\n");
}

export function parseUrlList(
  text: string,
  baseOrigin: string | undefined,
): { urls: string[]; errors: ParseUrlError[] } {
  const lines = text.split(/\r?\n/);
  const urls: string[] = [];
  const errors: ParseUrlError[] = [];
  for (const line of lines) {
    const r = parseUrlLine(line, baseOrigin);
    if (r.ok) urls.push(r.url);
    else if (r.reason !== "empty")
      errors.push({ line: r.line, reason: r.reason });
  }
  return { urls, errors };
}
