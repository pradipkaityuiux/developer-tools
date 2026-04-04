import type { Metadata } from "next";
import Link from "next/link";
import { TextReverserTool } from "./text-reverser-tool";
import { textReverserFaqItems } from "@/lib/text-reverser-faq";
import { toolSections } from "@/lib/tool-catalog";

const textTools =
  toolSections.find((s) => s.id === "text-string-tools")?.tools ?? [];
const relatedTools = textTools.filter((t) => t.href !== "/text/text-reverser");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/text/text-reverser",
  },
};

export default function TextReverserPage() {
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
            <span className="text-foreground">Text reverser</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Text reverser online — reverse a string, words on each line, or
            mirror every line
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online text reverser
            </strong>{" "}
            when you need a fast{" "}
            <strong className="font-medium text-foreground">
              backward string
            </strong>{" "}
            for riddles, social posts, UI mockups, or classroom examples. Pick{" "}
            <strong className="font-medium text-foreground">
              reverse full text
            </strong>{" "}
            to flip the entire paste character by character (newlines move with
            the stream),{" "}
            <strong className="font-medium text-foreground">
              reverse words per line
            </strong>{" "}
            to swap word order on every row while keeping separate lines, or{" "}
            <strong className="font-medium text-foreground">
              reverse each line
            </strong>{" "}
            to mirror characters inside each line only—perfect when line order
            must stay stable. Paste from any editor,{" "}
            <strong className="font-medium text-foreground">
              upload plain text
            </strong>
            , then{" "}
            <strong className="font-medium text-foreground">
              copy the reversed output
            </strong>
            . Everything runs{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            , so drafts and proprietary strings stay local. Explore sibling
            utilities in the{" "}
            <Link
              href="/#text-string-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Text and String Tools
            </Link>{" "}
            section on the home page.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <TextReverserTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            When a dedicated string reverser beats your editor
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Most IDEs can reverse a selection with macros or extensions, but
            sharing that trick across a team is awkward—and multi-line rules
            differ. A focused{" "}
            <strong className="font-medium text-foreground">
              reverse text generator
            </strong>{" "}
            documents three predictable modes so writers, testers, and support
            leads get the same result without installing anything. Use full
            reversal when you want the entire blob to read end-to-start; use
            per-line word reversal when you keep paragraph breaks but flip
            phrasing; use per-line character reversal for classic{" "}
            <strong className="font-medium text-foreground">mirror text</strong>{" "}
            effects. After transforming copy, measure length shifts with our{" "}
            <Link
              href="/text/word-counter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              word counter
            </Link>{" "}
            before you paste into fields with character caps.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this text reverser (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Choose{" "}
                <strong className="font-medium text-foreground">
                  reverse full text
                </strong>
                ,{" "}
                <strong className="font-medium text-foreground">
                  reverse words per line
                </strong>
                , or{" "}
                <strong className="font-medium text-foreground">
                  reverse each line
                </strong>{" "}
                depending on whether you need character order, word order, or
                line-local mirroring.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Paste UTF-8 text into the input box or click{" "}
                <strong className="font-medium text-foreground">
                  Upload file
                </strong>{" "}
                to load{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  .txt
                </code>{" "}
                or Markdown. Use{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                to preview how each mode reshapes the same paragraph.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read the live output panel; switch modes without re-pasting to
                compare behaviors. Click the{" "}
                <strong className="font-medium text-foreground">copy</strong>{" "}
                icon on the output to move the reversed string into Slack,
                Jira, or a slide deck.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                For casing experiments after reversal, open the{" "}
                <Link
                  href="/text/case-converter"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  text case converter
                </Link>
                . For comparing original versus reversed drafts side by side,
                use the{" "}
                <Link
                  href="/text/diff-checker"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  text diff checker
                </Link>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and workflows this page supports
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            People often search for an{" "}
            <strong className="font-medium text-foreground">
              online backwards text maker
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              reverse string JavaScript style
            </strong>{" "}
            without opening DevTools, or a quick{" "}
            <strong className="font-medium text-foreground">
              flip words in a sentence
            </strong>{" "}
            tool for captions. QA engineers reuse it to build edge-case fixtures
            (palindrome checks, bidi UI stress tests). Content teams pair it
            with the{" "}
            <Link
              href="/dev/lorem-ipsum"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              lorem ipsum generator
            </Link>{" "}
            when they need filler that still looks unusual after transforms.
            Educators reference it next to{" "}
            <Link
              href="/text/rot13"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              ROT13
            </Link>{" "}
            or{" "}
            <Link
              href="/text/caesar-cipher"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Caesar cipher
            </Link>{" "}
            lessons to contrast trivial transforms with real cryptography.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Unicode, emoji, and accessibility notes
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Reversal walks Unicode scalar values in order, which covers most
            emoji and accented letters you will paste from the web. Screen
            readers may announce reversed words oddly—that is expected when you
            deliberately scramble visual order. Do not rely on reversed text
            for security or privacy; anyone can undo it instantly. If you need
            to strip invisible characters before reversing, chain this tool
            with the{" "}
            <Link
              href="/text/whitespace-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              whitespace remover
            </Link>{" "}
            when normalizing pasted HTML or PDF extracts.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Limitations compared with custom scripts
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This utility does not implement grapheme cluster rules for every
            language, regex-powered tokenizers, or reversible escaping for code.
            Developers who need language-aware segmentation should export text
            into their stack. For bulk line operations—sorting, deduping,
            finding patterns—use the{" "}
            <Link
              href="/text/line-sorter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              line sorter
            </Link>
            ,{" "}
            <Link
              href="/text/duplicate-line-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              duplicate line remover
            </Link>
            , or{" "}
            <Link
              href="/text/find-replace"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              find and replace tool
            </Link>{" "}
            before mirroring final output here.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related text and string tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Browse the full catalog under{" "}
            <Link
              href="/#text-string-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Text and String Tools
            </Link>
            . Highlights beyond this page:
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
            {textReverserFaqItems.map((item) => (
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
