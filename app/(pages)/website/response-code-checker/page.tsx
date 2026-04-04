import type { Metadata } from "next";
import Link from "next/link";
import { ResponseCodeCheckerTool } from "./response-code-checker-tool";
import { responseCodeCheckerFaqItems } from "@/lib/response-code-checker-faq";
import { toolSections } from "@/lib/tool-catalog";

export const dynamic = "force-static";

const websiteTools =
  toolSections.find((s) => s.id === "website-url-tools")?.tools ?? [];
const relatedTools = websiteTools.filter(
  (t) => t.href !== "/website/response-code-checker",
);

export const metadata: Metadata = {
  alternates: {
    canonical: "/website/response-code-checker",
  },
};

export default function ResponseCodeCheckerPage() {
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
            <span className="text-foreground">HTTP status code checker</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            HTTP status code checker for URLs, SEO, and production QA
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Enter any public{" "}
            <strong className="font-medium text-foreground">HTTP or HTTPS</strong>{" "}
            address and read the{" "}
            <strong className="font-medium text-foreground">
              final HTTP status code
            </strong>{" "}
            after server-side redirect following—
            <strong className="font-medium text-foreground">200 OK</strong>,{" "}
            <strong className="font-medium text-foreground">301</strong> /{" "}
            <strong className="font-medium text-foreground">302</strong>{" "}
            redirects,{" "}
            <strong className="font-medium text-foreground">404 Not Found</strong>
            , <strong className="font-medium text-foreground">403 Forbidden</strong>
            , <strong className="font-medium text-foreground">500</strong> series
            errors, and more. Built for{" "}
            <strong className="font-medium text-foreground">SEO audits</strong>,{" "}
            <strong className="font-medium text-foreground">
              migration smoke tests
            </strong>
            , marketing link validation, and quick comparisons between the URL
            you typed and the{" "}
            <strong className="font-medium text-foreground">final landing URL</strong>{" "}
            crawlers and CDNs observe.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <ResponseCodeCheckerTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            How to use this HTTP response code checker
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Paste a page, asset, or API path you care about. You may omit{" "}
            <code className="text-sm text-foreground">https://</code>; we normalize
            to a valid URL before fetching. Click{" "}
            <strong className="text-foreground">Check status</strong> to run a
            server-side GET with manual redirect handling. The headline number is
            the <strong className="text-foreground">last status</strong> in the
            chain—the same end state many browsers reach after following{" "}
            <code className="text-sm text-foreground">Location</code> redirects.
            When the final URL differs from what you entered, compare the two
            addresses and decide whether internal links, sitemap entries, or{" "}
            <Link
              href="/website/canonical-tag-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              canonical tags
            </Link>{" "}
            should point at the destination directly.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            For a tabular list of every hop with{" "}
            <strong className="text-foreground">status and Location</strong> values,
            open our{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>
            . To inspect{" "}
            <strong className="text-foreground">Cache-Control</strong>,{" "}
            <strong className="text-foreground">Content-Security-Policy</strong>,{" "}
            <strong className="text-foreground">Set-Cookie</strong>, and the rest of
            the header set on the final response, use the{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>
            . When you need to validate many links discovered on a single HTML
            page, run the{" "}
            <Link
              href="/website/broken-link-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              broken link checker
            </Link>{" "}
            after structural or CMS changes.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Guide: common HTTP status codes for SEO and ops
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <strong className="text-foreground">2xx success</strong> —{" "}
              <strong>200</strong> is the typical OK for HTML and APIs;{" "}
              <strong>204</strong> is common for successful requests with no body.
              Search engines can index 200 responses that return indexable content.
            </li>
            <li>
              <strong className="text-foreground">301 / 308</strong> — permanent
              moves. Use for durable URL changes; update internal links to reduce
              hops.
            </li>
            <li>
              <strong className="text-foreground">302 / 307</strong> — temporary
              moves. Fine for short campaigns; avoid leaving temporary redirects on
              long-lived URLs you intend to retire.
            </li>
            <li>
              <strong className="text-foreground">404 / 410</strong> — missing or
              intentionally removed content. Fix inbound links and sitemap entries;
              consider <strong>410</strong> when removal is permanent and explicit.
            </li>
            <li>
              <strong className="text-foreground">403</strong> — understood but
              refused. Often WAF, geo, or auth. Align automated checks with what
              real users should experience.
            </li>
            <li>
              <strong className="text-foreground">5xx</strong> — server-side
              failure. Treat as incidents: they hurt crawl efficiency and user
              trust until resolved.
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            When to pair this tool with DNS, TLS, and WHOIS checks
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Status codes describe the HTTP layer only. If you see unexpected
            redirects or TLS errors in the browser, validate hostname resolution
            with the{" "}
            <Link
              href="/website/dns-lookup"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              DNS lookup tool
            </Link>
            , certificate validity with the{" "}
            <Link
              href="/website/ssl-certificate-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SSL certificate checker
            </Link>
            , and registration context with{" "}
            <Link
              href="/website/whois-lookup"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              WHOIS lookup
            </Link>{" "}
            or{" "}
            <Link
              href="/website/domain-age-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              domain age checker
            </Link>{" "}
            when you are vetting a property end to end.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Crawler and bot considerations
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Automated probes may receive different responses than logged-in users
            or certain geographic regions. Always reconcile this checker with your
            CDN analytics, origin access logs, and{" "}
            <Link
              href="/website/robots-txt-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              robots.txt rules
            </Link>{" "}
            when diagnosing why search engines report crawl anomalies or soft 404
            behavior.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related free tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
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
            {responseCodeCheckerFaqItems.map((item) => (
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
