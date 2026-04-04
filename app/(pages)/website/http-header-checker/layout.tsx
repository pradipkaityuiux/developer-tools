import type { Metadata } from "next";
import { httpHeaderCheckerFaqItems } from "@/lib/http-header-checker-faq";

export const metadata: Metadata = {
  title: "HTTP header checker — inspect response headers online",
  description:
    "Free HTTP header checker: paste any public URL, follow redirects safely, and review response headers—cache-control, content-type, CORS, CSP, HSTS, and security signals for SEO and debugging.",
  keywords: [
    "HTTP header checker",
    "response headers",
    "check HTTP headers online",
    "header inspector",
    "cache-control checker",
    "CORS headers",
    "content-security-policy",
    "HSTS header",
    "security headers scanner",
    "SEO headers",
    "x-robots-tag",
  ],
  openGraph: {
    title: "HTTP header checker — live response header inspection",
    description:
      "Inspect HTTP response headers for any public URL: caching, content negotiation, CORS, and hardening directives—built for developers and SEO workflows.",
  },
};

const PAGE_PATH = "/website/http-header-checker";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function HttpHeaderCheckerLayout({
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
    name: "HTTP header checker",
    url: pageUrl,
    description:
      "Free online tool to fetch a public URL and display HTTP response headers after redirects—useful for cache tuning, CORS debugging, and security header review.",
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
        name: "HTTP header checker",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: httpHeaderCheckerFaqItems.map((item) => ({
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
    name: "How to check HTTP response headers for a URL",
    description:
      "Use the HTTP header checker to request a public web address, follow redirects, and read the final response headers in a searchable table.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste the URL you want to inspect",
        text: "Copy the full https (or http) address of the page or API you want to analyze—such as a landing page, stylesheet, or JSON endpoint—and paste it into the URL field.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Run the header check",
        text: "Click Check headers. We resolve the hostname to a public address, issue an HTTP HEAD request when possible, fall back to a minimal GET if HEAD is not allowed, and follow redirects up to a safe hop limit.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Review status, final URL, and headers",
        text: "Read the HTTP status line and note the final URL after redirects. Scan the header table for cache directives, content-type, CORS allowances, cookies, and security policies. Use the filter box to jump to names or values quickly.",
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
