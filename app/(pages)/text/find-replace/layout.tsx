import type { Metadata } from "next";
import { findReplaceFaqItems } from "@/lib/find-replace-faq";

export const metadata: Metadata = {
  title:
    "Find & replace online — plain text or regex bulk search in browser (free)",
  description:
    "Free find and replace tool: paste or upload .txt, swap literals or JavaScript regex patterns with global replace, optional case and multiline flags, copy results—runs locally in your browser. Guides for logs, configs, copy edits, and bulk renames.",
  keywords: [
    "find and replace",
    "find replace online",
    "text find replace",
    "bulk find replace",
    "regex find replace",
    "search and replace tool",
    "replace text in document",
    "case insensitive replace",
    "javascript regex replace",
    "browser find replace",
  ],
  openGraph: {
    title: "Find & replace — plain text or regex, all client-side",
    description:
      "Search long pasted text for literals or regex and replace every match; upload .txt, tune flags, copy the result—no server upload.",
  },
};

const PAGE_PATH = "/text/find-replace";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function FindReplaceLayout({
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
    name: "Find & replace tool",
    url: pageUrl,
    description:
      "Browser-based find and replace for pasted or uploaded plain text: literal search with optional case sensitivity, or JavaScript regular expressions with global replace and optional i, m, s flags.",
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
        name: "Find & replace",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: findReplaceFaqItems.map((item) => ({
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
    name: "How to find and replace text online",
    description:
      "Paste a document, choose plain text or regex mode, enter find and replace strings, then copy the updated text from the result panel.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste or upload",
        text: "Paste content into the document area or use Upload .txt to load UTF-8 plain text from your computer.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose mode and options",
        text: "Use plain text for literal matches and toggle match case as needed. Switch to regular expression for pattern-based search; enable ignore case, multiline, or dot-all when your pattern requires them.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Replace and copy",
        text: "Enter the find and replace fields. Review the result panel and match count, then use the copy control to move the updated text into your editor, ticket, or CMS.",
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
