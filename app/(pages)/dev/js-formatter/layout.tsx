import type { Metadata } from "next";
import { jsFormatterFaqItems } from "@/lib/js-formatter-faq";

export const metadata: Metadata = {
  title:
    "JavaScript formatter & minifier — beautify JS/TS & compress bundles (free)",
  description:
    "Free online JavaScript formatter and minifier: pretty-print JS and TypeScript with Prettier, minify with Terser for smaller scripts—all in the browser. Guides for debugging, bundles, and when to use your bundler instead.",
  keywords: [
    "JavaScript formatter",
    "JS minifier",
    "JavaScript beautifier",
    "pretty print JavaScript",
    "minify JavaScript online",
    "TypeScript formatter",
    "format JS snippet",
    "Terser minify",
    "compress JavaScript",
    "Prettier online",
  ],
  openGraph: {
    title: "JavaScript formatter & minifier",
    description:
      "Paste JavaScript or TypeScript to format with Prettier or minify with Terser—runs locally in your browser.",
  },
};

const PAGE_PATH = "/dev/js-formatter";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function JsFormatterLayout({
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
    name: "JavaScript formatter and minifier",
    url: pageUrl,
    description:
      "Browser-based JavaScript and TypeScript formatter using Prettier, plus JavaScript minification with Terser: beautify obfuscated or compact code, copy results, estimate bundle size on a snippet.",
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
        name: "JavaScript formatter and minifier",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: jsFormatterFaqItems.map((item) => ({
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
    name: "How to format or minify JavaScript online",
    description:
      "Paste JavaScript or TypeScript, run Format for readable output with Prettier, or Minify for compressed JavaScript with Terser, then copy the result.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste your script",
        text: "Copy from an IDE, stack trace, CDN bundle, or DevTools Sources panel. TypeScript and JSX-heavy snippets are fine for Format; Minify expects runnable JavaScript after types are erased.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose Format or Minify",
        text: "Click Format to pretty-print with consistent indentation and line wrapping. Click Minify to remove comments and whitespace and apply safe compression and mangling via Terser.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy or integrate",
        text: "Use Copy to move output back to your editor, gist, or ticket. For production apps, keep using your framework’s build pipeline (Vite, webpack, Next.js) for module graphs and source maps.",
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
