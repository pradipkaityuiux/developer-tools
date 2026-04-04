import { NextResponse } from "next/server";
import {
  PublicUrlError,
  assertPublicHttpUrl,
  fetchWithPublicRedirects,
} from "@/lib/safe-public-url";

export const runtime = "nodejs";

const MAX_HTML_BYTES = 2_000_000;
const UA = "Mozilla/5.0 (compatible; DevTool-CanonicalTagChecker/1.0)";

type CanonicalRow = {
  index: number;
  rawHref: string;
  absoluteHref: string | null;
  resolveError: string | null;
};

function extractCanonicalHrefs(html: string): string[] {
  const hrefs: string[] = [];
  const linkRe = /<link\b[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(html)) !== null) {
    const tag = m[0];
    const relMatch =
      /\brel\s*=\s*["']([^"']*)["']/i.exec(tag) ??
      /\brel\s*=\s*([^\s>]+)/i.exec(tag);
    if (!relMatch) continue;
    const relTokens = relMatch[1]
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    if (!relTokens.includes("canonical")) continue;
    const hrefMatch =
      /\bhref\s*=\s*["']([^"']*)["']/i.exec(tag) ??
      /\bhref\s*=\s*([^\s>]+)/i.exec(tag);
    if (!hrefMatch) continue;
    const raw = hrefMatch[1].trim();
    if (raw) hrefs.push(raw);
  }
  return hrefs;
}

function normalizeForCompare(u: URL): string {
  const host = u.hostname.toLowerCase();
  const path =
    u.pathname.length > 1 && u.pathname.endsWith("/")
      ? u.pathname.slice(0, -1)
      : u.pathname;
  return `${u.protocol}//${host}${path}${u.search}`;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const urlRaw =
    typeof body === "object" &&
    body !== null &&
    "url" in body &&
    typeof (body as { url: unknown }).url === "string"
      ? (body as { url: string }).url.trim()
      : "";

  if (!urlRaw) {
    return NextResponse.json(
      { error: "Provide a non-empty \"url\" string." },
      { status: 400 },
    );
  }

  let target: URL;
  try {
    target = new URL(urlRaw.includes("://") ? urlRaw : `https://${urlRaw}`);
  } catch {
    return NextResponse.json({ error: "That URL is not valid." }, { status: 400 });
  }

  try {
    await assertPublicHttpUrl(target);
  } catch (e) {
    const msg = e instanceof PublicUrlError ? e.message : "URL not allowed.";
    return NextResponse.json({ error: msg }, { status: 403 });
  }

  let pageRes: Response;
  try {
    pageRes = await fetchWithPublicRedirects(target.toString(), {
      method: "GET",
      headers: {
        "user-agent": UA,
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to fetch page.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const finalUrl = new URL(pageRes.url);
  const pageStatus = pageRes.status;

  if (!pageRes.ok) {
    return NextResponse.json({
      urlRequested: target.href,
      finalUrl: finalUrl.href,
      pageStatus,
      pageOk: false,
      canonicals: [] as CanonicalRow[],
      canonicalCount: 0,
      hasMultipleCanonicals: false,
      hasCanonical: false,
      selfReferencing: null as boolean | null,
      selfReferencingNormalized: null as boolean | null,
      notes: [
        `Document returned HTTP ${pageStatus}; canonical tags may still be present in error pages—verify in context.`,
      ],
    });
  }

  const buf = await pageRes.arrayBuffer();
  const slice =
    buf.byteLength > MAX_HTML_BYTES ? buf.slice(0, MAX_HTML_BYTES) : buf;
  const html = new TextDecoder("utf-8", { fatal: false }).decode(slice);

  const rawHrefs = extractCanonicalHrefs(html);
  const canonicals: CanonicalRow[] = rawHrefs.map((rawHref, i) => {
    try {
      const absolute = new URL(rawHref, finalUrl);
      return {
        index: i + 1,
        rawHref,
        absoluteHref: absolute.href,
        resolveError: null,
      };
    } catch {
      return {
        index: i + 1,
        rawHref,
        absoluteHref: null,
        resolveError: "Could not resolve href against the final URL.",
      };
    }
  });

  const resolved = canonicals
    .map((c) => c.absoluteHref)
    .filter((h): h is string => typeof h === "string");

  let selfReferencing: boolean | null = null;
  let selfReferencingNormalized: boolean | null = null;
  if (resolved.length === 1) {
    try {
      const c = new URL(resolved[0]);
      selfReferencing = c.href === finalUrl.href;
      selfReferencingNormalized =
        normalizeForCompare(c) === normalizeForCompare(finalUrl);
    } catch {
      selfReferencing = null;
      selfReferencingNormalized = null;
    }
  }

  const notes: string[] = [];
  if (rawHrefs.length === 0) {
    notes.push(
      "No <link rel=\"canonical\"> tags were found in the fetched HTML. Search engines may infer a canonical from other signals, but an explicit tag is usually clearer.",
    );
  }
  if (rawHrefs.length > 1) {
    notes.push(
      "Multiple canonical link tags were found. Search engines may ignore duplicates or pick one unpredictably—keep a single canonical per HTML document.",
    );
  }
  if (resolved.length === 1 && selfReferencing === false) {
    if (selfReferencingNormalized) {
      notes.push(
        "Canonical matches the final URL after normalizing trailing slashes on the path; href strings still differ—consider aligning markup with the final address.",
      );
    } else {
      notes.push(
        "Canonical points to a different URL than the address you landed on after redirects. That can be intentional (consolidating duplicates) or a misconfiguration—verify against your sitemap and internal links.",
      );
    }
  }

  return NextResponse.json({
    urlRequested: target.href,
    finalUrl: finalUrl.href,
    pageStatus,
    pageOk: pageRes.ok,
    canonicals,
    canonicalCount: rawHrefs.length,
    hasMultipleCanonicals: rawHrefs.length > 1,
    hasCanonical: rawHrefs.length > 0,
    selfReferencing,
    selfReferencingNormalized,
    notes,
    truncatedHtml: buf.byteLength > MAX_HTML_BYTES,
  });
}
