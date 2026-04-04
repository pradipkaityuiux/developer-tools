export const uuidGeneratorFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is a UUID and why use UUID v4?",
    answer:
      "A UUID (Universally Unique Identifier) is a 128-bit label, usually written as eight groups of hex digits with hyphens. Version 4 means the value is random (with standard version and variant bits). Teams use UUID v4 for primary keys, correlation IDs, file names, and API identifiers when you want low collision risk without a central allocator.",
  },
  {
    question: "Are these UUIDs cryptographically secure?",
    answer:
      "This tool uses the browser’s Web Crypto API (crypto.randomUUID or crypto.getRandomValues), which is suitable for general uniqueness and typical app identifiers. For regulated security contexts (e.g. session tokens), follow your platform’s guidance and threat model—UUID v4 alone is not a substitute for proper secret generation where required.",
  },
  {
    question: "Is my data sent to your servers?",
    answer:
      "No. Random bytes and formatting happen entirely in your browser tab. Nothing is uploaded unless you use another page that explicitly makes network requests.",
  },
  {
    question: "Can I generate bulk UUIDs for seed data or migrations?",
    answer:
      "Yes. Set the count, choose output format (standard hyphens, compact without hyphens, or uppercase), then generate and copy. For very large batches or automation, prefer your database’s uuid_generate_random(), NewGuid(), or language libraries in scripts.",
  },
  {
    question: "What is the difference between UUID v4 and v1 or v7?",
    answer:
      "UUID v4 is random. v1 embeds a timestamp and MAC-derived node (privacy concerns in some setups). v7 is time-ordered and newer—useful for database index locality. This page focuses on v4 because it is the most common choice for opaque IDs in APIs and ORMs.",
  },
  {
    question: "Will uppercase UUIDs work the same as lowercase?",
    answer:
      "Yes. The canonical string form is often lowercase, but parsers typically treat hex case-insensitively. Pick uppercase only if your style guide or legacy system requires it.",
  },
  {
    question: "How do I validate a string looks like a UUID?",
    answer:
      "Match the pattern eight-four-four-four-twelve hex digits, or use your language’s UUID parser. You can also prototype a validation regex in our regex tester and debugger, then port it to your backend or database constraint.",
  },
  {
    question: "Which other developer tools pair with UUID generation?",
    answer:
      "Pretty-print JSON API examples with the JSON formatter and validator, convert seed spreadsheets with CSV to JSON, encode binary fields with the Base64 encoder and decoder, and format SQL migrations with the SQL formatter—all available in the code and developer tools section on the home page.",
  },
];
