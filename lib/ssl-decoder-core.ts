import "reflect-metadata";
import {
  BasicConstraintsExtension,
  ExtendedKeyUsageExtension,
  KeyUsagesExtension,
  KeyUsageFlags,
  SubjectAlternativeNameExtension,
  X509Certificate,
} from "@peculiar/x509";

/** Demo PEM (EC P-256) — safe to ship; decodes offline in the browser. */
export const SSL_DECODER_SAMPLE_PEM = `-----BEGIN CERTIFICATE-----
MIIBUjCB+aADAgECAgEBMAoGCCqGSM49BAMCMDExIDAeBgNVBAMTF3NhbXBsZS5z
c2xkZWNvZGVyLmxvY2FsMQ0wCwYDVQQKEwREZW1vMB4XDTI0MDEwMTAwMDAwMFoX
DTMwMDEwMTAwMDAwMFowMTEgMB4GA1UEAxMXc2FtcGxlLnNzbGRlY29kZXIubG9j
YWwxDTALBgNVBAoTBERlbW8wWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAASNvv8/
RW8pwnYRf5CPVp2aA3kNLtlOavqTmRE9qn+/Y0y4rwsAxY1kr4TCw9RTgzNBfcbm
PBh5koV4/rn96zu0owIwADAKBggqhkjOPQQDAgNIADBFAiAgumZiNZ6fP9suK60W
SgvknBPBrVdzEJisabeU473T/wIhAPPTaOY3Xa8NktcZeETPZRGlenovmgLqSqdf
Jm+1y/Xp
-----END CERTIFICATE-----
`;

const PEM_BLOCK =
  /-----BEGIN CERTIFICATE-----[\r\n]+(?:[A-Za-z0-9+/=\r\n]+)+-----END CERTIFICATE-----/g;

export function extractCertificatePems(text: string): string[] {
  const s = text.trim();
  if (!s) return [];
  const matches = s.match(PEM_BLOCK);
  return matches ?? [];
}

export type ValidityHint = "valid_now" | "not_yet_valid" | "expired";

export type SanEntry = { type: string; value: string };

export type DecodedCertificate = {
  subject: string;
  issuer: string;
  serialNumber: string;
  notBeforeIso: string;
  notAfterIso: string;
  validityHint: ValidityHint;
  signatureAlgorithm: string;
  publicKeySummary: string;
  subjectAltNames: SanEntry[];
  basicConstraints: string | null;
  keyUsages: string[] | null;
  extendedKeyUsages: string[] | null;
};

export type DecodeOneResult =
  | { ok: true; pem: string; data: DecodedCertificate }
  | { ok: false; pem: string; error: string };

function formatSignatureAlgorithm(alg: Algorithm): string {
  const a = alg as Algorithm & { hash?: Algorithm };
  if (a.hash && typeof a.hash === "object" && "name" in a.hash) {
    return `${a.name} / ${(a.hash as Algorithm).name}`;
  }
  return a.name ?? "unknown";
}

function formatPublicKeySummary(cert: X509Certificate): string {
  const a = cert.publicKey.algorithm;
  if (a.name === "ECDSA" && "namedCurve" in a) {
    return `ECDSA (${(a as EcKeyAlgorithm).namedCurve})`;
  }
  if (
    (a.name === "RSA-OAEP" ||
      a.name === "RSASSA-PKCS1-v1_5" ||
      a.name === "RSA-PSS") &&
    "hash" in a &&
    a.hash &&
    typeof a.hash === "object" &&
    "name" in a.hash
  ) {
    return `${a.name} (${(a.hash as Algorithm).name})`;
  }
  if (a.name === "RSA-OAEP" || a.name === "RSASSA-PKCS1-v1_5" || a.name === "RSA-PSS") {
    return a.name;
  }
  return a.name;
}

function keyUsageBits(flags: KeyUsageFlags): string[] {
  const pairs: [KeyUsageFlags, string][] = [
    [KeyUsageFlags.digitalSignature, "digitalSignature"],
    [KeyUsageFlags.nonRepudiation, "nonRepudiation"],
    [KeyUsageFlags.keyEncipherment, "keyEncipherment"],
    [KeyUsageFlags.dataEncipherment, "dataEncipherment"],
    [KeyUsageFlags.keyAgreement, "keyAgreement"],
    [KeyUsageFlags.keyCertSign, "keyCertSign"],
    [KeyUsageFlags.cRLSign, "cRLSign"],
    [KeyUsageFlags.encipherOnly, "encipherOnly"],
    [KeyUsageFlags.decipherOnly, "decipherOnly"],
  ];
  const out: string[] = [];
  for (const [bit, label] of pairs) {
    if ((flags & bit) === bit) out.push(label);
  }
  return out;
}

function validityHint(notBefore: Date, notAfter: Date, now: Date): ValidityHint {
  if (now < notBefore) return "not_yet_valid";
  if (now > notAfter) return "expired";
  return "valid_now";
}

function decodeOnePem(pem: string, now: Date): DecodedCertificate {
  const cert = new X509Certificate(pem.trim());

  const sanExt = cert.getExtension(SubjectAlternativeNameExtension);
  const subjectAltNames: SanEntry[] = [];
  if (sanExt?.names) {
    const json = sanExt.names.toJSON();
    for (const entry of json) {
      subjectAltNames.push({ type: entry.type, value: entry.value });
    }
  }

  let basicConstraints: string | null = null;
  const bc = cert.getExtension(BasicConstraintsExtension);
  if (bc) {
    basicConstraints = bc.ca
      ? `CA=true${bc.pathLength !== undefined ? `, pathLength=${bc.pathLength}` : ""}`
      : "CA=false";
  }

  let keyUsages: string[] | null = null;
  const ku = cert.getExtension(KeyUsagesExtension);
  if (ku) {
    keyUsages = keyUsageBits(ku.usages);
  }

  let extendedKeyUsages: string[] | null = null;
  const eku = cert.getExtension(ExtendedKeyUsageExtension);
  if (eku?.usages?.length) {
    extendedKeyUsages = eku.usages.map((u) => String(u));
  }

  return {
    subject: cert.subject,
    issuer: cert.issuer,
    serialNumber: cert.serialNumber,
    notBeforeIso: cert.notBefore.toISOString(),
    notAfterIso: cert.notAfter.toISOString(),
    validityHint: validityHint(cert.notBefore, cert.notAfter, now),
    signatureAlgorithm: formatSignatureAlgorithm(cert.signatureAlgorithm as Algorithm),
    publicKeySummary: formatPublicKeySummary(cert),
    subjectAltNames,
    basicConstraints,
    keyUsages,
    extendedKeyUsages,
  };
}

export function decodeCertificatePems(
  text: string,
  now: Date = new Date(),
): { blocks: DecodeOneResult[]; empty: boolean } {
  const pems = extractCertificatePems(text);
  if (pems.length === 0) {
    return { blocks: [], empty: true };
  }

  const blocks: DecodeOneResult[] = [];
  for (const pem of pems) {
    try {
      blocks.push({ ok: true, pem, data: decodeOnePem(pem, now) });
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Could not parse this certificate.";
      blocks.push({ ok: false, pem, error: msg });
    }
  }
  return { blocks, empty: false };
}

export async function sha256FingerprintColonHex(pem: string): Promise<string | null> {
  try {
    const der = X509Certificate.toArrayBuffer(pem.trim());
    const digest = await crypto.subtle.digest("SHA-256", der);
    const bytes = new Uint8Array(digest);
    return [...bytes]
      .map((b) => b.toString(16).toUpperCase().padStart(2, "0"))
      .join(":");
  } catch {
    return null;
  }
}
