export type RobotsDirective =
  | { kind: "allow"; value: string }
  | { kind: "disallow"; value: string }
  | { kind: "crawl-delay"; value: string }
  | { kind: "host"; value: string }
  | { kind: "other"; field: string; value: string };

export type RobotsUserAgentGroup = {
  userAgents: string[];
  directives: RobotsDirective[];
};

export type ParsedRobotsTxt = {
  sitemaps: string[];
  groups: RobotsUserAgentGroup[];
};

/**
 * Best-effort robots.txt parser for display and audits (not a crawler engine).
 */
export function parseRobotsTxt(text: string): ParsedRobotsTxt {
  const lines = text.split(/\r?\n/);
  const sitemaps: string[] = [];
  const groups: RobotsUserAgentGroup[] = [];
  let current: RobotsUserAgentGroup | null = null;

  for (const rawLine of lines) {
    const hash = rawLine.indexOf("#");
    const line = (hash >= 0 ? rawLine.slice(0, hash) : rawLine).trim();
    if (!line) continue;

    const colon = line.indexOf(":");
    if (colon === -1) continue;

    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();

    if (key === "user-agent") {
      if (!current || current.directives.length > 0) {
        current = { userAgents: [value], directives: [] };
        groups.push(current);
      } else {
        current.userAgents.push(value);
      }
      continue;
    }

    if (key === "sitemap") {
      if (value) sitemaps.push(value);
      continue;
    }

    if (!current) {
      current = { userAgents: ["*"], directives: [] };
      groups.push(current);
    }

    if (key === "disallow") {
      current.directives.push({ kind: "disallow", value });
    } else if (key === "allow") {
      current.directives.push({ kind: "allow", value });
    } else if (key === "crawl-delay") {
      current.directives.push({ kind: "crawl-delay", value });
    } else if (key === "host") {
      current.directives.push({ kind: "host", value });
    } else {
      current.directives.push({ kind: "other", field: key, value });
    }
  }

  return { sitemaps: dedupePreserveOrder(sitemaps), groups };
}

function dedupePreserveOrder(urls: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const u of urls) {
    const k = u.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(u);
  }
  return out;
}

export function robotsTxtHints(
  parsed: ParsedRobotsTxt,
  status: number,
  contentType: string | null,
): string[] {
  const hints: string[] = [];

  if (status === 404) {
    hints.push(
      "No robots.txt was returned (404). Most crawlers treat that as no crawl restrictions in the file itself—still verify meta robots, HTTP headers, and Search Console settings.",
    );
  }

  if (
    status >= 200 &&
    status < 300 &&
    contentType &&
    !/text\/plain|text\/plain\s*;/i.test(contentType) &&
    !/^text\//i.test(contentType)
  ) {
    hints.push(
      `Content-Type is "${contentType}". A conventional robots.txt is served as text/plain; unusual types can confuse some validators.`,
    );
  }

  if (status >= 200 && status < 300 && parsed.groups.length === 0) {
    hints.push(
      "No User-agent sections were parsed. If the file is non-empty, check for correct \"Field: value\" lines and encoding.",
    );
  }

  for (const g of parsed.groups) {
    const uaStar = g.userAgents.some(
      (ua) => ua.trim().toLowerCase() === "*",
    );
    if (!uaStar) continue;
    for (const d of g.directives) {
      if (d.kind === "disallow" && d.value.trim() === "/") {
        hints.push(
          'The wildcard User-agent * block includes Disallow: /, which blocks default crawlers from the whole site unless overridden by Allow rules.',
        );
        break;
      }
    }
  }

  for (const sm of parsed.sitemaps) {
    if (!/^https?:\/\//i.test(sm)) {
      hints.push(
        "At least one Sitemap line is not an absolute http(s) URL. Google recommends full URLs in Sitemap directives.",
      );
      break;
    }
  }

  return hints;
}
