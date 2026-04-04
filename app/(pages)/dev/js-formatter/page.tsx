import type { Metadata } from "next";
import Link from "next/link";
import { JsFormatterTool } from "./js-formatter-tool";
import { jsFormatterFaqItems } from "@/lib/js-formatter-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/js-formatter");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/js-formatter",
  },
};

export default function JsFormatterPage() {
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
            <span className="text-foreground">
              JavaScript formatter &amp; minifier
            </span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            JavaScript formatter and minifier — pretty-print JS/TS, compress for
            smaller bundles
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              JavaScript formatter online
            </strong>{" "}
            to{" "}
            <strong className="font-medium text-foreground">
              beautify minified or one-line code
            </strong>
            , read vendor bundles during incident response, and align snippets
            before code review. Switch to{" "}
            <strong className="font-medium text-foreground">
              JavaScript minification
            </strong>{" "}
            when you want a quick sense of how much smaller a function or
            module might look after{" "}
            <strong className="font-medium text-foreground">Terser</strong>
            -style compression—without uploading source to a third party.
            Formatting uses{" "}
            <strong className="font-medium text-foreground">Prettier</strong>{" "}
            semantics for{" "}
            <strong className="font-medium text-foreground">
              TypeScript and modern JS
            </strong>
            . Pair it with our{" "}
            <Link
              href="/dev/css-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSS formatter &amp; minifier
            </Link>{" "}
            and{" "}
            <Link
              href="/dev/html-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML formatter &amp; minifier
            </Link>{" "}
            when you tune full static pages or embedded widgets.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <JsFormatterTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why format or minify JavaScript?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Readable code speeds up debugging: a{" "}
            <strong className="font-medium text-foreground">
              JS beautifier
            </strong>{" "}
            reveals structure—blocks, async flows, and error paths—that
            disappear in production bundles. A{" "}
            <strong className="font-medium text-foreground">
              JavaScript compressor
            </strong>{" "}
            trims noise humans no longer need and can shrink gzip- or
            Brotli-compressed payloads slightly, which matters on large
            third-party scripts or legacy pages. Neither replaces your CI
            pipeline, but both help support, education, and quick experiments.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            When you work with APIs and config side by side, keep JSON legible
            with the{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter &amp; validator
            </Link>{" "}
            after you adjust fetch payloads in your scripts.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this JavaScript formatter (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste JavaScript or TypeScript into the textarea—functions,
                modules, or a chunk from a stack trace. Click{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                to try a compact async helper.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">Format</strong>{" "}
                to run Prettier: indentation, semicolons, and line breaks become
                consistent. Fix any parse error shown in red until the status
                line confirms success.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">Minify</strong>{" "}
                when you need smaller JavaScript. Terser removes comments,
                collapses whitespace, and may shorten local names. If you pasted
                raw TypeScript types, compile or strip them first—minify
                expects valid JS.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use{" "}
                <strong className="font-medium text-foreground">Copy</strong>{" "}
                to move output into VS Code, a gist, or a ticket. For SQL-heavy
                dashboards rendered by your app, also try the{" "}
                <Link
                  href="/dev/sql-formatter"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  SQL formatter
                </Link>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords teams search for
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Engineers often look for an{" "}
            <strong className="font-medium text-foreground">
              online JS prettifier
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              minify JavaScript for production
            </strong>
            , or a{" "}
            <strong className="font-medium text-foreground">
              TypeScript formatter in the browser
            </strong>{" "}
            when they cannot install packages on a locked-down machine. This
            page supports those workflows without an account. For YAML-heavy
            pipelines, cross-check config with{" "}
            <Link
              href="/dev/yaml-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              YAML to JSON
            </Link>{" "}
            after you edit deployment scripts.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Minify vs format: bundles, Core Web Vitals, and SEO
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="font-medium text-foreground">
              Minified JavaScript
            </strong>{" "}
            can reduce parse and download time on very large scripts, especially
            alongside CDN compression and HTTP caching. It does not fix slow
            frameworks or blocking tags by itself.{" "}
            <strong className="font-medium text-foreground">
              Formatted JavaScript
            </strong>{" "}
            improves human readability for docs, training, and security review.
            For public sites, keep serving hashed, cached assets from your host
            and use this tool as a scratchpad.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            If you inspect live pages, validate head markup with the{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            after you change scripts that touch SEO tags or structured data.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Security, privacy, and obfuscated code
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Processing stays in your browser, which helps when scripts contain
            secrets, unreleased features, or customer data in string literals.
            Be cautious pasting untrusted obfuscated code: formatting does not
            sandbox execution. When you analyze suspicious patterns, combine this
            with the{" "}
            <Link
              href="/dev/regex-tester"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              regex tester &amp; debugger
            </Link>{" "}
            for extraction experiments in isolation.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Limitations vs Prettier CLI and your bundler
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Your repository should still define Prettier, ESLint, and build
            targets so CI matches local editors. This page uses sensible
            defaults (two-space indent, trailing commas where safe) and does
            not read{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              .prettierrc
            </code>
            . Use it for ad-hoc snippets; use your toolchain for releases. For
            markup-heavy templates, the{" "}
            <Link
              href="/dev/xml-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              XML formatter
            </Link>{" "}
            may fit RSS, SVG, or SOAP payloads better than a JS-only view.
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
            {jsFormatterFaqItems.map((item) => (
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
