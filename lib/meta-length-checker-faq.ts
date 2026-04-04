export const metaLengthCheckerFaqItems: { question: string; answer: string }[] =
  [
    {
      question:
        "What is the ideal length for a page title tag for Google search results?",
      answer:
        "There is no fixed character limit because Google measures title width in pixels and may rewrite titles. As a practical rule of thumb, many SEOs aim for roughly 50–60 characters so the primary message stays visible in common desktop layouts. Our checker counts characters and flags likely truncation risk when titles grow past typical ranges.",
    },
    {
      question: "How long should a meta description be?",
      answer:
        "Meta descriptions are also pixel-truncated and can be rewritten. A common planning band is about 120–160 characters: enough room for a benefit, differentiator, and soft call to action. Very short blurbs may look thin in snippets; very long ones are often cut off mid-sentence.",
    },
    {
      question: "Does this tool change how Google indexes my page?",
      answer:
        "No. Everything runs in your browser. We do not submit URLs to search engines or modify your site. Use it to draft and QA copy before you publish in your CMS or static site generator.",
    },
    {
      question: "Why do my live search snippets differ from these counts?",
      answer:
        "Search engines may substitute other on-page text, shorten by pixels, or test alternate titles and descriptions. Mobile and desktop layouts also differ. Treat length checks as editorial guidance, not a guarantee of what users will see.",
    },
    {
      question: "Can I paste HTML instead of typing title and description?",
      answer:
        "Yes. Paste a full HTML document or fragment into the HTML field, or upload a saved .html file. We read the document title, standard meta description, and fall back to Open Graph title and description when classic tags are missing.",
    },
    {
      question: "Is my pasted HTML sent to your servers?",
      answer:
        "No. Parsing and counting happen locally in your browser with the Web APIs available on this page—similar to our other client-side utilities.",
    },
    {
      question: "Should meta title and H1 be identical?",
      answer:
        "They can align on the same topic but need not be word-for-word duplicates. The title often competes for clicks in SERPs while the H1 anchors the on-page experience. Keep both clear, keyword-aware, and human-readable.",
    },
    {
      question: "How does this relate to Open Graph tags?",
      answer:
        "Social platforms often use og:title and og:description for link previews. Search snippets still lean on the HTML title and meta name=\"description\" in many cases. After tuning lengths here, generate matching social tags with our Open Graph tag generator and validate previews when stakes are high.",
    },
  ];
