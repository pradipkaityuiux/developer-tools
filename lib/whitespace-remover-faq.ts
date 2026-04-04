export const whitespaceRemoverFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What does the online whitespace remover do?",
    answer:
      "It cleans pasted text in your browser: you can trim the whole document, trim every line, collapse runs of spaces and tabs into a single space within each line, and either keep blank lines, collapse consecutive empty lines to one, or remove all empty lines. The goal is to fix copy from PDFs, spreadsheets, and chat so it fits web forms, CSV imports, and code snippets without invisible padding.",
  },
  {
    question: "Is my text sent to your servers?",
    answer:
      "No. Processing uses JavaScript in your tab only. If you use Upload .txt, the FileReader API reads the file locally; nothing is uploaded to our backend.",
  },
  {
    question: "Does “collapse spaces” change line breaks?",
    answer:
      "No. Line breaks are preserved as separate lines. Collapse only affects horizontal whitespace—ordinary spaces, tabs, and non-breaking spaces—on each line before line breaks are rejoined.",
  },
  {
    question: "When should I trim each line versus the whole document?",
    answer:
      "Document trim removes leading and trailing whitespace from the entire paste after line processing—good for a single blob. Per-line trim removes padding on every row—ideal for lists, CSV-style rows, and log lines where each line came from a table cell or column export.",
  },
  {
    question: "How is this different from a code formatter?",
    answer:
      "This tool is grammar-agnostic: it does not parse JSON, HTML, or CSS. It only adjusts whitespace characters. For language-aware layout, use our JSON formatter, HTML formatter, CSS formatter, or SQL formatter after you have normalized stray spaces here.",
  },
  {
    question: "Will this break indentation in source code?",
    answer:
      "If you enable collapse spaces, leading spaces on a line are collapsed like any other run, which can flatten indentation in code. Turn off collapse for code blocks, or paste into your editor and use format-on-save. For prose and form fields, collapse is usually what you want.",
  },
  {
    question: "How are line endings normalized in the output?",
    answer:
      "Input may use Windows (CRLF), Unix (LF), or classic Mac (CR) newlines. The output uses LF between lines, which most editors accept. If you need CRLF for a specific Windows tool, copy into an editor that can convert line endings.",
  },
  {
    question: "Which other text tools pair well with whitespace cleanup?",
    answer:
      "Remove duplicate rows with the duplicate line remover, sort lists with the line sorter, compare two versions with the text diff checker, standardize letter casing with the text case converter, and count length limits with the word counter—all listed under Text and String Tools on the home page.",
  },
];
