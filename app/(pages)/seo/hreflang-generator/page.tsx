import type { Metadata } from "next";
import Link from "next/link";
import { HreflangGeneratorTool } from "./hreflang-generator-tool";
import { hreflangGeneratorFaqItems } from "@/lib/hreflang-generator-faq";
import { toolSections } from "@/lib/tool-catalog";

const seoTools = toolSections.find((s) => s.id === "seo-tools")?.tools ?? [];
const relatedTools = seoTools.filter((t) => t.href !== "/seo/hreflang-generator");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/seo/hreflang-generator",
  },
};

export default function HreflangGeneratorPage() {
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
            <span className="text-foreground">Hreflang tag generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Hreflang tag generator — alternate links for multilingual and international SEO
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This free{" "}
            <strong className="font-medium text-foreground">hreflang tag generator</strong>{" "}
            helps you build correct{" "}
            <strong className="font-medium text-foreground">HTML link elements</strong> with{" "}
            <strong className="font-medium text-foreground">rel=&quot;alternate&quot;</strong> and{" "}
            <strong className="font-medium text-foreground">hreflang</strong> for every page in a{" "}
            <strong className="font-medium text-foreground">language or region cluster</strong>.
            Enter each localized URL with its{" "}
            <strong className="font-medium text-foreground">BCP 47 language tag</strong> (for example{" "}
            <strong className="font-medium text-foreground">en-GB</strong>,{" "}
            <strong className="font-medium text-foreground">de</strong>, or{" "}
            <strong className="font-medium text-foreground">x-default</strong>), then{" "}
            <strong className="font-medium text-foreground">copy</strong> the snippet for your{" "}
            <strong className="font-medium text-foreground">&lt;head&gt;</strong> or{" "}
            <strong className="font-medium text-foreground">upload</strong> a CSV of pairs. Processing
            stays in your browser. After launch, validate{" "}
            <strong className="font-medium text-foreground">canonicals</strong> and{" "}
            <strong className="font-medium text-foreground">redirects</strong> with the{" "}
            <Link
              href="/website/canonical-tag-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              canonical tag checker
            </Link>{" "}
            and{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>
            , and keep crawl hints aligned using the{" "}
            <Link
              href="/seo/robots-txt-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              robots.txt generator
            </Link>{" "}
            and{" "}
            <Link
              href="/seo/sitemap-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              XML sitemap generator
            </Link>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <HreflangGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why hreflang matters for multilingual SEO
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Search engines use{" "}
            <strong className="font-medium text-foreground">hreflang annotations</strong> to
            understand which URL targets which audience. That reduces mixed signals when the same
            content exists in multiple languages, helps surface the right{" "}
            <strong className="font-medium text-foreground">country and language version</strong> in
            results, and supports large{" "}
            <strong className="font-medium text-foreground">international SEO</strong> programs.
            Hreflang does not replace strong information architecture—you still need clean URLs,
            consistent internal linking, and valid{" "}
            <strong className="font-medium text-foreground">HTTP status codes</strong>.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Teams often search for{" "}
            <strong className="font-medium text-foreground">hreflang generator</strong>,{" "}
            <strong className="font-medium text-foreground">hreflang HTML</strong>,{" "}
            <strong className="font-medium text-foreground">multilingual meta tags</strong>, and{" "}
            <strong className="font-medium text-foreground">x-default best practices</strong>. This
            page focuses on fast, accurate{" "}
            <strong className="font-medium text-foreground">link rel alternate</strong> output you
            can hand to engineering or paste into a CMS header field. For structured data in JSON-LD,
            pair with the{" "}
            <Link
              href="/seo/schema-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              schema markup generator
            </Link>{" "}
            when you also expose entities like{" "}
            <strong className="font-medium text-foreground">Article</strong> or{" "}
            <strong className="font-medium text-foreground">Product</strong>.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this hreflang generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                List every localized URL that represents the{" "}
                <strong className="font-medium text-foreground">same conceptual page</strong>. Use
                stable, canonical URLs (usually HTTPS). Avoid parameter soup when a clean path exists.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Assign a{" "}
                <strong className="font-medium text-foreground">language or language-region code</strong>{" "}
                per row—common values include <strong className="font-medium text-foreground">en</strong>,{" "}
                <strong className="font-medium text-foreground">en-US</strong>,{" "}
                <strong className="font-medium text-foreground">fr-CA</strong>, and{" "}
                <strong className="font-medium text-foreground">x-default</strong> for your fallback.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click <strong className="font-medium text-foreground">Insert example</strong> to see a
                four-locale pattern, or use <strong className="font-medium text-foreground">Upload</strong>{" "}
                with one <strong className="font-medium text-foreground">url,hreflang</strong> pair per
                line. Fix any duplicate-code or URL warnings before deployment.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use <strong className="font-medium text-foreground">Copy</strong> to grab the HTML block.
                Place the same tags in the <strong className="font-medium text-foreground">&lt;head&gt;</strong>{" "}
                of <strong className="font-medium text-foreground">each</strong> alternate page. If you
                edit the textarea manually, <strong className="font-medium text-foreground">Reset to generated</strong>{" "}
                reapplies the computed output from your rows.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and topics covered here
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            The generator normalizes tags (for example <strong className="font-medium text-foreground">en-gb</strong>{" "}
            to <strong className="font-medium text-foreground">en-GB</strong>), sorts{" "}
            <strong className="font-medium text-foreground">x-default</strong> last for readability,
            and flags duplicate hreflang values. Related workflows include{" "}
            <strong className="font-medium text-foreground">Open Graph</strong> QA with the{" "}
            <Link
              href="/seo/og-tag-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph tag generator
            </Link>
            , campaign URLs via the{" "}
            <Link
              href="/seo/utm-builder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              UTM link builder
            </Link>
            , and on-page copy tuning with the{" "}
            <Link
              href="/seo/keyword-density"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              keyword density checker
            </Link>{" "}
            and{" "}
            <Link
              href="/seo/readability-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              readability score checker
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Technical checklist after you add hreflang
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Confirm each URL returns <strong className="font-medium text-foreground">200 OK</strong> for
            the intended locale, that <strong className="font-medium text-foreground">canonical</strong>{" "}
            tags self-reference, and that temporary marketing redirects do not strip parameters your
            analytics rely on. For migration audits, the{" "}
            <Link
              href="/seo/redirect-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect type checker
            </Link>{" "}
            helps verify status codes. Large sites often mirror hreflang in{" "}
            <strong className="font-medium text-foreground">XML sitemaps</strong>—the sitemap generator
            above complements head-level tags rather than replacing them.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            More SEO tools in this collection
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Explore the full{" "}
            <Link
              href="/#seo-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SEO tools
            </Link>{" "}
            section on the homepage. Highlights:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {relatedTools.slice(0, 14).map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  {tool.name}
                </Link>
                {" — "}
                <span className="text-zinc-600 dark:text-zinc-400">{tool.description}</span>
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
            {hreflangGeneratorFaqItems.map((item) => (
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
