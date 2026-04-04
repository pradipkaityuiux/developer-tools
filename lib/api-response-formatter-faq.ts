export const apiResponseFormatterFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What is an API response formatter used for?",
    answer:
      "It helps you inspect payloads returned by REST, GraphQL, SOAP, and webhook endpoints. Paste raw JSON or XML from curl, browser devtools, or log files to pretty-print, validate structure, and browse nested data in a collapsible tree—without uploading your response to a server.",
  },
  {
    question: "Does this tool send my API responses to your backend?",
    answer:
      "No. Parsing, formatting, and the tree view run entirely in your browser with JavaScript. Data stays on your machine unless you copy it elsewhere yourself.",
  },
  {
    question: "How do I know whether my paste is JSON or XML?",
    answer:
      "Leave the mode on Auto: responses that start with “<” are treated as XML (including declarations like <?xml). Responses that start with “{” or “[” are parsed as JSON. If JSON parsing fails, the tool tries XML so you can recover from minor framing issues.",
  },
  {
    question: "Why does valid-looking text fail as JSON?",
    answer:
      "JSON requires double-quoted keys and strings, no trailing commas, and no comments. Single quotes, trailing commas, or JavaScript-only values like undefined will cause JSON.parse to fail—fix the source or use a dedicated JSON formatter to spot the exact position.",
  },
  {
    question: "Why does my XML fail to parse?",
    answer:
      "Browsers use a strict XML parser: unclosed tags, mismatched namespaces, illegal characters in text nodes, or multiple root elements will error. Check the parser message, validate against your schema offline, and ensure entities like & are written as &amp; inside elements.",
  },
  {
    question: "Can I minify responses for storage or logs?",
    answer:
      "Yes. Use Minify to remove whitespace from JSON or XML after a successful parse. Minified output is smaller for archives and queues; use pretty-print when you need readable diffs or screenshots.",
  },
  {
    question: "How is this different from a JSON-only formatter?",
    answer:
      "This page targets mixed API workflows: the same textarea accepts JSON and XML, which matters when you switch between REST/JSON and SOAP/XML services or inspect webhooks that may send either. For deep JSON-only editing you can also use the standalone JSON formatter linked from this page.",
  },
  {
    question: "Which related tools pair with this formatter?",
    answer:
      "Use the HTTP request builder to reproduce calls, the JWT decoder for bearer tokens inside JSON payloads, the XML formatter for XSD-heavy editing, and the JSON formatter when you only work with JavaScript object notation—each is linked from the guides below.",
  },
];
