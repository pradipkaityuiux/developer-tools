import type { Metadata } from "next";
import { jsonToYamlFaqItems } from "@/lib/json-to-yaml-faq";

export const metadata: Metadata = {
  title: "JSON to YAML converter — Kubernetes, CI configs & readable YAML",
  description:
    "Free online JSON to YAML converter: paste JSON, get clean YAML for Kubernetes, Docker Compose, Ansible, and GitHub Actions. Sort keys, choose indent, copy or download—runs in your browser with no upload.",
  keywords: [
    "JSON to YAML",
    "JSON to YAML converter",
    "convert JSON to YAML online",
    "JSON YAML converter",
    "Kubernetes YAML from JSON",
    "Docker Compose JSON to YAML",
    "YAML generator from JSON",
    "config JSON to YAML",
    "API JSON to YAML",
    "developer JSON YAML tool",
  ],
  openGraph: {
    title: "JSON to YAML converter — free online",
    description:
      "Turn valid JSON into readable YAML in the browser: copy, download, stable key sorting for Git diffs.",
  },
};

const PAGE_PATH = "/dev/json-to-yaml";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function JsonToYamlLayout({
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
    name: "JSON to YAML converter",
    url: pageUrl,
    description:
      "Client-side tool to parse JSON and emit YAML with optional alphabetical key sorting, configurable indentation, clipboard copy, and file download.",
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
        name: "JSON to YAML converter",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: jsonToYamlFaqItems.map((item) => ({
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
    name: "How to convert JSON to YAML",
    description:
      "Paste valid JSON, adjust formatting options, convert to YAML, then copy or download the result for configs and infrastructure-as-code.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste JSON",
        text: "Paste a JSON object or array into the input panel. Ensure the document is valid JSON: double-quoted keys and strings, no trailing commas, and no comments.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose options",
        text: "Toggle alphabetical key sorting if you want stable diffs in Git, and pick two- or four-space indentation to match your team’s YAML style guide.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Convert and export",
        text: "Click Convert to YAML. If parsing succeeds, use Copy YAML for the clipboard or Download to save a .yaml file. Fix any parse errors shown in red before retrying.",
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
