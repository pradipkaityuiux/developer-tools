import type { Metadata } from "next";
import { urlEncoderFaqItems } from "@/lib/url-encoder-faq";

export const metadata: Metadata = {
  title:
    "URL encoder & decoder — percent-encoding for query strings & URIs (free)",
  description:
    "Free online URL encoder and decoder: percent-encode query parameters and path segments with encodeURIComponent, encode full URIs with encodeURI, and decode percent-encoded text in your browser. Form-friendly + handling, copy output, and privacy-first processing.",
  keywords: [
    "URL encoder",
    "URL decoder",
    "percent encoding",
    "encodeURIComponent",
    "decodeURIComponent",
    "encodeURI",
    "query string encoder",
    "URL encode online",
    "decode URL",
    "RFC 3986",
    "application/x-www-form-urlencoded",
  ],
  openGraph: {
    title: "URL encoder & decoder — percent-encode and decode safely",
    description:
      "Encode parameter values or full URIs and decode percent-encoded strings locally in your browser—no upload.",
  },
};

const PAGE_PATH = "/dev/url-encoder";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function UrlEncoderLayout({
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
    name: "URL encoder and decoder",
    url: pageUrl,
    description:
      "Browser-based URL percent-encoding: encodeURIComponent for query values and segments, encodeURI for full URIs, decodeURIComponent with optional plus-as-space for form data—copy results without server round-trips.",
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
        name: "URL encoder and decoder",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: urlEncoderFaqItems.map((item) => ({
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
    name: "How to URL-encode and decode text online",
    description:
      "Choose encode mode for query segments or full URIs, paste input, run Encode, then copy output—or switch to Decode with optional plus-as-space for HTML forms.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Pick encode or decode",
        text: "Select Encode (query & segments) for parameter values and path pieces using encodeURIComponent. Select Encode (full URI) when the string is mostly a URL and structure characters should stay visible. Select Decode to reverse percent-encoding with decodeURIComponent.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Paste input and run",
        text: "Paste plain or encoded text into the input area. Click Encode or Decode to fill the output panel. Use Load sample to try a starter string.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy or chain operations",
        text: "Copy output to the clipboard, or use Swap to move the result back into input for another pass. Enable Treat + as space when decoding classic form-urlencoded query strings.",
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
