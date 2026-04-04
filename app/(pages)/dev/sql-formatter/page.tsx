import type { Metadata } from "next";
import Link from "next/link";
import { SqlFormatterTool } from "./sql-formatter-tool";
import { sqlFormatterFaqItems } from "@/lib/sql-formatter-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/sql-formatter");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/sql-formatter",
  },
};

export default function SqlFormatterPage() {
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
            <span className="text-foreground">SQL formatter</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            SQL formatter — pretty-print queries with dialect-aware indentation
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online SQL formatter
            </strong>{" "}
            to turn dense one-line statements into readable{" "}
            <strong className="font-medium text-foreground">
              indented SQL
            </strong>
            . Choose{" "}
            <strong className="font-medium text-foreground">
              PostgreSQL
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">MySQL</strong>,{" "}
            <strong className="font-medium text-foreground">SQLite</strong>,{" "}
            <strong className="font-medium text-foreground">
              Transact-SQL
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">BigQuery</strong>,{" "}
            <strong className="font-medium text-foreground">Snowflake</strong>,
            and other dialects, then apply{" "}
            <strong className="font-medium text-foreground">
              uppercase or lowercase keywords
            </strong>{" "}
            for consistent{" "}
            <strong className="font-medium text-foreground">
              SQL code review
            </strong>
            , documentation, and handoffs. Everything runs in your browser—no
            query upload—so it pairs well with other{" "}
            <Link
              href="/#code-developer-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              developer text tools
            </Link>{" "}
            on this site.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <SqlFormatterTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why use a SQL pretty printer?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Readable{" "}
            <strong className="font-medium text-foreground">
              SQL formatting
            </strong>{" "}
            shortens pull-request cycles: reviewers spot missing JOIN
            conditions, accidental cartesian products, and suspicious WHERE
            clauses faster when CTEs and subqueries align visually. Product and
            analytics teammates also benefit when you paste a{" "}
            <strong className="font-medium text-foreground">
              beautified SQL
            </strong>{" "}
            snippet into Notion, Confluence, or Slack instead of a horizontal
            scroll of commas.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This page is optimized for ad-hoc use: no IDE extension install, no
            repo checkout. When you are already working with structured data in
            JSON or YAML, our{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter
            </Link>
            ,{" "}
            <Link
              href="/dev/json-to-yaml"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON to YAML
            </Link>
            , and{" "}
            <Link
              href="/dev/xml-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              XML formatter
            </Link>{" "}
            cover the same &quot;make it legible before review&quot; workflow
            for APIs and configs.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this SQL formatter (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste your query into the input panel—anything from a quick{" "}
                <strong className="font-medium text-foreground">SELECT</strong>{" "}
                to a multi-CTE report. Strip log prefixes if the first line is
                not valid SQL.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Choose the{" "}
                <strong className="font-medium text-foreground">
                  SQL dialect
                </strong>{" "}
                that matches your engine so string literals, comments, and
                vendor keywords tokenize correctly.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Set{" "}
                <strong className="font-medium text-foreground">
                  keyword case
                </strong>{" "}
                (upper, lower, or preserve) and{" "}
                <strong className="font-medium text-foreground">
                  indentation
                </strong>{" "}
                (spaces or tabs) to mirror your team style guide.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Format SQL
                </strong>
                , review the output, then{" "}
                <strong className="font-medium text-foreground">
                  Copy output
                </strong>{" "}
                into your ticket or editor. For pattern-heavy string work
                alongside SQL, the{" "}
                <Link
                  href="/dev/regex-tester"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  regex tester
                </Link>{" "}
                can help validate extract and replace logic separately.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Dialect-aware formatting vs generic pretty print
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Generic text wrap breaks as soon as a dialect uses unusual quoting
            rules—think PostgreSQL dollar-quoted strings, SQL Server bracketed
            identifiers, or BigQuery backticks. A{" "}
            <strong className="font-medium text-foreground">
              dialect-aware SQL formatter
            </strong>{" "}
            understands those tokens and keeps them intact while rearranging
            whitespace around clauses. If output looks wrong, switch dialects
            before assuming your query is invalid.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            SQL style guides: keywords, identifiers, and joins
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Many teams standardize on{" "}
            <strong className="font-medium text-foreground">
              uppercase SQL keywords
            </strong>{" "}
            and lowercase or snake_case column names. Consistent indentation for{" "}
            <strong className="font-medium text-foreground">
              INNER JOIN
            </strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">LEFT JOIN</strong>{" "}
            chains makes it obvious which table supplies filter predicates in the{" "}
            <strong className="font-medium text-foreground">WHERE</strong>{" "}
            clause versus join keys in the{" "}
            <strong className="font-medium text-foreground">ON</strong> clause.
            This tool automates the tedious part so you can focus on logic.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Security and privacy when formatting SQL
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Even though formatting is{" "}
            <strong className="font-medium text-foreground">client-side</strong>,
            pasted SQL may still contain PII in literals or comments. Treat the
            textarea like any other clipboard surface: redact before sharing
            screenshots. For token inspection (not SQL), the{" "}
            <Link
              href="/dev/jwt-decoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JWT decoder
            </Link>{" "}
            and{" "}
            <Link
              href="/dev/base64"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Base64 encoder
            </Link>{" "}
            are separate utilities with the same local-only philosophy.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related free developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Explore the full{" "}
            <Link
              href="/#code-developer-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              code and developer tools
            </Link>{" "}
            collection for formatters, encoders, and converters. Highlights
            below complement this SQL formatter for everyday engineering work.
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
            {sqlFormatterFaqItems.map((item) => (
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
