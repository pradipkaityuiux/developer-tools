import type { Metadata } from "next";
import { hreflangGeneratorFaqItems } from "@/lib/hreflang-generator-faq";

export const metadata: Metadata = {
  title:
    "Hreflang tag generator — multilingual SEO alternate links (free online)",
  description:
    "Free hreflang generator: pair URLs with language and region codes, output valid HTML link rel=alternate tags for international SEO. Copy or upload CSV—runs in your browser with x-default guidance.",
  keywords: [
    "hreflang generator",
    "hreflang tag generator",
    "multilingual SEO",
    "hreflang HTML",
    "alternate hreflang",
    "x-default hreflang",
    "international SEO",
    "hreflang cluster",
    "language region codes",
    "Google hreflang",
  ],
  openGraph: {
    title: "Hreflang tag generator — alternate links for multilingual sites",
    description:
      "Build reciprocal hreflang clusters for your localized pages. Preview HTML for the head, upload a URL list, copy in one click.",
  },
};

const PAGE_PATH = "/seo/hreflang-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function HreflangGeneratorLayout({
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
    name: "Hreflang tag generator",
    url: pageUrl,
    description:
      "Browser-based tool to build HTML link elements with rel=alternate and hreflang for multilingual and multinational sites. Add rows for each locale, optionally upload CSV, then copy tags for your head section.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements:
      "Requires JavaScript for the form, file upload, and clipboard copy.",
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
        name: "Hreflang tag generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: hreflangGeneratorFaqItems.map((item) => ({
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
    name: "How to generate hreflang tags for a multilingual site",
    description:
      "List each localized URL with its hreflang code, include x-default when appropriate, review warnings, then copy the HTML link tags into every page in the cluster.",
    totalTime: "PT8M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Map URLs to locales",
        text: "For each language or region version, add a row with the canonical page URL and a BCP 47 hreflang value such as en, en-GB, or de.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Add x-default",
        text: "When you have multiple locales, add an x-default row pointing to your fallback URL (for example a language selector or primary market).",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Deploy and verify",
        text: "Paste the same block into the head of every alternate page, keep self-referencing canonicals, then test redirects and indexing with your SEO toolkit.",
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
