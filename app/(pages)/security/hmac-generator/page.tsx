import type { Metadata } from "next";
import Link from "next/link";
import { HmacGeneratorTool } from "./hmac-generator-tool";
import { hmacGeneratorFaqItems } from "@/lib/hmac-generator-faq";
import { toolSections } from "@/lib/tool-catalog";

const securityTools =
  toolSections.find((s) => s.id === "security-encryption-tools")?.tools ?? [];
const relatedTools = securityTools.filter(
  (t) => t.href !== "/security/hmac-generator",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/security/hmac-generator",
  },
};

export default function HmacGeneratorPage() {
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
            <span className="text-foreground">HMAC generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            HMAC generator online — HMAC-SHA256 and HMAC-SHA512 with a secret for
            webhooks and API signatures
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online HMAC generator
            </strong>{" "}
            to compute{" "}
            <strong className="font-medium text-foreground">HMAC-SHA256</strong>{" "}
            or{" "}
            <strong className="font-medium text-foreground">HMAC-SHA512</strong>{" "}
            over any string you provide, using a{" "}
            <strong className="font-medium text-foreground">
              shared secret key
            </strong>{" "}
            encoded as{" "}
            <strong className="font-medium text-foreground">UTF-8</strong>. The
            result is a{" "}
            <strong className="font-medium text-foreground">
              cryptographic authentication tag
            </strong>{" "}
            you can compare to webhook signatures (Stripe, GitHub, Slack-style
            flows), signed callbacks, or custom API gateways. Copy the digest with
            the{" "}
            <strong className="font-medium text-foreground">copy icon</strong>{" "}
            next to{" "}
            <strong className="font-medium text-foreground">
              Copy signature
            </strong>
            ; load a local text file into the secret or message fields with{" "}
            <strong className="font-medium text-foreground">Upload file</strong>{" "}
            and the{" "}
            <strong className="font-medium text-foreground">upload icon</strong>
            . Everything runs{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>{" "}
            via the{" "}
            <strong className="font-medium text-foreground">Web Crypto API</strong>
            . When you only need an unkeyed digest of text, use our{" "}
            <Link
              href="/dev/hash-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              hash generator
            </Link>{" "}
            for MD5 and SHA-family checksums. For symmetric encryption with a
            passphrase, see{" "}
            <Link
              href="/security/aes-encrypt-decrypt"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              AES encrypt and decrypt
            </Link>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <HmacGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            What is HMAC and why do developers search for an HMAC calculator?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="font-medium text-foreground">HMAC</strong> (Hash-based
            Message Authentication Code) combines a{" "}
            <strong className="font-medium text-foreground">secret key</strong> with
            a hash function so that only someone who knows the key can produce the
            same tag for a given message. Unlike a plain{" "}
            <strong className="font-medium text-foreground">SHA-256 hash</strong>,
            an attacker cannot forge a valid tag from the message alone. Teams look
            for an{" "}
            <strong className="font-medium text-foreground">
              HMAC SHA256 online
            </strong>{" "}
            tool when they debug{" "}
            <strong className="font-medium text-foreground">
              webhook signature verification
            </strong>
            , compare a header to a locally computed value, or document
            integration tests that show sample inputs and expected tags. This page
            focuses on{" "}
            <strong className="font-medium text-foreground">
              HMAC-SHA256 and HMAC-SHA512
            </strong>{" "}
            because those are what most modern APIs specify.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Keywords that match this tool include{" "}
            <strong className="font-medium text-foreground">
              webhook signature generator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              API HMAC test
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              signed request debugging
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              UTF-8 HMAC
            </strong>{" "}
            — because byte-for-byte agreement with the provider depends on encoding
            and on the exact string being signed (often the raw HTTP body before JSON
            parsing).
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this HMAC generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste your{" "}
                <strong className="font-medium text-foreground">
                  signing secret
                </strong>{" "}
                into the secret field, or click{" "}
                <strong className="font-medium text-foreground">
                  Upload file
                </strong>{" "}
                to load a UTF-8 key from disk. Use{" "}
                <strong className="font-medium text-foreground">Show</strong> to
                confirm there are no accidental spaces or wrong characters.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Paste the{" "}
                <strong className="font-medium text-foreground">
                  message or payload
                </strong>{" "}
                — for JSON webhooks, that is usually the raw JSON string as received,
                not pretty-printed unless the provider signs pretty-printed bytes.
                Upload a file if your fixture lives in a repo.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Choose{" "}
                <strong className="font-medium text-foreground">
                  HMAC-SHA256 or HMAC-SHA512
                </strong>{" "}
                and whether you need{" "}
                <strong className="font-medium text-foreground">
                  lowercase hexadecimal
                </strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">Base64</strong> to
                match documentation (some systems prefix hex with{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  sha256=
                </code>{" "}
                in headers—add that prefix yourself when comparing).
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Copy signature
                </strong>{" "}
                (with the copy icon) and paste the value next to your server-side
                computation or ticket. If the tag does not match, normalize the
                payload with our{" "}
                <Link
                  href="/dev/json-formatter"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  JSON formatter
                </Link>{" "}
                only after you confirm whether the signer uses canonical JSON.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            HMAC vs plain hashing: when to use each
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use{" "}
            <strong className="font-medium text-foreground">HMAC</strong> when two
            parties share a secret and need to prove authenticity of a message. Use a
            plain digest from the{" "}
            <Link
              href="/dev/hash-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              hash generator
            </Link>{" "}
            for integrity of public content (checksums, cache keys) where no secret is
            involved. For password storage, use dedicated password hashes (see{" "}
            <Link
              href="/security/password-strength"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              password strength meter
            </Link>{" "}
            and industry guidance on bcrypt or Argon2), not HMAC of passwords in
            logs.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Encoding pitfalls: why verification fails even with the “same” JSON
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            HMAC is computed over{" "}
            <strong className="font-medium text-foreground">bytes</strong>. A
            trailing newline, different Unicode normalization, or re-serialized JSON
            with another key order changes the tag. If you transport binary inside
            text, round-trip through{" "}
            <Link
              href="/dev/base64"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Base64 encode and decode
            </Link>{" "}
            only when the protocol says to. Align with your provider’s test vectors
            before filing a bug.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and security notes
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Signing runs locally; we do not receive your secret or message. For
            production keys, prefer dedicated secret managers and never paste live
            credentials into shared screens. For asymmetric signing and key pairs,
            use the{" "}
            <Link
              href="/security/rsa-key-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              RSA key pair generator
            </Link>{" "}
            when you need public-key workflows instead of shared HMAC secrets.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related security and encryption tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Browse the full{" "}
            <Link
              href="/#security-encryption-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              security and encryption tools
            </Link>{" "}
            section on the home page. Highlights from the catalog:
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
            {hmacGeneratorFaqItems.map((item) => (
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
