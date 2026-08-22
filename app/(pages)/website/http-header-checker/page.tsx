import type { Metadata } from "next";
import Link from "next/link";
import { HttpHeaderCheckerTool } from "./http-header-checker-tool";
import { httpHeaderCheckerFaqItems } from "@/lib/http-header-checker-faq";
import { toolSections } from "@/lib/tool-catalog";
import { BlogCard } from "@/components/blog-card";

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/website/http-header-checker",
  },
};

const websiteTools =
  toolSections.find((s) => s.id === "website-url-tools")?.tools ?? [];
const relatedTools = websiteTools.filter(
  (t) => t.href !== "/website/http-header-checker",
);

export default function HttpHeaderCheckerPage() {
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
            <span className="text-foreground">HTTP header checker</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            HTTP header checker for any public URL
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Inspect live{" "}
            <strong className="font-medium text-foreground">
              HTTP response headers
            </strong>{" "}
            after redirects: see{" "}
            <strong className="font-medium text-foreground">
              cache-control
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">content-type</strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              CORS (Access-Control-*)
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              Content-Security-Policy
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">HSTS</strong>, and
            dozens more. Built for{" "}
            <strong className="font-medium text-foreground">
              developer debugging
            </strong>
            , CDN verification, and{" "}
            <strong className="font-medium text-foreground">SEO audits</strong>{" "}
            where headers influence crawling, freshness, and trust.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <HttpHeaderCheckerTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            How to use this HTTP response header inspector
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Paste a fully qualified URL (we automatically prepend https:// when
            you omit the scheme). Submit the form to run a server-side fetch that
            respects our public-URL safety rules. You will see the{" "}
            <strong className="text-foreground">final status code</strong>, the{" "}
            <strong className="text-foreground">final URL</strong> after
            redirects, whether we probed with{" "}
            <strong className="text-foreground">HEAD or GET</strong>, and every
            header name/value pair we received—sortable and easy to skim. Use the
            filter field to jump to tokens like{" "}
            <span className="font-mono text-sm text-foreground">cdn</span>,{" "}
            <span className="font-mono text-sm text-foreground">set-cookie</span>
            , or{" "}
            <span className="font-mono text-sm text-foreground">
              cache-control
            </span>
            . When you need the full redirect story (every hop and status), pair
            this page with our{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Why HTTP headers matter for performance and SEO
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Response headers tell browsers and bots how to cache HTML and assets,
            when to revalidate, and how to interpret bytes. A thoughtful{" "}
            <strong className="text-foreground">Cache-Control</strong> strategy
            can cut hosting cost and improve Core Web Vitals; a misconfigured{" "}
            <strong className="text-foreground">Vary</strong> header can fragment
            cache entries unexpectedly. On the SEO side, review{" "}
            <strong className="text-foreground">Link</strong> headers for rel
            canonical hints, scan for{" "}
            <strong className="text-foreground">x-robots-tag</strong> directives
            that might block indexing, and confirm HTTPS signals such as{" "}
            <strong className="text-foreground">
              Strict-Transport-Security
            </strong>
            . Combine header review with visible markup using our{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            so you are not fixing titles in HTML while robots see conflicting
            signals in headers.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Security headers worth verifying on every launch
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Modern deployments lean on headers to reduce XSS, clickjacking, and
            MIME confusion. Look for{" "}
            <strong className="text-foreground">
              Content-Security-Policy
            </strong>{" "}
            (and optionally report-only variants),{" "}
            <strong className="text-foreground">X-Content-Type-Options</strong>,{" "}
            <strong className="text-foreground">X-Frame-Options</strong> or CSP{" "}
            <span className="font-mono text-sm">frame-ancestors</span>,{" "}
            <strong className="text-foreground">Referrer-Policy</strong>, and{" "}
            <strong className="text-foreground">Permissions-Policy</strong>. TLS
            expiry and chain issues are orthogonal but equally important—validate
            certificates with our{" "}
            <Link
              href="/website/ssl-certificate-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SSL certificate checker
            </Link>{" "}
            when customers report browser warnings.
          </p>

          <BlogCard
            title="What Is a Content Security Policy (CSP) and How to Set One Up"
            description="Here's what CSP is, why it exists, and how to build one without accidentally breaking your own site."
            href="/blog/what-is-a-content-security-policy-csp"
          />

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Debugging CORS and API responses
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Cross-origin failures usually surface as missing or overly strict{" "}
            <span className="font-mono text-sm">Access-Control-Allow-*</span>{" "}
            values. This tool shows the headers your origin returns to an
            automated client—compare them with browser DevTools when cookies or
            custom methods differ. If preflight is involved, remember OPTIONS
            responses can differ from GET; still, seeing the baseline GET/HEAD
            headers is often enough to catch typos, wildcard mistakes, or absent{" "}
            <span className="font-mono text-sm">Access-Control-Allow-Origin</span>
            . When debugging HTML pages rather than APIs, keep outbound integrity
            in mind too—our{" "}
            <Link
              href="/website/broken-link-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              broken link checker
            </Link>{" "}
            helps ensure referenced assets actually return success codes.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Crawling, robots, and header-level indexing hints
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Search engines may honor robots directives delivered as headers, not
            just meta tags. If you recently migrated hosts or added edge
            middleware, double-check that you are not accidentally emitting{" "}
            <span className="font-mono text-sm">noindex</span> via{" "}
            <strong className="text-foreground">x-robots-tag</strong>. Likewise,
            confirm that staging environments are not publicly reachable with
            permissive caching headers that leak pre-production content. For
            robots.txt specifics, use the{" "}
            <Link
              href="/website/robots-txt-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              robots.txt checker
            </Link>{" "}
            and then validate individual URLs here to see how the edge actually
            responds.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related free website and URL tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Browse the full collection from our{" "}
            <Link
              href="/#website-url-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              website and URL tools
            </Link>{" "}
            section, or jump straight to adjacent checkers below. For quick status
            validation without the full header table, the{" "}
            <Link
              href="/website/response-code-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              response code checker
            </Link>{" "}
            answers whether a URL returns 200, 301, 404, or errors in one step.
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
            {httpHeaderCheckerFaqItems.map((item) => (
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
