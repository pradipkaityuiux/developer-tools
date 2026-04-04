import type { Metadata } from "next";
import { unixTimestampFaqItems } from "@/lib/unix-timestamp-faq";

export const metadata: Metadata = {
  title:
    "Unix timestamp converter — epoch seconds & milliseconds to date (free)",
  description:
    "Free online Unix timestamp converter: turn epoch seconds or milliseconds into local time and UTC ISO strings, and convert dates back to Unix time. Client-side for privacy—ideal for logs, APIs, and JWT exp fields.",
  keywords: [
    "Unix timestamp converter",
    "epoch converter",
    "Unix time to date",
    "milliseconds to date",
    "seconds since 1970",
    "UTC to Unix timestamp",
    "ISO 8601 to Unix",
    "timestamp parser",
    "developer time tools",
    "API timestamp format",
  ],
  openGraph: {
    title: "Unix timestamp converter — epoch to date and back",
    description:
      "Convert Unix epoch seconds or milliseconds to readable dates and reverse—runs locally in your browser.",
  },
};

const PAGE_PATH = "/dev/unix-timestamp";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function UnixTimestampLayout({
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
    name: "Unix timestamp converter",
    url: pageUrl,
    description:
      "Browser-based Unix epoch converter: interpret seconds or milliseconds, show local and UTC representations, capture the current instant, and convert calendar input or ISO 8601 strings back to Unix time.",
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
        name: "Unix timestamp converter",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: unixTimestampFaqItems.map((item) => ({
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
    name: "How to convert Unix timestamps online",
    description:
      "Paste a numeric epoch value to see local and UTC times, use Now for the current instant, or pick a date and optional ISO string to obtain Unix seconds and milliseconds.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste or enter a Unix value",
        text: "Type digits only (optional leading minus). Choose Auto to treat ten or fewer digits as seconds and longer runs as milliseconds, or force Seconds or Milliseconds when you know the unit.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Read local, UTC, and both epoch forms",
        text: "Review the formatted local string, the UTC ISO 8601 value, and the equivalent Unix seconds and milliseconds. Copy any line for tickets, runbooks, or code.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Convert a calendar date to Unix time",
        text: "Use the datetime picker for local time, or paste ISO 8601 including a Z offset when you need an absolute instant. The tool prints matching Unix seconds and milliseconds.",
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
