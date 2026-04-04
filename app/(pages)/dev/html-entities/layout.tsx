import type { Metadata } from "next";
import { htmlEntitiesFaqItems } from "@/lib/html-entities-faq";

export const metadata: Metadata = {
  title:
    "HTML entity encoder & decoder — escape &amp; &lt; &gt; for safe markup (free)",
  description:
    "Free online HTML entity encoder and decoder: escape ampersands, angle brackets, quotes, and apostrophes for CMS fields and templates; decode named and numeric entities back to Unicode in your browser. Optional decimal encoding for non-ASCII, file upload, copy output, privacy-first.",
  keywords: [
    "HTML entity encoder",
    "HTML entity decoder",
    "escape HTML",
    "unescape HTML",
    "&amp; encode",
    "numeric character reference",
    "named HTML entities",
    "encode special characters HTML",
    "CMS HTML escape",
    "XSS prevention encoding",
  ],
  openGraph: {
    title: "HTML entity encoder & decoder — escape and unescape in the browser",
    description:
      "Encode critical HTML characters to entities or decode entity strings locally—upload text files, copy results, no server processing.",
  },
};

const PAGE_PATH = "/dev/html-entities";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function HtmlEntitiesLayout({
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
    name: "HTML entity encoder and decoder",
    url: pageUrl,
    description:
      "Browser-based HTML escaping: encode &, <, >, quotes, and apostrophes to standard entities, optionally encode non-ASCII as decimal numeric references, decode named and numeric entities with native parsing—copy output and load local text files without uploads to a server.",
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
        name: "HTML entity encoder and decoder",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: htmlEntitiesFaqItems.map((item) => ({
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
    name: "How to encode or decode HTML entities online",
    description:
      "Choose encode or decode, paste or upload text, run the action, then copy the result—or swap panels to chain operations.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose mode",
        text: "Select Encode to turn raw text into entity-safe strings for HTML attributes and element text. Select Decode to expand &name;, &#decimal;, and &#xhex; references back to Unicode.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Provide input",
        text: "Paste into the input area or use Upload file to load .html, .txt, or similar text locally. For encoding, optionally enable non-ASCII decimal entities for characters beyond ASCII.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Run and copy",
        text: "Click Encode or Decode to fill the output panel. Use the copy control on the output or the Copy output button. Swap to input to decode, edit, and re-encode without leaving the page.",
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
