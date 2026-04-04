/**
 * English readability heuristics (Flesch Reading Ease, Flesch–Kincaid grade level).
 * Syllable counts use a common vowel-group heuristic—adequate for drafts, not linguistic gold.
 */

export type ReadabilityMetrics = {
  words: number;
  sentences: number;
  syllables: number;
  fleschReadingEase: number | null;
  fleschKincaidGrade: number | null;
  avgWordsPerSentence: number | null;
  avgSyllablesPerWord: number | null;
  easeBand: string;
  gradeInterpretation: string;
  suggestions: string[];
};

const EASE_BANDS: { max: number; label: string }[] = [
  { max: 30, label: "Very difficult — college graduate" },
  { max: 50, label: "Difficult — college" },
  { max: 60, label: "Fairly difficult — 10th–12th grade" },
  { max: 70, label: "Standard — 8th–9th grade" },
  { max: 80, label: "Fairly easy — 7th grade" },
  { max: 90, label: "Easy — 6th grade" },
  { max: 100, label: "Very easy — 5th grade" },
];

function easeBand(score: number): string {
  for (const row of EASE_BANDS) {
    if (score <= row.max) return row.label;
  }
  return EASE_BANDS[EASE_BANDS.length - 1]!.label;
}

function gradeInterpretation(grade: number): string {
  if (grade <= 5) return "Roughly elementary school reading level.";
  if (grade <= 8) return "Roughly middle school — strong for broad audiences.";
  if (grade <= 12) return "High school — typical for many blog posts.";
  if (grade <= 16) return "College — suitable for specialist or B2B readers.";
  return "Graduate — very dense; consider simplifying for general SEO.";
}

/** Strip leading/trailing punctuation from a token for syllable counting. */
function alphabeticCore(token: string): string {
  return token.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "");
}

/**
 * Heuristic syllable count for English-like tokens.
 */
export function countSyllablesInWord(word: string): number {
  const w = alphabeticCore(word).toLowerCase();
  if (w.length === 0) return 0;
  if (w.length <= 3) return 1;

  let s = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  s = s.replace(/^y/, "");
  const matches = s.match(/[aeiouy]{1,2}/g);
  const n = matches ? matches.length : 1;
  return Math.max(1, n);
}

function countSentences(trimmedAll: string): number {
  if (!trimmedAll) return 0;
  const parts = trimmedAll.split(/(?<=[.!?])\s+/);
  return parts.filter((p) => {
    const core = p.replace(/[.!?]+$/g, "").trim();
    return core.length > 0;
  }).length;
}

function buildSuggestions(
  words: number,
  sentences: number,
  asl: number | null,
  asw: number | null,
  fre: number | null,
  fk: number | null,
): string[] {
  const tips: string[] = [];
  if (words < 100) {
    tips.push(
      "Scores are more stable with at least 100 words—paste a full section when possible.",
    );
  }
  if (asl !== null && asl > 22) {
    tips.push(
      "Average sentence length is high: break long sentences with periods or semicolons where grammar allows.",
    );
  }
  if (asw !== null && asw > 1.65) {
    tips.push(
      "Syllables per word are high: swap jargon for plain terms and prefer strong verbs over nominalizations.",
    );
  }
  if (fre !== null && fre < 50) {
    tips.push(
      "Reading ease is low: add white space, use lists for steps, and define acronyms on first use.",
    );
  }
  if (fk !== null && fk > 12) {
    tips.push(
      "Grade level is above high school: shorten paragraphs and front-load the main point in each section.",
    );
  }
  if (
    tips.length === 0 &&
    fre !== null &&
    fk !== null &&
    fre >= 60 &&
    fk <= 10
  ) {
    tips.push(
      "This draft sits in a comfortable band for many web readers; still verify tone with your brand guide.",
    );
  }
  if (tips.length === 0) {
    tips.push(
      "Compare variants of your intro and headings with this tool until metrics match your audience brief.",
    );
  }
  return tips;
}

export function computeReadability(raw: string): ReadabilityMetrics {
  const normalized = raw.replace(/\r\n/g, "\n");
  const trimmedAll = normalized.trim();

  const wordTokens = trimmedAll
    ? trimmedAll.split(/\s+/).filter((w) => w.length > 0)
    : [];
  const words = wordTokens.length;

  let syllables = 0;
  for (const t of wordTokens) {
    syllables += countSyllablesInWord(t);
  }

  let sentences = countSentences(trimmedAll);
  if (words > 0 && sentences === 0) sentences = 1;

  const avgWordsPerSentence =
    words === 0 || sentences === 0 ? null : words / sentences;
  const avgSyllablesPerWord = words === 0 ? null : syllables / words;

  let fleschReadingEase: number | null = null;
  let fleschKincaidGrade: number | null = null;

  if (words >= 1 && sentences >= 1 && syllables >= 1) {
    const asl = words / sentences;
    const asw = syllables / words;
    fleschReadingEase = Math.max(
      0,
      Math.min(100, 206.835 - 1.015 * asl - 84.6 * asw),
    );
    fleschKincaidGrade = Math.max(
      0,
      0.39 * asl + 11.8 * asw - 15.59,
    );
  }

  const easeBandLabel =
    fleschReadingEase !== null ? easeBand(fleschReadingEase) : "—";

  const gradeInterp =
    fleschKincaidGrade !== null
      ? gradeInterpretation(fleschKincaidGrade)
      : "Add text to see a grade-level interpretation.";

  const suggestions = buildSuggestions(
    words,
    sentences,
    avgWordsPerSentence,
    avgSyllablesPerWord,
    fleschReadingEase,
    fleschKincaidGrade,
  );

  return {
    words,
    sentences,
    syllables,
    fleschReadingEase,
    fleschKincaidGrade,
    avgWordsPerSentence,
    avgSyllablesPerWord,
    easeBand: easeBandLabel,
    gradeInterpretation: gradeInterp,
    suggestions,
  };
}

export function formatReadabilitySummary(m: ReadabilityMetrics): string {
  const fre =
    m.fleschReadingEase !== null
      ? m.fleschReadingEase.toFixed(1)
      : "n/a";
  const fk =
    m.fleschKincaidGrade !== null
      ? m.fleschKincaidGrade.toFixed(1)
      : "n/a";
  const asl =
    m.avgWordsPerSentence !== null
      ? m.avgWordsPerSentence.toFixed(1)
      : "n/a";
  const asw =
    m.avgSyllablesPerWord !== null
      ? m.avgSyllablesPerWord.toFixed(2)
      : "n/a";

  const lines = [
    `Flesch Reading Ease: ${fre} (${m.easeBand})`,
    `Flesch–Kincaid grade level: ${fk}`,
    `Words: ${m.words.toLocaleString()}; sentences (est.): ${m.sentences.toLocaleString()}`,
    `Syllables (est.): ${m.syllables.toLocaleString()}`,
    `Avg words / sentence: ${asl}; avg syllables / word: ${asw}`,
    "",
    "Suggestions:",
    ...m.suggestions.map((s) => `• ${s}`),
  ];
  return lines.join("\n");
}
