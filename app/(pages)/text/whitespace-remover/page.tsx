import type { Metadata } from "next";
import Link from "next/link";
import { WhitespaceRemoverTool } from "./whitespace-remover-tool";
import { whitespaceRemoverFaqItems } from "@/lib/whitespace-remover-faq";
import { toolSections } from "@/lib/tool-catalog";

const textTools =
  toolSections.find((s) => s.id === "text-string-tools")?.tools ?? [];
const relatedTools = textTools.filter(
  (t) => t.href !== "/text/whitespace-remover",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/text/whitespace-remover",
  },
};

export default function WhitespaceRemoverPage() {
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
            <span className="text-foreground">Whitespace remover</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Whitespace remover — trim edges, collapse spaces, and tidy pasted
            text for forms and CSVs
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online whitespace remover
            </strong>{" "}
            when copy from a{" "}
            <strong className="font-medium text-foreground">PDF</strong>,{" "}
            <strong className="font-medium text-foreground">Excel</strong>{" "}
            export, or chat client arrives with{" "}
            <strong className="font-medium text-foreground">
              double spaces
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              irregular tabs
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              invisible padding
            </strong>{" "}
            that breaks web forms, database imports, and CMS fields. Toggle{" "}
            <strong className="font-medium text-foreground">
              document trim
            </strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">
              per-line trim
            </strong>
            , collapse horizontal runs into a single space, and choose whether
            to keep, compress, or drop blank lines. Everything runs{" "}
            <strong className="font-medium text-foreground">
              locally in your browser
            </strong>
            —upload a{" "}
            <strong className="font-medium text-foreground">.txt</strong> file
            or paste directly, then copy the cleaned string. After cleanup,{" "}
            <Link
              href="/text/duplicate-line-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              remove duplicate lines
            </Link>{" "}
            when lists still contain repeated rows, or open the{" "}
            <Link
              href="/text/diff-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              text diff checker
            </Link>{" "}
            if you need to verify two whitespace-normalized versions match.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <WhitespaceRemoverTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why normalize whitespace?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Extra whitespace is a common source of validation errors, fuzzy
            duplicate detection, and broken CSV columns. Marketing and support
            teams paste from documents that use non-breaking spaces; engineers
            copy log fragments with runaway indentation. A dedicated{" "}
            <strong className="font-medium text-foreground">
              text whitespace normalizer
            </strong>{" "}
            gives you predictable spacing before you import into Sheets, file a
            ticket, or commit a data fixture. Unlike manual find-and-replace in
            a word processor, this utility keeps{" "}
            <strong className="font-medium text-foreground">
              line-oriented workflows
            </strong>{" "}
            explicit: you see character and line counts change as options
            toggle.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            If you are preparing slugs or identifiers, follow normalization
            with the{" "}
            <Link
              href="/text/slug-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              slug generator
            </Link>{" "}
            or{" "}
            <Link
              href="/text/case-converter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              text case converter
            </Link>
            . For prose limits and SEO snippets, pair cleanup with the{" "}
            <Link
              href="/text/word-counter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              word counter
            </Link>{" "}
            so counts reflect final spacing.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this whitespace remover (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste your text or click Upload .txt to load UTF-8 plain text.
                Load sample demonstrates padded columns and extra blank lines.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Enable trim start/end of the whole paste when the blob has
                leading or trailing junk; enable trim each line when every row
                came from a table or list with cell padding.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Turn on collapse spaces and tabs to merge horizontal runs inside
                each line. Turn it off when preserving code indentation matters.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Under Blank lines, keep structure for paragraphs, collapse runs
                when PDFs insert double spacing, or remove empty lines for flat
                lists.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Check the stats row, then copy cleaned output into your target
                system.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and intents this page supports
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            People search for remove extra spaces online, trim pasted text,
            strip leading and trailing whitespace, collapse tabs, delete blank
            lines, and fix PDF copy spacing. The controls map directly to those
            tasks. For delimiter-specific work—turning newline lists into
            comma-separated values—use the{" "}
            <Link
              href="/text/comma-separator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              comma separator tool
            </Link>{" "}
            after you normalize spacing here. For structured tables, the{" "}
            <Link
              href="/files/csv-viewer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV viewer and editor
            </Link>{" "}
            helps validate columns once rows are clean.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Collapse spaces versus code and markup
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Collapsing horizontal whitespace treats runs of spaces, tabs, and
            common non-breaking spaces on each line; it does not parse JSON,
            HTML, or CSS trees. For syntax-aware formatting, run the{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter
            </Link>
            ,{" "}
            <Link
              href="/dev/html-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML formatter
            </Link>
            , or{" "}
            <Link
              href="/dev/css-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSS formatter
            </Link>{" "}
            after you have removed stray characters from pasted snippets.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and performance
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Text never leaves your tab: processing is synchronous JavaScript
            suitable for articles, exports, and chat logs. Extremely large files
            may feel slower on low-memory devices; for multi-gigabyte logs,
            prefer a streaming CLI. This interface targets everyday paste sizes.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related text and string tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Explore the full{" "}
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
            {whitespaceRemoverFaqItems.map((item) => (
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
