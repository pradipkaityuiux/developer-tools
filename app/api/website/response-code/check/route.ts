import { NextResponse } from "next/server";
import {
  PublicUrlError,
  assertPublicHttpUrl,
  tracePublicRedirectChain,
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

  let startUrl: URL;
  try {
    startUrl = new URL(urlRaw.includes("://") ? urlRaw : `https://${urlRaw}`);
  } catch {
    return NextResponse.json(
      { error: "That URL is not valid." },
      { status: 400 },
    );
  }

  try {
    await assertPublicHttpUrl(startUrl);
  } catch (e) {
    const msg = e instanceof PublicUrlError ? e.message : "URL not allowed.";
    return NextResponse.json({ error: msg }, { status: 403 });
  }

  try {
    const { hops, error } = await tracePublicRedirectChain(
      startUrl.toString(),
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          "user-agent":
            "Mozilla/5.0 (compatible; DevTool-ResponseCodeChecker/1.0)",
        },
      },
    );

    const last = hops[hops.length - 1];
    const finalUrl = last?.url ?? startUrl.toString();
    const finalStatus = last?.status ?? 0;
    const finalStatusText = last?.statusText ?? "";
    const redirectCount = hops.filter((h) =>
      [301, 302, 303, 307, 308].includes(h.status),
    ).length;

    return NextResponse.json({
      inputUrl: startUrl.toString(),
      hops,
      hopCount: hops.length,
      redirectCount,
      finalUrl,
      finalStatus,
      finalStatusText,
      chainError: error ?? null,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Check failed.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
