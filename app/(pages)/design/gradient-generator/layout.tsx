import type { Metadata } from "next";
import { gradientGeneratorFaqItems } from "@/lib/gradient-generator-faq";

export const metadata: Metadata = {
  title:
    "CSS gradient generator — linear & radial gradients with copyable background CSS (free)",
  description:
    "Free online gradient generator: build linear and radial CSS gradients with color stops, angle, and radial center; preview live; sample colors from an image upload; copy background-image CSS—in your browser only.",
  keywords: [
    "CSS gradient generator",
    "linear gradient",
    "radial gradient",
    "gradient maker",
    "background gradient CSS",
    "copy CSS gradient",
    "UI gradient",
    "hero section gradient",
    "color stops",
    "web design gradient",
  ],
  openGraph: {
    title: "CSS gradient generator — linear & radial with live preview",
    description:
      "Design linear and radial gradients, tune stops and angles, optionally sample colors from a photo, then copy production-ready background-image CSS.",
  },
};

const PAGE_PATH = "/design/gradient-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function GradientGeneratorLayout({
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
    name: "CSS gradient generator",
    url: pageUrl,
    description:
      "Client-side tool to compose linear-gradient and radial-gradient values with multiple color stops, live preview, optional image sampling for palette-aligned stops, and one-click copy of background-image CSS.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript, Canvas 2D for image sampling.",
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
        name: "Gradient generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: gradientGeneratorFaqItems.map((item) => ({
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
    name: "How to build a CSS linear or radial gradient",
    description:
      "Choose linear or radial mode, set angle or radial center, add color stops with positions, optionally sample colors from an image, preview the blend, then copy the gradient or full background-image declaration.",
    totalTime: "PT3M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose gradient type",
        text: "Select Linear for directional blends along an angle, or Radial for a circular or elliptical blend from a center point.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Adjust geometry",
        text: "For linear gradients, set the angle in degrees. For radial gradients, pick circle or ellipse and move the center X and Y percentages.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Edit color stops",
        text: "Use the color picker and hex field for each stop, set stop positions from 0% to 100%, and add or remove stops up to five. Use Upload image to sample three bands from a photo.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Copy CSS",
        text: "Use Copy gradient for the function only, or Copy background-image for a ready background-image declaration with the copy icon buttons.",
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
