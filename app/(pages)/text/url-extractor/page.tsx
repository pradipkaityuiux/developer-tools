import type { Metadata } from "next";
import Link from "next/link";
import { UrlExtractorTool } from "./url-extractor-tool";
import { urlExtractorFaqItems } from "@/lib/url-extractor-faq";
import { toolSections } from "@/lib/tool-catalog";

const textTools =
  toolSections.find((s) => s.id === "text-string-tools")?.tools ?? [];
const relatedTools = textTools.filter((t) => t.href !== "/text/url-extractor");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/text/url-extractor",
  },
};

export default function UrlExtractorPage() {
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
            <span className="text-foreground">URL extractor</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            URL extractor online — pull http(s) links from text, logs, and HTML
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online URL extractor
            </strong>{" "}
            to build a deduplicated{" "}
            <strong className="font-medium text-foreground">
              link inventory
            </strong>{" "}
            from messy sources: support transcripts, marketing copy, crawler
            logs, CMS exports, and partial HTML. Toggle{" "}
            <strong className="font-medium text-foreground">
              href attribute scanning
            </strong>{" "}
            when you need anchor targets, and{" "}
            <strong className="font-medium text-foreground">
              bare www matching
            </strong>{" "}
            when authors omit schemes. Export as{" "}
            <strong className="font-medium text-foreground">
              one URL per line
            </strong>{" "}
            or{" "}
            <strong className="font-medium text-foreground">
              comma-separated values
            </strong>{" "}
            for spreadsheets and ticket trackers. Everything runs{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            , which keeps proprietary briefs and customer emails off a server.
            After you collect candidates, validate live behavior with the{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>{" "}
            and compare title or description changes using the{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>
            . Browse sibling utilities in the{" "}
            <Link
              href="/#text-string-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Text and String Tools
            </Link>{" "}
            section on the home page.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <UrlExtractorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why a dedicated URL extractor still matters for SEO and migrations
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Search audits, content migrations, and backlink reconciliations all
            start with reliable lists of destinations. Spreadsheets and docs
            bury links inside prose, while HTML exports interleave anchors with
            layout tables and tracking parameters. A focused{" "}
            <strong className="font-medium text-foreground">
              link extractor from text
            </strong>{" "}
            gives you a clipboard-first workflow: paste a blob, copy a clean
            list, and move on. It complements—rather than replaces—crawlers
            that need robots rules, JavaScript rendering, and sitemap discovery.
            When you normalize paths or strip UTM variants, follow up with the{" "}
            <Link
              href="/text/find-replace"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              find and replace tool
            </Link>{" "}
            and{" "}
            <Link
              href="/text/duplicate-line-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              duplicate line remover
            </Link>{" "}
            so spreadsheets stay canonical.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this URL extractor (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste any UTF-8 text that might contain links—email threads,
                JSON, server logs, or saved HTML. Click{" "}
                <strong className="font-medium text-foreground">
                  Upload file
                </strong>{" "}
                to read{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  .txt
                </code>
                ,{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  .html
                </code>
                , Markdown, or log formats locally. Use{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                for a quick tour.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Enable{" "}
                <strong className="font-medium text-foreground">
                  Scan href attributes
                </strong>{" "}
                when your paste includes anchor markup; enable{" "}
                <strong className="font-medium text-foreground">
                  Include bare www hosts
                </strong>{" "}
                when marketing copy references domains without{" "}
                <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
                  https://
                </code>
                .
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Review the{" "}
                <strong className="font-medium text-foreground">
                  unique URL count
                </strong>{" "}
                and choose newline or comma output. Click{" "}
                <strong className="font-medium text-foreground">
                  Copy URLs
                </strong>{" "}
                to move the list into Sheets, Notion, Jira, or a crawler seed
                file.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                For large editorial cleanups, pair this extractor with the{" "}
                <Link
                  href="/text/word-counter"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  word counter
                </Link>{" "}
                when you need line totals, the{" "}
                <Link
                  href="/text/case-converter"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  text case converter
                </Link>{" "}
                for consistent labels, and the{" "}
                <Link
                  href="/text/slug-generator"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  slug generator
                </Link>{" "}
                when URLs must become route segments.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and workflows this page supports
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Teams search for an{" "}
            <strong className="font-medium text-foreground">
              extract URLs from HTML
            </strong>{" "}
            utility when they inherit a legacy site, a{" "}
            <strong className="font-medium text-foreground">
              parse links from email
            </strong>{" "}
            helper when PR forwards a thread full of mixed schemes, and a{" "}
            <strong className="font-medium text-foreground">
              URL list generator
            </strong>{" "}
            before feeding outreach spreadsheets. Developers dumping API
            responses can isolate endpoints; SEO specialists can diff two
            inventories after a redesign using the{" "}
            <Link
              href="/text/diff-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              text diff checker
            </Link>{" "}
            on exported lists.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy, accuracy, and when to escalate to a crawler
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Because processing stays client-side, you can paste regulated or
            NDA-covered snippets without uploading them. Regex-style detection
            intentionally skips non-http schemes and relative paths unless they
            appear inside qualifying href values with http(s). For sitemap
            discovery at scale, JavaScript-heavy SPAs, or hrefs assembled at
            runtime, use a crawler or headless browser in your infrastructure—then
            return here to normalize subsets you copy from reports.
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
            When you need to compare live page metadata after extracting URLs,
            keep the{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            and{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>{" "}
            in the same audit workspace.
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
            {urlExtractorFaqItems.map((item) => (
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
