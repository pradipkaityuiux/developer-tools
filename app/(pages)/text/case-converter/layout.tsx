import type { Metadata } from "next";
import type { ReactNode } from "react";
import { caseConverterFaqItems } from "@/lib/case-converter-faq";

export const metadata: Metadata = {
  title:
    "Text case converter — uppercase, lowercase, camelCase, snake_case, kebab-case (free)",
  description:
    "Free online text case converter: switch between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case. Paste or upload .txt, copy results—runs in your browser. Guides for writers, developers, and SEO-friendly headings.",
  keywords: [
    "text case converter",
    "uppercase lowercase converter",
    "camelCase converter",
    "snake_case converter",
    "kebab-case converter",
    "title case online",
    "change text case",
    "string case converter",
    "variable name case",
    "SEO heading case",
  ],
  openGraph: {
    title:
      "Text case converter — UPPERCASE, camelCase, snake_case, and more",
    description:
      "Paste or upload text and convert case instantly in your browser—no sign-up.",
  },
};

const PAGE_PATH = "/text/case-converter";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function CaseConverterLayout({
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
    name: "Text case converter",
    url: pageUrl,
    description:
      "Free browser-based text case converter: uppercase, lowercase, title case, camelCase, snake_case, and kebab-case with optional .txt upload and clipboard copy—all client-side.",
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
        name: "Text case converter",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: caseConverterFaqItems.map((item) => ({
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
    name: "How to convert text case online",
    description:
      "Paste or upload plain text, choose uppercase, lowercase, title case, camelCase, snake_case, or kebab-case, then copy the result from your browser.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste or upload text",
        text: "Type in the box, paste from a doc or IDE, or use Upload .txt to load a UTF-8 plain-text file. Line breaks are preserved for uppercase, lowercase, and title case.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Pick a case style",
        text: "Select UPPERCASE or lowercase for full strings; Title Case for headings; camelCase, snake_case, or kebab-case for tokens split on spaces, hyphens, underscores, and camelCase boundaries.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy the output",
        text: "Use the copy control on the output area to place the converted text into your CMS, editor, or ticket. Nothing is uploaded to a server.",
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
