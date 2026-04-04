import type { Metadata } from "next";
import { robotsTxtGeneratorFaqItems } from "@/lib/robots-txt-generator-faq";

export const metadata: Metadata = {
  title:
    "robots.txt generator — User-agent, Allow, Disallow, Sitemap (free online)",
  description:
    "Free robots.txt generator: build User-agent groups, Allow and Disallow path rules, optional Crawl-delay, and Sitemap URLs. Copy, download, or upload to edit. Browser-only—ideal for technical SEO and crawler control.",
  keywords: [
    "robots.txt generator",
    "robots.txt generator online",
    "create robots.txt",
    "User-agent disallow",
    "Allow Disallow robots",
    "Sitemap robots.txt",
    "crawl delay robots",
    "technical SEO robots",
    "block crawlers robots.txt",
    "REP robots exclusion",
  ],
  openGraph: {
    title: "robots.txt generator — crawler rules & Sitemap lines",
    description:
      "Assemble a valid robots.txt with multiple User-agent sections, path rules, and Sitemap declarations. Copy, download, or upload an existing file.",
  },
};

const PAGE_PATH = "/seo/robots-txt-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function RobotsTxtGeneratorLayout({
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
    name: "robots.txt generator",
    url: pageUrl,
    description:
      "Browser-based robots.txt builder: User-agent groups, Allow and Disallow path prefixes, optional Crawl-delay per group, comment header, and multiple Sitemap URLs. Presets for allow-all, block-all, WordPress, and staging. Copy, download robots.txt, or upload to edit.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements:
      "Requires JavaScript for the interactive form and clipboard download.",
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
        name: "robots.txt generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: robotsTxtGeneratorFaqItems.map((item) => ({
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
    name: "How to generate and deploy a robots.txt file",
    description:
      "Configure User-agent groups and path rules, add Sitemap URLs, review the preview, then copy or download robots.txt for your site root.",
    totalTime: "PT5M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Define crawler policies",
        text: "Set one or more User-agent groups. Add Allow and Disallow lines with path prefixes. Use presets for common patterns (allow all, block all, WordPress, staging).",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Declare sitemaps",
        text: "Add absolute Sitemap URLs or use the site base field to append /sitemap.xml. Verify the XML sitemap responds with 200 OK.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Export and deploy",
        text: "Copy the preview or download as robots.txt. Place the file at the web root. Optionally upload an existing file to tweak and re-export.",
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
