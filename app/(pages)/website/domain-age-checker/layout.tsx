import type { Metadata } from "next";
import { domainAgeCheckerFaqItems } from "@/lib/domain-age-checker-faq";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Domain age checker — registration date & SEO trust research",
  description:
    "Free domain age checker: look up public RDAP registration, expiration, and last-changed dates for any domain. Ideal for SEO vetting, due diligence, and competitive research—plus guides and FAQs.",
  keywords: [
    "domain age checker",
    "domain age lookup",
    "how old is a domain",
    "domain registration date",
    "RDAP domain lookup",
    "domain expiry checker",
    "SEO domain trust",
    "website age checker",
    "domain history research",
    "check domain created date",
  ],
  openGraph: {
    title: "Domain age checker — RDAP registration & expiry dates",
    description:
      "Instantly see how long a domain has been registered using public RDAP data: registration, expiration, status flags, and registrar hints when available.",
  },
};

const PAGE_PATH = "/website/domain-age-checker";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function DomainAgeCheckerLayout({
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
    name: "Domain age checker",
    url: pageUrl,
    description:
      "Free online tool to look up domain registration age, expiry, and lifecycle timestamps from public RDAP responses—useful for SEO research and quick trust vetting.",
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
        name: "Domain age checker",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: domainAgeCheckerFaqItems.map((item) => ({
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
    name: "How to check domain age with RDAP",
    description:
      "Use the domain age checker to validate a public hostname, query RDAP for registration and expiration events, and read the approximate age in years and months.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter a domain or URL",
        text: "Type the hostname you want to research—either example.com or a full https:// URL. We normalize the host, strip a leading www when helpful, and block names that resolve to non-public networks.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Run the lookup",
        text: "Click Check domain age. The service queries public RDAP via rdap.org, follows registry redirects, and walks up subdomains toward the apex when no separate registration object exists.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Interpret registration, expiry, and status",
        text: "Review registration and expiration timestamps, estimated age, optional registrar hints, and EPP-style status strings. Combine the result with content quality, backlinks, and technical audits—not age alone—for SEO decisions.",
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
