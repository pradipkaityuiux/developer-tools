import type { Metadata } from "next";
import { mimeTypeLookupFaqItems } from "@/lib/mime-type-lookup-faq";

export const metadata: Metadata = {
  title:
    "MIME type lookup — extension to Content-Type for APIs, uploads & HTTP headers (free)",
  description:
    "Free MIME type lookup: map file extensions to Content-Type values, or reverse lookup from media types to common extensions. Compare browser File.type with a large catalog—copy for headers, OpenAPI, and multipart uploads. Client-side only, optional file upload for metadata.",
  keywords: [
    "MIME type lookup",
    "Content-Type lookup",
    "extension to MIME",
    "media type finder",
    "file extension to MIME type",
    "API Content-Type",
    "multipart MIME",
    "OpenAPI content type",
    "upload MIME type",
    "reverse MIME lookup",
    "browser File.type",
  ],
  openGraph: {
    title: "MIME type lookup — extensions and Content-Type for developers",
    description:
      "Resolve filenames and extensions to MIME types, or list extensions for a type. Upload a file to compare with the browser-reported type. Copy results locally.",
  },
};

const PAGE_PATH = "/api-toolbox/mime-type-lookup";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function MimeTypeLookupLayout({
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
    name: "MIME type lookup (extension ↔ Content-Type)",
    url: pageUrl,
    description:
      "Browser-based MIME and file extension lookup: map paths and extensions to Content-Type values, reverse lookup types to extensions, optional file upload to compare File.type, copy to clipboard—no server upload for lookup.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and clipboard API for copy.",
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
        name: "MIME type lookup",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: mimeTypeLookupFaqItems.map((item) => ({
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
    name: "How to look up MIME types and Content-Type from filenames",
    description:
      "Enter a filename or extension to get a primary MIME type with optional alternatives, or paste a MIME type to list extensions. Use upload to compare the browser File.type and copy values for HTTP headers and API docs.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter a filename or type",
        text: "Type a path, basename, bare extension, or a MIME type for reverse lookup. Compound extensions like .tar.gz are handled before the final segment alone.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Copy or compare",
        text: "Use the copy icon next to MIME or extension list. Optionally upload a file to fill the name and compare File.type with the catalog.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Use in APIs and docs",
        text: "Paste Content-Type into fetch headers, server config, or OpenAPI. Use related tools for HTTP requests, JSON formatting, and OpenAPI viewing.",
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
