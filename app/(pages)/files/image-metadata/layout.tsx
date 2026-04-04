import type { Metadata } from "next";
import { imageMetadataFaqItems } from "@/lib/image-metadata-faq";

export const metadata: Metadata = {
  title:
    "Image metadata viewer — EXIF online: camera, lens, GPS, exposure (free)",
  description:
    "Upload or drag a JPEG, PNG, WebP, or TIFF image to inspect EXIF and related metadata in your browser: camera, lens, ISO, aperture, shutter, dates, GPS coordinates, orientation, and software—copy a summary or JSON for reports. Private, client-side parsing.",
  keywords: [
    "EXIF viewer",
    "image metadata viewer",
    "EXIF online",
    "photo metadata",
    "camera EXIF",
    "GPS EXIF",
    "EXIF data reader",
    "JPEG metadata",
    "image forensics",
    "EXIF inspector",
    "lens metadata",
  ],
  openGraph: {
    title: "Image metadata viewer — EXIF, camera, GPS, exposure",
    description:
      "Read EXIF and image headers locally: dimensions, camera, lens, exposure, timestamps, and GPS when present. Copy summary or JSON.",
  },
};

const PAGE_PATH = "/files/image-metadata";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function ImageMetadataLayout({
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
    name: "Image metadata & EXIF viewer",
    url: pageUrl,
    description:
      "Free browser tool to inspect EXIF and embedded image metadata (camera, lens, exposure, timestamps, GPS when present) with local parsing, preview, and copyable summary or JSON export.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and File API.",
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
        name: "Image metadata viewer",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: imageMetadataFaqItems.map((item) => ({
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
    name: "How to view EXIF and image metadata online",
    description:
      "Upload or drop an image, review decoded dimensions and a grouped EXIF breakdown, then copy a plain-text summary or JSON for documentation, tickets, or archival notes.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Add an image",
        text: "Click Upload image or drag a file into the drop zone. JPEG, PNG, WebP, GIF, TIFF, and other types the browser can decode are supported; very large files may be slower in memory.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Review metadata groups",
        text: "Check pixel dimensions and file facts, then scan Camera & lens, Exposure, Dates, GPS, and Software sections. Remaining tags appear under All tags for a complete flat list.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy or clear",
        text: "Use Copy summary for a human-readable report or Copy JSON for machines. Clear loads another file. Nothing leaves your device unless you paste or upload elsewhere yourself.",
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
