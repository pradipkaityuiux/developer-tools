import type { Metadata } from "next";
import Link from "next/link";
import { DomainAgeCheckerTool } from "./domain-age-checker-tool";
import { domainAgeCheckerFaqItems } from "@/lib/domain-age-checker-faq";
import { toolSections } from "@/lib/tool-catalog";

export const dynamic = "force-static";

const websiteTools =
  toolSections.find((s) => s.id === "website-url-tools")?.tools ?? [];
const relatedTools = websiteTools.filter(
  (t) => t.href !== "/website/domain-age-checker",
);

export const metadata: Metadata = {
  alternates: {
    canonical: "/website/domain-age-checker",
  },
};

export default function DomainAgeCheckerPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-zinc-200/80 bg-zinc-50/80 dark:border-zinc-800/80 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <nav className="text-sm text-zinc-500 dark:text-zinc-400">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span className="text-foreground">Domain age checker</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Domain age checker for SEO, trust, and due diligence
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Look up{" "}
            <strong className="font-medium text-foreground">
              domain registration date
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              expiration
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              last changed
            </strong>{" "}
            timestamps from public{" "}
            <strong className="font-medium text-foreground">RDAP</strong> data.
            See an estimated{" "}
            <strong className="font-medium text-foreground">domain age</strong>{" "}
            in years and months—ideal when you need a fast signal alongside
            content quality, backlinks, and technical checks.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <DomainAgeCheckerTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            How to use this domain age lookup
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Paste a bare hostname such as{" "}
            <span className="font-mono text-sm text-foreground">example.com</span>{" "}
            or a full{" "}
            <span className="font-mono text-sm text-foreground">
              https://www.example.com
            </span>{" "}
            URL—our parser keeps the host, normalizes casing, and applies the same
            public-network safety checks we use elsewhere. Submit the form to
            query RDAP; when a subdomain does not have its own registration
            object, we progressively remove leftmost labels until we reach a
            likely apex match (for example{" "}
            <span className="font-mono text-sm text-foreground">www.</span>{" "}
            prefixes and deep hosts). Read the{" "}
            <strong>registration</strong> event as the usual starting point for{" "}
            <strong>how old the domain is</strong>, then cross-reference{" "}
            <strong>expiration</strong> with your renewal calendar and{" "}
            <strong>last changed</strong> with migration or transfer history.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Pair age research with routing data from our{" "}
            <Link
              href="/website/dns-lookup"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              DNS lookup tool
            </Link>
            , transport security from the{" "}
            <Link
              href="/website/ssl-certificate-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SSL certificate checker
            </Link>
            , and HTTP behavior from the{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>{" "}
            so you are not judging a brand on registration metadata alone.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Domain age and SEO: what practitioners actually measure
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            SEO discussions often mention <strong>domain age</strong> as a proxy
            for stability. Publicly visible registration timestamps can align
            with long-running brands, but they do not replace on-page quality,
            crawl health, or authoritative backlinks. Use this utility to
            capture a reproducible <strong>domain created date</strong> snapshot,
            then continue audits with our{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>
            ,{" "}
            <Link
              href="/website/response-code-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              response code checker
            </Link>
            , and{" "}
            <Link
              href="/website/canonical-tag-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              canonical tag checker
            </Link>{" "}
            to verify how search engines experience your URLs in practice.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            WHOIS vs RDAP: why we prefer RDAP for age checks
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            RDAP delivers structured JSON over HTTPS, which scales better for
            lightweight tools than parsing legacy WHOIS text. When you need a
            complementary registrar-oriented view, open our{" "}
            <Link
              href="/website/whois-lookup"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              WHOIS lookup
            </Link>{" "}
            as well. Registries still
            control redaction, so some fields may be missing even when{" "}
            <strong>domain expiry</strong> and{" "}
            <strong>registration</strong> events are present. If you need live
            page metadata rather than naming-system records, pivot to the{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            or{" "}
            <Link
              href="/website/technology-detector"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              technology detector
            </Link>{" "}
            after you finish registrar-level research here.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related free website and URL tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Browse the full{" "}
            <Link
              href="/#website-url-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              website and URL tools
            </Link>{" "}
            section on the home page, or open a focused checker from the list
            below—each complements domain-age research with a different layer of
            the stack.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {relatedTools.slice(0, 12).map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  {tool.name}
                </Link>
                {" — "}
                <span className="text-zinc-600 dark:text-zinc-400">
                  {tool.description}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <section className="mt-16 max-w-3xl" aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            Frequently asked questions
          </h2>
          <dl className="mt-6 space-y-4">
            {domainAgeCheckerFaqItems.map((item) => (
              <div
                key={item.question}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <dt className="font-medium text-foreground">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </div>
  );
}
