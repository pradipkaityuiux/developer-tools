import type { Metadata } from "next";
import Link from "next/link";
import { CsvToJsonTool } from "./csv-to-json-tool";
import { csvToJsonFaqItems } from "@/lib/csv-to-json-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/csv-to-json");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/csv-to-json",
  },
};

export default function CsvToJsonPage() {
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
              href="/#code-developer-tools"
              className="hover:text-foreground"
            >
              Code &amp; developer tools
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span className="text-foreground">CSV to JSON</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            CSV to JSON converter for APIs, configs, and data pipelines
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              CSV to JSON converter
            </strong>{" "}
            when you need to turn spreadsheet exports into{" "}
            <strong className="font-medium text-foreground">
              structured JSON
            </strong>{" "}
            for REST APIs, serverless functions, test fixtures, or ETL scripts.
            Paste{" "}
            <strong className="font-medium text-foreground">
              comma-separated
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              semicolon-separated
            </strong>{" "}
            (common in EU locales),{" "}
            <strong className="font-medium text-foreground">tab-separated</strong>{" "}
            (TSV), or{" "}
            <strong className="font-medium text-foreground">pipe-delimited</strong>{" "}
            text—or upload a file. The tool runs{" "}
            <strong className="font-medium text-foreground">
              entirely in your browser
            </strong>
            , supports{" "}
            <strong className="font-medium text-foreground">
              RFC-style quoted fields
            </strong>
            , and can treat the first row as{" "}
            <strong className="font-medium text-foreground">column headers</strong>{" "}
            so each record becomes a JSON object with meaningful keys.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <CsvToJsonTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why convert CSV to JSON?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">CSV</strong> is
            ideal for sharing tables between Excel, Google Sheets, and BI tools,
            but most web APIs and JavaScript apps expect{" "}
            <strong className="font-medium text-foreground">JSON documents</strong>
            : arrays of objects for tabular APIs, or nested structures when you
            compose configs. Converting at the boundary saves repetitive boilerplate
            in Node, Python, or browser code and lets you validate shape with your
            usual JSON tools. After conversion, polish payloads with our{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter &amp; validator
            </Link>{" "}
            before you commit them to repos or Postman collections.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this CSV to JSON tool (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  Paste or upload
                </strong>{" "}
                your delimited export. If cells contain the delimiter inside
                quotes (for example{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  &quot;Smith, Jane&quot;,42
                </code>
                ), keep those quotes—our parser treats them as a single field.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Set{" "}
                <strong className="font-medium text-foreground">Delimiter</strong>{" "}
                to{" "}
                <strong className="font-medium text-foreground">Auto</strong>{" "}
                unless you know the file uses a fixed separator; Auto inspects the
                first lines and picks comma, semicolon, tab, or pipe when column
                counts line up consistently.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Enable{" "}
                <strong className="font-medium text-foreground">
                  First row is header
                </strong>{" "}
                when the top row names your columns. Each following row becomes a
                JSON object like{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  {`{"name":"Ada","age":42}`}
                </code>
                . Turn on{" "}
                <strong className="font-medium text-foreground">
                  Smart typing
                </strong>{" "}
                so numeric and boolean-looking cells become real JSON numbers and
                booleans instead of strings—handy for API mocks and typed fixtures.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Choose output shape: default{" "}
                <strong className="font-medium text-foreground">
                  array of objects
                </strong>{" "}
                for typical REST bodies, or{" "}
                <strong className="font-medium text-foreground">
                  array of arrays
                </strong>{" "}
                when you need a literal matrix (for example feeding charting or
                math libraries). Toggle{" "}
                <strong className="font-medium text-foreground">
                  Pretty-print
                </strong>{" "}
                for diffs and docs, or off for compact single-line JSON.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">Copy JSON</strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">
                  Download .json
                </strong>{" "}
                and wire the result into your app. For the reverse workflow—JSON
                exports back to spreadsheets—use our{" "}
                <Link
                  href="/dev/json-to-csv"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  JSON to CSV converter
                </Link>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            CSV vs JSON for developers and SEO-related data work
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Content and growth teams often maintain{" "}
            <strong className="font-medium text-foreground">
              keyword lists
            </strong>
            , landing-page inventories, or redirect maps in spreadsheets. Engineers
            frequently need those same rows as JSON for static site generators,
            edge configs, or CMS bulk imports. Converting locally avoids emailing
            sensitive exports through third-party servers and keeps turnaround
            fast during migrations. When your source of truth is YAML instead, our{" "}
            <Link
              href="/dev/yaml-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              YAML to JSON converter
            </Link>{" "}
            complements this page for infra-style configs.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Delimiters, locales, and quoted fields
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Excel in some regions saves CSV with{" "}
            <strong className="font-medium text-foreground">semicolons</strong>{" "}
            because commas are decimal separators. Tab files (
            <strong className="font-medium text-foreground">TSV</strong>) appear
            in bioinformatics, logs, and ad-hoc data dumps. Whichever format you
            use, quoted fields can embed delimiters and line breaks; escaping a
            literal quote inside a field uses doubled double-quotes (
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              &quot;&quot;
            </code>
            ), matching common CSV conventions so columns stay aligned.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and performance
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Parsing happens in the browser: your CSV never has to leave your machine
            for this conversion step, which matters for PII, unreleased metrics, or
            large extracts. Very large pastes may feel slower simply because the
            editor renders more text—split files if you hit browser limits.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Explore the full{" "}
            <Link
              href="/#code-developer-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Code &amp; developer tools
            </Link>{" "}
            collection on the home page, or jump to a nearby utility below.
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
            {csvToJsonFaqItems.map((item) => (
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
