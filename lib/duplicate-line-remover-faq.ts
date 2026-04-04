export const duplicateLineRemoverFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What does the duplicate line remover do?",
    answer:
      "It reads your text line by line and outputs a new version where repeated lines appear only once. The first occurrence is kept; later copies are dropped. You can match lines in a case-sensitive way or ignore letter casing so that “Hello” and “hello” count as the same line. Everything runs in your browser.",
  },
  {
    question: "Is my text uploaded to a server?",
    answer:
      "No. The tool processes pasted or locally loaded text with JavaScript in your tab only. File upload uses the FileReader API to read bytes on your device; nothing is sent to our backend.",
  },
  {
    question: "Does trimming affect which lines are considered duplicates?",
    answer:
      "Optional trim before comparing removes leading and trailing spaces only for the equality check. If you also enable trim on each kept line, the output uses JavaScript trim() on first occurrences so pasted cells lose surrounding padding—handy after CSV exports.",
  },
  {
    question: "How are line endings handled?",
    answer:
      "Input may use Windows (CRLF), classic Mac (CR), or Unix (LF) newlines. The tool splits on those boundaries and joins the result with newline characters suitable for editing in most modern apps. If you need a specific export format, copy the output into your editor and convert line endings there.",
  },
  {
    question: "Will empty lines be removed?",
    answer:
      "Blank lines are lines too. If the same empty line appears multiple times in a row, duplicates after the first are removed when you dedupe the full document. If you need to collapse all whitespace-only variants, enable trim before comparing so lines that are only spaces match each other.",
  },
  {
    question: "How is this different from sort | uniq?",
    answer:
      "Unix uniq only removes adjacent duplicate lines after sort changes order. This tool removes duplicates globally while preserving the original order of first appearances—better for ordered logs, storyboards, or email lists where sequence matters. For alphabetical lists, use our line sorter first if you want uniq-style workflows.",
  },
  {
    question: "Can I deduplicate CSV or tab-separated columns?",
    answer:
      "Yes if whole rows must be unique. Paste the file as text; each line is one row. If only one column should be unique, use a spreadsheet or our CSV to JSON tool to isolate that column first, then paste the extracted values here.",
  },
  {
    question: "Which related text tools should I try?",
    answer:
      "Sort lines with the line sorter, compare two versions with the text diff checker, normalize spaces with the whitespace remover, and generate URL slugs with the slug generator—all linked from the Text & String Tools section on the home page.",
  },
];
