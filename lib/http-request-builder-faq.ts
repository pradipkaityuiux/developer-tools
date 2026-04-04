export const httpRequestBuilderFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What is this HTTP request builder for?",
    answer:
      "It is a browser-based client to compose REST and HTTP calls: choose the method (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS), add headers and a body, then send the request with the Fetch API and inspect status, timing, response headers, and body. Use it to debug APIs, reproduce support tickets, and document examples without installing Postman or curl.",
  },
  {
    question: "Are my URLs, headers, and bodies sent to your servers?",
    answer:
      "No. Requests are initiated from your browser directly to the target URL you enter. This site does not proxy your traffic unless you use a separate backend or tunnel. Only you and the destination server participate in the HTTP exchange (subject to browser security rules such as CORS).",
  },
  {
    question: "Why do I see a CORS or “Failed to fetch” error?",
    answer:
      "Browsers block cross-origin responses unless the API sends Access-Control-Allow-Origin (and related CORS headers) that permit your origin. Public APIs often enable CORS for browsers; private or legacy APIs may not. If fetch fails with a network error, test the same URL from a server-side client, curl, or your API gateway, or ask the API owner to whitelist your origin.",
  },
  {
    question: "Does this replace Postman, Insomnia, or curl?",
    answer:
      "It complements them. This tool is ideal for quick checks, sharing repro steps with teammates, and staying inside one tab. Desktop clients offer collections, OAuth helpers, and environments; curl is best for scripts and CI. Copy the generated curl command from this page when you need a portable snippet.",
  },
  {
    question: "How do I send JSON in the request body?",
    answer:
      "Choose JSON under Request body, paste a valid JSON object or array, and send. If you do not set Content-Type manually, the tool sets application/json automatically. Validate payloads first with our JSON formatter when you are unsure about commas or quotes.",
  },
  {
    question: "What is the difference between raw body and JSON mode?",
    answer:
      "JSON mode expects a JSON document and sets Content-Type to application/json when missing. Raw mode sends the textarea exactly as typed—use it for plain text, XML, NDJSON, or custom formats—and you should set Content-Type yourself (for example application/xml or text/plain).",
  },
  {
    question: "When should I enable “Include credentials”?",
    answer:
      "Turn it on when the target API relies on cookies (session auth) or HTTP authentication in the same site context and the server allows credentials in CORS (Access-Control-Allow-Credentials: true with a specific origin). For most third-party public APIs you keep credentials omitted to avoid accidental cookie leakage.",
  },
  {
    question: "Which related tools on this site should I use next?",
    answer:
      "Pretty-print responses with the API response formatter, look up status meanings in the HTTP status code reference, generate Content-Type values with the MIME type lookup, format JSON with the JSON formatter, and explore OpenAPI specs with the OpenAPI viewer—all linked from the API developer toolbox section.",
  },
];
