export const openapiViewerFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is an OpenAPI or Swagger viewer?",
    answer:
      "An OpenAPI viewer reads an API description file—usually OpenAPI 3.x (formerly Swagger) in YAML or JSON—and presents paths, HTTP methods, parameters, request bodies, responses, and reusable schemas in a structured layout. It helps you review contracts, onboard teammates, and sanity-check documentation without installing desktop tools.",
  },
  {
    question: "Is my OpenAPI document uploaded to your servers?",
    answer:
      "No. Parsing and rendering run entirely in your browser. The specification stays in your tab unless you navigate away or use other tools on this site that intentionally call external APIs.",
  },
  {
    question: "Does this support Swagger 2.0 and OpenAPI 3.x?",
    answer:
      "Yes. The tool detects Swagger 2.0 via the swagger: \"2.0\" field and OpenAPI 3.x via an openapi field starting with 3. Paths, operations, and schema maps (definitions for Swagger 2, components.schemas for OpenAPI 3) are shown accordingly.",
  },
  {
    question: "Can I load a file instead of pasting?",
    answer:
      "Use Upload to pick a .yaml, .yml, or .json file from disk. The contents appear in the editor so you can parse and browse the same way as pasted text.",
  },
  {
    question: "How are $ref pointers handled?",
    answer:
      "Internal JSON Pointer references that start with #/ are resolved when you open path items that use $ref, and when displaying schema bodies. External URL references are not fetched for privacy and network reasons—those remain as raw $ref strings in the JSON view.",
  },
  {
    question: "Why does parsing fail on my YAML?",
    answer:
      "Common issues include mixed tabs and spaces, duplicate keys, or YAML anchors your parser in another tool accepted but js-yaml flags. JSON mode must be valid JSON (double quotes, no trailing commas). Fix syntax using the reported error, or validate the file in your editor first.",
  },
  {
    question: "How is this different from Swagger UI?",
    answer:
      "Swagger UI focuses on interactive try-it-out calls against servers. This viewer is read-only documentation navigation: quick structure, parameters, and schema inspection in the browser—ideal for review and learning. For live HTTP testing, pair it with our HTTP Request Builder when you are ready to send real requests.",
  },
  {
    question: "Can I copy parts of the spec?",
    answer:
      "Use Copy on the input to copy the full raw document. In the detail panel, copy JSON for the selected operation or schema to paste into tickets, Slack, or other tools.",
  },
];
