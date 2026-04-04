import { NextResponse } from "next/server";
import { lookupDomainAge } from "@/lib/domain-age-rdap";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const domainRaw =
    typeof body === "object" &&
    body !== null &&
    "domain" in body &&
    typeof (body as { domain: unknown }).domain === "string"
      ? (body as { domain: string }).domain.trim()
      : "";

  if (!domainRaw) {
    return NextResponse.json(
      { error: "Provide a non-empty \"domain\" string." },
      { status: 400 },
    );
  }

  const result = await lookupDomainAge(domainRaw);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  return NextResponse.json(result);
}
