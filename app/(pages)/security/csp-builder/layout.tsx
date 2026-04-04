import type { Metadata } from "next";
import { cspBuilderFaqItems } from "@/lib/csp-builder-faq";

export const metadata: Metadata = {
  title:
    "CSP builder — Content Security Policy header generator (directives, copy, report-only)",
  description:
    "Free Content Security Policy builder: toggle default-src, script-src, style-src, frame-ancestors, and more; load presets; import a policy from a text file; copy the policy value or full HTTP header for nginx, Apache, or app middleware. Runs in your browser with guides for XSS defense and rollout.",
  keywords: [
    "CSP builder",
    "Content Security Policy generator",
    "Content-Security-Policy header",
    "CSP directives",
    "script-src",
    "default-src",
    "frame-ancestors",
    "CSP report-only",
    "nginx CSP header",
    "Apache Content-Security-Policy",
    "meta CSP",
    "XSS mitigation",
    "unsafe-inline CSP",
  ],
  openGraph: {
    title: "CSP builder — compose Content-Security-Policy and copy the header",
    description:
      "Toggle common CSP directives, use presets for SPA or strict baselines, import existing policies, and copy a ready-to-paste header line or policy value.",
  },
};

const PAGE_PATH = "/security/csp-builder";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function CspBuilderLayout({
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
    name: "Content Security Policy builder",
    url: pageUrl,
    description:
      "Client-side tool to compose Content-Security-Policy directive sets from toggles and source lists, apply presets, optionally import a policy string from a local text file, and copy the resulting policy value or full HTTP header line for server configuration.",
    applicationCategory: "SecurityApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Policy assembly and clipboard copy run locally.",
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
        name: "CSP builder",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: cspBuilderFaqItems.map((item) => ({
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
    name: "How to build a Content Security Policy with this tool",
    description:
      "Choose enforcing or report-only mode, load a preset or enable directives manually, edit source lists, optionally import an existing policy from a file, then copy the policy value or complete header line into your server or CDN configuration.",
    totalTime: "PT5M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Pick mode and baseline",
        text: "Select Content-Security-Policy for enforcement or Report-Only for monitoring. Tap a preset such as Typical SPA or Stricter scripts, or start from Default 'self' and enable directives one by one.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Tune sources and flags",
        text: "For each enabled directive, enter space-separated sources like 'self', https://cdn.example.com, or nonce/hash placeholders from your build. Enable upgrade-insecure-requests or block-all-mixed-content when appropriate. Add extra semicolon-separated directives in the advanced field if needed.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy and deploy",
        text: "Use Copy policy value for meta content or config fields that expect only the directive string, or Copy full header line for nginx add_header, Apache Header set, or framework middleware. Validate on staging and use browser devtools or an HTTP header checker on the live URL.",
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
