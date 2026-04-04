import type { Metadata } from "next";
import { regexTesterFaqItems } from "@/lib/regex-tester-faq";

export const metadata: Metadata = {
  title: "Regex tester & debugger — live JavaScript RegExp online",
  description:
    "Free online regex tester for JavaScript: toggle flags (g, i, m, s, u, y, d), highlight every match, inspect numbered and named capture groups, and fix syntax errors before shipping. Privacy-friendly—runs in your browser.",
  keywords: [
    "regex tester",
    "regex debugger",
    "regular expression tester",
    "JavaScript regex",
    "RegExp online",
    "regex flags",
    "capture groups",
    "named groups regex",
    "multiline regex",
    "regex highlight",
    "test regular expression",
  ],
  openGraph: {
    title: "Regex tester & debugger — JavaScript RegExp",
    description:
      "Test and debug JavaScript regular expressions with live highlights, capture groups, and flag toggles—no install, runs client-side.",
  },
};

const PAGE_PATH = "/dev/regex-tester";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function RegexTesterLayout({
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
    name: "Regex tester and debugger",
    url: pageUrl,
    description:
      "Client-side JavaScript regular expression tester with match highlighting, capture group inspection, and configurable RegExp flags.",
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
        name: "Regex tester",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: regexTesterFaqItems.map((item) => ({
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
    name: "How to test and debug a regular expression",
    description:
      "Enter a JavaScript RegExp pattern and sample text, choose flags, then review highlighted matches and capture groups in the table.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Write the pattern body",
        text: "Type the regular expression without surrounding slashes—only the pattern body you would place between delimiters in JavaScript. Use checkboxes to enable flags instead of typing them inside slashes.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Paste a realistic subject",
        text: "Add representative text: single-line and multiline samples, edge cases you expect in production, and known false positives. Turn on g when you need every occurrence, i for case folding, m for line anchors, and s when dot should cross newlines.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Read matches and groups",
        text: "Scan the highlighted preview for coverage, then use the match table for zero-based indexes, the full match text, numbered captures, and named groups. Fix compile errors shown in red before iterating again.",
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
