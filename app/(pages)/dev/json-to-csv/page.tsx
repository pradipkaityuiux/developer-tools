import type { Metadata } from "next";
import Link from "next/link";
import { jsonToCsvFaqItems } from "@/lib/json-to-csv-faq";
import { toolSections } from "@/lib/tool-catalog";
import { JsonToCsvTool } from "./json-to-csv-tool";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/json-to-csv");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/json-to-csv",
  },
};

export default function JsonToCsvPage() {
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
              Code and developer tools
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span className="text-foreground">JSON to CSV</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            JSON to CSV converter: automatic columns for spreadsheets and BI
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              JSON to CSV converter
            </strong>{" "}
            when you need a fast, repeatable way to turn{" "}
            <strong className="font-medium text-foreground">
              JSON arrays of objects
            </strong>{" "}
            into a flat file for{" "}
            <strong className="font-medium text-foreground">
              Excel, Google Sheets, and BI tools
            </strong>
            . Headers are inferred automatically from every key we see across
            rows, values are{" "}
            <strong className="font-medium text-foreground">
              RFC 4180 escaped
            </strong>
            , and you can choose a{" "}
            <strong className="font-medium text-foreground">
              comma or semicolon delimiter
            </strong>{" "}
            plus an optional{" "}
            <strong className="font-medium text-foreground">
              UTF-8 BOM for Excel
            </strong>
            . Everything runs in your browser: ideal for API samples, staging
            exports, and ad-hoc reporting without installing desktop software.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <JsonToCsvTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why convert JSON to CSV?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="font-medium text-foreground">JSON</strong> is the
            lingua franca of modern APIs and document stores: nested, flexible,
            and easy for programs to consume.{" "}
            <strong className="font-medium text-foreground">CSV</strong> remains
            the default interchange format for business users, finance models,
            and quick visual analysis. A{" "}
            <strong className="font-medium text-foreground">
              JSON to CSV conversion
            </strong>{" "}
            bridges those worlds so engineering can keep emitting structured
            payloads while marketing, ops, and analysts open the same data in a
            spreadsheet. When you later need the opposite direction, our{" "}
            <Link
              href="/dev/csv-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV to JSON converter
            </Link>{" "}
            parses delimited text back into JSON with header-aware structure.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            JSON shapes this tool handles
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            The most common pattern is a top-level{" "}
            <strong className="font-medium text-foreground">
              array of objects
            </strong>
            , where each object is one row. If your API wraps the array (for
            example{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              {`{ "data": [ ... ] }`}
            </code>
            , or properties named{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              items
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              results
            </code>
            , and similar), we unwrap it automatically. Primitive arrays become
            a single{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              value
            </code>{" "}
            column. Nested objects and arrays stringify into the cell as JSON so
            you never silently drop nested data; flatten further in your sheet
            or pipeline if you need one column per leaf field.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this JSON to CSV converter (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  Validate or format JSON
                </strong>{" "}
                if the payload is messy. When you need pretty-printing and tree
                view, use the{" "}
                <Link
                  href="/dev/json-formatter"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  JSON formatter and validator
                </Link>{" "}
                first, then paste the cleaned array here.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  Paste JSON
                </strong>{" "}
                into the text area, or click{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                to see mixed types, nested fields, and tags in action.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Choose{" "}
                <strong className="font-medium text-foreground">
                  delimiter
                </strong>{" "}
                (comma for most US pipelines; semicolon when Excel in your
                locale expects list separators other than commas) and decide
                whether to include a{" "}
                <strong className="font-medium text-foreground">
                  UTF-8 BOM
                </strong>{" "}
                for Excel on Windows.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Convert to CSV
                </strong>
                , review the preview, then{" "}
                <strong className="font-medium text-foreground">
                  Copy CSV
                </strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">
                  Download .csv
                </strong>
                . Import into Sheets, Power BI, Tableau, or your ETL tool.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Automatic column detection and ordering
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Headers are built by scanning objects in array order. The first time
            a key appears, it claims its column position; new keys discovered on
            later rows extend the table to the right. Empty cells mean that row
            simply did not include that property, which is standard for sparse
            API responses. This approach matches how many teams expect a{" "}
            <strong className="font-medium text-foreground">
              JSON export to CSV
            </strong>{" "}
            to behave without hand-maintaining schemas.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Escaping, delimiters, and Excel compatibility
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Fields that contain quotes, line breaks, or the active delimiter are
            wrapped in double quotes, with internal quotes doubled, matching
            common{" "}
            <strong className="font-medium text-foreground">RFC 4180</strong>{" "}
            expectations. The optional BOM prefixes the file so Excel often
            interprets the encoding as UTF-8, which matters for international
            product names and currency symbols. If you are automating imports in
            code, you may prefer BOM off and explicit UTF-8 handling in your
            parser instead.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            When to use YAML or keep JSON
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            CSV is not a substitute for hierarchical config. If you are editing
            Kubernetes or CI configs, a dedicated{" "}
            <Link
              href="/dev/json-to-yaml"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON to YAML converter
            </Link>{" "}
            or{" "}
            <Link
              href="/dev/yaml-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              YAML to JSON converter
            </Link>{" "}
            preserves structure more readably than flattening to columns. Use
            JSON to CSV when the destination is truly tabular: leads, orders,
            events, or feature rows.
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
            catalog on the home page, or jump to a focused utility below.
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
            {jsonToCsvFaqItems.map((item) => (
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
