import type { Metadata } from "next";
import Link from "next/link";
import { CspBuilderTool } from "./csp-builder-tool";
import { cspBuilderFaqItems } from "@/lib/csp-builder-faq";
import { toolSections } from "@/lib/tool-catalog";
import { BlogCard } from "@/components/blog-card";

const securityTools =
  toolSections.find((s) => s.id === "security-encryption-tools")?.tools ?? [];
const relatedTools = securityTools.filter(
  (t) => t.href !== "/security/csp-builder",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/security/csp-builder",
  },
};

export default function CspBuilderPage() {
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
            <span className="text-foreground">CSP builder</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            CSP builder — compose Content-Security-Policy directives, copy a
            header, and roll out safely
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This free{" "}
            <strong className="font-medium text-foreground">
              Content Security Policy builder
            </strong>{" "}
            helps you assemble a valid{" "}
            <strong className="font-medium text-foreground">
              Content-Security-Policy
            </strong>{" "}
            (or{" "}
            <strong className="font-medium text-foreground">
              Content-Security-Policy-Report-Only
            </strong>
            ) value without memorizing every directive name. Toggle{" "}
            <strong className="font-medium text-foreground">
              default-src, script-src, style-src, img-src, connect-src,
              frame-ancestors
            </strong>
            , reporting endpoints, and common flags, then use the{" "}
            <strong className="font-medium text-foreground">copy icon</strong>{" "}
            to grab either the{" "}
            <strong className="font-medium text-foreground">
              raw policy string
            </strong>{" "}
            (for meta tags and some CDNs) or the{" "}
            <strong className="font-medium text-foreground">
              full HTTP header line
            </strong>{" "}
            for nginx, Apache, Express, or edge workers.{" "}
            <strong className="font-medium text-foreground">
              Import from file
            </strong>{" "}
            (upload icon) parses a saved policy or header line locally—nothing
            is uploaded to a server. Pair the result with our{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>{" "}
            to verify responses after deploy, and browse{" "}
            <Link
              href="/#security-encryption-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              security and encryption tools
            </Link>{" "}
            for JWT testing, hashing, and more.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <CspBuilderTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            What is a Content Security Policy (CSP) header?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            A{" "}
            <strong className="font-medium text-foreground">
              Content Security Policy
            </strong>{" "}
            is an HTTP response header that tells the browser which origins may
            load or execute{" "}
            <strong className="font-medium text-foreground">
              scripts, styles, images, fonts, XHR, frames, workers,
            </strong>{" "}
            and other resource types. It is one of the most effective ways to
            reduce the blast radius of cross-site scripting (XSS): unexpected
            inline script, eval, or third-party loads can be refused or
            reported. Searchers often look for a{" "}
            <strong className="font-medium text-foreground">CSP generator</strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              nginx Content-Security-Policy example
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              CSP directive list
            </strong>{" "}
            — this page gives you a working baseline you can tighten for your
            stack.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this CSP builder (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Choose{" "}
                <strong className="font-medium text-foreground">
                  enforcing CSP
                </strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">
                  Report-Only
                </strong>
                . Use report-only in staging or production first so violations
                show up in logs without breaking users while you fix assets.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click a{" "}
                <strong className="font-medium text-foreground">preset</strong>{" "}
                (
                <em>Typical SPA</em>, <em>Stricter scripts</em>, etc.) or enable
                directives manually. Edit{" "}
                <strong className="font-medium text-foreground">
                  space-separated sources
                </strong>{" "}
                such as <code className="font-mono text-sm">'self'</code>,{" "}
                <code className="font-mono text-sm">https://cdn.example.com</code>
                , <code className="font-mono text-sm">data:</code>, or nonce/hash
                tokens emitted by your framework.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Optionally use{" "}
                <strong className="font-medium text-foreground">
                  Import from file
                </strong>{" "}
                to load an existing policy from disk. The parser recognizes a
                bare directive string or a line that starts with{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  Content-Security-Policy:
                </code>
                .
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Press{" "}
                <strong className="font-medium text-foreground">
                  Copy policy value
                </strong>{" "}
                when your config expects only the semicolon-separated directives,
                or{" "}
                <strong className="font-medium text-foreground">
                  Copy full header line
                </strong>{" "}
                when you paste directly into server or CDN configuration. Fix
                violations reported in the console, then switch from
                report-only to enforcement.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Directive guide: default-src, script-src, frame-ancestors, and
            reporting
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">default-src</strong>{" "}
            is the usual starting point: it applies when a more specific
            directive is absent. Most teams combine it with explicit{" "}
            <strong className="font-medium text-foreground">script-src</strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">style-src</strong>{" "}
            rules so reviews are explicit.{" "}
            <strong className="font-medium text-foreground">
              frame-ancestors
            </strong>{" "}
            replaces many uses of <code className="font-mono text-sm">X-Frame-Options</code>{" "}
            for clickjacking defense—values like{" "}
            <code className="font-mono text-sm">'none'</code> or a list of
            partner origins are common. For observability, add{" "}
            <strong className="font-medium text-foreground">report-uri</strong>{" "}
            or{" "}
            <strong className="font-medium text-foreground">report-to</strong>{" "}
            alongside the Reporting API headers your infrastructure supports.
            When you evaluate tokens and digests for inline script, the{" "}
            <Link
              href="/dev/hash-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              hash generator
            </Link>{" "}
            can help compute SHA-256 hashes for small static snippets in
            controlled setups.
          </p>

          <BlogCard
            title="What Is a Content Security Policy (CSP) and How to Set One Up"
            description="Here's what CSP is, why it exists, and how to build one without accidentally breaking your own site."
            href="/blog/what-is-a-content-security-policy-csp"
          />

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Deploying CSP on nginx, Apache, CDNs, and application frameworks
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            After you copy the header, attach it at the edge or origin:{" "}
            <strong className="font-medium text-foreground">nginx</strong> uses{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              add_header Content-Security-Policy &quot;...&quot;
            </code>
            ;{" "}
            <strong className="font-medium text-foreground">Apache</strong> uses{" "}
            <code className="font-mono text-sm">Header set</code> from{" "}
            <code className="font-mono text-sm">mod_headers</code>. Platforms
            like Vercel, Netlify, and Cloudflare Workers expose static response
            header maps. Frameworks such as Next.js can set headers in config;
            verify output with the{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>{" "}
            on a preview URL before promoting to production.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and topics this CSP tool supports
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Teams search for{" "}
            <strong className="font-medium text-foreground">
              CSP unsafe-inline alternative
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              Content-Security-Policy-Report-Only example
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              block mixed content CSP
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              upgrade insecure requests
            </strong>
            . This builder encodes those ideas as toggles and short
            descriptions so you can align policy with OWASP-style guidance while
            staying framework-agnostic. For API tokens used in tests—not in CSP
            itself—see the{" "}
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
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related security utilities on this site
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Explore the full{" "}
            <Link
              href="/#security-encryption-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              security and encryption tools
            </Link>{" "}
            section, or open a focused utility below.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {relatedTools.slice(0, 12).map((tool) => (
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
            {cspBuilderFaqItems.map((item) => (
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
