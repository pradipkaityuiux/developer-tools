import net from "node:net";
import { isBlockedIpLiteral } from "@/lib/safe-public-url";

export class DnsHostnameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DnsHostnameError";
  }
}

const BLOCKED_SUFFIXES = [
  ".localhost",
  ".internal",
  ".svc.cluster.local",
  ".metadata.google.internal",
] as const;

const BLOCKED_EXACT = new Set([
  "localhost",
  "metadata.google.internal",
  "metadata.goog",
  "169.254.169.254",
]);

/**
 * Turn user input (URL, host/path, or plain hostname) into a hostname string.
 */
export function parseHostnameInput(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new DnsHostnameError("Enter a domain or hostname.");
  }

  let candidate = trimmed;

  if (/^[a-z][a-z0-9+.-]*:/i.test(candidate)) {
    try {
      candidate = new URL(candidate).hostname;
    } catch {
      throw new DnsHostnameError(
        "Could not parse that URL — paste a hostname like example.com or a full https:// URL.",
      );
    }
  } else {
    const noPath = candidate.split("/")[0]?.split("?")[0]?.split("#")[0];
    candidate = (noPath ?? candidate).trim();
  }

  candidate = candidate.replace(/\.$/, "");
  if (!candidate) {
    throw new DnsHostnameError("Enter a domain or hostname.");
  }
  if (candidate.length > 253) {
    throw new DnsHostnameError("That hostname is too long.");
  }

  return candidate;
}

export function assertSafeDnsHostname(hostname: string): void {
  const h = hostname.toLowerCase();

  if (BLOCKED_EXACT.has(h)) {
    throw new DnsHostnameError("That hostname is not allowed.");
  }
  for (const suf of BLOCKED_SUFFIXES) {
    if (h === suf.slice(1) || h.endsWith(suf)) {
      throw new DnsHostnameError("That hostname is not allowed.");
    }
  }

  if (net.isIP(h)) {
    if (isBlockedIpLiteral(h)) {
      throw new DnsHostnameError(
        "Private, local, and reserved IP addresses are not allowed.",
      );
    }
    return;
  }

  if (h.includes("..")) {
    throw new DnsHostnameError("Invalid hostname.");
  }
}

/**
 * Normalize to the hostname string Node DNS APIs expect (punycode for IDN).
 */
export function toResolvableHostname(hostname: string): string {
  const h = hostname.trim().replace(/\.$/, "");
  if (net.isIP(h)) return h;
  try {
    return new URL(`https://${h}`).hostname;
  } catch {
    throw new DnsHostnameError("Invalid hostname.");
  }
}
