import type { Metadata } from "next";
import Link from "next/link";
import { CanonicalTagCheckerTool } from "./canonical-tag-checker-tool";
import { canonicalTagCheckerFaqItems } from "@/lib/canonical-tag-checker-faq";
import { toolSections } from "@/lib/tool-catalog";

export const dynamic = "force-static";

const websiteTools =
  toolSections.find((s) => s.id === "website-url-tools")?.tools ?? [];
const relatedTools = websiteTools.filter(
  (t) => t.href !== "/website/canonical-tag-checker",
);

export const metadata: Metadata = {
  alternates: {
    canonical: "/website/canonical-tag-checker",
  },
};

export default function CanonicalTagCheckerPage() {
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
            <span className="text-foreground">Canonical tag checker</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Canonical tag checker for duplicate-content SEO
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Audit live pages for{" "}
            <strong className="font-medium text-foreground">
              HTML canonical link elements
            </strong>{" "}
            (<code className="text-sm">rel=&quot;canonical&quot;</code>): we
            fetch the URL, follow{" "}
            <strong className="font-medium text-foreground">
              server-side redirects
            </strong>
            , parse the response, and list every canonical{" "}
            <strong className="font-medium text-foreground">href</strong> as an
            absolute address. Use it to catch{" "}
            <strong className="font-medium text-foreground">
              duplicate canonical tags
            </strong>
            , missing tags on indexable templates, and{" "}
            <strong className="font-medium text-foreground">
              self-reference mismatches
            </strong>{" "}
            after HTTPS, www, or trailing-slash normalization—common issues when
            migrations, CDNs, and CMS plugins stack together.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <CanonicalTagCheckerTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            How to use this canonical URL checker
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Paste the{" "}
            <strong>page URL</strong> you care about—category pages, product
            detail URLs, blog posts with query parameters, or landing pages from
            ads. Submit to run a server-side GET with the same{" "}
            <strong>public-host safety rules</strong> as our other website
            utilities. The tool shows the{" "}
            <strong>requested URL</strong> and the{" "}
            <strong>final URL after redirects</strong>, then enumerates each{" "}
            <code className="text-sm">&lt;link rel=&quot;canonical&quot;&gt;</code>{" "}
            it finds, with hrefs resolved against the final address. When only
            one canonical exists and it matches the final URL, you have a clean{" "}
            <strong>self-referencing canonical</strong> signal for search
            engines.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Pair this check with the{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>{" "}
            to see every hop before the HTML you parsed, the{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>{" "}
            for <code className="text-sm">Link: rel=&quot;canonical&quot;</code>{" "}
            HTTP headers on edge cases, and the{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            when you also need title tags, meta descriptions, Open Graph, and
            Twitter Card fields in one pass.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Why canonical tags matter for technical SEO
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Search engines discover many URLs that render similar content:
            tracking IDs (<code className="text-sm">utm_</code>, session keys),
            printable paths, faceted navigation, HTTP and HTTPS pairs, and
            regional copies. A{" "}
            <strong>canonical link element</strong> communicates which URL you
            prefer for indexing and ranking consolidation. It does not replace
            strong information architecture—you should still link internally to
            the preferred URL—but it reduces ambiguity when duplicates slip
            through.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            After you validate canonicals, confirm crawlability with the{" "}
            <Link
              href="/website/robots-txt-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              robots.txt checker
            </Link>
            , spot broken outbound links with the{" "}
            <Link
              href="/website/broken-link-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              broken link checker
            </Link>
            , and preview share cards with the{" "}
            <Link
              href="/website/open-graph-preview"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph preview
            </Link>{" "}
            so social metadata aligns with your canonical strategy.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Guide: self-referencing vs consolidating canonicals
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <strong className="text-foreground">Self-referencing</strong> — the
              canonical href matches the preferred URL of the page you are
              auditing (after redirects). This pattern is widely recommended for
              indexable templates because it makes the primary URL explicit.
            </li>
            <li>
              <strong className="text-foreground">Consolidation</strong> — the
              canonical href points at a different URL on purpose, for example
              when parameterised URLs should collapse to a clean path, or when
              syndicated articles reference the original publisher.
            </li>
            <li>
              <strong className="text-foreground">Accidental mismatch</strong> —{" "}
              the canonical points off-domain or to an unrelated path because of
              a CMS default, staging hostname leak, or mixed content from a
              migration. Cross-check with your XML sitemap and{" "}
              <Link
                href="/website/response-code-checker"
                className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
              >
                response codes
              </Link>{" "}
              on both the current and target URLs.
            </li>
            <li>
              <strong className="text-foreground">Multiple tags</strong> — more
              than one canonical in the same document is a maintenance smell;
              crawlers may discard inconsistent signals. Remove duplicates from
              theme partials, SEO plugins, and tag managers.
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Practical checklist after you run the checker
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              Verify the <strong>final URL</strong> is the hostname and path you
              want indexed (HTTPS, correct www or apex choice).
            </li>
            <li>
              Ensure exactly <strong>one</strong> canonical when the page should
              be indexable; use <code className="text-sm">noindex</code> instead
              of a random canonical when the page should not appear in search
              results.
            </li>
            <li>
              Align <strong>internal links</strong> and breadcrumb hrefs with the
              canonical target to avoid mixed signals.
            </li>
            <li>
              Re-test after CDN or edge changes—our fetch uses server-side
              redirects only, so compare with the{" "}
              <Link
                href="/website/redirect-chain-checker"
                className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
              >
                redirect chain checker
              </Link>{" "}
              if users hit extra hops before HTML.
            </li>
            <li>
              When canonicals cross subdomains, confirm DNS and TLS with the{" "}
              <Link
                href="/website/dns-lookup"
                className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
              >
                DNS lookup tool
              </Link>{" "}
              and{" "}
              <Link
                href="/website/ssl-certificate-checker"
                className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
              >
                SSL certificate checker
              </Link>
              .
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and concepts this tool helps you audit
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Teams search for phrases like{" "}
            <em>canonical tag checker</em>, <em>rel canonical validator</em>, and{" "}
            <em>duplicate canonical SEO</em> when preparing migrations, fixing
            ecommerce faceted URLs, or cleaning up blog tag pages. This utility
            focuses on the <strong>link element in HTML</strong>, not on Google
            Search Console coverage reports—use it as a fast preflight before
            you export crawl data or request indexing on updated templates.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related free tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browse the full{" "}
            <Link
              href="/#website-url-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              website and URL tools
            </Link>{" "}
            section on the home page, or open a focused utility below.
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
            {canonicalTagCheckerFaqItems.map((item) => (
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
