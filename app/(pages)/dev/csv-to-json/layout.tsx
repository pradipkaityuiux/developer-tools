import type { Metadata } from "next";
import { csvToJsonFaqItems } from "@/lib/csv-to-json-faq";

export const metadata: Metadata = {
  title:
    "CSV to JSON converter — paste, upload, header-aware typing & download",
  description:
    "Free online CSV to JSON converter: paste or upload CSV, auto-detect delimiters (comma, semicolon, tab, pipe), optional header row and smart typing for numbers and booleans, pretty or minified JSON, copy and download—runs in your browser.",
  keywords: [
    "CSV to JSON",
    "convert CSV to JSON",
    "CSV parser online",
    "TSV to JSON",
    "comma separated values JSON",
    "CSV upload JSON",
    "header row JSON",
    "typed JSON from spreadsheet",
    "developer CSV tool",
    "API CSV import",
  ],
  openGraph: {
    title: "CSV to JSON converter — browser-side, no upload",
    description:
      "Turn tabular CSV into structured JSON with delimiter auto-detect, headers, typing, and one-click download.",
  },
};

const PAGE_PATH = "/dev/csv-to-json";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function CsvToJsonLayout({
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
    name: "CSV to JSON converter",
    url: pageUrl,
    description:
      "Convert comma- or tab-separated text into JSON in the browser: optional header keys, smart cell typing, delimiter auto-detection, and JSON copy or file download.",
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
        name: "CSV to JSON converter",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: csvToJsonFaqItems.map((item) => ({
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
    name: "How to convert CSV to JSON",
    description:
      "Paste spreadsheet export or upload a .csv/.tsv file, confirm delimiter and header options, then copy or download valid JSON for apps and APIs.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Provide CSV or TSV",
        text: "Paste delimited text into the input area or use Upload file to load a local .csv, .tsv, or plain-text export. Keep quoted fields if your source uses commas inside cells.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose delimiter and shape",
        text: "Leave delimiter on Auto for common comma, semicolon, tab, and pipe files, or pick a specific separator. Enable First row is header for an array of objects; switch to Array of arrays for matrix-style JSON.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Tune typing and export",
        text: "Toggle Smart typing to coerce numbers, booleans, and empty cells to null. Use Pretty-print for readability or disable it for compact payloads. Copy JSON to the clipboard or download data.json.",
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
