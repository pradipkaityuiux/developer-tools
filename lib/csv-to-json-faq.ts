export const csvToJsonFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is CSV to JSON conversion?",
    answer:
      "CSV (comma-separated values) stores tables as plain text: one row per line and fields split by a delimiter, often a comma. JSON expresses structured data with objects and arrays. Converting CSV to JSON turns each row into a JSON object (when you use a header row) or into nested arrays, so you can paste the result into APIs, configuration, databases, or JavaScript code.",
  },
  {
    question: "Does this tool upload my CSV to a server?",
    answer:
      "No. Parsing and JSON generation run entirely in your browser. You can paste text or load a file locally; nothing is sent to our backend for conversion. For other in-browser data utilities, see our JSON formatter and JSON-to-CSV converter in the Code & Developer Tools section.",
  },
  {
    question: "How does header-aware typing work?",
    answer:
      "When the first row is treated as a header, each column name becomes a key on every JSON object. With typing enabled, cells that look like integers, decimals, true/false, or empty strings are converted to numbers, booleans, or null so your JSON matches what many REST APIs expect. Values that are clearly text stay as strings.",
  },
  {
    question: "Which delimiters are supported?",
    answer:
      "You can choose comma, semicolon, tab, or pipe—or leave delimiter on Auto so the tool inspects the first lines and picks the most consistent separator. European exports often use semicolons; TSV files use tabs.",
  },
  {
    question: "What if my CSV has commas inside quoted fields?",
    answer:
      "Quoted fields follow common CSV rules: text between double quotes can include commas, and a double quote inside a field is escaped as two double quotes. The parser handles these cases so columns do not shift.",
  },
  {
    question: "Can I get an array of arrays instead of objects?",
    answer:
      "Yes. Choose the output shape “Array of arrays” when you want [[\"h1\",\"h2\"],[\"a\",\"b\"]] without turning the header row into keys—useful for charting libraries or pipelines that expect matrix-shaped data.",
  },
  {
    question: "Why are duplicate column headers renamed?",
    answer:
      "JSON object keys must be unique. If your CSV repeats the same header twice, the tool keeps the first key as-is and appends _2, _3, and so on to later duplicates so the output stays valid JSON.",
  },
  {
    question: "How is this different from JSON to CSV?",
    answer:
      "JSON to CSV flattens structured JSON (often an array of objects) into a spreadsheet-friendly table. CSV to JSON is the inverse: it starts from flat tabular text and produces hierarchical JSON. Use whichever direction matches your import or export step.",
  },
];
