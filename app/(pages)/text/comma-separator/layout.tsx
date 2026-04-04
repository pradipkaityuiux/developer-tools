import type { Metadata } from "next";
import { commaSeparatorFaqItems } from "@/lib/comma-separator-faq";

export const metadata: Metadata = {
  title:
    "Comma separator tool — newline list to CSV & split delimited text online",
  description:
    "Free comma separator: join lines into comma-separated values (CSV) with optional quoting, or split CSV/TSV into one value per line—quoted fields, custom delimiters, detect delimiter, upload .txt, copy output. Runs entirely in your browser.",
  keywords: [
    "comma separator",
    "newline to comma",
    "list to CSV",
    "comma separated values",
    "split CSV to lines",
    "text to comma separated",
    "join lines with comma",
    "delimiter converter",
    "TSV to lines",
    "online CSV join split",
  ],
  openGraph: {
    title: "Comma separator — join lines or split delimited text",
    description:
      "Convert newline lists to delimited strings or flatten CSV-style rows to a vertical list—client-side, privacy-friendly.",
  },
};

const PAGE_PATH = "/text/comma-separator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function CommaSeparatorLayout({
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
    name: "Comma separator tool",
    url: pageUrl,
    description:
      "Browser-based tool to join newline-separated lists into delimited strings (CSV/TSV style) or split delimited text into one value per line, with quoted-field parsing and configurable delimiters.",
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
        name: "Comma separator tool",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: commaSeparatorFaqItems.map((item) => ({
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
    name: "How to use the comma separator tool",
    description:
      "Join a vertical list into a single delimited line for spreadsheets and APIs, or split CSV-style text into one value per line with optional row grouping.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose mode and delimiter",
        text: "Select Join lines to delimited for newline lists, or Split delimited to lines for CSV/TSV. Pick comma, semicolon, tab, pipe, or one custom character. In split mode you can detect delimiter from a sample.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Paste or upload text",
        text: "Paste into the input area or upload a UTF-8 .txt file. Join mode expects one value per line; split mode accepts quoted fields and multiple rows.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Tune options and copy",
        text: "For join, choose trim, skip empty lines, and minimal or always quoting. For split, trim values and optionally insert blank lines between original rows. Copy the output with the copy control.",
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
