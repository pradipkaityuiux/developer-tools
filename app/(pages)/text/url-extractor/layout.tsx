import type { Metadata } from "next";
import type { ReactNode } from "react";
import { urlExtractorFaqItems } from "@/lib/url-extractor-faq";

export const metadata: Metadata = {
  title:
    "URL extractor online — pull http(s) links from text or HTML (free, private)",
  description:
    "Free URL extractor: paste logs, emails, or HTML to list every http(s) link, optionally read href attributes and bare www hosts, dedupe results, copy as newline or CSV-style lists—runs entirely in your browser for SEO audits, migrations, and inventories.",
  keywords: [
    "URL extractor",
    "extract URLs from text",
    "link extractor",
    "parse URLs from HTML",
    "href extractor",
    "find all links in text",
    "URL list tool",
    "backlink inventory",
    "content migration links",
    "online URL parser",
  ],
  openGraph: {
    title: "URL extractor — links from text or HTML (client-side)",
    description:
      "Paste or upload blobs of text; collect deduplicated http(s) URLs with optional www and href scanning—copy-ready output, no server upload.",
  },
};

const PAGE_PATH = "/text/url-extractor";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function UrlExtractorLayout({ children }: { children: ReactNode }) {
  const origin = siteOrigin();
  const pageUrl = origin ? `${origin}${PAGE_PATH}` : PAGE_PATH;
  const homeUrl = origin ? `${origin}/` : "/";

  const webAppSchema = {
    "@type": "WebApplication",
    "@id": `${pageUrl}#webapp`,
    name: "URL extractor from text and HTML",
    url: pageUrl,
    description:
      "Browser-based URL extractor that scans pasted text or uploads for http(s) URLs, optional href attribute harvesting, optional bare www hosts normalized to https, deduplicated ordered output, and copy to clipboard—no content sent to servers.",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript.",
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
        name: "URL extractor",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: urlExtractorFaqItems.map((item) => ({
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
    name: "How to extract URLs from pasted text or HTML",
    description:
      "Paste or upload source text, toggle href and www options, review the deduplicated list, choose newline or comma output, and copy into spreadsheets or tickets.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Add source text",
        text: "Paste from an email thread, log file, browser view-source window, or CMS export. Alternatively click Upload file to read a local .txt, .html, .md, or .log file with the File API in your tab.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose extraction options",
        text: "Enable Scan href attributes when you need anchor targets from HTML fragments. Enable Bare www hosts when prose references domains without a scheme so results normalize to https://.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy or refine the list",
        text: "Switch between one URL per line or comma-separated output, then use Copy URLs to paste into Sheets, Notion, or crawlers. Chain with find-and-replace or duplicate removal tools if you need further cleanup.",
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
