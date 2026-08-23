import type { Metadata } from "next";
import Link from "next/link";
import { ReadabilityCheckerTool } from "./readability-checker-tool";
import { readabilityFaqItems } from "@/lib/readability-faq";
import { toolSections } from "@/lib/tool-catalog";

const seoTools =
  toolSections.find((s) => s.id === "seo-tools")?.tools ?? [];
const relatedSeoTools = seoTools.filter(
  (t) => t.href !== "/seo/readability-checker",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/seo/readability-checker",
  },
};

export default function ReadabilityCheckerPage() {
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
            <span className="text-foreground">Readability score checker</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Readability score checker — Flesch Reading Ease and grade level
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              readability checker
            </strong>{" "}
            to measure{" "}
            <strong className="font-medium text-foreground">
              Flesch Reading Ease
            </strong>{" "}
            (0–100, higher is easier) and{" "}
            <strong className="font-medium text-foreground">
              Flesch–Kincaid grade level
            </strong>{" "}
            for English-style drafts. You also get estimated syllables, sentence
            counts, and short suggestions for clearer{" "}
            <strong className="font-medium text-foreground">
              SEO content
            </strong>
            , help-center articles, and landing pages. Everything runs{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            —paste copy, upload a text file, then{" "}
            <strong className="font-medium text-foreground">
              copy a plain-text summary
            </strong>{" "}
            for your editorial ticket. Pair numbers with length checks using
            our{" "}
            <Link
              href="/text/word-counter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              word counter
            </Link>{" "}
            and live HTML review with the{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>
            . Browse more utilities under{" "}
            <Link
              href="/#seo-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SEO Tools
            </Link>{" "}
            on the home page.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <ReadabilityCheckerTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why readability matters for SEO and UX
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Search engines surface content that satisfies intent; readability is
            not a direct ranking knob, but it shapes{" "}
            <strong className="font-medium text-foreground">
              dwell time, scroll depth, and conversions
            </strong>
            , especially on mobile. A{" "}
            <strong className="font-medium text-foreground">
              Flesch Reading Ease
            </strong>{" "}
            score helps teams agree on complexity before publish: marketing may
            want a lower grade for mass-market pages, while a technical white
            paper may accept a higher grade. Use this page as a repeatable QA
            step alongside keyword mapping—not as a substitute for subject
            expertise. When you tune titles and snippets, validate character
            limits with the{" "}
            <Link
              href="/website/open-graph-preview"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph preview
            </Link>{" "}
            so social cards match your refined copy.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this readability score checker
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste at least one paragraph—ideally{" "}
                <strong className="font-medium text-foreground">
                  100+ words
                </strong>{" "}
                so averages stabilize—or click{" "}
                <strong className="font-medium text-foreground">
                  Upload file
                </strong>{" "}
                for{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  .txt
                </code>{" "}
                / Markdown. Use{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                to preview typical metrics.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read{" "}
                <strong className="font-medium text-foreground">
                  Flesch Reading Ease
                </strong>{" "}
                and{" "}
                <strong className="font-medium text-foreground">
                  Flesch–Kincaid grade level
                </strong>{" "}
                against your brief (for example, “grade 8–10 for consumer
                blog”). Compare before/after edits to see whether shorter
                sentences moved the needle.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Apply the bullet{" "}
                <strong className="font-medium text-foreground">
                  suggestions
                </strong>
                , then click{" "}
                <strong className="font-medium text-foreground">
                  Copy summary
                </strong>{" "}
                to share metrics in Slack, Notion, or a CMS comment thread.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                For repetition and keyword balance, follow up with the{" "}
                <Link
                  href="/text/word-frequency"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  word frequency analyzer
                </Link>{" "}
                and, when converting from Markdown, the{" "}
                <Link
                  href="/dev/markdown-to-html"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  Markdown to HTML
                </Link>{" "}
                converter before you paste into production HTML.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and workflows this page supports
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Teams search for a{" "}
            <strong className="font-medium text-foreground">
              Flesch Reading Ease calculator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              Flesch–Kincaid grade checker
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              content readability score
            </strong>
            , or a quick{" "}
            <strong className="font-medium text-foreground">
              blog readability test
            </strong>{" "}
            before hitting publish. Content designers use the same pass after
            localization or legal review when sentences grow longer. Developers
            drafting in-repo Markdown can paste sections here, then run the{" "}
            <Link
              href="/dev/html-to-markdown"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML to Markdown
            </Link>{" "}
            tool when cleaning CMS exports.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Limitations and honest expectations
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Syllables are{" "}
            <strong className="font-medium text-foreground">estimated</strong>{" "}
            with English heuristics; brand names, code snippets, and mixed
            languages can skew averages. Sentence boundaries follow simple
            punctuation rules, so abbreviations may add noise. The formulas
            were designed for prose—not tables of numbers or JSON. For
            structured data QA, use our{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter
            </Link>{" "}
            or schema tools, then return here for narrative blocks only.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            More SEO and content tools in this catalog
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            The home page lists the full{" "}
            <Link
              href="/#seo-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SEO Tools
            </Link>{" "}
            collection (meta length, keyword density, robots.txt, sitemaps,
            schema, hreflang, redirects, UTMs, and more). Highlights from that
            section:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {relatedSeoTools.map((tool) => (
              <li key={tool.href}>
                <span className="font-medium text-foreground">{tool.name}</span>
                {" — "}
                <span className="text-zinc-600 dark:text-zinc-400">
                  {tool.description}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            As new pages ship, each tool will link from the catalog; for now use
            the list above as a roadmap and rely on the{" "}
            <Link
              href="/text/word-counter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              word counter
            </Link>{" "}
            and{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            for complementary checks.
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
            {readabilityFaqItems.map((item) => (
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
