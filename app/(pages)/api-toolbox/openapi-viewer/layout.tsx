import type { Metadata } from "next";
import { openapiViewerFaqItems } from "@/lib/openapi-viewer-faq";

export const metadata: Metadata = {
  title:
    "OpenAPI & Swagger viewer — browse paths, schemas, and examples in the browser",
  description:
    "Free OpenAPI viewer online: paste YAML or JSON (OpenAPI 3.x or Swagger 2.0), then explore operations, parameters, request bodies, responses, and component schemas—client-side, no upload. Ideal for API documentation review, contract QA, and onboarding.",
  keywords: [
    "OpenAPI viewer",
    "Swagger viewer",
    "OpenAPI YAML viewer",
    "OpenAPI JSON viewer",
    "browse OpenAPI spec",
    "API contract viewer",
    "Swagger 2.0 viewer",
    "OpenAPI 3 viewer",
    "REST API documentation tool",
    "components schemas viewer",
  ],
  openGraph: {
    title: "OpenAPI / Swagger viewer — paths, schemas, and operations",
    description:
      "Paste an OpenAPI or Swagger document and navigate paths, methods, and reusable schemas locally in your browser.",
  },
};

const PAGE_PATH = "/api-toolbox/openapi-viewer";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function OpenapiViewerLayout({
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
    name: "OpenAPI / Swagger viewer",
    url: pageUrl,
    description:
      "Browser-based viewer for OpenAPI 3.x and Swagger 2.0 specifications: parse YAML or JSON and explore API operations and schemas without sending data to a server.",
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
        name: "OpenAPI / Swagger viewer",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: openapiViewerFaqItems.map((item) => ({
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
    name: "How to use the OpenAPI viewer",
    description:
      "Paste or upload an OpenAPI or Swagger document, parse it in the browser, and navigate endpoints and schemas for documentation review.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste or upload your spec",
        text: "Paste OpenAPI YAML or JSON into the editor, or use Upload to load a .yaml, .yml, or .json file. Use Load sample to try a minimal Pet Store style document.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Parse and browse",
        text: "Click Parse spec. Review API title and version, server URLs (OpenAPI 3), then select operations from the list or open reusable schemas under Schemas.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy details",
        text: "Use Copy on the input for the full raw document, or Copy JSON in the detail panel for the selected operation or schema—useful for tickets, code review, or pairing with HTTP testing tools.",
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
