import type { Metadata } from "next";
import { fileHashFaqItems } from "@/lib/file-hash-faq";

export const metadata: Metadata = {
  title:
    "File hash checker online — MD5, SHA-1, SHA-256 checksum for any file (free, browser-only)",
  description:
    "Free online file hash checker: upload or drop a file to compute MD5, SHA-1, and SHA-256 digests in your browser. Copy hex checksums to verify downloads, releases, and backups—no server upload, client-side Web Crypto and MD5.",
  keywords: [
    "file hash checker",
    "MD5 file hash online",
    "SHA-256 checksum",
    "SHA-1 hash file",
    "verify download checksum",
    "file integrity checker",
    "compute file hash browser",
    "checksum verifier",
    "hash file locally",
    "release verification hash",
  ],
  openGraph: {
    title: "File hash checker — MD5, SHA-1, SHA-256 in the browser",
    description:
      "Upload a file and copy lowercase hex digests to match publisher checksums and catch corrupted downloads.",
  },
};

const PAGE_PATH = "/files/file-hash";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  return "";
}

export default function FileHashLayout({
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
    name: "File hash checker (MD5, SHA-1, SHA-256)",
    url: pageUrl,
    description:
      "Free client-side tool to compute MD5, SHA-1, and SHA-256 hexadecimal digests of any file you select. Uses the File API and Web Crypto in the tab—no upload to a backend—for verifying installers, archives, and exports against published checksums.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript, File API, and Web Crypto (SHA-1/SHA-256).",
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
        name: "File hash checker",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: fileHashFaqItems.map((item) => ({
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
    name: "How to check a file hash (MD5, SHA-1, SHA-256) online",
    description:
      "Choose a file from your device or drag it into the drop zone, wait for the tool to read bytes and compute digests, then copy individual hashes or all checksums at once to compare with publisher documentation.",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Add a file",
        text: "Click Upload file or drag any file onto the dashed area. The reader loads the full file into memory in your browser (subject to the on-page size limit).",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Review digests",
        text: "When computation finishes, compare MD5, SHA-1, and SHA-256 values with the checksum published for that exact artifact. Prefer SHA-256 when both are listed.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy checksums",
        text: "Use Copy next to each hash or Copy all checksums to paste into tickets, runbooks, or verification scripts. Clear and repeat for another file as needed.",
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
