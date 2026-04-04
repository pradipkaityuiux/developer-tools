export const keywordDensityFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is keyword density in SEO?",
    answer:
      "Keyword density usually means how often a target phrase appears relative to the total word count on a page. A common formula is: (number of occurrences × number of words in the phrase) ÷ total words × 100. It is a rough editorial signal—search engines today use broader relevance and quality signals, so never sacrifice readability to hit a density number.",
  },
  {
    question: "How does this tool measure prominence?",
    answer:
      "We tokenize your paste the same way as for density, then find the first non-overlapping match of your phrase. We report the 1-based word position of that match, whether it falls within the first 100 words (a simple “early intro” check), and an “earlyness” percentage (how far into the document the first match starts). It does not read your live HTML title or H1—paste body copy or a full article to audit placement in context.",
  },
  {
    question: "Why are my multi-word phrase matches zero?",
    answer:
      "Phrases must match consecutive tokens after trimming edge punctuation and (if enabled) folding case. Extra punctuation inside a word, different hyphenation, or a synonym will break the sequence. Try shorter phrases, disable “ignore case” if you intentionally use mixed case tokens, or normalize the text first with our find-and-replace or whitespace tools.",
  },
  {
    question: "Is my content uploaded to a server?",
    answer:
      "No. Analysis runs entirely in your browser. Optional file upload uses the File API to read text locally; nothing is sent to our servers for keyword counting unless you use another tool on this site that explicitly performs network requests.",
  },
  {
    question: "What keyword density should I aim for?",
    answer:
      "There is no universally safe percentage. Many SEOs treat very high repetition as a spam risk and focus on natural language, headings, and intent coverage instead. Use this tool to catch accidental stuffing and to verify your primary phrase appears early when appropriate—not to chase a fixed density score.",
  },
  {
    question: "How is this different from the word frequency analyzer?",
    answer:
      "The word frequency tool ranks every distinct word in your text. This page is phrase-focused: you enter target keywords to see occurrences, density, and first-position prominence for those exact sequences. Use both together: frequency for vocabulary balance, keyword density for focus phrases.",
  },
  {
    question: "Can I analyze several keywords at once?",
    answer:
      "Yes. Enter a primary phrase, then add more comma-separated phrases in the additional field. Each distinct phrase gets its own row in the results table. Duplicates (after trimming) are merged automatically.",
  },
];
