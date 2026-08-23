import type { Metadata } from "next";
import Link from "next/link";
import { SlugGeneratorTool } from "./slug-generator-tool";
import { slugGeneratorFaqItems } from "@/lib/slug-generator-faq";
import { toolSections } from "@/lib/tool-catalog";

const textTools =
  toolSections.find((s) => s.id === "text-string-tools")?.tools ?? [];
const relatedTools = textTools.filter((t) => t.href !== "/text/slug-generator");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/text/slug-generator",
  },
};

export default function SlugGeneratorPage() {
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
            <span className="text-foreground">Slug generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            URL slug generator online — SEO-friendly, lowercase, hyphenated
            paths
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              URL slug generator
            </strong>{" "}
            to turn headlines, product names, and documentation titles into{" "}
            <strong className="font-medium text-foreground">
              lowercase hyphenated slugs
            </strong>{" "}
            suitable for blogs, ecommerce permalinks, static site routes, and REST
            path segments. It performs Unicode normalization, strips combining
            marks for common accented letters, keeps letters and numbers, and
            collapses punctuation into single hyphens. Choose{" "}
            <strong className="font-medium text-foreground">
              one slug for a wrapped title
            </strong>{" "}
            or{" "}
            <strong className="font-medium text-foreground">
              batch one slug per line
            </strong>{" "}
            for imports. Paste text or upload a small plain-text file; processing
            stays{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            . After you lock a slug, validate surrounding copy length with our{" "}
            <Link
              href="/text/word-counter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              word counter
            </Link>{" "}
            and browse sibling utilities under{" "}
            <Link
              href="/#text-string-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Text and String Tools
            </Link>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <SlugGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why URL slugs still matter for SEO and product UX
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Search engines and humans both scan URLs in SERPs, analytics, and
            shared links. A predictable{" "}
            <strong className="font-medium text-foreground">
              permalink slug
            </strong>{" "}
            reinforces the topic, improves memorability, and reduces duplicate
            confusion when compared with opaque IDs alone. Slugs are not a
            ranking shortcut—content quality, intent match, site structure, and
            technical health matter more—but they are a low-cost signal of clarity
            and professionalism. Teams often pair slug work with the{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            when auditing titles, descriptions, and canonical tags together.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this slug generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste a title, breadcrumb label, or multiline list into the input.
                Click{" "}
                <strong className="font-medium text-foreground">
                  Upload file
                </strong>{" "}
                to load{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  .txt
                </code>{" "}
                or Markdown. Use{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                to preview punctuation and accent handling.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Select{" "}
                <strong className="font-medium text-foreground">
                  Single slug
                </strong>{" "}
                when several lines belong to one headline (the tool joins
                non-empty lines with spaces). Choose{" "}
                <strong className="font-medium text-foreground">
                  One slug per line
                </strong>{" "}
                when each row should become its own path segment list for CSV or
                CMS jobs.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Review the monospace{" "}
                <strong className="font-medium text-foreground">
                  slug output
                </strong>{" "}
                panel, then click{" "}
                <strong className="font-medium text-foreground">
                  Copy slugs
                </strong>{" "}
                to paste into your router config, redirect sheet, or permalink
                field. Use{" "}
                <strong className="font-medium text-foreground">Clear</strong>{" "}
                between batches.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                When you also need identifier-style{" "}
                <strong className="font-medium text-foreground">
                  kebab-case
                </strong>{" "}
                for variables or config keys, run the same source through the{" "}
                <Link
                  href="/text/case-converter"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  text case converter
                </Link>
                . For bulk text cleanup before slugging, try the{" "}
                <Link
                  href="/text/whitespace-remover"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  whitespace remover
                </Link>{" "}
                or{" "}
                <Link
                  href="/text/find-replace"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  find and replace tool
                </Link>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and workflows this slugify tool supports
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Content editors search for a{" "}
            <strong className="font-medium text-foreground">
              blog slug generator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              title to URL slug
            </strong>
            , or a quick{" "}
            <strong className="font-medium text-foreground">
              hyphenated permalink maker
            </strong>{" "}
            without installing a CLI. Developers use the same flow for{" "}
            <strong className="font-medium text-foreground">
              route segment previews
            </strong>{" "}
            and seed data. Marketing teams align slugs with campaign landing copy,
            then confirm share cards using the{" "}
            <Link
              href="/website/open-graph-preview"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph preview
            </Link>{" "}
            when social snippets must match the visible headline.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Rules, edge cases, and CMS checks
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            This utility removes combining marks after NFD normalization, which
            covers many Western accents but is not a full transliteration table
            for every script. Emoji and pure punctuation lines may yield empty
            slugs, which are skipped in per-line mode. Always enforce uniqueness,
            maximum length, and reserved-word policies in your CMS or framework;
            Next.js, WordPress, Ghost, and static generators each add their own
            constraints. If you maintain large redirect tables, pair slug batches
            with the{" "}
            <Link
              href="/text/duplicate-line-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              duplicate line remover
            </Link>{" "}
            to catch repeated targets after merges.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Limitations compared with server-side slug pipelines
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Production systems often append collision-safe suffixes, consult a
            database for uniqueness, or map locale-specific transliterations.
            This page focuses on fast, private preview generation in the tab—not
            on persistence or collision resolution. Treat output as a draft,
            commit final slugs through your deployment workflow, and keep audit
            logs for URL changes. When comparing two proposed titles side by side,
            the{" "}
            <Link
              href="/text/diff-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              text diff checker
            </Link>{" "}
            helps highlight copy edits that should trigger slug updates.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related text and string tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Explore the full catalog under{" "}
            <Link
              href="/#text-string-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Text and String Tools
            </Link>
            . Highlights beyond this page:
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
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            For placeholder paragraphs while mocking article layouts, generate
            draft copy with the{" "}
            <Link
              href="/dev/lorem-ipsum"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              lorem ipsum generator
            </Link>{" "}
            and measure length with the word counter before finalizing slugs.
          </p>
        </article>

        <section className="mt-16 max-w-3xl" aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            Frequently asked questions
          </h2>
          <dl className="mt-6 space-y-4">
            {slugGeneratorFaqItems.map((item) => (
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
