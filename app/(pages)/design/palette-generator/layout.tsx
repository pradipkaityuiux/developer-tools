import type { Metadata } from "next";
import { paletteGeneratorFaqItems } from "@/lib/palette-generator-faq";

export const metadata: Metadata = {
  title:
    "Color palette generator — complementary, triadic, analogous & monochrome (free)",
  description:
    "Free online color palette generator: pick a base hue or upload an image, then copy HEX for complementary, triadic, analogous, and monochromatic schemes. Browser-only, with CSS variables export. Guides for brand UI, accessibility, and design systems.",
  keywords: [
    "color palette generator",
    "complementary colors",
    "triadic color scheme",
    "analogous palette",
    "monochrome palette",
    "hex color palette",
    "CSS color variables",
    "harmony colors",
    "brand palette tool",
    "HSL color wheel",
    "extract color from image",
  ],
  openGraph: {
    title:
      "Color palette generator — harmony schemes from one base color",
    description:
      "Build complementary, triadic, analogous, and monochrome palettes with copyable HEX and CSS custom properties—runs locally in your browser.",
  },
};

const PAGE_PATH = "/design/palette-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function PaletteGeneratorLayout({
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
    name: "Color palette generator",
    url: pageUrl,
    description:
      "Browser-based color harmony tool: choose a base color with HSL controls or sample an uploaded image, then copy HEX swatches and CSS variable blocks for complementary, triadic, analogous, and monochrome palettes.",
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript, Canvas 2D for image sampling.",
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
        name: "Color palette generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: paletteGeneratorFaqItems.map((item) => ({
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
    name: "How to generate harmony palettes from a base color",
    description:
      "Set a base color with the picker or hex field, optionally upload an image to sample an average color, adjust HSL for your brand, then copy individual HEX codes, comma-separated lists, or CSS custom properties for each harmony type.",
    totalTime: "PT3M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose base color",
        text: "Use the color input, type a HEX value, or drag saturation and lightness sliders until the base matches your brand or mood board.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Optional image sample",
        text: "Click Upload image to average colors from a photo or screenshot—then refine hue and saturation so the derived palette fits your UI.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy and validate",
        text: "Copy swatches or entire palette rows. Paste HEX into Figma tokens or CSS. Validate text contrast and color-blind safety with linked accessibility tools before launch.",
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
