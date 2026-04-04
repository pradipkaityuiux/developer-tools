import type { Metadata } from "next";
import { yamlToJsonFaqItems } from "@/lib/yaml-to-json-faq";

export const metadata: Metadata = {
  title: "YAML to JSON converter — parse configs & CI pipelines in the browser",
  description:
    "Free YAML to JSON converter: paste Kubernetes, GitHub Actions, Docker Compose, or CloudFormation snippets and get formatted JSON with clear parse errors. Works offline in the browser; learn how YAML maps to JSON and fix indentation issues fast.",
  keywords: [
    "YAML to JSON",
    "convert YAML to JSON",
    "YAML parser online",
    "Kubernetes YAML to JSON",
    "GitHub Actions YAML",
    "docker compose yaml json",
    "CI config converter",
    "CloudFormation YAML",
    "Ansible YAML JSON",
    "multi document YAML",
  ],
  openGraph: {
    title: "YAML to JSON converter — developer-friendly parsing",
    description:
      "Turn YAML into pretty-printed JSON in one click. Client-side parsing for pipelines, IaC, and API fixtures—no upload.",
  },
};

const PAGE_PATH = "/dev/yaml-to-json";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function YamlToJsonLayout({
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
    name: "YAML to JSON converter",
    url: pageUrl,
    description:
      "Online tool to parse YAML into formatted JSON in the browser, with support for multi-document YAML and actionable syntax errors.",
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
        name: "YAML to JSON converter",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: yamlToJsonFaqItems.map((item) => ({
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
    name: "How to convert YAML to JSON",
    description:
      "Paste YAML configuration or pipeline definitions and generate formatted JSON for APIs, tests, and documentation.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste your YAML",
        text: "Copy YAML from a file or editor—Kubernetes manifests, GitHub Actions workflows, Ansible plays, or docker-compose fragments all work. Multi-document streams separated by --- are supported.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Convert and review",
        text: "Click Convert to JSON. Fix any line or column errors the parser reports, then re-run until the JSON panel shows the structure you expect.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy or download",
        text: "Use Copy JSON for quick paste into another tool, or Download .json to save a file. Pair with a JSON formatter or JSON-to-YAML tool when you need round trips.",
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
