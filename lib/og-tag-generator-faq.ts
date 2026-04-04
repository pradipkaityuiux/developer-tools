export const ogTagGeneratorFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What are Open Graph tags used for?",
    answer:
      "Open Graph (OG) meta tags tell Facebook, LinkedIn, Slack, Discord, iMessage, and many other apps how to render a rich link preview—title, description, image, and canonical URL—when someone shares your page. They use the Open Graph protocol, typically with properties like og:title, og:description, og:image, and og:url in your HTML head.",
  },
  {
    question: "How do I use this Open Graph tag generator?",
    answer:
      "Fill in the fields for your page: title, description, absolute image URL, and the URL you want shares to point to. Optionally set site name, locale, type, and Twitter Card fields. Copy the generated meta tags into the <head> of your template or CMS custom HTML. Use Upload HTML to import tags from an existing page for quick edits.",
  },
  {
    question: "Should I use absolute URLs for og:image and og:url?",
    answer:
      "Yes. Platforms fetch og:image from a full https URL. Relative image paths often break previews outside your origin. og:url should be the canonical share destination (often matching your rel=canonical link) so analytics and social graphs consolidate signals on one URL.",
  },
  {
    question: "What is the difference between Open Graph and Twitter Cards?",
    answer:
      "Open Graph is the wider standard many networks read first. Twitter (X) also supports its own twitter:* meta tags—for example twitter:card and twitter:image. This generator can output both. When Twitter title or description are left blank, we mirror your Open Graph title and description so messaging stays consistent.",
  },
  {
    question: "Why add og:image:alt?",
    answer:
      "Alt text describes the share image for screen readers and some clients when the image fails to load. It is a lightweight accessibility improvement and aligns with inclusive marketing QA alongside your visual preview.",
  },
  {
    question: "How does this relate to SEO?",
    answer:
      "Open Graph does not directly replace ranking factors, but it controls how your brand appears in social feeds and messengers, which affects clicks and awareness. Pair strong OG tags with accurate page titles and meta descriptions—try our meta title and description checker—and validate live pages with the Open Graph preview tool after deploy.",
  },
  {
    question: "Can I generate tags for articles or blog posts?",
    answer:
      "Set og:type to article (or enable article metadata) and fill article:published_time and article:modified_time in ISO 8601 format when your CMS exposes them. Add article:author when you publish a profile URL. Keep the rest of your OG fields aligned with the on-page headline and hero image.",
  },
];
