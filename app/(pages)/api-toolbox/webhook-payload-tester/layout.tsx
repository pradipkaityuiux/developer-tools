import type { Metadata } from "next";
import { webhookPayloadTesterFaqItems } from "@/lib/webhook-payload-tester-faq";

const PAGE_PATH = "/api-toolbox/webhook-payload-tester";

export const metadata: Metadata = {
  title:
    "Webhook payload tester — local POST body log & JSON practice (browser-only)",
  description:
    "Free webhook debugging helper: paste or upload HTTP POST bodies, set Content-Type and headers, validate JSON, and record samples in localStorage when you have no public webhook URL—templates for Stripe- and GitHub-style payloads, copy-as-JSON export.",
  keywords: [
    "webhook payload tester",
    "webhook debugging",
    "test webhook locally",
    "webhook POST body",
    "localStorage webhook log",
    "JSON webhook validation",
    "Stripe webhook test",
    "GitHub webhook payload",
    "webhook replay",
    "inbound HTTP payload",
  ],
  openGraph: {
    title: "Webhook payload tester — practice inbound POST bodies offline",
    description:
      "Record webhook-style payloads in your browser: Content-Type, headers, raw body, templates, and a persistent local log—no server upload.",
  },
};

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function WebhookPayloadTesterLayout({
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
    name: "Webhook payload tester",
    url: pageUrl,
    description:
      "Practice webhook debugging in the browser: paste or upload raw POST bodies, optional HTTP headers, Content-Type selection, JSON validation and formatting, quick templates, and a localStorage-backed event log with copy-as-JSON—no payloads sent to the site backend.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements:
      "Requires JavaScript and localStorage for the optional persistent log.",
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
        name: "Webhook payload tester",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: webhookPayloadTesterFaqItems.map((item) => ({
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
    name: "How to log and replay webhook payloads locally",
    description:
      "Set Content-Type and optional headers, paste or upload a raw body, validate JSON when applicable, record events to a browser log, and copy entries as JSON for tickets or replay scripts.",
    totalTime: "PT5M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Prepare the payload",
        text: "Paste a sample POST body from docs, logs, or a tunnel capture—or upload a .json/.txt file. Pick the Content-Type your handler expects and add signature or custom headers on separate lines.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Validate and format",
        text: "For JSON webhooks, use Format JSON after the body validates. Fix syntax errors before recording so your log matches production byte-for-byte where possible.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Record and export",
        text: "Click Record to local log to append an entry with a label and timestamp. Copy JSON per event for Jira, Slack, or to pair with HTTP tools when you send a replay request.",
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
