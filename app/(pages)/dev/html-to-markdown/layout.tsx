import type { Metadata } from "next";
import { htmlToMarkdownFaqItems } from "@/lib/html-to-markdown-faq";

export const metadata: Metadata = {
  title:
    "HTML to Markdown converter — free online (GFM, tables, client-side)",
  description:
    "Convert HTML snippets and pages to GitHub Flavored Markdown in the browser: headings, lists, links, images, code fences, tables, and task lists. Free guide for CMS migration, README cleanup, and docs workflows—no upload.",
  keywords: [
    "HTML to Markdown",
    "HTML to MD converter",
    "convert HTML to Markdown online",
    "GFM converter",
    "Turndown",
    "CMS HTML to Markdown",
    "documentation migration",
    "README HTML cleanup",
    "paste HTML get Markdown",
    "client-side HTML Markdown",
  ],
  openGraph: {
    title: "HTML to Markdown converter — GFM, runs in your browser",
    description:
      "Paste HTML, choose Markdown options, copy GFM output. Ideal for docs, blogs, and static site content prep.",
  },
};

const PAGE_PATH = "/dev/html-to-markdown";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function HtmlToMarkdownLayout({
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
    name: "HTML to Markdown converter",
    url: pageUrl,
    description:
      "Client-side HTML to GitHub Flavored Markdown conversion: paste markup, tune heading and list styles, copy Markdown for documentation, CMS exports, and README migration.",
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
        name: "HTML to Markdown converter",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: htmlToMarkdownFaqItems.map((item) => ({
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
    name: "How to convert HTML to Markdown online",
    description:
      "Paste HTML from a CMS, email, or editor, adjust Markdown style options, run conversion, and copy GitHub-flavored Markdown for docs or static sites.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste your HTML",
        text: "Copy markup from a browser view source, CMS export, email template, or IDE. Fragments and article-sized chunks work best; remove chrome you do not need before converting.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose Markdown options",
        text: "Pick ATX or setext headings, a bullet list marker, and fenced versus indented code blocks so the output matches your team’s Markdown style guide or linter.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Convert and copy",
        text: "Click Convert to Markdown, review the right-hand panel for structure and tables, then use Copy Markdown to paste into GitHub, Notion, VS Code, or your static site content folder.",
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
