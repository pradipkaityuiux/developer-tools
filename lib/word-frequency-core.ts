export type WordFrequencyOptions = {
  /** Merge Word and word when true */
  ignoreCase: boolean;
  /** Drop tokens shorter than this (after normalization) */
  minLength: number;
  /** Remove common English function words */
  omitStopWords: boolean;
};

export type WordFrequencyRow = {
  word: string;
  count: number;
};

const DEFAULT_STOP = new Set(
  [
    "a",
    "an",
    "the",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "as",
    "by",
    "with",
    "from",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "must",
    "can",
    "this",
    "that",
    "these",
    "those",
    "it",
    "its",
    "they",
    "them",
    "their",
    "we",
    "our",
    "you",
    "your",
    "he",
    "she",
    "his",
    "her",
    "i",
    "me",
    "my",
    "not",
    "no",
    "so",
    "if",
    "than",
    "then",
    "too",
    "very",
    "just",
    "also",
    "into",
    "about",
    "over",
    "after",
    "before",
    "between",
    "out",
    "up",
    "down",
    "off",
    "again",
    "once",
    "here",
    "there",
    "when",
    "where",
    "why",
    "how",
    "all",
    "each",
    "every",
    "both",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "only",
    "own",
    "same",
    "what",
    "which",
    "who",
    "whom",
    "while",
    "during",
    "through",
    "against",
    "under",
    "above",
    "below",
  ].map((w) => w.toLowerCase()),
);

/** Strip leading/trailing punctuation; keep internal apostrophes in contractions */
function normalizeToken(raw: string, ignoreCase: boolean): string {
  const trimmed = raw.replace(
    /^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu,
    "",
  );
  if (!trimmed) return "";
  return ignoreCase ? trimmed.toLowerCase() : trimmed;
}

/**
 * Whitespace tokenization with optional case fold and punctuation trim on edges.
 * Not a linguistic tokenizer—matches expectations for quick SEO and editing audits.
 */
export function computeWordFrequencies(
  text: string,
  options: WordFrequencyOptions,
): WordFrequencyRow[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const tokens = normalized.split(/\s+/).filter((t) => t.length > 0);
  const counts = new Map<string, number>();

  for (const token of tokens) {
    let w = normalizeToken(token, options.ignoreCase);
    if (w.length < options.minLength) continue;
    if (options.omitStopWords && DEFAULT_STOP.has(w.toLowerCase())) continue;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }

  const rows: WordFrequencyRow[] = [...counts.entries()].map(
    ([word, count]) => ({ word, count }),
  );
  rows.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.word.localeCompare(b.word, undefined, { sensitivity: "base" });
  });
  return rows;
}

export function formatFrequencyExport(
  rows: WordFrequencyRow[],
  totalTokens: number,
): string {
  if (rows.length === 0) return "No words to analyze.";
  const lines = rows.map((r) => {
    const pct =
      totalTokens > 0
        ? ((r.count / totalTokens) * 100).toFixed(1)
        : "0.0";
    return `${r.count}\t${pct}%\t${r.word}`;
  });
  return ["count\t%\tword", ...lines].join("\n");
}

export function totalCountedTokens(rows: WordFrequencyRow[]): number {
  return rows.reduce((s, r) => s + r.count, 0);
}
