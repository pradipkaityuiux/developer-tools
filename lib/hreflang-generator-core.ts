/**
 * Build HTML link[rel=alternate] tags for multilingual hreflang clusters.
 * Output is identical for every URL in the set—paste the block into each page’s <head>.
 */

export type HreflangEntry = {
  url: string;
  hreflang: string;
};

/** Normalize BCP 47–style tags (e.g. en-us → en-US, x-default unchanged). */
export function normalizeHreflang(raw: string): string {
  const s = raw.trim();
  if (!s) return s;
  if (s.toLowerCase() === "x-default") return "x-default";
  const parts = s.split("-").filter(Boolean);
  if (parts.length === 0) return s;
  const out: string[] = [parts[0].toLowerCase()];
  for (let i = 1; i < parts.length; i++) {
    const p = parts[i];
    if (p.length === 2 && /^[a-zA-Z]{2}$/.test(p)) {
      out.push(p.toUpperCase());
    } else if (p.length === 4 && /^[a-zA-Z]{4}$/.test(p)) {
      out.push(p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
    } else {
      out.push(p.toLowerCase());
    }
  }
  return out.join("-");
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/** Ensure absolute URL for validation; does not change display if user prefers relative (we still warn). */
export function normalizeUrlInput(raw: string): string {
  const t = raw.trim();
  if (!t) return t;
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith("//")) return `https:${t}`;
  return `https://${t}`;
}

export function tryParseUrl(raw: string): URL | null {
  const t = raw.trim();
  if (!t) return null;
  try {
    return new URL(normalizeUrlInput(t));
  } catch {
    return null;
  }
}

export const DEFAULT_HREFLANG_EXAMPLES: HreflangEntry[] = [
  { url: "https://www.example.com/", hreflang: "x-default" },
  { url: "https://www.example.com/en/", hreflang: "en" },
  { url: "https://www.example.com/en-gb/", hreflang: "en-GB" },
  { url: "https://www.example.com/de/", hreflang: "de" },
];

export type HreflangBuildResult = {
  html: string;
  warnings: string[];
  entryCount: number;
};

/**
 * One `<link rel="alternate" hreflang="…" href="…" />` per locale, sorted with `x-default` last.
 */
export function buildHreflangLinkTags(entries: HreflangEntry[]): HreflangBuildResult {
  const warnings: string[] = [];
  const byLang = new Map<string, { url: string; normalizedLang: string }>();

  for (let i = 0; i < entries.length; i++) {
    const urlRaw = entries[i].url.trim();
    const langRaw = entries[i].hreflang.trim();
    if (!urlRaw && !langRaw) continue;
    if (!urlRaw || !langRaw) {
      warnings.push(`Row ${i + 1}: both URL and hreflang code are required—skipped.`);
      continue;
    }

    const normalizedLang = normalizeHreflang(langRaw);
    if (byLang.has(normalizedLang)) {
      warnings.push(
        `Duplicate hreflang “${normalizedLang}”: keeping the latest row.`,
      );
    }

    const parsed = tryParseUrl(urlRaw);
    if (!parsed) {
      warnings.push(`Row ${i + 1}: could not parse URL “${urlRaw.slice(0, 80)}${urlRaw.length > 80 ? "…" : ""}”.`);
      continue;
    }

    const displayUrl = /^https?:\/\//i.test(urlRaw.trim()) ? urlRaw.trim() : parsed.toString();

    byLang.set(normalizedLang, {
      url: displayUrl,
      normalizedLang,
    });
  }

  const cleaned = Array.from(byLang.values());

  const hasXDefault = cleaned.some((c) => c.normalizedLang === "x-default");
  if (cleaned.length > 0 && !hasXDefault) {
    warnings.push(
      "Consider adding an x-default row pointing to your fallback page (often the global English or country picker).",
    );
  }

  const schemes = new Set(cleaned.map((c) => tryParseUrl(c.url)?.protocol ?? ""));
  if (schemes.size > 1) {
    warnings.push("URLs use mixed schemes (http vs https)—prefer HTTPS everywhere for consistency.");
  }

  const sorted = [...cleaned].sort((a, b) => {
    const ax = a.normalizedLang === "x-default" ? 1 : 0;
    const bx = b.normalizedLang === "x-default" ? 1 : 0;
    if (ax !== bx) return ax - bx;
    return a.normalizedLang.localeCompare(b.normalizedLang, "en");
  });

  const lines = sorted.map(
    (row) =>
      `<link rel="alternate" hreflang="${escapeHtmlAttr(row.normalizedLang)}" href="${escapeHtmlAttr(row.url)}" />`,
  );

  return {
    html: lines.join("\n"),
    warnings,
    entryCount: sorted.length,
  };
}

/** Parse CSV/TSV or “url lang” lines from an uploaded file or pasted text. */
export function parseHreflangImport(text: string): HreflangEntry[] {
  const out: HreflangEntry[] = [];
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;

    let url = "";
    let lang = "";

    if (t.includes("\t")) {
      const p = t.split("\t");
      url = (p[0] ?? "").trim();
      lang = (p[1] ?? "").trim();
    } else if (t.includes(",")) {
      const idx = t.indexOf(",");
      url = t.slice(0, idx).trim();
      lang = t.slice(idx + 1).trim();
    } else {
      const m = t.match(/^(\S+)\s+(.+)$/);
      if (m) {
        url = m[1].trim();
        lang = m[2].trim();
      }
    }

    if (url && lang) out.push({ url, hreflang: lang });
  }
  return out;
}
