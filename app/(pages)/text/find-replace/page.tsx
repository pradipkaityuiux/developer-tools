import type { Metadata } from "next";
import Link from "next/link";
import { FindReplaceTool } from "./find-replace-tool";
import { findReplaceFaqItems } from "@/lib/find-replace-faq";
import { toolSections } from "@/lib/tool-catalog";
import { BlogCard } from "@/components/blog-card";

const textTools =
  toolSections.find((s) => s.id === "text-string-tools")?.tools ?? [];
const relatedTools = textTools.filter((t) => t.href !== "/text/find-replace");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/text/find-replace",
  },
};

export default function FindReplacePage() {
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
            <span className="text-foreground">Find &amp; replace</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Find &amp; replace tool — bulk search plain text or regex in the
            browser
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online find and replace
            </strong>{" "}
            when you need a fast{" "}
            <strong className="font-medium text-foreground">
              search and replace
            </strong>{" "}
            pass on long paste: renaming tokens in a config dump, fixing a
            repeated typo across an article, normalizing separators in an
            export, or prototyping regex replacements before you commit them in
            code. Switch between{" "}
            <strong className="font-medium text-foreground">
              literal plain-text matching
            </strong>{" "}
            (where dots and parentheses are ordinary characters) and{" "}
            <strong className="font-medium text-foreground">
              JavaScript regular expressions
            </strong>{" "}
            with optional{" "}
            <strong className="font-medium text-foreground">
              ignore case, multiline, and dot-all
            </strong>{" "}
            flags. Every match is replaced in one shot (
            <strong className="font-medium text-foreground">global</strong>{" "}
            behavior). Processing stays{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            —upload a{" "}
            <strong className="font-medium text-foreground">.txt</strong> file
            or paste directly, then copy the result. Pair this with our{" "}
            <Link
              href="/text/diff-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              text diff checker
            </Link>{" "}
            to verify before-and-after, or{" "}
            <Link
              href="/dev/regex-tester"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              regex tester
            </Link>{" "}
            when you are iterating on complex patterns.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <FindReplaceTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why use a browser-based find and replace?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Editors like VS Code excel at project-wide refactors, but many tasks
            are single-buffer: a CSV snippet from a ticket, a log excerpt, a
            markdown draft, or SQL copied from a monitoring UI. A dedicated{" "}
            <strong className="font-medium text-foreground">
              bulk find replace
            </strong>{" "}
            page avoids opening heavy IDEs, respects air-gapped or locked-down
            machines, and keeps sensitive paste on the client. You still get
            regex power when you need{" "}
            <strong className="font-medium text-foreground">
              pattern-based substitution
            </strong>{" "}
            and literal mode when special characters must stay literal.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Content and support teams often search for{" "}
            <strong className="font-medium text-foreground">
              case insensitive find and replace
            </strong>{" "}
            to align product names; developers search for{" "}
            <strong className="font-medium text-foreground">
              regex find replace online
            </strong>{" "}
            to strip phone formats or ticket IDs. After editing, the{" "}
            <Link
              href="/text/word-counter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              word counter
            </Link>{" "}
            helps confirm length limits, and the{" "}
            <Link
              href="/text/whitespace-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              whitespace remover
            </Link>{" "}
            tidies spacing if paste introduced odd breaks.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this find and replace tool (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste your document into the left panel or click Upload .txt to
                load a UTF-8 file. Load sample demonstrates a small multi-line
                example.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Choose Plain text for literal strings, or Regular expression for
                JS RegExp syntax. In plain mode, toggle Match case when
                capitalization must match exactly.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Enter Find and Replace with. In regex mode, use $1, $2 for
                capture groups and $&amp; for the full match in the replacement.
                Enable i, m, or s flags when your pattern needs them.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read the match count and character lengths, then copy the result
                from the right panel into your destination app.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Plain text vs regex: quick guide
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">Plain text</strong>{" "}
            escapes regex metacharacters for you, so searching for{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              price $10.00
            </code>{" "}
            is safe. Turn off match case to fold{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              TODO
            </code>{" "}
            and{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              todo
            </code>{" "}
            together.{" "}
            <strong className="font-medium text-foreground">Regex mode</strong>{" "}
            is for digits (
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              \d+
            </code>
            ), optional groups, boundaries, and multiline anchors—ideal when the
            same shape appears with different values. Invalid patterns surface a
            clear error without mutating your text.
          </p>
          <BlogCard
            title="Regex Cheat Sheet: The 20 Patterns Developers Use Most"
            description="Regex has a reputation for looking like someone fell asleep on a keyboard. ^(?=.*[A-Z])(?=.*\d).{8,}$ doesn't exactly explain itself. But most developers don't actually need to master the entire regex spec, they need a handful of patterns they reach for constantly: validating an email, matching a phone number, stripping whitespace, that kind of thing."
            href="/blog/regex-cheat-sheet-common-patterns"
          />
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            When you only need to collapse repeated rows instead of in-line
            edits, use the{" "}
            <Link
              href="/text/duplicate-line-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              duplicate line remover
            </Link>
            . For consistent identifier casing after replacements, try the{" "}
            <Link
              href="/text/case-converter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              text case converter
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and workflows people search for
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Common intents include replace text in document online, bulk
            rename in a paste, fix double spaces, swap delimiters, strip HTML
            entities from a fragment, or rehearse a{" "}
            <strong className="font-medium text-foreground">
              javascript regex replace
            </strong>{" "}
            before dropping it into Node or a browser app. This page supports
            those flows with live output and counts. For sorting lines after
            substitution, use the{" "}
            <Link
              href="/text/line-sorter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              line sorter
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and limits
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Find and replace runs locally; large documents may feel slower on
            older hardware. For multi-gigabyte logs, prefer streaming CLI tools.
            This interface targets articles, configs, tickets, and
            spreadsheet-sized paste.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related text and string tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browse the full{" "}
            <Link
              href="/#text-string-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Text &amp; String Tools
            </Link>{" "}
            section on the home page. Highlights:
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
            {findReplaceFaqItems.map((item) => (
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
