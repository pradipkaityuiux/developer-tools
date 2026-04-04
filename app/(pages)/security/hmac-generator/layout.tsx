import type { Metadata } from "next";
import { hmacGeneratorFaqItems } from "@/lib/hmac-generator-faq";

export const metadata: Metadata = {
  title:
    "HMAC generator online — HMAC-SHA256 & HMAC-SHA512 for webhooks and APIs (free)",
  description:
    "Free HMAC generator in your browser: compute HMAC-SHA256 or HMAC-SHA512 with a UTF-8 secret over any message. Copy hex or Base64 signatures for webhook verification, API testing, and integration debugging—Web Crypto only, optional file upload for secret and payload.",
  keywords: [
    "HMAC generator",
    "HMAC SHA256 online",
    "HMAC SHA512",
    "webhook signature generator",
    "HMAC calculator",
    "signed request testing",
    "UTF-8 HMAC",
    "hex HMAC",
    "Base64 HMAC",
    "API signature tool",
    "client-side HMAC",
  ],
  openGraph: {
    title: "HMAC generator — SHA256 & SHA512 keyed signatures locally",
    description:
      "Paste a secret and message, choose HMAC-SHA256 or HMAC-SHA512, copy hex or Base64 output. Upload small text files to load key or body.",
  },
};

const PAGE_PATH = "/security/hmac-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function HmacGeneratorLayout({
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
    name: "HMAC generator (SHA-256, SHA-512)",
    url: pageUrl,
    description:
      "Browser-based HMAC generator using Web Crypto: HMAC-SHA256 and HMAC-SHA512 over UTF-8 secret and message, with hex or Base64 output and copy-to-clipboard. Optional UTF-8 file upload for key or payload.",
    applicationCategory: "SecurityApplication",
    operatingSystem: "Any",
    browserRequirements:
      "Requires JavaScript and Web Crypto HMAC with SHA-256 or SHA-512.",
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
        name: "HMAC generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: hmacGeneratorFaqItems.map((item) => ({
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
    name: "How to generate an HMAC-SHA256 or HMAC-SHA512 signature online",
    description:
      "Enter a UTF-8 secret and the exact message bytes to sign, choose HMAC-SHA256 or HMAC-SHA512 and hex or Base64 output, then copy the signature to compare with your server or provider documentation.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Set the secret",
        text: "Paste the signing key or upload a small UTF-8 text file. Toggle show to verify characters. Length shown is UTF-8 byte length.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Paste the payload",
        text: "Type or paste the raw body (often JSON) exactly as verified on the wire. Upload a file if that is easier. Watch byte length when debugging mismatches.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Choose algorithm and encoding",
        text: "Pick HMAC-SHA256 or HMAC-SHA512 and hex or Base64 to match your integration. Copy the signature with the copy icon for tickets or tests.",
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
