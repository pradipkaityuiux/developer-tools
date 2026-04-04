export const urlExtractorFaqItems: { question: string; answer: string }[] = [
  {
    question: "What kinds of URLs does this extractor find?",
    answer:
      "By default it finds absolute http and https links in pasted text or markup. Optional modes add bare www.example.com hosts (normalized to https:// in the results) and href attribute values from HTML fragments so you can harvest anchors from saved pages or CMS exports.",
  },
  {
    question: "Is my pasted content sent to your servers?",
    answer:
      "No. Matching and deduplication run entirely in your browser with JavaScript. Upload uses the File API locally; nothing is transmitted unless you navigate to another tool that explicitly performs network requests.",
  },
  {
    question: "Why might a URL be missing a trailing slash or query string?",
    answer:
      "The scanner captures contiguous characters that look like URLs and trims common trailing punctuation such as periods, commas, and closing parentheses that often wrap links in prose. If a publisher breaks a URL across lines without a delimiter, the second line may not match—paste prejoined text or enable href extraction when working from HTML.",
  },
  {
    question: "How does deduplication work?",
    answer:
      "URLs are deduplicated by exact string match after trimming trailing punctuation wrappers. Two spellings that resolve to the same resource but differ in casing or encoding may both appear; normalize them manually if your CMS requires a canonical form. For slug and casing cleanup, pair this page with the text case converter and slug generator in the Text and String Tools section.",
  },
  {
    question: "Can I extract links from minified HTML or JSON?",
    answer:
      "Yes when the http(s) sequence stays on one line and is not split by escape sequences your paste removes. For large automated crawls, use a dedicated crawler or sitemap pipeline; this tool is optimized for quick audits, content migrations, and one-off inventories from clipboard data.",
  },
  {
    question: "Does this validate that URLs return HTTP 200?",
    answer:
      "No. It only parses text. After you build a list, spot-check critical destinations with a redirect chain checker or browser devtools. Our website tools section includes redirect and SSL helpers when you need live response metadata.",
  },
  {
    question: "Which related tools pair well with a URL list?",
    answer:
      "Use the find and replace tool to normalize prefixes, the duplicate line remover to collapse sorted lists, the word counter when you need a quick tally of lines, and the diff checker when comparing two exports from different crawl dates—all available from the home catalog under Text and String Tools.",
  },
];
