import type { Metadata } from "next";
import { technologyDetectorFaqItems } from "@/lib/technology-detector-faq";

export const metadata: Metadata = {
  title:
    "Website technology detector — CMS, frameworks, analytics & CDN fingerprints",
  description:
    "Free website stack checker: detect CMS (WordPress, Shopify, Webflow), JavaScript frameworks (Next.js, Nuxt, Gatsby), analytics (GTM, GA4, Meta Pixel), CDNs (Cloudflare, Fastly, Vercel), and common third-party scripts from a live URL. Includes how-to guidance and FAQs for SEO and competitive research.",
  keywords: [
    "website technology detector",
    "technology stack checker",
    "CMS detector",
    "WordPress detector",
    "Shopify stack checker",
    "Next.js detection",
    "analytics detector",
    "Google Tag Manager checker",
    "CDN detection",
    "Cloudflare detection",
    "competitive intelligence tools",
    "Wappalyzer alternative",
    "BuiltWith alternative",
  ],
  openGraph: {
    title: "Website technology detector — stack & script fingerprints",
    description:
      "Paste any public URL to scan HTML and headers for CMS, frameworks, analytics tags, CDNs, and common SaaS embeds—built for quick competitive research.",
  },
};

const PAGE_PATH = "/website/technology-detector";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function TechnologyDetectorLayout({
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
    name: "Website technology detector",
    url: pageUrl,
    description:
      "Free online scanner that fetches a public URL and infers likely CMS platforms, JavaScript frameworks, analytics and tag managers, CDNs, marketing widgets, and common third-party scripts from HTML and HTTP headers.",
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
        name: "Website technology detector",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: technologyDetectorFaqItems.map((item) => ({
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
    name: "How to detect technologies on a website",
    description:
      "Enter a public https (or http) page URL. The tool fetches the response, reads HTML and headers, and lists likely CMS, framework, analytics, CDN, and third-party fingerprints with short evidence strings.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose a representative URL",
        text: "Copy the homepage, landing page, or documentation URL you want to benchmark. Logged-in app shells and JSON APIs usually yield fewer marketing-stack fingerprints than marketing sites—pick the surface that matters for your research.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Paste and run the scan",
        text: "Paste the URL (https is added automatically if you omit the scheme) and click Detect technologies. We follow redirects safely, cap downloaded HTML for performance, and parse headers such as Server, CF-Ray, and x-vercel-id alongside script tags and inline markers.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Interpret categories and evidence",
        text: "Read hits grouped by CMS, frameworks, analytics, CDN, and more. Each row includes a short evidence string—use it to sanity-check false positives. Follow up with our HTTP header checker, meta tags extractor, and SSL certificate checker when you need deeper HTTP or SEO-oriented signals.",
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
