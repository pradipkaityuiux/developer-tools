import { NextResponse } from "next/server";
import {
  PublicUrlError,
  assertPublicHttpUrl,
  tracePublicRedirectChain,
} from "@/lib/safe-public-url";

export const runtime = "nodejs";

const MAX_BATCH = 8;
const MAX_URL_LEN = 2048;

type SingleBody = {
  inputUrl: string;
  hops: Awaited<ReturnType<typeof tracePublicRedirectChain>>["hops"];
  hopCount: number;
  redirectCount: number;
  finalUrl: string;
  finalStatus: number;
  error: string | null;
  totalDurationMs: number;
};

function summarizeTrace(
  startUrl: URL,
  trace: Awaited<ReturnType<typeof tracePublicRedirectChain>>,
): SingleBody {
  const { hops, error } = trace;
  const last = hops[hops.length - 1];
  const finalUrl = last?.url ?? startUrl.toString();
  const finalStatus = last?.status ?? 0;
  const redirectCount = hops.filter((h) =>
    [301, 302, 303, 307, 308].includes(h.status),
  ).length;
  const totalDurationMs = hops.reduce((acc, h) => acc + h.durationMs, 0);

  return {
    inputUrl: startUrl.toString(),
    hops,
    hopCount: hops.length,
    redirectCount,
    finalUrl,
    finalStatus,
    error: error ?? null,
    totalDurationMs,
  };
}

async function traceOne(
  urlRaw: string,
): Promise<SingleBody | { err: string }> {
  const trimmed = urlRaw.trim();
  if (!trimmed) {
    return { err: "Empty URL in list." };
  }
  if (trimmed.length > MAX_URL_LEN) {
    return { err: "URL exceeds maximum length." };
  }

  let startUrl: URL;
  try {
    startUrl = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
  } catch {
    return { err: "Invalid URL." };
  }

  try {
    await assertPublicHttpUrl(startUrl);
  } catch (e) {
    const msg = e instanceof PublicUrlError ? e.message : "URL not allowed.";
    return { err: msg };
  }

  try {
    const trace = await tracePublicRedirectChain(startUrl.toString(), {
      method: "GET",
    });
    return summarizeTrace(startUrl, trace);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Trace failed.";
    return { err: msg };
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Expected JSON object." }, { status: 400 });
  }

  const urlsField = (body as { urls?: unknown }).urls;
  if (urlsField !== undefined) {
    if (!Array.isArray(urlsField)) {
      return NextResponse.json(
        { error: "\"urls\" must be an array of strings." },
        { status: 400 },
      );
    }
    const urls = urlsField.filter((u): u is string => typeof u === "string");
    if (urls.length === 0) {
      return NextResponse.json(
        { error: "Provide at least one URL string in \"urls\"." },
        { status: 400 },
      );
    }
    if (urls.length > MAX_BATCH) {
      return NextResponse.json(
        { error: `At most ${MAX_BATCH} URLs per request.` },
        { status: 400 },
      );
    }

    const results: SingleBody[] = [];
    const errors: { index: number; message: string }[] = [];

    for (let i = 0; i < urls.length; i++) {
      const out = await traceOne(urls[i]!);
      if ("err" in out) {
        errors.push({ index: i, message: out.err });
        continue;
      }
      results.push(out);
    }

    return NextResponse.json({
      mode: "batch" as const,
      results,
      errors: errors.length ? errors : undefined,
    });
  }

  const urlRaw =
    "url" in body && typeof (body as { url: unknown }).url === "string"
      ? (body as { url: string }).url.trim()
      : "";

  if (!urlRaw) {
    return NextResponse.json(
      { error: "Provide a non-empty \"url\" string or a \"urls\" array." },
      { status: 400 },
    );
  }

  const out = await traceOne(urlRaw);
  if ("err" in out) {
    const msg = out.err;
    const isForbidden =
      msg.includes("not allowed") ||
      msg.includes("Private") ||
      msg.includes("Could not resolve") ||
      msg.includes("hostname");
    const isClient =
      msg.includes("Invalid URL") ||
      msg.includes("maximum length") ||
      msg.includes("Empty URL");
    return NextResponse.json(
      { error: msg },
      { status: isForbidden ? 403 : isClient ? 400 : 502 },
    );
  }

  return NextResponse.json({
    mode: "single" as const,
    ...out,
  });
}
