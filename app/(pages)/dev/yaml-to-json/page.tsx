import type { Metadata } from "next";
import Link from "next/link";
import { YamlToJsonTool } from "./yaml-to-json-tool";
import { yamlToJsonFaqItems } from "@/lib/yaml-to-json-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/yaml-to-json");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/yaml-to-json",
  },
};

export default function YamlToJsonPage() {
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
              Developer tools
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span className="text-foreground">YAML to JSON</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            YAML to JSON converter for configs, CI pipelines, and cloud
            templates
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              YAML to JSON converter
            </strong>{" "}
            when you need to inspect{" "}
            <strong className="font-medium text-foreground">
              Kubernetes manifests
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              GitHub Actions
            </strong>{" "}
            workflows,{" "}
            <strong className="font-medium text-foreground">
              Docker Compose
            </strong>{" "}
            fragments,{" "}
            <strong className="font-medium text-foreground">Ansible</strong>{" "}
            snippets, or{" "}
            <strong className="font-medium text-foreground">
              CloudFormation
            </strong>{" "}
            style templates as structured{" "}
            <strong className="font-medium text-foreground">JSON</strong>.
            Parsing runs in your browser with{" "}
            <strong className="font-medium text-foreground">js-yaml</strong>,
            so you get{" "}
            <strong className="font-medium text-foreground">
              clear syntax errors
            </strong>{" "}
            (line and column hints), support for{" "}
            <strong className="font-medium text-foreground">
              multi-document YAML
            </strong>{" "}
            streams, and one-click{" "}
            <strong className="font-medium text-foreground">copy</strong> or{" "}
            <strong className="font-medium text-foreground">download</strong>{" "}
            of the JSON result—ideal before dropping data into APIs, tests, or a{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter
            </Link>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <YamlToJsonTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            What is YAML to JSON conversion?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="font-medium text-foreground">YAML</strong>{" "}
            (YAML Ain&apos;t Markup Language) is a human-friendly data format
            common in{" "}
            <strong className="font-medium text-foreground">
              infrastructure as code
            </strong>{" "}
            and CI.{" "}
            <strong className="font-medium text-foreground">JSON</strong> is a
            stricter, widely supported interchange format used by REST APIs,
            browsers, and most programming languages. Converting YAML to JSON
            means: parse the YAML tree (mappings, sequences, scalars) and emit
            the equivalent JSON object or array so you can diff, log, or
            validate the same data in JSON-first tooling.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This page is built for{" "}
            <strong className="font-medium text-foreground">developers</strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">DevOps</strong>{" "}
            engineers who already have YAML on disk and need a fast, accurate
            preview without installing a CLI. When you need the reverse path,
            open our{" "}
            <Link
              href="/dev/json-to-yaml"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON to YAML converter
            </Link>{" "}
            to go back to indentation-first configs.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            When should you convert YAML to JSON?
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                You are debugging a{" "}
                <strong className="font-medium text-foreground">
                  pipeline
                </strong>{" "}
                and want to compare normalized structure against a JSON schema
                or OpenAPI fragment.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                You are writing{" "}
                <strong className="font-medium text-foreground">tests</strong>{" "}
                that assert on JSON but your fixture lives in YAML for
                readability.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                You need to paste configuration into a tool that only accepts{" "}
                <strong className="font-medium text-foreground">
                  JSON payloads
                </strong>{" "}
                (for example certain API consoles or observability exporters).
              </span>
            </li>
            <li>
              <span className="text-foreground">
                You are teaching teammates how{" "}
                <strong className="font-medium text-foreground">maps and lists</strong>{" "}
                in YAML correspond to objects and arrays in JSON.
              </span>
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How YAML and JSON differ (quick guide)
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            YAML uses indentation for nesting; JSON uses braces and brackets.
            YAML allows comments (
            <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              #
            </code>
            ); JSON does not—comments are stripped conceptually when you
            convert, because JSON has no comment syntax. YAML has explicit
            typing tags and features like anchors and aliases; those expand
            during parsing, and the JSON view shows the resolved data structure.
            Dates may appear as ISO strings in the JSON output because we
            serialize JavaScript{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              Date
            </code>{" "}
            values in a JSON-safe way.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this YAML to JSON tool (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste your YAML into the left panel, or click{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                to try a small workflow-style example.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Convert to JSON
                </strong>
                . If the parser reports an error, jump to the indicated line and
                column—most issues are indentation, tabs mixed with spaces, or
                a missing colon after a key.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use{" "}
                <strong className="font-medium text-foreground">Copy JSON</strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">
                  Download .json
                </strong>{" "}
                for your next step. If you need tabular export from JSON arrays,
                follow with the{" "}
                <Link
                  href="/dev/json-to-csv"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  JSON to CSV converter
                </Link>
                .
              </span>
            </li>
            <li>
              <span className="text-foreground">
                For large configs, validate readability using the{" "}
                <Link
                  href="/dev/json-formatter"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  JSON formatter and validator
                </Link>{" "}
                after conversion, or minify if you are embedding JSON inline.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Multi-document YAML and JSON output shape
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Files that contain several documents separated by{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              ---
            </code>{" "}
            are common in Kubernetes. This tool loads every document: if there is
            exactly one, the JSON panel shows a single object or array; if
            there are multiple, you get a JSON array containing each parsed
            document in order. That mirrors how many scripts consume streamed
            YAML.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and security notes
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Conversion is performed locally in the browser; your YAML is not
            sent to our servers for this feature. Still, follow your
            organization&apos;s rules: if a file contains secrets, tokens, or
            private endpoints, use an offline editor or approved internal
            tooling instead of any public website.
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
            section on the home page, or jump to a focused utility below.
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
            {yamlToJsonFaqItems.map((item) => (
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
