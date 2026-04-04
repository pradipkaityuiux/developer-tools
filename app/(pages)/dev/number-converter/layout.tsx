import type { Metadata } from "next";
import { numberConverterFaqItems } from "@/lib/number-converter-faq";

export const metadata: Metadata = {
  title:
    "Number system converter — binary, octal, decimal, hex (free online)",
  description:
    "Free radix converter in your browser: convert integers between binary, octal, decimal, and hexadecimal with BigInt accuracy, optional 0b/0o/0x prefixes, grouped binary nibbles, and copy-friendly outputs. Client-side only—guides for embedded, web, and CS study.",
  keywords: [
    "binary to decimal",
    "decimal to hex",
    "hex to binary",
    "octal converter",
    "radix converter",
    "number base converter",
    "0x hex",
    "0b binary",
    "BigInt converter",
    "programmer calculator",
  ],
  openGraph: {
    title: "Number system converter — binary, octal, decimal, hexadecimal",
    description:
      "Convert whole numbers across bases 2, 8, 10, and 16 with prefixes, grouping, and one-click copy—all in your browser.",
  },
};

const PAGE_PATH = "/dev/number-converter";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function NumberConverterLayout({
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
    name: "Number system converter (binary, octal, decimal, hex)",
    url: pageUrl,
    description:
      "Browser-based integer radix converter: parse values in any of four bases with optional C-style prefixes, format to all bases with optional binary nibble grouping and hex 0x display, copy outputs locally without server upload.",
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
        name: "Number system converter",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: numberConverterFaqItems.map((item) => ({
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
    name: "How to convert binary, octal, decimal, and hexadecimal online",
    description:
      "Choose the input radix, paste or type an integer (optional 0b/0o/0x prefixes), adjust binary grouping and hex display options, then copy any output field. Load a plain-text file when a value lives in a script or log line.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Pick the input base",
        text: "Select binary, octal, decimal, or hexadecimal as the format you are typing. This tells the parser which digits are legal and whether letters A–F are expected.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enter the value",
        text: "Paste from a datasheet, debugger, or URL bar. Optional prefixes 0b, 0o, and 0x are accepted for the matching base. Underscores and spaces inside the digit run are ignored.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Read and copy conversions",
        text: "Review binary, octal, decimal, and hex outputs. Toggle nibble grouping for long bit strings, uppercase hex, and 0x display. Use the copy icon on each field for tickets, assembly comments, or style sheets.",
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
