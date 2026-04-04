import type { Metadata } from "next";
import { whitespaceRemoverFaqItems } from "@/lib/whitespace-remover-faq";

export const metadata: Metadata = {
  title:
    "Whitespace remover — trim & normalize spaces online (paste or .txt upload)",
  description:
    "Free whitespace remover: trim document and lines, collapse extra spaces and tabs, handle blank lines—paste or upload .txt, copy results. Runs in your browser for forms, CSV prep, and pasted content from PDFs and spreadsheets.",
  keywords: [
    "whitespace remover",
    "remove extra spaces",
    "trim text online",
    "normalize whitespace",
    "collapse spaces",
    "clean pasted text",
    "strip leading trailing spaces",
    "tab to space cleanup",
    "remove blank lines",
    "text normalizer",
  ],
  openGraph: {
    title: "Whitespace remover — trim edges, normalize spacing (free)",
    description:
      "Clean pasted text with trim, per-line cleanup, space/tab collapse, and blank-line options—all client-side.",
  },
};

const PAGE_PATH = "/text/whitespace-remover";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function WhitespaceRemoverLayout({
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
    name: "Whitespace remover",
    url: pageUrl,
    description:
      "Browser-based tool to trim pasted or uploaded text, optionally trim each line, collapse horizontal runs of spaces and tabs, and keep, collapse, or remove blank lines—without sending content to a server.",
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
        name: "Whitespace remover",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: whitespaceRemoverFaqItems.map((item) => ({
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
    name: "How to remove extra whitespace from text",
    description:
      "Paste or upload text, choose trim and space-collapse options, pick how blank lines should behave, then copy the cleaned result for forms, CSVs, or editors.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste or upload",
        text: "Paste content into the input area or use Upload .txt to load UTF-8 plain text from your computer.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose cleanup rules",
        text: "Enable trim for the whole document and/or each line, toggle collapse spaces and tabs within lines, and set blank lines to keep, collapse consecutive empties, or remove all empty lines.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy output",
        text: "Review character and line counts, then use the copy control on the output panel to move normalized text into a form, spreadsheet, or repository.",
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
