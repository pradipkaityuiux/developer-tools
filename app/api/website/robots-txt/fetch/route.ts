import { NextResponse } from "next/server";
import {
  PublicUrlError,
  assertPublicHttpUrl,
  fetchWithPublicRedirects,
} from "@/lib/safe-public-url";
import {
  parseRobotsTxt,
  robotsTxtHints,
} from "@/lib/robots-txt-parse";

export const runtime = "nodejs";

const MAX_BYTES = 512 * 1024;
const MAX_RESPONSE_CHARS = 200_000;

function robotsTargetUrl(input: URL): URL {
  const path = input.pathname;
  if (path.toLowerCase().endsWith("/robots.txt")) {
    return new URL(path + input.search, input.origin);
  }
  return new URL("/robots.txt", input.origin);
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
    return NextResponse.json(
      { error: "That URL is not valid." },
      { status: 400 },
    );
  }

  try {
    await assertPublicHttpUrl(pageUrl);
  } catch (e) {
    const msg = e instanceof PublicUrlError ? e.message : "URL not allowed.";
    return NextResponse.json({ error: msg }, { status: 403 });
  }

  const robotsUrl = robotsTargetUrl(pageUrl);
  try {
    await assertPublicHttpUrl(robotsUrl);
  } catch (e) {
    const msg = e instanceof PublicUrlError ? e.message : "URL not allowed.";
    return NextResponse.json({ error: msg }, { status: 403 });
  }

  const ua = "Mozilla/5.0 (compatible; DevTool-RobotsTxtChecker/1.0)";

  let res: Response;
  try {
    res = await fetchWithPublicRedirects(robotsUrl.toString(), {
      method: "GET",
      headers: {
        "user-agent": ua,
        Accept: "text/plain,*/*;q=0.9",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to fetch robots.txt.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const finalUrl = new URL(res.url);
  const contentType = res.headers.get("content-type");
  const status = res.status;
  const statusText = res.statusText;

  let buf: ArrayBuffer;
  try {
    buf = await res.arrayBuffer();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to read response body.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const truncatedBytes = buf.byteLength > MAX_BYTES;
  const slice = truncatedBytes ? buf.slice(0, MAX_BYTES) : buf;
  let rawText = new TextDecoder("utf-8", { fatal: false }).decode(slice);

  const truncatedChars = rawText.length > MAX_RESPONSE_CHARS;
  if (truncatedChars) {
    rawText = rawText.slice(0, MAX_RESPONSE_CHARS);
  }

  const parsed = parseRobotsTxt(rawText);
  const hints = robotsTxtHints(parsed, status, contentType);

  return NextResponse.json({
    inputUrl: pageUrl.href,
    robotsUrlRequested: robotsUrl.href,
    finalUrl: finalUrl.href,
    status,
    statusText,
    contentType,
    byteLength: buf.byteLength,
    bodyTruncated: truncatedBytes || truncatedChars,
    rawText,
    parsed,
    hints,
  });
}
