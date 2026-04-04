import type { Metadata } from "next";
import type { ReactNode } from "react";
import { textDiffCheckerFaqItems } from "@/lib/text-diff-checker-faq";

export const metadata: Metadata = {
  title:
    "Text diff checker — compare two documents line by line online (free, private)",
  description:
    "Free online text diff tool: paste or upload two plain-text versions for a side-by-side line comparison with red removals and green additions, unified diff copy, and client-only processing—ideal for legal copy, policies, marketing drafts, and CMS exports.",
  keywords: [
    "text diff",
    "text diff checker",
    "compare two texts",
    "line by line diff",
    "document compare online",
    "plain text diff",
    "copy diff tool",
    "legal text comparison",
    "policy diff",
    "unified diff copy",
  ],
  openGraph: {
    title: "Text diff checker — side-by-side line comparison",
    description:
      "Paste or upload two text versions; see unchanged, removed, and added lines in your browser—no upload to a server.",
  },
};

const PAGE_PATH = "/text/diff-checker";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function TextDiffCheckerLayout({
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
    name: "Text diff checker",
    url: pageUrl,
    description:
      "Browser-based line diff for prose and plain text: paste or load two UTF-8 versions, view side-by-side alignment with removals and insertions highlighted, optional unified diff export—computed entirely client-side.",
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
        name: "Text diff checker",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: textDiffCheckerFaqItems.map((item) => ({
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
    name: "How to compare two text versions online",
    description:
      "Place an original and revised plain-text document in the two panels, optionally upload .txt files, then read the aligned view and copy a unified diff for notes or tickets.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Add the original text",
        text: "Paste the before version into the left panel or use Upload .txt to load a local UTF-8 file. Line breaks define rows; very large files should be split to stay within the per-side line limit.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Add the revised text",
        text: "Paste the after version on the right or upload a second file. Load sample demonstrates policy-style edits with multiple changed lines.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Review highlights and export",
        text: "Scan unchanged lines, red-tinted removals, and green-tinted additions. Use Copy unified diff for a compact +/- text block; clear both panels when moving to the next pair.",
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
