import { NextResponse } from "next/server";
import dns from "node:dns/promises";
import net from "node:net";
import { isBlockedIpLiteral } from "@/lib/safe-public-url";

export const runtime = "nodejs";

const LOOKUP_TIMEOUT_MS = 12_000;

/** Free ip-api.com JSON endpoint is HTTP-only; usable from the server (no browser CORS). */
const IP_API_FIELDS =
  "status,message,continent,continentCode,country,countryCode,region,regionName,city,zip,lat,lon,timezone,offset,isp,org,as,reverse,mobile,proxy,hosting,query,inEU";

function normalizeIpInput(raw: string): string {
  let s = raw.trim();
  if (s.startsWith("[") && s.includes("]")) {
    const end = s.indexOf("]");
    s = s.slice(1, end).trim();
  }
  return s;
}

type IpApiJson = {
  status: "success" | "fail";
  message?: string;
  continent?: string;
  continentCode?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  regionName?: string;
  city?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  offset?: number;
  isp?: string;
  org?: string;
  as?: string;
  reverse?: string;
  mobile?: boolean;
  proxy?: boolean;
  hosting?: boolean;
  query?: string;
  inEU?: boolean;
};

function parseAsnFromAs(as: string | undefined): number | null {
  if (!as || typeof as !== "string") return null;
  const m = /^AS(\d+)/i.exec(as.trim());
  return m ? Number(m[1]) : null;
}

function formatUtcOffset(offsetSeconds: number | undefined): string | null {
  if (offsetSeconds == null || !Number.isFinite(offsetSeconds)) return null;
  const sign = offsetSeconds >= 0 ? "+" : "-";
  const abs = Math.abs(offsetSeconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  if (m === 0) return `UTC${sign}${h}`;
  return `UTC${sign}${h}:${String(m).padStart(2, "0")}`;
}

async function reverseHostnames(ip: string): Promise<string[]> {
  try {
    return await dns.reverse(ip);
  } catch {
    return [];
  }
}

function mergeReverseDns(
  fromDns: string[],
  ipApiReverse: string | undefined,
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const h of fromDns) {
    const t = h.trim().toLowerCase();
    if (t && !seen.has(t)) {
      seen.add(t);
      out.push(h);
    }
  }
  if (ipApiReverse?.trim()) {
    const t = ipApiReverse.trim().toLowerCase();
    if (!seen.has(t)) out.push(ipApiReverse.trim());
  }
  return out;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const ipRaw =
    typeof body === "object" &&
    body !== null &&
    "ip" in body &&
    typeof (body as { ip: unknown }).ip === "string"
      ? (body as { ip: string }).ip
      : "";

  const ip = normalizeIpInput(ipRaw);
  if (!ip) {
    return NextResponse.json(
      { error: "Provide a non-empty \"ip\" string (IPv4 or IPv6)." },
      { status: 400 },
    );
  }

  if (net.isIP(ip) === 0) {
    return NextResponse.json(
      { error: "That does not look like a valid IPv4 or IPv6 address." },
      { status: 400 },
    );
  }

  if (isBlockedIpLiteral(ip)) {
    return NextResponse.json(
      {
        error:
          "Private, loopback, and link-local addresses cannot be looked up for public geolocation. Use a publicly routable IP.",
      },
      { status: 400 },
    );
  }

  const target = `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=${IP_API_FIELDS}`;

  let geoRes: Response;
  try {
    geoRes = await fetch(target, {
      signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
      headers: {
        Accept: "application/json",
        "User-Agent": "DevTool-IpLookup/1.0 (https://github.com/contact)",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the geolocation service. Try again shortly." },
      { status: 502 },
    );
  }

  let geoJson: IpApiJson;
  try {
    geoJson = (await geoRes.json()) as IpApiJson;
  } catch {
    return NextResponse.json(
      { error: "Unexpected response from geolocation service." },
      { status: 502 },
    );
  }

  if (geoJson.status !== "success") {
    return NextResponse.json(
      {
        error:
          geoJson.message?.trim() ||
          "That address could not be resolved in the geolocation database.",
      },
      { status: 422 },
    );
  }

  const fromDns = await reverseHostnames(ip);
  const hostnames = mergeReverseDns(fromDns, geoJson.reverse);

  const ipType = net.isIP(ip) === 6 ? "IPv6" : "IPv4";

  return NextResponse.json({
    ip,
    ipType,
    continent: geoJson.continent ?? null,
    continentCode: geoJson.continentCode ?? null,
    country: geoJson.country ?? null,
    countryCode: geoJson.countryCode ?? null,
    region: geoJson.regionName ?? null,
    regionCode: geoJson.region ?? null,
    city: geoJson.city ?? null,
    postal: geoJson.zip ?? null,
    latitude: geoJson.lat ?? null,
    longitude: geoJson.lon ?? null,
    isEu: geoJson.inEU ?? null,
    asn: parseAsnFromAs(geoJson.as),
    org: geoJson.org ?? null,
    isp: geoJson.isp ?? null,
    networkDomain: null,
    timezoneId: geoJson.timezone ?? null,
    timezoneUtc: formatUtcOffset(geoJson.offset),
    timezoneCurrentTime: null,
    security: {
      anonymous: null,
      proxy: geoJson.proxy ?? null,
      vpn: null,
      tor: null,
      hosting: geoJson.hosting ?? null,
    },
    reverseDnsHostnames: hostnames,
  });
}
