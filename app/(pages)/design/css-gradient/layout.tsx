import type { Metadata } from "next";
import { cssGradientFaqItems } from "@/lib/css-gradient-faq";

export const metadata: Metadata = {
  title:
    "CSS Gradient Generator — multi-stop linear & radial gradients, keywords & repeating CSS (free)",
  description:
    "Free multi-stop CSS gradient generator: up to twelve color stops, linear angles or to-* direction keywords, radial center control, repeating-linear and repeating-radial modes, image sampling, and one-click copy of background-image CSS—all in your browser.",
  keywords: [
    "CSS gradient generator",
    "multi-stop gradient",
    "linear-gradient",
    "repeating-linear-gradient",
    "radial-gradient",
    "repeating-radial-gradient",
    "gradient direction keywords",
    "color stops CSS",
    "background gradient",
    "copy CSS gradient",
  ],
  openGraph: {
    title:
      "CSS Gradient Generator — multi-stop gradients with keywords & repeating CSS",
    description:
      "Build production gradients with many stops, angle or keyword direction, optional repeating modes, live preview, and copyable background-image CSS.",
  },
};

const PAGE_PATH = "/design/css-gradient";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function CssGradientLayout({
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
    name: "CSS Gradient Generator (multi-stop)",
    url: pageUrl,
    description:
      "Client-side multi-stop CSS gradient builder supporting linear and radial modes, degree angles or CSS direction keywords, repeating gradient variants, up to twelve color stops with positions, optional image band sampling, and copy-to-clipboard for gradient functions and background-image declarations.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and Canvas 2D for image sampling.",
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
        name: "CSS Gradient Generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: cssGradientFaqItems.map((item) => ({
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
    name: "How to build a multi-stop CSS gradient with this tool",
    description:
      "Choose linear or radial mode, optional repeating syntax, direction by angle or keyword for linear blends, edit up to twelve color stops, optionally sample colors from an image, then copy the gradient or full background-image CSS.",
    totalTime: "PT4M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Pick mode and repetition",
        text: "Select Linear for a line blend or Radial for a center-out blend. Toggle Repeating gradient when you need repeating-linear-gradient or repeating-radial-gradient for striped or tiled effects.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Set linear direction",
        text: "In linear mode, switch between Angle (deg) and Direction keywords. Use the slider for precise rotation or pick to right, to bottom, and other CSS keywords for readable declarations.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Tune radial center",
        text: "In radial mode, choose circle or ellipse and adjust center X and Y percentages until the spotlight matches your layout.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Edit many color stops",
        text: "Add stops up to twelve, set hex colors and positions, remove extras, or use Upload image (upload icon) to seed stops from photo bands.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Copy CSS",
        text: "Use Copy gradient or Copy background-image with the copy icon buttons to place values on the clipboard for stylesheets or frameworks.",
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
