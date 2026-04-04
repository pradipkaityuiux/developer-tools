export const textDiffCheckerFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is a text diff checker used for?",
    answer:
      "A text diff checker shows what changed between two plain-text versions—line by line. Teams use it for marketing copy, legal clauses, policy drafts, email threads, and CMS exports when they need a fast before-and-after without opening a full document suite.",
  },
  {
    question: "Is my text uploaded to your servers?",
    answer:
      "No. Comparison runs entirely in your browser with JavaScript. Nothing you paste or load from a local file is sent to our backend unless you use another page on this site that explicitly makes network requests.",
  },
  {
    question: "How is this different from the code diff checker?",
    answer:
      "Both use the same line-based comparison engine. The Text Diff Checker is framed for prose, policies, and content workflows, while the developer-oriented code diff page emphasizes snippets, configs, and PR-style reviews. Pick whichever page matches your mental model.",
  },
  {
    question: "Why does one edited word show a whole line as removed and added?",
    answer:
      "The tool compares whole lines, not individual words or characters. A small change in a long paragraph still replaces that entire line in the alignment. For word-level swaps across a document, use a find-and-replace workflow or specialized prose diff software.",
  },
  {
    question: "Can I load files instead of pasting?",
    answer:
      "Yes. Use the upload control beside each panel to load a UTF-8 text file (for example .txt). The file is read locally in your browser and fills that side only.",
  },
  {
    question: "What does “Copy unified diff” produce?",
    answer:
      "It copies a plain-text patch-style block: unchanged lines are prefixed with a space, removed lines with a minus, and added lines with a plus—handy for tickets, comments, or archival notes alongside the visual side-by-side view.",
  },
  {
    question: "Is there a size limit?",
    answer:
      "Each side is limited to about two thousand lines so the page stays responsive. Split very long documents into sections, or rely on Git or a desktop compare tool for entire books or huge logs.",
  },
  {
    question: "Will reordering paragraphs look noisy?",
    answer:
      "Often yes. Line order matters to the alignment algorithm, so moving blocks can appear as many deletions and insertions even when the sentences are identical. Reorder-aware tools exist elsewhere; this page is optimized for quick paste-and-compare of two fixed versions.",
  },
];
