import type { Metadata } from "next";
import Link from "next/link";
import { UtmBuilderTool } from "./utm-builder-tool";
import { utmBuilderFaqItems } from "@/lib/utm-builder-faq";
import { toolSections } from "@/lib/tool-catalog";

export const dynamic = "force-static";

const seoTools =
  toolSections.find((s) => s.id === "seo-tools")?.tools ?? [];
const relatedTools = seoTools.filter((t) => t.href !== "/seo/utm-builder");

export const metadata: Metadata = {
  alternates: {
    canonical: "/seo/utm-builder",
  },
};

export default function UtmBuilderPage() {
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
            <span className="text-foreground">UTM link builder</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            UTM link builder for campaign tracking &amp; analytics-ready URLs
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This free{" "}
            <strong className="font-medium text-foreground">
              UTM parameter generator
            </strong>{" "}
            helps marketers and developers attach{" "}
            <strong className="font-medium text-foreground">
              Google Analytics–style campaign tags
            </strong>{" "}
            (
            <span className="font-mono text-sm">utm_source</span>,{" "}
            <span className="font-mono text-sm">utm_medium</span>,{" "}
            <span className="font-mono text-sm">utm_campaign</span>, plus optional{" "}
            <span className="font-mono text-sm">utm_term</span> and{" "}
            <span className="font-mono text-sm">utm_content</span>
            ) to any landing page. You get a single{" "}
            <strong className="font-medium text-foreground">
              percent-encoded tracking URL
            </strong>{" "}
            ready for{" "}
            <strong className="font-medium text-foreground">
              email broadcasts, paid search, display, and social posts
            </strong>
            , with{" "}
            <strong className="font-medium text-foreground">
              import from existing tagged links
            </strong>{" "}
            so you can duplicate or tweak campaigns without breaking query strings.
            Everything runs in the browser—ideal when you need a fast{" "}
            <strong className="font-medium text-foreground">
              campaign URL builder
            </strong>{" "}
            alongside technical SEO checks on the same site.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <UtmBuilderTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            How to use this UTM link builder
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Start with the page people should land on: product detail, signup flow, or
            article. Enter <strong className="font-medium text-foreground">UTM source</strong>{" "}
            to identify the partner or system sending traffic (for example{" "}
            <span className="font-mono text-sm">google</span>,{" "}
            <span className="font-mono text-sm">newsletter_apr</span>, or a referrer
            hostname). Set <strong className="font-medium text-foreground">UTM medium</strong>{" "}
            to the channel class—
            <span className="font-mono text-sm">cpc</span>,{" "}
            <span className="font-mono text-sm">email</span>,{" "}
            <span className="font-mono text-sm">social</span>,{" "}
            <span className="font-mono text-sm">banner</span>—so{" "}
            <strong className="font-medium text-foreground">GA4</strong> and other tools
            can group sessions. Use{" "}
            <strong className="font-medium text-foreground">UTM campaign</strong> for a
            stable slug tied to the initiative (
            <span className="font-mono text-sm">spring_launch</span>, not full sentences).
            Optional <strong className="font-medium text-foreground">UTM term</strong> often
            mirrors paid-search keywords;{" "}
            <strong className="font-medium text-foreground">UTM content</strong> separates
            two ads or buttons that share the same campaign. The preview updates as you
            type; use the copy control to grab the final URL. If you already have a tagged
            link from a spreadsheet, paste it (or upload a one-line{" "}
            <span className="font-mono text-sm">.txt</span>) and choose{" "}
            <strong className="font-medium text-foreground">Import</strong> to move values
            into the form. For encoding edge cases outside UTMs, the{" "}
            <Link
              href="/dev/url-encoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              URL encoder
            </Link>{" "}
            helps validate percent-encoding for arbitrary strings.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            UTM naming conventions: readable reports in Google Analytics 4
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Consistency beats cleverness: pick lowercase, underscore-separated tokens your
            whole team can reuse. Align{" "}
            <strong className="font-medium text-foreground">utm_medium</strong> values with
            GA4&apos;s default channel groupings where possible (paid search →{" "}
            <span className="font-mono text-sm">cpc</span>, organic social →{" "}
            <span className="font-mono text-sm">social</span>) so acquisition reports stay
            interpretable. Document a short internal glossary—what counts as{" "}
            <span className="font-mono text-sm">email</span> versus{" "}
            <span className="font-mono text-sm">newsletter</span>—and stick to it. When you
            need structured data on the destination page for rich results, pair tagged
            traffic with the{" "}
            <Link
              href="/seo/schema-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              schema markup generator
            </Link>{" "}
            so landing pages expose clean JSON-LD alongside measurable campaigns.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            UTM parameters and SEO: avoiding duplicate URLs and redirect noise
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Tracking parameters append to the canonical content URL; they should not change
            the HTML body. If marketing links hop through multiple redirects, attribution
            and crawl budget can suffer—verify chains with the{" "}
            <Link
              href="/seo/redirect-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect type checker
            </Link>{" "}
            or the broader{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>
            . For social previews of the same landing pages, align Open Graph metadata using
            the{" "}
            <Link
              href="/seo/og-tag-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph tag generator
            </Link>{" "}
            or live{" "}
            <Link
              href="/website/open-graph-preview"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph preview
            </Link>{" "}
            so shared UTM links still unfurl with the right title and image. Site-wide
            crawling hygiene complements campaign work: maintain{" "}
            <Link
              href="/seo/robots-txt-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              robots.txt
            </Link>{" "}
            rules and an{" "}
            <Link
              href="/seo/sitemap-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              XML sitemap
            </Link>{" "}
            for the URLs you want indexed without parameter explosion on faceted paths.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            When to use utm_term and utm_content
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">utm_term</strong> is optional in
            many channels but valuable when keyword-level reporting matters—often auto-tagged
            in Google Ads when you enable URL templates.{" "}
            <strong className="font-medium text-foreground">utm_content</strong> shines for
            A/B tests: two creatives pointing at the same base URL can differ only in
            content, letting you compare CTR in analytics without new landing pages. Skip
            both when unused; our builder omits empty fields so links stay shorter and
            cleaner in SMS or QR codes.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related SEO &amp; marketing tools on this site
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browse the full{" "}
            <Link
              href="/#seo-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SEO tools
            </Link>{" "}
            section for generators and checkers, or open a focused utility below.
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
            {utmBuilderFaqItems.map((item) => (
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
