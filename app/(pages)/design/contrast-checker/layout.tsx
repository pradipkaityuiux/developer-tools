import type { Metadata } from "next";
import type { ReactNode } from "react";
import { contrastCheckerFaqItems } from "@/lib/contrast-checker-faq";

export const metadata: Metadata = {
  title:
    "Color contrast checker — WCAG AA & AAA text vs background (free, browser-based)",
  description:
    "Free WCAG color contrast checker: enter HEX or use pickers, see AA/AAA pass or fail for normal and large text, copy values, sample colors from uploaded images—runs entirely in your browser.",
  keywords: [
    "color contrast checker",
    "WCAG contrast ratio",
    "accessibility contrast",
    "text background contrast",
    "AA AAA contrast",
    "WCAG 2.1 contrast",
    "hex contrast calculator",
    "foreground background contrast",
    "large text contrast 3 to 1",
    "browser contrast checker",
    "accessible UI colors",
  ],
  openGraph: {
    title:
      "Color contrast checker — WCAG AA & AAA ratios for accessible typography",
    description:
      "Measure sRGB contrast between text and background colors, view WCAG thresholds, copy HEX and ratio, sample pixels from mockups—no server upload.",
  },
};

const PAGE_PATH = "/design/contrast-checker";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function ContrastCheckerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const origin = siteOrigin();
  const pageUrl = origin ? `${origin}${PAGE_PATH}` : PAGE_PATH;
  const homeUrl = origin ? `${origin}/` : "/";

  const webAppSchema = {
    "@type": "WebApplication",
    "@id": `${pageUrl}#webapp`,
    name: "WCAG color contrast checker (foreground and background)",
    url: pageUrl,
    description:
      "Client-side tool that computes WCAG 2.x sRGB contrast ratios between two colors, evaluates AA and AAA thresholds for normal and large text, supports HEX entry and color pickers, clipboard copy, and pixel sampling from locally loaded images via canvas—no colors are transmitted to a backend.",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript, Canvas 2D for optional image sampling.",
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
        name: "Color contrast checker",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: contrastCheckerFaqItems.map((item) => ({
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
    name: "How to check WCAG color contrast for text and UI",
    description:
      "Set foreground and background colors with pickers or HEX, read the contrast ratio and AA or AAA results, optionally sample colors from an uploaded image, then copy HEX values or the ratio string for design handoff.",
    totalTime: "PT3M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose text and background colors",
        text: "Use the color pickers or type HEX values for the text (foreground) and background. Use Swap colors if you need to reverse the pair quickly.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Read WCAG results",
        text: "Compare the computed ratio to AA and AAA rows for normal and large text. Large text uses the WCAG definition (18pt regular or 14pt bold and up, roughly).",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Sample from mockups (optional)",
        text: "Upload an image, choose whether clicks apply to text or background, then click the canvas to pick a pixel color. Copy HEX or the contrast ratio with the copy buttons.",
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
