import type { Metadata } from "next";
import Link from "next/link";
import { PasswordGeneratorTool } from "./password-generator-tool";
import { passwordGeneratorFaqItems } from "@/lib/password-generator-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter(
  (t) => t.href !== "/dev/password-generator",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/password-generator",
  },
};

export default function PasswordGeneratorPage() {
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
            <span className="text-foreground">Password generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Password generator — strong random passwords, custom charset, bulk
            mode for developers
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online password generator
            </strong>{" "}
            to create{" "}
            <strong className="font-medium text-foreground">
              cryptographically random passwords
            </strong>{" "}
            with configurable length,{" "}
            <strong className="font-medium text-foreground">
              uppercase and lowercase letters
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">numbers</strong>, and{" "}
            <strong className="font-medium text-foreground">symbols</strong>.
            Turn on{" "}
            <strong className="font-medium text-foreground">
              exclude ambiguous characters
            </strong>{" "}
            when you read secrets aloud or support users on the phone. Add{" "}
            <strong className="font-medium text-foreground">
              extra characters
            </strong>{" "}
            or{" "}
            <strong className="font-medium text-foreground">
              load a UTF-8 charset file
            </strong>{" "}
            for locale-specific or policy-driven alphabets. Generate a single
            login secret or{" "}
            <strong className="font-medium text-foreground">
              bulk passwords
            </strong>{" "}
            for staging tenants, QA accounts, and load tests—then copy every
            line in one click. Randomness comes from{" "}
            <code className="rounded bg-zinc-200/80 px-1 py-0.5 font-mono text-sm dark:bg-zinc-800">
              crypto.getRandomValues
            </code>
            , so drafts stay{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            . Pair output with our{" "}
            <Link
              href="/dev/dummy-data-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              dummy data generator
            </Link>{" "}
            when you need names and emails beside credentials, or with the{" "}
            <Link
              href="/dev/uuid-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              UUID generator
            </Link>{" "}
            when you need opaque identifiers instead of memorizable strings.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <PasswordGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why developers still need a dedicated password generator
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Product and QA workflows constantly require fresh credentials:
            disposable admin logins, per-environment service accounts, OAuth
            client secrets in .env samples, and CSVs full of users for
            integration suites. A{" "}
            <strong className="font-medium text-foreground">
              strong password generator
            </strong>{" "}
            removes guesswork about length and character classes, enforces at
            least one symbol from each enabled set, and surfaces approximate{" "}
            <strong className="font-medium text-foreground">entropy</strong> so
            you can compare options before you paste into a password manager or
            secret store. Unlike memorized phrases, these values are meant to be
            stored, not typed from memory—optimize for randomness and length,
            not cleverness.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This tool is not a substitute for server-side{" "}
            <strong className="font-medium text-foreground">
              password hashing
            </strong>{" "}
            (Argon2, bcrypt, scrypt). It helps you mint candidate secrets; your
            backend still must hash them with a slow KDF and never log the
            plaintext. When you need deterministic fingerprints of arbitrary
            strings instead of random secrets, use the{" "}
            <Link
              href="/dev/hash-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              hash generator
            </Link>{" "}
            for MD5 or SHA digests in tests—not for live password storage.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this password generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Set{" "}
                <strong className="font-medium text-foreground">length</strong>{" "}
                (4–256) and{" "}
                <strong className="font-medium text-foreground">
                  how many passwords
                </strong>{" "}
                (1–500). Short lengths may be rejected if they cannot satisfy
                every enabled character class after exclusions.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Toggle{" "}
                <strong className="font-medium text-foreground">lowercase</strong>
                ,{" "}
                <strong className="font-medium text-foreground">uppercase</strong>
                ,{" "}
                <strong className="font-medium text-foreground">digits</strong>,
                and{" "}
                <strong className="font-medium text-foreground">symbols</strong>.
                Enable{" "}
                <strong className="font-medium text-foreground">
                  exclude ambiguous
                </strong>{" "}
                to drop easily confused glyphs such as{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  0
                </code>
                ,{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  O
                </code>
                ,{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  1
                </code>
                , and{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  l
                </code>
                .
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Optionally type{" "}
                <strong className="font-medium text-foreground">
                  extra characters
                </strong>{" "}
                or click{" "}
                <strong className="font-medium text-foreground">
                  Load charset file
                </strong>{" "}
                to append UTF-8 code points from a local file—nothing is uploaded
                to a server; the browser reads the file and merges distinct
                characters into the alphabet.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Generate passwords
                </strong>{" "}
                for a fresh batch. Use{" "}
                <strong className="font-medium text-foreground">Copy all</strong>{" "}
                or the copy control on the output box to grab every line. For
                API keys encoded as text, you may also like the{" "}
                <Link
                  href="/dev/base64"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  Base64 encoder and decoder
                </Link>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and search intents this page covers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Teams search for a{" "}
            <strong className="font-medium text-foreground">
              secure random password generator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              password generator with symbols
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              bulk password generator for testing
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              exclude ambiguous characters password
            </strong>
            . This page answers those intents with explicit controls, local-only
            randomness, and copy-friendly output. If you are normalizing URLs or
            query strings before hashing or signing, run them through the{" "}
            <Link
              href="/dev/url-encoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              URL encoder and decoder
            </Link>{" "}
            so bytes match what servers receive.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Entropy, length, and password policy (practical notes)
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            The UI shows an{" "}
            <strong className="font-medium text-foreground">
              approximate entropy estimate
            </strong>{" "}
            assuming each character is drawn uniformly from the displayed
            alphabet. Real-world policies (mandatory rotations, composition
            rules) can reduce usable entropy; this estimate is still useful for
            comparing two configurations side by side. Prefer longer secrets
            over exotic symbol sets when your stack allows—especially for API
            keys and machine-to-machine tokens. Human-facing passwords should
            live in a{" "}
            <strong className="font-medium text-foreground">
              password manager
            </strong>{" "}
            with unique entries per site.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and security boundaries
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Generated values never leave the tab unless you copy them
            elsewhere. Avoid pasting production secrets into shared screen-share
            sessions or ticket systems that retain history. For structured test
            data exports, combine passwords with JSON or CSV using the{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter and validator
            </Link>{" "}
            or{" "}
            <Link
              href="/dev/csv-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV to JSON
            </Link>{" "}
            workflows so fixtures stay readable in code review.
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
            {passwordGeneratorFaqItems.map((item) => (
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
