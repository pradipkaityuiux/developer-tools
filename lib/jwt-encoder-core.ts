export type JwtEncodeOk = {
  ok: true;
  token: string;
};

export type JwtEncodeErr = {
  ok: false;
  error: string;
};

export type JwtEncodeResult = JwtEncodeOk | JwtEncodeErr;

/** Satisfies Web Crypto BufferSource typing with strict lib.dom. */
function asBufferSource(bytes: Uint8Array): BufferSource {
  return bytes as unknown as BufferSource;
}

function utf8ToUint8Array(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  if (typeof btoa !== "function") {
    throw new Error("Base64 encoding is not available in this environment");
  }
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function jsonSegment(obj: unknown): string {
  const s = JSON.stringify(obj);
  const bytes = utf8ToUint8Array(s);
  return uint8ArrayToBase64Url(bytes);
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Build a JWS compact JWT with HS256 using the Web Crypto API (browser).
 */
export async function encodeJwtHs256(
  headerJson: string,
  payloadJson: string,
  secret: string,
): Promise<JwtEncodeResult> {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    return {
      ok: false,
      error:
        "Web Crypto is not available. Use a modern browser with HTTPS or localhost.",
    };
  }

  const trimmedSecret = secret.trim();
  if (trimmedSecret === "") {
    return { ok: false, error: "Secret is required for HS256 signing." };
  }

  let header: unknown;
  let payload: unknown;
  try {
    header = JSON.parse(headerJson);
  } catch {
    return { ok: false, error: "Header is not valid JSON." };
  }
  try {
    payload = JSON.parse(payloadJson);
  } catch {
    return { ok: false, error: "Payload is not valid JSON." };
  }

  if (!isPlainObject(header)) {
    return { ok: false, error: "Header must be a JSON object." };
  }
  if (!isPlainObject(payload)) {
    return { ok: false, error: "Payload must be a JSON object." };
  }

  const alg = header["alg"];
  if (alg !== undefined && alg !== "HS256") {
    return {
      ok: false,
      error:
        'This tool signs with HS256 only. Set header "alg" to "HS256" or remove it.',
    };
  }

  const headerOut = { ...header, alg: "HS256" as const };

  const part1 = jsonSegment(headerOut);
  const part2 = jsonSegment(payload);
  const signingInput = `${part1}.${part2}`;

  const keyMaterial = utf8ToUint8Array(trimmedSecret);
  let cryptoKey: CryptoKey;
  try {
    cryptoKey = await crypto.subtle.importKey(
      "raw",
      asBufferSource(keyMaterial),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
  } catch {
    return { ok: false, error: "Could not import secret for HMAC." };
  }

  const sigBytes = new Uint8Array(
    await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      asBufferSource(utf8ToUint8Array(signingInput)),
    ),
  );
  const part3 = uint8ArrayToBase64Url(sigBytes);

  return { ok: true, token: `${signingInput}.${part3}` };
}
