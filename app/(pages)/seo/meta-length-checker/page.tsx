import type { Metadata } from "next";
import Link from "next/link";
import { MetaLengthCheckerTool } from "./meta-length-checker-tool";
import { metaLengthCheckerFaqItems } from "@/lib/meta-length-checker-faq";
import {
  DESC_IDEAL_MAX,
  DESC_IDEAL_MIN,
  TITLE_IDEAL_MAX,
  TITLE_WARNING_MAX,
} from "@/lib/meta-length-checker-core";
import { toolSections } from "@/lib/tool-catalog";

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/seo/meta-length-checker",
  },
};

const seoTools =
  toolSections.find((s) => s.id === "seo-tools")?.tools ?? [];
const relatedSeoTools = seoTools.filter(
  (t) => t.href !== "/seo/meta-length-checker",
);

export default function MetaLengthCheckerPage() {
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
            <Link
              href="/#seo-tools"
              className="hover:text-foreground"
            >
              SEO tools
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span className="text-foreground">Meta length checker</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Meta title &amp; description length checker for SEO snippets
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              meta title length checker
            </strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">
              meta description length checker
            </strong>{" "}
            before you ship pages. Count characters in real time, compare against
            common{" "}
            <strong className="font-medium text-foreground">
              Google snippet
            </strong>{" "}
            planning bands, and{" "}
            <strong className="font-medium text-foreground">
              paste or upload HTML
            </strong>{" "}
            to pull{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              &lt;title&gt;
            </code>{" "}
            and{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              meta name=&quot;description&quot;
            </code>{" "}
            without sending your content to a server. Built for content editors,
            growth teams, and developers who want fast{" "}
            <strong className="font-medium text-foreground">on-page SEO</strong>{" "}
            QA on drafts and staging copy.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <MetaLengthCheckerTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why meta title and meta description length still matter
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Search engines do not publish fixed{" "}
            <strong className="font-medium text-foreground">
              character limits
            </strong>
            . They render result lines using pixel width and may{" "}
            <strong className="font-medium text-foreground">
              rewrite titles and descriptions
            </strong>{" "}
            when they believe other text is a better match. Even so, editorial
            teams still plan{" "}
            <strong className="font-medium text-foreground">title tag length</strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">
              meta description length
            </strong>{" "}
            so the primary keyword, brand, and value proposition survive in typical
            desktop and mobile layouts. This tool focuses on{" "}
            <strong className="font-medium text-foreground">character counts</strong>{" "}
            as a practical proxy—easy to communicate in briefs and CMS fields—while
            reminding you that the live{" "}
            <strong className="font-medium text-foreground">SERP snippet</strong> is
            the final source of truth.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How we interpret “ideal” bands in this checker
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            For{" "}
            <strong className="font-medium text-foreground">page titles</strong>, we
            highlight a band around{" "}
            <strong className="font-medium text-foreground">
              {TITLE_IDEAL_MAX} characters or fewer
            </strong>{" "}
            as a common planning target for many result layouts, and we flag titles
            beyond roughly{" "}
            <strong className="font-medium text-foreground">
              {TITLE_WARNING_MAX} characters
            </strong>{" "}
            as more likely to truncate. For{" "}
            <strong className="font-medium text-foreground">
              meta descriptions
            </strong>
            , we treat roughly{" "}
            <strong className="font-medium text-foreground">
              {DESC_IDEAL_MIN}–{DESC_IDEAL_MAX} characters
            </strong>{" "}
            as a balanced range: enough space for a benefit and soft call to action
            without running far into ellipsis territory on narrow screens. These are
            guidelines for drafting—not guarantees of what Google or Bing will show.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Title tag vs meta description: different jobs
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            The{" "}
            <strong className="font-medium text-foreground">HTML title</strong>{" "}
            competes for attention in the search results list; it should align with
            query intent, include the primary topic early when natural, and stay
            readable when truncated. The{" "}
            <strong className="font-medium text-foreground">
              meta description
            </strong>{" "}
            supports the title with a concise pitch—who the page is for, what they
            get, and why click. After you stabilize lengths here, validate keyword
            usage and repetition with our{" "}
            <Link
              href="/seo/keyword-density"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              keyword density checker
            </Link>{" "}
            and readability with the{" "}
            <Link
              href="/seo/readability-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              readability score checker
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            HTML import: when paste or upload saves time
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            If you already have a static HTML file, a component render, or a saved
            crawl, drop it into the HTML panel or use{" "}
            <strong className="font-medium text-foreground">Upload HTML file</strong>.
            We parse in your browser and fill the title and description fields when{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              meta name=&quot;description&quot;
            </code>{" "}
            exists; if it does not, we can fall back to{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              og:description
            </code>
            . For a live URL audit that lists the full head, pair this workflow with
            the{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            and the{" "}
            <Link
              href="/website/open-graph-preview"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph preview
            </Link>{" "}
            for social cards.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this meta length checker (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  Write or import
                </strong>{" "}
                your draft title and meta description. Use{" "}
                <strong className="font-medium text-foreground">Apply HTML to fields</strong>{" "}
                after pasting markup, or upload a small{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  .html
                </code>{" "}
                file to populate both inputs.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read the{" "}
                <strong className="font-medium text-foreground">
                  character totals and colored hints
                </strong>
                . Green-style bands mean your text is inside a typical editorial
                target; amber and red-style bands suggest truncation risk or copy
                that may be too thin.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use the{" "}
                <strong className="font-medium text-foreground">Copy</strong> buttons to
                move the final strings into your CMS, framework head component, or{" "}
                <Link
                  href="/seo/og-tag-generator"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  Open Graph tag generator
                </Link>{" "}
                workflow so marketing and SEO fields stay aligned.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                After launch, continue technical SEO coverage: ship a{" "}
                <Link
                  href="/seo/sitemap-generator"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  XML sitemap
                </Link>
                , maintain{" "}
                <Link
                  href="/seo/robots-txt-generator"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  robots.txt rules
                </Link>
                , add structured data with the{" "}
                <Link
                  href="/seo/schema-generator"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  schema markup generator
                </Link>
                , and verify redirects with the{" "}
                <Link
                  href="/seo/redirect-checker"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  redirect type checker
                </Link>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Multilingual and campaign landing pages
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            When you localize pages, title and description lengths change with
            language and script. Re-run this checker per locale, then wire hreflang
            clusters with the{" "}
            <Link
              href="/seo/hreflang-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              hreflang tag generator
            </Link>
            . For paid and email campaigns, keep UTM links consistent using the{" "}
            <Link
              href="/seo/utm-builder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              UTM link builder
            </Link>{" "}
            so analytics still attributes traffic after you tune snippets.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related SEO tools on this site
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Browse the full{" "}
            <Link
              href="/#seo-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SEO tools
            </Link>{" "}
            section on the home page, or open a focused utility below.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {relatedSeoTools.map((tool) => (
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
            {metaLengthCheckerFaqItems.map((item) => (
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
