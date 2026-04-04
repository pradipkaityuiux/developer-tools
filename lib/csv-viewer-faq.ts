export const csvViewerFaqItems: { question: string; answer: string }[] = [
  {
    question: "What does this online CSV viewer and editor do?",
    answer:
      "You paste or upload comma- or tab-separated text and see it as a table with sortable columns, a quick filter across all cells, and inline cell editing. You can copy or download the result as CSV again—all processing happens in your browser.",
  },
  {
    question: "Is my spreadsheet data uploaded to a server?",
    answer:
      "No. Parsing, sorting, filtering, and export run entirely in your tab using JavaScript. Files you choose are read with the File API locally; nothing is sent to our servers unless another page on this site explicitly makes a network request.",
  },
  {
    question: "Which delimiters are supported?",
    answer:
      "You can choose Auto-detect (recommended for typical exports), or force comma, semicolon, tab, or pipe. Auto mode scores the first lines of your file the same way as our other CSV tools so semicolon CSV from Europe and tab-separated files both work.",
  },
  {
    question: "How does sorting work with a header row?",
    answer:
      "When “First row is header” is on, the first row stays at the top as column labels and only body rows are sorted when you click a column header. When it is off, every row is treated as data and participates in sorting.",
  },
  {
    question: "Does filtering delete rows from my file?",
    answer:
      "Filtering only changes what you see in the table so you can focus on matching rows. The full dataset remains in memory until you export. Use “Export filtered rows only” when you want a smaller CSV that matches the current filter.",
  },
  {
    question: "Why do some cells show extra quotes in the raw text but not in the table?",
    answer:
      "RFC 4180 CSV wraps fields that contain commas, quotes, or newlines in double quotes and doubles internal quotes. The parser strips those wrappers for display; export adds them back when needed so the file stays valid.",
  },
  {
    question: "Can I open very large CSV files?",
    answer:
      "The tool is meant for typical developer and office-sized sheets. Huge files may make the tab slow because every cell renders as an input. For multi-gigabyte logs, prefer command-line tools or a dedicated desktop spreadsheet.",
  },
  {
    question: "How is this different from the CSV to JSON converter?",
    answer:
      "The CSV to JSON tool turns rows into JSON arrays or objects for APIs and scripts. This viewer is for visually scanning, light edits, sorting, and filtering before you copy CSV again—pair them when you need both JSON and spreadsheet workflows.",
  },
  {
    question: "Can I remove duplicate rows here?",
    answer:
      "This page focuses on viewing and light editing. For deduplication by selected columns, use our dedicated CSV deduplicator tool linked from the article section below.",
  },
];
