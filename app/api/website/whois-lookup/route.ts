import { NextResponse } from "next/server";
import {
  lookupDomainRdap,
  summarizeRdap,
} from "@/lib/rdap-domain-lookup";
import { parseDomainQuery, withoutWww } from "@/lib/whois-domain-parse";

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

  const parsed = parseDomainQuery(domainRaw);
  if (!parsed) {
    return NextResponse.json(
      {
        error:
          "Enter a valid domain name (e.g. example.com) or a URL whose hostname we can read.",
      },
      { status: 400 },
    );
  }

  const attempts = [parsed];
  const alt = withoutWww(parsed);
  if (alt && alt !== parsed) attempts.push(alt);

  let lastError = "Lookup failed.";
  for (const host of attempts) {
    try {
      const rdap = await lookupDomainRdap(host);
      const summary = summarizeRdap(rdap);
      return NextResponse.json({
        queried: host,
        attempted: attempts,
        source: "rdap" as const,
        summary,
      });
    } catch (e) {
      lastError = e instanceof Error ? e.message : "Lookup failed.";
    }
  }

  return NextResponse.json({ error: lastError }, { status: 502 });
}
