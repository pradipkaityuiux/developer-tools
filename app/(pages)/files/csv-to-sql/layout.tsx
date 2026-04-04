import type { Metadata } from "next";
import { csvToSqlFaqItems } from "@/lib/csv-to-sql-faq";

export const metadata: Metadata = {
  title:
    "CSV to SQL INSERT generator — PostgreSQL, MySQL, SQL Server (browser-only, free)",
  description:
    "Free CSV to SQL converter: paste or upload CSV/TSV, auto-detect delimiters, optional header row and smart typing, ANSI/MySQL/SQL Server identifier quoting, one INSERT per row or batched VALUES—copy or download .sql, runs entirely in your browser.",
  keywords: [
    "CSV to SQL",
    "CSV to INSERT",
    "generate INSERT from CSV",
    "SQL seed from spreadsheet",
    "PostgreSQL CSV import",
    "MySQL INSERT generator",
    "SQL Server bulk insert SQL",
    "TSV to SQL",
    "database migration CSV",
    "browser CSV SQL tool",
  ],
  openGraph: {
    title: "CSV to SQL — INSERT statements from spreadsheets",
    description:
      "Turn delimited exports into INSERT INTO … VALUES with dialect-aware quoting, batching, and optional typing—no server upload.",
  },
};

const PAGE_PATH = "/files/csv-to-sql";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function CsvToSqlLayout({
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
    name: "CSV to SQL INSERT generator",
    url: pageUrl,
    description:
      "Convert CSV or TSV into INSERT statements: delimiter auto-detect, header row for column names, optional cell typing, PostgreSQL/MySQL/SQL Server identifier styles, per-row or batched inserts, semicolons optional—client-side only.",
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
        name: "CSV to SQL converter",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: csvToSqlFaqItems.map((item) => ({
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
    name: "How to convert CSV to SQL INSERT statements",
    description:
      "Paste or upload a delimited file, set table name and SQL dialect, choose header and typing options, then copy or download INSERT statements for your database.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Load CSV or TSV",
        text: "Paste spreadsheet export into the input or use Upload to read .csv, .tsv, or .txt locally. Enable First row is header when the first line lists column names.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Configure SQL output",
        text: "Enter the target table name. Pick delimiter Auto or a fixed separator. Choose ANSI (PostgreSQL/SQLite), MySQL, or SQL Server quoting. Toggle smart typing for NULL, numbers, and booleans. Select one INSERT per row or batched VALUES with a batch size.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy or download",
        text: "Review the generated SQL in the output panel. Copy to the clipboard or download a .sql file. Run statements in your SQL client or embed them in migrations; use the SQL formatter tool if you want consistent indentation.",
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
