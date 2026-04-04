import type { Metadata } from "next";
import { robotsTxtCheckerFaqItems } from "@/lib/robots-txt-checker-faq";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "Robots.txt checker — fetch, parse & audit crawler rules online",
  description:
    "Free robots.txt checker: enter any public site URL to fetch /robots.txt, see HTTP status and final URL, review User-agent blocks, Allow and Disallow rules, Crawl-delay, and Sitemap lines—ideal for SEO audits and crawl troubleshooting.",
  keywords: [
    "robots.txt checker",
    "robots.txt validator",
    "check robots.txt online",
    "robots.txt analyzer",
    "crawler directives",
    "disallow allow robots",
    "sitemap in robots.txt",
    "SEO robots.txt audit",
    "robots.txt fetch tool",
    "User-agent robots.txt",
  ],
  openGraph: {
    title: "Robots.txt checker — parse directives & sitemap URLs",
    description:
      "Fetch a live robots.txt from any public website, inspect rules for Googlebot and other agents, and catch misconfiguration before it hurts crawling.",
  },
};

const PAGE_PATH = "/website/robots-txt-checker";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function RobotsTxtCheckerLayout({
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
    name: "Robots.txt checker",
    url: pageUrl,
    description:
      "Free online robots.txt checker: request /robots.txt for a public site, show raw text and a structured summary of crawler directives and sitemap declarations for SEO and engineering reviews.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Requires HTML.",
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
        name: "Robots.txt checker",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: robotsTxtCheckerFaqItems.map((item) => ({
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
    name: "How to check a website robots.txt file",
    description:
      "Use the robots.txt checker to resolve a public hostname, fetch /robots.txt, read HTTP status and parsed Allow, Disallow, and Sitemap lines, and note audit hints.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter your site URL or hostname",
        text: "Paste a homepage URL (https://example.com), a bare domain (example.com), or a direct https://example.com/robots.txt link. We resolve the origin and request the live robots.txt file from the public web.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Fetch and review the response",
        text: "Click Check robots.txt. The tool records status code, final URL after redirects, Content-Type, and the file body (truncated if extremely large).",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Read parsed groups and hints",
        text: "Compare User-agent sections, Allow and Disallow path rules, Crawl-delay if present, and Sitemap URLs. Use the hints list and related tools such as the HTTP header checker and redirect chain checker to validate hosting and edge behavior.",
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
