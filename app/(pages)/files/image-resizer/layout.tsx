import type { Metadata } from "next";
import type { ReactNode } from "react";
import { imageResizerFaqItems } from "@/lib/image-resizer-faq";

export const metadata: Metadata = {
  title:
    "Image resizer online — resize by pixels or percentage in your browser (free)",
  description:
    "Free online image resizer: set exact width and height or scale by percentage, optional aspect ratio lock, export PNG, JPEG, or WebP, download or copy the result—runs entirely client-side with no server upload.",
  keywords: [
    "image resizer",
    "resize image online",
    "resize photo by percentage",
    "resize PNG JPEG WebP",
    "browser image resize",
    "privacy image resizer",
    "canvas resize image",
    "scale image dimensions",
    "resize screenshot",
    "client-side image resize",
  ],
  openGraph: {
    title: "Image resizer — pixels, percentage, PNG/JPEG/WebP (client-side)",
    description:
      "Upload or drag an image, choose pixel or percent scaling, lock aspect ratio, then download or copy—no upload to a backend.",
  },
};

const PAGE_PATH = "/files/image-resizer";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function ImageResizerLayout({ children }: { children: ReactNode }) {
  const origin = siteOrigin();
  const pageUrl = origin ? `${origin}${PAGE_PATH}` : PAGE_PATH;
  const homeUrl = origin ? `${origin}/` : "/";

  const webAppSchema = {
    "@type": "WebApplication",
    "@id": `${pageUrl}#webapp`,
    name: "Browser image resizer (pixels and percentage)",
    url: pageUrl,
    description:
      "Client-side image resizer that loads raster images from disk, computes target width and height from pixels or percentage with optional aspect ratio lock, renders to canvas, and exports PNG, JPEG, or WebP with optional JPEG quality—supports download and clipboard copy where supported.",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript, Canvas, and FileReader.",
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
        name: "Image resizer",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: imageResizerFaqItems.map((item) => ({
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
    name: "How to resize an image by pixels or percentage online",
    description:
      "Upload an image, choose pixel or percentage mode, adjust dimensions with optional aspect lock, pick an output format, then download the file or copy the bitmap to the clipboard.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Add an image",
        text: "Click Upload image or drag a file into the drop zone. PNG, JPEG, WebP, and GIF decode in most browsers; SVG is not resized on this page.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose scaling mode",
        text: "Use percentage to scale both axes together, or pixels for exact output width and height. Enable aspect ratio lock in pixel mode to avoid stretching when you edit one dimension.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Export",
        text: "Select PNG, JPEG, or WebP, adjust JPEG quality if needed, preview the output size, then use Download resized image or Copy image when your browser supports image clipboard writes.",
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
