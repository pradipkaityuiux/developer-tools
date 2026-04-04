import type { Metadata } from "next";
import { csvViewerFaqItems } from "@/lib/csv-viewer-faq";

export const metadata: Metadata = {
  title:
    "CSV viewer and editor online — sort, filter, edit cells, export (free, browser-only)",
  description:
    "Free online CSV viewer and editor: paste or upload CSV/TSV, auto-detect delimiters, sort columns, filter rows, edit cells, then copy or download RFC-safe CSV—no server upload, runs in your browser.",
  keywords: [
    "CSV viewer",
    "online CSV editor",
    "CSV table view",
    "edit CSV in browser",
    "TSV viewer",
    "sort CSV online",
    "filter CSV",
    "spreadsheet alternative",
    "RFC 4180 CSV",
    "privacy CSV tool",
  ],
  openGraph: {
    title: "CSV viewer & editor — sort, filter, export in the browser",
    description:
      "Turn delimited text into an editable, sortable table and export CSV without installing Excel or Sheets.",
  },
};

const PAGE_PATH = "/files/csv-viewer";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function CsvViewerLayout({
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
    name: "CSV viewer and editor",
    url: pageUrl,
    description:
      "View comma- or tab-separated files as a table: delimiter auto-detection, column sorting, full-grid filter, per-cell editing, and CSV copy or download—client-side only.",
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
        name: "CSV viewer and editor",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: csvViewerFaqItems.map((item) => ({
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
    name: "How to view and edit CSV online",
    description:
      "Paste or upload delimited text, confirm delimiter and header options, use the table to sort and filter, edit cells, then copy or download CSV.",
    totalTime: "PT3M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Load data",
        text: "Paste an export from Excel, Google Sheets, or a database into the text area, or use Upload CSV to read a local .csv, .tsv, or .txt file. Click Load sample to try the UI.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Shape the table",
        text: "Pick Auto or a specific delimiter. Toggle First row is header when the first line holds column names. Use the filter box to limit visible rows; click column headers to sort ascending, descending, or return to file order.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Edit and export",
        text: "Change any cell inline. When you need only the filtered subset, enable Export filtered rows only. Copy CSV to the clipboard or download a .csv file.",
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
