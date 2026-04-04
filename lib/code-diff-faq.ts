export const codeDiffFaqItems: { question: string; answer: string }[] = [
  {
    question: "What does this code diff checker do?",
    answer:
      "Paste an original and a revised code block to see a line-by-line comparison. Unchanged lines appear in both columns, removed lines highlight on the left, and new lines highlight on the right—similar to a focused pull-request view. All comparison runs locally in your browser.",
  },
  {
    question: "Is my source code uploaded to your servers?",
    answer:
      "No. The diff is computed with JavaScript in your tab only. Nothing you paste is sent to our backend unless you use another tool on this site that explicitly performs network requests.",
  },
  {
    question: "Why do my diffs look noisy when I only reordered lines?",
    answer:
      "This tool uses a line-based longest-common-subsequence alignment. Reordering can show many deletions and insertions even when the text is the same, because order matters. For reorder-heavy edits, use your Git client or a semantic diff tool; use this page for quick paste-and-compare reviews.",
  },
  {
    question: "Is there a maximum file size?",
    answer:
      "Each side is limited to roughly two thousand lines to keep memory and rendering responsive in the browser. For very large repositories, compare slices (one function or file at a time) or rely on git diff locally.",
  },
  {
    question: "Does this understand syntax inside a line?",
    answer:
      "No. Comparison is line-based, not character- or token-based. A single-character change on a long line marks that line as removed and added as a whole. For fine-grained regex or string work, pair this with the regex tester and debugger in our developer tools catalog.",
  },
  {
    question: "How is this different from git diff or my IDE?",
    answer:
      "Git and editors integrate with version control, hunks, merges, and blame. This page is a fast, install-free scratchpad when you have two snippets from a ticket, email, or log—no repository required. For formatted JSON or YAML configs, you may still want the JSON formatter or YAML to JSON converter before diffing.",
  },
  {
    question: "Can I compare JSON, YAML, or Markdown?",
    answer:
      "Yes, as plain text. Normalize formatting first if you care about whitespace: use the JSON formatter, XML formatter, SQL formatter, or Markdown to HTML converter where applicable, then paste both versions here for a cleaner diff.",
  },
  {
    question: "Which related tools should I use next?",
    answer:
      "Pretty-print payloads with the JSON formatter and validator, clean markup with the HTML formatter and minifier, test patterns with the regex tester, decode tokens with the JWT decoder, and browse the full code and developer tools section on the home page for encoders, hash tools, and more.",
  },
];
