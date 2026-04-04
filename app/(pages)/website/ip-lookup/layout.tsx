import type { Metadata } from "next";
import { ipLookupFaqItems } from "@/lib/ip-lookup-faq";

export const metadata: Metadata = {
  title: "IP address lookup — geolocation, ISP, ASN & reverse DNS",
  description:
    "Free IP lookup for IPv4 and IPv6: country, region, city, timezone, ISP, ASN, organization, reverse DNS (PTR), and security hints. Learn how to interpret results for SEO, fraud checks, and network troubleshooting.",
  keywords: [
    "IP address lookup",
    "IP geolocation",
    "IPv6 lookup",
    "IPv4 lookup",
    "ASN lookup",
    "ISP lookup",
    "reverse DNS lookup",
    "PTR record",
    "IP WHOIS alternative",
    "network troubleshooting",
    "fraud IP check",
  ],
  openGraph: {
    title: "IP address lookup — geolocation, ISP & ASN",
    description:
      "Look up any public IPv4 or IPv6 address: location-style metadata, network owner, ASN, and PTR hostnames—built for developers and analysts.",
  },
};

const PAGE_PATH = "/website/ip-lookup";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function IpLookupLayout({
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
    name: "IP address lookup",
    url: pageUrl,
    description:
      "Free online tool to look up public IPv4 and IPv6 addresses for geolocation-style metadata, ISP and ASN fields, reverse DNS, and heuristic security flags.",
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
        name: "IP address lookup",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: ipLookupFaqItems.map((item) => ({
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
    name: "How to look up an IP address",
    description:
      "Enter a public IPv4 or IPv6 address to retrieve geolocation-style fields, network ownership hints, ASN, reverse DNS, and optional security signals.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Copy a public IP",
        text: "Find the address you want to research—such as an address from server logs, an email header, or a DNS A/AAAA answer—and copy it. This tool accepts dotted IPv4 and colon IPv6 notation; you may wrap IPv6 in square brackets if your source uses that style.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Paste and run the lookup",
        text: "Paste the IP into the field and click Look up IP. We validate the format, reject private and local ranges, query a geolocation API, and attempt reverse DNS in parallel.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Read country, network, and PTR fields",
        text: "Use country, region, and city as approximate signals. Compare ISP, organization, and ASN with your threat model. If PTR hostnames are present, they can confirm provider branding—but absence of PTR is common and not an error.",
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
