import type { Metadata } from "next";
import { gitignoreGeneratorFaqItems } from "@/lib/gitignore-generator-faq";

export const metadata: Metadata = {
  title:
    ".gitignore generator online — Node, Python, Rust, Next.js, Docker, Terraform (free)",
  description:
    "Free browser .gitignore generator: pick your stack (Node, Next.js, Python, Rust, Go, Java, .NET, Vue, Flutter, Terraform, Docker, OS, IDEs), merge rules, copy or download .gitignore. Client-side only—no repo upload.",
  keywords: [
    "gitignore generator",
    ".gitignore generator online",
    "create gitignore",
    "Node gitignore",
    "Next.js gitignore",
    "Python gitignore",
    "Rust gitignore",
    "Terraform gitignore",
    "Docker gitignore",
    "macOS gitignore",
    "developer gitignore",
  ],
  openGraph: {
    title: ".gitignore generator — stack presets and download",
    description:
      "Combine curated ignore rules for common languages and tools, edit in the preview, then copy or download .gitignore.",
  },
};

const PAGE_PATH = "/dev/gitignore-generator";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function GitignoreGeneratorLayout({
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
    name: ".gitignore generator (multi-stack)",
    url: pageUrl,
    description:
      "Pick operating systems, languages, frameworks, and editors to merge a tailored .gitignore. Preview is editable; copy to clipboard or download .gitignore. Runs entirely in the browser.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript for template merge and file read.",
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
        name: ".gitignore generator",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: gitignoreGeneratorFaqItems.map((item) => ({
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
    name: "How to generate a .gitignore file for your stack",
    description:
      "Select languages, frameworks, operating systems, and editors; review the merged preview; optionally upload an existing file; then copy or download .gitignore for your repository.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose your stack",
        text: "Check boxes for macOS, Windows, or Linux junk files; your runtime such as Node, Python, or Rust; frameworks like Next.js or Vue; infra like Terraform or Docker; and VS Code or JetBrains patterns.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Review and edit",
        text: "Read the merged preview. Remove duplicate lines if two sections overlap. Use quick presets (Next.js kit, Python kit, Rust kit) or upload an existing .gitignore to extend it, then reset to selections if you want a clean merge again.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Save into your repo",
        text: "Copy with the copy control or download as .gitignore, place it at the repository root (or use sparse rules in subfolders if you use multiple files), commit it, and verify secrets are not tracked.",
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
