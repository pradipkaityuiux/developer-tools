import type { Metadata } from "next";
import Link from "next/link";
import { SslCertificateCheckerTool } from "./ssl-certificate-checker-tool";
import { sslCertificateCheckerFaqItems } from "@/lib/ssl-certificate-checker-faq";
import { toolSections } from "@/lib/tool-catalog";

export const dynamic = "force-static";

const websiteTools =
  toolSections.find((s) => s.id === "website-url-tools")?.tools ?? [];
const relatedTools = websiteTools.filter(
  (t) => t.href !== "/website/ssl-certificate-checker",
);

export const metadata: Metadata = {
  alternates: {
    canonical: "/website/ssl-certificate-checker",
  },
};

export default function SslCertificateCheckerPage() {
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
            <span className="text-foreground">SSL certificate checker</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            SSL certificate checker for TLS expiry, issuer &amp; chain
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Run a quick{" "}
            <strong className="font-medium text-foreground">
              SSL/TLS certificate check
            </strong>{" "}
            on any public hostname: see{" "}
            <strong className="font-medium text-foreground">
              certificate expiration
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              Subject Alternative Names (SANs)
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              issuer and subject
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              SHA-256 fingerprint
            </strong>
            , negotiated{" "}
            <strong className="font-medium text-foreground">TLS version</strong>
            , and whether our server considers the{" "}
            <strong className="font-medium text-foreground">
              certificate chain trusted
            </strong>
            . Built for DevOps rotations, pre-launch QA, and{" "}
            <strong className="font-medium text-foreground">
              HTTPS troubleshooting
            </strong>{" "}
            when SEO or analytics traffic depends on clean TLS.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <SslCertificateCheckerTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            How to use this SSL checker
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Type a bare domain (for example{" "}
            <span className="font-mono text-sm text-foreground">
              api.example.com
            </span>
            ) or paste a full{" "}
            <strong className="font-medium text-foreground">HTTPS URL</strong>.
            If you omit the scheme, we assume HTTPS. For plain{" "}
            <span className="font-mono text-sm">http://</span> URLs without an
            explicit port, we still open{" "}
            <strong className="font-medium text-foreground">port 443</strong>{" "}
            so you inspect the certificate browsers use for TLS—matching how
            most production sites terminate SSL. After you submit, read the
            summary banner for{" "}
            <strong className="font-medium text-foreground">days until expiry</strong>{" "}
            and trust status, then walk the numbered chain cards from leaf to
            root. Compare SANs with the hostnames you serve behind load
            balancers and CDNs, and keep fingerprints handy when validating a
            new issuance against your runbooks.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Why SSL certificate monitoring matters for sites and SEO
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            An expired or mismatched certificate breaks HTTPS, triggers browser
            interstitials, and can interrupt crawlers and analytics. Regular{" "}
            <strong className="font-medium text-foreground">
              TLS certificate validation
            </strong>{" "}
            catches rotations that never deployed, partial chain uploads, or
            wrong{" "}
            <strong className="font-medium text-foreground">
              wildcard coverage
            </strong>{" "}
            before customers notice. Pair hostname checks with our{" "}
            <Link
              href="/website/dns-lookup"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              DNS lookup tool
            </Link>{" "}
            to confirm A/AAAA and CNAME targets, use the{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>{" "}
            when HTTPS hops through marketing domains, and follow HTTP behavior
            with the{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>{" "}
            and{" "}
            <Link
              href="/website/response-code-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              response code checker
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Reading certificate results: SANs, chain, and fingerprints
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Modern clients validate hostnames against{" "}
            <strong className="font-medium text-foreground">SAN entries</strong>
            , not only the legacy Common Name. When you migrate to a new CDN or
            add apex plus{" "}
            <span className="font-mono text-sm">www</span>, confirm every
            hostname your users type appears on the leaf or a matching
            wildcard. The{" "}
            <strong className="font-medium text-foreground">
              intermediate certificates
            </strong>{" "}
            in the chain should link to a public root; missing intermediates
            cause intermittent “not secure” warnings. Fingerprints help you
            verify you are looking at the same cert your provider dashboard
            lists after reissuance. For page-level metadata and sharing
            previews after TLS is fixed, use our{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            and{" "}
            <Link
              href="/website/open-graph-preview"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph preview
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Security notes and limitations
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            This tool connects from our infrastructure, not your laptop, so
            results reflect what our servers see—useful for public internet
            properties. We block private IP literals and hostnames that resolve
            to non-public addresses to reduce SSRF risk. Trust output follows
            our Node/OpenSSL trust store; enterprise roots or custom pinning may
            differ from end-user browsers. For link health after TLS is
            confirmed, run the{" "}
            <Link
              href="/website/broken-link-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              broken link checker
            </Link>{" "}
            on key HTML pages.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related free website tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browse the full{" "}
            <Link
              href="/#website-url-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              website and URL tools
            </Link>{" "}
            section on the home page, or open a focused utility below.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {relatedTools.slice(0, 10).map((tool) => (
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
            {sslCertificateCheckerFaqItems.map((item) => (
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
