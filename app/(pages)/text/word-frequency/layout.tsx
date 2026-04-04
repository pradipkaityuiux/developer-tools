import type { Metadata } from "next";
import type { ReactNode } from "react";
import { wordFrequencyFaqItems } from "@/lib/word-frequency-faq";

export const metadata: Metadata = {
  title:
    "Word frequency analyzer — ranked word counts, SEO repetition check (free)",
  description:
    "Free online word frequency analyzer: rank word counts in pasted text, optional stop-word filter, case options, and TSV export. Spot repetition and keyword patterns in your browser—paste or upload .txt/.md.",
  keywords: [
    "word frequency analyzer",
    "word frequency counter",
    "keyword density checker",
    "text word count list",
    "repeated words finder",
    "SEO word repetition",
    "word histogram online",
    "token frequency",
    "content word analysis",
    "rank words by count",
  ],
  openGraph: {
    title: "Word frequency analyzer — ranked counts & export (free)",
    description:
      "Paste or upload text for instant ranked word frequencies, percentages, and copy-friendly TSV—all client-side.",
  },
};

const PAGE_PATH = "/text/word-frequency";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function WordFrequencyLayout({
  children,
}: {
  children: ReactNode;
}) {
  const origin = siteOrigin();
  const pageUrl = origin ? `${origin}${PAGE_PATH}` : PAGE_PATH;
  const homeUrl = origin ? `${origin}/` : "/";

  const webAppSchema = {
    "@type": "WebApplication",
    "@id": `${pageUrl}#webapp`,
    name: "Word frequency analyzer",
    url: pageUrl,
    description:
      "Free browser-based word frequency tool: ranked token counts, percentage of analyzed words, optional ignore case, minimum length, English stop-word filter, paste or upload text, copy TSV export—no server processing of content.",
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
        name: "Word frequency analyzer",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: wordFrequencyFaqItems.map((item) => ({
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
    name: "How to analyze word frequency online",
    description:
      "Paste or upload text, tune case and stop-word options, review the ranked table, and copy a TSV for spreadsheets.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Add text",
        text: "Paste from a document or CMS, or click Upload file to load .txt or Markdown. Load sample demonstrates repetition patterns.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose analysis options",
        text: "Toggle ignore case to merge Word and word, set a minimum length to drop short tokens, enable omit common words to hide frequent English function words, and limit how many rows display in the table.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy or iterate",
        text: "Use Copy TSV to paste counts into Excel or Sheets, or open the find and replace tool to rewrite overused phrases before recounting.",
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
