export const schemaGeneratorFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is schema markup and why use JSON-LD?",
    answer:
      "Schema markup is structured vocabulary from Schema.org that describes entities on a page—articles, products, FAQs, reviews, and more. JSON-LD is the recommended format for Google: you embed a JSON object in a script tag with type application/ld+json so crawlers can read entities without changing visible HTML.",
  },
  {
    question: "Does this tool send my content to your servers?",
    answer:
      "No. All fields are merged into JSON-LD in your browser. Copy and download use local APIs. Upload reads a file with the File API in your tab only—nothing is uploaded to us for processing.",
  },
  {
    question: "How do I add the output to my site?",
    answer:
      "Paste the JSON inside a script tag: <script type=\"application/ld+json\">{ ... }</script>—usually in the page head or before closing body. Use one JSON object per script, or combine multiple entities in a @graph array under a single @context if you prefer one block.",
  },
  {
    question: "Will schema guarantee rich results?",
    answer:
      "No. Structured data is eligibility, not a promise. Google selects rich results based on quality, policies, and query context. Always validate with Rich Results Test and monitor Search Console enhancements reports.",
  },
  {
    question: "What is the difference between Article, BlogPosting, and NewsArticle?",
    answer:
      "They share many properties. BlogPosting extends Article for blogs; NewsArticle is for news with stricter publisher expectations. Pick the type that best matches your content and editorial standards.",
  },
  {
    question: "How do FAQ rich results relate to on-page FAQs?",
    answer:
      "FAQPage markup should reflect content that is visibly present on the page. Do not create FAQ markup solely for search if users cannot see the same questions and answers—this violates spam policies.",
  },
  {
    question: "Which tools pair with schema and on-page SEO checks?",
    answer:
      "Use the meta title and description checker for snippets, the Open Graph tag generator for social cards, the XML sitemap generator for discovery, and the robots.txt generator for crawl rules. Together they cover technical SEO around your structured data.",
  },
  {
    question: "Can I merge Product and Review markup?",
    answer:
      "Yes. A common pattern is Product with nested review properties or separate Review entities that reference the product URL. This generator outputs one block at a time—combine objects carefully or use @graph in a single script after export.",
  },
];
