import type { Metadata } from "next";
import Link from "next/link";
import { HashGeneratorTool } from "./hash-generator-tool";
import { hashGeneratorFaqItems } from "@/lib/hash-generator-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/hash-generator");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/hash-generator",
  },
};

export default function HashGeneratorPage() {
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
            <span className="text-foreground">Hash generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Hash generator online — MD5, SHA-1, SHA-256, and SHA-512 from text
            (UTF-8)
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online hash generator
            </strong>{" "}
            to compute{" "}
            <strong className="font-medium text-foreground">MD5</strong>,{" "}
            <strong className="font-medium text-foreground">SHA-1</strong>,{" "}
            <strong className="font-medium text-foreground">SHA-256</strong>,
            and{" "}
            <strong className="font-medium text-foreground">SHA-512</strong>{" "}
            digests from any string you paste. Input is encoded as{" "}
            <strong className="font-medium text-foreground">UTF-8 bytes</strong>{" "}
            before hashing, so your{" "}
            <strong className="font-medium text-foreground">
              hexadecimal checksum
            </strong>{" "}
            matches command-line tools that default to UTF-8. Output stays{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            : SHA-family hashes use the{" "}
            <strong className="font-medium text-foreground">Web Crypto API</strong>
            , and MD5 runs locally with a small library—ideal for API mocks,
            cache keys, release notes, and quick comparisons with published{" "}
            <strong className="font-medium text-foreground">file hashes</strong>
            . Pair it with our{" "}
            <Link
              href="/dev/base64"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Base64 encoder and decoder
            </Link>{" "}
            when you move binary through text transports, and with the{" "}
            <Link
              href="/dev/jwt-decoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JWT decoder
            </Link>{" "}
            when you inspect signed payloads (verification still needs keys on
            the server).
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <HashGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            What is a cryptographic hash and when do developers use one?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            A{" "}
            <strong className="font-medium text-foreground">
              cryptographic hash function
            </strong>{" "}
            maps input of any size to a short, fixed-length{" "}
            <strong className="font-medium text-foreground">digest</strong>.
            Changing a single character usually produces a completely different
            hex string, which is why hashes help detect accidental corruption,
            compare artifacts, and document downloads. They are not encryption:
            you cannot recover the original text from the digest alone. For
            passwords you should use dedicated slow algorithms (bcrypt,
            Argon2, scrypt)—this page is for{" "}
            <strong className="font-medium text-foreground">
              checksums and testing
            </strong>
            , not production credential storage.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Teams still search for an{" "}
            <strong className="font-medium text-foreground">
              MD5 checksum generator
            </strong>{" "}
            when they reconcile legacy manifests, mirror old ISO listings, or
            debug ETag-style cache behavior. New work should standardize on{" "}
            <strong className="font-medium text-foreground">SHA-256</strong> or{" "}
            <strong className="font-medium text-foreground">SHA-512</strong>{" "}
            because those algorithms remain collision-resistant for practical
            threat models today. When you verify TLS assets, cross-check
            certificate details with our{" "}
            <Link
              href="/website/ssl-certificate-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SSL certificate checker
            </Link>{" "}
            and look for published SHA-256 fingerprints in your provider docs.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this hash generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste or type the exact text you want to digest. Click{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                to populate the classic pangram and confirm all four algorithms
                match reference values you may know from other tools.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Watch the{" "}
                <strong className="font-medium text-foreground">
                  UTF-8 byte length
                </strong>{" "}
                line under the editor. If a checksum from a file does not match,
                confirm line endings (CRLF vs LF), trailing spaces, and BOM
                bytes—those all change the underlying byte sequence.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                After a brief pause, read the lowercase hex values in the table.
                Use{" "}
                <strong className="font-medium text-foreground">Copy</strong> on
                a row or{" "}
                <strong className="font-medium text-foreground">
                  Copy all digests
                </strong>{" "}
                for a multi-line summary you can drop into Slack, Jira, or a
                README.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                When you need identifiers instead of deterministic digests of
                content, generate random{" "}
                <Link
                  href="/dev/uuid-generator"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  UUID v4 values
                </Link>
                . When you need safe transport of arbitrary bytes inside ASCII,
                round-trip through the{" "}
                <Link
                  href="/dev/base64"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  Base64 tool
                </Link>{" "}
                before or after hashing, depending on your pipeline.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            MD5 vs SHA-1 vs SHA-256 vs SHA-512 (quick guide)
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">MD5</strong> produces
            a 128-bit digest and is extremely fast. It is broken for collision
            attacks, so treat it as a convenience checksum, not a security
            boundary.{" "}
            <strong className="font-medium text-foreground">SHA-1</strong>{" "}
            outputs 160 bits and is also deprecated for signatures and TLS; some
            browsers restrict SHA-1 in{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              subtle.digest
            </code>
            . <strong className="font-medium text-foreground">SHA-256</strong>{" "}
            (256 bits) is the de facto standard for release artifacts, container
            layers, and SBOM references.{" "}
            <strong className="font-medium text-foreground">SHA-512</strong>{" "}
            doubles the state size; on 64-bit CPUs it can be faster than SHA-256
            for large payloads, but both are fine for short strings in this UI.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords teams search for (and how this page maps to them)
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            People look for an{" "}
            <strong className="font-medium text-foreground">
              MD5 hash calculator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              SHA-256 online
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              string to hash
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              generate checksum from text
            </strong>{" "}
            when they debug CI logs, compare CDN objects, or validate webhook
            signatures during integration tests. This tool answers those intents
            with explicit UTF-8 behavior and visible byte length. If your
            workflow centers on URLs and query strings, normalize with the{" "}
            <Link
              href="/dev/url-encoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              URL encoder and decoder
            </Link>{" "}
            before hashing so percent-encoding matches what the server receives.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Encoding pitfalls: why two “identical” strings hash differently
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Hashing operates on{" "}
            <strong className="font-medium text-foreground">bytes</strong>, not
            abstract Unicode characters. The same emoji or accented letter can be
            represented with different normalization forms (NFC vs NFD), which
            changes bytes and therefore the digest. Invisible characters—zero
            width space, non-breaking space, or a final newline added by your
            editor—also shift results. When comparing against another system,
            dump hex bytes or use a structured format like JSON and hash the
            canonical serialized form both sides agree on. Our{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter and validator
            </Link>{" "}
            helps you inspect payloads before you freeze a checksum over them.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy, security, and what this tool does not do
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Nothing leaves your tab for hashing. That makes the page safe for
            proprietary strings, but remember that{" "}
            <strong className="font-medium text-foreground">
              screen recorders and shoulder surfing
            </strong>{" "}
            still apply—do not paste production secrets into shared machines. The
            tool does not compute{" "}
            <strong className="font-medium text-foreground">HMAC</strong>{" "}
            (keyed hashes) or verify digital signatures; those require secret
            material and additional libraries. It also does not hash entire
            multi-megabyte files efficiently—use a desktop or CLI utility for
            bulk binaries, or watch for a dedicated file-hash experience in the
            catalog over time.
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
            {hashGeneratorFaqItems.map((item) => (
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
