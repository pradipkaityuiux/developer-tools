import type { Metadata } from "next";
import Link from "next/link";
import { RobotsTxtGeneratorTool } from "./robots-txt-generator-tool";
import { robotsTxtGeneratorFaqItems } from "@/lib/robots-txt-generator-faq";
import { toolSections } from "@/lib/tool-catalog";

export const dynamic = "force-static";

const seoTools =
  toolSections.find((s) => s.id === "seo-tools")?.tools ?? [];
const relatedTools = seoTools.filter(
  (t) => t.href !== "/seo/robots-txt-generator",
);

export const metadata: Metadata = {
  alternates: {
    canonical: "/seo/robots-txt-generator",
  },
};

export default function RobotsTxtGeneratorPage() {
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
            <span className="text-foreground">robots.txt generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            robots.txt generator — User-agent rules, Allow, Disallow, and
            Sitemap for SEO
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This free{" "}
            <strong className="font-medium text-foreground">
              online robots.txt generator
            </strong>{" "}
            helps you compose a standards-aligned{" "}
            <strong className="font-medium text-foreground">robots.txt</strong>{" "}
            file for{" "}
            <strong className="font-medium text-foreground">
              crawler control
            </strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">technical SEO</strong>
            : multiple{" "}
            <strong className="font-medium text-foreground">User-agent</strong>{" "}
            groups,{" "}
            <strong className="font-medium text-foreground">Allow</strong> and{" "}
            <strong className="font-medium text-foreground">Disallow</strong>{" "}
            path prefixes, optional{" "}
            <strong className="font-medium text-foreground">Crawl-delay</strong>{" "}
            (where honored), and one or more{" "}
            <strong className="font-medium text-foreground">Sitemap</strong>{" "}
            URLs. Everything runs in your browser—{" "}
            <strong className="font-medium text-foreground">copy</strong>,{" "}
            <strong className="font-medium text-foreground">download</strong>{" "}
            <code className="text-sm">robots.txt</code>, or{" "}
            <strong className="font-medium text-foreground">upload</strong> an
            existing file to refine. After deployment, validate the live file with
            the{" "}
            <Link
              href="/website/robots-txt-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              robots.txt checker
            </Link>{" "}
            and align discovery with the{" "}
            <Link
              href="/seo/sitemap-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              XML sitemap generator
            </Link>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <RobotsTxtGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why robots.txt matters for SEO and crawling
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Search engines and other bots read{" "}
            <strong className="font-medium text-foreground">/robots.txt</strong>{" "}
            before fetching large portions of your site. A clear file reduces
            accidental{" "}
            <strong className="font-medium text-foreground">crawl budget</strong>{" "}
            waste on thin or duplicate paths, points crawlers at your{" "}
            <strong className="font-medium text-foreground">XML sitemaps</strong>
            , and documents intent for teams. It complements—not replaces—
            <strong className="font-medium text-foreground"> meta robots</strong>
            , <strong className="font-medium text-foreground">canonical</strong>{" "}
            tags, and <strong className="font-medium text-foreground">redirects</strong>
            . For on-page copy limits, pair this workflow with the{" "}
            <Link
              href="/seo/meta-length-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta title and description checker
            </Link>{" "}
            and the{" "}
            <Link
              href="/seo/readability-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              readability score checker
            </Link>
            .
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Keywords teams search for—{" "}
            <strong className="font-medium text-foreground">
              robots.txt disallow all
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              allow googlebot disallow others
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              sitemap in robots.txt
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              block staging site crawlers
            </strong>
            —map to explicit{" "}
            <strong className="font-medium text-foreground">User-agent</strong>{" "}
            sections and path rules. Use{" "}
            <strong className="font-medium text-foreground">
              Disallow: /
            </strong>{" "}
            only when you truly want to block compliant generic bots from
            fetching paths; sensitive data still requires authentication.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this robots.txt generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Start with{" "}
                <strong className="font-medium text-foreground">Allow all</strong>{" "}
                or a preset (
                <strong className="font-medium text-foreground">
                  WordPress starter
                </strong>
                ,{" "}
                <strong className="font-medium text-foreground">
                  Staging: Google only
                </strong>
                ). Each group begins with a{" "}
                <strong className="font-medium text-foreground">
                  User-agent
                </strong>{" "}
                name (use <code className="text-sm">*</code> for all bots).
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Add <strong className="font-medium text-foreground">Allow</strong>{" "}
                and{" "}
                <strong className="font-medium text-foreground">Disallow</strong>{" "}
                rows as path prefixes (for example{" "}
                <code className="text-sm">/admin/</code>). Put more specific
                exceptions after broader rules when both apply.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Optional: set{" "}
                <strong className="font-medium text-foreground">
                  Crawl-delay
                </strong>{" "}
                per group if a bot you care about reads it—note that{" "}
                <strong className="font-medium text-foreground">
                  Googlebot ignores Crawl-delay
                </strong>{" "}
                in robots.txt.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Add <strong className="font-medium text-foreground">Sitemap</strong>{" "}
                URLs (absolute HTTPS). Use{" "}
                <strong className="font-medium text-foreground">
                  Append /sitemap.xml
                </strong>{" "}
                after entering your site origin, or paste multiple sitemap URLs
                for large indexes and news/video sitemaps.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">Copy</strong> or{" "}
                <strong className="font-medium text-foreground">Download</strong>{" "}
                the preview and place the file at your domain root. Use{" "}
                <strong className="font-medium text-foreground">Upload</strong> to
                load an existing robots.txt, edit in the preview, then re-export.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Guides: Allow vs Disallow, specificity, and sitemaps
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Modern crawlers follow{" "}
            <strong className="font-medium text-foreground">
              longest match / most specific rule
            </strong>{" "}
            semantics for URL path prefixes. An empty{" "}
            <strong className="font-medium text-foreground">Disallow</strong>{" "}
            value means no path is disallowed for that group—often used as the
            minimal “allow everything” pattern. Listing{" "}
            <strong className="font-medium text-foreground">Sitemap</strong>{" "}
            directives helps discovery even when URLs are also submitted in
            Search Console; keep sitemap XML valid and under size limits. For
            campaign and migration QA, combine robots rules with the{" "}
            <Link
              href="/seo/redirect-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect type checker
            </Link>{" "}
            and the{" "}
            <Link
              href="/website/canonical-tag-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              canonical tag checker
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Internal linking: SEO tools that pair with robots.txt
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use the{" "}
            <Link
              href="/website/robots-txt-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              live robots.txt checker
            </Link>{" "}
            after deploy, build structured data with the{" "}
            <Link
              href="/seo/schema-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              schema markup generator
            </Link>
            , tune social previews via the{" "}
            <Link
              href="/seo/og-tag-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph tag generator
            </Link>
            , and track campaigns with the{" "}
            <Link
              href="/seo/utm-builder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              UTM link builder
            </Link>
            . Multilingual sites often coordinate hreflang with crawl policy—see
            the{" "}
            <Link
              href="/seo/hreflang-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              hreflang tag generator
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related SEO tools in this catalog
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Browse the full{" "}
            <Link
              href="/#seo-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SEO tools
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
            {robotsTxtGeneratorFaqItems.map((item) => (
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
