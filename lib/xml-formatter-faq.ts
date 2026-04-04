export const xmlFormatterFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What is the difference between formatting and validating XML?",
    answer:
      "Formatting (pretty-printing) rewrites your document with consistent indentation and line breaks so humans can read hierarchy quickly. Validation checks whether the browser’s XML parser accepts the document as well-formed XML: every tag is closed, attributes are quoted, entities are legal, and there is a single root element. This tool does both in your browser—no upload to our servers.",
  },
  {
    question: "Does this tool check XML against an XSD or DTD schema?",
    answer:
      "No. Well-formedness is enforced by the parser (structure and syntax). Schema validation (XSD, Relax NG, DTD) needs extra rules and often network or local schema files. For configs and APIs, pair this formatter with your stack’s schema tools, or use our JSON and YAML utilities when you convert formats.",
  },
  {
    question: "Why do I see a parser error for HTML?",
    answer:
      "HTML is often not valid XML unless it is XHTML or strictly closed. Self-closing tags, unquoted attributes, or void elements like <br> without XML rules will fail. Use our HTML formatter for markup meant for browsers, and reserve this tool for RSS, SOAP, SVG-as-XML, Android layouts, and other XML-first documents.",
  },
  {
    question: "Will minify change the meaning of my XML?",
    answer:
      "Minify removes non-essential whitespace between tags. Whitespace inside text nodes is preserved. If your application treats boundary whitespace between elements as significant data, review the minified output before deploying. Most data-exchange XML is whitespace-insensitive between elements.",
  },
  {
    question: "Is my XML stored or logged?",
    answer:
      "Processing runs entirely in your browser. Nothing is sent to our API for formatting or validation. Avoid pasting secrets anyway—clipboard and screen sharing are still risks in shared environments.",
  },
  {
    question: "How do namespaces and prefixes appear after formatting?",
    answer:
      "The browser keeps namespace declarations and uses qualified names (prefix:localName) where applicable. Declarations may move relative to hand-written order but stay semantically equivalent for parsing. Always verify critical signed documents (such as some SAML assertions) with your security team if byte order matters.",
  },
  {
    question: "What does structure insight include?",
    answer:
      "After a successful parse we report the document root element name, total element count, approximate maximum depth, and a frequency table of element tag names. That helps you spot unexpected nodes, duplicated wrappers, or oversized trees before diffing or shipping to production.",
  },
];
