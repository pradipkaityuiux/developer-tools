export type HmacHashAlgorithm = "SHA-256" | "SHA-512";
export type HmacOutputEncoding = "hex" | "base64";

export function utf8Encode(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

/** Base64 (standard) from bytes — chunked to avoid stack limits on large buffers. */
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 8192;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/**
 * HMAC with raw UTF-8 key material and message (same as most webhook docs:
 * key and payload are UTF-8 bytes before HMAC).
 */
export async function computeHmac(
  hash: HmacHashAlgorithm,
  secret: string,
  message: string,
  encoding: HmacOutputEncoding,
): Promise<string> {
  const enc = new TextEncoder();
  const keyBytes = enc.encode(secret);
  const msgBytes = enc.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: hash },
    false,
    ["sign"],
  );

  const buf = await crypto.subtle.sign("HMAC", cryptoKey, msgBytes);
  const sig = new Uint8Array(buf);

  if (encoding === "hex") {
    return Array.from(sig)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  return bytesToBase64(sig);
}
