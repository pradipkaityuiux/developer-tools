import type { Metadata } from "next";
import { csvDeduplicatorFaqItems } from "@/lib/csv-deduplicator-faq";

export const metadata: Metadata = {
  title:
    "CSV deduplicator — remove duplicate rows by column (mailing lists & feeds)",
  description:
    "Free online CSV deduplication: paste or upload a file, auto-detect delimiters, pick columns for duplicate detection, keep first or last row, trim-aware matching, then copy or download a cleaned CSV—runs entirely in your browser.",
  keywords: [
    "CSV deduplicator",
    "remove duplicate CSV rows",
    "dedupe mailing list",
    "CSV duplicate removal",
    "deduplicate by email column",
    "product feed deduplication",
    "spreadsheet remove duplicates",
    "TSV dedupe online",
    "keep first duplicate row",
    "browser CSV tool",
  ],
  openGraph: {
    title: "CSV deduplicator — column-based duplicate removal in the browser",
    description:
      "Clean CSV and TSV files: choose key columns, trim-aware keys, first or last wins, one-click export.",
  },
};

const PAGE_PATH = "/files/csv-deduplicator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function CsvDeduplicatorLayout({
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
    name: "CSV deduplicator",
    url: pageUrl,
    description:
      "Remove duplicate rows from CSV or TSV using selected columns: delimiter auto-detection, optional header row, trim-aware duplicate keys, keep first or last occurrence, copy or download cleaned output in the browser.",
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
        name: "File & data tools",
        item: origin ? `${origin}/#file-data-tools` : "/#file-data-tools",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "CSV deduplicator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: csvDeduplicatorFaqItems.map((item) => ({
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
    name: "How to deduplicate a CSV file online",
    description:
      "Load delimited text, confirm delimiter and header options, choose columns that define a duplicate, pick whether the first or last row wins, then copy or download the deduplicated CSV.",
    totalTime: "PT3M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste or upload CSV",
        text: "Paste spreadsheet export into the input area or use Upload file for a local .csv, .tsv, or .txt file. Quoted fields with embedded delimiters are parsed using common CSV rules.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Set delimiter and header",
        text: "Leave delimiter on Auto for comma, semicolon, tab, or pipe files, or choose a fixed separator. Enable First row is header when the top row names your columns.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Choose duplicate key columns",
        text: "Check the columns that must match for rows to count as duplicates—such as email alone, or SKU plus warehouse. Use Trim values when comparing to ignore accidental spaces in keys.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Keep first or last and export",
        text: "Select Keep first for typical list imports, or Keep last when newer rows are authoritative. Copy CSV to the clipboard or download deduplicated.csv.",
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
