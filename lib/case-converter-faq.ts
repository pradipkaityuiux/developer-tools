export const caseConverterFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is a text case converter?",
    answer:
      "A text case converter rewrites the capitalization and separators in your copy—turning prose or identifiers into UPPERCASE, lowercase, Title Case, camelCase, snake_case, or kebab-case in one step. It is useful for headings, code, env vars, URLs, and CMS fields without retyping.",
  },
  {
    question: "Is my text sent to your servers?",
    answer:
      "No. Conversion runs entirely in your browser with JavaScript. Paste or upload a local .txt file and the content never leaves your device unless you use another tool that explicitly makes network requests.",
  },
  {
    question: "How does camelCase work for pasted strings?",
    answer:
      "The tool splits on spaces, line breaks, hyphens, and underscores, and also inserts boundaries between lowercase-and-uppercase transitions (for example, userID becomes user and id). Tokens are then joined with the first word lowercase and following words capitalized: userId.",
  },
  {
    question: "What is the difference between snake_case and kebab-case?",
    answer:
      "snake_case uses underscores between lowercase words (often in Python, Ruby, and database columns). kebab-case uses hyphens between words (common in URLs, CSS custom properties, and some config keys). Both modes normalize tokens to lowercase.",
  },
  {
    question: "Does Title Case change every letter?",
    answer:
      "Title Case capitalizes the first letter of each sequence of letters and lowercases the rest of that word, including words with apostrophes. Punctuation and numbers outside letter runs are left as-is so sentences and lists stay readable.",
  },
  {
    question: "Can I convert a whole file?",
    answer:
      "Yes. Use Upload .txt to load a plain-text file into the editor, pick the target case, then copy the result. For very large files, your browser may slow down; prefer an editor or script for multi-megabyte logs.",
  },
  {
    question: "Will this break JSON, code, or markdown?",
    answer:
      "Global upper/lowercase and title case will change letters inside strings and keywords, which can break code or data. Use identifier modes (camel, snake, kebab) only on labels or single identifiers, or duplicate your snippet and convert a isolated line. For structured data, use the JSON formatter and validator when you need safe pretty-printing.",
  },
  {
    question: "Which related tools should I use next?",
    answer:
      "For URL segments from titles, use a slug generator when it is available in the Text and String Tools section on the home page. For pattern-based rewrites, use the regex tester and debugger. For HTML-safe strings, use the HTML entity encoder and decoder.",
  },
];
