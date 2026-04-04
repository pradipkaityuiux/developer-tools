import type { Metadata } from "next";
import { brokenLinkCheckerFaqItems } from "@/lib/broken-link-checker-faq";

export const metadata: Metadata = {
  title: "Broken link checker — find dead & 404 outbound links",
  description:
    "Free broken link checker: paste any public page URL, extract anchor hrefs, and verify HTTP status for each outbound link. Ideal for SEO audits, QA, and fixing dead links fast.",
  keywords: [
    "broken link checker",
    "dead link checker",
    "404 link checker",
    "outbound link checker",
    "website link scanner",
    "find broken links",
    "SEO link audit",
    "href checker",
    "link validation tool",
  ],
  openGraph: {
    title: "Broken link checker — scan pages for dead links",
    description:
      "Audit outbound links on any public HTML page. See which URLs return errors, redirects, or success — built for SEO and developer QA.",
  },
};

const PAGE_PATH = "/website/broken-link-checker";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function BrokenLinkCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const origin = siteOrigin();
  const pageUrl = origin ? `${origin}${PAGE_PATH}` : PAGE_PATH;
  const homeUrl = origin ? `${origin}/` : "/";

  const webAppSchema = {
    "@type": "WebApplication",
    "@id": `${pageUrl}#webapp`,
    name: "Broken link checker",
    url: pageUrl,
    description:
      "Free online tool to scan a public HTML page for anchor links and verify HTTP status codes for outbound URLs—find 404s and errors for SEO and QA.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Requires HTML.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Broken link checker",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: brokenLinkCheckerFaqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const howToSchema = {
    "@type": "HowTo",
    "@id": `${pageUrl}#howto`,
    name: "How to scan a page for broken outbound links",
    description:
      "Use the broken link checker to fetch a public web page, extract hyperlinks from the HTML, and review HTTP response status for each outbound URL.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Open the checker and paste a page URL",
        text: "Copy the full HTTPS (or HTTP) address of the HTML page you want to audit—such as a blog post, docs page, or landing page—and paste it into the Page URL field.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Run the scan",
        text: "Click Check links. The tool fetches the page from the public web, parses anchor href attributes, resolves relative URLs against the final document URL, and requests each distinct outbound link (up to the per-scan limit).",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Review results and fix broken links",
        text: "Read the table: each row shows the original href, the resolved target URL, and the HTTP status (or skip reason). Prioritize fixing links that show client or server errors, then re-run the scan to confirm.",
      },
    ],
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [webAppSchema, breadcrumbSchema, faqSchema, howToSchema],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {children}
    </>
  );
}
