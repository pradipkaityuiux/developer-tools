import type { Metadata } from "next";
import Link from "next/link";
import { RegexTesterTool } from "./regex-tester-tool";
import { regexTesterFaqItems } from "@/lib/regex-tester-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/regex-tester");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/regex-tester",
  },
};

export default function RegexTesterPage() {
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
            <span className="text-foreground">Regex tester &amp; debugger</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Regex tester &amp; debugger — JavaScript RegExp with highlights &amp;
            capture groups
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online regex tester
            </strong>{" "}
            to prototype{" "}
            <strong className="font-medium text-foreground">
              JavaScript regular expressions
            </strong>{" "}
            before you drop them into code review, CI guards, or form validation.
            Toggle standard{" "}
            <strong className="font-medium text-foreground">RegExp flags</strong>{" "}
            (
            <strong className="font-medium text-foreground">global</strong>,{" "}
            <strong className="font-medium text-foreground">ignore case</strong>,{" "}
            <strong className="font-medium text-foreground">multiline</strong>,{" "}
            <strong className="font-medium text-foreground">dotAll</strong>,{" "}
            <strong className="font-medium text-foreground">unicode</strong>,{" "}
            <strong className="font-medium text-foreground">sticky</strong>, and{" "}
            <strong className="font-medium text-foreground">indices</strong>
            ), watch{" "}
            <strong className="font-medium text-foreground">
              live match highlighting
            </strong>{" "}
            on your sample text, and inspect{" "}
            <strong className="font-medium text-foreground">
              numbered and named capture groups
            </strong>{" "}
            in a sortable-style table. Everything executes{" "}
            <strong className="font-medium text-foreground">
              locally in the browser
            </strong>
            —ideal when you need a fast{" "}
            <strong className="font-medium text-foreground">
              regex debugger
            </strong>{" "}
            without installing a desktop app.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <RegexTesterTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            What is a JavaScript regex tester?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            A{" "}
            <strong className="font-medium text-foreground">
              JavaScript regex tester
            </strong>{" "}
            is a focused scratchpad where you edit a{" "}
            <strong className="font-medium text-foreground">RegExp pattern</strong>
            , point it at a realistic string, and immediately see whether the
            engine accepts the syntax and which substrings match. Unlike
            guessing inside a large codebase, the feedback loop here is visual:
            compile errors surface in plain language, successful matches render
            with{" "}
            <strong className="font-medium text-foreground">highlights</strong>,
            and each row in the results grid explains{" "}
            <strong className="font-medium text-foreground">capture groups</strong>{" "}
            so you can confirm parentheses line up with the data you intend to
            extract.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This implementation deliberately mirrors{" "}
            <strong className="font-medium text-foreground">
              ECMAScript RegExp
            </strong>{" "}
            semantics. If you are migrating configs from YAML or JSON, validate
            those payloads first with our{" "}
            <Link
              href="/dev/yaml-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              YAML to JSON converter
            </Link>{" "}
            and{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter
            </Link>
            , then layer regex filters on top of the normalized text.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this regex debugger (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Enter the{" "}
                <strong className="font-medium text-foreground">
                  pattern body only
                </strong>
                —omit the <code className="font-mono text-sm">/</code>{" "}
                delimiters you might type in a script. Escapes such as{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  \d
                </code>{" "}
                or{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  \s
                </code>{" "}
                work the same as in source code.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Select{" "}
                <strong className="font-medium text-foreground">flags</strong>{" "}
                with the checkboxes. Start with{" "}
                <strong className="font-medium text-foreground">g</strong> when
                you expect multiple hits, add{" "}
                <strong className="font-medium text-foreground">i</strong> for
                case-insensitive matching, and enable{" "}
                <strong className="font-medium text-foreground">m</strong> or{" "}
                <strong className="font-medium text-foreground">s</strong> when
                your subject spans multiple lines.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Paste a{" "}
                <strong className="font-medium text-foreground">
                  representative subject
                </strong>{" "}
                into the test string field. Include both positive examples and
                tricky negatives so you can spot false positives early.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read the{" "}
                <strong className="font-medium text-foreground">
                  highlighted preview
                </strong>{" "}
                for coverage, then scan the{" "}
                <strong className="font-medium text-foreground">match list</strong>{" "}
                for indexes, the full match, and every capture. When you need to
                compare two drafts of a pattern side by side, paste both outputs
                into our{" "}
                <Link
                  href="/dev/code-diff"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  code diff checker
                </Link>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Regex flags cheat sheet (g, i, m, s, u, y, d)
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">g (global)</strong>{" "}
            keeps searching after the first success; without it, only the first
            match is reported—mirroring how{" "}
            <code className="font-mono text-sm">String.prototype.match</code>{" "}
            behaves in many scenarios.{" "}
            <strong className="font-medium text-foreground">i</strong> folds ASCII
            case; pair it with{" "}
            <strong className="font-medium text-foreground">u</strong> when you
            rely on Unicode-aware character classes or property escapes.{" "}
            <strong className="font-medium text-foreground">m</strong> changes{" "}
            <code className="font-mono text-sm">^</code> and{" "}
            <code className="font-mono text-sm">$</code> so they align to line
            starts and ends, while{" "}
            <strong className="font-medium text-foreground">s</strong> lets{" "}
            <code className="font-mono text-sm">.</code> swallow newline
            characters—handy for logs and HTML snippets you also analyze with our{" "}
            <Link
              href="/dev/html-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML formatter
            </Link>{" "}
            or{" "}
            <Link
              href="/dev/xml-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              XML formatter
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Capture groups, backreferences, and named groups
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Each pair of unescaped parentheses creates a{" "}
            <strong className="font-medium text-foreground">
              numbered capture
            </strong>
            , available as{" "}
            <code className="font-mono text-sm">$1</code>,{" "}
            <code className="font-mono text-sm">$2</code>, … inside replacement
            strings, or as{" "}
            <code className="font-mono text-sm">\1</code> inside the pattern for
            backreferences.{" "}
            <strong className="font-medium text-foreground">Named groups</strong>{" "}
            use the{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              (?&lt;name&gt;…)
            </code>{" "}
            syntax; when present, the debugger lists them by name so you can
            align regex extraction with object keys in your application layer.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            When to pair regex with text and SEO utilities
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Regular expressions shine for{" "}
            <strong className="font-medium text-foreground">
              structured-but-noisy text
            </strong>
            : extracting IDs from URLs, normalizing whitespace, or splitting CSV-like
            fragments before you feed data into spreadsheets. When the task is
            bulk substitution rather than inspection alone, combine this page with
            the{" "}
            <Link
              href="/text/find-replace"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              find and replace tool
            </Link>{" "}
            (plain text or regex). For marketing and SEO workflows that start from
            live pages—not arbitrary strings—use{" "}
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
            to pull HTML attributes first, then apply regex only on the fragments
            you export.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related free developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Explore the full{" "}
            <Link
              href="/#code-developer-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              code and developer tools
            </Link>{" "}
            section on the home page, or open a focused utility below.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {relatedTools.slice(0, 12).map((tool) => (
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
            {regexTesterFaqItems.map((item) => (
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
