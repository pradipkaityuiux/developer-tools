import type { Metadata } from "next";
import { aesEncryptDecryptFaqItems } from "@/lib/aes-encrypt-decrypt-faq";

export const metadata: Metadata = {
  title:
    "AES-256 encrypt & decrypt online — passphrase, GCM, PBKDF2 (browser, free)",
  description:
    "Free AES-256-GCM encryption in your browser: derive a key with PBKDF2 from a passphrase, encrypt UTF-8 text to a v1 ciphertext bundle, decrypt locally. Copy output; upload files. No server upload—Web Crypto only.",
  keywords: [
    "AES encrypt online",
    "AES-256 decrypt",
    "AES-GCM browser",
    "PBKDF2 passphrase",
    "client-side encryption",
    "Web Crypto AES",
    "encrypt text with password",
    "authenticated encryption",
    "symmetric encryption tool",
    "JavaScript AES example",
  ],
  openGraph: {
    title: "AES-256 encrypt and decrypt — GCM + PBKDF2 in the browser",
    description:
      "Encrypt and decrypt text with AES-256-GCM and PBKDF2 key stretching. Bundles include salt, IV, and iteration count for reproducible decryption.",
  },
};

const PAGE_PATH = "/security/aes-encrypt-decrypt";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function AesEncryptDecryptLayout({
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
    name: "AES-256 encrypt and decrypt (GCM, PBKDF2)",
    url: pageUrl,
    description:
      "Browser-based AES-256-GCM encryption and decryption with PBKDF2-HMAC-SHA256 passphrase stretching, random salt and IV, and a versioned ciphertext bundle format. Copy and upload helpers; no network upload for crypto.",
    applicationCategory: "SecurityApplication",
    operatingSystem: "Any",
    browserRequirements:
      "Requires JavaScript and Web Crypto (AES-GCM, PBKDF2, SHA-256).",
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
        name: "AES encrypt and decrypt",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: aesEncryptDecryptFaqItems.map((item) => ({
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
    name: "How to encrypt and decrypt text with AES-256 in the browser",
    description:
      "Choose encrypt or decrypt mode, set a passphrase and PBKDF2 iterations for encryption, paste plaintext or a v1 ciphertext bundle, run the operation, then copy the result.",
    totalTime: "PT3M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose mode and passphrase",
        text: "Pick Encrypt for new ciphertext or Decrypt to recover UTF-8 text. Enter a strong passphrase; iteration count applies when encrypting and is embedded in the bundle.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Provide input",
        text: "Paste plaintext or the v1 bundle line. Optionally use Upload file to load a UTF-8 text file into the input area.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Run and copy",
        text: "Click Encrypt or Decrypt, then use Copy output to move the result elsewhere. Decryption uses the passphrase plus data stored in the bundle.",
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
