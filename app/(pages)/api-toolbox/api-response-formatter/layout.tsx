import type { Metadata } from "next";
import { apiResponseFormatterFaqItems } from "@/lib/api-response-formatter-faq";

export const metadata: Metadata = {
  title:
    "API response formatter — JSON & XML pretty-print, validate, tree view",
  description:
    "Free online API response formatter for JSON and XML: paste REST or SOAP payloads, pretty-print with indentation, validate syntax, minify for logs, upload a file, and explore nested data in a collapsible tree—all client-side for privacy.",
  keywords: [
    "API response formatter",
    "format JSON response",
    "pretty print XML response",
    "REST API response viewer",
    "SOAP XML formatter",
    "validate JSON online",
    "XML tree viewer",
    "JSON tree viewer",
    "API debugging tool",
    "webhook payload formatter",
    "client-side JSON formatter",
  ],
  openGraph: {
    title: "API response formatter — JSON & XML validate & tree view",
    description:
      "Paste JSON or XML API responses to format, validate, minify, and browse structure in your browser.",
  },
};

const PAGE_PATH = "/api-toolbox/api-response-formatter";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function ApiResponseFormatterLayout({
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
    name: "API response formatter (JSON and XML)",
    url: pageUrl,
    description:
      "Browser-based formatter for JSON and XML API responses: validate structure, beautify or minify output, upload files, copy results, and inspect nested keys and elements in an expandable tree without sending data to a server.",
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
        name: "API response formatter",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: apiResponseFormatterFaqItems.map((item) => ({
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
    name: "How to format and validate API responses (JSON or XML)",
    description:
      "Choose Auto or a fixed format, paste or upload a response, validate and pretty-print, optionally minify, copy the result, and use the collapsible tree to explore nested fields or elements.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose format detection",
        text: "Use Auto to infer JSON versus XML from the payload, or lock to JSON or XML when you already know the media type from Content-Type headers or API documentation.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Paste or upload the response body",
        text: "Paste from curl, Postman, browser devtools, or log tailers. Use Upload file for .json or .xml saved from a proxy or HAR export.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Format, validate, and navigate",
        text: "Click Format and validate to indent consistently, Minify for compact storage, Copy with the toolbar control, and expand nodes in the tree to scan large graphs without horizontal scrolling.",
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
