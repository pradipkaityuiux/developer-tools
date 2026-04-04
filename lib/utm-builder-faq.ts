export const utmBuilderFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What are UTM parameters and why use a UTM link builder?",
    answer:
      "UTM parameters are query-string tags—typically utm_source, utm_medium, utm_campaign, plus optional utm_term and utm_content—that tell analytics tools which campaign, channel, or ad variant sent traffic to a page. A UTM link builder helps you append them consistently, with correct URL encoding, so Google Analytics 4, Adobe Analytics, and other platforms can attribute sessions without manual spreadsheet errors.",
  },
  {
    question: "Which UTM parameters should I always fill in?",
    answer:
      "Most teams require utm_source (who sent the click), utm_medium (the type of traffic, such as email or cpc), and utm_campaign (the initiative or promo name). utm_term is often used for paid search keywords; utm_content differentiates A/B creatives or buttons within the same campaign. Empty optional fields are omitted from the final link to keep URLs shorter.",
  },
  {
    question: "Will UTM tags hurt my SEO or duplicate content?",
    answer:
      "UTM query parameters do not change the page body; they are tracking overlays. Search engines may ignore them for indexing when the content is identical, but marketing URLs with UTMs can still appear in reports and backlinks. Use canonical tags on the destination page when you need a single indexed URL, and avoid creating infinite parameter combinations on crawlable faceted navigation.",
  },
  {
    question: "How do I import an existing tagged URL into this tool?",
    answer:
      "Paste the full URL—including existing utm_* values—into the import field and click Import. We strip standard UTM keys into the form and show a clean base URL so you can edit campaign names or duplicate tracking for a new medium without hand-editing the query string.",
  },
  {
    question: "Is my URL data sent to your servers?",
    answer:
      "No. The UTM link builder runs entirely in your browser: building, copying, and parsing URLs happens locally. Upload reads a file on your device only to extract text for the same client-side workflow.",
  },
  {
    question: "How is this different from Google’s Campaign URL Builder?",
    answer:
      "This tool follows the same UTM naming conventions and produces standards-compliant links you can paste into ads, email, and social posts. It adds quick import from tagged links, file upload for bulk paste workflows, and lives alongside our other SEO and developer utilities for one-stop QA.",
  },
];
