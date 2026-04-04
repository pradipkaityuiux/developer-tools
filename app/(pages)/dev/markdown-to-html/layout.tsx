import type { Metadata } from "next";
import { markdownToHtmlFaqItems } from "@/lib/markdown-to-html-faq";

export const metadata: Metadata = {
  title:
    "Markdown to HTML converter — GFM, live preview & copy HTML (free)",
  description:
    "Free online Markdown to HTML converter: turn headings, lists, code fences, links, and GitHub-Flavored tables into clean HTML with a sandboxed live preview—runs in your browser. Guides for blogs, CMS paste, email snippets, and static sites.",
  keywords: [
    "Markdown to HTML",
    "convert Markdown online",
    "MD to HTML",
    "GitHub Flavored Markdown",
    "GFM to HTML",
    "Markdown preview",
    "HTML from Markdown",
    "Markdown converter",
    "documentation Markdown",
    "CMS Markdown paste",
    "static site Markdown",
  ],
  openGraph: {
    title: "Markdown to HTML — convert with live preview",
    description:
      "Paste Markdown, copy HTML, and preview safely in the browser—no upload required.",
  },
};

const PAGE_PATH = "/dev/markdown-to-html";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function MarkdownToHtmlLayout({
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
    name: "Markdown to HTML converter",
    url: pageUrl,
    description:
      "Free browser-based Markdown to HTML converter: parse GFM-style Markdown into HTML fragments, copy output, and view a sandboxed rendered preview without sending content to a server.",
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
        name: "Markdown to HTML converter",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: markdownToHtmlFaqItems.map((item) => ({
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
    name: "How to convert Markdown to HTML online",
    description:
      "Paste Markdown, review the generated HTML, optionally preview it in a sandboxed frame, and copy the fragment into your editor or CMS.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste Markdown",
        text: "Copy from your editor, Notion export, GitHub issue, or README. Fenced code blocks, lists, headings, blockquotes, and GFM tables are supported.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Review HTML output",
        text: "The HTML panel updates from your Markdown. Fix any parser errors shown in the status line, then use Copy HTML to grab the fragment.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Preview and integrate",
        text: "Enable the live preview to check structure in isolation. Paste the HTML into your static site, email builder, or rich text field, then apply your own CSS or sanitizer rules in production.",
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
