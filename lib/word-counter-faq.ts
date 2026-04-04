export const wordCounterFaqItems: { question: string; answer: string }[] = [
  {
    question: "What does this online word counter count?",
    answer:
      "It counts words (tokens separated by whitespace), characters with and without spaces, estimated sentences, paragraphs separated by blank lines, total lines and non-empty lines, and estimated reading time from your chosen words-per-minute rate. Everything is computed locally in your browser.",
  },
  {
    question: "Is my text uploaded to your servers?",
    answer:
      "No. Paste or upload a file and the tool reads it with the File API in your tab only. Counts update as you type; nothing is sent to our backend unless you use another page that explicitly makes network requests.",
  },
  {
    question: "How is reading time calculated?",
    answer:
      "Reading time divides the word count by your selected WPM (words per minute), rounds up to whole minutes, and shows at least one minute whenever there is at least one word. Typical blog defaults are 200 to 250 WPM; change the reading speed menu if your audience reads faster or slower.",
  },
  {
    question: "Why might sentence count look wrong?",
    answer:
      "Sentence detection splits on punctuation like periods, question marks, and exclamation points followed by whitespace. Abbreviations such as Dr. or e.g. can add extra segments, and missing final punctuation can undercount. Use the figure as a quick estimate, not a linguistic parse.",
  },
  {
    question: "Does a hyphenated word count as one word?",
    answer:
      "Yes. Anything between whitespace counts as a single word, so compound terms like state-of-the-art are one word. If you need tokenization rules for search or NLP, export text and process it in a dedicated pipeline or tokenizer.",
  },
  {
    question: "How is this different from Microsoft Word or Google Docs?",
    answer:
      "Word processors often include footnotes, hidden text, or field codes in their counts. This tool counts exactly what you see in the box—ideal for CMS character limits, tweets, meta descriptions, and plain-text drafts. Pair it with our meta tags extractor when you verify live HTML limits.",
  },
  {
    question: "Which related tools should I use next?",
    answer:
      "For ranked word repetition use the word frequency analyzer; for title and slug length checks use the slug generator and case converter; for bulk find-and-replace use the find and replace tool; for placeholder draft length use the lorem ipsum generator—all listed under Text and String Tools and Code sections on the home page.",
  },
];
