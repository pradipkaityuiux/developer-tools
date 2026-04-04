import type { Metadata } from "next";
import { readabilityFaqItems } from "@/lib/readability-faq";

export const metadata: Metadata = {
  title:
    "Free readability score checker — Flesch Reading Ease & Flesch–Kincaid grade",
  description:
    "Paste English copy to compute Flesch Reading Ease, Flesch–Kincaid grade level, estimated syllables, and plain-language suggestions. Client-side SEO writing assistant with upload and copy summary—no server upload of your draft.",
  keywords: [
    "readability checker",
    "Flesch Reading Ease",
    "Flesch Kincaid grade level",
    "readability score",
    "SEO readability",
    "content readability",
    "reading ease calculator",
    "grade level checker",
    "plain language tool",
    "blog readability",
  ],
  openGraph: {
    title:
      "Readability score checker — Flesch-style metrics & suggestions (free)",
    description:
      "Analyze drafts in the browser: Flesch Reading Ease, grade level, syllable estimates, and actionable tips for clearer web copy.",
  },
};

const PAGE_PATH = "/seo/readability-checker";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function ReadabilityCheckerLayout({
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
    name: "Readability score checker",
    url: pageUrl,
    description:
      "Free browser-based readability analyzer: Flesch Reading Ease, Flesch–Kincaid grade level, estimated syllables and sentences, plain-text summary with suggestions—computed locally.",
    applicationCategory: "UtilitiesApplication",
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
        name: "Readability score checker",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: readabilityFaqItems.map((item) => ({
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
    name: "How to check readability for SEO and editorial QA",
    description:
      "Paste or upload text, review Flesch Reading Ease and grade level, read suggestions, and copy a summary for your content brief or ticket.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Add your draft",
        text: "Paste from a CMS, doc, or notes app, or click Upload file to load .txt or Markdown. Load sample text if you want to see typical scores first.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Interpret the scores",
        text: "Compare Flesch Reading Ease (higher is easier) and Flesch–Kincaid grade level to your audience brief. Review estimated words, sentences, and syllables—short snippets are noisier than full sections.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Apply suggestions and share",
        text: "Use the bullet suggestions to tighten sentences or simplify vocabulary. Click Copy summary to paste metrics into Slack, Jira, or an editorial checklist alongside other SEO tools.",
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
