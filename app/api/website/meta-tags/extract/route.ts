import { NextResponse } from "next/server";
import { extractMetaFromHtml } from "@/lib/extract-meta-from-html";
import {
  PublicUrlError,
  assertPublicHttpUrl,
  fetchWithPublicRedirects,
} from "@/lib/safe-public-url";

export const runtime = "nodejs";

const MAX_HTML_BYTES = 512 * 1024;
const UA = "Mozilla/5.0 (compatible; DevTool-MetaTagsExtractor/1.0)";

async function readResponseBodyCapped(
  res: Response,
  maxBytes: number,
): Promise<{ text: string; truncated: boolean }> {
  if (!res.body) {
    const ab = await res.arrayBuffer();
    const truncated = ab.byteLength > maxBytes;
    const slice = truncated ? ab.slice(0, maxBytes) : ab;
    return {
      text: new TextDecoder("utf-8", { fatal: false }).decode(slice),
      truncated,
    };
  }

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  let truncated = false;

  try {
    while (true) {
      if (total >= maxBytes) {
        truncated = true;
        await reader.cancel().catch(() => {});
        break;
      }
      const { done, value } = await reader.read();
      if (done) break;
      if (!value?.length) continue;
      const remaining = maxBytes - total;
      if (value.length <= remaining) {
        chunks.push(value);
        total += value.length;
      } else {
        chunks.push(value.slice(0, remaining));
        total = maxBytes;
        truncated = true;
        await reader.cancel().catch(() => {});
        break;
      }
    }
  } catch {
    truncated = truncated || total >= maxBytes;
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.length;
  }

  return {
    text: new TextDecoder("utf-8", { fatal: false }).decode(merged),
    truncated,
  };
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
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to fetch URL.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const finalUrl = new URL(res.url);
  const { text, truncated } = await readResponseBodyCapped(res, MAX_HTML_BYTES);

  const contentType = (res.headers.get("content-type") || "").toLowerCase();
  const looksHtml =
    contentType.includes("text/html") ||
    contentType.includes("application/xhtml") ||
    (!contentType && /<\s*html[\s>]/i.test(text.slice(0, 2000)));

  if (!looksHtml) {
    return NextResponse.json(
      {
        error:
          "The response does not look like HTML (check Content-Type). Meta tags live in HTML documents.",
        urlRequested: target.href,
        finalUrl: finalUrl.href,
        status: res.status,
        statusText: res.statusText,
      },
      { status: 415 },
    );
  }

  const parsed = extractMetaFromHtml(text);
  const metaTagCount =
    Object.keys(parsed.openGraph).length +
    Object.keys(parsed.twitter).length +
    parsed.otherMeta.length +
    (parsed.description ? 1 : 0) +
    (parsed.keywords ? 1 : 0) +
    (parsed.robots ? 1 : 0) +
    (parsed.viewport ? 1 : 0);

  return NextResponse.json({
    urlRequested: target.href,
    finalUrl: finalUrl.href,
    status: res.status,
    statusText: res.statusText,
    contentType: res.headers.get("content-type"),
    truncated,
    ...parsed,
    metaTagCount,
  });
}
