import type { Metadata } from "next";
import Link from "next/link";
import { LineSorterTool } from "./line-sorter-tool";
import { lineSorterFaqItems } from "@/lib/line-sorter-faq";
import { toolSections } from "@/lib/tool-catalog";

const textTools =
  toolSections.find((s) => s.id === "text-string-tools")?.tools ?? [];
const relatedTools = textTools.filter((t) => t.href !== "/text/line-sorter");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/text/line-sorter",
  },
};

export default function LineSorterPage() {
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
              href="/#text-string-tools"
              className="hover:text-foreground"
            >
              Text &amp; string tools
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span className="text-foreground">Line sorter</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Line sorter — alphabetical A–Z and Z–A, sort by length, or shuffle
            lines in the browser
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online line sorter
            </strong>{" "}
            when you need a fast way to{" "}
            <strong className="font-medium text-foreground">
              reorder pasted text line by line
            </strong>
            : alphabetically{" "}
            <strong className="font-medium text-foreground">A–Z</strong> or{" "}
            <strong className="font-medium text-foreground">Z–A</strong> with
            optional{" "}
            <strong className="font-medium text-foreground">
              case-insensitive comparison
            </strong>
            , by{" "}
            <strong className="font-medium text-foreground">
              line length
            </strong>{" "}
            (shortest or longest first), or in{" "}
            <strong className="font-medium text-foreground">
              random order
            </strong>{" "}
            for quick shuffles of brainstorm lists and QA scenarios. Unlike
            spreadsheet sorts that need column import steps, this page treats
            each newline as a row—ideal for dependency lists, route tables,
            environment keys, package names, and log excerpts you copied from a
            terminal. Processing stays{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            : upload a{" "}
            <strong className="font-medium text-foreground">.txt</strong> file
            or paste directly, then copy the sorted block. Pair sorting with our{" "}
            <Link
              href="/text/duplicate-line-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              duplicate line remover
            </Link>{" "}
            when you need unique rows after ordering, or the{" "}
            <Link
              href="/text/whitespace-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              whitespace remover
            </Link>{" "}
            when invisible spaces break comparisons.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <LineSorterTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why use a dedicated text line sorter?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Editors and terminals can sort, but a focused{" "}
            <strong className="font-medium text-foreground">
              sort lines online
            </strong>{" "}
            workflow keeps you inside the browser when you are reviewing a paste
            from Slack, a CI artifact, or a vendor CSV you do not want to open
            in Excel. Alphabetical modes help you spot typos in long identifier
            lists;{" "}
            <strong className="font-medium text-foreground">
              length-based sorting
            </strong>{" "}
            highlights unusually short or long rows before code review; random
            shuffle supports quick sampling and classroom demos. Because the
            tool preserves duplicate lines, you can mirror production data
            density and only dedupe later with the{" "}
            <Link
              href="/text/duplicate-line-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              duplicate line remover
            </Link>{" "}
            when uniqueness matters.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Content and SEO teams often alphabetize keyword or URL lists before
            sharing; developers normalize import paths before diffing branches.
            After you sort two exports, paste them into the{" "}
            <Link
              href="/text/diff-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              text diff checker
            </Link>{" "}
            to compare line-level changes without noisy order churn. For
            human-readable titles that will become URL segments, follow sorting
            with the{" "}
            <Link
              href="/text/slug-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              slug generator
            </Link>{" "}
            and the{" "}
            <Link
              href="/text/case-converter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              text case converter
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this line sorter (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste content into the input area (one record per line) or click{" "}
                <strong className="font-medium text-foreground">
                  Upload .txt
                </strong>{" "}
                to load UTF-8 plain text. Use{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                to see mixed casing and duplicate rows.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Under{" "}
                <strong className="font-medium text-foreground">
                  Sort mode
                </strong>
                , pick{" "}
                <strong className="font-medium text-foreground">A–Z</strong>,{" "}
                <strong className="font-medium text-foreground">Z–A</strong>,{" "}
                <strong className="font-medium text-foreground">
                  shortest or longest line first
                </strong>
                , or{" "}
                <strong className="font-medium text-foreground">
                  random order
                </strong>
                . For alphabetical modes, toggle{" "}
                <strong className="font-medium text-foreground">
                  ignore case
                </strong>{" "}
                when uppercase and lowercase should sort together.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                In random mode, click{" "}
                <strong className="font-medium text-foreground">
                  Shuffle again
                </strong>{" "}
                after you edit the input so the permutation matches the latest
                lines.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use the{" "}
                <strong className="font-medium text-foreground">copy</strong>{" "}
                control on the output panel to move sorted text into your editor,
                sheet, or ticket. If the browser blocks clipboard access, select
                the output and copy with Ctrl+C (Windows) or Cmd+C (macOS).
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and workflows this page supports
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            People search for an{" "}
            <strong className="font-medium text-foreground">
              alphabetical line sorter
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              sort lines by length online
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              reverse sort lines
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              randomize line order
            </strong>{" "}
            when cleaning exports and prep lists for scripts. Data folks
            alphabetize column extracts before joining; SREs sort error tokens
            before deduping noisy tails. When you need delimiter-aware rows
            instead of raw lines, try the{" "}
            <Link
              href="/text/comma-separator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              comma separator tool
            </Link>{" "}
            first, then return here for final ordering.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Sorting rules, stability, and empty lines
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Alphabetical modes use Unicode-aware{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              localeCompare
            </code>{" "}
            with numeric sorting enabled so{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              item10
            </code>{" "}
            orders after{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              item2
            </code>{" "}
            when that reads more naturally. Length sorts break ties
            alphabetically. Blank lines participate like any other row. To strip
            or rewrite lines before sorting, combine with{" "}
            <Link
              href="/text/find-replace"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              find and replace
            </Link>{" "}
            or the whitespace tool, then paste back here.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and practical limits
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Sorting runs locally in your browser. Very large pastes may feel
            slower on older devices; for multi-megabyte logs, prefer streaming
            CLI tools. This UI targets chat-sized text, query results, and
            config snippets. For prose statistics rather than line order, use the{" "}
            <Link
              href="/text/word-counter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              word counter
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related text and string tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
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
            {lineSorterFaqItems.map((item) => (
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
