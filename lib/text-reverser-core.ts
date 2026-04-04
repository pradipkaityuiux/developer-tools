export type TextReverseMode = "full" | "words-per-line" | "lines";

export function splitLines(text: string): string[] {
  return text.split(/\r\n|\r|\n/);
}

export function joinLines(lines: string[]): string {
  return lines.join("\n");
}

/** Reverse the entire string as a sequence of Unicode code points (handles many multi-byte chars). */
export function reverseFullText(text: string): string {
  return Array.from(text).reverse().join("");
}

/**
 * Reverse word order on each line. Whitespace-only lines are unchanged.
 * Lines with text are trimmed for tokenization; output uses single spaces between words.
 */
export function reverseWordsInLine(line: string): string {
  const t = line.trim();
  if (!t) return line;
  const words = t.split(/\s+/);
  return words.reverse().join(" ");
}

export function reverseWordsPerLine(text: string): string {
  return joinLines(splitLines(text).map(reverseWordsInLine));
}

/** Reverse characters within each line; line breaks are preserved as separate lines. */
export function reverseEachLineChars(text: string): string {
  return joinLines(
    splitLines(text).map((line) => Array.from(line).reverse().join("")),
  );
}

export function reverseText(text: string, mode: TextReverseMode): string {
  switch (mode) {
    case "full":
      return reverseFullText(text);
    case "words-per-line":
      return reverseWordsPerLine(text);
    case "lines":
      return reverseEachLineChars(text);
    default:
      return text;
  }
}
