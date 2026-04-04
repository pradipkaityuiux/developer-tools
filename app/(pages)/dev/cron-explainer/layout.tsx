import type { Metadata } from "next";
import { cronExplainerFaqItems } from "@/lib/cron-explainer-faq";

export const metadata: Metadata = {
  title:
    "Cron expression explainer — plain English, next run times, 5-field Unix cron (free)",
  description:
    "Free online cron explainer: paste a 5-field Unix cron string for a readable breakdown, Vixie OR-rule warnings for day-of-month and day-of-week, and upcoming run times in your local timezone—all client-side.",
  keywords: [
    "cron expression explainer",
    "cron translator",
    "what does my cron mean",
    "crontab explainer",
    "cron schedule reader",
    "next cron run",
    "Unix cron",
    "5 field cron",
    "cron human readable",
    "schedule explainer",
  ],
  openGraph: {
    title: "Cron expression explainer — decode schedules in plain English",
    description:
      "Understand minute, hour, DOM, month, and DOW fields; see the next runs—runs in your browser.",
  },
};

const PAGE_PATH = "/dev/cron-explainer";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function CronExplainerLayout({
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
    name: "Cron expression explainer",
    url: pageUrl,
    description:
      "Browser-based cron schedule explainer for standard five-field Unix expressions: human-readable field breakdown, OR-rule notes when both day-of-month and day-of-week are set, and projected next execution times using local time.",
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
        name: "Cron expression explainer",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: cronExplainerFaqItems.map((item) => ({
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
    name: "How to explain a cron expression online",
    description:
      "Paste a five-field cron string to read each field in plain language and preview upcoming run times without installing crontab tools.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste your cron string",
        text: "Copy a line from crontab, Kubernetes CronJob, a serverless schedule, or documentation. Ensure it uses the five fields: minute, hour, day-of-month, month, day-of-week.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Read the breakdown",
        text: "Review the sentence-style explanation, the split fields table, and any warning about day-of-month versus day-of-week when both are specific values.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Check next runs",
        text: "Compare the listed next run timestamps against your expectations in local time, then align with your server or orchestrator timezone before changing production jobs.",
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
