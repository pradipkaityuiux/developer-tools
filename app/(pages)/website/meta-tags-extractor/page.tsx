import type { Metadata } from "next";
import Link from "next/link";
import { MetaTagsExtractorTool } from "./meta-tags-extractor-tool";
import { metaTagsExtractorFaqItems } from "@/lib/meta-tags-extractor-faq";
import { toolSections } from "@/lib/tool-catalog";

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/website/meta-tags-extractor",
  },
};

const websiteTools =
  toolSections.find((s) => s.id === "website-url-tools")?.tools ?? [];
const relatedTools = websiteTools.filter(
  (t) => t.href !== "/website/meta-tags-extractor",
);

export default function MetaTagsExtractorPage() {
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
            <span className="text-foreground">Meta tags extractor</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Meta tags extractor for SEO, Open Graph & Twitter Cards
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Run a free{" "}
            <strong className="font-medium text-foreground">
              meta tags extractor
            </strong>{" "}
            on any public page: we fetch the HTML, follow redirects safely, and
            list your{" "}
            <strong className="font-medium text-foreground">
              {"<title>"} and meta description
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              rel=&quot;canonical&quot;
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              Open Graph (og:*)
            </strong>{" "}
            properties,{" "}
            <strong className="font-medium text-foreground">
              Twitter Card (twitter:*)
            </strong>{" "}
            tags, plus robots, viewport, and other head metadata. Built for{" "}
            <strong className="font-medium text-foreground">technical SEO</strong>
            , content QA before launch, and quick competitive reviews when you
            want to see exactly which{" "}
            <strong className="font-medium text-foreground">
              HTML meta tags
            </strong>{" "}
            a URL returns to crawlers.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <MetaTagsExtractorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            What is a meta tags extractor?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            A{" "}
            <strong className="font-medium text-foreground">
              meta tags extractor
            </strong>{" "}
            reads the{" "}
            <strong className="font-medium text-foreground">
              HTML document head
            </strong>{" "}
            of a live URL and surfaces the tags that influence search snippets
            and social previews: the document title, description-style{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              meta name=&quot;description&quot;
            </code>
            ,{" "}
            <strong className="font-medium text-foreground">
              Open Graph
            </strong>{" "}
            markup for platforms that honor{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              og:title
            </code>
            /
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              og:image
            </code>
            ,{" "}
            <strong className="font-medium text-foreground">
              Twitter Card
            </strong>{" "}
            fields, and the{" "}
            <strong className="font-medium text-foreground">canonical URL</strong>{" "}
            hint that helps consolidate duplicate URLs. Unlike viewing source in a
            browser tab that might reflect logged-in or client-rendered state,
            this tool shows what our server retrieved from the public web—useful
            for comparing staging versus production when both are reachable, or
            for auditing competitor landing pages.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Why meta tags matter for SEO and social sharing
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">
              Search engines
            </strong>{" "}
            still lean heavily on the{" "}
            <strong className="font-medium text-foreground">title tag</strong> and
            meta description (among many other signals) when generating result
            lines—though they may rewrite descriptions when they believe other
            on-page text is a better match.{" "}
            <strong className="font-medium text-foreground">
              Social networks and chat apps
            </strong>{" "}
            typically assemble link previews from Open Graph and Twitter tags,
            so missing{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              og:image
            </code>{" "}
            or inconsistent{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              og:title
            </code>{" "}
            values directly affect click-through on shared links.{" "}
            <strong className="font-medium text-foreground">Canonical</strong>{" "}
            tags reduce ambiguity when the same content is reachable under
            multiple URLs—pair extraction with our{" "}
            <Link
              href="/website/canonical-tag-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              canonical tag checker
            </Link>{" "}
            when you want a dedicated pass on that single signal.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Open Graph vs classic meta tags
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Classic{" "}
            <strong className="font-medium text-foreground">SEO meta tags</strong>{" "}
            such as{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              robots
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              viewport
            </code>
            , and description help crawlers and browsers understand indexing and
            rendering rules.{" "}
            <strong className="font-medium text-foreground">
              Open Graph protocol
            </strong>{" "}
            tags use{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              property=&quot;og:…&quot;
            </code>{" "}
            and are consumed by many non-Google surfaces. It is common to align{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              og:title
            </code>{" "}
            with the HTML title while tailoring length for feeds, and to ensure{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              og:url
            </code>{" "}
            matches your preferred sharing URL. After extraction, visualize how
            those fields might render with our{" "}
            <Link
              href="/website/open-graph-preview"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph preview
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Twitter Cards and fallback behavior
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">Twitter Card</strong>{" "}
            meta tags (for example{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              twitter:card
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              twitter:image
            </code>
            ) tell X how to build rich previews. When they are missing, X often
            falls back to Open Graph data—so seeing only{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              og:*
            </code>{" "}
            in your extraction output is not automatically an error. Still,
            explicit Twitter tags let you decouple image crops or copy from what
            you want on LinkedIn or Slack, where OG rules dominate.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this meta tags extractor (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Copy the{" "}
                <strong className="font-medium text-foreground">
                  fully qualified URL
                </strong>{" "}
                you want to audit—article, product page, or homepage. We prepend{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  https://
                </code>{" "}
                when you omit the scheme, similar to our{" "}
                <Link
                  href="/website/http-header-checker"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  HTTP header checker
                </Link>
                .
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Extract meta tags
                </strong>
                . We resolve DNS to a public address, follow redirects up to a
                fixed hop limit, download a capped slice of HTML, and parse tags
                in the head region. If the response is not HTML, you will see a
                clear error instead of empty tables.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read the{" "}
                <strong className="font-medium text-foreground">
                  core summary
                </strong>{" "}
                first—title, meta description, canonical, and{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  og:url
                </code>
                . Then scan Open Graph and Twitter tables for completeness
                (image dimensions, alt text when provided, article published
                time for newsy templates).
              </span>
            </li>
            <li>
              <span className="text-foreground">
                When previews still look wrong, broaden your audit: trace
                redirects with the{" "}
                <Link
                  href="/website/redirect-chain-checker"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  redirect chain checker
                </Link>
                , confirm response headers with the{" "}
                <Link
                  href="/website/http-header-checker"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  HTTP header checker
                </Link>{" "}
                (for example{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  x-robots-tag
                </code>
                ), and review crawl rules using the{" "}
                <Link
                  href="/website/robots-txt-checker"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  robots.txt checker
                </Link>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Practical checklist after you extract meta tags
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">Title</strong>:
                unique per page, aligned with the primary query intent, roughly
                50–60 visible characters as a rule of thumb (search engines
                truncate dynamically).
              </span>
            </li>
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  Meta description
                </strong>
                : compelling summary, not stuffed with keywords; compare with
                on-page H1 and intro copy for consistency.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">Canonical</strong>
                : points to the primary URL you want indexed; watch for accidental
                cross-domain or parameter mistakes after migrations.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  Open Graph image
                </strong>
                : absolute HTTPS URL, appropriate aspect ratio for target
                networks, file size reasonable for mobile shares.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">Robots</strong>:
                ensure you are not accidentally issuing{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  noindex
                </code>{" "}
                on production templates.
              </span>
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Limitations every meta tag tool shares
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Pages that render critical tags only in the browser after JavaScript
            executes may show incomplete results in any server-side extractor.
            Paywalled, geo-blocked, or bot-challenged sites can return different
            HTML to different clients. We also cap how many bytes of HTML we
            read—extremely large documents may mark truncation; meta tags should
            still usually appear early. For TLS or hostname issues before HTML
            is reached, validate certificates with our{" "}
            <Link
              href="/website/ssl-certificate-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SSL certificate checker
            </Link>{" "}
            and status behavior with the{" "}
            <Link
              href="/website/response-code-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              response code checker
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related free tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Explore more utilities in the{" "}
            <Link
              href="/#website-url-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              website and URL tools
            </Link>{" "}
            section on the home page, or open a focused checker below.
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
            {metaTagsExtractorFaqItems.map((item) => (
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
