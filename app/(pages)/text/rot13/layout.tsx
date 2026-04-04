import type { Metadata } from "next";
import type { ReactNode } from "react";
import { rot13FaqItems } from "@/lib/rot13-faq";

export const metadata: Metadata = {
  title:
    "ROT13 encoder & decoder — online Caesar ROT 13 cipher (free, browser-only)",
  description:
    "Free ROT13 encoder and decoder: rotate A–Z by 13 places in your browser. Encode or decode spoilers, puzzles, and CTF clues—paste text or upload .txt, copy results. Guides, keywords, and FAQs for ROT13 vs Caesar cipher and security.",
  keywords: [
    "ROT13 encoder",
    "ROT13 decoder",
    "ROT13 online",
    "rotate 13 cipher",
    "Caesar ROT13",
    "encode ROT13",
    "decode ROT13",
    "Usenet spoiler",
    "CTF cipher tool",
    "substitution cipher",
    "text obfuscation",
  ],
  openGraph: {
    title: "ROT13 encoder & decoder — instant in-browser",
    description:
      "Paste or upload plain text and apply ROT13 with one live preview—no sign-up, no server upload of your content.",
  },
};

const PAGE_PATH = "/text/rot13";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function Rot13Layout({ children }: { children: ReactNode }) {
  const origin = siteOrigin();
  const pageUrl = origin ? `${origin}${PAGE_PATH}` : PAGE_PATH;
  const homeUrl = origin ? `${origin}/` : "/";

  const webAppSchema = {
    "@type": "WebApplication",
    "@id": `${pageUrl}#webapp`,
    name: "ROT13 encoder and decoder",
    url: pageUrl,
    description:
      "Free browser-based ROT13 tool: rotate Latin letters by 13 positions for encode/decode in one step, optional .txt upload and clipboard copy—all client-side.",
    applicationCategory: "DeveloperApplication",
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
        name: "ROT13 encoder & decoder",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: rot13FaqItems.map((item) => ({
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
    name: "How to use the ROT13 encoder online",
    description:
      "Paste or upload plain text; the page shows ROT13 output live. Copy the result or run ROT13 again to return to the original letters.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste or upload text",
        text: "Type in the box, paste from any app, or use Upload .txt for UTF-8 plain text. Line breaks and non-letters stay as-is.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Read the ROT13 output",
        text: "Each A–Z and a–z letter moves 13 positions in the alphabet with wraparound. Digits and punctuation are not rotated.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy or decode again",
        text: "Use the copy control on the output panel. Because ROT13 is self-inverse, pasting the output back through the tool restores the original message.",
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
