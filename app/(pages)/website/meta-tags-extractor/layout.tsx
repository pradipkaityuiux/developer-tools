import type { Metadata } from "next";
import { metaTagsExtractorFaqItems } from "@/lib/meta-tags-extractor-faq";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "Meta tags extractor — title, description, Open Graph & Twitter Card online",
  description:
    "Free meta tags extractor: paste any public URL to read HTML title, meta description, robots, viewport, rel=canonical, Open Graph (og:*), and Twitter Card (twitter:*) tags after redirects. Includes SEO guide, how-to steps, and FAQs.",
  keywords: [
    "meta tags extractor",
    "extract meta tags from URL",
    "Open Graph tags checker",
    "Twitter Card meta tags",
    "meta description extractor",
    "SEO meta tags tool",
    "og:title og:image",
    "canonical tag extractor",
    "HTML head analyzer",
    "social preview meta tags",
  ],
  openGraph: {
    title: "Meta tags extractor — OG, Twitter Card & canonical",
    description:
      "Pull title, description, Open Graph, Twitter Card, and canonical tags from any live public URL—built for SEO and social sharing audits.",
  },
};

const PAGE_PATH = "/website/meta-tags-extractor";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function MetaTagsExtractorLayout({
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
    name: "Meta tags extractor",
    url: pageUrl,
    description:
      "Free online tool to fetch a public web page and extract HTML title, meta description, Open Graph properties, Twitter Card tags, canonical link, and other head-level meta elements for SEO and social sharing review.",
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
        name: "Meta tags extractor",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: metaTagsExtractorFaqItems.map((item) => ({
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
    name: "How to extract meta tags from a URL",
    description:
      "Use the meta tags extractor to request a public HTML page, follow redirects safely, and review title, description-class meta, Open Graph, Twitter Card, and canonical values.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Copy the page URL you want to audit",
        text: "Choose the exact URL users or crawlers should resolve—marketing landing page, blog post, or homepage. Include https when possible so you match production. If you care about redirect behavior, note any tracking parameters you expect to normalize.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Paste and run the extractor",
        text: "Paste the address into the field and click Extract meta tags. We resolve the hostname to a public address, follow redirects up to a safe limit, download a capped portion of the HTML, and parse the head for title, meta, link rel=canonical, Open Graph, and Twitter Card entries.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Compare HTML tags with your SEO and social checklist",
        text: "Verify the title and meta description length and messaging, confirm canonical points at the preferred URL, ensure og:image and twitter:card are present for share previews, and scan robots and viewport for accidental noindex or mobile issues. Follow up with specialized tools for headers, redirects, or canonical-only audits when needed.",
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
