import type { Metadata } from "next";
import { duplicateLineRemoverFaqItems } from "@/lib/duplicate-line-remover-faq";

export const metadata: Metadata = {
  title:
    "Duplicate line remover — dedupe lists & logs online (case-sensitive option)",
  description:
    "Free duplicate line remover: paste lists or upload .txt, remove repeated lines with case-sensitive or case-insensitive matching, optional trim for comparison, copy results—runs entirely in your browser. Guides for emails, URLs, logs, and CSV rows.",
  keywords: [
    "duplicate line remover",
    "remove duplicate lines",
    "dedupe lines online",
    "unique lines",
    "deduplicate text",
    "remove repeated lines",
    "case insensitive dedupe",
    "list deduplication",
    "uniq lines",
    "clean paste list",
  ],
  openGraph: {
    title: "Duplicate line remover — unique lines, preserve order",
    description:
      "Paste or upload text to drop duplicate lines while keeping first occurrences and original order—all client-side.",
  },
};

const PAGE_PATH = "/text/duplicate-line-remover";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function DuplicateLineRemoverLayout({
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
    name: "Duplicate line remover",
    url: pageUrl,
    description:
      "Browser-based tool to remove duplicate lines from pasted or uploaded text with optional case-insensitive matching and trim-before-compare, preserving order of first occurrences.",
    applicationCategory: "DeveloperApplication",
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
        name: "Duplicate line remover",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: duplicateLineRemoverFaqItems.map((item) => ({
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
    name: "How to remove duplicate lines from text",
    description:
      "Paste a line-based list, choose case and trim options, then copy unique lines while preserving the order of first appearances.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste or upload",
        text: "Paste content into the input area or use Upload .txt to load a local plain-text file. Each line is treated as one record—suitable for emails, SKUs, URLs, or log excerpts.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Set matching rules",
        text: "Toggle ignore case when “Hello” and “hello” should count as the same line. Enable trim before comparing so leading and trailing spaces do not create false uniqueness.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy deduplicated output",
        text: "Review the output panel and line counts, then use the copy control to move unique lines into a spreadsheet, ticket, or script.",
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
