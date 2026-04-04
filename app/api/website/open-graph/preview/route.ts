import { NextResponse } from "next/server";
import {
  PublicUrlError,
  assertPublicHttpUrl,
  fetchWithPublicRedirects,
} from "@/lib/safe-public-url";

export const runtime = "nodejs";

const MAX_HTML_BYTES = 600_000;

const UA = "Mozilla/5.0 (compatible; DevTool-OpenGraphPreview/1.0)";

export type OpenGraphPreviewPayload = {
  urlRequested: string;
  finalUrl: string;
  pageStatus: number;
  openGraph: {
    title: string | null;
    description: string | null;
    image: string | null;
    url: string | null;
    type: string | null;
    siteName: string | null;
  };
  twitter: {
    card: string | null;
    title: string | null;
    description: string | null;
    image: string | null;
  };
  fallback: {
    documentTitle: string | null;
    metaDescription: string | null;
  };
  /** Effective values after OG → Twitter → HTML fallbacks */
  preview: {
    title: string | null;
    description: string | null;
    image: string | null;
    canonicalHint: string | null;
  };
};

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function extractDocumentTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return null;
  const t = stripTags(m[1]);
  return t ? t.slice(0, 600) : null;
}

function extractMetaMap(html: string): Map<string, string> {
  const map = new Map<string, string>();
  const re = /<meta\b[^>]*>/gi;
  let m: RegExpExecArray | null;
  const getAttr = (tag: string, name: string): string => {
    const r = new RegExp(
      `\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
      "i",
    );
    const mm = tag.match(r);
    return (mm?.[1] ?? mm?.[2] ?? mm?.[3] ?? "").trim();
  };

  while ((m = re.exec(html)) !== null) {
    const tag = m[0];
    const property = getAttr(tag, "property");
    const name = getAttr(tag, "name");
    const content = getAttr(tag, "content");
    if (!content) continue;
    const key = (property || name).toLowerCase();
    if (key) map.set(key, content);
  }
  return map;
}

function firstNonEmpty(...vals: (string | null | undefined)[]): string | null {
  for (const v of vals) {
    const t = v?.trim();
    if (t) return t;
  }
  return null;
}

function toAbsolute(urlOrPath: string, base: URL): string | null {
  const raw = urlOrPath.trim();
  if (!raw) return null;
  try {
    return new URL(raw, base).href;
  } catch {
    return null;
  }
}

function buildPayload(
  urlRequested: string,
  finalUrl: URL,
  pageStatus: number,
  html: string,
): OpenGraphPreviewPayload {
  const meta = extractMetaMap(html);
  const get = (k: string) => meta.get(k) ?? null;

  const ogImage = firstNonEmpty(
    get("og:image"),
    get("og:image:url"),
    get("og:image:secure_url"),
  );
  const twImage = firstNonEmpty(get("twitter:image"), get("twitter:image:src"));

  const ogTitle = get("og:title");
  const ogDesc = get("og:description");
  const ogUrl = get("og:url");
  const twTitle = get("twitter:title");
  const twDesc = get("twitter:description");

  const documentTitle = extractDocumentTitle(html);
  const metaDescription = get("description");

  const title = firstNonEmpty(ogTitle, twTitle, documentTitle);
  const description = firstNonEmpty(ogDesc, twDesc, metaDescription);

  const imageRaw = firstNonEmpty(ogImage, twImage);
  const image = imageRaw ? toAbsolute(imageRaw, finalUrl) : null;

  const canonicalHint = firstNonEmpty(ogUrl, finalUrl.href);

  return {
    urlRequested,
    finalUrl: finalUrl.href,
    pageStatus,
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      image: ogImage ? toAbsolute(ogImage, finalUrl) : null,
      url: ogUrl,
      type: get("og:type"),
      siteName: get("og:site_name"),
    },
    twitter: {
      card: get("twitter:card"),
      title: twTitle,
      description: twDesc,
      image: twImage ? toAbsolute(twImage, finalUrl) : null,
    },
    fallback: {
      documentTitle,
      metaDescription,
    },
    preview: {
      title,
      description,
      image,
      canonicalHint,
    },
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
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to fetch URL.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const finalUrl = new URL(res.url);
  const status = res.status;

  if (!res.ok) {
    return NextResponse.json(
      {
        error: `Could not load page (HTTP ${status}).`,
        pageStatus: status,
        finalUrl: finalUrl.href,
      },
      { status: 502 },
    );
  }

  const ctype = res.headers.get("content-type")?.toLowerCase() ?? "";
  if (!ctype.includes("text/html") && !ctype.includes("application/xhtml")) {
    return NextResponse.json(
      {
        error:
          "The final URL does not look like HTML (check content-type). Open Graph tags live in HTML documents.",
        pageStatus: status,
        finalUrl: finalUrl.href,
      },
      { status: 415 },
    );
  }

  let buf: ArrayBuffer;
  try {
    buf = await res.arrayBuffer();
  } catch {
    return NextResponse.json(
      { error: "Could not read response body." },
      { status: 502 },
    );
  }

  const slice =
    buf.byteLength > MAX_HTML_BYTES ? buf.slice(0, MAX_HTML_BYTES) : buf;
  const html = new TextDecoder("utf-8", { fatal: false }).decode(slice);

  const payload = buildPayload(target.href, finalUrl, status, html);
  return NextResponse.json(payload);
}
