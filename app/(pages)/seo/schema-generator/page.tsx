import type { Metadata } from "next";
import Link from "next/link";
import { SchemaGeneratorTool } from "./schema-generator-tool";
import { schemaGeneratorFaqItems } from "@/lib/schema-generator-faq";
import { toolSections } from "@/lib/tool-catalog";

const seoTools = toolSections.find((s) => s.id === "seo-tools")?.tools ?? [];
const relatedTools = seoTools.filter((t) => t.href !== "/seo/schema-generator");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/seo/schema-generator",
  },
};

export default function SchemaGeneratorPage() {
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
            <span className="text-foreground">Schema markup generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Schema markup generator — JSON-LD for articles, FAQs, products, and
            reviews
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This free{" "}
            <strong className="font-medium text-foreground">
              schema markup generator
            </strong>{" "}
            helps you produce valid{" "}
            <strong className="font-medium text-foreground">JSON-LD</strong> using
            the{" "}
            <strong className="font-medium text-foreground">Schema.org</strong>{" "}
            vocabulary—ideal for{" "}
            <strong className="font-medium text-foreground">
              technical SEO
            </strong>
            , content publishing, and ecommerce. Build{" "}
            <strong className="font-medium text-foreground">Article</strong> and
            editorial markup,{" "}
            <strong className="font-medium text-foreground">FAQPage</strong> for
            question hubs,{" "}
            <strong className="font-medium text-foreground">Product</strong> with
            offers, <strong className="font-medium text-foreground">Review</strong>{" "}
            with ratings,{" "}
            <strong className="font-medium text-foreground">Organization</strong>{" "}
            for brand panels, and{" "}
            <strong className="font-medium text-foreground">BreadcrumbList</strong>{" "}
            for navigation trails. Everything runs locally:{" "}
            <strong className="font-medium text-foreground">copy</strong>,{" "}
            <strong className="font-medium text-foreground">download</strong>, or{" "}
            <strong className="font-medium text-foreground">upload</strong> an
            existing file to refine. Pair output with the{" "}
            <Link
              href="/seo/og-tag-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph tag generator
            </Link>{" "}
            for social metadata, the{" "}
            <Link
              href="/seo/meta-length-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta title and description checker
            </Link>{" "}
            for SERP snippets, and the{" "}
            <Link
              href="/seo/sitemap-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              XML sitemap generator
            </Link>{" "}
            so discovery aligns with your structured data.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <SchemaGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why structured data matters for SEO
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Search engines use{" "}
            <strong className="font-medium text-foreground">
              structured data
            </strong>{" "}
            to understand entities—who wrote a piece, what a product costs, which
            crumbs belong in a trail, and whether a page is a FAQ hub.{" "}
            <strong className="font-medium text-foreground">JSON-LD</strong> keeps
            that signal separate from HTML, which simplifies CMS workflows and
            theme updates. While rich results are never guaranteed, clear{" "}
            <strong className="font-medium text-foreground">schema markup</strong>{" "}
            improves eligibility for enhancements shown in Search and helps
            knowledge panels and assistants reason about your brand when combined
            with consistent{" "}
            <strong className="font-medium text-foreground">Organization</strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">sameAs</strong> links.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Teams often search for{" "}
            <strong className="font-medium text-foreground">
              FAQ schema generator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              product schema JSON-LD
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              article schema markup
            </strong>{" "}
            when migrating platforms or launching content programs. This tool
            focuses on copy-ready blocks you can paste beside templates generated
            by the{" "}
            <Link
              href="/seo/robots-txt-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              robots.txt generator
            </Link>{" "}
            and crawl rules, so technical SEO stays coherent end to end.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this JSON-LD generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Choose the{" "}
                <strong className="font-medium text-foreground">schema type</strong>{" "}
                that matches the primary entity on the URL. Do not stack unrelated
                types purely for visibility; align with what users see on the page.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Enter <strong className="font-medium text-foreground">HTTPS URLs</strong>{" "}
                for canonical pages, images, and offers. Use ISO-8601 timestamps for
                dates when possible so parsers are unambiguous.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                For <strong className="font-medium text-foreground">FAQPage</strong>
                , write questions and answers that appear verbatim in the UI—FAQ
                markup must reflect visible content, not hidden keyword blocks.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click <strong className="font-medium text-foreground">Copy</strong>{" "}
                or <strong className="font-medium text-foreground">Download</strong>
                . Enable{" "}
                <strong className="font-medium text-foreground">
                  Wrap in script tag
                </strong>{" "}
                if your CMS expects a full{" "}
                <code className="font-mono text-sm">application/ld+json</code>{" "}
                snippet. Use{" "}
                <strong className="font-medium text-foreground">Upload</strong> to
                load saved JSON or an exported script block; we try to detect{" "}
                <code className="font-mono text-sm">@type</code> and switch tabs.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Validate with Google Rich Results Test after deploy, then monitor{" "}
                <strong className="font-medium text-foreground">
                  Search Console
                </strong>{" "}
                enhancements. For on-page copy quality, run the{" "}
                <Link
                  href="/seo/readability-checker"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  readability checker
                </Link>{" "}
                and{" "}
                <Link
                  href="/seo/keyword-density"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  keyword density checker
                </Link>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and topics covered by each preset
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">Article</strong>{" "}
            covers headline, description, image, author, publisher, and modified
            dates—aligned with editorial SEO for blogs and guides.{" "}
            <strong className="font-medium text-foreground">FAQPage</strong> maps to
            help centers and support articles.{" "}
            <strong className="font-medium text-foreground">Product</strong>{" "}
            combines SKU, brand, and{" "}
            <strong className="font-medium text-foreground">Offer</strong> pricing
            for storefronts. <strong className="font-medium text-foreground">Review</strong>{" "}
            emits <strong className="font-medium text-foreground">Rating</strong>{" "}
            stars for testimonials.{" "}
            <strong className="font-medium text-foreground">Organization</strong>{" "}
            supports logo and social profiles via{" "}
            <strong className="font-medium text-foreground">sameAs</strong>.{" "}
            <strong className="font-medium text-foreground">BreadcrumbList</strong>{" "}
            expresses hierarchy for category and detail URLs—often paired with
            visible breadcrumbs in the UI.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Internal tools that complement schema markup
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Structured data works best when titles, descriptions, and URLs are
            consistent. Before launch, verify snippet lengths with the{" "}
            <Link
              href="/seo/meta-length-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta title and description checker
            </Link>
            , generate campaign tracking with the{" "}
            <Link
              href="/seo/utm-builder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              UTM link builder
            </Link>
            , and confirm redirects with the{" "}
            <Link
              href="/seo/redirect-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect type checker
            </Link>
            . Multilingual sites can pair JSON-LD with the{" "}
            <Link
              href="/seo/hreflang-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              hreflang tag generator
            </Link>{" "}
            for language clusters.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related SEO tools in this catalog
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browse the full{" "}
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
            {schemaGeneratorFaqItems.map((item) => (
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
