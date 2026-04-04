/** Shift Latin letters A–Z / a–z by `shift` positions; other characters unchanged. */

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export type CaesarMode = "encrypt" | "decrypt";

export function caesarTransform(
  text: string,
  shift: number,
  mode: CaesarMode,
): string {
  const k = mod(Math.trunc(shift), 26);
  const delta = mode === "decrypt" ? -k : k;
  if (k === 0) return text;

  let out = "";
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c >= 65 && c <= 90) {
      out += String.fromCharCode(65 + mod(c - 65 + delta, 26));
    } else if (c >= 97 && c <= 122) {
      out += String.fromCharCode(97 + mod(c - 97 + delta, 26));
    } else {
      out += text[i];
    }
  }
  return out;
}
