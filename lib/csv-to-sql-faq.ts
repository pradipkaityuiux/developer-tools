export const csvToSqlFaqItems: { question: string; answer: string }[] = [
  {
    question: "What does a CSV to SQL converter do?",
    answer:
      "It reads tabular text (comma-, tab-, semicolon-, or pipe-separated) and prints INSERT INTO … VALUES statements you can run in PostgreSQL, MySQL, SQL Server, SQLite, or paste into migration scripts. The first row can be treated as column names so each following row becomes one database row.",
  },
  {
    question: "Is my CSV uploaded to your servers?",
    answer:
      "No. Parsing and SQL generation run entirely in your browser using JavaScript. Use this for customer lists, product feeds, or staging data without sending files through a third-party API. For viewing data before converting, try our CSV viewer and editor in the File & Data Tools section.",
  },
  {
    question: "Which SQL dialect should I choose?",
    answer:
      "Pick ANSI (double-quoted identifiers) for PostgreSQL and SQLite. Choose MySQL for backtick-quoted tables and columns. Choose SQL Server for bracket identifiers. String values always use single quotes with standard SQL escaping (apostrophes doubled). If your engine rejects quoted identifiers, create the table with matching names or adjust quotes manually.",
  },
  {
    question: "What is the difference between one INSERT per row and batched VALUES?",
    answer:
      "One row per statement is easy to read, diff in version control, and retry line-by-line. Batched INSERTs group many rows into a single statement with multiple value tuples, which is often faster on the server for large imports. Use a moderate batch size if your database has a max packet or query length limit.",
  },
  {
    question: "How does smart typing affect SQL output?",
    answer:
      "When typing is on, empty cells become NULL, integers and decimals become unquoted numbers, and true/false (case-insensitive) become TRUE/FALSE. Everything else stays a quoted string. Turn typing off if every column must be inserted as text (for example before you cast in SQL).",
  },
  {
    question: "Can I use this for database seeding and migrations?",
    answer:
      "Yes. Developers often export a seed spreadsheet to CSV, generate INSERTs, and paste them into seed.sql or a migration folder. Pair the result with our SQL formatter to pretty-print before committing. For JSON-first workflows, use CSV to JSON or JSON to CSV from the Code & Developer Tools section.",
  },
  {
    question: "How are duplicate column headers handled?",
    answer:
      "Duplicate header labels are renamed to name, name_2, name_3, and so on so every column identifier is unique, matching how our CSV to JSON tool builds object keys.",
  },
  {
    question: "What if my CSV has commas inside quoted fields?",
    answer:
      "The parser follows common CSV rules: fields wrapped in double quotes can contain commas, and a quote inside a field is escaped as two double quotes. This keeps columns aligned so INSERT column order matches your file.",
  },
];
