export const htmlToMarkdownFaqItems: { question: string; answer: string }[] = [
  {
    question: "What does this HTML to Markdown converter do?",
    answer:
      "You paste HTML (a fragment or a full document), and the tool outputs GitHub-flavored Markdown: headings, lists, links, images, blockquotes, fenced code blocks, tables, task lists, and strikethrough when present. Conversion runs in your browser so snippets stay on your machine.",
  },
  {
    question: "Is my HTML uploaded to a server?",
    answer:
      "No. Turndown parses your HTML locally in the tab. Nothing is sent to our backend for conversion, which is appropriate for proprietary templates, email HTML, or CMS exports you do not want to share.",
  },
  {
    question: "Will the Markdown match my CMS or static site generator exactly?",
    answer:
      "Markdown allows several equivalent styles (bullet characters, heading syntax, link reference forms). Output follows common GFM conventions; you may still tweak spacing or switch to reference-style links for your pipeline. Pair with our Markdown to HTML converter to round-trip a sample before bulk migration.",
  },
  {
    question: "Why does complex HTML simplify or look different in Markdown?",
    answer:
      "Markdown is intentionally limited: arbitrary div layouts, inline styles, and custom components do not have a single standard Markdown equivalent. Those regions often become plain text or simplified blocks. For rich layouts, keep HTML or use MDX where your toolchain supports it.",
  },
  {
    question: "Can I convert a full page including head and scripts?",
    answer:
      "You can paste a full document; the converter focuses on content-like tags. Script, style, and most metadata in head are typically dropped or reduced because they are not representable as useful Markdown. Strip chrome with our HTML formatter first if you only need the body structure.",
  },
  {
    question: "How do I get cleaner HTML before converting?",
    answer:
      "Run messy markup through our HTML formatter and minifier to normalize indentation and structure, then paste the fragment you care about into this tool. That makes lists and headings easier for the parser to interpret consistently.",
  },
  {
    question: "Does this validate HTML?",
    answer:
      "It uses an HTML parser like the browser: broken tags may be repaired silently. For strict XML-shaped content, use our XML formatter and validator, then convert only the parts that are valid HTML fragments.",
  },
  {
    question: "How do I go from Markdown back to HTML?",
    answer:
      "Use the Markdown to HTML converter on this site for a quick preview and raw markup copy. For production, prefer your framework’s Markdown pipeline so plugins, sanitization, and shortcodes match your app.",
  },
];
