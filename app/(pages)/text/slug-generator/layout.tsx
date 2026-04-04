import type { Metadata } from "next";
import { slugGeneratorFaqItems } from "@/lib/slug-generator-faq";

export const metadata: Metadata = {
  title:
    "Free URL slug generator — SEO-friendly, lowercase, hyphenated slugs online",
  description:
    "Turn blog titles, product names, and headings into URL-safe slugs: lowercase, hyphen-separated, Unicode-aware. Paste or upload text, copy results, single or per-line mode—all in your browser.",
  keywords: [
    "slug generator",
    "URL slug generator",
    "SEO slug",
    "permalink generator",
    "blog slug",
    "hyphenated URL",
    "title to slug",
    "online slugify",
    "friendly URL",
    "lowercase slug",
  ],
  openGraph: {
    title: "URL slug generator — paste titles, copy path-safe slugs",
    description:
      "Generate lowercase hyphen slugs from titles or batch lines. Runs client-side with optional file upload.",
  },
};

const PAGE_PATH = "/text/slug-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function SlugGeneratorLayout({
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
    name: "URL slug generator",
    url: pageUrl,
    description:
      "Free browser-based slug generator: convert titles to lowercase hyphenated URL segments, optional per-line batching, paste or upload text, copy slugs—no server upload of content.",
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
        name: "Slug generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: slugGeneratorFaqItems.map((item) => ({
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
    name: "How to generate URL slugs from titles",
    description:
      "Paste or upload titles, choose single slug or one slug per line, then copy path-safe lowercase hyphen slugs for CMS fields or routes.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Add titles",
        text: "Paste a headline, product name, or multiline list. Optionally upload a .txt or plain-text file to load many rows at once.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Pick output mode",
        text: "Use single slug when a wrapped title should become one segment; use per line when each row should become its own slug for imports or spreadsheets.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy slugs",
        text: "Click copy to place slugs on the clipboard, then paste into your CMS permalink field, route table, or redirect map.",
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
