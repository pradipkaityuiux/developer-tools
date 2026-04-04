import type { Metadata } from "next";
import Link from "next/link";
import { HtmlEntitiesTool } from "./html-entities-tool";
import { htmlEntitiesFaqItems } from "@/lib/html-entities-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/html-entities");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/html-entities",
  },
};

export default function HtmlEntitiesPage() {
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
            <span className="text-foreground">HTML entity encoder &amp; decoder</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            HTML entity encoder and decoder — escape special characters for safe HTML and CMS
            workflows
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">HTML entity encoder online</strong> to
            turn raw text into{" "}
            <strong className="font-medium text-foreground">
              HTML-safe character references
            </strong>
            : standard names for{" "}
            <strong className="font-medium text-foreground">ampersands</strong>,{" "}
            <strong className="font-medium text-foreground">angle brackets</strong>,{" "}
            <strong className="font-medium text-foreground">double quotes</strong>, and{" "}
            <strong className="font-medium text-foreground">apostrophes</strong>, plus optional{" "}
            <strong className="font-medium text-foreground">decimal numeric entities</strong> for
            non-ASCII letters and symbols. Switch to{" "}
            <strong className="font-medium text-foreground">decode</strong> to reverse named and
            numeric references back into readable Unicode. Processing stays in your browser—ideal
            for email templates, static site generators, WordPress or headless CMS fields, and
            quick QA before you paste into a rich editor. Pair encoding with the{" "}
            <Link
              href="/dev/html-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML formatter
            </Link>{" "}
            for readable markup, the{" "}
            <Link
              href="/dev/url-encoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              URL encoder
            </Link>{" "}
            when hrefs need percent-encoding instead of entities, and the{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            to compare what ships in production against your escaped snippets.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <HtmlEntitiesTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why HTML entity encoding matters for developers, content teams, and SEO
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Browsers treat angle brackets as tag delimiters. A literal less-than in copy must become
            an entity inside HTML text nodes and most attribute values so it renders as text instead
            of breaking the DOM tree. Unescaped ampersands can prematurely start an entity reference
            and corrupt adjacent attributes—common when titles contain &quot;Tom &amp; Jerry&quot; or
            company names with ampersands. For SEO, clean rendering avoids broken snippets and layout
            glitches that increase bounce rates; use the{" "}
            <Link
              href="/website/open-graph-preview"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph preview
            </Link>{" "}
            after you wire escaped strings into templates.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Entity encoding is not encryption: anyone can decode the string. It is a presentation
            and injection-hygiene step, not a substitute for sanitizing untrusted HTML, using
            framework auto-escaping, or setting a strong{" "}
            <strong className="font-medium text-foreground">Content-Security-Policy</strong>. Treat
            this tool as a fast scratchpad alongside your normal secure coding practices.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Named entities, decimal, and hexadecimal numeric character references
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            The five characters that most often need escaping in HTML text and attributes map to
            well-known names: amp, lt, gt, quot, and the apostrophe as a numeric reference for broad
            compatibility. Numeric forms such as decimal 233 or hex E9 reference Unicode code points
            directly—useful for symbols without memorized names or when you want a uniform style
            across a template. This encoder&apos;s optional non-ASCII mode emits decimal numerics;
            critical punctuation always uses the compact names above.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this HTML entity encoder and decoder (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Pick <strong className="font-medium text-foreground">Encode to entities</strong>{" "}
                when starting from plain text or raw markup snippets, or{" "}
                <strong className="font-medium text-foreground">Decode entities</strong> when you
                have exported CMS HTML, email source, or escaped JSON strings you want to read.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Paste into <strong className="font-medium text-foreground">Input</strong> or click{" "}
                <strong className="font-medium text-foreground">Upload file</strong> to load a local
                .html, .txt, or .md fragment. Files are read with FileReader in the tab only.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                For encoding, toggle{" "}
                <strong className="font-medium text-foreground">
                  Encode non-ASCII as decimal numeric entities
                </strong>{" "}
                if you need every character above ASCII represented as numeric references—for
                example when an upstream pipeline only accepts ASCII.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Press <strong className="font-medium text-foreground">Encode</strong> or{" "}
                <strong className="font-medium text-foreground">Decode</strong>, then use the copy
                icon on the output panel or{" "}
                <strong className="font-medium text-foreground">Copy output</strong> for
                clipboard-ready text. Use{" "}
                <strong className="font-medium text-foreground">Swap to input</strong> to chain
                operations without re-pasting.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Workflows: Markdown, JSON, APIs, and email HTML
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            When you convert prose with the{" "}
            <Link
              href="/dev/markdown-to-html"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Markdown to HTML
            </Link>{" "}
            tool, you may still need to escape fragments that will be embedded inside a larger
            template or a CMS field that does not run a full markdown pass. For the opposite
            direction, try{" "}
            <Link
              href="/dev/html-to-markdown"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML to Markdown
            </Link>
            . If an API returns JSON with entity-encoded strings, paste the value into the{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter
            </Link>{" "}
            first to locate the field, then decode here. Email clients often show entity-heavy
            source; decoding helps compare preheader and body copy without manual search-and-replace.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Common pitfalls: double encoding, attribute context, and URL text
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="font-medium text-foreground">Double encoding</strong> turns a visible
            ampersand into multiple amp layers after a second pass—decode once, verify the plain
            text, then encode exactly once before publishing. In attribute context, always wrap
            values in double quotes and escape interior quotes. For URLs inside href, you typically
            need percent-encoding for query values, not HTML entities—use the URL encoder for
            address bar-safe strings and keep HTML entities for the surrounding markup.
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
                <span className="text-zinc-600 dark:text-zinc-400">{tool.description}</span>
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
            {htmlEntitiesFaqItems.map((item) => (
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
