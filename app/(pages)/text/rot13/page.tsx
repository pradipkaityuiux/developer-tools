import type { Metadata } from "next";
import Link from "next/link";
import { Rot13Tool } from "./rot13-tool";
import { rot13FaqItems } from "@/lib/rot13-faq";
import { toolSections } from "@/lib/tool-catalog";

const textTools =
  toolSections.find((s) => s.id === "text-string-tools")?.tools ?? [];
const relatedTools = textTools.filter((t) => t.href !== "/text/rot13");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/text/rot13",
  },
};

export default function Rot13Page() {
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
            <span className="text-foreground">ROT13 encoder &amp; decoder</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            ROT13 encoder &amp; decoder — online rotate-by-13 cipher for
            spoilers, puzzles, and quick text transforms
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              ROT13 encoder and decoder
            </strong>{" "}
            to{" "}
            <strong className="font-medium text-foreground">
              rotate Latin letters by 13 positions
            </strong>{" "}
            in real time. ROT13 is the fixed-shift Caesar cipher where{" "}
            <strong className="font-medium text-foreground">A→N</strong>,{" "}
            <strong className="font-medium text-foreground">B→O</strong>, and
            so on through the alphabet, wrapping past{" "}
            <strong className="font-medium text-foreground">Z</strong>. Because{" "}
            <strong className="font-medium text-foreground">
              13 + 13 = 26
            </strong>
            , the same operation{" "}
            <strong className="font-medium text-foreground">
              encodes and decodes
            </strong>
            —perfect for{" "}
            <strong className="font-medium text-foreground">
              Usenet-style spoiler text
            </strong>
            , classroom demos, capture-the-flag riddles, and legacy forum jokes.
            Your content stays{" "}
            <strong className="font-medium text-foreground">
              in the browser
            </strong>
            : paste a paragraph,{" "}
            <strong className="font-medium text-foreground">
              upload a .txt file
            </strong>
            , then{" "}
            <strong className="font-medium text-foreground">
              copy the ROT13 output
            </strong>{" "}
            with one click. Pair this page with our{" "}
            <Link
              href="/text/case-converter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              text case converter
            </Link>
            ,{" "}
            <Link
              href="/dev/html-entities"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML entity encoder &amp; decoder
            </Link>
            , and{" "}
            <Link
              href="/dev/regex-tester"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              regex tester &amp; debugger
            </Link>{" "}
            when you are normalizing copy for the web or batch-editing patterns.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <Rot13Tool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            What ROT13 is (and when to use an online ROT13 tool)
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Searchers look for an{" "}
            <strong className="font-medium text-foreground">
              ROT13 translator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              ROT 13 decoder
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              Caesar cipher ROT13
            </strong>{" "}
            when they need a reversible tweak without installing software. ROT13
            only scrambles{" "}
            <strong className="font-medium text-foreground">
              basic Latin letters
            </strong>
            ; numbers, spaces, newlines, and symbols pass through unchanged, which
            keeps filenames, code-like tokens, and markdown structure intact as
            long as you avoid expecting non-ASCII letters to rotate. Treat it as{" "}
            <strong className="font-medium text-foreground">
              lightweight obfuscation
            </strong>
            , not protection—anyone can read the message in seconds.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Content teams sometimes compare ROT13 to other string utilities: after
            you unwrap a spoiler or puzzle line, you might still need a{" "}
            <Link
              href="/text/word-counter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              word counter
            </Link>{" "}
            for CMS limits, a{" "}
            <Link
              href="/text/diff-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              text diff checker
            </Link>{" "}
            for comparing drafts, or a{" "}
            <Link
              href="/text/duplicate-line-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              duplicate line remover
            </Link>{" "}
            for cleaning pasted lists.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this ROT13 encoder (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste text into the input area or click{" "}
                <strong className="font-medium text-foreground">
                  Upload .txt
                </strong>{" "}
                to load UTF-8 plain text. Use{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                to see mixed plain and ROT13 lines side by side.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Watch the{" "}
                <strong className="font-medium text-foreground">
                  Output (ROT13)
                </strong>{" "}
                panel update instantly. Each letter in{" "}
                <strong className="font-medium text-foreground">A–Z</strong> /{" "}
                <strong className="font-medium text-foreground">a–z</strong>{" "}
                moves thirteen steps forward in the alphabet, wrapping from{" "}
                <strong className="font-medium text-foreground">Z</strong> to{" "}
                <strong className="font-medium text-foreground">A</strong>.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Tap the{" "}
                <strong className="font-medium text-foreground">copy</strong>{" "}
                icon on the output field to copy the transformed text. If the
                browser blocks clipboard access, select the output and use
                Ctrl+C (Windows) or Cmd+C (macOS).
              </span>
            </li>
            <li>
              <span className="text-foreground">
                To decode, paste the ROT13 text back into the input (or run the
                same transform again)—the cipher is{" "}
                <strong className="font-medium text-foreground">
                  self-inverse
                </strong>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and workflows: ROT13 vs Caesar, security, and UTF-8
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            People often ask how{" "}
            <strong className="font-medium text-foreground">
              ROT13 differs from a general Caesar cipher
            </strong>
            : ROT13 fixes the shift at 13, the unique value where encryption and
            decryption coincide on the 26-letter alphabet. A variable-shift
            Caesar tool (see the{" "}
            <Link
              href="/text/caesar-cipher"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Caesar cipher tool
            </Link>{" "}
            in our catalog when published) is better when you need custom
            offsets for exercises. Neither replaces TLS, disk encryption, or
            modern AEAD schemes. For percent-encoding and URLs, use the{" "}
            <Link
              href="/dev/url-encoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              URL encoder and decoder
            </Link>{" "}
            instead of guessing with letter rotation.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            If you edit articles that mix prose and markup, run ROT13 only on
            the spoiler fragment, then use the{" "}
            <Link
              href="/dev/html-entities"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML entity tool
            </Link>{" "}
            when you need <code className="text-sm">&amp;</code>,{" "}
            <code className="text-sm">&lt;</code>, and quotes escaped for
            attributes or JSON-adjacent snippets.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Limitations and honest expectations
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            This page implements classic ASCII-range ROT13: accented Latin
            letters and other Unicode scripts are not rotated, which matches how
            most historical ROT13 examples behave. Extremely large pastes may
            feel sluggish in older browsers; split logs or use local tooling for
            multi-megabyte files. Remember that{" "}
            <strong className="font-medium text-foreground">
              ROT13 is trivially reversible
            </strong>
            —do not use it for passwords, API keys, or personal data.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related text &amp; string tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Explore the full{" "}
            <Link
              href="/#text-string-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Text &amp; String Tools
            </Link>{" "}
            section on the home page for the growing catalog. Other entries in
            that list:
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
            {rot13FaqItems.map((item) => (
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
