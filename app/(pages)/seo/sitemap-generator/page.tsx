import type { Metadata } from "next";
import Link from "next/link";
import { SitemapGeneratorTool } from "./sitemap-generator-tool";
import { sitemapGeneratorFaqItems } from "@/lib/sitemap-generator-faq";
import { toolSections } from "@/lib/tool-catalog";

const seoTools = toolSections.find((s) => s.id === "seo-tools")?.tools ?? [];
const relatedTools = seoTools.filter(
  (t) => t.href !== "/seo/sitemap-generator",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/seo/sitemap-generator",
  },
};

export default function SitemapGeneratorPage() {
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
            <span className="text-foreground">XML sitemap generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            XML sitemap generator — turn a URL list into sitemaps.org XML for
            Search Console
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This free{" "}
            <strong className="font-medium text-foreground">
              XML sitemap generator
            </strong>{" "}
            builds a standards-compliant{" "}
            <strong className="font-medium text-foreground">
              sitemaps.org urlset
            </strong>{" "}
            from plain text: paste{" "}
            <strong className="font-medium text-foreground">
              absolute https URLs
            </strong>{" "}
            or, with a site origin,{" "}
            <strong className="font-medium text-foreground">
              root-relative paths
            </strong>{" "}
            like <code className="font-mono text-sm">/pricing</code>. You can
            optionally set the same{" "}
            <strong className="font-medium text-foreground">lastmod</strong>{" "}
            date,{" "}
            <strong className="font-medium text-foreground">changefreq</strong>,
            and{" "}
            <strong className="font-medium text-foreground">priority</strong>{" "}
            for every entry, then use the{" "}
            <strong className="font-medium text-foreground">copy icon</strong>{" "}
            to grab ready-to-host{" "}
            <strong className="font-medium text-foreground">sitemap XML</strong>.
            The{" "}
            <strong className="font-medium text-foreground">upload icon</strong>{" "}
            loads a local <code className="font-mono text-sm">.txt</code> URL
            list—nothing is sent to a server. Pair the output with our{" "}
            <Link
              href="/seo/robots-txt-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              robots.txt generator
            </Link>{" "}
            for a <code className="font-mono text-sm">Sitemap:</code> line, and
            browse{" "}
            <Link
              href="/#seo-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SEO tools
            </Link>{" "}
            for schema, redirects, and metadata checks.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <SitemapGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            What is an XML sitemap and why do SEO teams use it?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            An{" "}
            <strong className="font-medium text-foreground">XML sitemap</strong>{" "}
            is a machine-readable inventory of important pages on your site.
            Search systems like{" "}
            <strong className="font-medium text-foreground">
              Google Search Console
            </strong>{" "}
            use it to discover URLs, especially on large sites, new domains, or
            deep sections with few internal links. The file follows the public{" "}
            <strong className="font-medium text-foreground">
              sitemaps.org protocol
            </strong>
            : a root <code className="font-mono text-sm">urlset</code> with
            child <code className="font-mono text-sm">url</code> elements, each
            containing a required{" "}
            <strong className="font-medium text-foreground">loc</strong> (canonical
            URL) and optional{" "}
            <strong className="font-medium text-foreground">lastmod</strong>,{" "}
            <strong className="font-medium text-foreground">changefreq</strong>,
            and{" "}
            <strong className="font-medium text-foreground">priority</strong>{" "}
            hints. Submitting a sitemap does not guarantee indexing, but it
            aligns your{" "}
            <strong className="font-medium text-foreground">
              technical SEO
            </strong>{" "}
            signals with what you want crawlers to prioritize.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this XML sitemap generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Decide whether you will paste{" "}
                <strong className="font-medium text-foreground">
                  full URLs only
                </strong>{" "}
                or also{" "}
                <strong className="font-medium text-foreground">
                  path-only lines
                </strong>
                . If you use paths, set the{" "}
                <strong className="font-medium text-foreground">
                  site origin
                </strong>{" "}
                field to your canonical scheme and host (for example{" "}
                <code className="font-mono text-sm">https://www.example.com</code>
                ).
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Enter URLs in the text area—one per line—or use{" "}
                <strong className="font-medium text-foreground">
                  Upload .txt
                </strong>{" "}
                to load a file from your computer. Invalid lines are listed so
                you can fix typos or protocol mistakes.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Toggle{" "}
                <strong className="font-medium text-foreground">lastmod</strong>{" "}
                when you want a single date on every URL (useful after a bulk
                update). Choose{" "}
                <strong className="font-medium text-foreground">
                  changefreq
                </strong>{" "}
                and{" "}
                <strong className="font-medium text-foreground">priority</strong>{" "}
                only if you have a consistent policy; omitting them is valid and
                common.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">Copy XML</strong>{" "}
                and save the result as{" "}
                <code className="font-mono text-sm">sitemap.xml</code> (or another
                name) on your HTTPS host. In{" "}
                <strong className="font-medium text-foreground">
                  Google Search Console
                </strong>
                , open Sitemaps and submit the public URL of the file. Add a{" "}
                <Link
                  href="/seo/robots-txt-generator"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  robots.txt
                </Link>{" "}
                <code className="font-mono text-sm">Sitemap:</code> directive if
                your workflow relies on discovery.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and topics this sitemap tool supports
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Content and growth teams often search for an{" "}
            <strong className="font-medium text-foreground">
              XML sitemap generator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              sitemap.xml generator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              Google sitemap format
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              Search Console sitemap submit
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              urlset lastmod changefreq
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              SEO sitemap for new site
            </strong>
            . This page explains the fields, limits, and how to combine a sitemap
            with <strong className="font-medium text-foreground">robots.txt</strong>{" "}
            and on-page{" "}
            <strong className="font-medium text-foreground">
              structured data
            </strong>
            . For rich results markup, use the{" "}
            <Link
              href="/seo/schema-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              schema markup generator
            </Link>
            ; for social previews, see the{" "}
            <Link
              href="/seo/og-tag-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph tag generator
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Limits, best practices, and migration audits
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Each sitemap may contain up to{" "}
            <strong className="font-medium text-foreground">
              50,000 URLs
            </strong>{" "}
            and must stay under roughly{" "}
            <strong className="font-medium text-foreground">50 MB</strong>{" "}
            uncompressed; bigger sites use a sitemap index and multiple
            segment files. Prefer{" "}
            <strong className="font-medium text-foreground">HTTPS</strong>{" "}
            locations, avoid session parameters in{" "}
            <code className="font-mono text-sm">loc</code>, and keep{" "}
            <strong className="font-medium text-foreground">lastmod</strong>{" "}
            truthful when you use it. When you change URL structures, combine this
            workflow with the{" "}
            <Link
              href="/seo/redirect-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect type checker
            </Link>{" "}
            so old URLs resolve cleanly. For snippet tuning before launch, the{" "}
            <Link
              href="/seo/meta-length-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta title and description checker
            </Link>{" "}
            helps keep titles and descriptions within common display limits.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related SEO and site utilities
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Explore the full{" "}
            <Link
              href="/#seo-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SEO tools
            </Link>{" "}
            section on the homepage, or open a focused utility below.
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
            {sitemapGeneratorFaqItems.map((item) => (
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
