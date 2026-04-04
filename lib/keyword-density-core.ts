export type KeywordDensityOptions = {
  ignoreCase: boolean;
};

export type PhraseMatchResult = {
  phrase: string;
  occurrences: number;
  /** (occurrences × phraseWordCount / totalWords) × 100 — common SEO-style density */
  densityPercent: number;
  /** occurrences / totalWords × 100 — share of “slots” taken by the phrase */
  occurrenceSharePercent: number;
  /** 1-based word index of the first token of the first match, or null */
  firstOccurrenceWordIndex: number | null;
  /** True when the first match begins within the first 100 words */
  inFirst100Words: boolean;
  /** 0–100: lower means the phrase appears earlier in the body (first token index / totalWords) */
  prominenceEarlyness: number | null;
  phraseWordCount: number;
};

/** Strip leading/trailing punctuation; matches word-frequency heuristics */
function normalizeToken(raw: string, ignoreCase: boolean): string {
  const trimmed = raw.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, "");
  if (!trimmed) return "";
  return ignoreCase ? trimmed.toLowerCase() : trimmed;
}

/** All whitespace-separated tokens after edge punctuation trim (non-empty only). */
export function tokenizeDocument(text: string, ignoreCase: boolean): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];
  const rawTokens = normalized.split(/\s+/).filter((t) => t.length > 0);
  const out: string[] = [];
  for (const token of rawTokens) {
    const w = normalizeToken(token, ignoreCase);
    if (w.length > 0) out.push(w);
  }
  return out;
}

export function parsePhrase(phrase: string, ignoreCase: boolean): string[] {
  const trimmed = phrase.trim();
  if (!trimmed) return [];
  const parts = trimmed.split(/\s+/).filter((p) => p.length > 0);
  return parts.map((p) => normalizeToken(p, ignoreCase)).filter((p) => p.length > 0);
}

/**
 * Non-overlapping consecutive-token matches (left-to-right).
 */
export function countPhraseMatches(
  docTokens: string[],
  phraseTokens: string[],
): { count: number; firstStartIndex: number | null } {
  if (phraseTokens.length === 0 || docTokens.length < phraseTokens.length) {
    return { count: 0, firstStartIndex: null };
  }
  let count = 0;
  let firstStartIndex: number | null = null;
  let i = 0;
  const n = phraseTokens.length;
  while (i <= docTokens.length - n) {
    let match = true;
    for (let j = 0; j < n; j++) {
      if (docTokens[i + j] !== phraseTokens[j]) {
        match = false;
        break;
      }
    }
    if (match) {
      if (firstStartIndex === null) firstStartIndex = i;
      count++;
      i += n;
    } else {
      i++;
    }
  }
  return { count, firstStartIndex };
}

function dedupePhrases(phrases: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of phrases) {
    const t = p.trim();
    if (!t) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

export function analyzeKeywordDensity(
  text: string,
  rawPhrases: string[],
  options: KeywordDensityOptions,
): {
  totalWords: number;
  results: PhraseMatchResult[];
} {
  const docTokens = tokenizeDocument(text, options.ignoreCase);
  const totalWords = docTokens.length;
  const phrases = dedupePhrases(rawPhrases);
  const results: PhraseMatchResult[] = [];

  for (const phrase of phrases) {
    const phraseTokens = parsePhrase(phrase, options.ignoreCase);
    if (phraseTokens.length === 0) continue;
    const { count, firstStartIndex } = countPhraseMatches(docTokens, phraseTokens);
    const phraseWordCount = phraseTokens.length;
    const densityPercent =
      totalWords > 0 ? (count * phraseWordCount * 100) / totalWords : 0;
    const occurrenceSharePercent =
      totalWords > 0 ? (count * 100) / totalWords : 0;
    const firstOccurrenceWordIndex =
      firstStartIndex === null ? null : firstStartIndex + 1;
    const inFirst100Words =
      firstStartIndex !== null && firstStartIndex < 100;
    const prominenceEarlyness =
      firstStartIndex !== null && totalWords > 0
        ? (firstStartIndex / totalWords) * 100
        : null;

    results.push({
      phrase,
      occurrences: count,
      densityPercent,
      occurrenceSharePercent,
      firstOccurrenceWordIndex,
      inFirst100Words,
      prominenceEarlyness,
      phraseWordCount,
    });
  }

  return { totalWords, results };
}

export function formatKeywordDensityReport(
  totalWords: number,
  rows: PhraseMatchResult[],
): string {
  const header =
    "phrase\toccurrences\tdensity_%\toccurrence_share_%\tfirst_word_index\tin_first_100\tearlyness_%";
  if (rows.length === 0) {
    return `total_words\t${totalWords}\n${header}\n(no phrases to analyze)`;
  }
  const lines = rows.map((r) => {
    const first =
      r.firstOccurrenceWordIndex === null ? "" : String(r.firstOccurrenceWordIndex);
    const early =
      r.prominenceEarlyness === null ? "" : r.prominenceEarlyness.toFixed(1);
    return [
      r.phrase.replace(/\t/g, " "),
      r.occurrences,
      r.densityPercent.toFixed(2),
      r.occurrenceSharePercent.toFixed(2),
      first,
      r.inFirst100Words ? "yes" : "no",
      early,
    ].join("\t");
  });
  return [`total_words\t${totalWords}`, header, ...lines].join("\n");
}
