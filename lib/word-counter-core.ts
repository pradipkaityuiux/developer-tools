export type TextStats = {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  nonEmptyLines: number;
  readingMinutes: number;
};

/**
 * Sentence and paragraph counts are heuristics (e.g. "Dr." may split oddly).
 * Reading time uses ceil(words / wpm), minimum 1 minute when words > 0.
 */
export function computeTextStats(
  text: string,
  readingWpm: number,
): TextStats {
  const raw = text;
  const normalized = raw.replace(/\r\n/g, "\n");
  const trimmedAll = normalized.trim();

  const words = trimmedAll
    ? trimmedAll.split(/\s+/).filter((w) => w.length > 0)
    : [];
  const wordCount = words.length;

  const characters = raw.length;
  const charactersNoSpaces = raw.replace(/\s/g, "").length;

  const lines = raw === "" ? 0 : normalized.split("\n").length;
  const nonEmptyLines = normalized
    .split("\n")
    .filter((l) => l.trim().length > 0).length;

  const paragraphs = trimmedAll
    ? normalized.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
    : 0;

  let sentences = 0;
  if (trimmedAll) {
    const parts = trimmedAll.split(/(?<=[.!?])\s+/);
    sentences = parts.filter((p) => {
      const core = p.replace(/[.!?]+$/g, "").trim();
      return core.length > 0;
    }).length;
  }

  const wpm = Math.max(1, Math.min(600, Math.round(readingWpm)));
  const readingMinutes =
    wordCount === 0 ? 0 : Math.max(1, Math.ceil(wordCount / wpm));

  return {
    words: wordCount,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    lines,
    nonEmptyLines,
    readingMinutes,
  };
}

export function formatStatsSummary(
  stats: TextStats,
  readingWpm: number,
): string {
  const lines = [
    `Words: ${stats.words.toLocaleString()}`,
    `Characters (with spaces): ${stats.characters.toLocaleString()}`,
    `Characters (no spaces): ${stats.charactersNoSpaces.toLocaleString()}`,
    `Sentences (estimate): ${stats.sentences.toLocaleString()}`,
    `Paragraphs: ${stats.paragraphs.toLocaleString()}`,
    `Lines: ${stats.lines.toLocaleString()} (${stats.nonEmptyLines.toLocaleString()} non-empty)`,
    `Estimated reading time: ${stats.readingMinutes} min @ ${readingWpm} WPM`,
  ];
  return lines.join("\n");
}
