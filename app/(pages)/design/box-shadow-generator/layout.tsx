import type { Metadata } from "next";
import { boxShadowGeneratorFaqItems } from "@/lib/box-shadow-generator-faq";

export const metadata: Metadata = {
  title:
    "CSS box shadow generator — offset, blur, spread, color & inset with live preview",
  description:
    "Free online box shadow generator: adjust horizontal and vertical offset, blur, spread, color opacity, and inset mode; preview on a card or your own background image; copy production-ready box-shadow CSS. Works in the browser—no signup.",
  keywords: [
    "box shadow generator",
    "CSS box-shadow",
    "drop shadow generator",
    "inset box shadow",
    "shadow blur spread",
    "copy box shadow CSS",
    "card shadow CSS",
    "elevation shadow UI",
    "design token shadow",
    "rgba shadow",
  ],
  openGraph: {
    title:
      "Box shadow generator — live preview & copyable CSS",
    description:
      "Tune offset, blur, spread, color, and inset shadows with instant preview. Optional background upload. One-click copy for box-shadow declarations.",
  },
};

const PAGE_PATH = "/design/box-shadow-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function BoxShadowGeneratorLayout({
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
    name: "CSS Box Shadow Generator",
    url: pageUrl,
    description:
      "Interactive tool to design CSS box-shadow values: control offset, blur, spread, color with adjustable opacity, toggle inset shadows, preview on a sample card or custom background image, and copy a ready-to-paste box-shadow declaration.",
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
        name: "Box shadow generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: boxShadowGeneratorFaqItems.map((item) => ({
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
    name: "How to generate and copy a CSS box shadow",
    description:
      "Adjust shadow sliders and color, optionally upload a preview background, then copy the box-shadow declaration into your stylesheet or design handoff.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose a preset or set values",
        text: "Pick a quick preset (soft card, floating, crisp drop, or inset well) or move offset X/Y, blur, spread, color, and opacity until the preview matches your intent.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Optional background",
        text: "Upload background with the upload control to see how the shadow reads on photography or UI chrome. Clear the background to return to the neutral preview.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy CSS",
        text: "Click Copy CSS to place the full box-shadow declaration on the clipboard and paste into your project.",
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
