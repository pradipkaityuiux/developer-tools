import type { Metadata } from "next";
import { textToBinaryFaqItems } from "@/lib/text-to-binary-faq";

export const metadata: Metadata = {
  title:
    "Free text to binary converter — UTF-8 encode & decode online",
  description:
    "Convert plain text to binary (UTF-8 bytes) and decode binary strings back to readable text in your browser. Spaced or compact bit output, paste or upload .txt, copy results—ideal for learning, demos, and documentation.",
  keywords: [
    "text to binary",
    "binary to text",
    "string to binary",
    "binary converter online",
    "UTF-8 binary",
    "ascii to binary",
    "decode binary string",
    "binary encoder",
    "text to bits",
    "binary translator",
  ],
  openGraph: {
    title: "Text to binary converter — UTF-8 encode & decode",
    description:
      "Encode text to 8-bit binary per UTF-8 byte or decode 0/1 streams back to Unicode—all client-side with copy and file upload.",
  },
};

const PAGE_PATH = "/text/text-to-binary";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function TextToBinaryLayout({
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
    name: "Text to binary converter (UTF-8)",
    url: pageUrl,
    description:
      "Free browser-based UTF-8 text to binary encoder and binary-to-text decoder: spaced or compact bit output, paste or upload plaintext, copy results, strict UTF-8 decoding with helpful errors—no server processing of your content.",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript.",
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
        name: "Text to binary converter",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: textToBinaryFaqItems.map((item) => ({
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
    name: "How to convert text to binary and back online",
    description:
      "Choose encode or decode, paste or upload text, pick spaced or compact binary output when encoding, then copy the result for notes or code samples.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Pick a direction",
        text: "Select Encode to turn readable text into UTF-8 bytes written as 0 and 1, or Decode to turn a bit stream (spaces and line breaks allowed) back into Unicode text.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Add input",
        text: "Paste from any editor or click Upload file to load a local .txt or plain-text file. Use Load sample to see a short demo string.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Adjust binary formatting (encode only)",
        text: "When encoding, choose Spaces between bytes for readable groups of eight bits, or Compact for one continuous string. Decoding ignores non-binary characters automatically.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Copy the output",
        text: "Use Copy output to grab binary or decoded text. If decode fails, fix the bit length (multiple of eight) or UTF-8 validity and try again.",
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
