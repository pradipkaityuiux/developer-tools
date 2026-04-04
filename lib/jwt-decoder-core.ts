export type JwtDecodeOk = {
  ok: true;
  header: unknown;
  payload: unknown;
  headerJson: string;
  payloadJson: string;
  algorithm: string | null;
  tokenType: string | null;
  expiry: JwtTimeClaim | null;
  notBefore: JwtTimeClaim | null;
  issuedAt: JwtTimeClaim | null;
};

export type JwtTimeClaim = {
  unixSeconds: number;
  iso: string;
  label: "exp" | "nbf" | "iat";
};

export type JwtDecodeErr = {
  ok: false;
  error: string;
};

export type JwtDecodeResult = JwtDecodeOk | JwtDecodeErr;

function base64UrlToBase64(segment: string): string {
  const s = segment.trim();
  let b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  switch (b64.length % 4) {
    case 0:
      break;
    case 2:
      b64 += "==";
      break;
    case 3:
      b64 += "=";
      break;
    default:
      throw new Error("Invalid Base64URL segment length");
  }
  return b64;
}

function decodeBase64UrlToUtf8(segment: string): string {
  const b64 = base64UrlToBase64(segment);
  if (typeof atob !== "function") {
    throw new Error("Base64 decode is not available in this environment");
  }
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

function parseJsonObject(segment: string, label: string): unknown {
  const text = decodeBase64UrlToUtf8(segment);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${label} is not valid JSON after decoding`);
  }
}

function readNumericClaim(obj: Record<string, unknown>, key: string): number | null {
  const v = obj[key];
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function timeClaim(
  unixSeconds: number,
  label: "exp" | "nbf" | "iat",
): JwtTimeClaim {
  const ms = unixSeconds * 1000;
  return {
    unixSeconds,
    label,
    iso: new Date(ms).toISOString(),
  };
}

/**
 * Decode JWT header and payload only (JWS compact, three segments).
 * Does not verify signature or integrity.
 */
export function decodeJwt(token: string): JwtDecodeResult {
  const raw = token.trim().replace(/^Bearer\s+/i, "").trim();
  if (!raw) {
    return { ok: false, error: "Paste a JWT string (three dot-separated parts)." };
  }

  const parts = raw.split(".");
  if (parts.length !== 3) {
    return {
      ok: false,
      error:
        "Expected a JWS compact token with three segments (header.payload.signature). JWE and other formats are not supported here.",
    };
  }

  const [h, p] = parts;
  if (!h || !p) {
    return { ok: false, error: "Header or payload segment is empty." };
  }

  let header: unknown;
  let payload: unknown;
  try {
    header = parseJsonObject(h, "JWT header");
    payload = parseJsonObject(p, "JWT payload");
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Decode failed";
    return { ok: false, error: msg };
  }

  const headerObj =
    header !== null && typeof header === "object" && !Array.isArray(header)
      ? (header as Record<string, unknown>)
      : null;
  const payloadObj =
    payload !== null && typeof payload === "object" && !Array.isArray(payload)
      ? (payload as Record<string, unknown>)
      : null;

  const algorithm =
    headerObj && typeof headerObj.alg === "string" ? headerObj.alg : null;
  const tokenType =
    headerObj && typeof headerObj.typ === "string" ? headerObj.typ : null;

  let expiry: JwtTimeClaim | null = null;
  let notBefore: JwtTimeClaim | null = null;
  let issuedAt: JwtTimeClaim | null = null;

  if (payloadObj) {
    const exp = readNumericClaim(payloadObj, "exp");
    const nbf = readNumericClaim(payloadObj, "nbf");
    const iat = readNumericClaim(payloadObj, "iat");
    if (exp !== null) expiry = timeClaim(exp, "exp");
    if (nbf !== null) notBefore = timeClaim(nbf, "nbf");
    if (iat !== null) issuedAt = timeClaim(iat, "iat");
  }

  const headerJson = JSON.stringify(header, null, 2);
  const payloadJson = JSON.stringify(payload, null, 2);

  return {
    ok: true,
    header,
    payload,
    headerJson,
    payloadJson,
    algorithm,
    tokenType,
    expiry,
    notBefore,
    issuedAt,
  };
}

export type ExpiryStatus =
  | { kind: "expired"; expiredAtIso: string }
  | { kind: "not_yet_valid"; notBeforeIso: string }
  | { kind: "active"; expiresAtIso: string | null };

export function jwtExpiryStatus(
  nowMs: number,
  expiry: JwtTimeClaim | null,
  notBefore: JwtTimeClaim | null,
): ExpiryStatus {
  if (notBefore && nowMs < notBefore.unixSeconds * 1000) {
    return { kind: "not_yet_valid", notBeforeIso: notBefore.iso };
  }
  if (expiry && nowMs >= expiry.unixSeconds * 1000) {
    return { kind: "expired", expiredAtIso: expiry.iso };
  }
  if (expiry) {
    return { kind: "active", expiresAtIso: expiry.iso };
  }
  return { kind: "active", expiresAtIso: null };
}
