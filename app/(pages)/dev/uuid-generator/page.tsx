import type { Metadata } from "next";
import Link from "next/link";
import { UuidGeneratorTool } from "./uuid-generator-tool";
import { uuidGeneratorFaqItems } from "@/lib/uuid-generator-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/uuid-generator");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/uuid-generator",
  },
};

export default function UuidGeneratorPage() {
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
            <span className="text-foreground">UUID generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            UUID generator — random UUID v4 for databases, APIs, and distributed
            systems
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online UUID generator
            </strong>{" "}
            to create{" "}
            <strong className="font-medium text-foreground">
              RFC 4122 version 4
            </strong>{" "}
            identifiers: statistically unique 128-bit values formatted as
            hyphenated hex strings. Generate a single{" "}
            <strong className="font-medium text-foreground">primary key</strong>{" "}
            or{" "}
            <strong className="font-medium text-foreground">
              bulk UUIDs
            </strong>{" "}
            for seed scripts, message queues, and{" "}
            <strong className="font-medium text-foreground">
              correlation IDs
            </strong>
            . Output stays{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>{" "}
            via{" "}
            <code className="rounded bg-zinc-200/80 px-1 py-0.5 font-mono text-sm dark:bg-zinc-800">
              crypto.randomUUID()
            </code>{" "}
            (or a secure fallback), so drafts never leave your machine. Switch
            between standard hyphens,{" "}
            <strong className="font-medium text-foreground">
              compact 32-character
            </strong>{" "}
            form, and{" "}
            <strong className="font-medium text-foreground">uppercase</strong>{" "}
            when your stack expects it.             Pair generation with our{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter &amp; validator
            </Link>{" "}
            for readable API payloads, or{" "}
            <Link
              href="/dev/csv-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV to JSON
            </Link>{" "}
            when you are shaping tabular seed files before import.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <UuidGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why teams use UUID v4 instead of auto-increment integers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            A{" "}
            <strong className="font-medium text-foreground">
              UUID (Universally Unique Identifier)
            </strong>{" "}
            lets clients propose IDs before insert, merge replicas without
            sequence clashes, and expose opaque values in URLs. Version 4 is
            the common choice when you want{" "}
            <strong className="font-medium text-foreground">
              random UUID generation
            </strong>{" "}
            without embedding MAC addresses (as in v1) or depending on a single
            database sequence. Trade-offs include slightly wider columns and
            index locality compared with time-ordered IDs—if you care about
            B-tree fragmentation, research{" "}
            <strong className="font-medium text-foreground">UUID v7</strong> or
            ULIDs for your datastore. This page focuses on v4 because ORMs,
            OpenAPI examples, and most tutorials assume it.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            When you validate that a column matches UUID syntax, exercise the
            pattern in our{" "}
            <Link
              href="/dev/regex-tester"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              regex tester &amp; debugger
            </Link>{" "}
            against sample rows.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this UUID generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Enter how many values you need (1–500). Typical uses: one ID
                for a manual SQL insert, ten for a unit test, or a hundred for a
                CSV import dry run.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Choose{" "}
                <strong className="font-medium text-foreground">
                  With hyphens
                </strong>{" "}
                for the canonical 8-4-4-4-12 shape (
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
                </code>
                ),{" "}
                <strong className="font-medium text-foreground">
                  Compact (no hyphens)
                </strong>{" "}
                for 32 hex characters in tight logs or legacy validators, or{" "}
                <strong className="font-medium text-foreground">
                  Uppercase
                </strong>{" "}
                when your organization standardizes on capital hex.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Generate new UUIDs
                </strong>{" "}
                to replace the entire list. Previous lines are discarded so you
                always know the batch is fresh.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">Copy all</strong>{" "}
                and paste into your editor, migration, or API client. For
                checksums on arbitrary strings (not random IDs), use the{" "}
                <Link
                  href="/dev/hash-generator"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  hash generator
                </Link>{" "}
                instead.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and search intents this tool covers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Engineers often search for a{" "}
            <strong className="font-medium text-foreground">
              GUID generator online
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              Postgres UUID generator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              REST API UUID example
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              bulk UUID generator for tests
            </strong>
            . This page answers those intents with a private, no sign-up
            workflow. If you need to embed binary data or build data URIs after
            assigning IDs, the{" "}
            <Link
              href="/dev/base64"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Base64 encoder &amp; decoder
            </Link>{" "}
            and{" "}
            <Link
              href="/dev/yaml-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              YAML to JSON
            </Link>{" "}
            converters help keep config and API examples consistent.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy, security, and when not to use UUID v4
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Random UUIDs are excellent for uniqueness and safe exposure in many
            APIs, but they are{" "}
            <strong className="font-medium text-foreground">
              not a password or session secret
            </strong>{" "}
            by themselves—use dedicated secret APIs and rotation policies for
            auth material. Because generation runs locally, you can draft
            migrations on VPN or air-gapped notes without uploading schemas. For
            readable migration SQL that references new UUID columns, pretty-print
            statements with the{" "}
            <Link
              href="/dev/sql-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SQL formatter
            </Link>{" "}
            before code review.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            UUID v4 in databases and ORMs (quick reference)
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            PostgreSQL offers{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              gen_random_uuid()
            </code>
            ; MySQL 8+ supports{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              UUID()
            </code>
            ; SQL Server uses{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              NEWID()
            </code>
            . In application code, prefer the platform UUID type over strings
            when available. The strings you copy here match what those functions
            produce in standard textual form, so you can paste into migration
            files or CSVs that your loader casts to UUID.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Explore the full{" "}
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
            {uuidGeneratorFaqItems.map((item) => (
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
