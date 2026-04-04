import type { Metadata } from "next";
import { bcryptGeneratorFaqItems } from "@/lib/bcrypt-generator-faq";

export const metadata: Metadata = {
  title:
    "bcrypt hash generator online — cost factor, salt rounds, verify password (free)",
  description:
    "Free bcrypt generator in your browser: set salt rounds (cost factor), generate $2a$/$2b$ hashes from plaintext, copy with one click, and verify passwords against stored hashes. For dev and testing—guides for Node, PHP, and secure password storage.",
  keywords: [
    "bcrypt generator",
    "bcrypt hash online",
    "bcrypt salt rounds",
    "bcrypt cost factor",
    "password hash bcrypt",
    "bcrypt compare",
    "bcryptjs",
    "generate bcrypt hash",
    "test bcrypt",
    "modular crypt format",
  ],
  openGraph: {
    title: "bcrypt hash generator — configurable rounds and verify",
    description:
      "Generate bcrypt hashes with tunable cost, copy results, and verify plaintext against hashes locally in your browser.",
  },
};

const PAGE_PATH = "/security/bcrypt-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function BcryptGeneratorLayout({
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
    name: "bcrypt hash generator",
    url: pageUrl,
    description:
      "Client-side bcrypt hash generator and verifier using bcryptjs: configurable cost factor (4–15), random salt per hash, copy-to-clipboard output, UTF-8 length hints, and bcrypt.compare for password checks—all without sending data to a server.",
    applicationCategory: "SecurityApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript for bcrypt hashing (bcryptjs).",
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
        name: "bcrypt hash generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: bcryptGeneratorFaqItems.map((item) => ({
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
    name: "How to generate and verify bcrypt hashes in the browser",
    description:
      "Choose generate or verify mode, enter plaintext and cost or paste a stored hash, use Upload for text files and Copy for the output, and interpret UTF-8 byte limits and random salts correctly.",
    totalTime: "PT3M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Generate a hash",
        text: "Enter a test password, slide the cost factor between 4 and 15, then click Generate bcrypt hash. Copy the modular crypt string with the Copy control (copy icon) when you need it in fixtures or documentation.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Optional file input",
        text: "Click Upload (upload icon) to load a UTF-8 .txt file into the plaintext field instead of pasting by hand.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Verify a password",
        text: "Switch to Verify password, paste the plaintext and the stored bcrypt hash, then click Compare. The tool reports match or mismatch using the same compare semantics as server libraries.",
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
