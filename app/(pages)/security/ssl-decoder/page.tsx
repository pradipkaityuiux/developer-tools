import type { Metadata } from "next";
import Link from "next/link";
import { SslDecoderTool } from "./ssl-decoder-tool";
import { sslDecoderFaqItems } from "@/lib/ssl-decoder-faq";
import { toolSections } from "@/lib/tool-catalog";

const securityTools =
  toolSections.find((s) => s.id === "security-encryption-tools")?.tools ?? [];
const relatedTools = securityTools.filter((t) => t.href !== "/security/ssl-decoder");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/security/ssl-decoder",
  },
};

export default function SslDecoderPage() {
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
            <span className="text-foreground">SSL certificate decoder</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            SSL certificate decoder — read PEM subject, issuer, SANs, and validity
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              SSL certificate decoder
            </strong>{" "}
            (and{" "}
            <strong className="font-medium text-foreground">
              X.509 PEM certificate parser
            </strong>
            ) to paste{" "}
            <strong className="font-medium text-foreground">
              Base64 PEM blocks
            </strong>{" "}
            and inspect{" "}
            <strong className="font-medium text-foreground">subject</strong> and{" "}
            <strong className="font-medium text-foreground">issuer</strong>{" "}
            distinguished names,{" "}
            <strong className="font-medium text-foreground">serial number</strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              validity (notBefore / notAfter)
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              Subject Alternative Names (SANs)
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">key usage</strong> and{" "}
            <strong className="font-medium text-foreground">
              extended key usage
            </strong>{" "}
            when present, plus a{" "}
            <strong className="font-medium text-foreground">
              SHA-256 fingerprint
            </strong>{" "}
            for quick comparison. Processing runs{" "}
            <strong className="font-medium text-foreground">
              entirely in your browser
            </strong>
            —ideal when you already have PEM text from a file, load balancer, or
            support ticket and want a structured view without uploading secrets to
            a backend. For certificates{" "}
            <strong className="font-medium text-foreground">
              served live over HTTPS
            </strong>
            , pair this page with the{" "}
            <Link
              href="/website/ssl-certificate-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SSL certificate checker
            </Link>{" "}
            that fetches the chain from a URL, and use the{" "}
            <Link
              href="/security/rsa-key-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              RSA key pair generator
            </Link>{" "}
            when you need matching PEM keys for labs and demos.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <SslDecoderTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why decode TLS certificates from PEM text?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Operations and engineering teams constantly exchange{" "}
            <strong className="font-medium text-foreground">
              PEM-encoded X.509 certificates
            </strong>{" "}
            when debugging mTLS, CDN uploads, Kubernetes secrets, or corporate
            proxies. A dedicated{" "}
            <strong className="font-medium text-foreground">
              certificate decoder online
            </strong>{" "}
            turns opaque Base64 into readable fields: who the certificate claims
            to represent (subject), which authority signed it (issuer), which
            hostnames are allowed (often via{" "}
            <strong className="font-medium text-foreground">SAN DNS names</strong>
            ), and the{" "}
            <strong className="font-medium text-foreground">
              notBefore / notAfter
            </strong>{" "}
            window. That is different from proving the certificate is trusted:
            trust requires chain building, signature verification, and revocation
            checks—work your platform or the{" "}
            <Link
              href="/website/ssl-certificate-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              live SSL checker
            </Link>{" "}
            performs against public endpoints.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This utility is optimized for{" "}
            <strong className="font-medium text-foreground">
              offline inspection
            </strong>
            : paste text, optionally{" "}
            <strong className="font-medium text-foreground">upload a .pem file</strong>
            , and copy summaries into runbooks. If you are hardening HTTP
            responses, continue with the{" "}
            <Link
              href="/security/headers-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              security headers checker
            </Link>{" "}
            and{" "}
            <Link
              href="/security/csp-builder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSP builder
            </Link>{" "}
            so transport security and browser policy stay aligned.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this SSL certificate decoder (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Obtain PEM text: export from a server, copy from a ticket, or save
                from a CA portal. The textarea expects standard{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  -----BEGIN CERTIFICATE-----
                </code>{" "}
                wrapping.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Paste the block or click{" "}
                <strong className="font-medium text-foreground">Upload file</strong>{" "}
                for a <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">.pem</code>,{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">.crt</code>, or{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">.cer</code>{" "}
                file. Chains with multiple PEM blocks are listed as separate
                certificates in order.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read subject, issuer, serial, validity, algorithms, and SAN list.
                Compare the{" "}
                <strong className="font-medium text-foreground">
                  SHA-256 fingerprint
                </strong>{" "}
                with <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">openssl x509 -fingerprint -sha256</code>{" "}
                output when you need byte-for-byte confirmation.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use{" "}
                <strong className="font-medium text-foreground">Copy summary</strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">Copy PEM</strong>{" "}
                (with the copy icon) to attach details to issues or chat. For
                arbitrary hex or Base64 digests of other material, the{" "}
                <Link
                  href="/dev/hash-generator"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  hash generator
                </Link>{" "}
                remains the right tool.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords: PEM decoder, X.509 inspection, SAN viewer
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Teams search for an{" "}
            <strong className="font-medium text-foreground">
              X.509 certificate decoder
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              PEM certificate parser
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              view certificate subject and issuer online
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              SSL cert expiry checker from PEM
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              read SAN from certificate
            </strong>
            . This page targets those intents with explicit field labels, local
            processing, and clear limitations (no chain validation). For token-style
            debugging in APIs, the{" "}
            <Link
              href="/security/jwt-encoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JWT encoder
            </Link>{" "}
            and{" "}
            <Link
              href="/dev/jwt-decoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JWT decoder
            </Link>{" "}
            cover JSON Web Tokens instead of PKIX certificates.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Understanding subject, issuer, and the certificate chain
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            The{" "}
            <strong className="font-medium text-foreground">subject</strong> names
            the entity the certificate belongs to; the{" "}
            <strong className="font-medium text-foreground">issuer</strong> names the
            signing certificate authority. In a full TLS handshake you receive an
            ordered chain (leaf, intermediates, optional root). Pasting multiple PEM
            blocks here decodes each independently—it does not automatically verify
            that block <em>n</em> signed block <em>n − 1</em>. Use your platform’s
            trust store or openssl workflows when you need cryptographic
            confirmation.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Subject Alternative Name (SAN) and hostname matching
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            For HTTPS, clients typically evaluate allowed hostnames from{" "}
            <strong className="font-medium text-foreground">SAN</strong> entries
            (often <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">dns</code>{" "}
            types). If SAN is empty on this page, the certificate may be legacy,
            specialized, or the extension might be absent—your deployment standards
            should still require SAN for public server authentication. IP addresses
            can appear as{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">ip</code>{" "}
            general names for internal or service-mesh scenarios.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Limitations and safe use
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Decoding never replaces{" "}
            <strong className="font-medium text-foreground">revocation checks</strong>{" "}
            (CRL/OCSP),{" "}
            <strong className="font-medium text-foreground">CT logging</strong>{" "}
            policy, or your organization’s{" "}
            <strong className="font-medium text-foreground">key custody</strong>{" "}
            rules. Treat production private keys and high-assurance certificates like
            credentials: avoid pasting them on untrusted shared machines. When you
            only need password or passphrase strength feedback, use the{" "}
            <Link
              href="/security/password-strength"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              password strength meter
            </Link>{" "}
            instead of juggling cert material.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related security and encryption tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browse the full{" "}
            <Link
              href="/#security-encryption-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              security and encryption tools
            </Link>{" "}
            section. Highlights:
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
            {sslDecoderFaqItems.map((item) => (
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
