export const openGraphPreviewFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What is Open Graph and why does my link preview matter?",
    answer:
      "Open Graph is a set of meta tags (for example og:title, og:description, og:image) that many social networks and messengers read when someone shares a URL. A clear title, compelling description, and correctly sized image improve click-through from Facebook, LinkedIn, Slack, iMessage link previews, and other platforms that honor these tags.",
  },
  {
    question: "How do I use this Open Graph preview tool?",
    answer:
      "Paste any public http or https URL (with or without the scheme) and run the preview. We fetch the HTML from our servers, parse Open Graph and Twitter Card tags, and show a share-style card plus the raw fields we detected. Use it before publishing blog posts, launch pages, or pitch decks that will be shared as links.",
  },
  {
    question: "Is this the same preview Facebook or LinkedIn will show?",
    answer:
      "It is a faithful read of the same meta tags those platforms use, but each network may cache images, crop aspect ratios differently, or apply their own templates. Treat this preview as a strong signal that your tags are present and sensible—then spot-check the live share in each network you care about after major content changes.",
  },
  {
    question: "Why is my og:image missing or broken in the preview?",
    answer:
      "Common causes include a relative image path without a resolvable base URL, blocked hotlinking, HTTP image URLs on an HTTPS page, very large files, or tags injected only client-side after JavaScript runs. Our checker sees the initial HTML response only; if your CMS fills tags in the browser, crawlers may also miss them—prefer server-rendered meta tags.",
  },
  {
    question: "Do you support Twitter Card tags?",
    answer:
      "Yes. We read twitter:card, twitter:title, twitter:description, twitter:image, and twitter:image:src when present. For the combined preview we prefer Open Graph values first, then fall back to Twitter tags, then to the document title and meta name=\"description\".",
  },
  {
    question: "What URLs are allowed?",
    answer:
      "Only public http and https addresses that resolve to non-private IPs, same as our other website tools. URLs with credentials, localhost, and internal hostnames are blocked to reduce abuse and SSRF risk.",
  },
  {
    question: "How does this relate to SEO?",
    answer:
      "Open Graph does not replace ranking signals, but it shapes how your page looks when shared— which affects traffic and brand perception. Pair tag checks with canonical URLs, clean redirects, and accurate page titles. Our HTTP header checker, redirect chain checker, and meta-oriented utilities on the home page complement this workflow.",
  },
];
