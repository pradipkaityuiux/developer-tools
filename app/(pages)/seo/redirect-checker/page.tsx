import type { Metadata } from "next";
import Link from "next/link";
import { RedirectCheckerTool } from "./redirect-checker-tool";
import { redirectTypeCheckerFaqItems } from "@/lib/redirect-type-checker-faq";
import { toolSections } from "@/lib/tool-catalog";

export const dynamic = "force-static";

const seoTools =
  toolSections.find((s) => s.id === "seo-tools")?.tools ?? [];
const relatedTools = seoTools.filter(
  (t) => t.href !== "/seo/redirect-checker",
);

export const metadata: Metadata = {
  alternates: {
    canonical: "/seo/redirect-checker",
  },
};

export default function RedirectCheckerPage() {
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
            <span className="text-foreground">Redirect type checker</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Redirect type checker for 301, 302, 307, 308, and migration timing
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This free{" "}
            <strong className="font-medium text-foreground">
              SEO redirect type checker
            </strong>{" "}
            shows whether a public URL responds with a{" "}
            <strong className="font-medium text-foreground">
              permanent redirect (301 or 308)
            </strong>
            , a{" "}
            <strong className="font-medium text-foreground">
              temporary redirect (302, 303, or 307)
            </strong>
            , or a final{" "}
            <strong className="font-medium text-foreground">2xx/4xx/5xx</strong>{" "}
            status after the chain completes. Each step lists the{" "}
            <strong className="font-medium text-foreground">
              Location header
            </strong>{" "}
            target and{" "}
            <strong className="font-medium text-foreground">
              milliseconds to response headers
            </strong>{" "}
            so you can compare legacy paths, marketing parameters, and CDN rules
            during{" "}
            <strong className="font-medium text-foreground">
              site migrations
            </strong>
            . Paste one URL for a full trace or load up to eight lines for a
            spreadsheet-style batch. Pair results with our{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>{" "}
            when you only need hop counts, or the{" "}
            <Link
              href="/website/response-code-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP status code checker
            </Link>{" "}
            for headline final codes.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <RedirectCheckerTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why redirect types matter for SEO and analytics
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Search engines treat{" "}
            <strong className="font-medium text-foreground">
              permanent redirects
            </strong>{" "}
            as strong consolidation signals toward the destination URL, while
            many{" "}
            <strong className="font-medium text-foreground">
              temporary redirects
            </strong>{" "}
            suggest the source may return—useful for promos, but risky when a
            &quot;temporary&quot; 302 is left on a durable URL move. Mixed
            signals between{" "}
            <strong className="font-medium text-foreground">HTTP redirects</strong>
            ,{" "}
            <Link
              href="/website/canonical-tag-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              rel=canonical
            </Link>
            , and internal links can dilute crawl budget and confuse analytics
            landing reports. This tool makes the{" "}
            <strong className="font-medium text-foreground">
              redirect status code
            </strong>{" "}
            explicit at every hop so content, web, and growth teams share the
            same facts before go-live.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Keywords teams search for—
            <strong className="font-medium text-foreground">
              check 301 redirect
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              301 vs 302 SEO
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              HTTP redirect audit
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              migration redirect testing
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              redirect timing
            </strong>
            —map to what you see here: class name, chain length, and per-hop
            latency. After technical checks, tune how results appear in search
            with the{" "}
            <Link
              href="/seo/meta-length-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta title and description checker
            </Link>{" "}
            and structured data flows with the{" "}
            <Link
              href="/seo/schema-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              schema markup generator
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this redirect type checker
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Pick <strong className="font-medium text-foreground">single URL</strong>{" "}
                when you are validating one legacy path, homepage protocol/host
                variants, or a tracked campaign link. Include{" "}
                <code className="text-sm text-foreground">https://</code> when
                possible so you mirror production.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Choose <strong className="font-medium text-foreground">migration list</strong>{" "}
                to paste up to eight non-empty lines—export a column from a
                redirect sheet—or{" "}
                <strong className="font-medium text-foreground">upload a .txt</strong>{" "}
                file. We analyze rows in order and surface a summary table plus
                expandable hop details.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read each hop: note whether the first redirect is{" "}
                <strong className="font-medium text-foreground">301/308</strong>{" "}
                versus{" "}
                <strong className="font-medium text-foreground">302/303/307</strong>
                , count extra hops, and compare milliseconds. Use{" "}
                <strong className="font-medium text-foreground">Copy report</strong>{" "}
                to paste into tickets, Confluence, or a runbook.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Follow up with crawler-facing artifacts: maintain{" "}
                <Link
                  href="/seo/sitemap-generator"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  XML sitemaps
                </Link>
                ,{" "}
                <Link
                  href="/seo/robots-txt-generator"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  robots.txt
                </Link>
                , and multilingual clusters via the{" "}
                <Link
                  href="/seo/hreflang-generator"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  hreflang tag generator
                </Link>{" "}
                so discovery matches your new URL graph.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Internal links and companion tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            When campaigns need consistent measurement, build tracked URLs with
            the{" "}
            <Link
              href="/seo/utm-builder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              UTM link builder
            </Link>{" "}
            and then confirm redirects do not strip required parameters at the
            edge. For social previews after URLs stabilize, use the{" "}
            <Link
              href="/seo/og-tag-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph tag generator
            </Link>
            . Apache stacks often centralize rules in our{" "}
            <Link
              href="/security/htaccess-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              .htaccess generator
            </Link>{" "}
            before you re-run this checker against the same paths.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related SEO tools in this catalog
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {relatedTools.map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  {tool.name}
                </Link>
                {" — "}
                <span>{tool.description}</span>
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
            {redirectTypeCheckerFaqItems.map((item) => (
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
