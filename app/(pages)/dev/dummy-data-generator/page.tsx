import type { Metadata } from "next";
import Link from "next/link";
import { DummyDataGeneratorTool } from "./dummy-data-generator-tool";
import { dummyDataGeneratorFaqItems } from "@/lib/dummy-data-generator-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter(
  (t) => t.href !== "/dev/dummy-data-generator",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/dummy-data-generator",
  },
};

export default function DummyDataGeneratorPage() {
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
            <span className="text-foreground">Dummy data generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Dummy data generator — fake names, emails, and addresses as JSON or
            CSV
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online dummy data generator
            </strong>{" "}
            to build{" "}
            <strong className="font-medium text-foreground">
              synthetic people records
            </strong>{" "}
            for Storybook, Cypress, Playwright, Postman collections, and SQL seed
            scripts. Toggle{" "}
            <strong className="font-medium text-foreground">
              first name, last name, email, phone, company, job title
            </strong>
            , and realistic{" "}
            <strong className="font-medium text-foreground">
              mailing-style addresses
            </strong>{" "}
            (street, city, US state abbreviation, ZIP, country). Need columns
            that match an existing spreadsheet? Paste names or{" "}
            <strong className="font-medium text-foreground">
              upload a header row
            </strong>{" "}
            — the tool infers sensible fake values from labels like “email” or
            “postal code.” Export{" "}
            <strong className="font-medium text-foreground">pretty JSON</strong>{" "}
            or{" "}
            <strong className="font-medium text-foreground">RFC-style CSV</strong>{" "}
            with escaped quotes, then copy from the preview or download a file.
            Generation uses{" "}
            <strong className="font-medium text-foreground">
              cryptographically strong randomness
            </strong>{" "}
            in your browser; nothing is sent to our servers. After export,
            validate structure with the{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter &amp; validator
            </Link>
            , pivot into spreadsheets via{" "}
            <Link
              href="/dev/json-to-csv"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON to CSV
            </Link>
            , or walk the inverse path with{" "}
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
        <DummyDataGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why developers still reach for a fake data generator in 2026
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Modern stacks ship faster when every layer has believable payloads:
            design systems need populated tables, integration tests need unique
            rows, and sales demos need charts that do not leak customer{" "}
            <strong className="font-medium text-foreground">PII</strong>. A
            lightweight{" "}
            <strong className="font-medium text-foreground">
              test data generator
            </strong>{" "}
            keeps product, QA, and engineering aligned on shape and edge cases
            without standing up a full staging clone on day one. This page
            focuses on{" "}
            <strong className="font-medium text-foreground">
              developer-grade fixtures
            </strong>
            —not regulated synthetic populations for ML training—so you can
            iterate quickly and still follow your company&apos;s data-handling
            policy.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Compared with hard-coded lorem paragraphs, structured{" "}
            <strong className="font-medium text-foreground">
              JSON dummy data
            </strong>{" "}
            mirrors real API contracts: typed strings in predictable keys,
            variety across rows, and easy diffing when schemas evolve. Pair
            generated IDs with our{" "}
            <Link
              href="/dev/uuid-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              UUID generator
            </Link>{" "}
            when you need opaque primary keys in the same fixture bundle.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this dummy data generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Select the{" "}
                <strong className="font-medium text-foreground">
                  standard fields
                </strong>{" "}
                your UI or API expects. The defaults cover a typical contact card
                (name, email, address). Add phone, company, or job title when
                you are mocking CRM or HR screens.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Optionally list{" "}
                <strong className="font-medium text-foreground">
                  custom column names
                </strong>{" "}
                — one per line — or click{" "}
                <strong className="font-medium text-foreground">
                  Upload columns
                </strong>{" "}
                to import a CSV header row or a plain list. Headers such as
                “customer_email” or “PostalCode” steer the heuristic filler.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Set the{" "}
                <strong className="font-medium text-foreground">row count</strong>
                , choose{" "}
                <strong className="font-medium text-foreground">JSON</strong> or{" "}
                <strong className="font-medium text-foreground">CSV</strong>, and
                enable pretty-printing when you want readable JSON in Git. Click{" "}
                <strong className="font-medium text-foreground">
                  Regenerate data
                </strong>{" "}
                whenever you need a fresh random batch.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use the floating{" "}
                <strong className="font-medium text-foreground">copy</strong>{" "}
                control on the output pane or{" "}
                <strong className="font-medium text-foreground">Download</strong>{" "}
                to save <code className="font-mono text-sm">dummy-data.json</code>{" "}
                or <code className="font-mono text-sm">dummy-data.csv</code>. For
                checksums on frozen fixtures, run strings through the{" "}
                <Link
                  href="/dev/hash-generator"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  hash generator
                </Link>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and search intents this page covers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Teams search for a{" "}
            <strong className="font-medium text-foreground">
              fake name generator for testing
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              sample CSV data
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              mock REST payload
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              address generator for forms
            </strong>
            . This tool answers those intents with explicit export formats and
            privacy-preserving local generation. If your pipeline already speaks
            YAML, convert samples using{" "}
            <Link
              href="/dev/yaml-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              YAML to JSON
            </Link>{" "}
            after you copy JSON output.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy, compliance, and realistic expectations
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Because randomness and formatting happen in the browser, you can
            draft datasets on a VPN or offline tab without uploading proprietary
            schemas. Still, synthetic rows can occasionally resemble real
            people—treat exports as{" "}
            <strong className="font-medium text-foreground">
              non-production artifacts
            </strong>{" "}
            and scrub before public screenshots. Emails intentionally use
            non-deliverable domains suitable for documentation; never spam
            arbitrary addresses. When you validate live endpoints, switch to your
            API sandbox and our{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>{" "}
            or{" "}
            <Link
              href="/website/response-code-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              response code checker
            </Link>{" "}
            to confirm environment behavior—not this generator—for network truth.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Browse the full{" "}
            <Link
              href="/#code-developer-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              code and developer tools
            </Link>{" "}
            catalog. Highlights:
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
            {dummyDataGeneratorFaqItems.map((item) => (
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
