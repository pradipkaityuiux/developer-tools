import type { Metadata } from "next";
import { cssFormatterFaqItems } from "@/lib/css-formatter-faq";

export const metadata: Metadata = {
  title:
    "CSS formatter & minifier — beautify stylesheets & shrink file size (free)",
  description:
    "Free online CSS formatter and minifier: pretty-print rules with indentation, remove comments and whitespace for production-sized output, preserve strings and url() values—all client-side. Guides for design tokens, critical CSS, and performance.",
  keywords: [
    "CSS formatter",
    "CSS minifier",
    "CSS beautifier",
    "pretty print CSS",
    "minify CSS online",
    "format stylesheet",
    "compress CSS",
    "CSS optimizer",
    "indent CSS",
    "critical CSS",
  ],
  openGraph: {
    title: "CSS formatter & minifier — format and compress styles",
    description:
      "Paste CSS to beautify with readable braces or minify for smaller files—runs entirely in your browser.",
  },
};

const PAGE_PATH = "/dev/css-formatter";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function CssFormatterLayout({
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
    name: "CSS formatter and minifier",
    url: pageUrl,
    description:
      "Free browser-based CSS formatter: beautify stylesheets with indentation, minify by stripping comments and collapsing whitespace, copy results, with string-aware parsing for safe url() and content values.",
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
        name: "CSS formatter and minifier",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: cssFormatterFaqItems.map((item) => ({
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
    name: "How to format or minify CSS online",
    description:
      "Paste a stylesheet, beautify it for readability, or minify it to reduce size while preserving quoted strings and balanced braces.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste CSS",
        text: "Copy rules from DevTools, a framework bundle, a design handoff, or a static file. The editor accepts standard CSS text including media queries, at-rules, and custom properties.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose Format or Minify",
        text: "Click Format to expand braces onto new lines with two-space indentation and keep block comments. Click Minify to strip comments and collapse whitespace for a compact single-line or tight output suitable for snippets.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy or integrate",
        text: "Use Copy to move the result into your IDE, CMS, or build pipeline. For large apps, still prefer PostCSS, esbuild, or your framework’s built-in CSS pipeline for autoprefixing and hashing.",
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
