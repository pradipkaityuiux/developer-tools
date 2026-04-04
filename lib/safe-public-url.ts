import dns from "node:dns/promises";
import net from "node:net";

const MAX_REDIRECTS = 8;
const FETCH_TIMEOUT_MS = 14_000;

export class PublicUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PublicUrlError";
  }
}

function isPrivateIpv4(parts: number[]): boolean {
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  return false;
}

export function isBlockedIpLiteral(ip: string): boolean {
  const v = net.isIP(ip);
  if (v === 4) {
    const parts = ip.split(".").map((x) => Number(x));
    if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
    return isPrivateIpv4(parts);
  }
  if (v === 6) {
    const lowered = ip.toLowerCase();
    if (lowered === "::1") return true;
    if (lowered.startsWith("fe80:")) return true;
    if (lowered.startsWith("fc") || lowered.startsWith("fd")) return true;
    if (lowered.startsWith("::ffff:")) {
      const v4 = lowered.slice(7);
      if (net.isIPv4(v4)) return isBlockedIpLiteral(v4);
    }
    return false;
  }
  return true;
}

export async function assertPublicHttpUrl(url: URL): Promise<void> {
  if (url.username || url.password) {
    throw new PublicUrlError("URLs with credentials are not allowed.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new PublicUrlError("Only http and https URLs are allowed.");
  }
  const host = url.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".internal")
  ) {
    throw new PublicUrlError("That hostname is not allowed.");
  }
  if (net.isIP(host)) {
    if (isBlockedIpLiteral(host)) {
      throw new PublicUrlError("Private or local addresses are not allowed.");
    }
    return;
  }
  let address: string;
  try {
    const lookup = await dns.lookup(host, { family: 0, verbatim: true });
    address = lookup.address;
  } catch {
    throw new PublicUrlError("Could not resolve hostname.");
  }
  if (isBlockedIpLiteral(address)) {
    throw new PublicUrlError("Hostname resolves to a non-public address.");
  }
}

/** DNS-based SSRF guard for bare hostnames (e.g. RDAP / WHOIS style lookups). */
export async function assertPublicHostname(host: string): Promise<void> {
  const hostname = host.toLowerCase().replace(/\.$/, "");
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".internal")
  ) {
    throw new PublicUrlError("That hostname is not allowed.");
  }
  if (net.isIP(hostname)) {
    if (isBlockedIpLiteral(hostname)) {
      throw new PublicUrlError("Private or local addresses are not allowed.");
    }
    return;
  }
  let address: string;
  try {
    const lookup = await dns.lookup(hostname, { family: 0, verbatim: true });
    address = lookup.address;
  } catch {
    throw new PublicUrlError("Could not resolve hostname.");
  }
  if (isBlockedIpLiteral(address)) {
    throw new PublicUrlError("Hostname resolves to a non-public address.");
  }
}

export async function fetchWithPublicRedirects(
  input: string,
  init: RequestInit & { method?: string } = {},
): Promise<Response> {
  let url = new URL(input);
  await assertPublicHttpUrl(url);

  const headers = new Headers(init.headers);
  if (!headers.has("user-agent")) {
    headers.set(
      "user-agent",
      "Mozilla/5.0 (compatible; DevTool-BrokenLinkChecker/1.0)",
    );
  }

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await fetch(url.toString(), {
      ...init,
      headers,
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if ([301, 302, 303, 307, 308].includes(res.status)) {
      const loc = res.headers.get("location");
      if (!loc) {
        return res;
      }
      const next = new URL(loc, url);
      await assertPublicHttpUrl(next);
      url = next;
      continue;
    }
    return res;
  }

  throw new PublicUrlError("Too many redirects.");
}

export type RedirectChainHop = {
  url: string;
  status: number;
  location: string | null;
  /** Phrase from the final response line when available (often empty over HTTP/2). */
  statusText: string;
  /** Milliseconds until response headers were received for this hop (excludes body read). */
  durationMs: number;
};

export type RedirectChainTraceResult = {
  hops: RedirectChainHop[];
  error?: string;
};

/**
 * Follows redirects manually and records each HTTP response (URL, status, Location).
 * Stops at the first non-redirect status or when limits / safety checks fail.
 */
export async function tracePublicRedirectChain(
  input: string,
  init: RequestInit & { method?: string } = {},
): Promise<RedirectChainTraceResult> {
  let url = new URL(input);
  await assertPublicHttpUrl(url);

  const headers = new Headers(init.headers);
  if (!headers.has("user-agent")) {
    headers.set(
      "user-agent",
      "Mozilla/5.0 (compatible; DevTool-RedirectChainChecker/1.0)",
    );
  }

  const hops: RedirectChainHop[] = [];
  const seen = new Set<string>();

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const urlStr = url.toString();
    if (seen.has(urlStr)) {
      return { hops, error: "Redirect loop detected (repeated URL)." };
    }
    seen.add(urlStr);

    const t0 = Date.now();
    const res = await fetch(urlStr, {
      ...init,
      method: init.method ?? "GET",
      headers,
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    const durationMs = Date.now() - t0;

    const location = res.headers.get("location");
    hops.push({
      url: urlStr,
      status: res.status,
      location,
      statusText: res.statusText ?? "",
      durationMs,
    });

    if ([301, 302, 303, 307, 308].includes(res.status)) {
      if (!location) {
        try {
          await res.arrayBuffer();
        } catch {
          /* ignore */
        }
        return {
          hops,
          error: "Redirect response without a Location header.",
        };
      }
      let next: URL;
      try {
        next = new URL(location, url);
      } catch {
        try {
          await res.arrayBuffer();
        } catch {
          /* ignore */
        }
        return { hops, error: "Invalid Location URL." };
      }
      try {
        await assertPublicHttpUrl(next);
      } catch (e) {
        try {
          await res.arrayBuffer();
        } catch {
          /* ignore */
        }
        const msg =
          e instanceof PublicUrlError ? e.message : "URL not allowed.";
        return { hops, error: msg };
      }
      try {
        await res.arrayBuffer();
      } catch {
        /* ignore */
      }
      url = next;
      continue;
    }

    try {
      await res.arrayBuffer();
    } catch {
      /* ignore */
    }
    return { hops };
  }

  return { hops, error: "Too many redirects." };
}
