import type { Metadata } from "next";
import Link from "next/link";
import { CsvViewerTool } from "./csv-viewer-tool";
import { csvViewerFaqItems } from "@/lib/csv-viewer-faq";
import { toolSections } from "@/lib/tool-catalog";

const fileTools =
  toolSections.find((s) => s.id === "file-data-tools")?.tools ?? [];
const relatedTools = fileTools.filter((t) => t.href !== "/files/csv-viewer");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/files/csv-viewer",
  },
};

export default function CsvViewerPage() {
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
              href="/#file-data-tools"
              className="hover:text-foreground"
            >
              File &amp; data tools
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span className="text-foreground">CSV viewer &amp; editor</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            CSV viewer and editor online — sortable table, filter, edit cells,
            export RFC-safe CSV
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online CSV viewer and editor
            </strong>{" "}
            when you need a{" "}
            <strong className="font-medium text-foreground">
              spreadsheet-style grid
            </strong>{" "}
            without installing Excel or Google Sheets: open{" "}
            <strong className="font-medium text-foreground">
              comma-, semicolon-, tab-, or pipe-delimited
            </strong>{" "}
            exports,{" "}
            <strong className="font-medium text-foreground">
              sort columns
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              search across every cell
            </strong>
            , tweak values inline, then{" "}
            <strong className="font-medium text-foreground">
              copy or download UTF-8 CSV
            </strong>{" "}
            with proper quoting for commas and newlines inside fields. Parsing and
            editing run{" "}
            <strong className="font-medium text-foreground">
              entirely in your browser
            </strong>
            —ideal for quick QA on data feeds, CRM slices, and config tables
            before you push them to a database or API. Continue to our{" "}
            <Link
              href="/dev/csv-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV to JSON converter
            </Link>{" "}
            when you need structured JSON, or the{" "}
            <Link
              href="/files/csv-deduplicator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV deduplicator
            </Link>{" "}
            when duplicates—not layout—are the problem.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <CsvViewerTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why use a browser-based CSV viewer instead of a desktop spreadsheet?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Lightweight{" "}
            <strong className="font-medium text-foreground">
              CSV table viewers
            </strong>{" "}
            help when you are on a locked-down machine, reviewing a vendor export
            on a shared laptop, or sanity-checking a pipeline artifact without
            waiting for a heavy app to open. Because rows stay in memory inside
            your tab, you avoid accidental cloud sync of sensitive HR or finance
            extracts. The trade-off is scale: very large files are better handled
            by streaming CLI tools or databases. For everyday{" "}
            <strong className="font-medium text-foreground">
              tabular CSV and TSV
            </strong>{" "}
            files, this page gives you sort, filter, and inline edits with an
            export path that matches{" "}
            <strong className="font-medium text-foreground">RFC 4180</strong>{" "}
            quoting rules so downstream importers stay happy.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this CSV viewer (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  Paste or upload
                </strong>{" "}
                your file. Use{" "}
                <strong className="font-medium text-foreground">Upload CSV</strong>{" "}
                for local{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  .csv
                </code>
                ,{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  .tsv
                </code>
                , or plain text, or paste directly into the text area. Click{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                to see quoted fields and mixed types in action.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  Choose delimiter
                </strong>
                . Leave{" "}
                <strong className="font-medium text-foreground">
                  Auto-detect
                </strong>{" "}
                on for most exports; pick comma, semicolon, tab, or pipe
                manually if your file mixes separators or the detector picks the
                wrong one on short samples. Toggle{" "}
                <strong className="font-medium text-foreground">
                  First row is header
                </strong>{" "}
                so labels stay fixed while you sort body rows.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  Explore and refine
                </strong>
                . Type in{" "}
                <strong className="font-medium text-foreground">
                  Filter rows
                </strong>{" "}
                to keep only lines where any cell matches your query (case
                insensitive). Click a column header to cycle ascending, descending,
                or original order—sorting applies to data rows, not the header line
                when that mode is on.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  Edit and ship
                </strong>
                . Change any cell, including header names when the header row is
                enabled. Use{" "}
                <strong className="font-medium text-foreground">
                  Export filtered rows only
                </strong>{" "}
                when your download should match the filtered subset. Press{" "}
                <strong className="font-medium text-foreground">Copy CSV</strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">
                  Download .csv
                </strong>
                , or copy from the Raw CSV preview at the bottom.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and workflows this page matches
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Teams search for an{" "}
            <strong className="font-medium text-foreground">
              online CSV viewer
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              edit CSV without Excel
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              TSV viewer in browser
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              sort and filter CSV
            </strong>{" "}
            before SQL or API import. This tool covers those intents with explicit
            delimiter control and a visible export buffer. When you only need to
            convert shape instead of editing cells, the{" "}
            <Link
              href="/dev/csv-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV to JSON
            </Link>{" "}
            and{" "}
            <Link
              href="/dev/json-to-csv"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON to CSV
            </Link>{" "}
            converters stay the fastest path. When you must generate{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              INSERT
            </code>{" "}
            statements, use the{" "}
            <Link
              href="/files/csv-to-sql"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV to SQL converter
            </Link>
            . For newline lists that are not yet a table, normalize with the{" "}
            <Link
              href="/text/comma-separator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              comma separator tool
            </Link>{" "}
            first.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            CSV quirks: quoting, locales, and line endings
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            European Excel versions often emit{" "}
            <strong className="font-medium text-foreground">
              semicolon-separated
            </strong>{" "}
            CSV when the locale uses comma as the decimal separator. Web exports
            may emit{" "}
            <strong className="font-medium text-foreground">UTF-8 BOM</strong>{" "}
            bytes; most parsers strip them, but if the first header looks wrong,
            open the raw file in a text editor and confirm the first characters.
            Line endings{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              CRLF
            </code>{" "}
            versus{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              LF
            </code>{" "}
            rarely matter for logical rows here because newline characters inside
            quoted fields are preserved. After edits, verify totals against the
            source system and consider hashing binaries with the{" "}
            <Link
              href="/files/file-hash"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              file hash checker
            </Link>{" "}
            when you exchange artifacts with operations teams.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and limits
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Nothing is transmitted to our servers for parsing or export: it is the
            same client-side model as the rest of the{" "}
            <Link
              href="/#file-data-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              file and data tools
            </Link>{" "}
            collection. Extremely wide or long tables may feel slow because each
            visible cell is an editable field—trim columns in your source tool or
            split files if performance suffers. This viewer does not run
            spreadsheet formulas; it edits literal cell text only.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related file and data tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browse the full catalog section for more utilities:
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
            {csvViewerFaqItems.map((item) => (
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
