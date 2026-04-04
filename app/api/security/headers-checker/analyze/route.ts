import { NextResponse } from "next/server";
import { collectHeadersFromResponse } from "@/lib/collect-http-response-headers";
import { analyzeSecurityHeaders } from "@/lib/security-headers-checker-core";
import {
  PublicUrlError,
  assertPublicHttpUrl,
  fetchWithPublicRedirects,
} from "@/lib/safe-public-url";

export const runtime = "nodejs";

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

  const ua = "Mozilla/5.0 (compatible; DevTool-SecurityHeadersChecker/1.0)";

  let res: Response;
  let probeMethod: "HEAD" | "GET" = "HEAD";
  try {
    res = await fetchWithPublicRedirects(target.toString(), {
      method: "HEAD",
      headers: { "user-agent": ua },
    });
    if (res.status === 405 || res.status === 501) {
      probeMethod = "GET";
      res = await fetchWithPublicRedirects(target.toString(), {
        method: "GET",
        headers: {
          "user-agent": ua,
          Range: "bytes=0-0",
          Accept: "*/*",
        },
      });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to fetch URL.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  try {
    await res.arrayBuffer();
  } catch {
    /* ignore body read errors */
  }

  const finalUrl = new URL(res.url);
  const headers = collectHeadersFromResponse(res);
  const analysis = analyzeSecurityHeaders({
    headers,
    finalUrl: finalUrl.href,
    status: res.status,
  });

  return NextResponse.json({
    urlRequested: target.href,
    finalUrl: finalUrl.href,
    status: res.status,
    statusText: res.statusText,
    redirectHopsResolved: true,
    probeMethod,
    headerCount: headers.length,
    headers,
    analysis,
  });
}
