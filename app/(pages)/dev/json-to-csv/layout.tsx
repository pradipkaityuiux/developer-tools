import type { Metadata } from "next";
import { jsonToCsvFaqItems } from "@/lib/json-to-csv-faq";

export const metadata: Metadata = {
  title: "JSON to CSV converter — free online, client-side export",
  description:
    "Convert JSON arrays to CSV in your browser: automatic columns, RFC 4180 escaping, comma or semicolon delimiter, optional UTF-8 BOM for Excel. Guides for APIs, logs, and spreadsheets—plus FAQs and related developer tools.",
  keywords: [
    "JSON to CSV",
    "JSON to CSV converter",
    "convert JSON to CSV online",
    "JSON array to spreadsheet",
    "export JSON as CSV",
    "automatic CSV columns",
    "RFC 4180 CSV",
    "UTF-8 BOM Excel CSV",
    "semicolon CSV delimiter",
    "API JSON export",
  ],
  openGraph: {
    title: "JSON to CSV converter — automatic columns & download",
    description:
      "Turn JSON arrays into downloadable CSV with delimiter choice and Excel-friendly UTF-8—all processed locally in your browser.",
  },
};

const PAGE_PATH = "/dev/json-to-csv";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function JsonToCsvLayout({
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
    name: "JSON to CSV converter",
    url: pageUrl,
    description:
      "Free browser-based JSON to CSV converter with automatic column detection, delimiter choice, RFC 4180 escaping, optional UTF-8 BOM for Excel, copy and download.",
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
        name: "JSON to CSV converter",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: jsonToCsvFaqItems.map((item) => ({
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
    name: "How to convert JSON to CSV",
    description:
      "Paste a JSON array of objects (or a wrapper object with a data/items array), choose delimiter and UTF-8 BOM options, then copy or download the CSV file.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Prepare valid JSON",
        text: "Copy JSON from an API response, log export, or database dump. Ensure it parses as a JSON array of objects, or as an object with an array property such as data, items, results, records, rows, values, or list.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Paste and choose CSV options",
        text: "Paste into the text area. Select comma or semicolon as the field delimiter (semicolon suits many European Excel locales). Enable UTF-8 BOM if Microsoft Excel should open accented characters correctly on Windows.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Convert and export",
        text: "Click Convert to CSV to generate headers from all object keys and align rows. Use Copy CSV or Download .csv to move the file into Excel, Google Sheets, BI tools, or ETL jobs.",
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
