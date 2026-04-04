import type { Metadata } from "next";
import { sslCertificateCheckerFaqItems } from "@/lib/ssl-certificate-checker-faq";

export const metadata: Metadata = {
  title:
    "SSL certificate checker — TLS expiry, issuer, SANs & chain online",
  description:
    "Free SSL certificate checker: verify TLS certificate validity, expiration date, issuer, Subject Alternative Names (SANs), fingerprints, and chain trust for any public domain or HTTPS URL—ideal for DevOps, SEO, and security reviews.",
  keywords: [
    "SSL certificate checker",
    "TLS certificate checker",
    "certificate expiry checker",
    "SSL expiry date",
    "check SSL certificate online",
    "certificate chain viewer",
    "SAN certificate check",
    "issuer and subject SSL",
    "HTTPS certificate validation",
    "TLS handshake inspection",
  ],
  openGraph: {
    title: "SSL certificate checker — inspect TLS certs in seconds",
    description:
      "Paste a domain or HTTPS URL to see certificate dates, SANs, fingerprints, TLS version, and whether the chain validates—before users see browser warnings.",
  },
};

const PAGE_PATH = "/website/ssl-certificate-checker";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function SslCertificateCheckerLayout({
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
    name: "SSL certificate checker",
    url: pageUrl,
    description:
      "Free online SSL/TLS certificate checker: connect to a public host, display leaf and chain certificates, expiry, SANs, fingerprints, and server-side trust validation.",
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
        name: "SSL certificate checker",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: sslCertificateCheckerFaqItems.map((item) => ({
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
    name: "How to check an SSL/TLS certificate online",
    description:
      "Use the SSL certificate checker to open a TLS connection to a public hostname, read the presented certificate chain, and review expiration, names, and trust status.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter a domain or HTTPS URL",
        text: "Type a hostname such as example.com, or paste a full https:// URL including a non-default port if you need it (for example https://example.com:8443). Avoid internal-only or private addresses.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Run the certificate check",
        text: "Click Check certificate. Our server resolves the hostname to a public address, performs a TLS handshake, and collects the leaf certificate plus any intermediates returned by the host.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Review dates, SANs, and trust",
        text: "Read the summary for expiry and trust validation, then expand each certificate in the chain for issuer, subject, SANs, serial number, and SHA-256 fingerprint. Cross-check with your CDN or hosting dashboard before cutovers.",
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
