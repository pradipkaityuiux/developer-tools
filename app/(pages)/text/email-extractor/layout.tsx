import type { Metadata } from "next";
import { emailExtractorFaqItems } from "@/lib/email-extractor-faq";

export const metadata: Metadata = {
  title:
    "Free email extractor online — pull addresses from text & HTML, dedupe, copy",
  description:
    "Extract email addresses from pasted text or HTML: finds mailto links and visible addresses, deduplicates case-insensitively, export one per line or comma-separated. Upload .txt/.html, copy results—runs in your browser for outreach prep and audits.",
  keywords: [
    "email extractor",
    "extract emails from text",
    "email finder from HTML",
    "dedupe email list",
    "mailto scraper",
    "parse emails online",
    "email address extractor",
    "copy email list",
    "outreach list builder",
    "privacy email parser",
  ],
  openGraph: {
    title: "Email extractor — from text & HTML, deduplicated (free)",
    description:
      "Paste or upload content; get a unique email list with newline, comma, or semicolon export. Client-side only.",
  },
};

const PAGE_PATH = "/text/email-extractor";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function EmailExtractorLayout({
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
    name: "Email address extractor",
    url: pageUrl,
    description:
      "Free browser-based email extractor: scan pasted text or HTML for addresses including mailto links, deduplicate case-insensitively, format as newline, comma, or semicolon separated lists, upload local files, copy output—no server-side content processing.",
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
        name: "Email extractor",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: emailExtractorFaqItems.map((item) => ({
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
    name: "How to extract email addresses from text or HTML",
    description:
      "Paste or upload content, review the deduplicated list, choose an export format, and copy addresses for spreadsheets or CRM fields.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Add source content",
        text: "Paste from an email thread, CRM export, or web page source, or click Upload file to load .txt, .html, or similar plain-text formats. Optional sample text demonstrates HTML and mailto handling.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Review unique addresses",
        text: "The tool lists every detected address once, ignoring case when deduplicating. Toggle alphabetical sort if you need a stable A–Z ordering for reviews.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Choose format and copy",
        text: "Pick newline, comma, or semicolon separation to match your destination form, then use Copy list to place the block on the clipboard.",
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
