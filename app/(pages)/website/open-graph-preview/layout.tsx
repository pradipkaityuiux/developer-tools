import type { Metadata } from "next";
import { openGraphPreviewFaqItems } from "@/lib/open-graph-preview-faq";

export const metadata: Metadata = {
  title:
    "Open Graph preview — check og:title, og:image & social link cards online",
  description:
    "Free Open Graph preview tool: paste any public URL to see how og:title, og:description, og:image, and Twitter Card tags may appear when shared on Facebook, LinkedIn, Slack, and messengers—ideal for marketers, SEOs, and developers.",
  keywords: [
    "Open Graph preview",
    "og:image checker",
    "og:title preview",
    "social media link preview",
    "Facebook link preview",
    "LinkedIn post preview",
    "Twitter Card preview",
    "meta tags sharing",
    "Open Graph debugger",
    "link unfurl preview",
  ],
  openGraph: {
    title: "Open Graph preview — see social share cards before you publish",
    description:
      "Fetch a live page and preview Open Graph and Twitter Card fields in one place—catch missing images and weak descriptions early.",
  },
};

const PAGE_PATH = "/website/open-graph-preview";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function OpenGraphPreviewLayout({
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
    name: "Open Graph preview",
    url: pageUrl,
    description:
      "Free online Open Graph and Twitter Card preview: request a public HTML page, parse social meta tags, and display a share-style card plus raw tag values for debugging.",
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
        name: "Open Graph preview",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: openGraphPreviewFaqItems.map((item) => ({
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
    name: "How to preview Open Graph tags for a URL",
    description:
      "Use the Open Graph preview tool to load a public web page, read og and Twitter meta tags from the HTML response, and review a visual share card alongside raw fields.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste the URL you want to share",
        text: "Copy the address of a blog post, landing page, or documentation article—https recommended—and paste it into the URL field. You may omit the scheme; we default to https.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Run the preview",
        text: "Click Preview. Our server fetches the page with redirect following and safe public-URL checks, reads up to the first portion of the HTML document, and extracts Open Graph and Twitter Card properties.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Review the card and tag table",
        text: "Compare the share-style preview with the Open Graph and Twitter sections. Fix missing og:image paths, shorten long titles, and align descriptions with your meta description for consistent SERP and social messaging.",
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
