import type { Metadata } from "next";
import Link from "next/link";
import { CaesarCipherTool } from "./caesar-cipher-tool";
import { caesarCipherFaqItems } from "@/lib/caesar-cipher-faq";
import { toolSections } from "@/lib/tool-catalog";

const textTools =
  toolSections.find((s) => s.id === "text-string-tools")?.tools ?? [];
const relatedTools = textTools.filter((t) => t.href !== "/text/caesar-cipher");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/text/caesar-cipher",
  },
};

export default function CaesarCipherPage() {
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
            <span className="text-foreground">Caesar cipher tool</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Caesar cipher encoder &amp; decoder — custom shift, encrypt and
            decrypt online
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online Caesar cipher tool
            </strong>{" "}
            to{" "}
            <strong className="font-medium text-foreground">
              encrypt or decrypt text
            </strong>{" "}
            with any integer shift (applied modulo 26 on Latin letters). It is a
            classic{" "}
            <strong className="font-medium text-foreground">
              substitution cipher
            </strong>{" "}
            often introduced in cryptography courses, escape rooms, and CTF
            warm-ups: each{" "}
            <strong className="font-medium text-foreground">A–Z</strong> and{" "}
            <strong className="font-medium text-foreground">a–z</strong>{" "}
            character moves forward for encrypt or backward for decrypt;
            numbers, punctuation, spaces, and non-ASCII letters stay untouched so
            you can mix prose with codes. Processing runs{" "}
            <strong className="font-medium text-foreground">
              entirely in your browser
            </strong>
            —paste a message, upload a{" "}
            <strong className="font-medium text-foreground">.txt</strong> file,
            adjust the shift with the numeric field or slider, then use the{" "}
            <strong className="font-medium text-foreground">copy</strong>{" "}
            control on the output. For comparing two versions of the same passage
            after different shifts, open our{" "}
            <Link
              href="/text/diff-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              text diff checker
            </Link>
            . When you need word counts for write-ups or keys, use the{" "}
            <Link
              href="/text/word-counter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              word counter
            </Link>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <CaesarCipherTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            What is a Caesar cipher (and when to use this page)
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Named after Julius Caesar, who reportedly used a shift of three on
            military dispatches, the{" "}
            <strong className="font-medium text-foreground">
              Caesar shift cipher
            </strong>{" "}
            maps the alphabet to itself by a fixed rotation. A{" "}
            <strong className="font-medium text-foreground">
              Caesar cipher decoder
            </strong>{" "}
            reverses that rotation. Because there are only 25 non-trivial shifts,
            anyone can break the code by brute force or{" "}
            <strong className="font-medium text-foreground">
              frequency analysis
            </strong>{" "}
            on English text. Treat this utility as a{" "}
            <strong className="font-medium text-foreground">
              learning aid, puzzle helper, or toy obfuscator
            </strong>
            —not as confidentiality for passwords, API tokens, or personal data.
            For structured payloads after you transform strings, validate syntax
            with the{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter &amp; validator
            </Link>
            .
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Educators use a{" "}
            <strong className="font-medium text-foreground">
              Caesar cipher encoder
            </strong>{" "}
            to demonstrate modular arithmetic and the limits of simple
            substitution. Developers sometimes show the same idea when
            explaining hashing versus encryption: shifting letters is reversible
            and keyspace-tiny; real systems use algorithms designed to resist
            known attacks. If you are normalizing identifiers or headings rather
            than enciphering, the{" "}
            <Link
              href="/text/case-converter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              text case converter
            </Link>{" "}
            is the better fit.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this Caesar cipher tool (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste plaintext or ciphertext into the input, or click{" "}
                <strong className="font-medium text-foreground">
                  Upload .txt
                </strong>{" "}
                to load UTF-8 plain text. Try{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                for a short mixed-case example with punctuation and digits.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Under <strong className="font-medium text-foreground">
                  Direction
                </strong>
                , choose{" "}
                <strong className="font-medium text-foreground">Encrypt</strong>{" "}
                to shift letters forward or{" "}
                <strong className="font-medium text-foreground">Decrypt</strong>{" "}
                to shift backward by the same magnitude.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Set the{" "}
                <strong className="font-medium text-foreground">Shift</strong>{" "}
                to any integer; the tool applies it modulo 26 to Latin letters.
                The label shows the{" "}
                <strong className="font-medium text-foreground">
                  effective letter shift
                </strong>{" "}
                (0–25). You can fine-tune with the range slider or type values
                like <code className="text-sm">29</code> (equivalent to shift{" "}
                <code className="text-sm">3</code>).
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read the output textarea and click the{" "}
                <strong className="font-medium text-foreground">copy</strong>{" "}
                icon to place the result on the clipboard. If the browser blocks
                clipboard access, select the text and use Ctrl+C or Cmd+C.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                To verify round-trips, encrypt with shift{" "}
                <code className="text-sm">k</code>, copy the ciphertext back into
                input, switch to Decrypt with the same{" "}
                <code className="text-sm">k</code>, and confirm you recover the
                original (aside from characters that were never shifted).
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and search intents this guide covers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Readers look for a{" "}
            <strong className="font-medium text-foreground">
              Caesar cipher online
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              Caesar shift decoder
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              ROT13 vs Caesar
            </strong>{" "}
            differences, or a quick way to{" "}
            <strong className="font-medium text-foreground">
              encode a secret message
            </strong>{" "}
            for a classroom demo. This page supports those intents with
            client-side transforms, clear encrypt/decrypt modes, and explanations
            of modulo-26 behavior. Teachers comparing ciphertext lengths or line
            counts can pair this tool with the{" "}
            <Link
              href="/text/duplicate-line-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              duplicate line remover
            </Link>{" "}
            when cleaning word lists for exercises.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            ROT13, Affine ciphers, and what this tool does not do
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">ROT13</strong> is a
            fixed Caesar shift of 13: applying it twice returns the original
            text. Our catalog also lists a dedicated{" "}
            <Link
              href="/text/rot13"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              ROT13 encoder &amp; decoder
            </Link>{" "}
            route for that special case. An{" "}
            <strong className="font-medium text-foreground">
              affine cipher
            </strong>{" "}
            multiplies and adds modulo 26; this page only performs pure shifts.
            We do not remove diacritics, transliterate scripts, or implement
            Vigenère—those require different rulesets. For URL-safe strings after
            you derive tokens, consider the URL tools in the site catalog rather
            than chaining multiple classical ciphers.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy, limits, and responsible use
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            The Caesar cipher calculator runs locally in your tab: no ciphertext
            upload is required for the transform itself. Extremely large pasted
            buffers may make the browser sluggish; for multi-megabyte logs, use a
            desktop script. Never rely on Caesar for{" "}
            <strong className="font-medium text-foreground">
              passwords, HIPAA, or financial data
            </strong>
            —use vetted cryptography libraries and key management instead.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related text &amp; string tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browse the full{" "}
            <Link
              href="/#text-string-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Text &amp; String Tools
            </Link>{" "}
            section on the home page for the growing catalog. Highlights from the
            same family:
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
            {caesarCipherFaqItems.map((item) => (
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
