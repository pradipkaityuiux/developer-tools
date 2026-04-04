/** PEM (PKCS#8 / SPKI) helpers for RSA keys from Web Crypto exports. */

export function pemEncode(label: string, der: ArrayBuffer): string {
  const bytes = new Uint8Array(der);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  const base64 = btoa(binary);
  const lines = base64.match(/.{1,64}/g)?.join("\n") ?? base64;
  return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----`;
}

export async function generateRsaKeyPairPem(modulusLength: number): Promise<{
  publicPem: string;
  privatePem: string;
}> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  );

  const pubBuf = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privBuf = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  return {
    publicPem: pemEncode("PUBLIC KEY", pubBuf),
    privatePem: pemEncode("PRIVATE KEY", privBuf),
  };
}

/** Extract PEM blocks from pasted or uploaded text (SubjectPublicKey / PKCS#8 / legacy PKCS#1). */
export function parsePemFromText(text: string): {
  publicPem: string | null;
  privatePem: string | null;
} {
  const normalized = text.replace(/\r\n/g, "\n").trim();

  const pub = normalized.match(
    /-----BEGIN PUBLIC KEY-----[\s\S]+?-----END PUBLIC KEY-----/,
  );

  const pkcs8 = normalized.match(
    /-----BEGIN PRIVATE KEY-----[\s\S]+?-----END PRIVATE KEY-----/,
  );

  const pkcs1 = normalized.match(
    /-----BEGIN RSA PRIVATE KEY-----[\s\S]+?-----END RSA PRIVATE KEY-----/,
  );

  return {
    publicPem: pub?.[0] ?? null,
    privatePem: pkcs8?.[0] ?? pkcs1?.[0] ?? null,
  };
}
