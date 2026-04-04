import type { Metadata } from "next";
import { passwordStrengthFaqItems } from "@/lib/password-strength-faq";

export const metadata: Metadata = {
  title:
    "Password strength meter — entropy, crack time estimates, and hardening tips (free)",
  description:
    "Free online password strength checker: estimate entropy in bits, compare rough crack times at online and offline speeds, and get practical hardening tips. Optional UTF-8 file upload for the first line. Runs locally in your browser—pair with our password generator and hash tools.",
  keywords: [
    "password strength meter",
    "password entropy calculator",
    "check password strength online",
    "password crack time estimate",
    "strong password tips",
    "password complexity checker",
    "bits of entropy",
    "brute force password",
    "password security",
  ],
  openGraph: {
    title: "Password strength meter — entropy and crack-time estimates in your browser",
    description:
      "Score candidate passwords with charset-based entropy, pattern warnings, and illustrative crack times—no server upload, optional .txt first-line import.",
  },
};

const PAGE_PATH = "/security/password-strength";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function PasswordStrengthLayout({
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
    name: "Password strength meter",
    url: pageUrl,
    description:
      "Browser-based password analyzer: estimates entropy from character classes, applies heuristics for common weak patterns, and shows illustrative brute-force crack times at several guess rates. Supports optional local text file import of the first non-empty line.",
    applicationCategory: "SecurityApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. No network calls for analysis after load.",
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
        name: "Password strength meter",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: passwordStrengthFaqItems.map((item) => ({
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
    name: "How to check password strength with this meter",
    description:
      "Enter a candidate password or upload a small UTF-8 text file to load the first line, review entropy and crack-time estimates, read warnings, then copy a text report for documentation or tickets.",
    totalTime: "PT3M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Provide a candidate",
        text: "Type in the password field or use Upload .txt to load the first non-empty line from a local file.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Interpret the score",
        text: "Read charset size, adjusted entropy in bits, the strength label, and illustrative crack times for throttled and fast offline attackers.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Harden and document",
        text: "Apply the hardening tips, generate a new random password with the password generator if needed, and use Copy report to save a plaintext summary—avoid sharing live production secrets in chat.",
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
