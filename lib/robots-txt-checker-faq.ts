export const robotsTxtCheckerFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What is robots.txt and why does it matter for SEO?",
    answer:
      "robots.txt is a plain-text file at the root of a site (for example https://example.com/robots.txt) that gives crawlers hints about which URLs they should or should not fetch. It does not guarantee removal from search results—noindex and canonical signals handle indexing—but a bad robots.txt can block important sections, hide sitemap URLs, or slow audits when teams cannot read the live file quickly.",
  },
  {
    question: "How does this robots.txt checker fetch the file?",
    answer:
      "You enter a site URL or hostname. We normalize it to the site origin and request /robots.txt over the public web, following a limited number of HTTP redirects with the same safety checks as our other website tools. The response status, final URL, and body are shown together with a parsed summary of User-agent groups, Allow/Disallow lines, and Sitemap declarations.",
  },
  {
    question: "Does robots.txt block indexing?",
    answer:
      "Disallow in robots.txt asks crawlers not to fetch URLs; it is not the same as a noindex directive. Pages can still appear in results if linked elsewhere without being crawled. For de-indexing, use meta robots or X-Robots-Tag (and remove conflicting signals) in addition to crawl policy.",
  },
  {
    question: "What is the difference between Allow and Disallow?",
    answer:
      "Both use path-prefix style rules (RFC 9309). Disallow marks paths that should not be crawled; Allow can narrow exceptions, especially for Googlebot. Longer matching rules win when both apply. This tool lists the lines as published so you can compare blocks for * versus specific bots such as Googlebot or Bingbot.",
  },
  {
    question: "Why might this tool show something different from my browser?",
    answer:
      "CDNs, geo routing, A/B splits, and bot management can serve different responses by IP or headers. We use a fixed server-side fetch. If you need to compare headers or final URLs, use our HTTP header checker and redirect chain checker on the same hostname.",
  },
  {
    question: "Can I use a direct link to robots.txt instead of the homepage?",
    answer:
      "Yes. If you paste a full URL to /robots.txt, we fetch that address. If you paste any other path on the site, we still resolve the origin and request /robots.txt at the root, which is where crawlers expect the file.",
  },
  {
    question: "What are common robots.txt mistakes?",
    answer:
      "Accidental Disallow: / for all agents, outdated disallow rules after migrations, conflicting Allow/Disallow order, missing or relative Sitemap URLs, and deploying staging rules to production. After changes, re-fetch with this checker and validate important URLs with the response code checker.",
  },
  {
    question: "Is Crawl-delay supported by Google?",
    answer:
      "Google generally ignores Crawl-delay in robots.txt for Googlebot. Other crawlers may still honor it. We surface Crawl-delay lines when present so you can document legacy or non-Google behavior.",
  },
  {
    question: "Why do I see a 403 or empty body when the site works for me?",
    answer:
      "Some hosts block non-browser or data-center IPs. Timeouts, TLS issues, and WAF rules can also interfere. Retry later, verify DNS with our DNS lookup tool, and check TLS with the SSL certificate checker if failures persist.",
  },
];
