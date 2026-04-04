import type { Metadata } from "next";
import { rsaKeyGeneratorFaqItems } from "@/lib/rsa-key-generator-faq";

export const metadata: Metadata = {
  title:
    "RSA key pair generator — 1024–4096 bit PEM public & private keys (browser-only)",
  description:
    "Free RSA key pair generator: create PEM-encoded public and private keys at 1024–4096 bits using Web Crypto in your browser. Copy keys for dev, demos, and local testing—no upload to a server.",
  keywords: [
    "RSA key generator",
    "RSA key pair generator online",
    "generate RSA public private key",
    "PEM key generator",
    "PKCS8 private key",
    "SPKI public key",
    "RSA 2048 generator",
    "RSA 4096 generator",
    "Web Crypto RSA",
    "local RSA keygen",
  ],
  openGraph: {
    title: "RSA key pair generator — PEM keys in your browser",
    description:
      "Generate RSA public/private PEM pairs at configurable modulus sizes. Private keys never leave your tab.",
  },
};

const PAGE_PATH = "/security/rsa-key-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function RsaKeyGeneratorLayout({
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
    name: "RSA key pair generator",
    url: pageUrl,
    description:
      "Browser-based RSA key pair generator: PEM public and PKCS#8 private keys at 1024–4096 bit modulus using the Web Cryptography API. Copy or upload PEM files locally.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and Web Crypto RSA support.",
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
        name: "RSA key pair generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: rsaKeyGeneratorFaqItems.map((item) => ({
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
    name: "How to generate an RSA key pair in PEM format",
    description:
      "Pick a modulus length, generate a key pair, copy PEM blocks, or upload an existing PEM file to inspect.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose modulus length",
        text: "Select 1024, 2048, 3072, or 4096 bits. Prefer 2048 or higher for new work; 1024 is legacy-only.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Generate",
        text: "Click Generate key pair to create fresh SPKI and PKCS#8 PEM text in the browser with Web Crypto.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy or upload",
        text: "Use Copy on each key or Copy public + private. Optionally upload a .pem file to load existing blocks into the fields.",
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
