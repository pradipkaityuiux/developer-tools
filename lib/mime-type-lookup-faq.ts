export const mimeTypeLookupFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is a MIME type and why do APIs use Content-Type?",
    answer:
      "A MIME type (also called media type) is a label like application/json or image/png that tells clients and servers what format bytes are in. HTTP uses the Content-Type header so browsers, CDNs, and API gateways can parse bodies correctly, pick parsers, and apply security rules. Upload forms and multipart boundaries also rely on MIME types for each part.",
  },
  {
    question: "Is MIME type determined only by the file extension?",
    answer:
      "No. The extension is a hint—this tool maps common extensions to typical Content-Type values. The operating system, browser, or server may sniff bytes (magic numbers) or use a different registry. Always align with your API contract or framework defaults when they differ from a generic table.",
  },
  {
    question: "Why might my browser report a different type than this lookup?",
    answer:
      "The File API exposes file.type, which is the browser’s guess and can be empty for uncommon extensions. Our table follows widely used mappings for web and API work; your OS clipboard or server nginx mime.types may list another acceptable alias (for example text/javascript versus application/javascript for .js).",
  },
  {
    question: "What MIME type should I use for .ts files?",
    answer:
      "It depends on the bytes: MPEG transport streams often use the .ts extension with video/mp2t. TypeScript source files are frequently served or uploaded with text/typescript in tooling, though conventions vary. If you are packaging video, use video/mp2t; for source code, follow your bundler or API documentation.",
  },
  {
    question: "Can I paste a MIME type to see file extensions?",
    answer:
      "Yes. Enter a type such as application/json or image/svg+xml (parameters like charset are ignored for matching) and the tool lists extensions that map to that type in our catalog. The list is not exhaustive—IANA registers many aliases.",
  },
  {
    question: "Does this tool upload my files to a server?",
    answer:
      "No. File metadata and extension lookup run entirely in your browser. Upload uses the File API locally so you can compare the browser-reported type with the extension-based mapping—nothing is sent to our servers for MIME resolution.",
  },
  {
    question: "How does this relate to OpenAPI or REST documentation?",
    answer:
      "OpenAPI schemas often declare content types per request and response. Use this lookup to double-check extensions against types when you document multipart/form-data or binary payloads, then refine in our OpenAPI viewer or HTTP request builder tools when you test endpoints.",
  },
];
