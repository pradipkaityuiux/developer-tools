import type { Metadata } from "next";
import { sslDecoderFaqItems } from "@/lib/ssl-decoder-faq";

export const metadata: Metadata = {
  title:
    "SSL certificate decoder — PEM X.509 subject, issuer, SANs, validity (browser-only)",
  description:
    "Free SSL certificate decoder: paste PEM X.509 certificates to read subject, issuer, serial number, notBefore/notAfter, SANs, key usage, and SHA-256 fingerprint—runs locally in your browser with no chain validation.",
  keywords: [
    "SSL certificate decoder",
    "X.509 decoder",
    "PEM certificate decoder",
    "decode certificate online",
    "certificate SAN viewer",
    "read PEM certificate",
    "subject alternative name decoder",
    "openssl certificate decode alternative",
    "TLS certificate inspector",
    "certificate fingerprint viewer",
  ],
  openGraph: {
    title: "SSL certificate decoder — inspect PEM certificates locally",
    description:
      "Paste PEM blocks to decode subject, issuer, validity, SANs, and extensions. No upload to a server.",
  },
};

const PAGE_PATH = "/security/ssl-decoder";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function SslDecoderLayout({
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
    name: "SSL certificate decoder",
    url: pageUrl,
    description:
      "Browser-based PEM X.509 certificate decoder: extract subject, issuer, serial number, validity window, Subject Alternative Names, key usage, extended key usage, and SHA-256 fingerprint from one or more certificate blocks—local processing only, no chain validation.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and Web Crypto for SHA-256 fingerprints.",
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
        name: "SSL certificate decoder",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: sslDecoderFaqItems.map((item) => ({
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
    name: "How to decode a PEM SSL certificate in the browser",
    description:
      "Paste PEM-encoded X.509 certificates or upload a file, review subject, issuer, SANs, validity, and copy summaries or PEM text locally.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste or upload PEM",
        text: "Copy certificate text from a server export, CA portal, or ticket, or upload a .pem/.crt file. Multiple BEGIN CERTIFICATE blocks are parsed as a chain order list.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Review decoded fields",
        text: "Read subject, issuer, serial, notBefore and notAfter in UTC, signature and public key algorithms, SAN entries, Basic Constraints, Key Usage, and Extended Key Usage.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy or compare",
        text: "Copy summary or PEM with the copy buttons. Compare SHA-256 fingerprints with openssl or live site checks. Remember: decoding does not verify trust, signatures, or revocation.",
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
