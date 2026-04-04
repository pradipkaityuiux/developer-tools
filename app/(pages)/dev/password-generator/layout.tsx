import type { Metadata } from "next";
import { passwordGeneratorFaqItems } from "@/lib/password-generator-faq";

export const metadata: Metadata = {
  title:
    "Password generator — strong random passwords, bulk mode, custom charset (free, private)",
  description:
    "Free online password generator: create strong random passwords with length, uppercase, lowercase, numbers, symbols, optional ambiguous-character exclusion, extra charset, and bulk copy for test accounts. Runs in your browser with Web Crypto.",
  keywords: [
    "password generator",
    "strong password generator",
    "random password generator",
    "bulk password generator",
    "secure password generator",
    "password generator for developers",
    "special characters password",
    "cryptographically secure password",
    "test account passwords",
    "charset password",
  ],
  openGraph: {
    title: "Password generator — strong random passwords in your browser",
    description:
      "Generate one or hundreds of random passwords with custom length and character sets. Copy instantly; nothing is uploaded.",
  },
};

const PAGE_PATH = "/dev/password-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function PasswordGeneratorLayout({
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
    name: "Strong password generator",
    url: pageUrl,
    description:
      "Browser-based password generator: configurable length, character classes, optional ambiguous-character exclusion, merge custom UTF-8 characters from text or file, bulk generation up to 500 passwords, copy-all output using Web Crypto randomness.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and Web Crypto getRandomValues.",
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
        name: "Password generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: passwordGeneratorFaqItems.map((item) => ({
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
    name: "How to generate strong random passwords online",
    description:
      "Choose password length and how many to create, enable character classes, optionally exclude ambiguous glyphs, add extra characters or load them from a UTF-8 file, generate with Web Crypto, then copy one or all passwords.",
    totalTime: "PT45S",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Set length and batch size",
        text: "Pick a length between 4 and 256 and a count between 1 and 500. Short lengths may be rejected if they cannot satisfy all enabled character classes after exclusions.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Configure the alphabet",
        text: "Toggle uppercase, lowercase, digits, and symbols. Turn on exclude ambiguous characters if you share passwords verbally. Add optional extra characters or load a UTF-8 charset file to extend the alphabet.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Generate and copy",
        text: "Click Generate passwords to sample fresh values with crypto.getRandomValues. Use Copy all or the output copy control to paste into a password manager, .env samples, or test fixtures.",
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
