import type { Metadata } from "next";
import { borderRadiusFaqItems } from "@/lib/border-radius-faq";

export const metadata: Metadata = {
  title:
    "Border radius generator — CSS corner radius with live preview & copy (free)",
  description:
    "Free border-radius CSS generator: set px, rem, or % per corner or link corners, use Pill (9999px) for buttons, upload a preview image, copy shorthand border-radius—runs entirely in your browser for cards, modals, and UI shells.",
  keywords: [
    "border radius generator",
    "CSS border-radius",
    "corner radius CSS",
    "rounded corners generator",
    "border radius shorthand",
    "pill button CSS",
    "9999px border radius",
    "rem border radius",
    "percent border radius",
    "UI radius tool",
    "card radius CSS",
  ],
  openGraph: {
    title: "Border radius generator — visual CSS corners with copy-ready output",
    description:
      "Tune top-left, top-right, bottom-right, and bottom-left radii with live preview, optional image upload, and one-click copy of optimized border-radius shorthand.",
  },
};

const PAGE_PATH = "/design/border-radius-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function BorderRadiusGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const origin = siteOrigin();
  const pageUrl = origin ? `${origin}${PAGE_PATH}` : PAGE_PATH;
  const homeUrl = origin ? `${origin}/` : "/";
  const designSectionUrl = origin
    ? `${origin}/#design-color-tools`
    : "/#design-color-tools";

  const webAppSchema = {
    "@type": "WebApplication",
    "@id": `${pageUrl}#webapp`,
    name: "CSS border radius generator",
    url: pageUrl,
    description:
      "Client-side tool to set border-radius in px, rem, or percent per corner or with linked corners, Pill preset for fully rounded chips, optional background image preview, and copy of minimal shorthand CSS.",
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
        name: "Design & color tools",
        item: designSectionUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Border radius generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: borderRadiusFaqItems.map((item) => ({
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
    name: "How to generate border-radius CSS for UI components",
    description:
      "Choose px, rem, or percent, link or split corners, optionally upload a preview image, then copy shorthand border-radius for cards, buttons, and panels.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Pick a unit",
        text: "Select px for fixed pixels, rem for scaling with root font size, or percent for radii relative to the element box. Values convert when you switch units.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Set corners",
        text: "Enable Link all corners for one slider, or turn it off to set top-left, top-right, bottom-right, and bottom-left independently. Use Pill for the common 9999px fully rounded chip pattern.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Optional image preview",
        text: "Click Upload image (upload icon) to place a photo behind the rounded mask and verify how backgrounds clip. Remove the image when finished.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Copy CSS",
        text: "Review the live preview and the CSS output panel, then press Copy CSS (copy icon) to place border-radius on the clipboard for your stylesheet or design tokens.",
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
