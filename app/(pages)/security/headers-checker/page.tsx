import type { Metadata } from "next";
import Link from "next/link";
import { SecurityHeadersCheckerTool } from "./security-headers-checker-tool";
import { securityHeadersCheckerFaqItems } from "@/lib/security-headers-checker-faq";
import { toolSections } from "@/lib/tool-catalog";

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/security/headers-checker",
  },
};

const securityTools =
  toolSections.find((s) => s.id === "security-encryption-tools")?.tools ?? [];
const relatedTools = securityTools.filter(
  (t) => t.href !== "/security/headers-checker",
);

export default function SecurityHeadersCheckerPage() {
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
              href="/#security-encryption-tools"
              className="hover:text-foreground"
            >
              Security tools
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span className="text-foreground">Security headers checker</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Security headers checker — grade CSP, HSTS, and hardening online
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Scan a public{" "}
            <strong className="font-medium text-foreground">HTTPS URL</strong> or
            paste raw{" "}
            <strong className="font-medium text-foreground">
              HTTP response headers
            </strong>{" "}
            to see how your site scores on{" "}
            <strong className="font-medium text-foreground">
              Content-Security-Policy (CSP)
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              Strict-Transport-Security (HSTS)
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              X-Content-Type-Options
            </strong>
            , clickjacking controls,{" "}
            <strong className="font-medium text-foreground">
              Referrer-Policy
            </strong>
            , and related signals. Built for developers, site owners, and
            security reviewers who need a fast, repeatable{" "}
            <strong className="font-medium text-foreground">
              security header audit
            </strong>{" "}
            before production releases or compliance reviews.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <SecurityHeadersCheckerTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            How to use this security headers analyzer
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Choose <strong className="text-foreground">Live URL</strong> and enter
            a fully qualified address (we prepend https:// when you omit the
            scheme). Submit to run a server-side fetch with our public-URL safety
            rules. You will get a numeric score, letter grade, and a checklist
            explaining each finding. Use{" "}
            <strong className="text-foreground">Paste or upload</strong> when you
            already have headers from{" "}
            <span className="font-mono text-sm">curl -I</span>, a browser, or a
            proxy—TLS behavior is not verified in that mode, so confirm HTTPS
            separately or re-run as a live scan. Copy the markdown report to
            attach to tickets or change requests. For every raw header name and
            value without scoring, open our{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Security headers checklist (what we look for)
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="text-foreground">Transport:</strong> live scans
            expect HTTPS end-to-end.{" "}
            <strong className="text-foreground">HSTS</strong> should use a
            sensible max-age once you are confident in TLS.{" "}
            <strong className="text-foreground">CSP</strong> reduces XSS impact;
            iterate with report-only policies before enforcement.{" "}
            <strong className="text-foreground">X-Content-Type-Options: nosniff</strong>{" "}
            avoids MIME sniffing surprises.{" "}
            <strong className="text-foreground">Frame protection</strong> comes
            from <span className="font-mono text-sm">X-Frame-Options</span> or
            CSP <span className="font-mono text-sm">frame-ancestors</span>{" "}
            (avoid <span className="font-mono text-sm">*</span> unless you truly
            need universal embedding).{" "}
            <strong className="text-foreground">Referrer-Policy</strong> and{" "}
            <strong className="text-foreground">Permissions-Policy</strong>{" "}
            tighten data leakage and powerful APIs. Draft CSP with our{" "}
            <Link
              href="/security/csp-builder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSP builder
            </Link>
            , then validate here after deployment.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Why security headers matter for web apps and APIs
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Browsers enforce headers to constrain scripts, framing, and cross-origin
            interactions. A missing or overly permissive CSP can leave room for
            XSS payloads; weak frame controls expose clickjacking; missing
            nosniff increases MIME confusion risk. Headers do not replace secure
            coding or input validation, but they add defense-in-depth that scales
            across pages and microservices. Pair this audit with certificate
            hygiene using our{" "}
            <Link
              href="/website/ssl-certificate-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SSL certificate checker
            </Link>{" "}
            and redirect correctness with the{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Interpreting scores and grades
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            The score weights presence and quality of common headers; it is not a
            penetration test or compliance certification. A high grade means the
            response aligns with common baseline hardening guidance—still review
            CSP directives for your specific third-party scripts, APIs, and
            iframes. A low grade usually means missing CSP, missing frame
            protection, or HTTP-only delivery. Re-scan after each CDN or edge
            config change because headers are often set at the edge, not only on
            origin.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related security and website tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Explore the full{" "}
            <Link
              href="/#security-encryption-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              security &amp; encryption tools
            </Link>{" "}
            collection, or jump to adjacent utilities below. For JWT and signing
            workflows after you lock down transport, see the{" "}
            <Link
              href="/security/jwt-encoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JWT encoder
            </Link>{" "}
            and{" "}
            <Link
              href="/security/hmac-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HMAC generator
            </Link>
            .
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
            {securityHeadersCheckerFaqItems.map((item) => (
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
