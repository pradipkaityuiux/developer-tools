import type { Metadata } from "next";
import type { ReactNode } from "react";
import { lineSorterFaqItems } from "@/lib/line-sorter-faq";

export const metadata: Metadata = {
  title:
    "Line sorter — sort text A–Z, Z–A, by length, or shuffle online (free)",
  description:
    "Free online line sorter: alphabetical A–Z and Z–A with optional case-insensitive compare, sort by line length (shortest or longest first), or random shuffle. Paste or upload .txt, copy results—all in your browser. Guides for logs, lists, imports, and dedupe prep.",
  keywords: [
    "line sorter",
    "sort lines online",
    "alphabetical line sort",
    "sort text by line",
    "reverse alphabetical sort",
    "sort lines by length",
    "shuffle lines",
    "randomize lines",
    "text line sorter",
    "order lines A to Z",
  ],
  openGraph: {
    title: "Line sorter — A–Z, by length, or random shuffle",
    description:
      "Reorder pasted or uploaded text line by line in your browser—no sign-up.",
  },
};

const PAGE_PATH = "/text/line-sorter";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function LineSorterLayout({ children }: { children: ReactNode }) {
  const origin = siteOrigin();
  const pageUrl = origin ? `${origin}${PAGE_PATH}` : PAGE_PATH;
  const homeUrl = origin ? `${origin}/` : "/";

  const webAppSchema = {
    "@type": "WebApplication",
    "@id": `${pageUrl}#webapp`,
    name: "Line sorter",
    url: pageUrl,
    description:
      "Browser-based tool to sort lines alphabetically (A–Z or Z–A) with optional case-insensitive comparison, sort by line length ascending or descending, or shuffle lines randomly. Paste or upload UTF-8 .txt and copy the reordered result—all client-side.",
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
        name: "Line sorter",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: lineSorterFaqItems.map((item) => ({
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
    name: "How to sort lines of text online",
    description:
      "Paste or upload plain text, choose alphabetical, length-based, or random order, optionally ignore case for A–Z sorts, then copy the reordered lines from your browser.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste or upload",
        text: "Paste line-based content into the input area or use Upload .txt to load a local UTF-8 plain-text file. Each line becomes one row in the sorted output.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose sort mode",
        text: "Select A–Z or Z–A for alphabetical order (toggle ignore case when casing should not affect order), pick shortest-first or longest-first to sort by character length, or choose random shuffle and use Shuffle again after edits.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy sorted lines",
        text: "Review the output panel and line counts, then use the copy control to move reordered text into an editor, spreadsheet, or ticket. Nothing is uploaded to a server.",
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
