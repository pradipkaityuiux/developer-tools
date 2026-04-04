export const hreflangGeneratorFaqItems: { question: string; answer: string }[] =
  [
    {
      question: "What are hreflang tags used for?",
      answer:
        "Hreflang annotations tell search engines which URL is the best match for users in a given language or region. They help Google and others connect equivalent pages across locales, reduce duplicate-content confusion, and surface the correct version in search results. They work alongside canonical tags and server-side redirects—not as a replacement for them.",
    },
    {
      question: "Do I paste the same hreflang block on every page in the cluster?",
      answer:
        "Yes. Each URL in a multilingual set should list every alternate—including itself—using the same link elements. That reciprocal linking is what search engines expect. If one page omits an alternate, signals can be weaker or inconsistent.",
    },
    {
      question: "What is x-default and do I need it?",
      answer:
        "x-default indicates the fallback page when no other hreflang matches the user’s language or region—often a language selector, your main English site, or a global landing page. Google recommends it when you have multiple localized versions. It is not required by the HTML spec, but it is a best practice for international SEO.",
    },
    {
      question: "Does this tool send my URLs to your servers?",
      answer:
        "No. Rows and generated HTML are processed entirely in your browser. Copy uses the clipboard API locally. Upload reads files with the File API in your tab—nothing is uploaded to us.",
    },
    {
      question: "Can I use relative URLs in hreflang href attributes?",
      answer:
        "Google’s documentation examples use absolute URLs, and that is the safe default for international setups. Relative URLs can be ambiguous across hosts and protocols. This generator accepts relative-looking input and normalizes to an absolute URL for validation; prefer full https:// URLs in production.",
    },
    {
      question: "How do hreflang and canonical tags work together?",
      answer:
        "Each localized page should canonicalize to itself (self-referencing canonical) while hreflang points across language versions. Conflicts—for example a canonical pointing to another locale while hreflang claims alternates—can confuse crawlers. After publishing, audit with a redirect checker and canonical tag checker.",
    },
    {
      question: "What about XML sitemaps and hreflang?",
      answer:
        "You can declare hreflang in the HTML head, in HTTP headers, or in XML sitemaps—or combinations. Sitemaps help large sites avoid bloated HTML; HTML link tags are easy for developers to copy from this tool. Use the XML sitemap generator here if you also need a crawlable sitemap for Search Console.",
    },
    {
      question: "Why am I seeing duplicate or missing hreflang warnings?",
      answer:
        "Each hreflang value must be unique in a cluster. Duplicate language-region codes are merged to the last row with a warning. If you omit x-default, you will see an informational reminder—add it when you have a sensible fallback URL.",
    },
  ];
