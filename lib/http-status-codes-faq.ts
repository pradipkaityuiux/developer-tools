export const httpStatusCodesFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is an HTTP status code?",
    answer:
      "An HTTP status code is a three-digit number returned with an HTTP response. It tells clients, browsers, APIs, and crawlers whether a request succeeded, was redirected, failed because of the client (4xx), or failed on the server (5xx). It appears in the status line alongside a short reason phrase such as “200 OK” or “404 Not Found.”",
  },
  {
    question: "What do the first digits 1–5 mean in HTTP status codes?",
    answer:
      "The hundreds digit groups responses: 1xx informational (progress), 2xx success, 3xx redirection (further action or a different URI), 4xx client errors (bad input, auth, or policy), and 5xx server errors (origin or upstream failure). The reference table on this page follows that structure so you can filter and learn by class.",
  },
  {
    question: "Is a 301 redirect better than a 302 for SEO?",
    answer:
      "For permanent URL moves, use a permanent redirect (301 or 308). Search engines typically consolidate ranking signals to the destination. Temporary redirects (302 or 307) signal that the original URL may return, so equity may not consolidate the same way. Always update internal links to the final URL to avoid unnecessary redirect chains.",
  },
  {
    question: "What is the difference between 401 Unauthorized and 403 Forbidden?",
    answer:
      "401 means authentication failed or is missing—you may need a token, API key, or login. 403 means the server understood who you are but still refuses the request due to authorization rules, IP policy, or similar. Some APIs misuse these codes; your own services should document them consistently.",
  },
  {
    question: "When should I use 404 versus 410 Gone?",
    answer:
      "Use 404 when a resource is missing or unknown—typos, removed pages, or never-existent paths. Use 410 when a resource was intentionally removed and will not return, which can be clearer to crawlers for permanently retired content. Fix inbound links and sitemap entries in both cases.",
  },
  {
    question: "Why do I see 502 Bad Gateway or 504 Gateway Timeout?",
    answer:
      "Both come from a proxy or edge in front of your app. 502 means the proxy got an invalid or unusable response from upstream (crash, TLS error, protocol mismatch). 504 means upstream was too slow and the proxy gave up waiting. Inspect load balancer health checks, keep-alive pools, database latency, and upstream timeouts—not the client.",
  },
  {
    question: "What does 429 Too Many Requests mean for APIs?",
    answer:
      "The server or API gateway is rate limiting you to protect capacity or enforce fair use. Retry with exponential backoff and honor Retry-After when present. Reduce concurrency, cache responses where allowed, or request a higher quota if your traffic is legitimate.",
  },
  {
    question: "How can I check status codes for a live URL?",
    answer:
      "Use our free HTTP status code checker to GET a public URL and read the final status after redirects. For every hop in a chain, use the redirect chain checker. For response headers on the final URL, use the HTTP header checker—all linked from this page.",
  },
  {
    question: "Does this reference cover every registered HTTP status code?",
    answer:
      "This page focuses on the codes developers encounter most often in APIs, CDNs, and web servers, with plain-English meanings and remediation tips. Rare or extension-specific codes may be added over time; consult IANA’s HTTP Status Code Registry for the authoritative full list.",
  },
  {
    question: "Is my search and filter data sent to your servers?",
    answer:
      "No. Filtering, search, copy, and log import run entirely in your browser. Uploaded files are read locally with the File API and are not uploaded to our infrastructure.",
  },
];
