export const htmlFormatterFaqItems: { question: string; answer: string }[] = [
  {
    question: "What does this HTML formatter and minifier do?",
    answer:
      "Paste HTML markup to beautify it with consistent indentation for reading and code review, or minify it by stripping extra whitespace and HTML comments while keeping content inside pre, script, style, and textarea intact. A sandboxed preview shows how the browser renders your output without running scripts.",
  },
  {
    question: "Is my HTML sent to a server?",
    answer:
      "No. Formatting, minification, and preview all run in your browser using the DOMParser API. Nothing is uploaded for this step, which makes it suitable for snippets and templates you prefer to keep local.",
  },
  {
    question: "Will formatting change my document structure?",
    answer:
      "The browser parser may normalize malformed markup (for example by closing tags or moving elements per HTML parsing rules). That is the same behavior you get when a page loads in a browser. Treat the tool as a helper for readable output, not a guaranteed byte-preserving pretty printer for invalid HTML.",
  },
  {
    question: "How is minification different from a production CDN minifier?",
    answer:
      "This minifier removes comments and collapses whitespace between tags and in text nodes, with exceptions for preserved elements. It does not rename classes, shorten attributes, or apply advanced tree-shaking. For production builds, keep using your bundler or a dedicated HTML pipeline.",
  },
  {
    question: "Why does the preview look different from my editor?",
    answer:
      "The preview uses a sandboxed iframe with scripts disabled for safety. Browser default styles apply unless your markup includes its own CSS. Embedded styles in style tags still apply; external stylesheets may not load the same way depending on network and sandbox rules.",
  },
  {
    question: "Can I format a full page versus a fragment?",
    answer:
      "Yes. If your paste starts with a DOCTYPE or an html element, the tool formats the whole document including the html wrapper. Otherwise it formats the fragment inside the synthetic body the parser creates, so you see only your snippet without forcing a full document shell.",
  },
  {
    question: "Does this validate HTML?",
    answer:
      "It does not perform a separate validation pass with detailed errors like an XML validator. Parsing errors are absorbed by the HTML parser. For strict structure checks, pair this with an XML workflow or our XML formatter and validator when your content is XHTML-shaped.",
  },
  {
    question: "How do I move from HTML to Markdown or back?",
    answer:
      "Use our HTML to Markdown converter when you need docs-friendly text, and the Markdown to HTML converter when you are authoring in Markdown but need publishable markup. This formatter is best when you already have HTML and want layout or size adjustments only.",
  },
];
