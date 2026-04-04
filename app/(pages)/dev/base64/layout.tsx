import type { Metadata } from "next";
import { base64FaqItems } from "@/lib/base64-faq";

export const metadata: Metadata = {
  title:
    "Base64 encoder & decoder — UTF-8 text, files, URL-safe (free online)",
  description:
    "Free Base64 encoder and decoder in your browser: UTF-8 text, file upload to Base64, optional URL-safe (Base64URL) output, PEM-style line wrapping, and data URI paste support. Guides for APIs, JWT payloads, and data URLs—no upload to our servers.",
  keywords: [
    "Base64 encoder",
    "Base64 decoder",
    "Base64 encode online",
    "Base64 decode UTF-8",
    "Base64URL",
    "URL safe Base64",
    "data URI Base64",
    "encode file to Base64",
    "btoa UTF-8",
    "RFC 4648",
  ],
  openGraph: {
    title: "Base64 encoder & decoder — text, files, URL-safe",
    description:
      "Encode or decode Base64 with UTF-8 support, optional Base64URL, and file encoding—all client-side.",
  },
};

const PAGE_PATH = "/dev/base64";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function Base64Layout({
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
    name: "Base64 encoder and decoder",
    url: pageUrl,
    description:
      "Free browser-based Base64 tool: encode UTF-8 strings and files to standard or URL-safe Base64, decode with whitespace and data-URI tolerance, optional 76-character wrapping for readability.",
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
        name: "Base64 encoder and decoder",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: base64FaqItems.map((item) => ({
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
    name: "How to encode and decode Base64 online",
    description:
      "Paste UTF-8 text or Base64, choose URL-safe output if needed, encode or decode, and optionally wrap lines for PEM-style readability. Upload a file to get its Base64 without sending it to a server.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose input",
        text: "Type or paste plain text to encode, or paste Base64 (including data:image/...;base64,...) to decode. For binaries, use Encode file to read the file locally and fill the output.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Set options",
        text: "Enable URL-safe Base64 when you need JWT-style or query-string-friendly output. Enable line wrapping when you want 76-character rows for documentation or email-style layouts.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Encode or decode",
        text: "Click Encode UTF-8 to Base64 or Decode Base64 to UTF-8. Copy the result into curl, Postman, config files, or tickets. Fix reported errors by checking padding, alphabet (+/ vs -_), and stray whitespace.",
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
