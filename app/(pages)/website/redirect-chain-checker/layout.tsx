import type { Metadata } from "next";
import { redirectChainCheckerFaqItems } from "@/lib/redirect-chain-checker-faq";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Redirect chain checker — trace URL hops & fix SEO chains",
  description:
    "Free redirect chain checker: enter any public HTTP or HTTPS URL and see every hop—301, 302, 307, 308, final status, and Location headers. Ideal for SEO audits, migration QA, and performance tuning.",
  keywords: [
    "redirect chain checker",
    "URL redirect checker",
    "trace redirects",
    "301 redirect chain",
    "redirect hop analyzer",
    "SEO redirect audit",
    "HTTP redirect path",
    "find redirect loops",
    "too many redirects",
    "canonical redirect test",
  ],
  openGraph: {
    title: "Redirect chain checker — map every redirect hop",
    description:
      "Follow the full redirect path from a starting URL to the final response. Spot long chains, missing Location headers, and loops before they hurt SEO or speed.",
  },
};

const PAGE_PATH = "/website/redirect-chain-checker";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function RedirectChainCheckerLayout({
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
    name: "Redirect chain checker",
    url: pageUrl,
    description:
      "Free online tool to trace HTTP and HTTPS redirect chains for any public URL—record each status code and Location header to optimize SEO, migrations, and page speed.",
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
        name: "Redirect chain checker",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: redirectChainCheckerFaqItems.map((item) => ({
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
    name: "How to trace a URL redirect chain",
    description:
      "Use the redirect chain checker to request a public URL with manual redirect handling, list each HTTP status and Location value, and read the final URL and status.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste the URL to trace",
        text: "Copy the full HTTP or HTTPS address you want to audit—such as an old campaign link, legacy path, or homepage—and paste it into the URL field.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Run the trace",
        text: "Click Trace redirects. The tool performs a GET with manual redirect handling, validates each hop against public-host safety rules, and records status codes and Location headers until a non-redirect response or a limit is reached.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Review hops and fix at the source",
        text: "Read the numbered steps: each row is one HTTP response. If you see many 301 or 302 hops, update links, canonical tags, and server or CDN rules so users and crawlers reach the final URL in fewer round trips.",
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
