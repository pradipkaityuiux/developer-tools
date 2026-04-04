import type { Metadata } from "next";
import { dnsLookupFaqItems } from "@/lib/dns-lookup-faq";

export const metadata: Metadata = {
  title: "DNS lookup — A, AAAA, MX, TXT, CNAME, NS, SOA records",
  description:
    "Free online DNS lookup: query A, AAAA, MX, CNAME, TXT, NS, and SOA records for any public domain. Troubleshoot email, hosting, SPF/DKIM, and nameserver changes with clear results.",
  keywords: [
    "DNS lookup",
    "DNS lookup tool",
    "DNS record checker",
    "A record lookup",
    "AAAA record lookup",
    "MX record lookup",
    "TXT record lookup",
    "CNAME lookup",
    "NS record lookup",
    "SOA record",
    "DNS propagation check",
    "SPF record check",
    "email DNS troubleshooting",
  ],
  openGraph: {
    title: "DNS lookup tool — query public DNS records",
    description:
      "Inspect live DNS answers for IPv4, IPv6, mail exchangers, TXT strings, nameservers, and zone SOA from one simple form.",
  },
};

const PAGE_PATH = "/website/dns-lookup";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function DnsLookupLayout({
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
    name: "DNS lookup tool",
    url: pageUrl,
    description:
      "Free online utility to query public DNS for A, AAAA, MX, CNAME, TXT, NS, and SOA records—built for developers, IT, and SEO workflows.",
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
        name: "DNS lookup",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: dnsLookupFaqItems.map((item) => ({
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
    name: "How to look up DNS records for a domain",
    description:
      "Use the DNS lookup tool to query public resolvers for address, mail, text, alias, delegation, and authority records tied to a hostname.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter the domain or hostname",
        text: "Paste a registrable domain (example.com), a subdomain (www.example.com), or a full https:// URL—we normalize the value to the hostname before querying DNS.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose a record type or run all common lookups",
        text: "Pick A for IPv4, AAAA for IPv6, MX for mail routing, TXT for SPF/DKIM/verification tokens, CNAME for aliases, NS for delegation, SOA for zone metadata, or ALL to fetch every common type in one request.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Read the answers and cross-check your DNS host",
        text: "Compare the returned records with what your registrar or DNS provider shows in their dashboard. If values differ, wait for TTL expiry or verify you edited the correct zone and name.",
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
