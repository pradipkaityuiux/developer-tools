import type { Metadata } from "next";
import Link from "next/link";
import { MarkdownToHtmlTool } from "./markdown-to-html-tool";
import { markdownToHtmlFaqItems } from "@/lib/markdown-to-html-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter(
  (t) => t.href !== "/dev/markdown-to-html",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/markdown-to-html",
  },
};

export default function MarkdownToHtmlPage() {
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
            <span className="text-foreground">Markdown to HTML converter</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Markdown to HTML converter — GFM-friendly output, live preview,
            copy-ready fragments
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              Markdown to HTML converter online
            </strong>{" "}
            to turn README-style prose into{" "}
            <strong className="font-medium text-foreground">
              semantic HTML
            </strong>
            : headings, paragraphs, lists,{" "}
            <strong className="font-medium text-foreground">
              fenced code blocks
            </strong>
            , blockquotes, links, and{" "}
            <strong className="font-medium text-foreground">
              GitHub-Flavored Markdown tables
            </strong>{" "}
            where supported. A{" "}
            <strong className="font-medium text-foreground">
              sandboxed live preview
            </strong>{" "}
            helps you validate structure before you paste into a blog, CMS,
            newsletter tool, or static generator. Conversion runs{" "}
            <strong className="font-medium text-foreground">
              entirely in your browser
            </strong>
            , so drafts and proprietary copy stay local. When you need the
            reverse direction, pair this page with our{" "}
            <Link
              href="/dev/html-to-markdown"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML to Markdown converter
            </Link>
            ; when markup needs whitespace cleanup, follow with the{" "}
            <Link
              href="/dev/html-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML formatter &amp; minifier
            </Link>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <MarkdownToHtmlTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why convert Markdown to HTML?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Markdown stays readable in Git, tickets, and plain-text editors, but
            many publishing surfaces still expect{" "}
            <strong className="font-medium text-foreground">HTML fragments</strong>
            : legacy CMS rich-text fields, email builders, marketing
            automation, and older blog engines. An{" "}
            <strong className="font-medium text-foreground">
              online MD to HTML tool
            </strong>{" "}
            gives you a fast way to prototype content, migrate docs, or drop a
            section into a template without installing CLI utilities. Teams
            also use Markdown for internal specs, then convert to HTML for
            customer-facing help centers or landing pages styled with their own
            CSS.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            For public pages, Markdown is not a substitute for full{" "}
            <strong className="font-medium text-foreground">SEO</strong>{" "}
            hygiene: you still need unique titles, meta descriptions, canonical
            tags, and structured data from your framework or CMS. After
            conversion, audit head markup with our{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            and preview social cards using the{" "}
            <Link
              href="/website/open-graph-preview"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph preview
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this Markdown to HTML converter (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste Markdown into the left editor—release notes, blog drafts,
                knowledge-base articles, or API docs. Click{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                to see headings, a task list, a TypeScript fence, and a GFM
                table.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read the{" "}
                <strong className="font-medium text-foreground">
                  HTML output
                </strong>{" "}
                panel on the right. It updates as you type so you can compare
                structure with your source. If parsing fails, fix the reported
                issue and try again.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Copy HTML
                </strong>{" "}
                to grab the fragment for your destination. Keep{" "}
                <strong className="font-medium text-foreground">
                  Live preview
                </strong>{" "}
                enabled to confirm lists, code blocks, and tables render as
                expected inside a sandboxed iframe.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Paste into your stack, then apply your sanitizer and styles. For
                adjacent structured data, validate JSON configs with the{" "}
                <Link
                  href="/dev/json-formatter"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  JSON formatter &amp; validator
                </Link>{" "}
                or convert YAML service definitions with{" "}
                <Link
                  href="/dev/yaml-to-json"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  YAML to JSON
                </Link>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and workflows teams search for
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            People often look for a{" "}
            <strong className="font-medium text-foreground">
              Markdown preview HTML
            </strong>{" "}
            workflow,{" "}
            <strong className="font-medium text-foreground">
              README to HTML
            </strong>{" "}
            export, or a{" "}
            <strong className="font-medium text-foreground">
              GFM table to HTML
            </strong>{" "}
            converter when they ship documentation alongside code. Content
            marketers may search for{" "}
            <strong className="font-medium text-foreground">
              convert Markdown for email
            </strong>{" "}
            or{" "}
            <strong className="font-medium text-foreground">
              blog Markdown paste
            </strong>{" "}
            before tightening inline styles in their ESP. Developers might need
            a quick{" "}
            <strong className="font-medium text-foreground">
              static site Markdown HTML
            </strong>{" "}
            snippet while prototyping a{" "}
            <strong className="font-medium text-foreground">
              Jamstack
            </strong>{" "}
            page before wiring a full build step with remark or MDX.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Markdown vs HTML for SEO and performance
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Search engines consume rendered HTML, not your Markdown source.
            Converting to clean{" "}
            <strong className="font-medium text-foreground">
              heading hierarchy
            </strong>{" "}
            (
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              h1
            </code>
            –
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              h3
            </code>
            ), descriptive links, and accessible lists supports readability for
            users and crawlers alike. Performance wins come from your hosting
            pipeline—image optimization, font strategy, and caching—not from
            Markdown itself. If you publish long technical articles, keep code
            samples readable and consider pairing this utility with the{" "}
            <Link
              href="/dev/html-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML formatter
            </Link>{" "}
            to normalize indentation before commit.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Security: previews, iframes, and production binding
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Markdown can embed raw HTML blocks; parsers may pass them through.
            This tool{" "}
            <strong className="font-medium text-foreground">
              sanitizes the preview
            </strong>{" "}
            and displays it in a{" "}
            <strong className="font-medium text-foreground">
              sandboxed iframe
            </strong>{" "}
            without scripts. The copied HTML matches the parser output so you do
            not lose attributes your CMS expects—treat it as{" "}
            <strong className="font-medium text-foreground">
              untrusted input
            </strong>{" "}
            until your own sanitizer runs. That discipline matters for
            user-generated content, comment systems, and any{" "}
            <strong className="font-medium text-foreground">
              React dangerouslySetInnerHTML
            </strong>{" "}
            call.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Limitations compared with MDX, remark, or static generators
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Full site builds add imports, shortcodes, math, and component
            slots—this page targets{" "}
            <strong className="font-medium text-foreground">
              fast one-off conversion
            </strong>{" "}
            and editor scratch work, not replacing Astro, Next.js content
            layers, or unified/remark plugins. For JSX-heavy docs, keep using
            MDX in your repo. For quick URL checks on the live site you ship,
            bookmark the{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>{" "}
            and{" "}
            <Link
              href="/website/response-code-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              response code checker
            </Link>{" "}
            alongside your content workflow.
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
            {markdownToHtmlFaqItems.map((item) => (
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
