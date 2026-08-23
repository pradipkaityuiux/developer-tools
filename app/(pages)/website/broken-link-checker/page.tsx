import type { Metadata } from "next";
import Link from "next/link";
import { BrokenLinkCheckerTool } from "./broken-link-checker-tool";
import { brokenLinkCheckerFaqItems } from "@/lib/broken-link-checker-faq";
import { toolSections } from "@/lib/tool-catalog";

const websiteTools =
  toolSections.find((s) => s.id === "website-url-tools")?.tools ?? [];
const relatedTools = websiteTools.filter(
  (t) => t.href !== "/website/broken-link-checker",
);

export const metadata: Metadata = {
  alternates: {
    canonical: "/website/broken-link-checker",
  },
};

export default function BrokenLinkCheckerPage() {
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
              <span className="text-foreground">Broken link checker</span>
            </nav>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Broken link checker for outbound URLs
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              Run a fast{" "}
              <strong className="font-medium text-foreground">
                dead link check
              </strong>{" "}
              on any public HTML page: we extract{" "}
              <strong className="font-medium text-foreground">
                anchor hrefs
              </strong>
              , resolve them to absolute URLs, and report{" "}
              <strong className="font-medium text-foreground">
                HTTP status codes
              </strong>{" "}
              so you can find{" "}
              <strong className="font-medium text-foreground">404 errors</strong>
              , redirects, and failed requests. Built for{" "}
              <strong className="font-medium text-foreground">SEO audits</strong>
              , content QA, and developer troubleshooting.
            </p>
          </div>
        </div>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
          <BrokenLinkCheckerTool />

          <article className="mt-14 max-w-3xl text-foreground">
            <h2 className="text-xl font-semibold tracking-tight">
              How to use this link scanner
            </h2>
            <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
              Paste the full address of a page you control or want to audit—
              for example a blog article, documentation page, or marketing URL.
              Submit the form to fetch that page and enumerate links. Each row
              shows the original{" "}
              <Link
                href="/website/meta-tags-extractor"
                className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
              >
                HTML href
              </Link>
              , the
              resolved target, and whether the response looks healthy. Use filters
              mentally: prioritize marketing pages, footers, and navigation
              blocks where{" "}
              <Link
                href="/website/response-code-checker"
                className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
              >
                status codes
              </Link>{" "}
              matter most for SEO and UX.
            </p>

            <h2 className="mt-10 text-xl font-semibold tracking-tight">
              Why run outbound link checks?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
              Outbound references rot when partners rename paths, CDNs change, or
              old campaigns expire. A dedicated{" "}
              <strong>website link scanner</strong> surfaces those regressions
              before users and crawlers hit them. Pair link hygiene with{" "}
              <Link
                href="/website/http-header-checker"
                className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
              >
                header inspection
              </Link>{" "}
              when you suspect caching or bot rules, and with our{" "}
              <Link
                href="/website/redirect-chain-checker"
                className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
              >
                redirect chain checker
              </Link>{" "}
              when URLs hop through multiple hops before landing.
            </p>

            <h2 className="mt-10 text-xl font-semibold tracking-tight">
              Related free tools
            </h2>
            <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
              Explore more utilities from the same category on our{" "}
              <Link
                href="/#website-url-tools"
                className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
              >
                website and URL tools
              </Link>{" "}
              index, or jump to a specific checker below.
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

          <section
            className="mt-16 max-w-3xl"
            aria-labelledby="faq-heading"
          >
            <h2
              id="faq-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Frequently asked questions
            </h2>
            <dl className="mt-6 space-y-4">
              {brokenLinkCheckerFaqItems.map((item) => (
                <div
                  key={item.question}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <dt className="font-medium text-foreground">
                    {item.question}
                  </dt>
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
