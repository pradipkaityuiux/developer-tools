import type { Metadata } from "next";
import { imageCompressorFaqItems } from "@/lib/image-compressor-faq";

export const metadata: Metadata = {
  title:
    "Image compressor online — shrink JPEG & PNG with quality control (browser-only)",
  description:
    "Free online image compressor: upload JPEG or PNG, adjust JPEG quality, compare before/after file sizes, copy stats, and download—runs in your browser with the Canvas API. No server upload. Guides for Core Web Vitals, email attachments, and CMS uploads.",
  keywords: [
    "compress image online",
    "JPEG compressor",
    "PNG compressor",
    "reduce image file size",
    "image quality slider",
    "compress JPG",
    "optimize images for web",
    "client-side image compression",
    "Canvas toBlob JPEG",
    "before after image size",
  ],
  openGraph: {
    title: "Image compressor — JPEG quality & PNG export in the browser",
    description:
      "Shrink photos and screenshots with adjustable JPEG quality, PNG re-export, size stats, and one-click download—privacy-friendly, no upload.",
  },
};

const PAGE_PATH = "/files/image-compressor";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function ImageCompressorLayout({
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
    name: "Image compressor (JPEG & PNG)",
    url: pageUrl,
    description:
      "Free browser-based image compressor: choose JPEG with adjustable quality or lossless PNG re-encoding, compare original vs output bytes, copy a summary line, and download the result—processing stays local to the tab.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and Canvas 2D.",
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
        name: "Image compressor",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: imageCompressorFaqItems.map((item) => ({
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
    name: "How to compress JPEG and PNG images in the browser",
    description:
      "Upload an image, choose JPEG with a quality percentage or PNG for lossless output, review before/after sizes and previews, then download or copy stats for tickets and documentation.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Upload",
        text: "Click Upload image or drop a file onto the dashed area. Raster formats the browser can decode work best (JPEG, PNG, WebP, and similar).",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose output",
        text: "Pick JPEG to enable the quality slider (lower values save more bytes). Pick PNG for lossless re-encoding when you need crisp UI graphics without JPEG artifacts.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Review and export",
        text: "Compare original and compressed previews and the byte summary. Copy stats for Slack or Jira, or Download to save the compressed file locally.",
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
