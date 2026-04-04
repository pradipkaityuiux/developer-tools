/**
 * Produce a URL-friendly slug: lowercase, hyphen-separated, letters and numbers
 * (Unicode-aware), accents stripped via NFD + removing combining marks.
 */
export function slugifySegment(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const asciiish = trimmed
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();

  const withHyphens = asciiish.replace(/[^\p{L}\p{N}]+/gu, "-");
  return withHyphens.replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export type SlugMode = "single" | "per-line";

/**
 * @param input - Title or multiline list of titles
 * @param mode - `single` joins non-empty lines with spaces then slugifies once;
 *   `per-line` slugifies each non-empty line (output joined with newlines)
 */
export function slugifyText(input: string, mode: SlugMode): string {
  if (!input.trim()) return "";

  if (mode === "single") {
    const joined = input
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .join(" ");
    return slugifySegment(joined);
  }

  const lines = input.split(/\r?\n/);
  const slugs = lines
    .map((line) => slugifySegment(line))
    .filter((s) => s.length > 0);
  return slugs.join("\n");
}
