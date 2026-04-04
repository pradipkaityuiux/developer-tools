/** AES-256-GCM with PBKDF2-HMAC-SHA256 key derivation. All processing is intended for client-side Web Crypto. */

export const BUNDLE_PREFIX = "v1:";
export const DEFAULT_PBKDF2_ITERATIONS = 150_000;
export const MIN_PBKDF2_ITERATIONS = 10_000;
export const MAX_PBKDF2_ITERATIONS = 500_000;

const SALT_LEN = 16;
const IV_LEN = 12;
const ITER_LEN = 4;

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 8192;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

function u32be(n: number): Uint8Array {
  const b = new Uint8Array(ITER_LEN);
  new DataView(b.buffer).setUint32(0, n, false);
  return b;
}

function readU32be(bytes: Uint8Array, offset: number): number {
  return new DataView(
    bytes.buffer,
    bytes.byteOffset + offset,
    ITER_LEN,
  ).getUint32(0, false);
}

function assertIterations(n: number): void {
  if (
    !Number.isInteger(n) ||
    n < MIN_PBKDF2_ITERATIONS ||
    n > MAX_PBKDF2_ITERATIONS
  ) {
    throw new Error(
      `PBKDF2 iterations must be an integer between ${MIN_PBKDF2_ITERATIONS} and ${MAX_PBKDF2_ITERATIONS}.`,
    );
  }
}

async function deriveAesKey(
  passphrase: string,
  salt: Uint8Array,
  iterations: number,
): Promise<CryptoKey> {
  assertIterations(iterations);
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new Uint8Array(salt),
      iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

/**
 * Returns a single-line bundle: `v1:` + base64(salt | iterations | iv | ciphertext).
 * Iterations are stored so decrypt does not require you to remember them.
 */
export async function encryptAes256Gcm(
  passphrase: string,
  plaintextUtf8: string,
  iterations: number = DEFAULT_PBKDF2_ITERATIONS,
): Promise<string> {
  if (!passphrase) {
    throw new Error("Enter a passphrase.");
  }
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LEN));
  const iterBytes = u32be(iterations);
  const key = await deriveAesKey(passphrase, salt, iterations);
  const enc = new TextEncoder();
  const plain = enc.encode(plaintextUtf8);
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv) },
      key,
      plain,
    ),
  );
  const packed = new Uint8Array(
    salt.length + iterBytes.length + iv.length + ciphertext.length,
  );
  let o = 0;
  packed.set(salt, o);
  o += salt.length;
  packed.set(iterBytes, o);
  o += iterBytes.length;
  packed.set(iv, o);
  o += iv.length;
  packed.set(ciphertext, o);
  return `${BUNDLE_PREFIX}${bytesToBase64(packed)}`;
}

export async function decryptAes256Gcm(
  passphrase: string,
  bundle: string,
): Promise<string> {
  if (!passphrase) {
    throw new Error("Enter the same passphrase used for encryption.");
  }
  const trimmed = bundle.trim();
  if (!trimmed.startsWith(BUNDLE_PREFIX)) {
    throw new Error(
      `Unrecognized format. Ciphertext must start with ${BUNDLE_PREFIX}`,
    );
  }
  const b64 = trimmed.slice(BUNDLE_PREFIX.length).replace(/\s/g, "");
  let packed: Uint8Array;
  try {
    packed = base64ToBytes(b64);
  } catch {
    throw new Error("Invalid Base64 in ciphertext bundle.");
  }
  const minLen = SALT_LEN + ITER_LEN + IV_LEN + 16;
  if (packed.length < minLen) {
    throw new Error("Ciphertext bundle is too short or corrupted.");
  }
  const salt = packed.slice(0, SALT_LEN);
  const iterations = readU32be(packed, SALT_LEN);
  const iv = packed.slice(SALT_LEN + ITER_LEN, SALT_LEN + ITER_LEN + IV_LEN);
  const ciphertext = packed.slice(SALT_LEN + ITER_LEN + IV_LEN);
  assertIterations(iterations);
  const key = await deriveAesKey(passphrase, salt, iterations);
  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv) },
      key,
      new Uint8Array(ciphertext),
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    throw new Error(
      "Decryption failed. Wrong passphrase, corrupted data, or not produced by this tool.",
    );
  }
}
