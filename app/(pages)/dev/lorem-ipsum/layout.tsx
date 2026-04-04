import type { Metadata } from "next";
import { loremIpsumFaqItems } from "@/lib/lorem-ipsum-faq";

export const metadata: Metadata = {
  title:
    "Lorem Ipsum generator — paragraphs, sentences & HTML placeholder text (free)",
  description:
    "Free online Lorem Ipsum generator: create placeholder paragraphs, sentences, or word counts with optional classic opening, HTML p tags or br spacing, copy-ready output, and optional custom dictionary from an uploaded text file—all in your browser.",
  keywords: [
    "Lorem Ipsum generator",
    "placeholder text generator",
    "dummy text",
    "lorem ipsum paragraphs",
    "lorem ipsum HTML",
    "mockup copy",
    "wireframe text",
    "CMS placeholder",
    "design filler text",
    "fake Latin text",
  ],
  openGraph: {
    title: "Lorem Ipsum generator — mockup and layout placeholder text",
    description:
      "Generate paragraphs, sentences, or words with optional HTML wrapping and a classic Lorem ipsum start—private, no sign-up.",
  },
};

const PAGE_PATH = "/dev/lorem-ipsum";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function LoremIpsumLayout({
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
    name: "Lorem Ipsum generator",
    url: pageUrl,
    description:
      "Browser-based Lorem Ipsum generator: produce placeholder paragraphs, sentences, or word counts with optional classic opening, HTML wrapping modes, clipboard copy, and optional custom word list from a local file.",
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
        name: "Lorem Ipsum generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: loremIpsumFaqItems.map((item) => ({
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
    name: "How to generate Lorem Ipsum placeholder text online",
    description:
      "Choose paragraphs, sentences, or words, set how much filler you need, optionally enable the classic opening and HTML wrapping, upload a custom word list if desired, regenerate, and copy the result for mockups or CMS drafts.",
    totalTime: "PT45S",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Pick structure and amount",
        text: "Select whether you need paragraphs, sentences, or a word count, then enter a quantity within the allowed range. Toggle the classic Lorem ipsum opening when stakeholders expect the traditional first lines.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose HTML output",
        text: "Use plain text for Markdown or design tools, paragraph tags for semantic HTML blocks, or line breaks for rich-text fields that prefer br spacing.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Optional custom dictionary",
        text: "Upload a .txt file with extra vocabulary to steer tone while keeping random structure. Reset to the built-in dictionary anytime.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Regenerate and copy",
        text: "Click Regenerate for a new random sample, then use the copy control to paste into Figma, WordPress, JSX, or email templates.",
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
