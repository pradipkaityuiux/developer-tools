export const dummyDataGeneratorFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What is a dummy data generator used for?",
    answer:
      "Teams generate fake names, emails, and addresses to populate forms, Storybook stories, API mocks, database fixtures, and load tests without exposing real customer data. JSON and CSV exports slot into seed scripts, spreadsheets, and contract tests.",
  },
  {
    question: "Is this fake data safe for production databases?",
    answer:
      "No. These values are synthetic examples for development and QA only. They are not verified identities, deliverable email addresses, or legally compliant stand-ins for PII in every jurisdiction. Use production-grade data policies and anonymization for real user-like records.",
  },
  {
    question: "Does my data leave the browser?",
    answer:
      "No. Rows are built entirely in your tab with the Web Crypto API for randomness. Nothing is uploaded to our servers unless you navigate to another tool that explicitly performs network requests.",
  },
  {
    question: "How do I match columns from an existing CSV or schema?",
    answer:
      "Use Upload columns to load a header row or a newline-separated list. The tool guesses types from header text (for example “email”, “phone”, “city”). For full control, pick standard fields with checkboxes and add extra column names in the text area.",
  },
  {
    question: "Can I get reproducible rows every time I click generate?",
    answer:
      "Each run uses fresh random values. For deterministic fixtures, generate once, copy or download the file, and commit it to your repo—or use a seeded library in your backend tests. Our UUID generator is a better fit when you only need stable identifier strings.",
  },
  {
    question: "JSON vs CSV—which should I choose?",
    answer:
      "Choose JSON when your tests, mocks, or APIs expect objects or arrays. Choose CSV when you are importing into Excel, Google Sheets, or legacy importers. You can convert between tabular formats later with the JSON to CSV and CSV to JSON tools on the home page.",
  },
  {
    question: "Are emails and phone numbers valid?",
    answer:
      "They look realistic but use test domains (for example example.com and .test TLDs where used) and synthetic phone patterns. Do not send marketing or SMS to generated numbers; use your provider’s sandbox modes instead.",
  },
  {
    question: "Which other tools pair well with dummy datasets?",
    answer:
      "Validate JSON payloads with the JSON formatter and validator, convert exports with JSON to CSV or CSV to JSON, generate opaque IDs with the UUID generator, and hash stable snapshots with the hash generator—all listed under code and developer tools.",
  },
];
