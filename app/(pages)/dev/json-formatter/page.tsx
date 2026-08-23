import type { Metadata } from "next";
import Link from "next/link";
import { JsonFormatterTool } from "./json-formatter-tool";
import { jsonFormatterFaqItems } from "@/lib/json-formatter-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/json-formatter");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/json-formatter",
  },
};

export default function JsonFormatterPage() {
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
            <span className="text-foreground">JSON formatter &amp; validator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            JSON formatter and validator — pretty-print, minify, and tree view
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              JSON formatter online
            </strong>{" "}
            to{" "}
            <strong className="font-medium text-foreground">
              validate JSON syntax
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              beautify nested payloads
            </strong>{" "}
            with consistent indentation,{" "}
            <strong className="font-medium text-foreground">
              minify JSON
            </strong>{" "}
            for compact requests, and browse arrays and objects in a{" "}
            <strong className="font-medium text-foreground">
              collapsible JSON tree
            </strong>
            . Processing stays in your browser—ideal when you debug REST and
            GraphQL responses, review{" "}
            <strong className="font-medium text-foreground">
              JSON Schema
            </strong>{" "}
            examples, or clean up config before CI. Pair it with our{" "}
            <Link
              href="/dev/json-to-csv"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON to CSV
            </Link>{" "}
            and{" "}
            <Link
              href="/dev/yaml-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              YAML to JSON
            </Link>{" "}
            converters when you move data between spreadsheets, Kubernetes
            manifests, and application code.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <JsonFormatterTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why format and validate JSON?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">JSON</strong>{" "}
            (JavaScript Object Notation) is the lingua franca of modern APIs,
            browser storage, and infrastructure-as-code snippets. A dedicated{" "}
            <strong className="font-medium text-foreground">
              JSON beautifier
            </strong>{" "}
            turns dense single-line responses into readable blocks so you can
            spot missing fields, wrong types, and duplicated keys before they
            reach production. A{" "}
            <strong className="font-medium text-foreground">
              JSON syntax validator
            </strong>{" "}
            catches mistakes early: stray commas, single-quoted strings,
            unescaped control characters, and truncated downloads all surface as
            clear parse errors with position hints.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Unlike desktop editors that may upload buffers to the cloud, this
            page keeps{" "}
            <strong className="font-medium text-foreground">
              client-side JSON formatting
            </strong>{" "}
            entirely in your tab—useful for regulated data, signed tokens you
            still need to redact, and quick checks on laptops without installing
            extensions. When you need to decode signed payloads without
            verifying signatures, follow with the{" "}
            <Link
              href="/dev/jwt-decoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JWT decoder
            </Link>
            ; when your pipeline mixes XML, open the{" "}
            <Link
              href="/dev/xml-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              XML formatter and validator
            </Link>{" "}
            for parallel structure reviews.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this JSON formatter (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste a single JSON value into the textarea—usually an{" "}
                <strong className="font-medium text-foreground">object</strong>{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  {"{ }"}
                </code>{" "}
                or an{" "}
                <strong className="font-medium text-foreground">array</strong>{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  [ ]
                </code>
                . Click{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                if you want a starter document.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Press{" "}
                <strong className="font-medium text-foreground">
                  Format &amp; validate
                </strong>{" "}
                to run{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  JSON.parse
                </code>{" "}
                and rewrite the editor with{" "}
                <strong className="font-medium text-foreground">
                  two-space indentation
                </strong>
                . A green status means the document is valid; red means you
                should fix the reported location.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Choose{" "}
                <strong className="font-medium text-foreground">Minify</strong>{" "}
                when you need a transport-friendly line for logs, queues, or
                HTTP bodies. Minification removes whitespace only; it does not
                change logical values.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Expand the{" "}
                <strong className="font-medium text-foreground">
                  collapsible tree
                </strong>{" "}
                to navigate deep graphs without scrolling enormous lines. Use{" "}
                <strong className="font-medium text-foreground">
                  Expand all
                </strong>{" "}
                for a full outline, or{" "}
                <strong className="font-medium text-foreground">
                  Collapse to root
                </strong>{" "}
                to reset the view.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">Copy</strong>{" "}
                grabs the current editor text—after formatting or minifying—so
                you can paste into curl, Postman, or your IDE. For tabular
                exports, convert with{" "}
                <Link
                  href="/dev/json-to-csv"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  JSON to CSV
                </Link>
                ; for readable config, try{" "}
                <Link
                  href="/dev/json-to-yaml"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  JSON to YAML
                </Link>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            JSON formatting rules and common pitfalls
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Valid JSON requires{" "}
            <strong className="font-medium text-foreground">
              double-quoted strings
            </strong>{" "}
            for both keys and text values. Numbers may be integer or floating
            point; scientific notation is allowed. Literal tokens are{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              true
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              false
            </code>
            , and{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              null
            </code>{" "}
            (lowercase).{" "}
            <strong className="font-medium text-foreground">
              Trailing commas
            </strong>{" "}
            are a frequent copy-paste error from JavaScript or TypeScript
            sources—remove them to pass strict parsers. Comments are not
            permitted; strip{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              {"//"}
            </code>{" "}
            and{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              {"/* */"}
            </code>{" "}
            blocks before validating. If you ingest CSV-shaped data, normalize
            through{" "}
            <Link
              href="/dev/csv-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV to JSON
            </Link>{" "}
            first so headers become keys automatically.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Pretty-print vs minify: when to use each
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">
              Pretty-printed JSON
            </strong>{" "}
            improves code review, documentation screenshots, and teaching
            materials. It also makes{" "}
            <strong className="font-medium text-foreground">git diffs</strong>{" "}
            readable when each property sits on its own line.{" "}
            <strong className="font-medium text-foreground">Minified JSON</strong>{" "}
            reduces bytes for high-volume topics such as mobile payloads,
            WebSocket frames, and cached blobs—pair minification with gzip or
            Brotli at the transport layer for best results. This tool lets you
            switch views without losing the parsed structure.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            JSON in APIs, configs, and SEO-adjacent workflows
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Product and marketing engineers often touch JSON when wiring{" "}
            <strong className="font-medium text-foreground">
              analytics payloads
            </strong>
            , tag managers, and headless CMS webhooks. Validating those payloads
            here reduces silent failures in staging. SEO specialists working on{" "}
            <strong className="font-medium text-foreground">JSON-LD</strong>{" "}
            structured data can paste snippets to confirm braces balance before
            deployment; combine with live URL checks using our{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            or{" "}
            <Link
              href="/seo/schema-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              schema markup generator
            </Link>{" "}
            when you author rich-result-ready graphs.
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
              code and developer tools
            </Link>{" "}
            catalog for formatters, encoders, and converters. Highlights:
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
            {jsonFormatterFaqItems.map((item) => (
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
