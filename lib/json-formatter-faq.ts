export const jsonFormatterFaqItems: { question: string; answer: string }[] = [
  {
    question: "What does this JSON formatter and validator do?",
    answer:
      "Paste JSON text to validate syntax, pretty-print with indentation, minify to a single line, and explore the structure in a collapsible tree. Everything runs in your browser—ideal for debugging API responses, config files, and log snippets before you commit or deploy.",
  },
  {
    question: "Is my JSON sent to your servers?",
    answer:
      "No. Parsing, formatting, minifying, and the tree view use the browser’s JavaScript engine only. Your payload never leaves this page unless you explicitly copy it elsewhere.",
  },
  {
    question: "Why does JSON.parse fail with a trailing comma?",
    answer:
      "Standard JSON (RFC 8259) does not allow trailing commas after the last property or array element. Remove the extra comma, or temporarily delete it to validate, then fix the source that generated the JSON.",
  },
  {
    question: "How is JSON different from JavaScript object literals?",
    answer:
      "JSON requires double quotes around keys and strings, forbids trailing commas, and does not allow undefined, functions, or comments. If you paste object-literal style code (single quotes, unquoted keys), this tool will report a parse error until you convert it to valid JSON.",
  },
  {
    question: "Does minifying change my data?",
    answer:
      "Minify removes whitespace between tokens. The logical value stays the same for objects, arrays, strings, numbers, booleans, and null. Key order in objects is preserved in modern JavaScript engines when round-tripping through JSON.parse and JSON.stringify.",
  },
  {
    question: "Can I format very large JSON documents?",
    answer:
      "The tool works in the browser, so huge files may slow down the tab or hit memory limits. For multi-megabyte payloads, prefer streaming tools or desktop editors; here, use smaller excerpts or minified samples for day-to-day API debugging.",
  },
  {
    question: "How do I fix 'Unexpected token' errors?",
    answer:
      "Read the error position hint, jump to that offset in your editor, and look for stray characters, smart quotes, missing commas, or unescaped newlines inside strings. Compare with a known-good sample and validate incrementally by removing outer wrappers.",
  },
  {
    question: "Which related tools should I use next?",
    answer:
      "Convert tabular exports with the JSON to CSV converter, move between config formats with JSON to YAML or YAML to JSON, inspect tokens with the JWT decoder, and pair with the XML formatter when you work across API and legacy XML stacks—all linked from this site’s developer tools section.",
  },
];
