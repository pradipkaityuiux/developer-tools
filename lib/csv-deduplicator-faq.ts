export const csvDeduplicatorFaqItems: { question: string; answer: string }[] =
  [
    {
      question: "What does CSV deduplication mean?",
      answer:
        "Deduplication removes extra rows that match on the columns you care about. For example, if two rows share the same email address but differ in a notes column, you can select only the email column so one row is kept and the other is dropped. The tool preserves your header row and outputs a clean CSV you can import into CRMs, ESPs, or databases.",
    },
    {
      question: "Does this tool upload my CSV to a server?",
      answer:
        "No. Parsing, duplicate detection, and export run entirely in your browser. Files stay on your device, which is important for mailing lists, customer data, and unreleased product feeds. For other local file workflows, see our CSV viewer and CSV to SQL tools in the File & Data Tools section.",
    },
    {
      question: "Should I keep the first or the last duplicate row?",
      answer:
        "Keep first is typical for newsletter lists and lead imports when the earliest subscription or signup row is authoritative. Keep last is useful when later rows contain corrected phone numbers, updated SKUs, or refreshed timestamps and you want the newest values to win. You can switch modes without re-uploading the file.",
    },
    {
      question: "What is “trim values when comparing”?",
      answer:
        "When enabled, leading and trailing spaces are ignored when building the duplicate key. That way email@example.com and email@example.com with accidental spaces are treated as the same contact. Turn it off if whitespace is meaningful in your dataset (for example fixed-width codes).",
    },
    {
      question: "Which delimiters are supported?",
      answer:
        "You can use comma, semicolon, tab, or pipe—or leave delimiter on Auto so the tool inspects the first lines and picks the most consistent separator, matching how European CSV exports and TSV files are often saved.",
    },
    {
      question: "How do I dedupe by multiple columns?",
      answer:
        "Check every column that must match for a row to count as a duplicate—such as first name plus last name plus postal code. The tool builds a composite key from all selected columns, so only rows that match on every selected column are collapsed.",
    },
    {
      question: "Can I remove completely identical rows only?",
      answer:
        "Yes. Select all column checkboxes (the default) so the duplicate key includes every field. Rows must match in full to be considered duplicates—useful after merging exports or concatenating spreadsheets.",
    },
    {
      question: "How is this different from the duplicate line remover?",
      answer:
        "The duplicate line remover treats each line as plain text. This tool understands CSV structure: quoted fields, delimiters inside quotes, and column-based keys. Use the text tool for logs or code; use the CSV deduplicator for tabular data and mailing lists.",
    },
  ];
