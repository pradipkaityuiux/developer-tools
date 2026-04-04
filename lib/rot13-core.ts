/**
 * Classic ROT13: rotate Latin letters A–Z and a–z by 13 positions.
 * Applying ROT13 twice returns the original text (self-inverse).
 */
export function rot13(input: string): string {
  let out = "";
  for (const ch of input) {
    const c = ch.codePointAt(0)!;
    if (c >= 65 && c <= 90) {
      out += String.fromCodePoint(((c - 65 + 13) % 26) + 65);
    } else if (c >= 97 && c <= 122) {
      out += String.fromCodePoint(((c - 97 + 13) % 26) + 97);
    } else {
      out += ch;
    }
  }
  return out;
}
