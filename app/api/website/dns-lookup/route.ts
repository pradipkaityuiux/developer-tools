import type { Resolver } from "node:dns/promises";
import { NextResponse } from "next/server";
import {
  DnsHostnameError,
  assertSafeDnsHostname,
  parseHostnameInput,
  toResolvableHostname,
} from "@/lib/safe-dns-hostname";
import { createPublicDnsResolver } from "@/lib/public-dns-resolver";

export const runtime = "nodejs";

const DNS_TIMEOUT_MS = 12_000;

const RECORD_TYPES = [
  "A",
  "AAAA",
  "MX",
  "CNAME",
  "TXT",
  "NS",
  "SOA",
  "ALL",
] as const;

type RecordType = (typeof RECORD_TYPES)[number];

function isRecordType(s: string): s is RecordType {
  return (RECORD_TYPES as readonly string[]).includes(s);
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      reject(new Error("DNS query timed out."));
    }, ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

function dnsErrorMessage(code: string, syscall: string): string {
  if (code === "ENOTFOUND" || code === "ENODATA") {
    return "No records found for that name and type.";
  }
  if (code === "ESERVFAIL") {
    return "DNS server failure — try again later.";
  }
  if (code === "ETIMEOUT") {
    return "DNS resolver timed out.";
  }
  if (code === "ECONNREFUSED") {
    return "DNS resolver refused the connection — your network may block outbound DNS, or the system resolver is unreachable. Try another network or set DNS_LOOKUP_SERVERS.";
  }
  if (code === "EDESTRUCTION") {
    return "DNS channel was closed while querying — try again; use a single record type if it keeps happening.";
  }
  return `${syscall} failed (${code}).`;
}

type OkResult = { ok: true; records: unknown };
type ErrResult = { ok: false; error: string };
type TypeResult = OkResult | ErrResult;

async function resolveA(resolver: Resolver, host: string): Promise<TypeResult> {
  try {
    const addresses = await withTimeout(resolver.resolve4(host), DNS_TIMEOUT_MS);
    return { ok: true, records: addresses };
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code && err.syscall) {
      return { ok: false, error: dnsErrorMessage(err.code, err.syscall) };
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Lookup failed.",
    };
  }
}

async function resolveAAAA(
  resolver: Resolver,
  host: string,
): Promise<TypeResult> {
  try {
    const addresses = await withTimeout(resolver.resolve6(host), DNS_TIMEOUT_MS);
    return { ok: true, records: addresses };
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code && err.syscall) {
      return { ok: false, error: dnsErrorMessage(err.code, err.syscall) };
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Lookup failed.",
    };
  }
}

async function resolveMX(resolver: Resolver, host: string): Promise<TypeResult> {
  try {
    const rows = await withTimeout(resolver.resolveMx(host), DNS_TIMEOUT_MS);
    const sorted = [...rows].sort((a, b) => a.priority - b.priority);
    return {
      ok: true,
      records: sorted.map((r) => ({
        priority: r.priority,
        exchange: r.exchange,
      })),
    };
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code && err.syscall) {
      return { ok: false, error: dnsErrorMessage(err.code, err.syscall) };
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Lookup failed.",
    };
  }
}

async function resolveCNAME(
  resolver: Resolver,
  host: string,
): Promise<TypeResult> {
  try {
    const records = await withTimeout(resolver.resolveCname(host), DNS_TIMEOUT_MS);
    return { ok: true, records };
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code && err.syscall) {
      return { ok: false, error: dnsErrorMessage(err.code, err.syscall) };
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Lookup failed.",
    };
  }
}

async function resolveTXT(
  resolver: Resolver,
  host: string,
): Promise<TypeResult> {
  try {
    const chunks = await withTimeout(resolver.resolveTxt(host), DNS_TIMEOUT_MS);
    return {
      ok: true,
      records: chunks.map((parts) => ({
        strings: parts,
        joined: parts.join(""),
      })),
    };
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code && err.syscall) {
      return { ok: false, error: dnsErrorMessage(err.code, err.syscall) };
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Lookup failed.",
    };
  }
}

async function resolveNS(resolver: Resolver, host: string): Promise<TypeResult> {
  try {
    const records = await withTimeout(resolver.resolveNs(host), DNS_TIMEOUT_MS);
    return { ok: true, records };
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code && err.syscall) {
      return { ok: false, error: dnsErrorMessage(err.code, err.syscall) };
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Lookup failed.",
    };
  }
}

async function resolveSOA(
  resolver: Resolver,
  host: string,
): Promise<TypeResult> {
  try {
    const soa = await withTimeout(resolver.resolveSoa(host), DNS_TIMEOUT_MS);
    return {
      ok: true,
      records: {
        nsname: soa.nsname,
        hostmaster: soa.hostmaster,
        serial: soa.serial,
        refresh: soa.refresh,
        retry: soa.retry,
        expire: soa.expire,
        minttl: soa.minttl,
      },
    };
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code && err.syscall) {
      return { ok: false, error: dnsErrorMessage(err.code, err.syscall) };
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Lookup failed.",
    };
  }
}

async function resolveOne(
  resolver: Resolver,
  host: string,
  recordType: Exclude<RecordType, "ALL">,
): Promise<TypeResult> {
  switch (recordType) {
    case "A":
      return resolveA(resolver, host);
    case "AAAA":
      return resolveAAAA(resolver, host);
    case "MX":
      return resolveMX(resolver, host);
    case "CNAME":
      return resolveCNAME(resolver, host);
    case "TXT":
      return resolveTXT(resolver, host);
    case "NS":
      return resolveNS(resolver, host);
    case "SOA":
      return resolveSOA(resolver, host);
    default:
      return { ok: false, error: "Unsupported record type." };
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const hostnameRaw =
    typeof body === "object" &&
    body !== null &&
    "hostname" in body &&
    typeof (body as { hostname: unknown }).hostname === "string"
      ? (body as { hostname: string }).hostname
      : "";

  const recordTypeRaw =
    typeof body === "object" &&
    body !== null &&
    "recordType" in body &&
    typeof (body as { recordType: unknown }).recordType === "string"
      ? (body as { recordType: string }).recordType.trim().toUpperCase()
      : "A";

  if (!hostnameRaw.trim()) {
    return NextResponse.json(
      { error: "Provide a non-empty \"hostname\" string." },
      { status: 400 },
    );
  }

  if (!isRecordType(recordTypeRaw)) {
    return NextResponse.json(
      {
        error:
          "Invalid recordType. Use A, AAAA, MX, CNAME, TXT, NS, SOA, or ALL.",
      },
      { status: 400 },
    );
  }

  let host: string;
  try {
    const parsed = parseHostnameInput(hostnameRaw);
    host = toResolvableHostname(parsed);
    assertSafeDnsHostname(host);
  } catch (e) {
    const msg =
      e instanceof DnsHostnameError
        ? e.message
        : "Invalid hostname.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const started = Date.now();
  const resolver = createPublicDnsResolver();

  if (recordTypeRaw === "ALL") {
    const types = [
      "A",
      "AAAA",
      "MX",
      "CNAME",
      "TXT",
      "NS",
      "SOA",
    ] as const;
    /* Sequential: parallel lookups share stress the c-ares channel → EDESTRUCTION / ECONNREFUSED on some hosts. */
    const byType = {} as Record<(typeof types)[number], TypeResult>;
    for (const t of types) {
      byType[t] = await resolveOne(resolver, host, t);
    }
    return NextResponse.json({
      hostname: host,
      recordType: "ALL",
      bundled: true,
      byType,
      tookMs: Date.now() - started,
    });
  }

  const result = await resolveOne(resolver, host, recordTypeRaw);
  return NextResponse.json({
    hostname: host,
    recordType: recordTypeRaw,
    bundled: false,
    ...result,
    tookMs: Date.now() - started,
  });
}
