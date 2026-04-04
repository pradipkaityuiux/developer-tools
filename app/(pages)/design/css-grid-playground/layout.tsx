import type { Metadata } from "next";
import { cssGridPlaygroundFaqItems } from "@/lib/css-grid-playground-faq";

export const metadata: Metadata = {
  title:
    "CSS Grid playground — visual grid template editor with live preview & copyable CSS (free)",
  description:
    "Free online CSS Grid playground: edit grid-template-columns and rows, row/column gap, justify and align items and content, grid-auto-flow, and per-item placement. Live preview and copy ready-to-paste CSS—runs in your browser.",
  keywords: [
    "CSS Grid playground",
    "CSS Grid generator",
    "grid-template-columns",
    "grid-template-rows",
    "grid gap tool",
    "grid-column grid-row",
    "CSS layout visualizer",
    "frontend grid tutorial",
    "interactive CSS Grid",
  ],
  openGraph: {
    title: "CSS Grid playground — template tracks, gaps, and placement",
    description:
      "Prototype grid tracks, gutters, and item spans with instant feedback; export clean CSS for dashboards, galleries, and page shells.",
  },
};

const PAGE_PATH = "/design/css-grid-playground";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function CssGridPlaygroundLayout({
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
    name: "CSS Grid playground",
    url: pageUrl,
    description:
      "Client-side CSS Grid lab: control template columns and rows, gaps, alignment, auto-flow, and nth-child placement rules; live preview and copyable CSS, optional JSON upload to restore layouts.",
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
        name: "CSS Grid playground",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: cssGridPlaygroundFaqItems.map((item) => ({
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
    name: "How to use the CSS Grid playground",
    description:
      "Set grid tracks and gaps, adjust container alignment, click items to change spans, then copy CSS or upload a saved JSON layout.",
    totalTime: "PT4M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Define the grid tracks",
        text: "Pick column and row presets or enter custom grid-template-columns and grid-template-rows. Watch the track structure update in the live preview.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Tune gaps and alignment",
        text: "Adjust row and column gap, justify-items, align-items, justify-content, align-content, and grid-auto-flow to match your layout intent.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Place grid items",
        text: "Click a numbered cell to select it. Edit column start, column span, row start, and row span. Add or remove items up to the tool limit.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Copy CSS or restore from file",
        text: "Use Copy CSS (copy icon) for your stylesheet. Use Upload (upload icon) to load a previously exported JSON layout.",
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
