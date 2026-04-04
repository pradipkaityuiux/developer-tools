import type { Metadata } from "next";
import { schemaGeneratorFaqItems } from "@/lib/schema-generator-faq";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "Schema markup generator — JSON-LD for Article, FAQ, Product, Review (free)",
  description:
    "Free schema markup generator: build valid JSON-LD for Article, FAQPage, Product, Review, Organization, and BreadcrumbList. Copy, download, or upload to edit. Structured data for SEO and rich results—runs in your browser.",
  keywords: [
    "schema markup generator",
    "JSON-LD generator",
    "structured data generator",
    "FAQ schema generator",
    "Product schema JSON-LD",
    "Article schema markup",
    "Review schema markup",
    "BreadcrumbList schema",
    "Organization schema",
    "Google rich results",
    "Schema.org",
  ],
  openGraph: {
    title: "Schema markup generator — JSON-LD for SEO",
    description:
      "Fill forms to output copy-ready JSON-LD for articles, FAQs, products, reviews, organizations, and breadcrumbs.",
  },
};

const PAGE_PATH = "/seo/schema-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function SchemaGeneratorLayout({
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
    name: "Schema markup generator (JSON-LD)",
    url: pageUrl,
    description:
      "Interactive browser tool to compose Schema.org JSON-LD for Article, FAQPage, Product, Review, Organization, and BreadcrumbList. Export as raw JSON or wrapped in a script tag for HTML. Supports upload for editing existing markup.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements:
      "Requires JavaScript for forms, clipboard, and file read.",
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
        name: "Schema markup generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: schemaGeneratorFaqItems.map((item) => ({
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
    name: "How to generate and deploy JSON-LD schema markup",
    description:
      "Choose a schema type, complete the fields, copy or download JSON-LD, then paste into your page or CMS. Validate with Google Rich Results Test before publishing.",
    totalTime: "PT10M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Pick a schema type",
        text: "Select Article, FAQ, Product, Review, Organization, or Breadcrumb to match the main entity on the page.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Fill required fields",
        text: "Use absolute HTTPS URLs for images and canonical pages. For FAQ, ensure questions match visible content on the page.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Export and implement",
        text: "Copy JSON-LD or enable “Wrap in script tag” for HTML. Place in head or body. Optionally upload an existing file to tweak, then validate in Rich Results Test.",
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
