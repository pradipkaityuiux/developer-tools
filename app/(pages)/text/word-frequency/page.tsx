import type { Metadata } from "next";
import Link from "next/link";
import { WordFrequencyTool } from "./word-frequency-tool";
import { wordFrequencyFaqItems } from "@/lib/word-frequency-faq";
import { toolSections } from "@/lib/tool-catalog";

const textTools =
  toolSections.find((s) => s.id === "text-string-tools")?.tools ?? [];
const relatedTools = textTools.filter((t) => t.href !== "/text/word-frequency");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/text/word-frequency",
  },
};

export default function WordFrequencyPage() {
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
            <span className="text-foreground">Word frequency analyzer</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Word frequency analyzer online — ranked counts, repetition check,
            TSV export
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              word frequency analyzer
            </strong>{" "}
            to rank{" "}
            <strong className="font-medium text-foreground">
              how often each word appears
            </strong>{" "}
            in pasted or uploaded text. It helps editors catch{" "}
            <strong className="font-medium text-foreground">
              repetition and keyword stuffing patterns
            </strong>
            , compare vocabulary balance in landing pages, and export a{" "}
            <strong className="font-medium text-foreground">
              tab-separated frequency table
            </strong>{" "}
            for spreadsheets. Toggle{" "}
            <strong className="font-medium text-foreground">ignore case</strong>
            , set a{" "}
            <strong className="font-medium text-foreground">
              minimum token length
            </strong>
            , and optionally{" "}
            <strong className="font-medium text-foreground">
              hide common English stop words
            </strong>{" "}
            so content words surface first. Everything runs{" "}
            <strong className="font-medium text-foreground">
              locally in your browser
            </strong>
            —ideal when drafts are confidential. After you tune wording, verify
            length limits with our{" "}
            <Link
              href="/text/word-counter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              online word counter
            </Link>{" "}
            and live HTML fields with the{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>
            . Browse more utilities under{" "}
            <Link
              href="/#text-string-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Text and String Tools
            </Link>{" "}
            on the home page.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <WordFrequencyTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why word frequency still matters for SEO and editing
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Modern search engines use semantic models, but writers still benefit
            from a plain{" "}
            <strong className="font-medium text-foreground">
              word count ranking
            </strong>{" "}
            before publish: it surfaces accidental echoes (“solution” twelve
            times), thin synonym loops, or blocks where one{" "}
            <strong className="font-medium text-foreground">
              focus keyword
            </strong>{" "}
            dominates unnaturally. This page is a lightweight{" "}
            <strong className="font-medium text-foreground">
              repetition checker
            </strong>{" "}
            that complements—not replaces—Search Console and your CMS. Pair
            frequency review with the{" "}
            <Link
              href="/text/find-replace"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              find and replace tool
            </Link>{" "}
            when you want to rewrite phrases in bulk, then recount with the{" "}
            <Link
              href="/text/word-counter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              word counter
            </Link>{" "}
            for updated totals.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this word frequency analyzer (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste copy into the editor, or click{" "}
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
                to preview how repetition appears in the table.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Under <strong className="font-medium text-foreground">
                  Analysis options
                </strong>
                , choose whether to merge casing, drop very short tokens, omit
                frequent function words, and how many rows the table should show.
                The summary panel reports total tokens analyzed and unique words.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Scan the ranked list for outliers. When you are ready to share
                data, click{" "}
                <strong className="font-medium text-foreground">Copy TSV</strong>{" "}
                (exports <em>all</em> words, not only visible rows) and paste
                into Excel or Google Sheets.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Clean noisy lists first with the{" "}
                <Link
                  href="/text/whitespace-remover"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  whitespace remover
                </Link>{" "}
                or{" "}
                <Link
                  href="/text/duplicate-line-remover"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  duplicate line remover
                </Link>
                , then run frequency again on the normalized text.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and workflows this tool supports
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            People often search for an{" "}
            <strong className="font-medium text-foreground">
              online word frequency counter
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              text word analyzer
            </strong>
            , or a quick way to build a{" "}
            <strong className="font-medium text-foreground">
              keyword repetition report
            </strong>{" "}
            without installing R or Python. Teachers use histogram-style views
            for style exercises; support teams scan macros for overused
            phrases; developers paste release notes to see vocabulary skew.
            When you need URL-safe strings after editing, follow with the{" "}
            <Link
              href="/text/slug-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              slug generator
            </Link>{" "}
            and{" "}
            <Link
              href="/text/case-converter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              text case converter
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Token rules, stop words, and what this is not
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Tokens are split on whitespace; punctuation attached to the edges of
            a token is stripped so plural and comma forms usually aggregate.
            This is not lemmatization: “run” and “running” remain distinct.
            The optional stop list is a compact English set for editorial
            previews, not a comprehensive NLP lexicon. The tool does not compute
            search-engine “density” scores or read live SERPs—use it as a
            drafting aid, then validate with your analytics stack. For patterned
            edits across long files, the{" "}
            <Link
              href="/text/find-replace"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              find and replace tool
            </Link>{" "}
            supports plain text and regex.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related text and string tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Explore the full list under{" "}
            <Link
              href="/#text-string-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Text and String Tools
            </Link>
            . Highlights:
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
            For share-card copy length, combine editorial passes here with the{" "}
            <Link
              href="/website/open-graph-preview"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph preview
            </Link>
            .
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
            {wordFrequencyFaqItems.map((item) => (
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
