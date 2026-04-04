import type { Metadata } from "next";
import Link from "next/link";
import { PasswordStrengthTool } from "./password-strength-tool";
import { passwordStrengthFaqItems } from "@/lib/password-strength-faq";
import { toolSections } from "@/lib/tool-catalog";

const securityTools =
  toolSections.find((s) => s.id === "security-encryption-tools")?.tools ?? [];
const relatedTools = securityTools.filter(
  (t) => t.href !== "/security/password-strength",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/security/password-strength",
  },
};

export default function PasswordStrengthPage() {
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
            <span className="text-foreground">Password strength meter</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Password strength meter online — entropy in bits, crack-time brackets,
            and practical hardening guidance
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              password strength checker
            </strong>{" "}
            to estimate{" "}
            <strong className="font-medium text-foreground">
              information entropy
            </strong>{" "}
            from your passphrase length and character mix, then compare{" "}
            <strong className="font-medium text-foreground">
              illustrative crack times
            </strong>{" "}
            for throttled online logins versus fast offline guessing. The meter
            flags{" "}
            <strong className="font-medium text-foreground">
              keyboard walks, sequential digits, repeats,
            </strong>{" "}
            and a handful of{" "}
            <strong className="font-medium text-foreground">
              extremely common passwords
            </strong>{" "}
            so you can iterate before you commit a secret to a password manager.
            Type directly in the box, use{" "}
            <strong className="font-medium text-foreground">Upload .txt</strong>{" "}
            (upload icon) to pull the first non-empty line from a local UTF-8
            file, and click{" "}
            <strong className="font-medium text-foreground">Copy report</strong>{" "}
            (copy icon) to grab a plaintext summary for tickets or runbooks. All
            scoring runs{" "}
            <strong className="font-medium text-foreground">in your browser</strong>
            . When you need a fresh random secret, open the{" "}
            <Link
              href="/dev/password-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              password generator
            </Link>{" "}
            or explore more utilities under{" "}
            <Link
              href="/#security-encryption-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              security and encryption tools
            </Link>{" "}
            on the home page.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <PasswordStrengthTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why measure password strength with entropy and crack-time brackets?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Developers and security teams still need a quick way to explain why
            “P@ssw0rd!” is weaker than it looks. This page targets searches like{" "}
            <strong className="font-medium text-foreground">
              password entropy calculator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              check password strength online
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              how long to crack my password
            </strong>{" "}
            with transparent math: we derive an approximate charset size from the
            character classes you actually use, multiply by length to estimate
            bits, then translate bits into guessed hashes divided by three{" "}
            <strong className="font-medium text-foreground">
              attacker throughput
            </strong>{" "}
            levels. The result is not a guarantee—real breaches combine{" "}
            <strong className="font-medium text-foreground">
              dictionary attacks, credential stuffing, and phishing
            </strong>
            —but it is a consistent teaching tool for RFCs, internal policies, and
            onboarding docs.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Pair this meter with storage-side protections: slow password hashes,
            unique salts, and rate limits on authentication endpoints. When you
            prototype how expensive verification should be, the{" "}
            <Link
              href="/dev/hash-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              hash generator
            </Link>{" "}
            helps compare digests for test vectors, and the catalog&apos;s{" "}
            <Link
              href="/#security-encryption-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              security section
            </Link>{" "}
            lists bcrypt, AES, RSA, JWT, and header helpers as they ship—useful
            when you wire policies end to end.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this password strength meter (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Enter a candidate in the password field. Use the eye control to
                reveal or hide characters while you edit. Avoid reusing production
                secrets in screenshots; treat the field like a scratch pad.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Alternatively, click{" "}
                <strong className="font-medium text-foreground">Upload .txt</strong>{" "}
                to read the first non-empty line from a small local text file—handy
                when a generator wrote a line to disk and you do not want to paste
                through the clipboard.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read the strength bar, charset size, adjusted entropy in bits, and
                the three crack-time rows. Compare{" "}
                <strong className="font-medium text-foreground">online</strong>{" "}
                throttling with{" "}
                <strong className="font-medium text-foreground">offline GPU</strong>{" "}
                scenarios to understand why leaked hash databases hurt more than
                guessing over HTTP.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Address any hardening tips, then regenerate if needed using the{" "}
                <Link
                  href="/dev/password-generator"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  password generator
                </Link>
                . Click{" "}
                <strong className="font-medium text-foreground">Copy report</strong>{" "}
                to paste a structured summary into design docs or compliance
                worksheets—still avoid posting live credentials in chat.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Entropy, patterns, and what this meter does not do
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            High charset diversity and length drive raw entropy; predictable
            structure reduces effective strength. We apply modest penalties for
            long keyboard runs, sequential digits, heavy character repetition, and
            a short blocklist of ubiquitous passwords. We do{" "}
            <strong className="font-medium text-foreground">not</strong> call breach
            APIs or k-anonymity services—if you need breach awareness, use dedicated
            monitoring alongside this structural check.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Internal tools that pair with stronger passwords
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            After you pick a strong login secret, you might still validate transport
            and metadata: inspect responses with the{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>
            , preview social cards with the{" "}
            <Link
              href="/website/open-graph-preview"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph preview
            </Link>
            , or extract tags using the{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>
            . For file workflows, the{" "}
            <Link
              href="/files/file-hash"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              file hash
            </Link>{" "}
            utility helps verify artifacts you distribute with integrity checks.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related security and encryption tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
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
            {passwordStrengthFaqItems.map((item) => (
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
