import type { Metadata } from "next";
import { jwtDecoderFaqItems } from "@/lib/jwt-decoder-faq";

export const metadata: Metadata = {
  title:
    "JWT decoder online — decode header & payload, check exp (free, client-side)",
  description:
    "Free JWT decoder: Base64URL-decode JSON Web Token header and payload, pretty-print JSON, read exp, nbf, and iat—runs in your browser with no signature verification. Guides for OAuth, OIDC, and API debugging.",
  keywords: [
    "JWT decoder",
    "decode JWT online",
    "JSON Web Token",
    "JWT parser",
    "JWT inspector",
    "check JWT expiry",
    "JWT payload decoder",
    "Base64URL JWT",
    "OAuth token decode",
    "JWS decoder",
  ],
  openGraph: {
    title: "JWT decoder — inspect header, payload, and expiry",
    description:
      "Paste a JWT to decode header and payload locally—see exp, nbf, iat and formatted JSON without uploading your token.",
  },
};

const PAGE_PATH = "/dev/jwt-decoder";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function JwtDecoderLayout({
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
    name: "JWT decoder",
    url: pageUrl,
    description:
      "Browser-based JWT decoder for JWS compact tokens: decode Base64URL header and payload to JSON, surface alg and typ, interpret exp, nbf, and iat for quick expiry checks—no signature verification or server upload.",
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
        name: "JWT decoder",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: jwtDecoderFaqItems.map((item) => ({
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
    name: "How to decode a JWT online",
    description:
      "Paste a three-part JWT, decode the header and payload to JSON, review algorithm and claims, and compare expiry to the current time—all locally in the browser.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste the token",
        text: "Copy an access token, ID token, or test JWT from logs, DevTools, or your auth provider. You may include a Bearer prefix; the tool strips it. Do not use production secrets on shared machines.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Decode",
        text: "Click Decode to Base64URL-decode the header and payload segments and format them as JSON. Inspect alg, typ, kid, sub, aud, scope, and standard time claims.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Interpret results",
        text: "Read the expiry banner as a hint only—it does not verify signatures. For real authorization, validate the token with your backend using the issuer’s keys and reject tampered or expired tokens.",
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
