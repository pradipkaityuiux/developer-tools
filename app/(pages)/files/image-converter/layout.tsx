import type { Metadata } from "next";
import { imageConverterFaqItems } from "@/lib/image-converter-faq";

export const metadata: Metadata = {
  title:
    "Image format converter — JPG, PNG & WebP online (local, free, no upload)",
  description:
    "Convert images between JPEG, PNG, and WebP in your browser: choose output format, tune JPEG/WebP quality, preview before download, and copy the result to the clipboard. Client-side only—ideal for CMS assets, email, and Core Web Vitals.",
  keywords: [
    "image format converter",
    "JPG to PNG",
    "PNG to WebP",
    "WebP to JPG",
    "convert image online",
    "JPEG to PNG transparent",
    "image converter browser",
    "local image conversion",
    "CMS image formats",
    "email image JPG",
  ],
  openGraph: {
    title: "Image format converter — JPG, PNG, WebP (runs in your browser)",
    description:
      "Switch between JPEG, PNG, and WebP with quality control and previews—no server upload.",
  },
};

const PAGE_PATH = "/files/image-converter";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function ImageConverterLayout({
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
    name: "Image format converter (JPG, PNG, WebP)",
    url: pageUrl,
    description:
      "Free browser tool to convert raster images between JPEG, PNG, and WebP using the Canvas API: format selection, quality slider for lossy codecs, before/after preview, download with a sensible filename, and optional clipboard copy—no backend upload.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements:
      "Requires JavaScript, Canvas, and FileReader; WebP encoding requires a modern browser.",
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
        name: "Image format converter",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: imageConverterFaqItems.map((item) => ({
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
    name: "How to convert an image between JPG, PNG, and WebP online",
    description:
      "Upload a local image or drop it on the page, pick JPEG, PNG, or WebP, adjust quality for lossy formats, then download the new file or copy the bitmap to the clipboard.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Add an image",
        text: "Click Upload image or drag a PNG, JPEG, WebP, or other raster file into the dashed area. The tool shows dimensions and original file size.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose format and quality",
        text: "Select WebP for smaller web assets, JPEG for photos and email when transparency is not needed, or PNG for lossless graphics. Use the quality slider for JPEG and WebP; PNG ignores quality because it is lossless.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Download or copy",
        text: "Compare the converted preview and output size, then Download with an updated extension or Copy image to paste into compatible apps. Use Clear to start over.",
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
