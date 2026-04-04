export const htmlEntitiesFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is the difference between HTML entities and URL encoding?",
    answer:
      "HTML entities (for example &amp;, &lt;, &#233;) represent characters inside HTML or XML markup so parsers do not treat them as syntax. URL encoding (percent-encoding) escapes bytes for query strings and paths in URIs. Use this page for HTML and CMS snippets; use the site’s URL encoder when you need encodeURIComponent-style percent-encoding for APIs and links.",
  },
  {
    question: "When should I use named entities vs numeric entities?",
    answer:
      "Named entities like &amp; and &quot; are short and readable for the five critical characters in HTML text and attributes. Decimal numeric entities (&#233;) and hexadecimal (&#xE9;) work for any Unicode code point and are handy when a name does not exist or you want a consistent style. This tool uses standard names for &, <, >, quotes, and apostrophe, and optional decimal encoding for non-ASCII when you enable that option.",
  },
  {
    question: "Does encoding HTML entities prevent XSS?",
    answer:
      "Encoding user-controlled data before you insert it into HTML context is an important layer, but it is not a substitute for a content security policy, framework escaping, sanitization when you allow rich HTML, and never using innerHTML with raw user input. Encode entities for display text; use a vetted sanitizer when you must allow markup.",
  },
  {
    question: "Is my text sent to your servers?",
    answer:
      "No. Encoding runs entirely in your browser. Decoding uses the same textarea-based HTML reference parsing your browser provides for entity strings. File upload reads the file locally with FileReader—nothing is uploaded to a backend.",
  },
  {
    question: "Why did decode leave some sequences unchanged?",
    answer:
      "Incomplete references (a lone &), unknown entity names, or malformed numeric values may not decode. The browser’s HTML parser follows standard rules; fix typos like missing semicolons where required, and ensure hex numerics use valid digits after &#x.",
  },
  {
    question: "Will double-encoding be a problem?",
    answer:
      "Yes, if you encode text that already contains entities, ampersands become &amp;amp; and so on. Decode once to plain text, edit, then encode a single time before pasting into your template or CMS. This tool’s swap button helps you chain decode → fix → encode.",
  },
  {
    question: "How do HTML entities relate to JSON or APIs?",
    answer:
      "JSON strings use Unicode and backslash escapes—not HTML entities. If an API returns JSON with entity-encoded strings, decode here for readability, or fix the producer. For inspecting JSON payloads first, use the JSON formatter on this site, then copy field values into this tool when needed.",
  },
  {
    question: "Which related tools should I use with HTML entities?",
    answer:
      "Format markup with the HTML formatter, convert prose with Markdown to HTML or HTML to Markdown, percent-encode URLs with the URL encoder, and review live page tags with the meta tags extractor—all linked from the developer and website tool sections on this site.",
  },
];
