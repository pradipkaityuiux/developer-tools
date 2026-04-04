import type { Metadata } from "next";
import { colorPickerFaqItems } from "@/lib/color-picker-faq";

export const metadata: Metadata = {
  title:
    "Color picker & converter — HEX, RGB, HSL, CMYK online (free, client-side)",
  description:
    "Pick colors in your browser: native color input, optional screen eyedropper (Chromium), upload an image and click to sample pixels. Copy HEX, rgb(), hsl(), and cmyk() strings for CSS and design handoff—no server upload.",
  keywords: [
    "color picker online",
    "HEX to RGB converter",
    "RGB to HSL converter",
    "RGB to CMYK",
    "color converter",
    "eyedropper tool",
    "sample color from image",
    "CSS color picker",
    "design token colors",
    "sRGB color values",
  ],
  openGraph: {
    title: "Color picker & converter — HEX, RGB, HSL, CMYK",
    description:
      "Pick, convert, and copy color values locally in your browser with optional image sampling and screen eyedropper.",
  },
};

const PAGE_PATH = "/design/color-picker";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function ColorPickerLayout({
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
    name: "Color picker and color value converter",
    url: pageUrl,
    description:
      "Free browser tool to pick colors, convert between HEX, RGB, HSL, and CMYK, copy CSS-ready strings, sample from uploaded images, and use the system eyedropper when supported—all client-side.",
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    browserRequirements:
      "Requires JavaScript. EyeDropper API optional (Chromium).",
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
        name: "Color picker & converter",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: colorPickerFaqItems.map((item) => ({
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
    name: "How to pick and convert colors online",
    description:
      "Choose a color with the native picker or type HEX, adjust RGB/HSL/CMYK fields, copy formatted strings, or upload an image and click to sample a pixel.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose a color",
        text: "Use the color swatch control, edit the HEX field, or adjust R/G/B and H/S/L numerically. On supported browsers, use Sample from screen with the eyedropper.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Copy values",
        text: "Click Copy next to HEX, RGB, HSL, or CMYK to place CSS-friendly strings on the clipboard for stylesheets, Figma notes, or tokens.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Sample from an image (optional)",
        text: "Upload a PNG, JPEG, or similar image, then click the preview to read the exact pixel under the cursor into all formats.",
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
