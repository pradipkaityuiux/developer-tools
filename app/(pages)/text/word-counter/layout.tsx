import type { Metadata } from "next";
import { wordCounterFaqItems } from "@/lib/word-counter-faq";

export const metadata: Metadata = {
  title:
    "Free online word counter — characters, sentences, paragraphs, reading time",
  description:
    "Count words, characters with and without spaces, sentences, paragraphs, lines, and estimated reading time. Paste text or upload .txt/.md—runs in your browser with copy-friendly summaries for SEO, essays, and CMS limits.",
  keywords: [
    "word counter",
    "online word counter",
    "character counter",
    "reading time calculator",
    "sentence counter",
    "paragraph counter",
    "count words online",
    "text statistics",
    "blog word count",
    "meta description length",
  ],
  openGraph: {
    title: "Word counter — words, characters, reading time (free)",
    description:
      "Paste or upload text for instant word, character, sentence, and paragraph counts plus adjustable reading time—all client-side.",
  },
};

const PAGE_PATH = "/text/word-counter";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function WordCounterLayout({
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
    name: "Word counter and text statistics",
    url: pageUrl,
    description:
      "Free browser-based word counter: words, characters with and without spaces, estimated sentences and paragraphs, line counts, adjustable reading time, paste or upload text, copy summaries—no server upload of content.",
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
        name: "Word counter",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: wordCounterFaqItems.map((item) => ({
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
    name: "How to count words and characters online",
    description:
      "Paste or upload text, review live statistics, adjust reading speed, and copy a plain-text summary for tickets or editors.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Add your text",
        text: "Paste from a CMS, doc, or code comment block, or click Upload file to load a local .txt or .markdown file. The editor updates counts on every keystroke.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose a reading speed",
        text: "Pick a WPM value that matches your style guide. Blog editors often assume 200 to 250 WPM; faster values approximate skimming or expert readers.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy results",
        text: "Use Copy text to move the draft elsewhere, or Copy summary to share word count, character totals, and reading time in Slack, email, or Jira without retyping numbers.",
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
