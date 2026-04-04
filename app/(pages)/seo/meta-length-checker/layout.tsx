import type { Metadata } from "next";
import { metaLengthCheckerFaqItems } from "@/lib/meta-length-checker-faq";
import {
  DESC_IDEAL_MAX,
  DESC_IDEAL_MIN,
  TITLE_IDEAL_MAX,
  TITLE_WARNING_MAX,
} from "@/lib/meta-length-checker-core";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "Meta title & description length checker — SEO snippet limits before publish",
  description:
    "Free meta title and meta description length checker: count characters, see ideal ranges for search snippets, paste or upload HTML to import <title> and description tags. Includes SEO guide, how-to steps, and FAQs.",
  keywords: [
    "meta title length checker",
    "meta description length checker",
    "SEO title tag length",
    "meta description character count",
    "Google snippet length",
    "SERP title length",
    "meta description best length",
    "title tag SEO tool",
    "check meta description length",
    "on-page SEO preview",
  ],
  openGraph: {
    title: "Meta title & description length checker",
    description:
      "Count characters for page titles and meta descriptions, compare to common snippet bands, and import values from HTML—all in the browser.",
  },
};

const PAGE_PATH = "/seo/meta-length-checker";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function MetaLengthCheckerLayout({
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
    name: "Meta title & description length checker",
    url: pageUrl,
    description:
      "Free online tool to measure page title and meta description length against common search snippet planning bands, with optional HTML paste or file upload to extract <title>, meta name=\"description\", and Open Graph fallbacks in the browser.",
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
        name: "Meta title & description checker",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: metaLengthCheckerFaqItems.map((item) => ({
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
    name: "How to check meta title and description length",
    description:
      "Enter or import a page title and meta description, read character counts and guidance bands, then refine copy before publishing.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Draft or import your title and description",
        text: `Type directly into the fields, or paste HTML and click Apply, or upload a small HTML file. We extract the document title and meta description when present, with Open Graph fallbacks if classic tags are missing.`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Compare counts to planning bands",
        text: `Titles near ${TITLE_IDEAL_MAX} characters or fewer often fit many desktop SERP layouts; longer titles may truncate depending on pixels and query. Descriptions in roughly ${DESC_IDEAL_MIN}–${DESC_IDEAL_MAX} characters balance detail with typical snippet width. Beyond ~${TITLE_WARNING_MAX} characters for titles, truncation risk rises.`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy into your CMS and validate live",
        text: "Use the copy buttons to move clean text into your template or head manager. After publish, confirm real snippets and social cards with search and sharing debuggers because engines may rewrite text.",
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
