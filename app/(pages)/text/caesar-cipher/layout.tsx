import type { Metadata } from "next";
import type { ReactNode } from "react";
import { caesarCipherFaqItems } from "@/lib/caesar-cipher-faq";

export const metadata: Metadata = {
  title:
    "Caesar cipher encoder & decoder — custom shift, encrypt/decrypt online (free)",
  description:
    "Free Caesar cipher tool: encrypt or decrypt text with any shift 0–25. Paste or upload .txt, copy output—runs in your browser. Learn how Caesar shifts work, ROT13 relation, and safe use for education and puzzles.",
  keywords: [
    "Caesar cipher",
    "Caesar cipher online",
    "Caesar shift encoder",
    "Caesar cipher decoder",
    "encrypt text Caesar",
    "decrypt Caesar cipher",
    "substitution cipher",
    "shift cipher",
    "ROT13 vs Caesar",
    "classical cipher tool",
  ],
  openGraph: {
    title: "Caesar cipher — encrypt & decrypt with a custom shift",
    description:
      "Browser-only Caesar cipher: pick shift, encrypt or decrypt Latin letters, copy results. Upload .txt supported.",
  },
};

const PAGE_PATH = "/text/caesar-cipher";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function CaesarCipherLayout({
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
    name: "Caesar cipher encoder and decoder",
    url: pageUrl,
    description:
      "Free browser-based Caesar cipher: choose encrypt or decrypt, set letter shift (modulo 26), paste or upload UTF-8 plain text, copy ciphertext or plaintext—all client-side.",
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
        name: "Caesar cipher tool",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: caesarCipherFaqItems.map((item) => ({
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
    name: "How to use the Caesar cipher tool online",
    description:
      "Paste or upload text, choose encrypt or decrypt, set the letter shift, then copy the transformed text from your browser.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter your text",
        text: "Paste into the input area or use Upload .txt for a UTF-8 plain-text file. Load sample demonstrates a short phrase with mixed case.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Set shift and direction",
        text: "Pick Encrypt to shift A–Z and a–z forward, or Decrypt to shift backward. Enter any integer shift; the tool uses the value modulo 26.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy the result",
        text: "Use the copy control on the output panel. Non-letters, spaces, and digits stay unchanged so you can mix prose and codes.",
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
