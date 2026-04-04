export const sqlFormatterFaqItems: { question: string; answer: string }[] = [
  {
    question: "What does this online SQL formatter do?",
    answer:
      "It pretty-prints SQL in your browser: consistent indentation, line breaks, and optional keyword casing so SELECT, FROM, WHERE, JOIN, and subqueries are easy to scan. Pick a dialect so comments, dollar-quoted strings, and vendor-specific syntax are handled more predictably than with a naive text wrap.",
  },
  {
    question: "Is my SQL sent to your servers?",
    answer:
      "No. Formatting runs entirely in your browser using an open-source formatter. Your queries never leave the tab, which makes the tool suitable for staging snippets and anonymized samples as long as you still follow your own security policies for secrets in connection strings or literals.",
  },
  {
    question: "Which SQL dialect should I choose?",
    answer:
      "Match the engine you run against: PostgreSQL for Postgres and compatible warehouses, MySQL or MariaDB for those ecosystems, SQLite for apps and local dev, Transact-SQL for Microsoft SQL Server, PL/SQL for Oracle-style blocks, BigQuery or Snowflake for cloud analytics. When unsure, generic SQL mode is a reasonable default for simple SELECT statements.",
  },
  {
    question: "Will formatting change the meaning of my query?",
    answer:
      "Only whitespace and letter case of keywords and identifiers change—never numeric literals or string contents. You should still run the formatted SQL in a non-production database or transaction when the query performs writes, because typos you paste in are preserved.",
  },
  {
    question: "Why does formatting fail on my query?",
    answer:
      "The formatter expects text that mostly looks like SQL. Unclosed quotes, mixed-in shell or log prefixes, or heavy procedural code in an unsupported dialect can confuse the lexer. Trim surrounding noise, try another dialect, or split very large scripts into smaller statements.",
  },
  {
    question: "How is this different from my IDE formatter?",
    answer:
      "IDE formatters are tied to your project and often use the same libraries under the hood. This page is a zero-install option for sharing readable SQL in tickets, docs, and pull request descriptions when you only have a browser.",
  },
  {
    question: "Can I minify SQL here?",
    answer:
      "This tool focuses on readability. Minified one-line SQL is harder to review and can obscure mistakes. If you need smaller payloads for rare edge cases, use your driver or a dedicated pipeline—most databases do not require minified SQL for performance.",
  },
  {
    question: "Does uppercase keywords help performance?",
    answer:
      "No. Engines parse SQL regardless of keyword case. Uppercase is a human convention for scanning and code review, not an optimization.",
  },
];
