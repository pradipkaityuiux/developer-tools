import type { Metadata } from "next";
import { imageToBase64FaqItems } from "@/lib/image-to-base64-faq";

export const metadata: Metadata = {
  title:
    "Image to Base64 converter — data URI generator for HTML, CSS & APIs (free)",
  description:
    "Convert images to Base64 data URIs in your browser: live preview, copy full data:image/...;base64,... strings or raw Base64 for JSON APIs. PNG, JPEG, WebP, GIF, SVG—drag-and-drop or upload, no server upload.",
  keywords: [
    "image to Base64",
    "Base64 image converter",
    "data URI generator",
    "image data URI",
    "encode image Base64",
    "Base64 PNG online",
    "inline image HTML",
    "CSS background Base64",
    "API image Base64",
    "FileReader data URL",
  ],
  openGraph: {
    title: "Image to Base64 — data URI & Base64 copy (client-side)",
    description:
      "Turn local images into data URIs or raw Base64 with preview and one-click copy—runs entirely in the browser.",
  },
};

const PAGE_PATH = "/files/image-to-base64";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function ImageToBase64Layout({
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
    name: "Image to Base64 converter (data URI)",
    url: pageUrl,
    description:
      "Free browser tool to convert image files to Base64 data URIs with live preview, optional PEM-style line wrapping for the Base64 payload, and copy buttons for full data: strings or raw Base64—no upload to a backend.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and FileReader.",
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
        name: "Image to Base64 converter",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: imageToBase64FaqItems.map((item) => ({
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
    name: "How to convert an image to Base64 or a data URI online",
    description:
      "Choose an image from your device or drag it into the drop zone, review the preview, then copy either the full data URI for HTML/CSS or the raw Base64 string for APIs and configuration.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Add an image",
        text: "Click Upload image or drag a file onto the dashed area. Supported types include common raster and vector images the browser can decode (PNG, JPEG, WebP, GIF, SVG, and more).",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Review output",
        text: "Check the preview and the full data:image/...;base64,... string. Toggle line wrapping if you want readable 76-character rows for documentation.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy for your stack",
        text: "Use Copy on the data URI for img src or CSS url(), or Copy on Base64 only when an API expects the payload without the prefix. Clear and repeat for another file as needed.",
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
