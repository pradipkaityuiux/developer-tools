import type { Metadata } from "next";
import { textReverserFaqItems } from "@/lib/text-reverser-faq";

export const metadata: Metadata = {
  title:
    "Free online text reverser — reverse string, words per line, or each line",
  description:
    "Reverse text in your browser: flip the entire string, swap word order on every line, or mirror characters line by line. Paste, upload .txt, copy results—no server upload. Great for puzzles, demos, and quick QA.",
  keywords: [
    "text reverser",
    "reverse text online",
    "string reverse",
    "reverse words",
    "mirror text",
    "backward text generator",
    "reverse each line",
    "unicode text reverse",
    "free text tool",
  ],
  openGraph: {
    title: "Text reverser — full string, words per line, or line mirror (free)",
    description:
      "Choose how to reverse: whole paste, words on each line, or characters per line. Client-side only with upload and copy.",
  },
};

const PAGE_PATH = "/text/text-reverser";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function TextReverserLayout({
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
    name: "Online text reverser",
    url: pageUrl,
    description:
      "Free browser-based text reverser with three modes: reverse the full string as characters, reverse word order on each line, or reverse characters within each line while keeping line breaks. Paste, upload plain text, copy output—runs locally.",
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
        name: "Text reverser",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: textReverserFaqItems.map((item) => ({
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
    name: "How to reverse text online",
    description:
      "Pick a reversal mode, paste or upload text, review the mirrored output, and copy it into puzzles, social posts, or test fixtures.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose a reversal mode",
        text: "Select reverse full text to flip the entire paste including newlines, reverse words per line to swap word order on every row, or reverse each line to mirror characters inside each line while preserving row count.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Add your input",
        text: "Paste from any editor or click upload to load a local .txt or plain-text file. Load sample demonstrates all three modes on multi-line copy.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy the result",
        text: "Use the copy button on the output panel to grab reversed text for another app, ticket, or classroom exercise.",
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
