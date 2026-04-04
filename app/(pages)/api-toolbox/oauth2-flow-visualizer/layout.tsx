import type { Metadata } from "next";
import { oauth2FlowVisualizerFaqItems } from "@/lib/oauth2-flow-visualizer-faq";

export const metadata: Metadata = {
  title:
    "OAuth 2.0 flow visualizer — authorization code & PKCE (free, client-side)",
  description:
    "Interactive OAuth 2.0 authorization code flow visualizer: build authorize URLs, PKCE code_challenge, redirect parsing, and token exchange form bodies locally. Guides for OpenID Connect, curl, and API security.",
  keywords: [
    "OAuth 2.0",
    "OAuth flow visualizer",
    "authorization code flow",
    "PKCE",
    "code_verifier",
    "code_challenge",
    "OpenID Connect",
    "OAuth redirect URI",
    "token endpoint",
    "OAuth state parameter",
    "OAuth debugging",
  ],
  openGraph: {
    title: "OAuth 2.0 flow visualizer — authorization code & PKCE",
    description:
      "Step through OAuth 2.0 with interactive fields: authorize URL, callback, and token exchange—runs in your browser.",
  },
};

const PAGE_PATH = "/api-toolbox/oauth2-flow-visualizer";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function OAuth2FlowVisualizerLayout({
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
    name: "OAuth 2.0 Flow Visualizer",
    url: pageUrl,
    description:
      "Browser-based OAuth 2.0 authorization code flow helper: compose authorize and token endpoint requests with optional PKCE (RFC 7636), parse redirect query parameters, and copy curl examples—no server-side token handling.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and Web Crypto for PKCE.",
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
        name: "OAuth 2.0 Flow Visualizer",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: oauth2FlowVisualizerFaqItems.map((item) => ({
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
    name: "How to use the OAuth 2.0 flow visualizer",
    description:
      "Configure OAuth endpoints and client id, copy the generated authorization URL, paste the redirect callback, then copy the token exchange body or curl command.",
    totalTime: "PT5M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter endpoints and client",
        text: "Paste your authorization endpoint, token endpoint, client id, redirect URI, and space-separated scopes. Optionally upload a saved JSON config.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enable PKCE if needed",
        text: "For public clients, keep PKCE enabled so the tool generates code_verifier and S256 code_challenge on the authorize URL.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy the authorize URL",
        text: "Copy the generated URL and open it only against your own test authorization server. Compare returned state with the value you stored.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Paste the redirect and exchange the code",
        text: "Paste the full redirect URL or query string, verify state, then copy the form body or curl example to POST to the token endpoint.",
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
