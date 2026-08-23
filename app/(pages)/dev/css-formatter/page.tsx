import type { Metadata } from "next";
import Link from "next/link";
import { CssFormatterTool } from "./css-formatter-tool";
import { cssFormatterFaqItems } from "@/lib/css-formatter-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/css-formatter");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/css-formatter",
  },
};

export default function CssFormatterPage() {
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
            <span className="text-foreground">CSS formatter &amp; minifier</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            CSS formatter and minifier — beautify stylesheets, compress for
            faster loads
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              CSS formatter online
            </strong>{" "}
            to{" "}
            <strong className="font-medium text-foreground">
              pretty-print messy rules
            </strong>
            , normalize braces around selectors and{" "}
            <strong className="font-medium text-foreground">
              @media queries
            </strong>
            , and keep comments when you choose beautify. Switch to{" "}
            <strong className="font-medium text-foreground">
              CSS minification
            </strong>{" "}
            to strip{" "}
            <strong className="font-medium text-foreground">
              block comments
            </strong>{" "}
            and collapse whitespace for smaller payloads—helpful for{" "}
            <strong className="font-medium text-foreground">
              critical CSS
            </strong>
            , embedded snippets, and quick before/after size checks. Processing
            stays{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            , so design tokens and unpublished themes stay private. Pair it with
            our{" "}
            <Link
              href="/dev/html-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML formatter &amp; minifier
            </Link>{" "}
            and{" "}
            <Link
              href="/dev/js-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JavaScript formatter &amp; minifier
            </Link>{" "}
            when you tune full static pages or component bundles.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <CssFormatterTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why format or minify CSS?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Stylesheets power layout, typography, motion, and responsive
            behavior. A dedicated{" "}
            <strong className="font-medium text-foreground">
              CSS beautifier
            </strong>{" "}
            makes reviews and diffs readable: each declaration block stands
            apart, media queries are easy to scan, and juniors spot missing
            braces faster. A{" "}
            <strong className="font-medium text-foreground">
              CSS compressor
            </strong>{" "}
            (minifier) trims bytes that humans do not need—comments,
            indentation, and redundant spaces—so first paints and inlined
            critical styles leaner. Neither step replaces a production pipeline
            with{" "}
            <strong className="font-medium text-foreground">autoprefixer</strong>{" "}
            or hashing, but both help day-to-day debugging and stakeholder
            demos.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            If you also validate structured data or marketing landing pages,
            cross-check rendered head tags with our{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            after you adjust layout CSS that affects above-the-fold content.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this CSS formatter (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste CSS into the textarea—full files, component-scoped
                blocks, or a copied rule from DevTools. Click{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                to see a compact card example with a media query.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">Format</strong>{" "}
                to expand{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  {"{ }"}
                </code>{" "}
                onto new lines, indent declarations, and keep{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  {"/* comments */"}
                </code>{" "}
                in place. Fix any reported brace or string errors until the
                status line turns green.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">Minify</strong>{" "}
                when you want a smaller artifact: comments are removed and
                whitespace collapses. Quoted strings and escaped characters are
                preserved so{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  url(&quot;...&quot;)
                </code>{" "}
                and{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  content: &quot;&quot;
                </code>{" "}
                stay intact.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use{" "}
                <strong className="font-medium text-foreground">Copy</strong>{" "}
                to send output to VS Code, Figma dev mode notes, Storybook, or a
                ticket. For data-heavy pages, keep SQL readable with the{" "}
                <Link
                  href="/dev/sql-formatter"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  SQL formatter
                </Link>{" "}
                alongside your UI work.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            CSS formatting keywords teams search for
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Designers and engineers often look for an{" "}
            <strong className="font-medium text-foreground">
              online CSS prettifier
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              stylesheet formatter
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              CSS optimizer for speed
            </strong>{" "}
            when they inherit minified vendor files or export CSS from a
            no-code tool. This page covers those workflows without sign-up.
            When you need JSON or API payloads instead of presentation rules,
            switch to the{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter &amp; validator
            </Link>{" "}
            or{" "}
            <Link
              href="/dev/yaml-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              YAML to JSON
            </Link>{" "}
            converters for config parity.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Minify vs format: performance and SEO context
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">
              Minified CSS
            </strong>{" "}
            reduces download time and parse cost slightly on very large sheets,
            especially when combined with gzip or Brotli at the CDN. It does
            not replace semantic HTML or good Core Web Vitals discipline, but
            it removes obvious waste.{" "}
            <strong className="font-medium text-foreground">
              Formatted CSS
            </strong>{" "}
            supports{" "}
            <strong className="font-medium text-foreground">code review</strong>{" "}
            and documentation: you can screenshot blocks for playbooks or teach
            cascade specificity without horizontal scrolling. For public pages,
            continue serving compressed, cached assets from your host while
            using this utility as a scratchpad.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Design tokens, variables, and modern syntax
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">
              Custom properties
            </strong>{" "}
            (
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              var(--token)
            </code>
            ) and nested rules (where supported) still rely on balanced braces
            and valid strings—exactly what this tool checks before it rewrites
            whitespace. If you generate class names programmatically, validate
            patterns with the{" "}
            <Link
              href="/dev/regex-tester"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              regex tester &amp; debugger
            </Link>{" "}
            before you bulk-replace selectors.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Limitations compared with PostCSS or Prettier
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            IDE formatters add opinionated rules: sort properties, wrap lines at
            column 80, or integrate with Stylelint. This page focuses on fast,
            private{" "}
            <strong className="font-medium text-foreground">
              paste-and-go CSS cleanup
            </strong>{" "}
            without configuration files. Use it for spikes, support tickets,
            and training; keep your repo’s canonical formatter for continuous
            integration. For markup-heavy templates, the{" "}
            <Link
              href="/dev/html-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML formatter
            </Link>{" "}
            remains the right place to preview rendered output.
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
            {cssFormatterFaqItems.map((item) => (
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
