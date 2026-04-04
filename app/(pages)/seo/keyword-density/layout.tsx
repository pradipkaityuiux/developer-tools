import type { Metadata } from "next";
import type { ReactNode } from "react";
import { keywordDensityFaqItems } from "@/lib/keyword-density-faq";

export const metadata: Metadata = {
  title:
    "Keyword density checker — phrase frequency, SEO prominence & export (free)",
  description:
    "Free keyword density checker: paste or upload article copy, set target phrases, and see occurrences, density percentage, and first-position prominence (including within the first 100 words). Copy a TSV report. Runs locally in your browser.",
  keywords: [
    "keyword density checker",
    "keyword density calculator",
    "SEO keyword frequency",
    "keyword prominence checker",
    "on-page SEO keyword tool",
    "keyword stuffing checker",
    "phrase density analyzer",
    "meta keyword audit",
    "content keyword analysis",
    "keyword repetition checker",
  ],
  openGraph: {
    title:
      "Keyword density checker — measure phrase frequency & prominence online",
    description:
      "Analyze target keyword phrases in pasted text: density, counts, early placement, and spreadsheet-friendly export—client-side.",
  },
};

const PAGE_PATH = "/seo/keyword-density";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function KeywordDensityLayout({ children }: { children: ReactNode }) {
  const origin = siteOrigin();
  const pageUrl = origin ? `${origin}${PAGE_PATH}` : PAGE_PATH;
  const homeUrl = origin ? `${origin}/` : "/";
  const seoHubUrl = origin ? `${origin}/#seo-tools` : "/#seo-tools";

  const webAppSchema = {
    "@type": "WebApplication",
    "@id": `${pageUrl}#webapp`,
    name: "Keyword density checker",
    url: pageUrl,
    description:
      "Browser-based keyword density and prominence tool: whitespace tokenization, optional case folding, non-overlapping phrase matches, first-match word position, early-intro flag within first 100 words, TSV export.",
    applicationCategory: "UtilitiesApplication",
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
        name: "SEO tools",
        item: seoHubUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Keyword density checker",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: keywordDensityFaqItems.map((item) => ({
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
    name: "How to check keyword density and prominence",
    description:
      "Paste body copy or upload a text file, enter one or more target phrases, review density and first-match position, then copy a TSV report for spreadsheets or tickets.",
    totalTime: "PT3M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Add your content",
        text: "Paste draft blog, product, or landing page text, or click Upload file to load .txt or Markdown. Load sample previews how phrases are counted.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Set keyword phrases",
        text: "Enter a primary phrase and optional comma-separated additional phrases. Toggle ignore case if you want case-insensitive token matching.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Read density and prominence",
        text: "Review occurrences, density percentage, first word position, and whether the first match falls within the first 100 words. Use Copy report for a TSV suitable for Excel or Google Sheets.",
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
