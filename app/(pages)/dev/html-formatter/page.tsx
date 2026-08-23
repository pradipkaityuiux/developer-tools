import type { Metadata } from "next";
import Link from "next/link";
import { HtmlFormatterTool } from "./html-formatter-tool";
import { htmlFormatterFaqItems } from "@/lib/html-formatter-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/html-formatter");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/html-formatter",
  },
};

export default function HtmlFormatterPage() {
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
            <span className="text-foreground">HTML formatter &amp; minifier</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            HTML formatter &amp; minifier — beautify markup, shrink file size,
            preview in the browser
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              HTML beautifier
            </strong>{" "}
            to pretty-print templates, landing pages, and email markup with
            clear indentation, or switch to{" "}
            <strong className="font-medium text-foreground">
              HTML minification
            </strong>{" "}
            to strip comments and collapse whitespace for smaller payloads.
            Everything runs{" "}
            <strong className="font-medium text-foreground">
              locally in your browser
            </strong>
            , and a{" "}
            <strong className="font-medium text-foreground">
              sandboxed preview
            </strong>{" "}
            helps you compare raw{" "}
            <strong className="font-medium text-foreground">HTML markup</strong>{" "}
            with how it renders—ideal for quick cleanup before CMS paste,
            static site tweaks, and hand-authored{" "}
            <strong className="font-medium text-foreground">semantic HTML</strong>{" "}
            reviews.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <HtmlFormatterTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why use an online HTML formatter?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Messy markup slows down reviews: inconsistent indentation hides
            nesting mistakes, duplicate wrappers, and forgotten closing tags.
            An{" "}
            <strong className="font-medium text-foreground">
              HTML formatter online
            </strong>{" "}
            gives you a predictable layout so diffs in Git stay readable and
            juniors can follow structure faster. Pair formatting with our{" "}
            <Link
              href="/dev/xml-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              XML formatter &amp; validator
            </Link>{" "}
            when you work with XHTML-style documents or feeds that still expect
            well-formed trees.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            When you ship pages rather than snippets, a companion{" "}
            <Link
              href="/dev/css-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSS formatter &amp; minifier
            </Link>{" "}
            and{" "}
            <Link
              href="/dev/js-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JavaScript formatter &amp; minifier
            </Link>{" "}
            keeps assets consistent: readable in source control, compact over
            the wire after you run your usual build pipeline.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            HTML minifier vs beautifier — when to use each
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">Beautify</strong>{" "}
            (pretty-print) is for humans: code review, teaching, and debugging
            nested components.{" "}
            <strong className="font-medium text-foreground">Minify</strong>{" "}
            targets bytes: fewer line breaks and spaces can shrink HTML
            fragments you embed in APIs, emails, or cached partials. This tool
            avoids aggressive semantic changes—no automatic class renaming—so
            you stay in control. For structured data you author by hand, also
            keep our{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter &amp; validator
            </Link>{" "}
            nearby when you mix JSON-LD with your page head.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this HTML formatter (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste your source into{" "}
                <strong className="font-medium text-foreground">
                  Input HTML
                </strong>
                . You can drop a full document that starts with{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  &lt;!DOCTYPE html&gt;
                </code>{" "}
                or a fragment such as a hero section or table row.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Choose an{" "}
                <strong className="font-medium text-foreground">indent</strong>{" "}
                width (two spaces, four spaces, or tab) for beautify runs.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">Beautify</strong>{" "}
                for indented output, or{" "}
                <strong className="font-medium text-foreground">Minify</strong>{" "}
                to remove HTML comments and extra whitespace outside preserved
                tags like{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  pre
                </code>
                ,{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  script
                </code>
                ,{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  style
                </code>
                , and{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  textarea
                </code>
                .
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use{" "}
                <strong className="font-medium text-foreground">
                  Copy output
                </strong>{" "}
                to grab the transformed markup. Enable{" "}
                <strong className="font-medium text-foreground">
                  Show preview
                </strong>{" "}
                to open a sandboxed iframe that renders the latest result (or
                your input before the first run) without executing scripts.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            HTML formatting for SEO-friendly templates
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Search engines care about discoverable content, fast loads, and
            valid signals—not tab width—but clean markup makes it easier to
            audit heading hierarchy, canonical links, and structured data blocks
            before publish. After you tidy HTML, validate live URLs with our{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            and{" "}
            <Link
              href="/website/canonical-tag-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              canonical tag checker
            </Link>{" "}
            so title, description, and duplication controls still match what you
            intended.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Converting between HTML and Markdown
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Documentation and README files often live in Markdown while sites
            consume HTML. When you need to migrate prose, use the{" "}
            <Link
              href="/dev/html-to-markdown"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML to Markdown converter
            </Link>{" "}
            for cleanup, and the{" "}
            <Link
              href="/dev/markdown-to-html"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Markdown to HTML converter
            </Link>{" "}
            when authors write in Markdown but your pipeline expects markup.
            Run this formatter afterward if you want consistent indentation in
            stored templates.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Limitations to keep in mind
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browsers follow the HTML parsing algorithm: they repair broken tags
            and may reorder elements compared with your original bytes. That is
            expected and matches what visitors experience. The preview iframe
            uses an empty sandbox attribute so JavaScript inside your snippet
            does not execute—enable scripts only in your own environment when
            you trust the source.
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
              code &amp; developer tools
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
            {htmlFormatterFaqItems.map((item) => (
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
