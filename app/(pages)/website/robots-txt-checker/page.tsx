import type { Metadata } from "next";
import Link from "next/link";
import { RobotsTxtCheckerTool } from "./robots-txt-checker-tool";
import { robotsTxtCheckerFaqItems } from "@/lib/robots-txt-checker-faq";
import { toolSections } from "@/lib/tool-catalog";

export const dynamic = "force-static";

const websiteTools =
  toolSections.find((s) => s.id === "website-url-tools")?.tools ?? [];
const relatedTools = websiteTools.filter(
  (t) => t.href !== "/website/robots-txt-checker",
);

export const metadata: Metadata = {
  alternates: {
    canonical: "/website/robots-txt-checker",
  },
};

export default function RobotsTxtCheckerPage() {
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
            <span className="text-foreground">Robots.txt checker</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Robots.txt checker for SEO, crawlers, and sitemap discovery
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Pull the live{" "}
            <strong className="font-medium text-foreground">robots.txt</strong>{" "}
            file from any public website and review{" "}
            <strong className="font-medium text-foreground">
              User-agent groups
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              Allow and Disallow
            </strong>{" "}
            path rules, optional{" "}
            <strong className="font-medium text-foreground">Crawl-delay</strong>{" "}
            lines, and every{" "}
            <strong className="font-medium text-foreground">Sitemap</strong>{" "}
            declaration in one place. Use it for{" "}
            <strong className="font-medium text-foreground">
              technical SEO audits
            </strong>
            , pre-launch checklists, migration QA, and debugging accidental{" "}
            <strong className="font-medium text-foreground">
              crawl blocks
            </strong>{" "}
            before rankings and discoverability suffer.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <RobotsTxtCheckerTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            How to use this robots.txt analyzer
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Paste a{" "}
            <strong>canonical homepage URL</strong> (with https://), a bare
            domain such as <code className="text-sm">example.com</code>, or a
            direct link to <code className="text-sm">/robots.txt</code>. Submit
            to fetch the file from our servers with redirect following and SSRF
            protections aligned with the rest of this toolkit. Start with the{" "}
            <strong>HTTP status</strong> and <strong>final URL</strong>: a 404
            often means “no file,” which behaves differently from a 200 with
            restrictive rules. Then read <strong>parsed groups</strong> from top
            to bottom—each <strong>User-agent</strong> section applies to the
            bots named until the next User-agent line.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Cross-check indexing signals beyond the file: use the{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            for robots meta and viewport, the{" "}
            <Link
              href="/website/canonical-tag-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              canonical tag checker
            </Link>{" "}
            for duplicate URL consolidation, and the{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>{" "}
            for <code className="text-sm">X-Robots-Tag</code> or cache headers
            that interact with crawling.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Guide: reading Allow, Disallow, and Sitemap lines
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Modern crawlers follow{" "}
            <strong>RFC 9309</strong>-style matching: rules use URL path
            prefixes, <strong>Allow</strong> can carve exceptions out of a broad{" "}
            <strong>Disallow</strong>, and the most specific rule wins when both
            match. A lone <code className="text-sm">User-agent: *</code> block
            is the default policy for unspecified bots; vendor-specific blocks
            (for example Googlebot or Bingbot) override details only for those
            user agents. <strong>Sitemap</strong> lines advertise XML sitemap
            endpoints—prefer absolute <code className="text-sm">https://</code>{" "}
            URLs so parsers do not have to guess the host.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Remember: <strong>robots.txt manages fetch permission</strong>, not
            guaranteed de-indexing. If a URL is disallowed but heavily linked,
            search engines may still show a snippet without fetching. Pair
            disallow rules with on-page or header-level noindex when you need
            stronger removal behavior, and keep marketing parameters under
            control with the{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>{" "}
            so crawlers reach stable URLs efficiently.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            When to re-check robots.txt in your workflow
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              After <strong>site migrations</strong>, CMS changes, or enabling a
              CDN/WAF that might serve a different edge response.
            </li>
            <li>
              Before and after <strong>staging merges</strong>—never copy
              staging disallow rules into production by accident.
            </li>
            <li>
              When Search Console reports <strong>crawl anomalies</strong> on
              sections you expect indexed.
            </li>
            <li>
              When you add or split <strong>sitemap files</strong>; list them in
              robots.txt and confirm they resolve with the{" "}
              <Link
                href="/website/response-code-checker"
                className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
              >
                response code checker
              </Link>
              .
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Infrastructure checks that complement robots.txt
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Crawlers need resolvable DNS, valid TLS, and consistent hostnames.
            Use the{" "}
            <Link
              href="/website/dns-lookup"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              DNS lookup tool
            </Link>{" "}
            for A/AAAA/CNAME correctness, the{" "}
            <Link
              href="/website/ssl-certificate-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SSL certificate checker
            </Link>{" "}
            before certificate expiry interrupts fetches, and the{" "}
            <Link
              href="/website/broken-link-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              broken link checker
            </Link>{" "}
            after you change URL patterns referenced in Allow or Disallow
            rules.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related free tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Explore the full{" "}
            <Link
              href="/#website-url-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              website and URL tools
            </Link>{" "}
            on the home page, or jump to a focused utility below.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {relatedTools.slice(0, 10).map((tool) => (
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
            {robotsTxtCheckerFaqItems.map((item) => (
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
