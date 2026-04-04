import { md5 } from "js-md5";

export function utf8Encode(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

/** MD5 hex (lowercase). Suitable for checksums, not security. */
export function md5Hex(bytes: Uint8Array): string {
  return md5(bytes);
}

export async function shaHex(
  algorithm: "SHA-1" | "SHA-256" | "SHA-512",
  bytes: Uint8Array,
): Promise<string> {
  const buf = await crypto.subtle.digest(
    algorithm,
    new Uint8Array(bytes),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export type HashAlgorithmId = "MD5" | "SHA-1" | "SHA-256" | "SHA-512";

export async function computeAllHashes(text: string): Promise<{
  utf8: Uint8Array;
  results: Record<HashAlgorithmId, string | null>;
  errors: Partial<Record<HashAlgorithmId, string>>;
}> {
  const utf8 = utf8Encode(text);
  const results: Record<HashAlgorithmId, string | null> = {
    MD5: null,
    "SHA-1": null,
    "SHA-256": null,
    "SHA-512": null,
  };
  const errors: Partial<Record<HashAlgorithmId, string>> = {};

  results.MD5 = md5Hex(utf8);

  for (const algo of ["SHA-1", "SHA-256", "SHA-512"] as const) {
    try {
      results[algo] = await shaHex(algo, utf8);
    } catch (e) {
      errors[algo] =
        e instanceof Error ? e.message : "Digest failed in this browser.";
    }
  }

  return { utf8, results, errors };
}
