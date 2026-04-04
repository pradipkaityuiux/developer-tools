import type { Metadata } from "next";
import { flexboxPlaygroundFaqItems } from "@/lib/flexbox-playground-faq";

export const metadata: Metadata = {
  title:
    "Flexbox playground — visual CSS flex container & item editor with live preview (free)",
  description:
    "Free online flexbox playground: adjust flex-direction, wrap, justify-content, align-items, gap, and per-item flex, align-self, and order. Live preview and copy ready-to-paste CSS—runs in your browser.",
  keywords: [
    "flexbox playground",
    "CSS flexbox generator",
    "flexbox tutorial interactive",
    "justify-content align-items",
    "flex grow shrink basis",
    "CSS layout tool",
    "flexbox cheat sheet live",
    "frontend layout practice",
  ],
  openGraph: {
    title:
      "Flexbox playground — tweak flex properties and copy CSS",
    description:
      "Experiment with flex container and flex item rules, see the layout update instantly, and copy clean CSS for nav bars, toolbars, and responsive rows.",
  },
};

const PAGE_PATH = "/design/flexbox-playground";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function FlexboxPlaygroundLayout({
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
    name: "CSS Flexbox playground",
    url: pageUrl,
    description:
      "Client-side flexbox lab: control flex-direction, flex-wrap, justify-content, align-items, align-content, gap, and per-item flex shorthand, align-self, and order; preview updates live and CSS is copyable.",
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
        name: "Flexbox playground",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: flexboxPlaygroundFaqItems.map((item) => ({
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
    name: "How to use the Flexbox playground",
    description:
      "Set container properties, click items to tune flex and order, then copy the generated CSS into your project.",
    totalTime: "PT3M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Adjust the flex container",
        text: "Choose flex-direction and flex-wrap, then set justify-content, align-items, align-content, and gap. Watch the colored demo boxes move in the live preview.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Edit a flex item",
        text: "Click a box to select it. Change flex-grow, flex-shrink, flex-basis, align-self, and order for that item only.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy CSS",
        text: "Use the Copy CSS button (copy icon) next to the generated stylesheet block to paste rules into your CSS file or framework.",
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
