import type { Metadata } from "next";
import Link from "next/link";
import { WordCounterTool } from "./word-counter-tool";
import { wordCounterFaqItems } from "@/lib/word-counter-faq";
import { toolSections } from "@/lib/tool-catalog";

const textTools =
  toolSections.find((s) => s.id === "text-string-tools")?.tools ?? [];
const relatedTools = textTools.filter((t) => t.href !== "/text/word-counter");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/text/word-counter",
  },
};

export default function WordCounterPage() {
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
            <span className="text-foreground">Word counter</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Word counter online — characters, sentences, paragraphs, reading
            time
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online word counter
            </strong>{" "}
            to measure{" "}
            <strong className="font-medium text-foreground">word count</strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              character count with and without spaces
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              sentence and paragraph estimates
            </strong>
            , line totals, and{" "}
            <strong className="font-medium text-foreground">
              estimated reading time
            </strong>{" "}
            with an adjustable WPM setting. It suits bloggers checking article
            length, students hitting essay limits, marketers fitting{" "}
            <strong className="font-medium text-foreground">
              meta description character limits
            </strong>
            , and developers pasting release notes or README sections. All
            analysis runs{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            , so drafts stay private. After you validate length here, confirm
            live HTML fields with our{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            and explore more utilities in the{" "}
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
        <WordCounterTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why teams still use a dedicated word and character counter
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Word processors bundle counts with layout, styles, and revision
            metadata, which can diverge from what a CMS textarea or social
            composer actually accepts. A focused{" "}
            <strong className="font-medium text-foreground">
              character counter online
            </strong>{" "}
            shows the same numbers your paste buffer will deliver—valuable when
            you tune{" "}
            <strong className="font-medium text-foreground">
              SEO title tags
            </strong>
            , email preheaders, or support macros. Pair raw counts with the{" "}
            <Link
              href="/text/word-frequency"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              word frequency analyzer
            </Link>{" "}
            when you want to spot repeated phrases or stuffing patterns before
            publication.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this word counter (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste any UTF-8 text into the editor, or click{" "}
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
                if you want a quick demo paragraph.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Watch the{" "}
                <strong className="font-medium text-foreground">
                  live counts
                </strong>{" "}
                panel update for words, characters, sentences, paragraphs,
                lines, and reading time. Choose a{" "}
                <strong className="font-medium text-foreground">WPM</strong>{" "}
                value that matches your editorial guideline.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Copy summary
                </strong>{" "}
                to paste metrics into tickets or briefs, or{" "}
                <strong className="font-medium text-foreground">
                  Copy text
                </strong>{" "}
                to move the draft onward. Use{" "}
                <strong className="font-medium text-foreground">Clear</strong>{" "}
                when you want a blank slate.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                When you need consistent casing or URL slugs after trimming
                length, chain this page with the{" "}
                <Link
                  href="/text/case-converter"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  text case converter
                </Link>{" "}
                and{" "}
                <Link
                  href="/text/slug-generator"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  slug generator
                </Link>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and workflows this page supports
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Editors often search for an{" "}
            <strong className="font-medium text-foreground">
              essay word counter
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              reading time calculator for blogs
            </strong>
            , or a quick{" "}
            <strong className="font-medium text-foreground">
              tweet and bio character checker
            </strong>{" "}
            without installing software. Developers may need a{" "}
            <strong className="font-medium text-foreground">
              plaintext statistics panel
            </strong>{" "}
            before committing changelog prose. Content designers combine counts
            with the{" "}
            <Link
              href="/website/open-graph-preview"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph preview
            </Link>{" "}
            to keep titles and descriptions within share-card norms.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Reading time, accessibility, and editorial policy
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Estimated minutes use simple division by WPM; they do not replace
            usability testing or screen-reader audits. If you publish long-form
            guides, disclose assumptions (for example, 200 WPM baseline) next
            to the byline so readers know how the number was derived. For bulk
            text surgery—removing duplicates or normalizing whitespace—open the{" "}
            <Link
              href="/text/duplicate-line-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              duplicate line remover
            </Link>{" "}
            or{" "}
            <Link
              href="/text/whitespace-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              whitespace remover
            </Link>{" "}
            before recounting cleaned copy.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Limitations compared with NLP pipelines
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            This utility tokenizes on whitespace and uses punctuation heuristics
            for sentences. It will not lemmatize vocabulary, detect language
            codes, or respect publisher-specific footnote rules. For production
            search indexes or ML datasets, export text and run a tokenizer in
            your stack. For everyday publishing tasks, the trade-off is speed,
            privacy, and zero configuration. Need patterned edits across long
            drafts? Use the{" "}
            <Link
              href="/text/find-replace"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              find and replace tool
            </Link>{" "}
            with optional regex, then return here to verify the new length.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related text and string tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browse the full catalog under{" "}
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
            For placeholder copy while mocking layouts, the{" "}
            <Link
              href="/dev/lorem-ipsum"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              lorem ipsum generator
            </Link>{" "}
            pairs well with this counter when you stress-test component overflow.
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
            {wordCounterFaqItems.map((item) => (
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
