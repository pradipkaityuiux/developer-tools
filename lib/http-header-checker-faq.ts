export const httpHeaderCheckerFaqItems: { question: string; answer: string }[] =
  [
    {
      question: "What does this HTTP header checker do?",
      answer:
        "You enter a public http(s) URL. Our server requests that URL (following redirects safely), then returns the final HTTP status and a table of response header names and values—ideal for debugging cache, security, CORS, and content-type issues.",
    },
    {
      question: "Does it follow redirects?",
      answer:
        "Yes. We resolve redirects up to a fixed hop limit and show headers from the final response, plus the final URL after hops. For a hop-by-hop trail, use our redirect chain checker alongside this tool.",
    },
    {
      question: "Why might headers differ from my browser DevTools?",
      answer:
        "Servers often vary headers by user-agent, geography, cookies, HTTP version, and whether the request used GET versus HEAD. Some CDNs also send different cache directives to bots versus browsers. Treat this output as one real-world probe from our infrastructure.",
    },
    {
      question: "Do you use GET or HEAD?",
      answer:
        "We try HEAD first to avoid downloading large bodies. If the origin rejects HEAD (for example 405 Method Not Allowed), we fall back to a minimal GET with a tiny Range request when supported.",
    },
    {
      question: "Which security headers should I look for?",
      answer:
        "Common signals include Strict-Transport-Security (HSTS), Content-Security-Policy (CSP), X-Content-Type-Options, X-Frame-Options or frame-ancestors, Referrer-Policy, and Permissions-Policy. Presence and quality depend on your threat model—use this checker to verify what you actually emit in production.",
    },
    {
      question: "Can I check headers for localhost or private IPs?",
      answer:
        "No. For safety, we only allow public http(s) URLs whose hostnames resolve to non-private addresses—similar to our other website probes.",
    },
    {
      question: "How is this useful for SEO?",
      answer:
        "Headers influence crawling and indexing indirectly: canonical signals can appear as Link headers, x-robots-tag can affect indexing, redirects and cache headers affect freshness, and TLS/HSTS affect trust. Pair header review with our meta tag extractor and response code checker for a fuller on-page picture.",
    },
    {
      question: "Will this expose secret cookies or tokens?",
      answer:
        "You only inspect headers returned to our unauthenticated server request. Do not paste URLs that embed secrets in query strings. If a site sets HttpOnly cookies, you may see Set-Cookie names at a high level—never share those values publicly.",
    },
  ];
