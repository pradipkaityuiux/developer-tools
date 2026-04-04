import type { Metadata } from "next";
import { canonicalTagCheckerFaqItems } from "@/lib/canonical-tag-checker-faq";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "Canonical tag checker — verify rel=canonical, duplicates & self-reference",
  description:
    "Free canonical URL checker: fetch any public page, follow redirects safely, and list every rel=canonical link. Spot duplicate canonical tags, broken hrefs, and mismatches with the final URL for technical SEO audits.",
  keywords: [
    "canonical tag checker",
    "canonical URL checker",
    "rel canonical test",
    "duplicate canonical",
    "self referencing canonical",
    "SEO canonical audit",
    "href canonical validator",
    "check canonical tag online",
    "consolidate duplicate URLs",
    "canonical link element",
  ],
  openGraph: {
    title: "Canonical tag checker — rel=canonical audit for SEO",
    description:
      "Paste a URL to see all canonical link tags, resolved absolute hrefs, and whether your page self-references after redirects—built for duplicate-content and migration QA.",
  },
};

const PAGE_PATH = "/website/canonical-tag-checker";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function CanonicalTagCheckerLayout({
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
    name: "Canonical tag checker",
    url: pageUrl,
    description:
      "Free online tool to fetch public web pages, follow HTTP redirects within safety limits, parse HTML for link rel=canonical elements, resolve href values, and highlight duplicate or non-self-referencing canonicals for SEO workflows.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Requires HTML.",
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
        name: "Canonical tag checker",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: canonicalTagCheckerFaqItems.map((item) => ({
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
    name: "How to check canonical tags on a live URL",
    description:
      "Enter a public page URL, run the canonical inspector, compare resolved canonical hrefs with the final URL after redirects, and fix duplicate or conflicting link rel=canonical markup.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste the URL you want to audit",
        text: "Copy the address bar URL or a tracked marketing link. Include the protocol if you have it; bare hostnames default to https. Submit only URLs you are allowed to test.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Run the canonical check",
        text: "Click Check canonical. The server fetches the document with redirect handling, reads the HTML body, extracts every link element whose rel includes canonical, and resolves each href against the final URL.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Interpret results and fix markup",
        text: "If you see zero tags, add a single self-referencing canonical in the head when the page should be indexed. If you see more than one, remove duplicates. If the canonical targets another URL, confirm consolidation intent and align internal links, sitemaps, and redirects.",
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
