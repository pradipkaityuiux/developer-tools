import type { Metadata } from "next";
import { rateLimitCalculatorFaqItems } from "@/lib/rate-limit-calculator-faq";

export const metadata: Metadata = {
  title:
    "API rate limit calculator — pace RPM vs daily quota with steady-call estimates",
  description:
    "Free online API rate limit calculator: compare requests per minute (RPM) to a daily call budget, see average RPM for even pacing over 24 hours, projected daily volume, time until the daily cap is exhausted, and seconds between requests. Client-side—ideal for REST integrations, batch jobs, and throttling design.",
  keywords: [
    "API rate limit calculator",
    "requests per minute daily quota",
    "RPM API limit",
    "API throttling planner",
    "daily API call budget",
    "rate limit pacing",
    "429 too many requests planning",
    "API quota calculator",
    "even spacing between API requests",
    "REST API rate limit",
  ],
  openGraph: {
    title: "API rate limit calculator — RPM vs daily quota",
    description:
      "Model sustained requests per minute against a 24-hour call budget; copy a text report for runbooks and tickets.",
  },
};

const PAGE_PATH = "/api-toolbox/rate-limit-calculator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function RateLimitCalculatorLayout({
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
    name: "API rate limit calculator",
    url: pageUrl,
    description:
      "Client-side calculator for comparing sustained requests per minute to a daily API call quota, with pacing and time-to-exhaust estimates.",
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
        name: "API rate limit calculator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: rateLimitCalculatorFaqItems.map((item) => ({
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
    name: "How to use the API rate limit calculator",
    description:
      "Enter sustained requests per minute and a daily call quota, review pacing and time-to-exhaust figures, then copy the report or load values from JSON.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter RPM and daily quota",
        text: "Input your target sustained requests per minute and the provider’s daily call budget for the key or workspace you are sizing.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Read pacing and limits",
        text: "Compare average RPM for an even spread across 24 hours to your current RPM, check projected daily calls, and note time until the daily budget is exhausted if you are over pace.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Export or import",
        text: "Use Copy report for a text summary, or Load JSON with requestsPerMinute and dailyQuota fields for repeat scenarios.",
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
