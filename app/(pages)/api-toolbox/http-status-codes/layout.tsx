import type { Metadata } from "next";
import { httpStatusCodesFaqItems } from "@/lib/http-status-codes-faq";

export const metadata: Metadata = {
  title:
    "HTTP status code reference — 1xx–5xx meanings, causes & fixes (free lookup)",
  description:
    "Free HTTP status code reference: search 1xx–5xx codes with plain-English meanings, typical production causes, and what to do next. Filter by class, copy explanations for runbooks, import log files locally—static, client-side tool for APIs, SEO, and ops.",
  keywords: [
    "HTTP status codes",
    "HTTP status code list",
    "HTTP status code meanings",
    "404 vs 410",
    "301 vs 302 SEO",
    "401 vs 403",
    "502 Bad Gateway",
    "504 Gateway Timeout",
    "429 rate limit",
    "REST API status codes",
    "HTTP status code reference",
  ],
  openGraph: {
    title: "HTTP status code reference — lookup & debugging guide",
    description:
      "Search and filter HTTP status codes with causes and remediation tips. Runs in your browser.",
  },
};

const PAGE_PATH = "/api-toolbox/http-status-codes";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function HttpStatusCodesLayout({
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
    name: "HTTP status code reference",
    url: pageUrl,
    description:
      "Browser-based HTTP status code lookup: filter by 1xx–5xx class, search by code or symptom, copy structured explanations, optionally narrow results by importing a local log file—no server upload of search or file contents.",
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
        name: "HTTP status code reference",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: httpStatusCodesFaqItems.map((item) => ({
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
    name: "How to look up HTTP status codes online",
    description:
      "Search or filter HTTP status codes by class, copy explanations for tickets, or import a local log to focus on codes your traffic returns.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Search or filter",
        text: "Enter a code, reason phrase, or symptom in the search box, or tap a class filter for 1xx through 5xx responses.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Read causes and fixes",
        text: "Open each card for a plain-English summary, typical production causes, and recommended next debugging steps.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy or narrow with a log",
        text: "Use Copy to paste a structured explanation into documentation or chat. Optionally import a .txt or .log file to limit the list to status codes found in your file.",
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
