import type { Metadata } from "next";
import { tintShadeFaqItems } from "@/lib/tint-shade-faq";

export const metadata: Metadata = {
  title:
    "Tint and shade generator — build color scales from one brand hex (free, browser-only)",
  description:
    "Free online tint and shade generator: enter a base hex or sample a color from an image to produce lighter tints and darker shades for UI systems. Copy HEX or CSS custom properties—runs locally in your browser for design handoff and token docs.",
  keywords: [
    "tint and shade generator",
    "color tint generator",
    "color shade generator",
    "brand color scale",
    "design system color ramp",
    "hex color scale",
    "CSS color variables generator",
    "lighter and darker color from hex",
    "UI color palette from one color",
    "mix color with white black",
  ],
  openGraph: {
    title: "Tint & shade generator — scales from a single brand color",
    description:
      "Generate lighter tints and darker shades, copy HEX lists or :root CSS variables for tokens and components.",
  },
};

const PAGE_PATH = "/design/tint-shade-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function TintShadeGeneratorLayout({
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
    name: "Tint and shade generator (brand color scales)",
    url: pageUrl,
    description:
      "Client-side tool to build a visual scale of lighter tints (mix toward white) and darker shades (mix toward black) from one base hex color, with optional average color sampling from an uploaded image, copyable HEX swatches, and CSS custom properties for design systems.",
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript, Canvas, and Clipboard API for copy actions.",
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
        name: "Tint & shade generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: tintShadeFaqItems.map((item) => ({
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
    name: "How to generate tints and shades from a brand color",
    description:
      "Set a base hex or sample a color from an image, choose how many steps to mix toward white and black, then copy individual swatches, a full HEX list, or CSS custom properties for your design system.",
    totalTime: "PT3M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose a base color",
        text: "Use the color picker or type a six-digit hex value. Optionally click Sample from image and select a logo or screenshot—the tool averages opaque pixels locally in your browser.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Set the scale depth",
        text: "Adjust steps per side to control how many tints and shades appear between the base and near-white or near-black mixes. More steps yield a finer ramp for complex products.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy for handoff",
        text: "Click any swatch to copy its HEX, or use Copy all HEX / Copy CSS variables for tokens. Use the contrast checker for accessible text and background pairs.",
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
