import type { Metadata } from "next";
import Link from "next/link";
import { LoremIpsumTool } from "./lorem-ipsum-tool";
import { loremIpsumFaqItems } from "@/lib/lorem-ipsum-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/lorem-ipsum");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/lorem-ipsum",
  },
};

export default function LoremIpsumPage() {
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
            <span className="text-foreground">Lorem Ipsum generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Lorem Ipsum generator — placeholder paragraphs, sentences, and HTML
            filler for mockups
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online Lorem Ipsum generator
            </strong>{" "}
            to produce{" "}
            <strong className="font-medium text-foreground">
              neutral placeholder copy
            </strong>{" "}
            for wireframes, component libraries, CMS previews, and marketing
            drafts. Switch between{" "}
            <strong className="font-medium text-foreground">paragraphs</strong>,{" "}
            <strong className="font-medium text-foreground">sentences</strong>,
            or an exact{" "}
            <strong className="font-medium text-foreground">word count</strong>,
            then optionally wrap results in{" "}
            <strong className="font-medium text-foreground">
              HTML paragraph tags
            </strong>{" "}
            or{" "}
            <strong className="font-medium text-foreground">
              line-break spacing
            </strong>{" "}
            when your rich-text field prefers{" "}
            <code className="rounded bg-zinc-200/80 px-1 py-0.5 font-mono text-sm dark:bg-zinc-800">
              &lt;br&gt;
            </code>{" "}
            over block elements. Toggle the familiar{" "}
            <strong className="font-medium text-foreground">
              “Lorem ipsum dolor sit amet”
            </strong>{" "}
            opening so stakeholders instantly recognize filler, or turn it off
            for entirely synthetic pseudo-Latin rhythm.{" "}
            <strong className="font-medium text-foreground">
              Upload a word list
            </strong>{" "}
            to bias vocabulary toward your domain while keeping random
            structure—everything runs{" "}
            <strong className="font-medium text-foreground">
              locally in the browser
            </strong>
            . When you graduate from prose placeholders to structured test rows,
            pair this page with the{" "}
            <Link
              href="/dev/dummy-data-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              dummy data generator
            </Link>{" "}
            for JSON or CSV fixtures, and tidy any pasted markup using the{" "}
            <Link
              href="/dev/html-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML formatter and minifier
            </Link>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <LoremIpsumTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why Lorem Ipsum still matters in product and web workflows
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Placeholder text keeps reviews focused on{" "}
            <strong className="font-medium text-foreground">
              layout density
            </strong>
            , line length, and vertical rhythm instead of debating headline copy
            in week one. A dependable{" "}
            <strong className="font-medium text-foreground">
              dummy text generator
            </strong>{" "}
            prevents empty states from distracting art directors, lets engineers
            ship skeleton screens, and gives content strategists a predictable
            block to replace later. Unlike real articles, filler avoids
            accidental SEO indexing of draft phrases and reduces bias from
            recognizable brand language during usability tests.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            When you need machine-readable fake rows instead of paragraphs,
            switch to the{" "}
            <Link
              href="/dev/dummy-data-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              dummy data generator
            </Link>{" "}
            or{" "}
            <Link
              href="/dev/csv-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV to JSON
            </Link>{" "}
            pipeline for spreadsheets and API mocks.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this Lorem Ipsum generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Choose{" "}
                <strong className="font-medium text-foreground">
                  Paragraphs
                </strong>{" "}
                for article-shaped blocks,{" "}
                <strong className="font-medium text-foreground">
                  Sentences
                </strong>{" "}
                for captions or cards, or{" "}
                <strong className="font-medium text-foreground">Words</strong>{" "}
                when a design spec calls for an exact length (for example, a
                truncated teaser line).
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Set the{" "}
                <strong className="font-medium text-foreground">count</strong>{" "}
                within the allowed range. Paragraph mode builds several sentences
                per paragraph with randomized lengths so line wraps look natural.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Pick{" "}
                <strong className="font-medium text-foreground">
                  Plain text
                </strong>{" "}
                for Markdown, Figma, or Slack,{" "}
                <strong className="font-medium text-foreground">
                  &lt;p&gt; paragraphs
                </strong>{" "}
                for semantic HTML, or{" "}
                <strong className="font-medium text-foreground">
                  &lt;br&gt; breaks
                </strong>{" "}
                when your CMS sanitizes block tags but allows breaks.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Leave{" "}
                <strong className="font-medium text-foreground">
                  Classic “Lorem ipsum” opening
                </strong>{" "}
                enabled when you want the first chunk to match the industry
                standard excerpt; disable it for fully synthetic filler.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Optionally click{" "}
                <strong className="font-medium text-foreground">
                  Upload word list
                </strong>{" "}
                and choose a{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  .txt
                </code>{" "}
                file. Parsed tokens replace the built-in dictionary so you can
                mix medical, legal, or SaaS vocabulary into the same random
                grammar. Use{" "}
                <strong className="font-medium text-foreground">
                  Reset dictionary
                </strong>{" "}
                to return to defaults.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Regenerate
                </strong>{" "}
                whenever you need a fresh sample, then use the{" "}
                <strong className="font-medium text-foreground">copy</strong>{" "}
                control on the output to paste into your stack.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and search intents this tool covers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Teams often search for a{" "}
            <strong className="font-medium text-foreground">
              Lorem Ipsum generator online
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              placeholder text for websites
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              fake Latin paragraph generator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              HTML Lorem Ipsum
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              wireframe copy generator
            </strong>
            . This page answers those intents with a private, no-account
            workflow and explicit HTML modes. After you drop text into a page,
            measure readability and length with the{" "}
            <Link
              href="/text/word-counter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              word counter
            </Link>{" "}
            or convert rich text to Markdown using{" "}
            <Link
              href="/dev/html-to-markdown"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML to Markdown
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Accessibility, localization, and inclusive content notes
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Screen reader users can hear long filler as meaningless syllables, so
            mark prototype regions with clear{" "}
            <strong className="font-medium text-foreground">
              accessibility labels
            </strong>{" "}
            in your design system and replace Lorem Ipsum before production.
            For multilingual products, plan real translations instead of
            leaving Latin in non-Latin locales. This utility is best for visual
            and structural work, not final customer-facing copy.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and HTML safety
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Random selection uses{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              crypto.getRandomValues
            </code>{" "}
            in the browser—no server round trip. When you choose HTML wrapping,
            generated text is{" "}
            <strong className="font-medium text-foreground">
              HTML-escaped
            </strong>{" "}
            so unexpected characters from uploaded lists cannot inject tags. You
            should still follow your CMS sanitization rules before publishing
            anything to the open web.
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
            {loremIpsumFaqItems.map((item) => (
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
