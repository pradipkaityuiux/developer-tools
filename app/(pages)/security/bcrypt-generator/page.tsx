import type { Metadata } from "next";
import Link from "next/link";
import { BcryptGeneratorTool } from "./bcrypt-generator-tool";
import { bcryptGeneratorFaqItems } from "@/lib/bcrypt-generator-faq";
import { toolSections } from "@/lib/tool-catalog";

const securityTools =
  toolSections.find((s) => s.id === "security-encryption-tools")?.tools ?? [];
const relatedTools = securityTools.filter(
  (t) => t.href !== "/security/bcrypt-generator",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/security/bcrypt-generator",
  },
};

export default function BcryptGeneratorPage() {
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
            <span className="text-foreground">bcrypt hash generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            bcrypt hash generator — salt rounds, $2b$ hashes, and password verify
            in your browser
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online bcrypt hash generator
            </strong>{" "}
            to produce{" "}
            <strong className="font-medium text-foreground">
              salted password hashes
            </strong>{" "}
            with a configurable{" "}
            <strong className="font-medium text-foreground">cost factor</strong>{" "}
            (sometimes called{" "}
            <strong className="font-medium text-foreground">salt rounds</strong>
            ). Output uses the familiar{" "}
            <strong className="font-medium text-foreground">
              modular crypt format
            </strong>{" "}
            (
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              $2a$
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              $2b$
            </code>
            , or{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              $2y$
            </code>
            ) so you can drop results into fixtures, migration scripts, and
            side-by-side tests with{" "}
            <strong className="font-medium text-foreground">Node.js</strong>,{" "}
            <strong className="font-medium text-foreground">PHP</strong>,{" "}
            <strong className="font-medium text-foreground">Python</strong>, or{" "}
            <strong className="font-medium text-foreground">Ruby</strong>{" "}
            libraries. Click{" "}
            <strong className="font-medium text-foreground">Copy</strong> (with
            the copy icon) on the hash field, or{" "}
            <strong className="font-medium text-foreground">Upload</strong> (with
            the upload icon) to load a UTF-8{" "}
            <strong className="font-medium text-foreground">.txt</strong> file into
            the password box. Switch to{" "}
            <strong className="font-medium text-foreground">
              Verify password
            </strong>{" "}
            to run the same{" "}
            <strong className="font-medium text-foreground">bcrypt.compare</strong>{" "}
            check you would on the server. Everything runs{" "}
            <strong className="font-medium text-foreground">locally</strong> after
            the page loads. When you need fast digests for checksums (not password
            storage), use our{" "}
            <Link
              href="/dev/hash-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              MD5 and SHA hash generator
            </Link>
            ; when you need random candidate passwords, pair this page with the{" "}
            <Link
              href="/dev/password-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              password generator
            </Link>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <BcryptGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            What is bcrypt and how does this generator help?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="font-medium text-foreground">bcrypt</strong> is a
            password-hashing function that combines a{" "}
            <strong className="font-medium text-foreground">work factor</strong>{" "}
            with a{" "}
            <strong className="font-medium text-foreground">random salt</strong>{" "}
            so each stored hash is unique and expensive to attack at scale. This
            tool helps you{" "}
            <strong className="font-medium text-foreground">
              generate bcrypt hashes online
            </strong>{" "}
            for local development: API contract tests, seed data, and teaching how
            modular crypt strings look. It is not a substitute for server-side
            registration flows—production systems should still hash credentials on
            a trusted application tier with logging and rate limits you control.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            The{" "}
            <strong className="font-medium text-foreground">cost parameter</strong>{" "}
            you pick maps to how many iterations bcrypt performs internally. Higher
            costs raise CPU time per login attempt, which defends against offline
            cracking if a database leak occurs, but also increases latency for real
            users—benchmark on hardware that matches production and revisit the
            setting as CPUs get faster.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this bcrypt generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Open <strong className="font-medium text-foreground">Generate hash</strong>{" "}
                and type or paste a password. Watch the UTF-8 byte length:{" "}
                <strong className="font-medium text-foreground">
                  bcrypt ignores bytes after the first 72
                </strong>
                , which surprises teams that paste long passphrases or JSON blobs.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Move the <strong className="font-medium text-foreground">cost factor</strong>{" "}
                slider between {4} and {15}. Start near{" "}
                <strong className="font-medium text-foreground">10</strong> for
                interactive testing; expect noticeably longer waits at the top of
                the range.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Generate bcrypt hash
                </strong>
                . When the modular crypt string appears, use{" "}
                <strong className="font-medium text-foreground">Copy</strong> (copy
                icon) to move it into your editor or ticket. Each run produces a
                different string because the salt is random—both should verify
                against the same plaintext.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                To confirm behavior end-to-end, switch to{" "}
                <strong className="font-medium text-foreground">
                  Verify password
                </strong>
                , paste the plaintext and a stored hash, then click{" "}
                <strong className="font-medium text-foreground">Compare</strong>.
                Use <strong className="font-medium text-foreground">Upload</strong>{" "}
                (upload icon) if your test vector lives in a local text file.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            bcrypt vs SHA-256: when to use which tool
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="font-medium text-foreground">SHA-256</strong> and{" "}
            <strong className="font-medium text-foreground">SHA-512</strong> are
            fast cryptographic hashes for integrity, release artifacts, and
            content-addressed caches. They are the wrong primitive for storing user
            passwords unless you wrap them in a proper key derivation or password
            hashing scheme.{" "}
            <strong className="font-medium text-foreground">bcrypt</strong> is tuned
            for human-chosen secrets: it is slow by design and embeds salt and cost
            in the serialized string. If you landed here while looking for a{" "}
            <strong className="font-medium text-foreground">string checksum</strong>
            , the{" "}
            <Link
              href="/dev/hash-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              hash generator
            </Link>{" "}
            page matches that intent better.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and common search intents
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Teams search for a{" "}
            <strong className="font-medium text-foreground">
              bcrypt hash generator with rounds
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              bcrypt online for testing
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              bcrypt compare online
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              how many bcrypt salt rounds
            </strong>{" "}
            when they wire up auth libraries or debug “password works in Postman
            but not in database” issues. This page exposes the same cost and
            compare semantics as popular{" "}
            <strong className="font-medium text-foreground">bcryptjs</strong>{" "}
            bindings, with visible UTF-8 limits so encoding mistakes surface early.
            For webhook signatures and shared-secret MACs, use the{" "}
            <Link
              href="/security/hmac-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HMAC generator
            </Link>
            . You can also browse the full{" "}
            <Link
              href="/#security-encryption-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              security and encryption tools
            </Link>{" "}
            list on the home page.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and threat model
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Hashing executes in your browser tab; we do not receive your plaintext
            or hashes. Treat shared workstations like any other sensitive surface:
            avoid pasting production credentials, and clear clipboards when
            finished. Attackers who can run JavaScript in your session could still
            read inputs—this tool does not replace hardened auth endpoints or
            hardware security modules.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related security and developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Highlights from our catalog (each opens in place):
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
            {bcryptGeneratorFaqItems.map((item) => (
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
