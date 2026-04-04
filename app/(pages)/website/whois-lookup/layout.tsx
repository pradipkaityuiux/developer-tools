import type { Metadata } from "next";
import { whoisLookupFaqItems } from "@/lib/whois-lookup-faq";

export const metadata: Metadata = {
  title:
    "WHOIS lookup — domain registration, registrar, expiry & RDAP (free)",
  description:
    "Free WHOIS lookup powered by RDAP: find registrar, domain status, nameservers, and key registration dates for any supported TLD. Ideal for SEO research, acquisitions, and security due diligence.",
  keywords: [
    "WHOIS lookup",
    "WHOIS search",
    "domain WHOIS",
    "RDAP lookup",
    "domain registration lookup",
    "registrar lookup",
    "domain expiry checker",
    "WHOIS domain information",
    "check domain owner",
    "domain due diligence",
    "ICANN RDAP",
  ],
  openGraph: {
    title: "WHOIS lookup — registration data via RDAP",
    description:
      "Look up public domain registration metadata: registrar, statuses, nameservers, and timeline events using registry RDAP services.",
  },
};

const PAGE_PATH = "/website/whois-lookup";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function WhoisLookupLayout({
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
    name: "WHOIS lookup (RDAP)",
    url: pageUrl,
    description:
      "Free online WHOIS-style lookup using RDAP: query registry-published domain registration details including registrar, domain status, nameservers, and important dates.",
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
        name: "WHOIS lookup",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: whoisLookupFaqItems.map((item) => ({
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
    name: "How to run a WHOIS lookup on a domain",
    description:
      "Use the WHOIS lookup tool to query public RDAP data for a domain name: paste a hostname or full URL, submit, and read registrar, status, nameserver, and event fields returned by the registry.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter the domain or URL",
        text: "Type a registered domain such as example.com, or paste a full https URL—we extract the hostname automatically. Paths and query strings are ignored.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Run the lookup",
        text: "Click WHOIS lookup. Our server resolves the correct RDAP endpoint for the top-level domain using the IANA bootstrap file, then fetches JSON registration data from the registry or delegated RDAP service.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Interpret registrar, status, and dates",
        text: "Review registrar branding when published, domain status flags, nameserver delegation, and event dates such as registration or expiration. Cross-check live DNS using our DNS lookup tool if you need current A, MX, or TXT answers.",
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
