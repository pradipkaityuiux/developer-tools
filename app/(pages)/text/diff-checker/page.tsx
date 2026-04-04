import type { Metadata } from "next";
import Link from "next/link";
import { TextDiffCheckerTool } from "./text-diff-checker-tool";
import { textDiffCheckerFaqItems } from "@/lib/text-diff-checker-faq";
import { toolSections } from "@/lib/tool-catalog";

const textTools =
  toolSections.find((s) => s.id === "text-string-tools")?.tools ?? [];
const relatedTools = textTools.filter((t) => t.href !== "/text/diff-checker");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/text/diff-checker",
  },
};

export default function TextDiffCheckerPage() {
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
            <span className="text-foreground">Text diff checker</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Text diff checker — compare two versions with line-level highlights
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online text diff checker
            </strong>{" "}
            to{" "}
            <strong className="font-medium text-foreground">
              compare two plain-text documents
            </strong>{" "}
            in a{" "}
            <strong className="font-medium text-foreground">
              side-by-side diff view
            </strong>
            : unchanged lines stay aligned,{" "}
            <strong className="font-medium text-foreground">
              removed lines highlight on the left
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              new lines highlight on the right
            </strong>
            . It fits{" "}
            <strong className="font-medium text-foreground">
              legal, editorial, and content-ops workflows
            </strong>{" "}
            when you receive “track changes” as two full drafts from email,
            Word exports, or a CMS. Processing is{" "}
            <strong className="font-medium text-foreground">
              client-side only
            </strong>
            —paste or{" "}
            <strong className="font-medium text-foreground">
              upload UTF-8 .txt
            </strong>{" "}
            per panel, then copy a{" "}
            <strong className="font-medium text-foreground">
              unified diff
            </strong>{" "}
            for tickets. For source snippets and configs, the{" "}
            <Link
              href="/dev/code-diff"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              code diff checker
            </Link>{" "}
            uses the same line engine with a developer-focused guide. Normalize
            noisy JSON before comparing API payloads with our{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter &amp; validator
            </Link>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <TextDiffCheckerTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why use a browser-based text comparison tool?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Editors, paralegals, and growth teams constantly juggle{" "}
            <strong className="font-medium text-foreground">
              before and after text
            </strong>{" "}
            that never arrives as a single redlined file. An{" "}
            <strong className="font-medium text-foreground">
              instant document diff
            </strong>{" "}
            answers “what changed between these two pastes?” without installing
            desktop compare utilities or uploading confidential drafts to a
            third party. Because this page never sends your buffers to our
            servers, you can review NDAs, pricing paragraphs, or internal FAQs
            on a locked-down laptop.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Pair diffing with cleanup utilities from the same catalog: remove
            repeated statements using the{" "}
            <Link
              href="/text/duplicate-line-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              duplicate line remover
            </Link>
            , normalize capitalization with the{" "}
            <Link
              href="/text/case-converter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              text case converter
            </Link>
            , and check length limits with the{" "}
            <Link
              href="/text/word-counter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              word counter
            </Link>{" "}
            after you merge edits.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this text diff checker (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Put the{" "}
                <strong className="font-medium text-foreground">
                  original
                </strong>{" "}
                draft in the left panel—the version from legal, the last
                published FAQ, or an older export. Use{" "}
                <strong className="font-medium text-foreground">
                  Upload .txt
                </strong>{" "}
                if you already saved plain text to disk.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Paste the{" "}
                <strong className="font-medium text-foreground">
                  revised
                </strong>{" "}
                draft on the right. Click{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                to preview a short terms-style comparison with multiple line
                edits.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read the{" "}
                <strong className="font-medium text-foreground">
                  side-by-side table
                </strong>
                : line numbers restart per column, blank mates show insertions
                or deletions, and the summary counts quantify unchanged, removed,
                and added rows.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Optional: click{" "}
                <strong className="font-medium text-foreground">
                  Copy unified diff
                </strong>{" "}
                (with the copy icon) to grab a{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  -
                </code>
                /
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  +
                </code>
                /
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  {" "}
                </code>
                block for Jira, Confluence, or email. Use{" "}
                <strong className="font-medium text-foreground">
                  Clear both
                </strong>{" "}
                when you start a new pair.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and workflows people search for
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Teams look for an{" "}
            <strong className="font-medium text-foreground">
              online text compare
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              paragraph diff tool
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              paste two versions
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              contract redline alternative
            </strong>{" "}
            when Word track changes is unavailable. Content strategists diff
            landing copy; support leads diff macro replies; engineers still
            prefer the{" "}
            <Link
              href="/dev/code-diff"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              code-oriented diff page
            </Link>{" "}
            for stack traces and YAML. If wrapping or spaces dominate the noise,
            trim pasted blocks with the{" "}
            <Link
              href="/text/whitespace-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              whitespace remover
            </Link>{" "}
            before diffing.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Line-based diffing vs word processors and Git
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This checker aligns{" "}
            <strong className="font-medium text-foreground">whole lines</strong>{" "}
            using a classic{" "}
            <strong className="font-medium text-foreground">
              longest common subsequence
            </strong>{" "}
            approach. That keeps behavior predictable for policies and email
            threads, but a one-word edit inside a long line appears as a full
            line removal and addition. Word-level track changes and semantic
            legal diff products can look finer for prose; Git remains the system
            of record for repositories. Use this page when you only have two
            static strings and need a fast visual answer.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy, limits, and best practices
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Nothing leaves your tab during comparison. Each side caps at a few
            thousand lines to protect browser memory—slice chapters or sections
            for book-length material. Prefer redacted excerpts when sharing
            screen recordings. For pattern-based rewrites across one document,
            our{" "}
            <Link
              href="/dev/regex-tester"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              regex tester &amp; debugger
            </Link>{" "}
            complements line diffs when you hunt structural issues rather than
            pairwise versions.
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
              text and string tools
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
            {textDiffCheckerFaqItems.map((item) => (
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
