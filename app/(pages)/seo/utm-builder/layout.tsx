import type { Metadata } from "next";
import { utmBuilderFaqItems } from "@/lib/utm-builder-faq";

export const metadata: Metadata = {
  title:
    "UTM link builder — create campaign tracking URLs for GA4 & analytics",
  description:
    "Free UTM parameter generator: add utm_source, utm_medium, utm_campaign, utm_term, and utm_content to any landing page URL with correct encoding—copy tagged links for email, paid search, and social, or import existing UTM links to edit.",
  keywords: [
    "UTM link builder",
    "UTM parameter generator",
    "campaign URL builder",
    "utm_source utm_medium utm_campaign",
    "Google Analytics UTM",
    "GA4 campaign tracking",
    "marketing URL builder",
    "tracking link generator",
    "UTM tags for email",
    "paid search UTM",
  ],
  openGraph: {
    title: "UTM link builder — build tagged URLs for campaign analytics",
    description:
      "Create standards-compliant UTM tracking links in your browser: fill source, medium, and campaign, then copy—or import a tagged URL to tweak one field.",
  },
};

const PAGE_PATH = "/seo/utm-builder";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function UtmBuilderLayout({
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
    name: "UTM link builder",
    url: pageUrl,
    description:
      "Free online UTM parameter builder: compose utm_source, utm_medium, utm_campaign, utm_term, and utm_content on a destination URL with percent-encoding, copy the result, or import an existing tagged link for editing—all client-side.",
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
        name: "UTM link builder",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: utmBuilderFaqItems.map((item) => ({
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
    name: "How to build a UTM tracking link",
    description:
      "Use the UTM link builder to set destination URL and campaign parameters, then copy the encoded link for use in ads, email, and social—or import an existing URL to adjust fields.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter the landing page URL",
        text: "Paste the page users should reach—homepage, pricing, or blog article. You may omit https; we assume HTTPS. This becomes the base before query parameters.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Fill UTM source, medium, and campaign",
        text: "Set utm_source to the referrer or platform (e.g. google, newsletter), utm_medium to the channel type (e.g. cpc, email), and utm_campaign to a stable campaign slug. Add utm_term for paid keywords or utm_content for creative variants when needed.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy or import",
        text: "Copy the generated URL from the preview box. To reuse an old tagged link, paste or upload it under Import tagged URL to populate fields from existing utm_* parameters.",
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
