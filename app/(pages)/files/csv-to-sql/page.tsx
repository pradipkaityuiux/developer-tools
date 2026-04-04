import type { Metadata } from "next";
import Link from "next/link";
import { CsvToSqlTool } from "./csv-to-sql-tool";
import { csvToSqlFaqItems } from "@/lib/csv-to-sql-faq";
import { toolSections } from "@/lib/tool-catalog";

const fileTools =
  toolSections.find((s) => s.id === "file-data-tools")?.tools ?? [];
const relatedTools = fileTools.filter((t) => t.href !== "/files/csv-to-sql");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/files/csv-to-sql",
  },
};

export default function CsvToSqlPage() {
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
            <span className="text-foreground">CSV to SQL</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            CSV to SQL converter — INSERT statements for PostgreSQL, MySQL, and
            SQL Server
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              CSV to SQL converter
            </strong>{" "}
            to turn spreadsheet or export files into{" "}
            <strong className="font-medium text-foreground">
              INSERT INTO … VALUES
            </strong>{" "}
            scripts for{" "}
            <strong className="font-medium text-foreground">
              database seeding
            </strong>
            , staging imports, and quick{" "}
            <strong className="font-medium text-foreground">migrations</strong>.
            Paste{" "}
            <strong className="font-medium text-foreground">
              comma-separated
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              semicolon-separated
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">tab-separated</strong>{" "}
            (TSV), or{" "}
            <strong className="font-medium text-foreground">pipe-delimited</strong>{" "}
            text—or upload a file. Everything runs{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            : no CSV upload to a backend for conversion. Choose{" "}
            <strong className="font-medium text-foreground">
              ANSI (PostgreSQL / SQLite)
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">MySQL</strong>, or{" "}
            <strong className="font-medium text-foreground">SQL Server</strong>{" "}
            identifier quoting, optionally{" "}
            <strong className="font-medium text-foreground">
              batch many rows per INSERT
            </strong>
            , and copy or download a ready{" "}
            <strong className="font-medium text-foreground">.sql</strong> file.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <CsvToSqlTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why generate SQL INSERT statements from CSV?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Teams still ship a lot of truth in{" "}
            <strong className="font-medium text-foreground">CSV</strong>:
            product catalogs, referral codes, locale strings, and QA fixtures.
            Databases want typed rows. Bridging the gap with hand-written INSERTs
            is slow and error-prone. A{" "}
            <strong className="font-medium text-foreground">
              CSV to INSERT generator
            </strong>{" "}
            produces repeatable SQL you can drop next to schema migrations, run
            in CI against a disposable database, or email to a DBA for review.
            When you only need JSON for an API mock, our{" "}
            <Link
              href="/dev/csv-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV to JSON converter
            </Link>{" "}
            is the parallel path; when JSON already exists,{" "}
            <Link
              href="/dev/json-to-csv"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON to CSV
            </Link>{" "}
            flows the other direction.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this CSV to SQL tool (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  Paste or upload
                </strong>{" "}
                your file. Quoted fields that contain delimiters (for example{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  &quot;Acme, LLC&quot;,2024
                </code>
                ) are parsed using common CSV escaping rules.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Set{" "}
                <strong className="font-medium text-foreground">
                  Table name
                </strong>{" "}
                to match your destination table. Pick{" "}
                <strong className="font-medium text-foreground">Delimiter</strong>{" "}
                <strong className="font-medium text-foreground">Auto</strong>{" "}
                unless you know the separator (European CSV often uses{" "}
                <strong className="font-medium text-foreground">
                  semicolons
                </strong>
                ).
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Enable{" "}
                <strong className="font-medium text-foreground">
                  First row is header
                </strong>{" "}
                so column names come from the header cells (duplicates become{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  name_2
                </code>
                , etc.). Choose{" "}
                <strong className="font-medium text-foreground">
                  identifier quoting
                </strong>{" "}
                for your engine: double quotes for PostgreSQL/SQLite, backticks
                for MySQL, brackets for SQL Server.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Toggle{" "}
                <strong className="font-medium text-foreground">
                  Smart typing
                </strong>{" "}
                when empty cells should become{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  NULL
                </code>
                , numeric cells unquoted, and{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  true
                </code>
                /
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  false
                </code>{" "}
                converted to{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  TRUE
                </code>
                /
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  FALSE
                </code>
                . Turn it off if every value must be inserted as a string.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Pick{" "}
                <strong className="font-medium text-foreground">
                  Batched VALUES
                </strong>{" "}
                for fewer round-trips or{" "}
                <strong className="font-medium text-foreground">
                  one INSERT per row
                </strong>{" "}
                for smaller, reviewable statements. Use{" "}
                <strong className="font-medium text-foreground">Copy SQL</strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">
                  Download .sql
                </strong>
                , then optionally run the text through our{" "}
                <Link
                  href="/dev/sql-formatter"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  SQL formatter
                </Link>{" "}
                for consistent indentation in git.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            CSV tooling workflow: view, dedupe, then SQL
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Before you freeze rows into SQL, it helps to inspect the grid. Our{" "}
            <Link
              href="/files/csv-viewer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV viewer &amp; editor
            </Link>{" "}
            lets you sort, filter, and fix cells in the browser. If duplicates
            would break unique constraints, clean the file with the{" "}
            <Link
              href="/files/csv-deduplicator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV deduplicator
            </Link>{" "}
            keyed on the columns that matter, then generate INSERTs from the
            cleaned export.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            SEO, content, and structured data pipelines
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Marketing and SEO teams often maintain{" "}
            <strong className="font-medium text-foreground">
              keyword matrices
            </strong>
            , redirect maps, and landing-page inventories in spreadsheets.
            Engineering may need those same rows inside Postgres for a static
            site generator, edge config, or internal admin UI. Converting CSV to
            SQL locally keeps proprietary search data off random SaaS parsers
            and makes audits easier: you can diff SQL the same way you diff
            code. For line-oriented text transforms before CSV export, the{" "}
            <Link
              href="/text/comma-separator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              comma separator tool
            </Link>{" "}
            can reshape lists into delimiter-ready columns.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Safety, review, and production imports
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This page generates text only—it does not execute SQL against a
            database. Always run generated scripts on a staging copy first,
            watch for type mismatches (especially dates and booleans), and
            confirm identifier quoting matches how the table was created. For
            very large files, prefer your database&apos;s native bulk loader
            after using this tool to prototype a smaller subset.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and performance
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Parsing and string building happen client-side in JavaScript, which
            suits PII-heavy customer lists and unreleased catalog data.
            Extremely large pastes may stress the tab; split files or raise{" "}
            <strong className="font-medium text-foreground">
              rows per statement
            </strong>{" "}
            gradually if your server rejects oversized packets.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related file and data tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Browse every utility in{" "}
            <Link
              href="/#file-data-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              File &amp; data tools
            </Link>{" "}
            on the home page, or open a focused tool below.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {relatedTools.slice(0, 12).map((tool) => (
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
            {csvToSqlFaqItems.map((item) => (
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
