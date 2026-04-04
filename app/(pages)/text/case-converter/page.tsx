import type { Metadata } from "next";
import Link from "next/link";
import { CaseConverterTool } from "./case-converter-tool";
import { caseConverterFaqItems } from "@/lib/case-converter-faq";
import { toolSections } from "@/lib/tool-catalog";

const textTools =
  toolSections.find((s) => s.id === "text-string-tools")?.tools ?? [];
const relatedTools = textTools.filter((t) => t.href !== "/text/case-converter");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/text/case-converter",
  },
};

export default function CaseConverterPage() {
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
              href="/#text-string-tools"
              className="hover:text-foreground"
            >
              Text &amp; string tools
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span className="text-foreground">Text case converter</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Text case converter — uppercase, lowercase, Title Case, camelCase,
            snake_case, and kebab-case
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online text case converter
            </strong>{" "}
            to{" "}
            <strong className="font-medium text-foreground">
              change capitalization and separators
            </strong>{" "}
            for articles, UI labels, env vars, and API fields. Switch to{" "}
            <strong className="font-medium text-foreground">UPPERCASE</strong>{" "}
            for constants and banners,{" "}
            <strong className="font-medium text-foreground">lowercase</strong>{" "}
            for normalized comparisons,{" "}
            <strong className="font-medium text-foreground">Title Case</strong>{" "}
            for blog titles and slide headings,{" "}
            <strong className="font-medium text-foreground">camelCase</strong>{" "}
            for JavaScript properties,{" "}
            <strong className="font-medium text-foreground">snake_case</strong>{" "}
            for Python and SQL-style columns, and{" "}
            <strong className="font-medium text-foreground">kebab-case</strong>{" "}
            for URL segments and CSS-friendly tokens. Processing stays{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            . Upload a{" "}
            <strong className="font-medium text-foreground">.txt</strong> file
            or paste from Word, Notion, or your IDE, then copy the output with
            one click. When you need pattern-based edits across long documents,
            pair this page with our{" "}
            <Link
              href="/dev/regex-tester"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              regex tester &amp; debugger
            </Link>{" "}
            and the{" "}
            <Link
              href="/dev/html-entities"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML entity encoder &amp; decoder
            </Link>{" "}
            for markup-safe strings.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <CaseConverterTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why teams use a string case converter
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Copywriters and SEO editors often need a fast{" "}
            <strong className="font-medium text-foreground">
              title case generator
            </strong>{" "}
            or{" "}
            <strong className="font-medium text-foreground">
              uppercase converter
            </strong>{" "}
            to align H1s with brand style guides without wrestling with
            spreadsheet formulas. Engineers reuse the same phrases as{" "}
            <strong className="font-medium text-foreground">
              environment variable names
            </strong>
            , JSON keys, and route params—switching from human-readable sentences
            to{" "}
            <strong className="font-medium text-foreground">camelCase</strong>{" "}
            or{" "}
            <strong className="font-medium text-foreground">snake_case</strong>{" "}
            should take seconds, not manual retyping. This utility keeps drafts
            private because nothing leaves the tab.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            For URL slugs and shareable paths, hyphenated{" "}
            <strong className="font-medium text-foreground">kebab-case</strong>{" "}
            is a common convention; combine it with thoughtful keywords in your
            CMS. When you audit live pages, our{" "}
            <Link
              href="/website/canonical-tag-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              canonical tag checker
            </Link>{" "}
            and{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            help confirm that titles and URLs stay consistent after you rename
            segments.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this text case tool (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste any text into the input area or click{" "}
                <strong className="font-medium text-foreground">
                  Upload .txt
                </strong>{" "}
                to load UTF-8 plain text from disk. Use{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                to see mixed lines, underscores, and camelCase together.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Under <strong className="font-medium text-foreground">
                  Target case
                </strong>
                , pick{" "}
                <strong className="font-medium text-foreground">
                  UPPERCASE
                </strong>
                , <strong className="font-medium text-foreground">
                  lowercase
                </strong>
                , <strong className="font-medium text-foreground">
                  Title Case
                </strong>
                , <strong className="font-medium text-foreground">
                  camelCase
                </strong>
                , <strong className="font-medium text-foreground">
                  snake_case
                </strong>
                , or{" "}
                <strong className="font-medium text-foreground">
                  kebab-case
                </strong>
                . The output updates live as you type.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click the{" "}
                <strong className="font-medium text-foreground">copy</strong>{" "}
                control on the output panel to send the converted string to your
                clipboard. If the browser blocks clipboard access, select the
                output manually and copy with Ctrl+C (Windows) or Cmd+C (macOS).
              </span>
            </li>
            <li>
              <span className="text-foreground">
                For structured payloads, validate JSON separately with the{" "}
                <Link
                  href="/dev/json-formatter"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  JSON formatter &amp; validator
                </Link>{" "}
                after you adjust key casing so commas and quotes stay balanced.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and workflows this page supports
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            People search for an{" "}
            <strong className="font-medium text-foreground">
              online case changer
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              convert text to camelCase
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              snake case online
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              kebab case converter
            </strong>{" "}
            when they move between languages, APIs, and CMS fields. Editors
            matching <strong className="font-medium text-foreground">
              sentence case vs title case
            </strong>{" "}
            can paste a headline here, preview Title Case, and paste back.
            Developers normalizing{" "}
            <strong className="font-medium text-foreground">
              database column names
            </strong>{" "}
            can paste a mixed list and export snake_case in one pass.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Case styles at a glance
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  UPPERCASE / lowercase
                </strong>{" "}
                — transform every letter in the textarea; line breaks stay
                intact.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  Title Case
                </strong>{" "}
                — capitalize letter-led words for headings; useful for SEO
                titles when your guide calls for major words capitalized per
                word run.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  camelCase / snake_case / kebab-case
                </strong>{" "}
                — tokenize on spaces, hyphens, underscores, and camelCase
                boundaries, lowercase each token, then join with no separator,
                underscores, or hyphens respectively.
              </span>
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Limitations and safety tips
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This is a{" "}
            <strong className="font-medium text-foreground">
              text transform scratchpad
            </strong>
            , not a linter or refactor tool. Running Title Case or ALL CAPS on
            source code will alter strings and keywords. Identifier modes assume
            you are converting labels or short lists—not entire minified files.
            For percent-encoded strings, use the{" "}
            <Link
              href="/dev/url-encoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              URL encoder and decoder
            </Link>{" "}
            instead of guessing with raw case toggles.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related text &amp; string tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Browse the full{" "}
            <Link
              href="/#text-string-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Text &amp; String Tools
            </Link>{" "}
            section on the home page for the full catalog (word counter, diff
            checker, slug generator, line sorter, and more). Companion utilities
            you may use alongside case changes:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {relatedTools.slice(0, 14).map((tool) => (
              <li key={tool.href}>
                <span className="font-medium text-foreground">{tool.name}</span>
                {" — "}
                {tool.description}
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
            {caseConverterFaqItems.map((item) => (
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
