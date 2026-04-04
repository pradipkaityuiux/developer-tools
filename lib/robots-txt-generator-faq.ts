export const robotsTxtGeneratorFaqItems: { question: string; answer: string }[] =
  [
    {
      question: "What is robots.txt and where does it live?",
      answer:
        "robots.txt is a plain-text file at the root of your site (for example https://example.com/robots.txt) that tells compliant crawlers which URL paths they may fetch. It is part of the Robots Exclusion Protocol (REP). It does not enforce security—private URLs must be protected with authentication or noindex signals.",
    },
    {
      question: "Does this robots.txt generator upload anything to your servers?",
      answer:
        "No. Rules are assembled and previewed entirely in your browser. Copy, download, and upload use local APIs only; uploading reads the file in your tab so you can edit or merge it with the preview.",
    },
    {
      question: "What is the difference between Allow and Disallow?",
      answer:
        "Both use URL path prefix matching. Disallow blocks matching paths; Allow can create exceptions when a broader Disallow exists. The most specific rule wins when multiple rules match. An empty Disallow value means “no paths disallowed” for that user-agent group, which effectively allows crawling unless another line blocks.",
    },
    {
      question: "How many User-agent groups should I use?",
      answer:
        "Use one group per bot or family you want to treat differently—for example Googlebot versus all other crawlers (*). Keep the file readable: duplicate rules across groups only when policies truly differ. Order matters from top to bottom within a group for matching, and crawlers pick the group that matches their user-agent name.",
    },
    {
      question: "Should I add Crawl-delay?",
      answer:
        "Google ignores Crawl-delay in robots.txt. Bing may honor crawl-delay directives in some contexts. Use it only if you have verified a bot reads it and you need to reduce load; otherwise prefer server-side rate limiting or Search Console crawl settings for Google.",
    },
    {
      question: "Where should Sitemap lines go?",
      answer:
        "You can list one or more Sitemap directives pointing to XML sitemap URLs. They are often placed at the end of the file but are valid anywhere. Ensure URLs are absolute (https://…) and return 200 with valid XML.",
    },
    {
      question: "Will robots.txt remove pages from Google’s index?",
      answer:
        "Blocking a URL in robots.txt prevents crawling, not necessarily indexing—Google may still show a URL with limited snippet if it finds links. To remove or prevent indexing, use noindex, authentication, or URL removal tools alongside robots rules.",
    },
    {
      question: "How do I test my file before launch?",
      answer:
        "Use Google Search Console’s robots.txt Tester (legacy in some views) or fetch the live URL after deploy. You can also paste rules into a checker workflow and compare with your XML sitemap and canonical strategy.",
    },
    {
      question: "Can I block AI crawlers?",
      answer:
        "Some crawlers expose dedicated user-agents (for example GPTBot). Add a User-agent group for that name with Disallow rules if the bot honors robots.txt. Policies change—confirm the vendor’s current user-agent string and documentation.",
    },
  ];
