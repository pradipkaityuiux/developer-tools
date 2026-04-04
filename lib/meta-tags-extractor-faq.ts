export const metaTagsExtractorFaqItems: { question: string; answer: string }[] =
  [
    {
      question: "What does the meta tags extractor show?",
      answer:
        "Paste a public http or https URL and we fetch the HTML (up to a safe size limit), follow redirects, and read the document head. You see the page title, meta description and other common name= tags, rel=canonical when present, Open Graph (og:*) properties, Twitter Card (twitter:*) tags, plus a table of additional meta elements we did not bucket into those groups.",
    },
    {
      question: "Is this the same as what Google or social apps display?",
      answer:
        "It is close for the HTML side: search engines and crawlers read tags in the final HTML after redirects. Live previews can still differ when platforms scrape with different user agents, ignore certain tags, or prefer other signals (structured data, cache). Use our Open Graph preview tool when you want a share-focused check, and always validate in the target platform’s own debugger when stakes are high.",
    },
    {
      question: "Why is my meta description missing?",
      answer:
        "Some sites inject tags only with JavaScript, serve different HTML to bots, or block automated fetches. Others put descriptions only in Open Graph. If og:description exists but name=description does not, we still surface text from Open Graph in the summary when helpful.",
    },
    {
      question: "Can you extract meta tags from pages behind login?",
      answer:
        "No. We only request public URLs over the Internet the same way a normal crawler would. Anything that requires cookies, tokens, or VPN access cannot be read here.",
    },
    {
      question: "Do you support IP addresses or local hostnames?",
      answer:
        "We block private and local addresses after DNS resolution, similar to our other URL tools, to reduce SSRF risk. Use a publicly reachable hostname or CDN URL.",
    },
    {
      question: "What is the difference between Open Graph and Twitter Card tags?",
      answer:
        "Open Graph (og:title, og:image, …) was introduced by Facebook and is widely reused by LinkedIn, Slack, iMessage, and others. Twitter Card tags (twitter:card, twitter:image, …) tune how links look on X (Twitter). Many sites define both; when Twitter tags are absent, X often falls back to Open Graph properties.",
    },
    {
      question: "Why does the final URL differ from what I pasted?",
      answer:
        "We follow HTTP redirects up to a fixed hop limit and show the last URL we landed on. Long chains can affect which canonical or og:url you see. Trace every hop with our redirect chain checker if redirects look suspicious.",
    },
    {
      question: "Are duplicate og:image or multiple title tags handled?",
      answer:
        "HTML allows duplicates; we keep the last matching Open Graph property we encounter in the scanned portion of the document. For title, we use the first reasonable <title>…</title> block in that scan window. Extremely large or unusual markup can still produce edge cases.",
    },
    {
      question: "How should I use canonical tags for SEO?",
      answer:
        "Canonical link elements tell search engines which URL is preferred when duplicates exist (tracking parameters, HTTP vs HTTPS, www vs apex). They are hints, not guarantees. Pair this extractor with our dedicated canonical tag checker when you need a focused audit.",
    },
    {
      question: "Do you store the URLs I analyze?",
      answer:
        "The tool does not show a personal history of past extractions. Like most hosted sites, infrastructure providers may log HTTP requests for reliability and abuse prevention according to their own policies.",
    },
  ];
