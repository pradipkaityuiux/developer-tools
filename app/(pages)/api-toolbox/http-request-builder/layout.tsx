import type { Metadata } from "next";
import { httpRequestBuilderFaqItems } from "@/lib/http-request-builder-faq";

export const metadata: Metadata = {
  title:
    "HTTP request builder — REST client in the browser (methods, headers, body)",
  description:
    "Free online HTTP request builder: choose GET/POST/PUT/PATCH/DELETE/HEAD/OPTIONS, edit headers and JSON or form bodies, send with fetch, inspect status and response headers, copy curl and response body—runs in your tab with CORS-aware debugging tips.",
  keywords: [
    "HTTP request builder",
    "REST client online",
    "API tester browser",
    "fetch API playground",
    "HTTP headers editor",
    "JSON POST request",
    "curl generator",
    "test API without Postman",
    "CORS debugging",
    "HTTP client web",
  ],
  openGraph: {
    title: "HTTP request builder — compose and send HTTP requests",
    description:
      "Pick method, URL, headers, and body; send requests and copy curl equivalents—ideal for API debugging and documentation.",
  },
};

const PAGE_PATH = "/api-toolbox/http-request-builder";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function HttpRequestBuilderLayout({
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
    name: "HTTP Request Builder",
    url: pageUrl,
    description:
      "Browser-based HTTP and REST client: configure method, absolute URL, custom headers, JSON or form-encoded bodies, optional credentials; execute with fetch; view timing, status, response headers, and formatted JSON body; export copy-ready curl commands.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and a CORS-enabled API for cross-origin calls.",
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
        name: "HTTP Request Builder",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: httpRequestBuilderFaqItems.map((item) => ({
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
    name: "How to send HTTP requests from the browser",
    description:
      "Enter an HTTPS URL, choose an HTTP method, add headers and optional JSON or form body, send the request, then copy the response or curl snippet.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter URL and method",
        text: "Paste a full http or https URL. Select GET for safe reads, POST or PUT for creates and updates, DELETE for removal, HEAD for headers only, or OPTIONS for discovery metadata.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Configure headers and body",
        text: "Add Authorization, Accept, Content-Type, and custom headers as name/value pairs. For POST-like methods, pick JSON, raw text, or form URL-encoded fields and optionally upload a file into the body editor.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Send and inspect",
        text: "Click Send to run fetch in the browser. Review HTTP status, elapsed milliseconds, response headers, and a pretty-printed JSON body when applicable. Copy the body, headers, or generated curl command for tickets and runbooks.",
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
