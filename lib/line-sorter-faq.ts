export const lineSorterFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What does the online line sorter do?",
    answer:
      "It splits your text into lines and reorders them. You can sort alphabetically A–Z or Z–A (with optional case-insensitive comparison), sort by line length shortest-first or longest-first, or shuffle lines into a random order. Duplicate lines are kept—this is not a deduplication tool. Everything runs in your browser.",
  },
  {
    question: "Is my text uploaded to a server?",
    answer:
      "No. Pasted text and .txt files are processed with JavaScript in your tab. File upload uses the FileReader API locally; nothing is sent to our backend.",
  },
  {
    question: "How does case-insensitive alphabetical sort work?",
    answer:
      "When enabled, A–Z and Z–A modes compare lines using Unicode case folding so uppercase and lowercase letters group together (for example, “apple” and “Apple” sort next to each other). The original spelling of each line is preserved in the output.",
  },
  {
    question: "How are line endings handled?",
    answer:
      "The tool recognizes Windows (CRLF), classic Mac (CR), and Unix (LF) newlines when splitting. The output is joined with single newline characters, which most editors accept. Convert endings in your IDE if a toolchain requires CRLF only.",
  },
  {
    question: "Why does random order not update as I type?",
    answer:
      "Random shuffle is intentionally stable while you edit so the list does not jump on every keystroke. After you change the input, use “Shuffle again” to re-randomize from the current text.",
  },
  {
    question: "How is sorting by length different from alphabetical sort?",
    answer:
      "Length sorts order lines by character count (Unicode code units), using alphabetical order as a tie-breaker when two lines have the same length. Leading and trailing spaces count toward length unless you trim in another tool first.",
  },
  {
    question: "Can I remove duplicate lines after sorting?",
    answer:
      "Yes. Use our duplicate line remover on the sorted output if you need unique rows while preserving whichever line the remover keeps as the first occurrence.",
  },
  {
    question: "Which related text tools pair well with line sorting?",
    answer:
      "Normalize spacing with the whitespace remover, compare two sorted exports with the text diff checker, dedupe with the duplicate line remover, and convert between cases with the text case converter—all listed under Text & String Tools on the home page.",
  },
];
