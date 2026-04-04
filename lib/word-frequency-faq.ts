export const wordFrequencyFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is a word frequency analyzer used for?",
    answer:
      "It ranks how often each word appears in pasted text. Content editors use it to spot repetition, possible keyword stuffing, or thin vocabulary before publishing. Developers use it on logs, comments, or pasted prose when they want a quick histogram without a spreadsheet.",
  },
  {
    question: "Is my text sent to your servers?",
    answer:
      "No. The page runs entirely in your browser: paste, optional file upload via the File API, and frequency math all stay on your device. Nothing is transmitted for analysis unless you use another tool on this site that explicitly performs network requests.",
  },
  {
    question: "How does this tool split words?",
    answer:
      "It splits on whitespace (spaces, tabs, line breaks), then trims leading and trailing punctuation and symbols from each token so hello, and hello count as the same word. It is not a full natural-language tokenizer: hyphenated compounds stay one token, and languages without spaces between words need specialized software.",
  },
  {
    question: "What does “omit common words” mean?",
    answer:
      "When enabled, a small list of frequent English function words (like the, and, is) is excluded so content words rise to the top. Toggle it off if you are studying stop-word ratios, stylometry, or need every token in the export.",
  },
  {
    question: "Why do percentages not add to exactly 100%?",
    answer:
      "Percentages are rounded to one decimal place per row. Rounding error can make the visible sum differ slightly from 100. The underlying counts are exact integers.",
  },
  {
    question: "How is this different from the word counter page?",
    answer:
      "The word counter reports totals—word count, characters, reading time—while this page lists each distinct word with counts and share of analyzed tokens. Use the counter for length limits, then use frequency analysis for repetition and vocabulary checks.",
  },
  {
    question: "Can I copy results into Excel or Google Sheets?",
    answer:
      "Yes. Use Copy TSV to place a tab-separated table with a header row (count, percent, word). Paste into a spreadsheet and split on tabs if your app does not auto-detect the format.",
  },
  {
    question: "Which related tools pair well with word frequency?",
    answer:
      "Use the find and replace tool for bulk edits after spotting overused terms, the duplicate line remover for lists, the whitespace remover before recounting cleaned copy, and the word counter when you need character limits or reading time. All live under Text and String Tools on the home page.",
  },
];
