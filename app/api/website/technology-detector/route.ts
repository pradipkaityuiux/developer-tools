import { NextResponse } from "next/server";
import {
  PublicUrlError,
  assertPublicHttpUrl,
  fetchWithPublicRedirects,
} from "@/lib/safe-public-url";
import { detectWebsiteTechnologies } from "@/lib/detect-website-technologies";

export const runtime = "nodejs";

const MAX_HTML_BYTES = 2_000_000;
const UA = "Mozilla/5.0 (compatible; DevTool-TechnologyDetector/1.0)";

function collectHeaderRows(res: Response): { name: string; value: string }[] {
  const rows: { name: string; value: string }[] = [];
  const headers = res.headers;
  const getSetCookie = (
    headers as unknown as { getSetCookie?: () => string[] }
  ).getSetCookie;

  headers.forEach((value, name) => {
    if (name.toLowerCase() === "set-cookie" && typeof getSetCookie === "function") {
      return;
    }
    rows.push({ name, value });
  });

  if (typeof getSetCookie === "function") {
    for (const cookie of getSetCookie.call(headers)) {
      rows.push({ name: "set-cookie", value: cookie });
    }
  }

  return rows;
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

  let res: Response;
  try {
    res = await fetchWithPublicRedirects(target.toString(), {
      method: "GET",
      headers: {
        "user-agent": UA,
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to fetch URL.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const finalUrl = new URL(res.url);
  const headerRows = collectHeaderRows(res);

  if (!res.ok) {
    return NextResponse.json(
      {
        error: `Could not load page (HTTP ${res.status}).`,
        urlRequested: target.href,
        finalUrl: finalUrl.href,
        pageStatus: res.status,
        pageStatusText: res.statusText,
        truncatedHtml: false,
        htmlBytesRead: 0,
        generatorMeta: null,
        serverHeader: null,
        hits: [] as ReturnType<typeof detectWebsiteTechnologies>["hits"],
      },
      { status: 502 },
    );
  }

  const buf = await res.arrayBuffer();
  const truncated = buf.byteLength > MAX_HTML_BYTES;
  const slice =
    buf.byteLength > MAX_HTML_BYTES ? buf.slice(0, MAX_HTML_BYTES) : buf;
  const html = new TextDecoder("utf-8", { fatal: false }).decode(slice);

  const detection = detectWebsiteTechnologies(html, headerRows, finalUrl.href);

  return NextResponse.json({
    urlRequested: target.href,
    finalUrl: finalUrl.href,
    pageStatus: res.status,
    pageStatusText: res.statusText,
    truncatedHtml: truncated,
    htmlBytesRead: buf.byteLength,
    generatorMeta: detection.generatorMeta,
    serverHeader: detection.serverHeader,
    hits: detection.hits,
  });
}
