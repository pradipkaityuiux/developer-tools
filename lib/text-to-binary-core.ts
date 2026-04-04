export type BinaryByteSeparator = "spaced" | "compact";

/**
 * UTF-8 text → binary string (8 bits per byte).
 * `spaced`: groups of 8 bits separated by spaces (one space between bytes).
 * `compact`: single continuous 0/1 stream.
 */
export function textToBinaryUtf8(
  text: string,
  separator: BinaryByteSeparator,
): string {
  if (!text) return "";
  const bytes = new TextEncoder().encode(text);
  const chunks = Array.from(bytes, (b) => b.toString(2).padStart(8, "0"));
  return separator === "spaced" ? chunks.join(" ") : chunks.join("");
}

export type BinaryDecodeResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

/**
 * Accepts spaces, newlines, or any non-0/1 junk between bit groups; only 0 and 1 are read.
 * Expects total bit count divisible by 8; decodes as UTF-8 (strict).
 */
export function binaryToTextUtf8(input: string): BinaryDecodeResult {
  const bits = input.replace(/[^01]/g, "");
  if (bits.length === 0) {
    return { ok: true, text: "" };
  }
  if (bits.length % 8 !== 0) {
    return {
      ok: false,
      error: `Binary length must be a multiple of 8 bits (got ${bits.length}). Remove partial bytes or pad intentionally.`,
    };
  }
  const len = bits.length / 8;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = Number.parseInt(bits.slice(i * 8, i * 8 + 8), 2);
  }
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return { ok: true, text };
  } catch {
    return {
      ok: false,
      error:
        "Those bits are not valid UTF-8. Check for a truncated byte, wrong endianness, or non-text binary data.",
    };
  }
}
