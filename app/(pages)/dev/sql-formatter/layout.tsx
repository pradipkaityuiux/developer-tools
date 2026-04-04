import type { Metadata } from "next";
import { sqlFormatterFaqItems } from "@/lib/sql-formatter-faq";

export const metadata: Metadata = {
  title: "SQL formatter — pretty-print and keyword casing online",
  description:
    "Free SQL formatter in the browser: indent queries, normalize keyword case, and choose PostgreSQL, MySQL, SQLite, T-SQL, BigQuery, Snowflake, and more. Client-side only—paste SQL, format, and copy for docs and code review.",
  keywords: [
    "SQL formatter",
    "SQL pretty print",
    "format SQL online",
    "PostgreSQL formatter",
    "MySQL SQL formatter",
    "T-SQL formatter",
    "beautify SQL",
    "SQL indentation",
    "keyword case SQL",
    "SQL code review",
  ],
  openGraph: {
    title: "SQL formatter — pretty-print SQL online",
    description:
      "Pretty-print SQL with dialect-aware formatting and upper or lower keyword casing. Runs locally in your browser—nothing uploaded.",
  },
};

const PAGE_PATH = "/dev/sql-formatter";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function SqlFormatterLayout({
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
    name: "SQL formatter",
    url: pageUrl,
    description:
      "Browser-based SQL pretty-printer with dialect selection, indentation control, and keyword casing for readable queries and documentation.",
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
        name: "SQL formatter",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: sqlFormatterFaqItems.map((item) => ({
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
    name: "How to format SQL online",
    description:
      "Paste SQL, choose a database dialect and keyword casing, then copy the indented result for tickets, README files, and pull requests.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste your SQL",
        text: "Copy a query from your editor, logs, or ORM debug output into the input area. Remove surrounding stack traces or timestamps if the formatter complains.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Pick dialect and style",
        text: "Select the SQL dialect that matches your engine—for example PostgreSQL, MySQL, SQLite, or Transact-SQL. Choose whether keywords should stay as-is, go uppercase, or lowercase, and set indent width or tabs to match your team style guide.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Format and copy",
        text: "Click Format SQL to pretty-print in the browser. Use Copy output to paste into documentation, Slack, or a code review. Nothing is uploaded to a server.",
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
