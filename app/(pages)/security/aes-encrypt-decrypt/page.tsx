import type { Metadata } from "next";
import Link from "next/link";
import { AesEncryptDecryptTool } from "./aes-encrypt-decrypt-tool";
import { aesEncryptDecryptFaqItems } from "@/lib/aes-encrypt-decrypt-faq";
import { toolSections } from "@/lib/tool-catalog";

const securityTools =
  toolSections.find((s) => s.id === "security-encryption-tools")?.tools ?? [];
const relatedTools = securityTools.filter(
  (t) => t.href !== "/security/aes-encrypt-decrypt",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/security/aes-encrypt-decrypt",
  },
};

export default function AesEncryptDecryptPage() {
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
            <span className="text-foreground">AES encrypt &amp; decrypt</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            AES-256 encrypt and decrypt online — GCM mode, PBKDF2 passphrase,
            client-side Web Crypto
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              AES encryption tool
            </strong>{" "}
            to turn UTF-8 text into a single-line{" "}
            <strong className="font-medium text-foreground">
              authenticated ciphertext bundle
            </strong>{" "}
            using{" "}
            <strong className="font-medium text-foreground">AES-256-GCM</strong>{" "}
            and a passphrase stretched with{" "}
            <strong className="font-medium text-foreground">
              PBKDF2-HMAC-SHA256
            </strong>
            . The same page{" "}
            <strong className="font-medium text-foreground">
              decrypts AES ciphertext
            </strong>{" "}
            produced here: paste the{" "}
            <strong className="font-medium text-foreground">v1:</strong> string,
            enter your passphrase, and recover the original message.{" "}
            <strong className="font-medium text-foreground">
              Copy output
            </strong>{" "}
            uses the copy icon;{" "}
            <strong className="font-medium text-foreground">Upload file</strong>{" "}
            uses the upload icon to load UTF-8 text from disk. Everything runs{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>{" "}
            via the Web Crypto API—ideal for learning{" "}
            <strong className="font-medium text-foreground">
              symmetric encryption
            </strong>
            , API mocks, and local experiments. Pair this workflow with the{" "}
            <Link
              href="/dev/hash-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              hash generator
            </Link>{" "}
            for checksums, the{" "}
            <Link
              href="/security/hmac-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HMAC generator
            </Link>{" "}
            for keyed digests, and the{" "}
            <Link
              href="/security/password-strength"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              password strength meter
            </Link>{" "}
            when you tune passphrases. Browse every{" "}
            <Link
              href="/#security-encryption-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              security and encryption tool
            </Link>{" "}
            from the home page.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <AesEncryptDecryptTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            What is AES-256-GCM and why use it for text encryption?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">AES</strong>{" "}
            (Advanced Encryption Standard) with a 256-bit key is the symmetric
            algorithm most production systems rely on for bulk data protection.
            In{" "}
            <strong className="font-medium text-foreground">GCM mode</strong>,
            each message uses a fresh random IV (nonce) and produces an
            authentication tag so ciphertext cannot be tampered with silently.
            That combination—confidentiality plus integrity—is what people mean
            by &quot;authenticated encryption&quot; in modern TLS and application
            crypto. This page targets searches like{" "}
            <strong className="font-medium text-foreground">
              AES encrypt online
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              AES-256 decrypt text
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              browser Web Crypto AES example
            </strong>{" "}
            while keeping keys derived from a passphrase you type, not from a
            pre-shared binary key file.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Passphrases are rarely 32 bytes of entropy on their own, so this tool
            applies{" "}
            <strong className="font-medium text-foreground">PBKDF2</strong>{" "}
            with SHA-256, a random 128-bit salt, and a configurable iteration
            count. The salt and iteration count travel inside the{" "}
            <strong className="font-medium text-foreground">v1 bundle</strong>,
            so decryption only needs the passphrase and the pasted line—no
            separate metadata file. For password{" "}
            <em>storage</em> (logins), prefer dedicated password hashes such as
            bcrypt; use AES when you need to recover the original secret later,
            which is why teams still look for an{" "}
            <strong className="font-medium text-foreground">
              AES encrypt decrypt
            </strong>{" "}
            workflow for documents, tokens at rest in dev environments, or
            teaching materials.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this AES encrypt and decrypt tool (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Open the <strong className="font-medium text-foreground">
                  Encrypt
                </strong>{" "}
                tab, enter a strong{" "}
                <strong className="font-medium text-foreground">
                  passphrase
                </strong>
                , and set{" "}
                <strong className="font-medium text-foreground">
                  PBKDF2 iterations
                </strong>{" "}
                (default 150,000). Higher iterations slow down brute-force
                guessing but take longer on low-end devices.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Paste UTF-8 plaintext or click{" "}
                <strong className="font-medium text-foreground">
                  Upload file
                </strong>{" "}
                (upload icon) to load a{" "}
                <strong className="font-medium text-foreground">
                  .txt or UTF-8 file
                </strong>
                . Click <strong className="font-medium text-foreground">
                  Encrypt
                </strong>
                ; the ciphertext appears as one line beginning with{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-900">
                  v1:
                </code>
                .
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use{" "}
                <strong className="font-medium text-foreground">
                  Copy output
                </strong>{" "}
                (copy icon) to store the bundle in a note, ticket, or config
                slot. Do not trim or edit the string—whitespace inside Base64
                matters once you normalize line breaks.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                To decrypt, switch to{" "}
                <strong className="font-medium text-foreground">Decrypt</strong>
                , paste the full{" "}
                <strong className="font-medium text-foreground">v1:</strong>{" "}
                line, type the same passphrase, and click{" "}
                <strong className="font-medium text-foreground">Decrypt</strong>
                . The iteration count is read from the bundle, so you do not
                re-enter it. Copy recovered plaintext with the same copy
                control.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                When something fails, verify the passphrase, ensure the bundle
                is complete, and cross-check related workflows:{" "}
                <Link
                  href="/dev/base64"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  Base64 encode/decode
                </Link>{" "}
                if another system wrapped the payload differently, or the{" "}
                <Link
                  href="/security/jwt-encoder"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  JWT encoder
                </Link>{" "}
                if you are mixing token formats.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Security notes for developers and students
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Treat this page as a{" "}
            <strong className="font-medium text-foreground">
              learning and testing utility
            </strong>
            , not a replacement for audited key management, HSMs, or regulated
            controls. Side-channel resistance, secure memory, and update policies
            differ between browsers and native code. If you ship production
            features, use well-maintained libraries in your stack, store secrets
            in vaults or KMS, and rotate keys on a schedule. For transport
            security you still rely on{" "}
            <strong className="font-medium text-foreground">TLS</strong>; this
            tool addresses symmetric encryption of content at rest or in
            copy-paste workflows, not HTTPS itself. When you evaluate how strong
            a passphrase is before trusting it here, run it through the{" "}
            <Link
              href="/security/password-strength"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              password strength meter
            </Link>{" "}
            and read the guidance on length and character sets.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related security and developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            More from the{" "}
            <Link
              href="/#security-encryption-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              security and encryption tools
            </Link>{" "}
            section:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {relatedTools.map((tool) => (
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
            {aesEncryptDecryptFaqItems.map((item) => (
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
