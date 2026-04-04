import type { Metadata } from "next";
import { responseCodeCheckerFaqItems } from "@/lib/response-code-checker-faq";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "HTTP status code checker — 200, 301, 404, 500 & redirect-aware results",
  description:
    "Free HTTP status code checker: enter any public URL and see the final response after redirects (200, 301, 302, 403, 404, 500, and more) plus each hop—ideal for SEO audits, migrations, and uptime checks.",
  keywords: [
    "HTTP status code checker",
    "check HTTP response code",
    "URL status checker",
    "HTTP 404 checker",
    "301 redirect status",
    "website status code",
    "SEO status code tool",
    "HTTP 200 checker",
    "response code lookup",
    "verify URL returns 200",
    "HTTP 503 check",
  ],
  openGraph: {
    title: "HTTP status code checker — final status after redirects",
    description:
      "See the final HTTP status for any public URL and review redirect hops in one place. Built for SEO, QA, and quick production checks.",
  },
};

const PAGE_PATH = "/website/response-code-checker";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function ResponseCodeCheckerLayout({
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
    name: "HTTP status code checker",
    url: pageUrl,
    description:
      "Free online tool to check HTTP response status codes for public URLs, including final status after server-side redirect following—useful for SEO validation, broken-link triage, and monitoring.",
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
        name: "HTTP status code checker",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: responseCodeCheckerFaqItems.map((item) => ({
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
    name: "How to check an HTTP status code for a URL",
    description:
      "Use the HTTP status code checker to submit a public URL, follow redirects server-side, and read the final status plus each redirect hop.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste the URL",
        text: "Copy the full http or https address you want to validate—such as a landing page, API path, or legacy marketing link—and paste it into the URL field. You may omit the scheme; we default to https://.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Run the check",
        text: "Click Check status. The server performs a GET with manual redirect handling, validates each hop against public-host safety rules, and records status codes until a final response or a limit is reached.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Interpret the result",
        text: "Read the final HTTP status and optional phrase, compare the requested URL with the final URL after redirects, and review the hop list when more than one redirect occurred. Pair with the HTTP header checker or redirect chain checker for deeper audits.",
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
