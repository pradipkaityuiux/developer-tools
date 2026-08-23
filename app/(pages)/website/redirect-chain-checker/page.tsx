import type { Metadata } from "next";
import Link from "next/link";
import { RedirectChainCheckerTool } from "./redirect-chain-checker-tool";
import { redirectChainCheckerFaqItems } from "@/lib/redirect-chain-checker-faq";
import { toolSections } from "@/lib/tool-catalog";

export const dynamic = "force-static";

const websiteTools =
  toolSections.find((s) => s.id === "website-url-tools")?.tools ?? [];
const relatedTools = websiteTools.filter(
  (t) => t.href !== "/website/redirect-chain-checker",
);

export const metadata: Metadata = {
  alternates: {
    canonical: "/website/redirect-chain-checker",
  },
};

export default function RedirectChainCheckerPage() {
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
            <span className="text-foreground">Redirect chain checker</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Redirect chain checker for SEO and performance
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Map the full{" "}
            <strong className="font-medium text-foreground">
              HTTP redirect path
            </strong>{" "}
            from any public URL: each step shows the{" "}
            <strong className="font-medium text-foreground">
              status code
            </strong>{" "}
            (301, 302, 307, 308, 303, or final response) and the{" "}
            <strong className="font-medium text-foreground">
              Location header
            </strong>{" "}
            when present. Use it for{" "}
            <strong className="font-medium text-foreground">
              SEO redirect audits
            </strong>
            , migration QA, CDN rule debugging, and spotting{" "}
            <strong className="font-medium text-foreground">
              unnecessary redirect hops
            </strong>{" "}
            that slow down users and crawlers.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <RedirectChainCheckerTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            How to use this redirect chain analyzer
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Paste a link you care about—an old blog path, a tracked campaign URL,
            a short domain, or a bare apex host. Submit to run a server-side{" "}
            <strong>GET</strong> with manual redirect handling so every hop is
            visible. Compare the first URL you entered with the last row: that is
            your effective landing URL for this trace. When the chain is longer
            than one redirect, open your CDN or origin config and collapse rules
            where possible, then re-run the trace to confirm a shorter path.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Pair this workflow with our{" "}
            <Link
              href="/website/response-code-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              server response code checker
            </Link>{" "}
            for a single-shot status read, the{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>{" "}
            for Cache-Control and security headers on the final response, and the{" "}
            <Link
              href="/website/broken-link-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              broken link checker
            </Link>{" "}
            when you need to validate many outbound URLs on a page after URL
            structure changes.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Why redirect chains matter for SEO
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Search engines follow redirects, but each extra hop consumes crawl
            budget and time. A clean information architecture uses{" "}
            <strong>one canonical HTTPS URL</strong>,{" "}
            <Link
              href="/website/canonical-tag-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              consistent canonical tags
            </Link>
            , and direct internal links to that URL. Legacy stacks often stack
            rules: HTTP→HTTPS, apex→www, trailing slash normalization, and
            locale prefixes. Those layers are valid, yet long{" "}
            <strong>301 redirect chains</strong> still add latency for users and
            increase the odds of misconfigured <strong>302 temporary</strong>{" "}
            responses where a <strong>301 or 308 permanent</strong> move was
            intended.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            After you verify the chain, confirm TLS and hostname trust with the{" "}
            <Link
              href="/website/ssl-certificate-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SSL certificate checker
            </Link>{" "}
            and DNS targets with the{" "}
            <Link
              href="/website/dns-lookup"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              DNS lookup tool
            </Link>
            —especially when redirects cross subdomains or edge workers.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Guide: interpreting each hop in the table
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <strong className="text-foreground">301 / 308</strong> — permanent
              redirect; search engines usually consolidate ranking signals toward
              the target in <code className="text-sm">Location</code>.
            </li>
            <li>
              <strong className="text-foreground">302 / 307</strong> — temporary;
              the source URL may return later, so equity may not consolidate the
              same way as a permanent move.
            </li>
            <li>
              <strong className="text-foreground">303</strong> — often used
              after form posts to send clients to a GET resource; less common for
              static marketing URLs.
            </li>
            <li>
              <strong className="text-foreground">2xx</strong> — end of the
              redirect chain for this trace; the URL on that row is the final
              requested address for this run.
            </li>
            <li>
              <strong className="text-foreground">4xx / 5xx</strong> — the chain
              ended in an error; fix origin routing, auth, or upstream health
              before expecting crawlers or users to succeed.
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Practical checklist for shorter redirect paths
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              Update sitemaps and navigation to reference the{" "}
              <strong>final URL</strong>, not legacy paths that bounce twice.
            </li>
            <li>
              Prefer one redirect from legacy hosts to the canonical host rather
              than chaining through multiple vanity domains.
            </li>
            <li>
              Audit marketing parameters: UTM links should still resolve quickly;
              use this tool on sample links from email and ads.
            </li>
            <li>
              Re-check{" "}
              <Link
                href="/website/robots-txt-checker"
                className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
              >
                robots.txt
              </Link>{" "}
              and crawler behavior if redirects differ for bots versus browsers.
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related free tools
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
            {redirectChainCheckerFaqItems.map((item) => (
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
