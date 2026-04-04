export const readabilityFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is Flesch Reading Ease?",
    answer:
      "Flesch Reading Ease is a 0–100 score where higher values mean easier reading. It combines average sentence length and average syllables per word. It is widely used in SEO and editorial QA as a quick signal—not a substitute for audience testing or plain-language review.",
  },
  {
    question: "What is the Flesch–Kincaid grade level?",
    answer:
      "It estimates the U.S. school grade needed to comfortably read the text (e.g., 8.5 ≈ eighth to ninth grade). It uses the same averages as Flesch but on a grade scale. Blog and help-center targets often aim roughly between 7 and 10 for general readers, depending on topic.",
  },
  {
    question: "Is my content sent to your servers?",
    answer:
      "No. Paste or upload a file and all math runs in your browser with JavaScript. Nothing is transmitted for analysis unless you use another page that explicitly performs network requests.",
  },
  {
    question: "Why might syllable counts differ from other tools?",
    answer:
      "Syllables are approximated with English heuristics (vowel groups, silent-e style rules). Proper nouns, abbreviations, and multilingual passages can skew counts. Use the same tool consistently when comparing drafts.",
  },
  {
    question: "How many words do I need for a reliable score?",
    answer:
      "Very short snippets are noisy. Aim for at least 100 words—ideally a full paragraph or section—so averages stabilize. Headlines alone are better checked for length with a title tool than for readability grade.",
  },
  {
    question: "Does a high score always mean better SEO?",
    answer:
      "Not automatically. Search engines reward usefulness and relevance; readability helps user experience, especially on mobile. Match complexity to intent: YMYL topics may need more nuance even if the grade level rises. Pair this check with keyword intent and E-E-A-T planning.",
  },
  {
    question: "Which tools pair well with a readability checker?",
    answer:
      "Use the word counter for length and reading-time estimates, the word frequency analyzer to spot repetition, the meta tags extractor for live HTML snippets, and the Open Graph preview for share cards—each addresses a different layer of on-page QA.",
  },
];
