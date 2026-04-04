import type { Metadata } from "next";
import { codeDiffFaqItems } from "@/lib/code-diff-faq";

export const metadata: Metadata = {
  title:
    "Code diff checker — compare two code blocks side by side online (free)",
  description:
    "Free online code diff tool: paste original and modified text for a side-by-side line comparison with clear add/remove highlighting, unified copy, and local-only processing—ideal for PR-style reviews, snippets, and config checks.",
  keywords: [
    "code diff",
    "text diff online",
    "compare code",
    "side by side diff",
    "line diff",
    "diff checker",
    "paste diff",
    "code review tool",
    "unified diff",
    "git diff style",
  ],
  openGraph: {
    title: "Code diff checker — side-by-side comparison",
    description:
      "Compare two code blocks with line-level highlights; runs entirely in your browser.",
  },
};

const PAGE_PATH = "/dev/code-diff";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function CodeDiffLayout({
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
    name: "Code diff checker",
    url: pageUrl,
    description:
      "Browser-based line diff: paste two versions to view side-by-side alignment with removals on the left, additions on the right, unchanged context preserved, optional unified diff copy, without uploading source to a server.",
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
        name: "Code diff checker",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: codeDiffFaqItems.map((item) => ({
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
    name: "How to compare two code blocks online",
    description:
      "Paste an original and modified snippet to generate a line-aligned side-by-side diff with summary counts and optional unified-text export.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste original text",
        text: "Put the previous version in the left (original) field—an old file, main-branch snippet, or ticket “before” block. Line breaks define rows; very large pastes should be split to stay under the per-side line limit.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Paste modified text",
        text: "Add the new version on the right. Optionally load the built-in sample to see TypeScript-style edits with removals and insertions highlighted.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Read the alignment and copy if needed",
        text: "Scan unchanged lines, red-tinted removals, and green-tinted additions. Use Copy unified diff for a compact +/- text block to drop into notes or chat; keep Git for authoritative merges.",
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
