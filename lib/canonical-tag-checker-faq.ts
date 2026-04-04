export const canonicalTagCheckerFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What is a canonical tag in SEO?",
    answer:
      "A canonical tag is an HTML link element with rel=\"canonical\" and an href that tells search engines which URL you consider the primary version of a page when similar or duplicate URLs exist (tracking parameters, print views, HTTP vs HTTPS, or regional copies). It reduces duplicate-content confusion and helps consolidate ranking signals toward one address.",
  },
  {
    question: "How does this canonical URL checker work?",
    answer:
      "You enter a public HTTP or HTTPS URL. Our server fetches the document, follows safe server-side redirects within limits, reads the response body, and parses all link elements whose rel attribute includes canonical. Each href is resolved to an absolute URL so you can compare it with the final URL after redirects.",
  },
  {
    question: "Is a self-referencing canonical tag good practice?",
    answer:
      "Yes. Many SEO workflows recommend a self-referencing canonical on every indexable page—the canonical href matches the preferred URL of that page. It makes the preferred URL explicit even when there are no obvious duplicates and aligns with how audits and crawlers expect markup to look.",
  },
  {
    question: "What if I see multiple canonical tags on one page?",
    answer:
      "Multiple canonical declarations in the same document are ambiguous. Crawlers may ignore extras or behave inconsistently. Fix the template so only one canonical link appears in the head, and remove duplicates injected by plugins, A/B tools, or tag managers.",
  },
  {
    question: "Why would the canonical differ from the URL in my browser?",
    answer:
      "Server redirects (HTTP to HTTPS, apex to www, trailing slash rules) change the final URL. The canonical might intentionally point to the consolidated URL. If it points somewhere unexpected, check CMS settings, hreflang bundles, and CDN or edge HTML rewrites.",
  },
  {
    question: "Does this tool execute JavaScript or only raw HTML?",
    answer:
      "We parse the HTML returned by the initial server response after redirects. If your canonical is injected only after JavaScript runs (some SPAs), our result may not match what a browser or a JS-enabled crawler sees. Use your framework’s view-source or server-rendered output to verify.",
  },
  {
    question: "Can I use canonical tags across different domains?",
    answer:
      "Yes, cross-domain canonicals are valid when you syndicate or republish content and want one primary domain. Use them carefully: the target should truly be the preferred version, and conflicting signals (noindex on the canonical target, or mismatched hreflang) can confuse search engines.",
  },
  {
    question: "How is this different from the meta tags extractor?",
    answer:
      "This page focuses on canonical link tags, self-reference checks, and duplicate canonical detection. A broader meta tags extractor pulls titles, descriptions, Open Graph, and Twitter tags in one pass. Use both when you are doing a full on-page SEO review.",
  },
  {
    question: "Are private or internal URLs supported?",
    answer:
      "No. For safety, only public http and https URLs that resolve to non-private IP addresses are allowed—similar to our other website fetch tools. Intranet, localhost, and credential URLs are blocked.",
  },
];
