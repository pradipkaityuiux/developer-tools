import type { Metadata } from "next";
import { dummyDataGeneratorFaqItems } from "@/lib/dummy-data-generator-faq";

export const metadata: Metadata = {
  title:
    "Dummy data generator — fake names, emails & addresses as JSON or CSV (free, private)",
  description:
    "Free online dummy data generator: create synthetic people and addresses for fixtures, UI tests, and API mocks. Export JSON or CSV, upload column headers, copy in one click—runs entirely in your browser.",
  keywords: [
    "dummy data generator",
    "fake data generator",
    "test data generator",
    "synthetic data",
    "mock data JSON",
    "CSV test data",
    "fake email generator",
    "sample addresses",
    "fixture data",
    "seed data",
    "UI testing data",
  ],
  openGraph: {
    title: "Dummy data generator — JSON & CSV for developers",
    description:
      "Generate fake names, emails, phones, companies, and addresses locally. Match spreadsheet columns with upload, then copy or download.",
  },
};

const PAGE_PATH = "/dev/dummy-data-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function DummyDataGeneratorLayout({
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
    name: "Dummy data generator",
    url: pageUrl,
    description:
      "Client-side dummy data generator for names, emails, phones, companies, job titles, and mailing-style addresses. Outputs JSON or CSV, supports custom columns from upload, uses Web Crypto randomness.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and clipboard access for copy.",
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
        name: "Dummy data generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: dummyDataGeneratorFaqItems.map((item) => ({
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
    name: "How to generate dummy test data online",
    description:
      "Choose standard person and address fields, optionally add or upload custom column names, set row count, pick JSON or CSV, regenerate random values, then copy or download.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Configure columns",
        text: "Toggle standard fields such as first name, last name, email, street, city, state, ZIP, and country. Add extra headers one per line or upload a CSV/TXT header row so values match your schema naming.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Set volume and format",
        text: "Enter how many rows you need (up to hundreds for quick fixtures). Switch between JSON and CSV; use pretty-printed JSON when you want readable diffs in pull requests.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Export",
        text: "Click Regenerate data for a fresh random batch. Use the copy control on the output or download a .json or .csv file for spreadsheets, importers, or test repos.",
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
