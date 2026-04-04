import type { Metadata } from "next";
import { htaccessGeneratorFaqItems } from "@/lib/htaccess-generator-faq";

export const metadata: Metadata = {
  title:
    ".htaccess generator — Apache redirects, HTTPS, cache, security headers (free)",
  description:
    "Free online .htaccess generator: build Apache rules for HTTPS redirects, www canonicalization, 301s, hotlink protection, mod_expires cache, mod_deflate gzip, security headers, and UTF-8. Copy or download—runs in your browser.",
  keywords: [
    "htaccess generator",
    ".htaccess generator online",
    "Apache htaccess redirect",
    "force HTTPS htaccess",
    "www redirect htaccess",
    "mod_rewrite generator",
    "htaccess security headers",
    "mod_expires htaccess",
    "block hotlinking htaccess",
    "Apache configuration",
    "301 redirect htaccess",
  ],
  openGraph: {
    title: ".htaccess generator — redirects, HTTPS, caching, headers",
    description:
      "Assemble common Apache .htaccess rules for production sites. Preview, upload an existing file, copy or download.",
  },
};

const PAGE_PATH = "/security/htaccess-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function HtaccessGeneratorLayout({
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
    name: ".htaccess generator (Apache)",
    url: pageUrl,
    description:
      "Browser-based Apache .htaccess builder: HTTPS and host redirects, custom 301 rules, hotlink protection, gzip and browser caching, security headers, UTF-8 charset, and blocking common sensitive paths. Copy, download, or upload to edit locally.",
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
        name: ".htaccess generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: htaccessGeneratorFaqItems.map((item) => ({
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
    name: "How to generate and deploy an .htaccess file",
    description:
      "Choose HTTPS, host, security, and performance options; add optional 301 redirects; review the preview; then copy or download .htaccess for your Apache site root.",
    totalTime: "PT5M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Configure rules",
        text: "Toggle force HTTPS, canonical www or non-www, trailing slash removal, sensitive path blocks, hotlinking, gzip, browser cache, security headers, and optional ErrorDocument 404.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Add redirects",
        text: "Optionally add rows for 301 redirects from old paths to new URLs or paths. Use Insert example to see the pattern.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Export",
        text: "Copy with the copy control or download as .htaccess. Upload an existing file to merge or edit manually, then reset to form to regenerate from toggles.",
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
