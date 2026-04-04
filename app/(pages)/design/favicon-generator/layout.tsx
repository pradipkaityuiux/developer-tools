import type { Metadata } from "next";
import { faviconGeneratorFaqItems } from "@/lib/favicon-generator-faq";

export const metadata: Metadata = {
  title:
    "Favicon generator — favicon.ico & PNG sizes for tabs, iOS, and PWA (free)",
  description:
    "Free online favicon generator: upload a logo or type initials, then download favicon.ico (16/32/48) plus PNGs for apple-touch-icon and Android chrome. Copy an HTML link snippet. Runs in your browser—guides for Next.js, static sites, and SEO.",
  keywords: [
    "favicon generator",
    "favicon.ico maker",
    "create favicon from image",
    "text favicon generator",
    "apple touch icon",
    "PWA icon sizes",
    "16x16 favicon",
    "32x32 favicon",
    "browser tab icon",
    "site icon PNG",
    "Next.js favicon",
  ],
  openGraph: {
    title: "Favicon generator — ICO and PNG pack for every device",
    description:
      "Build favicon.ico and standard PNG sizes locally, copy head tags, and ship icons for tabs, bookmarks, iOS home screen, and web manifests.",
  },
};

const PAGE_PATH = "/design/favicon-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function FaviconGeneratorLayout({
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
    name: "Favicon generator",
    url: pageUrl,
    description:
      "Browser-based favicon builder: raster image or text to multi-size PNGs and a combined favicon.ico with embedded PNG frames, plus copyable HTML link tags for production sites.",
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript, Canvas 2D, and Blob URLs for download.",
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
        name: "Favicon generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faviconGeneratorFaqItems.map((item) => ({
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
    name: "How to generate favicon.ico and PNG icons",
    description:
      "Choose image or text mode, upload a square-friendly logo or enter initials, adjust fit or colors, download favicon.ico and PNG files, then paste the copied link tags into your site head or framework layout.",
    totalTime: "PT5M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Pick a source",
        text: "Use From image to upload PNG, JPEG, or WebP, or From text for a lettermark with font and color controls.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Tune appearance",
        text: "For photos, choose cover or contain and set a letterbox color. For text, pick weight and contrast-friendly colors.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Download and wire up",
        text: "Download favicon.ico and each PNG, place them in your public or static root, and copy the HTML snippet into your head. Validate in browser devtools and on real devices.",
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
