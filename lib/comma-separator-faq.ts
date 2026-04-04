export const commaSeparatorFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What does the comma separator tool do?",
    answer:
      "It offers two workflows in your browser: Join turns a newline list (one value per line) into a single delimited line—typically comma-separated values (CSV). Split parses delimited text (commas, semicolons, tabs, or pipes) using standard quoted-field rules and prints one value per line. Handy for pasting into spreadsheets, SQL IN lists, tag fields, and APIs.",
  },
  {
    question: "Is my data sent to your servers?",
    answer:
      "No. Everything runs locally with JavaScript. Pasted text and files you upload with the upload control are read on your device only; nothing is transmitted for processing.",
  },
  {
    question: "How does quoted CSV splitting work?",
    answer:
      "Fields wrapped in double quotes can contain commas and newlines. Inside quotes, a doubled quote (\") becomes one literal quote. This matches common CSV exports. If your file is more complex, open it in our CSV viewer and editor for a tabular view, or convert with CSV to JSON before reshaping.",
  },
  {
    question: "Can I use a delimiter other than a comma?",
    answer:
      "Yes. Choose comma, semicolon, tab, pipe, or a single custom character for both join and split. European spreadsheets often use semicolons; tab is common for TSV paste from Excel.",
  },
  {
    question: "When should I enable “Quote fields” on join?",
    answer:
      "Use minimal quoting so only values that contain the delimiter, quotes, or line breaks get wrapped—recommended for real CSV. Use “Always quote” when a downstream system expects every field quoted. For cleaning spaces first, try the whitespace remover, then join here.",
  },
  {
    question: "What does “Blank line between row groups” do in split mode?",
    answer:
      "When your input has multiple delimited rows (multiple lines of CSV), split flattens every cell to its own line. Enabling this option inserts an empty line between the values from one input row and the next, so you can still see where each original row ended.",
  },
  {
    question: "How is this different from Excel “Text to columns”?",
    answer:
      "Excel splits into columns across a sheet; this tool outputs a vertical list in plain text—ideal for building IN ('a','b') clauses, tag lists, or one-email-per-line files. For full tables, use the CSV viewer and editor after you have a proper CSV file.",
  },
  {
    question: "Will empty lines in my list be preserved when joining?",
    answer:
      "By default empty lines become empty fields between delimiters. You can enable “Skip empty lines” to drop them so only non-empty lines are joined—useful after trimming with the duplicate line remover or whitespace tools.",
  },
  {
    question: "Which related tools should I use next?",
    answer:
      "Inspect tabular files with the CSV viewer and editor, convert structures with CSV to JSON or JSON to CSV, dedupe values with the duplicate line remover, normalize casing with the text case converter, and browse more utilities under Text & String Tools on the home page.",
  },
];
