import dns from "node:dns/promises";
import net from "node:net";
import tls from "node:tls";
import { isBlockedIpLiteral } from "@/lib/safe-public-url";

export class SslCertLookupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SslCertLookupError";
  }
}

const CONNECT_MS = 14_000;

export type ParsedTlsTarget = {
  host: string;
  port: number;
};

/** Accepts a domain, host:port, or http(s) URL; returns SNI host and TCP port for TLS. */
export function parseTlsTarget(input: string): ParsedTlsTarget {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new SslCertLookupError("Enter a domain or HTTPS URL.");
  }

  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    throw new SslCertLookupError("Could not parse that address.");
  }

  if (url.username || url.password) {
    throw new SslCertLookupError("URLs with credentials are not allowed.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new SslCertLookupError("Only http and https URLs are supported.");
  }

  const host = url.hostname.toLowerCase();
  if (!host) {
    throw new SslCertLookupError("Missing hostname.");
  }

  const port = url.port
    ? Number(url.port)
    : url.protocol === "https:"
      ? 443
      : 80;

  if (!Number.isFinite(port) || port < 1 || port > 65535) {
    throw new SslCertLookupError("Invalid port.");
  }

  if (url.protocol === "http:" && !url.port) {
    return { host, port: 443 };
  }

  return { host, port };
}

export async function assertPublicTlsHost(host: string): Promise<void> {
  const h = host.toLowerCase();
  if (
    h === "localhost" ||
    h.endsWith(".localhost") ||
    h.endsWith(".internal")
  ) {
    throw new SslCertLookupError("That hostname is not allowed.");
  }

  if (net.isIP(h)) {
    if (isBlockedIpLiteral(h)) {
      throw new SslCertLookupError("Private or local addresses are not allowed.");
    }
    return;
  }

  let address: string;
  try {
    const lookup = await dns.lookup(h, { family: 0, verbatim: true });
    address = lookup.address;
  } catch {
    throw new SslCertLookupError("Could not resolve hostname.");
  }

  if (isBlockedIpLiteral(address)) {
    throw new SslCertLookupError("Hostname resolves to a non-public address.");
  }
}

function formatDN(
  dn: tls.PeerCertificate["subject"] | tls.PeerCertificate["issuer"],
): string {
  if (!dn || typeof dn !== "object") return "";
  const parts: string[] = [];
  for (const [key, val] of Object.entries(dn)) {
    if (val == null) continue;
    if (Array.isArray(val)) {
      for (const v of val) parts.push(`${key}=${v}`);
    } else {
      parts.push(`${key}=${val}`);
    }
  }
  return parts.join(", ");
}

function parseSanList(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/,\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function flattenChain(
  leaf: tls.DetailedPeerCertificate | null | undefined,
): tls.PeerCertificate[] {
  const out: tls.PeerCertificate[] = [];
  let c: tls.DetailedPeerCertificate | undefined | null = leaf;
  const seen = new Set<string>();

  while (c && c.raw) {
    const cert = c;
    const id = cert.fingerprint256 ?? cert.fingerprint ?? "";
    if (id && seen.has(id)) break;
    if (id) seen.add(id);
    out.push(cert);
    const next = cert.issuerCertificate;
    if (!next || next === cert) break;
    c = next;
  }

  return out;
}

export type SerializedCert = {
  position: number;
  subject: string;
  issuer: string;
  commonName: string;
  subjectAltNames: string[];
  validFrom: string;
  validTo: string;
  validFromMs: number | null;
  validToMs: number | null;
  serialNumber: string;
  fingerprint256: string;
  fingerprintSha1: string;
  signatureAlgorithm: string | undefined;
  bits: number | undefined;
};

export type SslLookupResult = {
  host: string;
  port: number;
  tlsVersion: string | undefined;
  alpnProtocol: string | undefined;
  authorized: boolean;
  authorizationError: string;
  chain: SerializedCert[];
  leafExpiresAtMs: number | null;
  leafDaysRemaining: number | null;
  leafExpired: boolean;
  leafNotYetValid: boolean;
  error?: string;
};

function serializeOne(cert: tls.PeerCertificate, position: number): SerializedCert {
  const subject = formatDN(cert.subject);
  const cn =
    cert.subject && typeof cert.subject === "object" && "CN" in cert.subject
      ? String((cert.subject as { CN?: string }).CN ?? "")
      : "";
  const vf = cert.valid_from ? Date.parse(cert.valid_from) : NaN;
  const vt = cert.valid_to ? Date.parse(cert.valid_to) : NaN;
  const sigalg = (cert as tls.PeerCertificate & { sigalg?: string }).sigalg;

  return {
    position,
    subject,
    issuer: formatDN(cert.issuer),
    commonName: cn,
    subjectAltNames: parseSanList(cert.subjectaltname),
    validFrom: cert.valid_from,
    validTo: cert.valid_to,
    validFromMs: Number.isFinite(vf) ? vf : null,
    validToMs: Number.isFinite(vt) ? vt : null,
    serialNumber: cert.serialNumber,
    fingerprint256: cert.fingerprint256 ?? "",
    fingerprintSha1: cert.fingerprint ?? "",
    signatureAlgorithm: sigalg,
    bits: cert.bits,
  };
}

export async function lookupSslCertificates(
  host: string,
  port: number,
): Promise<SslLookupResult> {
  await assertPublicTlsHost(host);

  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      {
        host,
        port,
        servername: net.isIP(host) ? undefined : host,
        rejectUnauthorized: false,
        minVersion: "TLSv1.2",
      },
      () => {
        try {
          const raw = socket.getPeerCertificate(true) as tls.DetailedPeerCertificate;
          const chain = flattenChain(raw);
          const serialized = chain.map((c, i) => serializeOne(c, i + 1));
          const leaf = serialized[0];
          const now = Date.now();
          let leafExpired = false;
          let leafNotYetValid = false;
          let leafDaysRemaining: number | null = null;
          const leafExpiresAtMs = leaf?.validToMs ?? null;

          if (leaf?.validToMs != null) {
            leafDaysRemaining = Math.floor(
              (leaf.validToMs - now) / (24 * 60 * 60 * 1000),
            );
            leafExpired = leaf.validToMs < now;
          }
          if (leaf?.validFromMs != null && leaf.validFromMs > now) {
            leafNotYetValid = true;
          }

          const result: SslLookupResult = {
            host,
            port,
            tlsVersion: socket.getProtocol() ?? undefined,
            alpnProtocol: socket.alpnProtocol?.toString(),
            authorized: socket.authorized,
            authorizationError:
              socket.authorizationError == null
                ? ""
                : socket.authorizationError instanceof Error
                  ? socket.authorizationError.message
                  : String(socket.authorizationError),
            chain: serialized,
            leafExpiresAtMs,
            leafDaysRemaining,
            leafExpired,
            leafNotYetValid,
          };

          socket.end();
          resolve(result);
        } catch (e) {
          socket.destroy();
          reject(e);
        }
      },
    );

    socket.setTimeout(CONNECT_MS, () => {
      socket.destroy();
      reject(new SslCertLookupError("TLS handshake timed out."));
    });

    socket.on("error", (err) => {
      socket.destroy();
      const msg = err instanceof Error ? err.message : "TLS connection failed";
      reject(new SslCertLookupError(msg));
    });
  });
}
