import type { Metadata } from "next";
import { uuidGeneratorFaqItems } from "@/lib/uuid-generator-faq";

export const metadata: Metadata = {
  title:
    "UUID generator (v4) — bulk random UUIDs for APIs & databases (free, private)",
  description:
    "Free online UUID v4 generator: create one or hundreds of random UUIDs with hyphens, compact hex, or uppercase—copy-ready for Postgres, MySQL, REST APIs, and fixtures. Runs in your browser with Web Crypto.",
  keywords: [
    "UUID generator",
    "UUID v4 generator",
    "generate UUID online",
    "bulk UUID generator",
    "random UUID",
    "GUID generator",
    "RFC 4122",
    "primary key UUID",
    "correlation ID",
    "API identifier",
  ],
  openGraph: {
    title: "UUID generator — random UUID v4 values in your browser",
    description:
      "Generate standard, compact, or uppercase UUID v4 strings and copy them instantly—no server upload.",
  },
};

const PAGE_PATH = "/dev/uuid-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function UuidGeneratorLayout({
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
    name: "UUID v4 generator",
    url: pageUrl,
    description:
      "Browser-based UUID v4 generator: produce one or many cryptographically random identifiers with optional compact or uppercase formatting, copy all output, powered by Web Crypto.",
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
        name: "UUID generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: uuidGeneratorFaqItems.map((item) => ({
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
    name: "How to generate UUID v4 values online",
    description:
      "Choose how many identifiers you need, pick an output format, generate random UUID v4 strings, and copy them for databases, APIs, or test data.",
    totalTime: "PT30S",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Set count and format",
        text: "Enter a number between 1 and 500 for how many UUIDs you want. Select standard hyphenated form, compact 32-character hex, or uppercase display depending on your schema or style guide.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Generate",
        text: "Click Generate new UUIDs to fill the list with fresh random v4 values using the browser’s crypto APIs.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy",
        text: "Use Copy all to paste into migrations, seed scripts, API clients, or tickets. For automation at scale, prefer your language or database’s built-in UUID functions.",
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
