import type { Metadata } from "next";
import Link from "next/link";
import { OpenapiViewerTool } from "./openapi-viewer-tool";
import { openapiViewerFaqItems } from "@/lib/openapi-viewer-faq";
import { toolSections } from "@/lib/tool-catalog";

const apiToolbox =
  toolSections.find((s) => s.id === "api-developer-toolbox")?.tools ?? [];
const relatedTools = apiToolbox.filter(
  (t) => t.href !== "/api-toolbox/openapi-viewer",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/api-toolbox/openapi-viewer",
  },
};

export default function OpenapiViewerPage() {
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
              href="/#api-developer-toolbox"
              className="hover:text-foreground"
            >
              API developer toolbox
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span className="text-foreground">OpenAPI / Swagger viewer</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            OpenAPI and Swagger viewer — YAML, JSON, paths, and schemas
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              OpenAPI viewer online
            </strong>{" "}
            to paste{" "}
            <strong className="font-medium text-foreground">
              OpenAPI 3.x or Swagger 2.0
            </strong>{" "}
            in{" "}
            <strong className="font-medium text-foreground">YAML or JSON</strong>
            , then browse{" "}
            <strong className="font-medium text-foreground">
              REST paths and HTTP methods
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              parameters and request bodies
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">responses</strong>,
            and{" "}
            <strong className="font-medium text-foreground">
              reusable schemas
            </strong>{" "}
            (<code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              components.schemas
            </code>{" "}
            or{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              definitions
            </code>
            ). Everything runs{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            —helpful when you review an{" "}
            <strong className="font-medium text-foreground">
              API contract
            </strong>{" "}
            before implementation, compare versions with git, or explain an
            endpoint to a teammate without spinning up Swagger Editor. Pair
            exploration with our{" "}
            <Link
              href="/api-toolbox/http-request-builder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP request builder
            </Link>{" "}
            for live calls and the{" "}
            <Link
              href="/api-toolbox/api-response-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              API response formatter
            </Link>{" "}
            when you inspect JSON payloads next to the documented schema.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <OpenapiViewerTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why use an OpenAPI or Swagger viewer?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="font-medium text-foreground">OpenAPI</strong> is
            the industry-standard way to describe HTTP APIs: resources, methods,
            media types, security schemes, and examples in one machine-readable
            file. Teams publish{" "}
            <strong className="font-medium text-foreground">
              interactive API documentation
            </strong>{" "}
            from the same artifact they use for codegen and contract tests. A
            dedicated{" "}
            <strong className="font-medium text-foreground">
              Swagger viewer
            </strong>{" "}
            (Swagger was the earlier name; many people still search for it)
            helps you navigate that file when it is long, deeply nested, or split
            across repositories. This page focuses on{" "}
            <strong className="font-medium text-foreground">read-only</strong>{" "}
            structure: you see parameters, bodies, and response maps aligned with
            how backends and gateways actually behave.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Unlike hosted documentation that may lag a release branch, pasting a
            local spec here lets you verify the exact YAML or JSON your pipeline
            emits. If you still author data in JSON first, run it through our{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter
            </Link>{" "}
            to confirm brackets and commas; if your source lives in YAML, the{" "}
            <Link
              href="/dev/yaml-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              YAML to JSON converter
            </Link>{" "}
            and{" "}
            <Link
              href="/dev/json-to-yaml"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON to YAML converter
            </Link>{" "}
            help you move between formats before you paste into this viewer.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            OpenAPI 3.x vs Swagger 2.0 (quick guide)
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="font-medium text-foreground">Swagger 2.0</strong>{" "}
            uses a top-level{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              swagger: &quot;2.0&quot;
            </code>{" "}
            field and stores models under{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              definitions
            </code>
            .{" "}
            <strong className="font-medium text-foreground">OpenAPI 3.x</strong>{" "}
            introduces{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              openapi: 3.x.x
            </code>
            , first-class{" "}
            <strong className="font-medium text-foreground">requestBody</strong>{" "}
            objects, explicit{" "}
            <strong className="font-medium text-foreground">content</strong>{" "}
            maps per status code, and{" "}
            <strong className="font-medium text-foreground">components</strong>{" "}
            for schemas, responses, parameters, and security schemes. This tool
            recognizes both: operations list from{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              paths
            </code>
            , and the schema sidebar lists{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              components.schemas
            </code>{" "}
            or{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              definitions
            </code>{" "}
            depending on version.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this OpenAPI viewer (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste your specification or click{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                to see a minimal Pet-style API. Alternatively use{" "}
                <strong className="font-medium text-foreground">Upload</strong>{" "}
                to read a file from disk (common extensions: .yaml, .yml, .json).
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Parse spec
                </strong>
                . Fix any YAML or JSON syntax error the parser reports, then run
                again until the explorer appears.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read the{" "}
                <strong className="font-medium text-foreground">info</strong>{" "}
                block (title, version, description) and, for OpenAPI 3,{" "}
                <strong className="font-medium text-foreground">servers</strong>{" "}
                URLs.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Under{" "}
                <strong className="font-medium text-foreground">
                  Operations
                </strong>
                , pick a row: each line is an HTTP method plus path. The detail
                panel shows summary text,{" "}
                <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
                  operationId
                </code>
                , a parameters table, request body (OpenAPI 3), responses, and
                full JSON for copy-paste.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Open{" "}
                <strong className="font-medium text-foreground">Schemas</strong>{" "}
                to inspect shared models. Use{" "}
                <strong className="font-medium text-foreground">Copy</strong> on
                the input or{" "}
                <strong className="font-medium text-foreground">
                  Copy JSON
                </strong>{" "}
                in the panel when you need snippets for issues or Slack.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            API design, QA, and cross-team workflows
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Product and platform teams often circulate an{" "}
            <strong className="font-medium text-foreground">
              OpenAPI contract
            </strong>{" "}
            before coding stabilizes. Viewing the spec in a structured layout
            reduces back-and-forth about which query parameters are required and
            which status codes return bodies. When you debug live traffic, map
            status codes using our{" "}
            <Link
              href="/api-toolbox/http-status-codes"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP status code reference
            </Link>{" "}
            and confirm{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              Content-Type
            </code>{" "}
            choices with the{" "}
            <Link
              href="/api-toolbox/mime-type-lookup"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              MIME type lookup
            </Link>
            . Together, these utilities support a complete{" "}
            <strong className="font-medium text-foreground">
              API documentation
            </strong>{" "}
            and troubleshooting loop without leaving the site.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related API and developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Explore the full{" "}
            <Link
              href="/#api-developer-toolbox"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              API developer toolbox
            </Link>{" "}
            for builders, formatters, and references. Highlights:
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
            {openapiViewerFaqItems.map((item) => (
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
