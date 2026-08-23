import type { Metadata } from "next";
import Link from "next/link";
import { DuplicateLineRemoverTool } from "./duplicate-line-remover-tool";
import { duplicateLineRemoverFaqItems } from "@/lib/duplicate-line-remover-faq";
import { toolSections } from "@/lib/tool-catalog";

const textTools =
  toolSections.find((s) => s.id === "text-string-tools")?.tools ?? [];
const relatedTools = textTools.filter(
  (t) => t.href !== "/text/duplicate-line-remover",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/text/duplicate-line-remover",
  },
};

export default function DuplicateLineRemoverPage() {
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
            <span className="text-foreground">Duplicate line remover</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Duplicate line remover — dedupe pasted lists, logs, and exports with
            case control
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online duplicate line remover
            </strong>{" "}
            when you need a fast{" "}
            <strong className="font-medium text-foreground">
              unique-line list
            </strong>{" "}
            from messy copy: mailing lists merged from CRM exports, URL
            inventories from crawlers, stack traces, feature flags, or ticket
            IDs pasted from Slack. Toggle{" "}
            <strong className="font-medium text-foreground">
              case-insensitive deduplication
            </strong>{" "}
            so{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              User
            </code>{" "}
            and{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              user
            </code>{" "}
            collapse to a single row, or require{" "}
            <strong className="font-medium text-foreground">
              case-sensitive matching
            </strong>{" "}
            for symbols and codes. Optional trimming ignores padding spaces
            before comparing lines. Processing stays{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            —upload a{" "}
            <strong className="font-medium text-foreground">.txt</strong> file
            or paste directly, then copy the cleaned result. Pair deduping with
            our{" "}
            <Link
              href="/text/line-sorter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              line sorter
            </Link>{" "}
            when you also need alphabetical order, or{" "}
            <Link
              href="/text/whitespace-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              whitespace remover
            </Link>{" "}
            when tabs and double spaces skew comparisons.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <DuplicateLineRemoverTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why remove duplicate lines?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Duplicates inflate counts, break one-row-per-entity assumptions in
            spreadsheets, and waste time in QA when the same error line appears
            many times in a log tail. A dedicated{" "}
            <strong className="font-medium text-foreground">
              text deduplication
            </strong>{" "}
            step keeps the{" "}
            <strong className="font-medium text-foreground">
              first occurrence
            </strong>{" "}
            of each line and drops later copies so you can import into databases,
            build pivot tables, or share concise excerpts. Unlike sorting-based
            shell workflows, this tool{" "}
            <strong className="font-medium text-foreground">
              preserves original order
            </strong>
            , which matters for chronological logs and human-curated lists.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            When two documents disagree, use the{" "}
            <Link
              href="/text/diff-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              text diff checker
            </Link>{" "}
            to see line-level changes, then run this remover on either side if you
            only need the union of unique statements. For prose length limits,
            the{" "}
            <Link
              href="/text/word-counter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              word counter
            </Link>{" "}
            complements line tools when you trim marketing copy rather than
            data lists.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this duplicate line remover (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste your content into the input area (one record per line) or
                click Upload .txt to load UTF-8 text. Load sample shows
                mixed-case duplicates.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Enable ignore case for email-style lists; turn it off when casing
                encodes meaning (hex prefixes, language tags, or SKUs).
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use trim edges for comparison when CSV or Excel exports add
                invisible spaces. Optionally trim each kept line to normalize
                output spacing.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Check line counts, then use the copy control on the output panel
                to grab unique lines for your editor or sheet.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and workflows teams search for
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Teams search for an online uniq for text, remove duplicate rows from
            paste, or dedupe email lists without Excel macros. This page supports
            those intents with case and trim controls. For delimited files, try{" "}
            <Link
              href="/dev/csv-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV to JSON
            </Link>{" "}
            when you need structured fields first. Normalizing identifiers? The{" "}
            <Link
              href="/text/case-converter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              text case converter
            </Link>{" "}
            can lowercase everything before deduping.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Case sensitivity, trimming, and empty lines
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Case-sensitive mode treats characters literally. Case-insensitive
            mode lowercases the comparison key only; the first line stays as
            typed. Trimming before compare fixes invisible duplicates from
            trailing spaces. Blank lines dedupe like any other line; for empty
            rows, combine with{" "}
            <Link
              href="/text/find-replace"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              find and replace
            </Link>{" "}
            if you need a custom pass.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and limits
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Deduplication runs locally in your browser. Very large pastes may feel
            slower on old hardware; for multi-gigabyte logs, prefer a streaming
            CLI. This UI targets exports, query results, and chat-sized text.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related text and string tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browse the full{" "}
            <Link
              href="/#text-string-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Text &amp; String Tools
            </Link>{" "}
            section on the home page. Highlights:
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
            {duplicateLineRemoverFaqItems.map((item) => (
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
