export const webhookPayloadTesterFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question:
      "How do I test a webhook without a public URL or request bin?",
    answer:
      "Use this page to paste or upload the raw POST body your integration would send, add the same Content-Type and optional headers you expect in production, then record each sample into a local browser log. That mimics webhook debugging when you cannot expose localhost to Stripe, GitHub, or Slack. For live HTTP calls against a real endpoint, pair the recorded payload with a generic HTTP client or tunneling tool outside this page.",
  },
  {
    question: "Where are my webhook samples stored?",
    answer:
      "Entries you record are saved in your browser’s localStorage under this origin only. They are not uploaded to our servers. Clearing site data or using another browser profile removes the log. Avoid pasting live secrets, production tokens, or personally identifiable information—treat samples like production logs.",
  },
  {
    question: "Can this tool receive webhooks from the internet automatically?",
    answer:
      "No. Browsers cannot accept arbitrary inbound HTTP callbacks without a backend or tunnel. This tool is for offline practice: you paste payloads copied from provider documentation, from your server logs, or from a secure staging tunnel, then organize and replay them locally. To capture traffic from the public internet you still need a reachable HTTPS URL or a forwarding service.",
  },
  {
    question: "How do I validate JSON webhook bodies?",
    answer:
      "Paste the body and use Format JSON when the payload is JSON—invalid syntax is called out before you record. For deeper inspection you can open our JSON formatter in another tab to pretty-print, validate, and explore nested objects without mixing tools on one screen.",
  },
  {
    question: "What is the difference between webhook testing and API testing?",
    answer:
      "API testing usually means you choose the request and assert the response. Webhook testing is event-driven: the provider sends an HTTP POST when something happens, often with signatures and idempotency keys. This tool focuses on the inbound payload shape, headers, and replay workflow rather than issuing outbound API calls.",
  },
  {
    question: "How should I use this with signature verification (HMAC)?",
    answer:
      "Record the raw body exactly as delivered—whitespace and field order can matter for HMAC. Store the signing secret separately in your app or secrets manager; do not paste production secrets into this page. When you implement verification, replay the same raw bytes you logged and compare your computed signature to the provider header.",
  },
];
