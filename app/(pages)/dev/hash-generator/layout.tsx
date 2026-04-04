import type { Metadata } from "next";
import { hashGeneratorFaqItems } from "@/lib/hash-generator-faq";

export const metadata: Metadata = {
  title:
    "Hash generator online — MD5, SHA-1, SHA-256, SHA-512 from text (UTF-8, free)",
  description:
    "Free browser hash generator: compute MD5, SHA-1, SHA-256, and SHA-512 digests from any string using UTF-8 encoding. Copy hex checksums for APIs, downloads, and testing—no upload, client-side Web Crypto and MD5.",
  keywords: [
    "hash generator",
    "online hash calculator",
    "MD5 generator",
    "SHA-256 hash",
    "SHA-512 hash",
    "SHA-1 hash",
    "text checksum",
    "hex digest",
    "UTF-8 hash",
    "cryptographic hash",
    "checksum tool",
  ],
  openGraph: {
    title: "Hash generator — MD5, SHA-1, SHA-256, SHA-512",
    description:
      "Paste text to generate MD5 and SHA-family hashes in your browser with UTF-8 encoding and one-click copy.",
  },
};

const PAGE_PATH = "/dev/hash-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function HashGeneratorLayout({
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
    name: "Hash generator (MD5, SHA-1, SHA-256, SHA-512)",
    url: pageUrl,
    description:
      "Free client-side hash generator: MD5 via js-md5 and SHA-1, SHA-256, SHA-512 via the Web Crypto API. Text is hashed as UTF-8 bytes; copy lowercase hexadecimal digests for checksums and developer testing.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and a browser that supports Web Crypto digest algorithms.",
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
        name: "Hash generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: hashGeneratorFaqItems.map((item) => ({
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
    name: "How to generate MD5 and SHA hashes from text online",
    description:
      "Paste or type text, review UTF-8 byte length, and copy MD5, SHA-1, SHA-256, or SHA-512 hexadecimal digests for checksums and API examples.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter your string",
        text: "Paste passwords (for testing only), JSON snippets, URLs, or release notes. Every space and newline is included; the tool shows the UTF-8 byte length so you can compare with file or CLI output.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Read the digests",
        text: "After a short debounce, the table fills with MD5 and SHA-family hashes in lowercase hex. If SHA-1 is blocked in your browser, the error appears in that row only; MD5 and other SHA algorithms may still work.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy values",
        text: "Use per-algorithm Copy or Copy all digests to paste into tickets, manifests, or test scripts. Match upstream documentation: prefer SHA-256 or SHA-512 for modern integrity checks.",
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
