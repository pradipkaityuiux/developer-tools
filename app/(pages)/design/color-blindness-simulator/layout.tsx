import type { Metadata } from "next";
import type { ReactNode } from "react";
import { colorBlindnessFaqItems } from "@/lib/color-blindness-faq";

export const metadata: Metadata = {
  title:
    "Color blindness simulator — preview images & palettes for CVD (free, in-browser)",
  description:
    "Simulate protanopia, deuteranopia, tritanopia, and achromatopsia on uploaded images and HEX palettes. Adjust severity, copy simulated colors—runs locally in your browser for inclusive UI and data-viz checks.",
  keywords: [
    "color blindness simulator",
    "CVD simulator",
    "protanopia preview",
    "deuteranopia simulator",
    "tritanopia simulator",
    "accessible color palette",
    "color blind friendly design",
    "simulate color vision deficiency",
    "inclusive UI colors",
    "data visualization accessibility",
    "WCAG and color blindness",
  ],
  openGraph: {
    title:
      "Color blindness simulator — images & palettes for inclusive design",
    description:
      "Preview how charts, UIs, and brand colors look under common color vision deficiencies. Client-side, private, with copyable HEX output.",
  },
};

const PAGE_PATH = "/design/color-blindness-simulator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function ColorBlindnessSimulatorLayout({
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
    name: "Color blindness simulator (CVD preview for images and palettes)",
    url: pageUrl,
    description:
      "Browser-based tool that applies physiologically inspired color vision deficiency models to raster images and HEX palettes, with adjustable severity for red–green and blue–yellow simulations, optional grayscale preview, and clipboard export—no server-side image upload.",
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    browserRequirements:
      "Requires JavaScript, Canvas 2D, and the File API for image preview.",
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
        name: "Color blindness simulator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: colorBlindnessFaqItems.map((item) => ({
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
    name: "How to simulate color blindness for UI and palette QA",
    description:
      "Choose a deficiency model and severity, upload an image or paste HEX codes, compare original vs simulated output, and copy simulated colors for documentation—then validate contrast separately for text.",
    totalTime: "PT5M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Pick a simulation mode",
        text: "Select protanopia, deuteranopia, tritanopia, or achromatopsia—or normal as a reference. Use the severity slider for red–green and blue–yellow models to interpolate between mild and strong deficiency.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Preview an image or palette",
        text: "On the Image tab, upload a PNG, JPEG, WebP, or GIF with the upload control. On the Palette tab, paste space- or comma-separated HEX values to see side-by-side swatches.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy and iterate",
        text: "Copy simulated HEX lists or a CSS comment block from the palette view. Adjust colors in your design tool, then re-check contrast with the WCAG contrast checker and real-user feedback.",
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
