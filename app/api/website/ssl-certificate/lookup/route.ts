import { NextResponse } from "next/server";
import {
  SslCertLookupError,
  lookupSslCertificates,
  parseTlsTarget,
} from "@/lib/ssl-cert-lookup";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const raw =
    typeof body === "object" &&
    body !== null &&
    "host" in body &&
    typeof (body as { host: unknown }).host === "string"
      ? (body as { host: string }).host.trim()
      : typeof body === "object" &&
          body !== null &&
          "url" in body &&
          typeof (body as { url: unknown }).url === "string"
        ? (body as { url: string }).url.trim()
        : "";

  if (!raw) {
    return NextResponse.json(
      { error: 'Provide a non-empty "host" or "url" string.' },
      { status: 400 },
    );
  }

  try {
    const { host, port } = parseTlsTarget(raw);
    const result = await lookupSslCertificates(host, port);
    return NextResponse.json(result);
  } catch (e) {
    const message =
      e instanceof SslCertLookupError
        ? e.message
        : e instanceof Error
          ? e.message
          : "Lookup failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
