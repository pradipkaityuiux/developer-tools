import type { Metadata } from "next";
import { cronGeneratorFaqItems } from "@/lib/cron-generator-faq";

export const metadata: Metadata = {
  title: "Cron expression generator — build 5-field schedules with plain English",
  description:
    "Free online cron expression generator: pick presets or set minute, hour, day, month, and weekday fields, then copy a valid 5-field cron string with an instant human-readable explanation. Runs in your browser—ideal for crontab, Kubernetes CronJobs, and cloud schedulers.",
  keywords: [
    "cron expression generator",
    "cron schedule builder",
    "crontab generator",
    "cron online",
    "5 field cron",
    "schedule expression",
    "Linux cron",
    "Kubernetes cron schedule",
    "every minute cron",
    "weekday cron",
    "build cron expression",
    "human readable cron",
  ],
  openGraph: {
    title: "Cron expression generator — 5-field builder",
    description:
      "Build standard cron expressions with presets and dropdowns; copy the result and read the plain-English meaning instantly.",
  },
};

const PAGE_PATH = "/dev/cron-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function CronGeneratorLayout({
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
    name: "Cron expression generator",
    url: pageUrl,
    description:
      "Client-side tool to compose standard five-field cron expressions from presets and field selectors, with human-readable schedule summaries.",
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
        name: "Cron expression generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: cronGeneratorFaqItems.map((item) => ({
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
    name: "How to build a cron expression",
    description:
      "Choose a preset or set each cron field, read the generated string and its plain-English meaning, then copy the expression into your scheduler.",
    totalTime: "PT3M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Pick a preset or fields",
        text: "Click a quick preset such as every 15 minutes, daily at midnight, or weekdays at 9:00, or open the minute, hour, day-of-month, month, and day-of-week dropdowns to compose a custom schedule.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Review the expression",
        text: "Confirm the five-field line (minute hour day-of-month month day-of-week) matches your platform's documentation. Read the human-readable summary to catch mistakes before deployment.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy into your environment",
        text: "Use Copy expression, then paste into crontab, a CronJob manifest, GitHub Actions on.schedule, or your cloud scheduler. Verify time zone and whether your system uses five or six fields.",
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
