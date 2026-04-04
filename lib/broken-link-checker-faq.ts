export const brokenLinkCheckerFaqItems: { question: string; answer: string }[] =
  [
    {
      question: "What does this broken link checker do?",
      answer:
        "You enter a single public web page URL. We fetch that HTML, collect anchor href values, resolve relative URLs, and request each distinct outbound HTTP or HTTPS link so you can see status codes and spot 404s, server errors, and timeouts.",
    },
    {
      question: "Why should I fix broken outbound links?",
      answer:
        "Dead links frustrate readers, reduce trust, and waste crawl budget. Search engines and users both prefer pages that point to live resources. Regular link audits help you catch URL changes after migrations or CMS edits.",
    },
    {
      question: "Does this crawl my entire website?",
      answer:
        "No. This tool analyzes one page at a time—the URL you paste. For a site-wide audit, run it on key templates (home, blog index, top landing pages) or combine it with your XML sitemap workflow and our other URL and SEO utilities.",
    },
    {
      question: "Can it check links behind login or paywalls?",
      answer:
        "Generally no. We fetch the URL without your session cookies, so protected pages may return login walls or errors, and links on those pages might not reflect what a logged-in user sees.",
    },
    {
      question: "Why are some rows marked skipped?",
      answer:
        "mailto:, tel:, javascript:, and pure #fragment anchors are skipped because they are not HTTP downloads. We also cap how many unique URLs we probe per scan to keep the service fast and fair.",
    },
    {
      question: "How accurate is the HTTP status?",
      answer:
        "We use real network requests from our server. Some sites block automated clients, treat HEAD differently from GET, or rate-limit checks—so a link may work in a browser but show an error here, or vice versa. Use results as a strong signal, not absolute proof.",
    },
    {
      question: "What is the difference between internal and external links?",
      answer:
        "Internal links point to the same site (helping discovery and hierarchy); external links point elsewhere (citations, partners, docs). This checker lists both kinds whenever they appear as standard anchor hrefs in the HTML.",
    },
    {
      question: "How often should I run a broken link audit?",
      answer:
        "Many teams spot-check after publishes and run a broader audit monthly or quarterly. After domain migrations, CMS changes, or major content updates, re-scan high-traffic pages first.",
    },
  ];
