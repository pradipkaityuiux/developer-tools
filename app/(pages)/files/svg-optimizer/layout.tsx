import type { Metadata } from "next";
import { svgOptimizerFaqItems } from "@/lib/svg-optimizer-faq";

export const metadata: Metadata = {
  title:
    "SVG optimizer online — minify & clean SVG markup for smaller files (free, browser-only)",
  description:
    "Free SVG minifier: paste or upload .svg, remove comments and scripts, strip optional metadata and editor cruft (Inkscape, Figma-style exports), shorten hex colors, and copy compact markup—runs entirely in your browser.",
  keywords: [
    "SVG optimizer",
    "SVG minifier",
    "minify SVG online",
    "clean SVG markup",
    "compress SVG",
    "reduce SVG file size",
    "Inkscape SVG cleanup",
    "Figma SVG export optimize",
    "inline SVG performance",
    "SVG for web",
  ],
  openGraph: {
    title: "SVG optimizer — minify & clean vector markup in the browser",
    description:
      "Shrink SVGs with safe cleanup: whitespace, comments, metadata, and editor attributes—copy production-ready output in one click.",
  },
};

const PAGE_PATH = "/files/svg-optimizer";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function SvgOptimizerLayout({
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
    name: "SVG optimizer (minifier)",
    url: pageUrl,
    description:
      "Client-side SVG minifier that parses markup with DOMParser, removes comments and scripts, optionally strips metadata and design-tool attributes, shortens hex colors, and serializes compact SVG for faster pages and cleaner repos.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and DOMParser.",
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
        name: "SVG optimizer",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: svgOptimizerFaqItems.map((item) => ({
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
    name: "How to minify and clean an SVG online",
    description:
      "Paste SVG source or upload a file, enable optional metadata and editor-data removal, review the minified output and live preview, then copy the optimized markup into your project.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Load SVG",
        text: "Paste markup into the input area or click Upload SVG to read a local .svg file. You can also drag a file onto the drop zone.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose cleanup options",
        text: "Toggle Remove metadata to drop the metadata element. Toggle Strip editor attributes to remove common design-tool namespaces and attributes that browsers do not need at runtime.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy optimized SVG",
        text: "Review byte savings, confirm the preview looks correct, then use the Copy button (copy icon) next to the output to place minified SVG on the clipboard.",
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
