import { NextResponse } from "next/server";
import {
  PublicUrlError,
  assertPublicHttpUrl,
  fetchWithPublicRedirects,
} from "@/lib/safe-public-url";

export const runtime = "nodejs";

const MAX_HTML_BYTES = 2_000_000;
const MAX_LINK_CHECKS = 80;
const CONCURRENCY = 10;

type Row = {
  href: string;
  resolved: string | null;
  skipped: boolean;
  skipReason?: string;
  status: number | null;
  ok: boolean | null;
  error?: string;
};

function extractHrefs(html: string): string[] {
  const out: string[] = [];
  const re = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const raw = (m[1] ?? m[2] ?? m[3] ?? "").trim();
    if (raw) out.push(raw);
  }
  return out;
}

async function probeLink(urlStr: string): Promise<{
  status: number;
  ok: boolean;
  error?: string;
}> {
  try {
    let res = await fetchWithPublicRedirects(urlStr, { method: "HEAD" });
    if (res.status === 405 || res.status === 501) {
      res = await fetchWithPublicRedirects(urlStr, {
        method: "GET",
        headers: { Range: "bytes=0-0" },
      });
    }
    try {
      await res.arrayBuffer();
    } catch {
      /* ignore body read errors */
    }
    return { status: res.status, ok: res.ok };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Request failed";
    return { status: 0, ok: false, error: msg };
  }
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

  let pageUrl: URL;
  try {
    pageUrl = new URL(urlRaw.includes("://") ? urlRaw : `https://${urlRaw}`);
  } catch {
    return NextResponse.json({ error: "That URL is not valid." }, { status: 400 });
  }

  try {
    await assertPublicHttpUrl(pageUrl);
  } catch (e) {
    const msg = e instanceof PublicUrlError ? e.message : "URL not allowed.";
    return NextResponse.json({ error: msg }, { status: 403 });
  }

  let pageRes: Response;
  try {
    pageRes = await fetchWithPublicRedirects(pageUrl.toString(), {
      method: "GET",
      headers: { Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to fetch page.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  if (!pageRes.ok) {
    return NextResponse.json(
      {
        error: `Could not load page (HTTP ${pageRes.status}).`,
        pageStatus: pageRes.status,
      },
      { status: 502 },
    );
  }

  const buf = await pageRes.arrayBuffer();
  const slice =
    buf.byteLength > MAX_HTML_BYTES ? buf.slice(0, MAX_HTML_BYTES) : buf;
  const html = new TextDecoder("utf-8", { fatal: false }).decode(slice);
  const finalPageUrl = new URL(pageRes.url);

  const hrefs = extractHrefs(html);
  const seenHttp = new Set<string>();
  const willFetch = new Set<string>();
  const fetchOrder: string[] = [];

  const rows: Row[] = [];

  for (const href of hrefs) {
    const trimmed = href.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      rows.push({
        href: trimmed || href,
        resolved: null,
        skipped: true,
        skipReason: "Empty or in-page anchor",
        status: null,
        ok: null,
      });
      continue;
    }

    const lowerProto = trimmed.toLowerCase();
    if (
      lowerProto.startsWith("javascript:") ||
      lowerProto.startsWith("mailto:") ||
      lowerProto.startsWith("tel:") ||
      lowerProto.startsWith("sms:") ||
      lowerProto.startsWith("data:")
    ) {
      rows.push({
        href: trimmed,
        resolved: null,
        skipped: true,
        skipReason: "Non-HTTP link",
        status: null,
        ok: null,
      });
      continue;
    }

    let resolvedAbs: string;
    try {
      resolvedAbs = new URL(trimmed, finalPageUrl).href;
    } catch {
      rows.push({
        href: trimmed,
        resolved: null,
        skipped: true,
        skipReason: "Could not resolve URL",
        status: null,
        ok: null,
      });
      continue;
    }

    let resolvedUrl: URL;
    try {
      resolvedUrl = new URL(resolvedAbs);
    } catch {
      rows.push({
        href: trimmed,
        resolved: resolvedAbs,
        skipped: true,
        skipReason: "Invalid absolute URL",
        status: null,
        ok: null,
      });
      continue;
    }

    if (resolvedUrl.protocol !== "http:" && resolvedUrl.protocol !== "https:") {
      rows.push({
        href: trimmed,
        resolved: resolvedAbs,
        skipped: true,
        skipReason: "Not HTTP(S)",
        status: null,
        ok: null,
      });
      continue;
    }

    if (seenHttp.has(resolvedAbs)) {
      const queued = willFetch.has(resolvedAbs);
      rows.push({
        href: trimmed,
        resolved: resolvedAbs,
        skipped: !queued,
        skipReason: !queued ? "Check limit reached for this page" : undefined,
        status: null,
        ok: null,
      });
      continue;
    }

    seenHttp.add(resolvedAbs);
    if (fetchOrder.length < MAX_LINK_CHECKS) {
      willFetch.add(resolvedAbs);
      fetchOrder.push(resolvedAbs);
      rows.push({
        href: trimmed,
        resolved: resolvedAbs,
        skipped: false,
        status: null,
        ok: null,
      });
    } else {
      rows.push({
        href: trimmed,
        resolved: resolvedAbs,
        skipped: true,
        skipReason: "Check limit reached for this page",
        status: null,
        ok: null,
      });
    }
  }

  const results = new Map<
    string,
    { status: number; ok: boolean; error?: string }
  >();

  for (let i = 0; i < fetchOrder.length; i += CONCURRENCY) {
    const batch = fetchOrder.slice(i, i + CONCURRENCY);
    const settled = await Promise.all(batch.map((u) => probeLink(u)));
    batch.forEach((u, j) => results.set(u, settled[j]!));
  }

  let httpRows = 0;
  const brokenUrls = new Set<string>();
  for (const row of rows) {
    if (row.skipped || !row.resolved) continue;
    const r = results.get(row.resolved);
    if (r) {
      row.status = r.status;
      row.ok = r.ok;
      row.error = r.error;
      httpRows++;
      if (!r.ok) brokenUrls.add(row.resolved);
    }
  }
  const brokenCount = brokenUrls.size;

  const truncatedChecks = seenHttp.size > MAX_LINK_CHECKS;

  return NextResponse.json({
    pageUrl: finalPageUrl.href,
    pageFetchedOk: true,
    linksExtracted: hrefs.length,
    uniqueChecked: fetchOrder.length,
    truncatedChecks,
    httpRows,
    brokenCount,
    rows,
  });
}
