import type { Metadata } from "next";
import { ogTagGeneratorFaqItems } from "@/lib/og-tag-generator-faq";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "Open Graph tag generator — og:title, og:image & Twitter Card meta tags",
  description:
    "Free Open Graph tag generator: build og:title, og:description, og:image, og:url, locale, and Twitter Card meta tags with a live share-card preview. Upload HTML to import tags, copy snippets for your head, plus SEO guide and FAQs.",
  keywords: [
    "Open Graph tag generator",
    "og:title meta tag",
    "og:image generator",
    "Twitter Card generator",
    "meta tags for social sharing",
    "Facebook link preview tags",
    "LinkedIn preview meta tags",
    "og:description",
    "social media SEO",
    "Open Graph protocol",
  ],
  openGraph: {
    title: "Open Graph tag generator — preview social share cards",
    description:
      "Create Open Graph and Twitter meta tags in the browser, preview the card, and copy HTML for your site head.",
  },
};

const PAGE_PATH = "/seo/og-tag-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function OgTagGeneratorLayout({
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
    name: "Open Graph tag generator",
    url: pageUrl,
    description:
      "Free online generator for Open Graph and Twitter Card HTML meta tags with optional article metadata, HTML upload to import existing tags, clipboard copy, and a visual share-card preview for marketing QA.",
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
        name: "Open Graph tag generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: ogTagGeneratorFaqItems.map((item) => ({
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
    name: "How to generate Open Graph meta tags",
    description:
      "Fill in Open Graph fields for your page, optionally add Twitter Card and article metadata, then copy the generated meta elements into your HTML head or framework metadata.",
    totalTime: "PT3M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter title, description, and image URL",
        text: "Provide og:title and og:description that match your on-page promise. Set og:image to an absolute HTTPS URL with recommended aspect ratio (for example 1200×630). Add og:url as the canonical share URL.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Tune type, locale, and Twitter options",
        text: "Choose og:type (website, article, product, and so on), set og:locale, and enable Twitter Card tags. Leave Twitter title or description blank to mirror Open Graph automatically.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy tags or upload existing HTML",
        text: "Use Copy to paste the snippet into your layout or CMS. Optionally upload a saved HTML file to import og and twitter meta tags for editing. After deploy, validate a live URL with an Open Graph preview or network debugger.",
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
