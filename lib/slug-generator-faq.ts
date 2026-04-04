export const slugGeneratorFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is a URL slug and why use a slug generator?",
    answer:
      "A slug is the human-readable, URL-safe part of a path—usually lowercase words separated by hyphens, like my-blog-post. Generators turn long titles into consistent segments for blogs, product pages, and API routes so links stay readable, shareable, and easier to audit in analytics.",
  },
  {
    question: "Is my title or list sent to your servers?",
    answer:
      "No. The tool runs entirely in your browser. Paste text or upload a small text file locally; slugs are computed with JavaScript on your device. Nothing is uploaded unless you use another page that explicitly performs network requests.",
  },
  {
    question: "How does this tool handle accents and special characters?",
    answer:
      "It normalizes Unicode with NFD, strips combining marks (so letters like é often become e), lowercases the result, replaces sequences of non-letter, non-number characters with a single hyphen, and trims leading or trailing hyphens. Very strict ASCII-only pipelines may still want a custom transliteration map.",
  },
  {
    question: "What is the difference between single slug and one slug per line?",
    answer:
      "Single slug joins all non-empty lines with spaces and produces one slug—useful when a title wrapped across lines should become one path segment. Per line slugifies each non-empty row separately, which helps when batching CMS imports, redirect maps, or CSV columns of titles.",
  },
  {
    question: "Why is my slug empty after conversion?",
    answer:
      "If the input has no letters or numbers after normalization—only symbols, emoji, or punctuation—the segment becomes empty and is skipped in per-line mode or returns blank in single mode. Add alphanumeric words or adjust the source title.",
  },
  {
    question: "Does a slug generator replace SEO keyword research?",
    answer:
      "No. Slugs support clarity and consistency; rankings depend on content quality, intent, internal links, and technical health. After choosing slugs, validate length and duplicates in your CMS, and use our word counter or meta-related tools if you are also tuning titles and descriptions.",
  },
  {
    question: "How is this different from kebab-case in a case converter?",
    answer:
      "A case converter tokenizes identifiers and words into kebab-case for code or labels. This slug generator is tuned for URL paths: Unicode normalization, stripping accents, aggressive replacement of punctuation, and optional one-slug-per-line batching. Use both together when you normalize variable names and public URLs.",
  },
];
