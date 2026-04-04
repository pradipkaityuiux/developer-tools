import type { Metadata } from "next";
import { htmlFormatterFaqItems } from "@/lib/html-formatter-faq";

export const metadata: Metadata = {
  title: "HTML formatter & minifier — beautify, minify & preview",
  description:
    "Free online HTML beautifier and minifier: pretty-print with indentation, collapse whitespace, strip comments, and preview rendered output in a sandboxed iframe. Works in the browser for templates, emails, and CMS snippets.",
  keywords: [
    "HTML formatter",
    "HTML beautifier",
    "HTML minifier",
    "pretty print HTML",
    "minify HTML online",
    "HTML indentation tool",
    "format HTML snippet",
    "HTML preview",
    "markup formatter",
    "compress HTML",
  ],
  openGraph: {
    title: "HTML formatter & minifier",
    description:
      "Beautify or minify HTML in the browser and compare markup with a quick, sandboxed rendered preview.",
  },
};

const PAGE_PATH = "/dev/html-formatter";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function HtmlFormatterLayout({
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
    name: "HTML formatter & minifier",
    url: pageUrl,
    description:
      "Client-side HTML beautifier and minifier with optional sandboxed preview: indent nested tags, remove comments and extra whitespace, and inspect how markup renders.",
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
        name: "HTML formatter & minifier",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: htmlFormatterFaqItems.map((item) => ({
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
    name: "How to format or minify HTML",
    description:
      "Paste HTML, choose beautify or minify, copy the result, and optionally compare markup with a sandboxed browser preview.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste your HTML",
        text: "Copy markup from an editor, CMS, email template, or browser devtools. Fragments and full documents are both supported; the tool detects whether you pasted a complete html document or a partial snippet.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose beautify or minify",
        text: "Click Beautify for indented, line-broken output with a configurable indent width, or Minify to strip HTML comments and collapse whitespace outside preserved elements such as pre, script, style, and textarea.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy or preview",
        text: "Use Copy output to grab the transformed HTML. Open the preview panel to see a sandboxed render of the result—scripts are blocked for safety while structure and inline styles remain visible.",
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
