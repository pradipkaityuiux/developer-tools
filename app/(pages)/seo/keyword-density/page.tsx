import type { Metadata } from "next";
import Link from "next/link";
import { KeywordDensityTool } from "./keyword-density-tool";
import { keywordDensityFaqItems } from "@/lib/keyword-density-faq";
import { toolSections } from "@/lib/tool-catalog";

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/seo/keyword-density",
  },
};

const seoTools =
  toolSections.find((s) => s.id === "seo-tools")?.tools ?? [];
const relatedTools = seoTools.filter(
  (t) => t.href !== "/seo/keyword-density",
);

export default function KeywordDensityPage() {
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
            <span className="text-foreground">Keyword density checker</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Keyword density checker — phrase frequency, on-page SEO prominence,
            TSV export
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              keyword density checker
            </strong>{" "}
            to measure how often{" "}
            <strong className="font-medium text-foreground">
              target keyword phrases
            </strong>{" "}
            appear in your draft copy, expressed as a{" "}
            <strong className="font-medium text-foreground">
              keyword density percentage
            </strong>{" "}
            relative to total word count. You also get a practical{" "}
            <strong className="font-medium text-foreground">
              keyword prominence
            </strong>{" "}
            signal: the word position of the first match and whether that match
            begins inside the{" "}
            <strong className="font-medium text-foreground">
              first 100 words
            </strong>{" "}
            of the pasted text—useful when you are auditing intros and
            above-the-fold body copy before publish. Paste or{" "}
            <strong className="font-medium text-foreground">upload</strong>{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              .txt
            </code>{" "}
            / Markdown, add multiple comma-separated phrases, then{" "}
            <strong className="font-medium text-foreground">
              copy a TSV report
            </strong>{" "}
            for spreadsheets. Everything runs{" "}
            <strong className="font-medium text-foreground">
              locally in your browser
            </strong>
            , so confidential drafts stay on your device. Pair with our{" "}
            <Link
              href="/text/word-frequency"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              word frequency analyzer
            </Link>{" "}
            for whole-vocabulary repetition, and the{" "}
            <Link
              href="/seo/meta-length-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta title and description checker
            </Link>{" "}
            when you tune title tags and snippets. Browse the full{" "}
            <Link
              href="/#seo-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SEO tools
            </Link>{" "}
            list on the home page.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <KeywordDensityTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why keyword density and prominence still matter for editorial QA
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Modern ranking systems emphasize intent, links, and content quality,
            but content teams still run{" "}
            <strong className="font-medium text-foreground">
              keyword density analysis
            </strong>{" "}
            before go-live: it catches accidental{" "}
            <strong className="font-medium text-foreground">
              keyword stuffing
            </strong>
            , thin repetition, and intros that bury the main topic. A balanced
            page usually uses a focus phrase naturally in the headline, opening
            paragraphs, and body—without forcing the same string into every
            sentence. This tool does not predict rankings; it helps you{" "}
            <strong className="font-medium text-foreground">
              read your own copy like a checklist
            </strong>
            : counts, density, and first-match placement. After you adjust
            wording, verify snippet lengths with the{" "}
            <Link
              href="/seo/meta-length-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta title and description checker
            </Link>{" "}
            and inspect live HTML fields with the{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this keyword density analyzer (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste your article or landing page body into the editor. For
                offline drafts, click{" "}
                <strong className="font-medium text-foreground">
                  Upload file
                </strong>{" "}
                to load plain text or Markdown. Use{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                to see how multi-word phrases are matched.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Enter a <strong className="font-medium text-foreground">
                  primary keyword phrase
                </strong>{" "}
                (one sequence of words you want to track). Add{" "}
                <strong className="font-medium text-foreground">
                  additional phrases
                </strong>{" "}
                as a comma-separated list—secondary terms, product names, or
                localized variants. Each distinct phrase gets its own row in the
                results table.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Toggle{" "}
                <strong className="font-medium text-foreground">
                  ignore case
                </strong>{" "}
                when you want “Run” and “run” to treat as the same token. The
                tool finds{" "}
                <strong className="font-medium text-foreground">
                  non-overlapping
                </strong>{" "}
                consecutive matches so long phrases do not double-count shared
                words.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read <strong className="font-medium text-foreground">
                  Density
                </strong>{" "}
                (occurrences × phrase length ÷ total words),{" "}
                <strong className="font-medium text-foreground">First</strong>{" "}
                (word index of the first match), and{" "}
                <strong className="font-medium text-foreground">≤100w</strong>{" "}
                (whether the first match starts inside the first 100 words).
                Click{" "}
                <strong className="font-medium text-foreground">
                  Copy report
                </strong>{" "}
                to export TSV columns for documentation or client decks.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                For vocabulary-wide repetition—not just one phrase—run the{" "}
                <Link
                  href="/text/word-frequency"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  word frequency analyzer
                </Link>
                , then use the{" "}
                <Link
                  href="/text/find-replace"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  find and replace tool
                </Link>{" "}
                for bulk rewrites. Confirm total length with the{" "}
                <Link
                  href="/text/word-counter"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  word counter
                </Link>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keyword density formulas and what we display
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Many SEO checklists use{" "}
            <strong className="font-medium text-foreground">
              (occurrences × words in phrase) ÷ total words × 100
            </strong>
            , which scales multi-word targets proportionally. We show that value
            as <strong className="font-medium text-foreground">Density</strong>
            . The export also includes{" "}
            <strong className="font-medium text-foreground">
              occurrence share
            </strong>{" "}
            (occurrences ÷ total words × 100) for comparison. Totals use
            whitespace tokenization with punctuation trimmed from token edges—the
            same practical approach as our{" "}
            <Link
              href="/text/word-frequency"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              word frequency
            </Link>{" "}
            tool—so numbers are stable for editorial review but are not a
            substitute for corpus linguistics or crawler data. For social
            previews, follow up with the{" "}
            <Link
              href="/website/open-graph-preview"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph preview
            </Link>{" "}
            and{" "}
            <Link
              href="/seo/og-tag-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph tag generator
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Internal links: structured data, hreflang, and technical SEO
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Keyword placement is only one layer of on-page work. When you expand
            to multi-language sites, build correct clusters with the{" "}
            <Link
              href="/seo/hreflang-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              hreflang tag generator
            </Link>
            . For rich results testing, draft JSON-LD with the{" "}
            <Link
              href="/seo/schema-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              schema markup generator
            </Link>
            . Control crawling with the{" "}
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
            , then validate redirects using the{" "}
            <Link
              href="/seo/redirect-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect type checker
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related SEO tools on Zero Snippet
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Explore utilities under{" "}
            <Link
              href="/#seo-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SEO tools
            </Link>
            :
          </p>
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
            {keywordDensityFaqItems.map((item) => (
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
