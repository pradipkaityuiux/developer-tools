import type { Metadata } from "next";
import Link from "next/link";
import { CommaSeparatorTool } from "./comma-separator-tool";
import { commaSeparatorFaqItems } from "@/lib/comma-separator-faq";
import { toolSections } from "@/lib/tool-catalog";

const textTools =
  toolSections.find((s) => s.id === "text-string-tools")?.tools ?? [];
const relatedTools = textTools.filter((t) => t.href !== "/text/comma-separator");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/text/comma-separator",
  },
};

export default function CommaSeparatorPage() {
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
            <span className="text-foreground">Comma separator tool</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Comma separator tool — newline list to CSV and split delimited text
            into rows
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online comma separator
            </strong>{" "}
            when you need to turn a{" "}
            <strong className="font-medium text-foreground">
              vertical list into comma-separated values
            </strong>{" "}
            for Google Sheets, Excel, SQL{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              IN (...)
            </code>{" "}
            clauses, or API query parameters—or the reverse:{" "}
            <strong className="font-medium text-foreground">
              split a CSV or TSV line into one value per line
            </strong>{" "}
            for deduping, mailing tools, or plain-text workflows. Pick comma,
            semicolon, tab, or pipe; optional{" "}
            <strong className="font-medium text-foreground">
              RFC-style quoting
            </strong>{" "}
            on join; quoted-field parsing on split. Processing stays{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            . Upload a{" "}
            <strong className="font-medium text-foreground">.txt</strong> file
            or paste directly, then copy the result. For full tables, continue
            with our{" "}
            <Link
              href="/files/csv-viewer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV viewer and editor
            </Link>{" "}
            or{" "}
            <Link
              href="/dev/csv-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV to JSON
            </Link>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <CommaSeparatorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why use a comma separator for lists and CSV snippets?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Copy-paste between apps rarely preserves the shape you need. CRM and
            analytics exports often arrive as one column per line, while forms
            and databases want a single{" "}
            <strong className="font-medium text-foreground">
              delimiter-separated string
            </strong>
            . A dedicated{" "}
            <strong className="font-medium text-foreground">
              list to CSV converter
            </strong>{" "}
            avoids manual typing, typos, and missing quotes around values that
            contain commas. The opposite task—turning a pasted CSV row into a
            newline list—helps before running the{" "}
            <Link
              href="/text/duplicate-line-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              duplicate line remover
            </Link>{" "}
            or{" "}
            <Link
              href="/text/line-sorter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              line sorter
            </Link>
            .
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Keywords people search include{" "}
            <strong className="font-medium text-foreground">
              newline to comma online
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              convert list to comma separated
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              split comma separated string into lines
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              TSV to line break
            </strong>
            . This page supports those intents with explicit join and split
            modes, delimiter detection for pasted samples, and copy-friendly
            output. Normalize messy spacing first with the{" "}
            <Link
              href="/text/whitespace-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              whitespace remover
            </Link>{" "}
            if exports include trailing spaces in cells.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this comma separator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Choose{" "}
                <strong className="font-medium text-foreground">
                  Join lines → delimited
                </strong>{" "}
                if you have one value per line, or{" "}
                <strong className="font-medium text-foreground">
                  Split delimited → lines
                </strong>{" "}
                if you have CSV-style text. Select delimiter: comma, semicolon,
                tab, pipe, or one custom character.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Paste into the input or use{" "}
                <strong className="font-medium text-foreground">
                  Upload .txt
                </strong>{" "}
                for UTF-8 files. In split mode, try{" "}
                <strong className="font-medium text-foreground">
                  Detect delimiter
                </strong>{" "}
                on a representative sample when you are unsure whether the file
                uses commas or semicolons.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                For join: enable trim and skip empty lines as needed; set quoting
                to minimal for standard CSV or always when your target system
                requires wrapped fields.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                For split: optionally trim each value and add blank lines
                between original row groups when flattening multi-line CSV.
                Copy the output with the copy icon on the result panel.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Join mode: from newline list to CSV-style line
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Each non-skipped line becomes one field. Minimal quoting wraps only
            values that contain the delimiter, double quotes, or line breaks—so
            addresses, product titles, and JSON fragments survive intact. If you
            need every field wrapped for a strict importer, switch to always
            quote. After joining identifiers, you might lowercase them with the{" "}
            <Link
              href="/text/case-converter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              text case converter
            </Link>{" "}
            before sending to a case-sensitive API.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Split mode: from delimited text to one value per line
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            The splitter understands quoted segments, so commas inside{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              &quot;like this, with commas&quot;
            </code>{" "}
            do not create false breaks. Multiple input rows produce one output
            line per cell; optional blank lines mark where each original row
            ended. That is useful when you are preparing a single-column file but
            still want visual grouping. For replacing tokens across the text,
            pair with{" "}
            <Link
              href="/text/find-replace"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              find and replace
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy, limits, and when to use heavier tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Conversion runs entirely client-side. Very large files may feel slow
            on older devices; for huge datasets prefer command-line tools or the
            streaming workflows in your database. This UI targets clipboard-sized
            lists, single-column exports, and modest CSV snippets—not multi-GB
            ETL. JSON-heavy pipelines may fit{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter
            </Link>{" "}
            or CSV JSON converters better once structure matters more than flat
            lists.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related text and file tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Explore the full{" "}
            <Link
              href="/#text-string-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Text &amp; String Tools
            </Link>{" "}
            section on the home page. More picks:
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
            {commaSeparatorFaqItems.map((item) => (
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
