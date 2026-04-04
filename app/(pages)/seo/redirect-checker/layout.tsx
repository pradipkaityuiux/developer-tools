import type { Metadata } from "next";
import { redirectTypeCheckerFaqItems } from "@/lib/redirect-type-checker-faq";

const PAGE_PATH = "/seo/redirect-checker";

export const metadata: Metadata = {
  title:
    "Redirect type checker — 301 vs 302, 307, 308 & timing for SEO migrations (free)",
  description:
    "Free online redirect checker: enter a public URL to see each HTTP redirect type (301 permanent, 302 temporary, 307, 308, 303), Location targets, hop count, and per-hop timing for migration QA. Optional multi-URL list and exportable text report.",
  keywords: [
    "redirect checker",
    "301 vs 302",
    "HTTP redirect type",
    "check 301 redirect",
    "temporary redirect 302",
    "SEO redirect audit",
    "migration redirect testing",
    "redirect timing",
    "Location header checker",
    "permanent redirect test",
  ],
  openGraph: {
    title: "Redirect type checker — status codes, chain, and timing",
    description:
      "Identify 301, 302, 307, and 308 responses with per-hop milliseconds. Built for SEO audits and site moves.",
  },
};

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function RedirectCheckerLayout({
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
    name: "Redirect type checker (SEO)",
    url: pageUrl,
    description:
      "Check public URLs for HTTP redirect types (301, 302, 303, 307, 308), full redirect chains, Location headers, and per-hop response timing. Supports single URLs and small batch lists for migration QA.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements:
      "Requires JavaScript for the form and clipboard copy. Server-side HTTP requests resolve redirect chains.",
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
        name: "Redirect type checker",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: redirectTypeCheckerFaqItems.map((item) => ({
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
    name: "How to check redirect types and timing",
    description:
      "Enter a canonical or legacy URL, run the checker, review each hop for 301 vs 302 semantics and milliseconds, then copy the report or analyze a short migration list.",
    totalTime: "PT3M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose input mode",
        text: "Use single URL for a deep dive, or migration list for up to eight URLs from a spreadsheet export—optionally upload a plain text file.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Run the check",
        text: "Submit the form. The server follows redirects safely, records status codes, Location values, and time to headers for each hop.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Act on results",
        text: "Prefer one permanent redirect to the final URL, replace temporary 302s with 301 or 308 when moves are permanent, shorten chains, and copy the text report for tickets or runbooks.",
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
