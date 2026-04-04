import type { Metadata } from "next";
import Link from "next/link";
import { RsaKeyGeneratorTool } from "./rsa-key-generator-tool";
import { rsaKeyGeneratorFaqItems } from "@/lib/rsa-key-generator-faq";
import { toolSections } from "@/lib/tool-catalog";

const securityTools =
  toolSections.find((s) => s.id === "security-encryption-tools")?.tools ?? [];
const relatedTools = securityTools.filter(
  (t) => t.href !== "/security/rsa-key-generator",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/security/rsa-key-generator",
  },
};

export default function RsaKeyGeneratorPage() {
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
            <span className="text-foreground">RSA key pair generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            RSA key pair generator — PEM public and private keys in the browser
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online RSA key pair generator
            </strong>{" "}
            to create{" "}
            <strong className="font-medium text-foreground">
              PEM-encoded RSA keys
            </strong>{" "}
            for{" "}
            <strong className="font-medium text-foreground">
              local development
            </strong>
            , API demos, and learning workflows. Choose{" "}
            <strong className="font-medium text-foreground">
              1024 through 4096 bit
            </strong>{" "}
            modulus sizes, then export standard{" "}
            <strong className="font-medium text-foreground">
              Subject Public Key Info
            </strong>{" "}
            (public) and{" "}
            <strong className="font-medium text-foreground">PKCS#8</strong>{" "}
            (private) blocks you can paste into OpenSSL-friendly tooling. All work
            runs in your tab via{" "}
            <code className="rounded bg-zinc-200/80 px-1 py-0.5 font-mono text-sm dark:bg-zinc-800">
              crypto.subtle
            </code>
            , so{" "}
            <strong className="font-medium text-foreground">
              keys are not uploaded
            </strong>{" "}
            when you generate them here. After you copy material, pair this page
            with the{" "}
            <Link
              href="/security/jwt-encoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JWT encoder
            </Link>{" "}
            for signed-token experiments, or the{" "}
            <Link
              href="/security/aes-encrypt-decrypt"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              AES encrypt and decrypt
            </Link>{" "}
            tool when you need symmetric encryption alongside asymmetric key
            concepts.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <RsaKeyGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why generate RSA keys in the browser instead of OpenSSL?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Many developers still run{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              openssl genrsa
            </code>{" "}
            on a workstation—and that remains a solid choice for automation. A{" "}
            <strong className="font-medium text-foreground">
              browser-based RSA key generator
            </strong>{" "}
            helps when you are on a locked-down machine, writing a tutorial, or
            need a{" "}
            <strong className="font-medium text-foreground">
              quick PEM key pair
            </strong>{" "}
            without installing a toolchain. You get interoperable text that
            matches what most runtimes import, while keeping the private key in
            memory you control until you copy it elsewhere.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This page focuses on{" "}
            <strong className="font-medium text-foreground">RSA-OAEP</strong>{" "}
            with{" "}
            <strong className="font-medium text-foreground">SHA-256</strong>{" "}
            because that is what the Web Cryptography API exposes for
            encrypt/decrypt key pairs. Libraries that expect RSA signing may
            import the same PEM but configure{" "}
            <strong className="font-medium text-foreground">RSA-PSS</strong> or{" "}
            <strong className="font-medium text-foreground">
              RSASSA-PKCS1-v1_5
            </strong>{" "}
            separately. For password storage, never substitute RSA for{" "}
            <strong className="font-medium text-foreground">bcrypt</strong>,{" "}
            <strong className="font-medium text-foreground">Argon2</strong>, or
            your framework’s password APIs—use the{" "}
            <Link
              href="/security/bcrypt-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              bcrypt hash generator
            </Link>{" "}
            when you need slow hashing for credentials.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this RSA key generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Pick a{" "}
                <strong className="font-medium text-foreground">
                  modulus length
                </strong>
                . For new systems, start at{" "}
                <strong className="font-medium text-foreground">2048 bits</strong>{" "}
                unless a standard mandates 3072 or 4096. Use{" "}
                <strong className="font-medium text-foreground">1024 bits</strong>{" "}
                only for legacy compatibility or fast classroom demos.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Generate key pair
                </strong>
                . Larger keys take longer; generation runs entirely on your
                device.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Copy the{" "}
                <strong className="font-medium text-foreground">
                  public key PEM
                </strong>{" "}
                to clients, configs, or documentation that only need encryption or
                verification material. Keep the{" "}
                <strong className="font-medium text-foreground">
                  private key PEM
                </strong>{" "}
                in a password manager, secret store, or encrypted file—never in
                public repositories.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use{" "}
                <strong className="font-medium text-foreground">
                  Copy public + private
                </strong>{" "}
                when you need both blocks in one paste (for example moving into a
                local vault). Use{" "}
                <strong className="font-medium text-foreground">
                  Upload PEM file
                </strong>{" "}
                to load an existing key bundle from disk and review or edit the
                text fields.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and search intents this tool covers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            People often search for an{" "}
            <strong className="font-medium text-foreground">
              RSA key generator online
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              create RSA public private key PEM
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              4096 bit RSA generator
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              Web Crypto RSA example
            </strong>
            . This page satisfies those intents with a no-login workflow and
            explicit privacy boundaries. If you are validating fingerprints or
            comparing digests of the same key material, the{" "}
            <Link
              href="/dev/hash-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              hash generator
            </Link>{" "}
            can compute SHA-256 hashes of strings you paste locally.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            PEM format, PKCS#8, and certificates (quick guide)
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            A{" "}
            <strong className="font-medium text-foreground">PEM file</strong> is
            Base64-encoded DER with header lines such as{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              BEGIN PUBLIC KEY
            </code>{" "}
            or{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              BEGIN PRIVATE KEY
            </code>
            . This tool outputs PKCS#8 private keys and SPKI public keys—the
            usual interchange format for application code. A TLS{" "}
            <strong className="font-medium text-foreground">certificate</strong>{" "}
            wraps a public key with metadata and a CA signature. To inspect a
            certificate served from a public HTTPS URL, use the{" "}
            <Link
              href="/website/ssl-certificate-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SSL certificate checker
            </Link>
            . For PEM files on disk, use{" "}
            <strong className="font-medium text-foreground">
              Upload PEM file
            </strong>{" "}
            above or your platform&apos;s crypto utilities.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Security notes and responsible use
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Treat generated{" "}
            <strong className="font-medium text-foreground">
              RSA private keys
            </strong>{" "}
            like passwords. If you suspect exposure, rotate and revoke according
            to your system’s design. For interactive password strength feedback
            when teaching authentication, open the{" "}
            <Link
              href="/security/password-strength"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              password strength meter
            </Link>
            . For API verification patterns that use shared secrets instead of
            asymmetric keys, the{" "}
            <Link
              href="/security/hmac-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HMAC generator
            </Link>{" "}
            may be a better fit than RSA.
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
            {rsaKeyGeneratorFaqItems.map((item) => (
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
