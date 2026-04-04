export const redirectChainCheckerFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What is a redirect chain?",
    answer:
      "A redirect chain is the sequence of HTTP responses you get when you request a URL that does not return content directly. Instead, the server answers with 301, 302, 307, 308, or 303 and a Location header, and the client repeats the request for the next URL until it reaches a final status (often 200) or an error.",
  },
  {
    question: "Why do long redirect chains hurt SEO and performance?",
    answer:
      "Each hop is an extra round trip: more latency, more chances for failure, and more work for crawlers. Search engines prefer direct canonical URLs. Marketing and analytics tags may fire on intermediate URLs, and users on slow networks feel the delay. Fixing chains by pointing links and canonicals at the final URL reduces hops.",
  },
  {
    question: "How is this different from a normal browser visit?",
    answer:
      "We trace the chain from our server using manual redirect handling and record each status and Location. Some sites serve different responses by geography, cookie, or bot detection, so your browser might see a shorter or longer path. Use this tool as a strong technical signal, then verify in Search Console or server logs when needed.",
  },
  {
    question: "What do 301 vs 302 vs 307 vs 308 mean?",
    answer:
      "301 and 308 are permanent redirects; 302 and 307 are temporary. 303 is often used after POST to send the client to a GET resource. For SEO, permanent moves should use 301 or 308 so link equity consolidates on the target. Temporary redirects tell crawlers the original URL may return.",
  },
  {
    question: "Can this tool follow JavaScript or meta refresh redirects?",
    answer:
      "No. We only follow HTTP Location-based redirects returned by the server. Client-side router redirects, HTML meta refresh, and some CDN edge logic will not appear as extra hops here. For those, test in a browser or use your framework and hosting dashboards.",
  },
  {
    question: "Is there a limit on how many hops you will trace?",
    answer:
      "Yes. We cap the number of redirects to keep the service fast and to avoid runaway loops. If you hit the limit, shorten the chain at the source (DNS, CDN, or application redirects) or fix circular rules.",
  },
  {
    question: "Why might I see an error even though the site works for me?",
    answer:
      "Timeouts, bot protection, geo rules, or TLS differences can affect automated requests. Private networks, auth walls, and non-public hostnames are blocked for safety. If a URL is valid for the public web, retry once; otherwise check headers and status with our HTTP header checker and response code checker.",
  },
  {
    question: "How do I fix an unnecessary redirect chain?",
    answer:
      "Update internal links, sitemap entries, and canonical tags to point at the final URL. On the server or CDN, collapse multiple rules into one redirect where possible. After HTTPS and www consolidation, ensure a single hop from old marketing URLs to the canonical destination.",
  },
  {
    question: "Does HTTP vs HTTPS affect the chain?",
    answer:
      "Yes. Many sites redirect HTTP to HTTPS, or apex to www, or both. It is common to see two or more hops if rules are layered across DNS, CDN, and app servers. The goal is usually one redirect from any legacy entry point to the canonical HTTPS URL.",
  },
];
