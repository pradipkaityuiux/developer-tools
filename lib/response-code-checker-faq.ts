export const responseCodeCheckerFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What is an HTTP status code?",
    answer:
      "An HTTP status code is a three-digit number the server returns with a response, such as 200 OK, 301 Moved Permanently, 404 Not Found, or 500 Internal Server Error. It tells clients and crawlers whether a request succeeded, was redirected, failed because of the client, or failed on the server.",
  },
  {
    question: "Does this checker follow redirects?",
    answer:
      "Yes. We request your URL with manual redirect handling and record each hop until we reach a non-redirect response or hit safety limits. The prominent result is the final status after redirects—the same end state most browsers and many crawlers observe when they follow Location-based HTTP redirects.",
  },
  {
    question: "How is this different from the redirect chain checker?",
    answer:
      "Both tools use the same underlying trace. The response code checker emphasizes the final HTTP status, a short interpretation, and quick validation for SEO and QA. The redirect chain checker is optimized for auditing every hop, Location headers, and long chains in detail.",
  },
  {
    question: "Why might my status differ from what I see in a browser?",
    answer:
      "Geography, cookies, login state, bot protection, A/B splits, and JavaScript-rendered routing can change what you see locally. This tool performs server-side HTTP requests without your session. Use it as a technical baseline, then verify in your hosting logs, CDN dashboards, or Search Console when results disagree.",
  },
  {
    question: "What do 301 vs 302 mean for SEO?",
    answer:
      "301 and 308 signal a permanent move; search engines typically consolidate signals toward the target URL. 302 and 307 signal a temporary move; the original URL may return, so equity may not consolidate the same way. For durable URL changes, prefer permanent redirects and update internal links to the final URL.",
  },
  {
    question: "What does a 404 or 410 mean?",
    answer:
      "404 means the server could not find a resource for that URL. 410 Gone means the resource was intentionally removed and is not coming back. Both are client errors (4xx). For retired content, 410 can be clearer than 404 when appropriate; fix broken inbound links and sitemap entries either way.",
  },
  {
    question: "Why am I seeing 403 Forbidden?",
    answer:
      "403 usually means the server understood the request but refuses to serve it—IP rules, WAF blocks, missing auth, or bot mitigation are common causes. Our requests use a fixed user agent and no cookies. If production users should see 200, adjust firewall or CDN rules and retest.",
  },
  {
    question: "What does 5xx mean?",
    answer:
      "5xx codes indicate server-side failures: for example 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, or 504 Gateway Timeout. They are not caused by the checker itself; they reflect origin or upstream health, overload, or misconfiguration that you should fix in infrastructure or application logs.",
  },
  {
    question: "Can I check private or localhost URLs?",
    answer:
      "No. For SSRF safety we only allow public http/https URLs whose hostnames resolve to non-private addresses. Use local curl or browser devtools on your own machine for internal endpoints.",
  },
  {
    question: "Which HTTP method do you use?",
    answer:
      "We use GET with manual redirects so each hop is recorded reliably. Some APIs behave differently for HEAD; if you need header-level detail on the final response, use our HTTP header checker after you know the final URL.",
  },
];
