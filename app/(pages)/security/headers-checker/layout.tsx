import type { Metadata } from "next";
import { securityHeadersCheckerFaqItems } from "@/lib/security-headers-checker-faq";

export const metadata: Metadata = {
  title:
    "Security headers checker — CSP, HSTS, X-Frame-Options audit (free online)",
  description:
    "Free security headers checker: scan a public HTTPS URL or paste response headers for graded guidance on CSP, HSTS, X-Content-Type-Options, clickjacking protection, Referrer-Policy, Permissions-Policy, and more. Copy a markdown report. Static SEO guides and FAQs.",
  keywords: [
    "security headers checker",
    "HTTP security headers",
    "CSP checker",
    "Content-Security-Policy audit",
    "HSTS header check",
    "X-Frame-Options",
    "clickjacking protection",
    "Referrer-Policy",
    "Permissions-Policy",
    "Strict-Transport-Security",
    "X-Content-Type-Options nosniff",
    "security header scanner online",
    "OWASP headers",
  ],
  openGraph: {
    title: "Security headers checker — grade your CSP and HSTS online",
    description:
      "Analyze security-related HTTP headers for any public URL or pasted header dump. Get a score, checklist, and copyable report—built for developers and security reviews.",
  },
};

const PAGE_PATH = "/security/headers-checker";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function SecurityHeadersCheckerLayout({
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
    name: "Security headers checker",
    url: pageUrl,
    description:
      "Online tool to scan public URLs or pasted HTTP headers and score security directives such as CSP, HSTS, frame protection, and MIME sniffing controls.",
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
        name: "Security headers checker",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: securityHeadersCheckerFaqItems.map((item) => ({
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
    name: "How to check security headers for a website",
    description:
      "Use the security headers checker to scan a public HTTPS URL or paste raw response headers, then review the graded checklist and copy a report.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose live URL or paste mode",
        text: "Pick Live URL to fetch a public page from our servers, or Paste or upload to analyze headers you copied from curl, DevTools, or a proxy—useful for air-gapped review.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Run the scan",
        text: "Submit the form. For URLs we follow redirects safely and read headers from the final response. For pasted text, ensure each line looks like Header-Name: value.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Review the grade and fixes",
        text: "Read the score and each pass, warn, fail, or info item. Use the CSP builder and HTTP header checker linked on the page for deeper edits, then re-scan after deployment.",
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
