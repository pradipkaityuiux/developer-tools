import type { Metadata } from "next";
import Link from "next/link";
import { HtmlToMarkdownTool } from "./html-to-markdown-tool";
import { htmlToMarkdownFaqItems } from "@/lib/html-to-markdown-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter(
  (t) => t.href !== "/dev/html-to-markdown",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/html-to-markdown",
  },
};

export default function HtmlToMarkdownPage() {
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
            <span className="text-foreground">HTML to Markdown converter</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            HTML to Markdown converter — paste markup, get GitHub-flavored
            Markdown for docs and CMS migration
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This free{" "}
            <strong className="font-medium text-foreground">
              HTML to Markdown converter online
            </strong>{" "}
            turns snippets and articles into clean{" "}
            <strong className="font-medium text-foreground">
              GitHub Flavored Markdown (GFM)
            </strong>
            : headings, emphasis, links, images, lists, blockquotes, fenced
            code, tables, and task lists when your source HTML includes them.
            Everything runs{" "}
            <strong className="font-medium text-foreground">
              locally in your browser
            </strong>
            , so exports from wikis, legacy blogs, and email builders stay
            private. Use it alongside our{" "}
            <Link
              href="/dev/markdown-to-html"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Markdown to HTML converter
            </Link>{" "}
            when you need to round-trip content or preview how authors’ Markdown
            will render as markup.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <HtmlToMarkdownTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why convert HTML to Markdown?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Teams move to Markdown because it diffs cleanly in Git, reads well
            in code review, and powers static site generators (Hugo, Eleventy,
            Astro), GitHub wikis, and many headless CMS workflows. When your
            legacy content only exists as HTML—exported from WordPress, Confluence,
            or old landing pages—an{" "}
            <strong className="font-medium text-foreground">
              HTML to MD converter
            </strong>{" "}
            jump-starts migration: you get editable prose instead of hand-typing
            hundreds of pages. Expect to spot-check tables and nested lists; HTML
            layout divs do not always map to idiomatic Markdown.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            If you are standardizing on JSON or YAML for config while prose stays
            in Markdown, keep our{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter &amp; validator
            </Link>{" "}
            and{" "}
            <Link
              href="/dev/yaml-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              YAML to JSON converter
            </Link>{" "}
            nearby for the non-Markdown pieces of your stack.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            HTML to Markdown for SEO and content operations
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Search engines consume rendered HTML, not your authoring format—but
            Markdown-first workflows often produce tighter, reviewable content
            and faster iteration in Git. After you convert, paste final HTML
            through publishing pipelines or use SSG-native Markdown. When you
            audit live pages, our{" "}
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
            help confirm titles, descriptions, and duplication controls on the
            HTML you actually ship.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this HTML to Markdown tool (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste HTML into{" "}
                <strong className="font-medium text-foreground">
                  HTML input
                </strong>
                . You can use a fragment (for example an{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  article
                </code>{" "}
                block) or a larger export; remove navigation chrome if you only
                want the body copy.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Under{" "}
                <strong className="font-medium text-foreground">Options</strong>,
                choose{" "}
                <strong className="font-medium text-foreground">
                  ATX headings
                </strong>{" "}
                (
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  # H1
                </code>
                ) or{" "}
                <strong className="font-medium text-foreground">
                  setext headings
                </strong>{" "}
                for H1/H2, pick a bullet character, and decide between fenced and
                indented code blocks to match your style guide.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Convert to Markdown
                </strong>{" "}
                and read the{" "}
                <strong className="font-medium text-foreground">
                  Markdown output
                </strong>{" "}
                panel. Tables and task lists appear when the GFM plugin can
                recognize the source structure.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use{" "}
                <strong className="font-medium text-foreground">
                  Copy Markdown
                </strong>{" "}
                to paste into your repo, CMS, or notes app. Use{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                anytime to see a full example with headings, lists, code, and a
                table.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Preparing HTML for a cleaner Markdown result
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Messy or deeply nested HTML can produce noisy Markdown. Run
            important templates through our{" "}
            <Link
              href="/dev/html-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML formatter &amp; minifier
            </Link>{" "}
            first to normalize structure, then trim wrapper elements you do not
            need. For strict XML-style documents, validate with the{" "}
            <Link
              href="/dev/xml-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              XML formatter &amp; validator
            </Link>{" "}
            before converting compatible fragments.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Limitations and when to keep HTML
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Markdown is not a drop-in replacement for every HTML pattern:
            arbitrary{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              div
            </code>{" "}
            layouts, inline{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              style
            </code>{" "}
            attributes, custom web components, and script-driven widgets usually
            flatten or disappear in conversion. For interactive marketing
            sections, keep HTML partials or adopt MDX. Scripts and most{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              head
            </code>{" "}
            metadata are not meaningful in Markdown and are omitted by design.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Reverse direction: Markdown to HTML
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Authors who write in Markdown but need raw markup for email or CMS
            fields can use the{" "}
            <Link
              href="/dev/markdown-to-html"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Markdown to HTML converter
            </Link>{" "}
            on this site. Together, the two tools help you test round trips and
            compare how structural changes in HTML affect your Markdown source.
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
              code &amp; developer tools
            </Link>{" "}
            section on the home page, or open a focused utility below.
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
            {htmlToMarkdownFaqItems.map((item) => (
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
