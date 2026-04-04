import type { Metadata } from "next";
import { sitemapGeneratorFaqItems } from "@/lib/sitemap-generator-faq";

export const metadata: Metadata = {
  title:
    "XML sitemap generator — build sitemaps.org URL lists for Google Search Console",
  description:
    "Free XML sitemap generator: paste URLs or paths, optional site origin, lastmod, changefreq, and priority; copy standards-compliant sitemap XML for Search Console. Upload a .txt list locally—everything runs in the browser.",
  keywords: [
    "XML sitemap generator",
    "sitemap.xml generator",
    "sitemaps.org",
    "Google Search Console sitemap",
    "submit sitemap",
    "urlset",
    "SEO sitemap",
    "lastmod",
    "changefreq",
    "priority",
    "site map XML",
  ],
  openGraph: {
    title: "XML sitemap generator — create sitemaps.org XML from a URL list",
    description:
      "Turn one URL per line into a valid XML sitemap with optional metadata. Copy the result or load URLs from a local text file—no server upload.",
  },
};

const PAGE_PATH = "/seo/sitemap-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function SitemapGeneratorLayout({
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
    name: "XML sitemap generator",
    url: pageUrl,
    description:
      "Browser-based tool that parses newline-separated URLs, optionally resolves paths against a site origin, and outputs sitemaps.org-compliant XML with optional lastmod, changefreq, and priority fields for search engine submission.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    browserRequirements:
      "Requires JavaScript. URL parsing and XML generation run locally; optional file import reads only from the user's device.",
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
        name: "XML sitemap generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: sitemapGeneratorFaqItems.map((item) => ({
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
    name: "How to generate an XML sitemap with this tool",
    description:
      "Enter full URLs or paths with an optional site origin, tune optional lastmod and changefreq, then copy the XML file and host it on your domain for Search Console.",
    totalTime: "PT3M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Prepare your URL list",
        text: "Paste one URL per line, or use paths like /docs/start with a site origin such as https://example.com. You can upload a .txt file with the upload control to load the list into the editor.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Set optional hints",
        text: "Optionally add the same lastmod date for every URL, choose a changefreq hint, and set a single priority value between 0.0 and 1.0. Omit fields you do not need.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy and publish",
        text: "Use the copy control to copy the XML, save it as sitemap.xml on your HTTPS host, reference it in robots.txt if desired, and submit the URL in Google Search Console.",
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
