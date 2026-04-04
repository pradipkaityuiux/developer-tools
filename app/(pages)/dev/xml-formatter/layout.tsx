import type { Metadata } from "next";
import type { ReactNode } from "react";
import { xmlFormatterFaqItems } from "@/lib/xml-formatter-faq";

export const metadata: Metadata = {
  title: "XML formatter & validator — beautify, minify & check well-formed XML",
  description:
    "Free online XML formatter and validator: pretty-print or minify XML in the browser, catch parser errors, and review structure stats (root, depth, element counts). Ideal for RSS, Atom, SOAP, configs, and API payloads.",
  keywords: [
    "XML formatter",
    "XML validator",
    "pretty print XML",
    "XML beautifier",
    "minify XML",
    "online XML formatter",
    "well-formed XML check",
    "XML parse errors",
    "format XML online",
    "XML structure viewer",
  ],
  openGraph: {
    title: "XML formatter & validator — format and validate in your browser",
    description:
      "Paste XML to format, minify, or validate. Get clear parse errors and structure insight—no server upload.",
  },
};

const PAGE_PATH = "/dev/xml-formatter";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function XmlFormatterLayout({ children }: { children: ReactNode }) {
  const origin = siteOrigin();
  const pageUrl = origin ? `${origin}${PAGE_PATH}` : PAGE_PATH;
  const homeUrl = origin ? `${origin}/` : "/";

  const webAppSchema = {
    "@type": "WebApplication",
    "@id": `${pageUrl}#webapp`,
    name: "XML formatter and validator",
    url: pageUrl,
    description:
      "Client-side XML formatter and validator: beautify or minify XML, validate well-formedness, and inspect document structure without uploading content to a server.",
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
        name: "XML formatter & validator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: xmlFormatterFaqItems.map((item) => ({
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
    name: "How to format and validate XML online",
    description:
      "Paste XML into the tool, run format or minify to rewrite whitespace, or validate only to confirm well-formed syntax while viewing structure statistics.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste your XML",
        text: "Copy configuration files, RSS or Atom snippets, SOAP envelopes, or API responses into the input panel. You can load the built-in sample to see how formatting behaves.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose format, minify, or validate",
        text: "Click Format / beautify for indented markup, Minify to collapse non-essential whitespace between tags, or Validate only to confirm the document parses without changing layout intent beyond echoing the input.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Fix errors and copy the result",
        text: "If the parser reports an error, adjust unclosed tags, entities, or quotes. When the document is valid, review structure insight (root, depth, tag counts), then copy the output for editors, tickets, or commits.",
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
