import type { Metadata } from "next";
import { jwtEncoderFaqItems } from "@/lib/jwt-encoder-faq";

export const metadata: Metadata = {
  title:
    "JWT encoder online — build HS256-signed JWTs for API & auth testing (browser)",
  description:
    "Free JWT encoder: paste JSON header and payload, sign with HS256 and a shared secret, copy the compact token—runs locally via Web Crypto. Guides for OAuth, Postman, and integration tests.",
  keywords: [
    "JWT encoder",
    "create JWT online",
    "HS256 JWT",
    "HMAC JWT",
    "sign JWT",
    "JSON Web Token generator",
    "JWT for testing",
    "Bearer token generator",
    "OAuth JWT sample",
    "JWT secret HS256",
  ],
  openGraph: {
    title: "JWT encoder — HS256-signed tokens from JSON",
    description:
      "Build a three-part JWT from custom header and payload; HMAC-SHA256 signing stays in your browser.",
  },
};

const PAGE_PATH = "/security/jwt-encoder";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function JwtEncoderLayout({
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
    name: "JWT encoder (HS256)",
    url: pageUrl,
    description:
      "Browser-based JWT builder: compose JSON header and payload, sign the signing input with HMAC-SHA256 using a UTF-8 secret, output a JWS compact token for API mocks and auth debugging—all client-side.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and Web Crypto (modern browsers).",
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
        name: "JWT encoder",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: jwtEncoderFaqItems.map((item) => ({
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
    name: "How to create an HS256 JWT online",
    description:
      "Edit JSON header and payload, enter a shared secret, sign with HMAC-SHA256, and copy the resulting JWT for local testing.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Define header and payload",
        text: 'Use JSON objects. Typical header includes {"alg":"HS256","typ":"JWT"}. Payload holds claims such as sub, exp, and iat. Upload .json files with the upload buttons if you already store fixtures on disk.',
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enter the HS256 secret",
        text: "Paste the UTF-8 string your API will use to verify the signature. Use a throwaway secret for demos; production secrets belong in secure server-side configuration.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Sign and copy",
        text: 'Click Sign & build JWT to produce the compact token. Copy the result with the copy control and attach it as Authorization: Bearer in HTTP clients.',
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
