import type { Metadata } from "next";
import { jsonFormatterFaqItems } from "@/lib/json-formatter-faq";

export const metadata: Metadata = {
  title:
    "JSON formatter & validator — pretty-print, minify & tree view (free)",
  description:
    "Free online JSON formatter and validator: beautify with indentation, minify payloads, catch syntax errors with line hints, and explore objects in a collapsible tree—all client-side for privacy. Learn best practices for API debugging and config review.",
  keywords: [
    "JSON formatter",
    "JSON validator",
    "JSON pretty print",
    "JSON beautifier",
    "minify JSON",
    "JSON tree viewer",
    "format JSON online",
    "validate JSON syntax",
    "JSON.parse errors",
    "API response formatter",
  ],
  openGraph: {
    title: "JSON formatter & validator — format, minify, and explore",
    description:
      "Paste JSON to validate, pretty-print, minify, and browse a collapsible structure—runs locally in your browser.",
  },
};

const PAGE_PATH = "/dev/json-formatter";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function JsonFormatterLayout({
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
    name: "JSON formatter and validator",
    url: pageUrl,
    description:
      "Free browser-based JSON formatter: validate syntax, pretty-print with indentation, minify whitespace, copy results, and inspect nested data in an expandable tree without uploading payloads.",
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
        name: "JSON formatter and validator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: jsonFormatterFaqItems.map((item) => ({
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
    name: "How to format and validate JSON online",
    description:
      "Paste JSON into the editor, validate syntax, switch between pretty-printed and minified views, and explore nested keys in a collapsible tree.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste or type JSON",
        text: "Copy a response from an API client, a fragment from application logs, or a config snippet. The editor accepts a single JSON value: object, array, string, number, boolean, or null.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Validate and format",
        text: "Click Format and validate to pretty-print with two-space indentation and confirm the document parses. If parsing fails, read the error, line or column hint, and fix commas, quotes, or trailing delimiters.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Minify, copy, or use the tree",
        text: "Use Minify when you need a compact line for curl, webhooks, or storage. Copy sends the current editor text to the clipboard. Expand nodes in the tree to scan large objects without horizontal scrolling.",
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
