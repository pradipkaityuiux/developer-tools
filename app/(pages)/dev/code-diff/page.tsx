import type { Metadata } from "next";
import Link from "next/link";
import { CodeDiffTool } from "./code-diff-tool";
import { codeDiffFaqItems } from "@/lib/code-diff-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/code-diff");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/code-diff",
  },
};

export default function CodeDiffPage() {
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
            <span className="text-foreground">Code diff checker</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Code diff checker — side-by-side compare for snippets, configs, and
            reviews
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online code diff tool
            </strong>{" "}
            to{" "}
            <strong className="font-medium text-foreground">
              compare two text or code versions
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
              added lines highlight on the right
            </strong>
            —a lightweight pull-request-style readout without cloning a repo.
            Processing is{" "}
            <strong className="font-medium text-foreground">
              client-side only
            </strong>
            , so drafts and proprietary snippets stay in your browser. When you
            need readable inputs first, normalize JSON with our{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter &amp; validator
            </Link>
            , markup with the{" "}
            <Link
              href="/dev/html-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML formatter &amp; minifier
            </Link>
            , or queries with the{" "}
            <Link
              href="/dev/sql-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SQL formatter
            </Link>{" "}
            before you diff.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <CodeDiffTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why use a browser-based code diff checker?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Engineers and technical writers constantly juggle{" "}
            <strong className="font-medium text-foreground">
              before/after snippets
            </strong>
            : support emails, Slack threads, CI logs, and CMS drafts rarely
            arrive as a tidy Git branch. A dedicated{" "}
            <strong className="font-medium text-foreground">
              paste-and-compare diff
            </strong>{" "}
            answers “what changed between these two blocks?” in seconds. It
            complements—not replaces—
            <strong className="font-medium text-foreground">git diff</strong>,{" "}
            <strong className="font-medium text-foreground">merge tools</strong>
            , and IDE reviewers when you only have raw text. Because this page
            never uploads your buffers, you can sanity-check internal APIs,
            Terraform snippets, or redacted logs on a locked-down machine.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Teams reviewing{" "}
            <strong className="font-medium text-foreground">
              configuration drift
            </strong>{" "}
            often pair a diff view with encoders and parsers: validate tokens
            using the{" "}
            <Link
              href="/dev/jwt-decoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JWT decoder
            </Link>
            , normalize YAML via{" "}
            <Link
              href="/dev/yaml-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              YAML to JSON
            </Link>
            , and keep CSV-shaped samples consistent through{" "}
            <Link
              href="/dev/csv-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV to JSON
            </Link>{" "}
            before lining up versions here.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this code diff checker (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste the{" "}
                <strong className="font-medium text-foreground">
                  original
                </strong>{" "}
                text into the left editor—the “old” file fragment, baseline
                policy, or message you received. Click{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                to preview a small TypeScript-style refactor.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Paste the{" "}
                <strong className="font-medium text-foreground">
                  modified
                </strong>{" "}
                text into the right editor. The tool splits on line breaks, so
                one long minified line will diff as a single row; run the{" "}
                <Link
                  href="/dev/js-formatter"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  JavaScript formatter &amp; minifier
                </Link>{" "}
                or{" "}
                <Link
                  href="/dev/css-formatter"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  CSS formatter &amp; minifier
                </Link>{" "}
                when you need wrapped lines for review.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read the{" "}
                <strong className="font-medium text-foreground">
                  side-by-side table
                </strong>
                : line numbers restart per column, blank mates mark insertions
                or deletions, and the summary counts call out how many rows were
                kept, removed, or added.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Optional: click{" "}
                <strong className="font-medium text-foreground">
                  Copy unified diff
                </strong>{" "}
                to grab a compact{" "}
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
                text block for tickets or documentation. Clear both fields when
                you move to the next pair.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and workflows teams search for
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            People look for an{" "}
            <strong className="font-medium text-foreground">
              online text diff
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              code compare tool
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              line-by-line diff viewer
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              paste diff for code review
            </strong>{" "}
            when they need fast answers outside Git. Content and growth
            engineers diff{" "}
            <strong className="font-medium text-foreground">
              JSON-LD or meta blocks
            </strong>{" "}
            after edits—cross-check live pages with the{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            once structural tags change. Security reviewers compare redacted
            headers or payloads alongside the{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>{" "}
            when validating responses.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Line-based diffing vs character-level and semantic tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This checker aligns{" "}
            <strong className="font-medium text-foreground">whole lines</strong>{" "}
            using a classic{" "}
            <strong className="font-medium text-foreground">
              longest common subsequence
            </strong>{" "}
            strategy. That keeps the implementation predictable and fast for
            typical snippets, but a tiny edit in a 400-character line will show
            as a full-line removal and addition.{" "}
            <strong className="font-medium text-foreground">
              Semantic or word-level diffs
            </strong>{" "}
            inside IDEs can look prettier for prose; use those when wording
            matters more than structure. When you debug extraction or rewrite
            rules, the{" "}
            <Link
              href="/dev/regex-tester"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              regex tester &amp; debugger
            </Link>{" "}
            still wins for pattern-level inspection.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy, limits, and when to stay in Git
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Nothing leaves your tab during comparison, which helps regulated
            teams and consultants working on NDA code. Each side caps at a few
            thousand lines to protect memory—slice functions or modules for
            megafiles. For{" "}
            <strong className="font-medium text-foreground">
              merges, blame, and history
            </strong>
            , continue using Git; for binary assets, use dedicated viewers. If you
            need structured document conversion before diffing, try{" "}
            <Link
              href="/dev/html-to-markdown"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML to Markdown
            </Link>{" "}
            or{" "}
            <Link
              href="/dev/markdown-to-html"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Markdown to HTML
            </Link>{" "}
            to align formats first.
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
            {codeDiffFaqItems.map((item) => (
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
