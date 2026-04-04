import type { Metadata } from "next";
import Link from "next/link";
import { CsvDeduplicatorTool } from "./csv-deduplicator-tool";
import { csvDeduplicatorFaqItems } from "@/lib/csv-deduplicator-faq";
import { toolSections } from "@/lib/tool-catalog";

const fileTools =
  toolSections.find((s) => s.id === "file-data-tools")?.tools ?? [];
const relatedTools = fileTools.filter(
  (t) => t.href !== "/files/csv-deduplicator",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/files/csv-deduplicator",
  },
};

export default function CsvDeduplicatorPage() {
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
            <span className="text-foreground">CSV deduplicator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            CSV deduplicator for mailing lists, CRM exports, and product feeds
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              CSV deduplication tool
            </strong>{" "}
            when you need to{" "}
            <strong className="font-medium text-foreground">
              remove duplicate rows
            </strong>{" "}
            from spreadsheet exports—by{" "}
            <strong className="font-medium text-foreground">
              email, SKU, order ID
            </strong>
            , or any combination of columns. Paste{" "}
            <strong className="font-medium text-foreground">
              comma-, semicolon-, tab-, or pipe-delimited
            </strong>{" "}
            text, or upload a file. Processing runs{" "}
            <strong className="font-medium text-foreground">
              entirely in your browser
            </strong>
            , so subscriber lists and inventory files are not sent to a server
            for deduping. Choose{" "}
            <strong className="font-medium text-foreground">
              keep first
            </strong>{" "}
            or{" "}
            <strong className="font-medium text-foreground">keep last</strong>{" "}
            when keys repeat, optionally{" "}
            <strong className="font-medium text-foreground">
              trim whitespace
            </strong>{" "}
            for fair comparisons, then copy or download a cleaned{" "}
            <strong className="font-medium text-foreground">UTF-8 CSV</strong>{" "}
            ready for Mailchimp, HubSpot, Shopify imports, or SQL loaders.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <CsvDeduplicatorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why deduplicate CSV files before imports?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Duplicate rows inflate bounce risk in email campaigns, skew analytics
            in ad audiences, and break uniqueness constraints in databases.
            Marketing automation platforms often charge by contact count, so a
            clean{" "}
            <strong className="font-medium text-foreground">
              deduplicated mailing list
            </strong>{" "}
            saves money and protects sender reputation. E-commerce teams merge
            vendor catalogs and marketplace exports; deduping on{" "}
            <strong className="font-medium text-foreground">
              product SKU or GTIN
            </strong>{" "}
            keeps feeds consistent for Google Merchant Center and internal PIM
            workflows. Doing this step before you run{" "}
            <Link
              href="/files/csv-to-sql"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV to SQL
            </Link>{" "}
            inserts or sync to a CRM reduces failed batches and support tickets.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this CSV deduplicator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  Paste or upload
                </strong>{" "}
                your export. If cells contain commas inside quotes (for example{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  &quot;Acme, Inc.&quot;,US
                </code>
                ), keep the quotes—the parser treats them as one field.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Set{" "}
                <strong className="font-medium text-foreground">Delimiter</strong>{" "}
                to{" "}
                <strong className="font-medium text-foreground">Auto</strong>{" "}
                unless you know the file uses a fixed separator (common for EU
                semicolon CSV and tab-separated files).
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Enable{" "}
                <strong className="font-medium text-foreground">
                  First row is header
                </strong>{" "}
                when the top row names columns so checkboxes show meaningful
                labels like <em>email</em> or <em>sku</em>.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Under{" "}
                <strong className="font-medium text-foreground">
                  Columns used for duplicate detection
                </strong>
                , check every field that must match for two rows to count as
                duplicates. Example: only <strong>email</strong> for contacts, or{" "}
                <strong>brand + part number</strong> for spare parts. Clear all
                boxes to dedupe when the{" "}
                <strong className="font-medium text-foreground">
                  entire row
                </strong>{" "}
                is identical.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Toggle{" "}
                <strong className="font-medium text-foreground">
                  Trim values when comparing
                </strong>{" "}
                to ignore leading and trailing spaces in keys—recommended for
                email and phone columns extracted with our{" "}
                <Link
                  href="/text/email-extractor"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  email extractor
                </Link>
                .
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Choose{" "}
                <strong className="font-medium text-foreground">
                  Keep first
                </strong>{" "}
                (default) or{" "}
                <strong className="font-medium text-foreground">
                  Keep last
                </strong>{" "}
                depending on which row should win when keys repeat.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">Copy CSV</strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">
                  Download .csv
                </strong>
                . For JSON pipelines afterward, use our{" "}
                <Link
                  href="/dev/csv-to-json"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  CSV to JSON converter
                </Link>{" "}
                or round-trip with{" "}
                <Link
                  href="/dev/json-to-csv"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  JSON to CSV
                </Link>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Column keys vs full-row deduplication
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="font-medium text-foreground">
              Selective column deduplication
            </strong>{" "}
            is ideal when the same person or product appears more than once but
            auxiliary fields differ—notes, import batch, or campaign tags. With
            every column checked, two rows must match across all those fields to
            count as duplicates (after optional trimming)—the usual approach for
            exact spreadsheet duplicates. Clear all column checkboxes to treat
            the entire padded row as one key, which matches only when the full
            line is the same. For plain text without CSV columns, our{" "}
            <Link
              href="/text/duplicate-line-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              duplicate line remover
            </Link>{" "}
            works on raw lines instead of parsed cells.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Delimiters, locales, and data hygiene
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Excel and Google Sheets often export{" "}
            <strong className="font-medium text-foreground">
              locale-specific CSV
            </strong>
            : semicolons in many European locales, commas in US-style files.
            Tab-separated values appear in analytics and scientific exports. Auto
            detection inspects the first lines to pick a stable separator. After
            deduping, you can normalize line endings or split fields further with
            our{" "}
            <Link
              href="/text/comma-separator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              comma separator tool
            </Link>{" "}
            when preparing data for other tools.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and performance
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Parsing and duplicate detection run locally in your browser—useful for
            GDPR-sensitive lists, unreleased catalog updates, and large
            spreadsheets you do not want to upload to third-party SaaS. Very large
            files may hit browser memory limits; split by segment or year if
            needed. Preview columns in your spreadsheet app first if you are
            unsure which fields form the natural duplicate key.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related file and data tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Browse the full{" "}
            <Link
              href="/#file-data-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              File &amp; data tools
            </Link>{" "}
            section on the home page, or open a nearby utility below.
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
            {csvDeduplicatorFaqItems.map((item) => (
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
