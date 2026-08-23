import type { Metadata } from "next";
import Link from "next/link";
import { OgTagGeneratorTool } from "./og-tag-generator-tool";
import { ogTagGeneratorFaqItems } from "@/lib/og-tag-generator-faq";
import { toolSections } from "@/lib/tool-catalog";
import { BlogCard } from "@/components/blog-card";

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/seo/og-tag-generator",
  },
};

const seoTools =
  toolSections.find((s) => s.id === "seo-tools")?.tools ?? [];
const relatedSeoTools = seoTools.filter(
  (t) => t.href !== "/seo/og-tag-generator",
);

export default function OgTagGeneratorPage() {
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
            <Link href="/#seo-tools" className="hover:text-foreground">
              SEO tools
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span className="text-foreground">Open Graph tag generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Open Graph tag generator for social share cards &amp; marketing QA
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Build production-ready{" "}
            <strong className="font-medium text-foreground">
              Open Graph meta tags
            </strong>{" "}
            (
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              og:title
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              og:description
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              og:image
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              og:url
            </code>
            , and more) plus optional{" "}
            <strong className="font-medium text-foreground">
              Twitter Card tags
            </strong>{" "}
            in one place. See a lightweight{" "}
            <strong className="font-medium text-foreground">
              social share card preview
            </strong>
            , copy escaped HTML for your{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              &lt;head&gt;
            </code>
            , or{" "}
            <strong className="font-medium text-foreground">
              upload an HTML file
            </strong>{" "}
            to import existing tags—ideal for content strategists, growth teams,
            and developers shipping Next.js, WordPress, or static sites who need
            repeatable{" "}
            <strong className="font-medium text-foreground">
              link preview
            </strong>{" "}
            quality across{" "}
            <strong className="font-medium text-foreground">
              Facebook link previews
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              LinkedIn post previews
            </strong>
            , Slack, Discord, and messaging apps that unfurl URLs.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <OgTagGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            How to use this Open Graph meta tag generator
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Start with the headline and supporting copy you want people to see
            when your link is shared—usually aligned with your{" "}
            <strong className="font-medium text-foreground">H1</strong> and{" "}
            <strong className="font-medium text-foreground">
              meta description
            </strong>
            , but tuned for social context. Paste an{" "}
            <strong className="font-medium text-foreground">
              absolute HTTPS image URL
            </strong>{" "}
            for{" "}
            <code className="font-mono text-sm">og:image</code>; wide images near
            1200×630 pixels work well as a default for many networks. Set{" "}
            <code className="font-mono text-sm">og:url</code> to the canonical
            page you want shares to reference. Choose{" "}
            <code className="font-mono text-sm">og:type</code> (for example{" "}
            <code className="font-mono text-sm">website</code> or{" "}
            <code className="font-mono text-sm">article</code>) and{" "}
            <code className="font-mono text-sm">og:locale</code> when you publish
            localized sites. Enable Twitter Card output when X/Twitter traffic
            matters: we mirror Open Graph title, description, and image when the
            Twitter-specific fields are empty so you do not duplicate work. Use{" "}
            <strong className="font-medium text-foreground">Upload HTML</strong>{" "}
            to pull tags from a saved template, tweak values, then use the{" "}
            <strong className="font-medium text-foreground">copy icon</strong>{" "}
            to grab the final snippet.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Open Graph protocol: fields that matter for link previews
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            The{" "}
            <strong className="font-medium text-foreground">
              Open Graph protocol
            </strong>{" "}
            maps your page to a graph object: title and description control the
            text,{" "}
            <code className="font-mono text-sm">og:image</code> supplies the
            raster asset clients fetch, and{" "}
            <code className="font-mono text-sm">og:url</code> stabilizes which
            URL analytics and social graphs attribute.{" "}
            <code className="font-mono text-sm">og:site_name</code> reinforces
            brand next to the hostname in some UIs. Optional{" "}
            <code className="font-mono text-sm">og:image:alt</code> improves
            accessibility when images fail or for assistive tech. For editorial
            content, combine{" "}
            <code className="font-mono text-sm">og:type=article</code> with{" "}
            <code className="font-mono text-sm">article:published_time</code>{" "}
            and related fields so readers and platforms see freshness signals.
            After you paste tags, validate semantics alongside your on-page SEO:
            our{" "}
            <Link
              href="/seo/meta-length-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta title &amp; description length checker
            </Link>{" "}
            helps keep titles and snippets within typical SERP planning bands
            while you tune social copy in parallel.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Twitter Cards and mirroring Open Graph
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Many clients read{" "}
            <code className="font-mono text-sm">twitter:card</code> and related
            namespaced tags. This generator can emit{" "}
            <code className="font-mono text-sm">summary_large_image</code> or{" "}
            <code className="font-mono text-sm">summary</code> layouts and
            optional <code className="font-mono text-sm">twitter:site</code>{" "}
            for your brand handle. When you leave Twitter title or description
            blank, we reuse your Open Graph values so messaging stays consistent
            between networks. For a post-deploy sanity check on a public URL,
            use our{" "}
            <Link
              href="/website/open-graph-preview"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph preview
            </Link>{" "}
            to fetch live HTML and compare platform-style fields to what you
            authored here. If you need the full head inventory (robots, viewport,
            hreflang), pair this page with the{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>
            .
          </p>

          <BlogCard
            title="How to Write an OG Tag So Your Links Look Good on Social Media"
            description="Someone shares a link on X or Slack, and instead of a nice preview card with an image, title, and description, you get a bare gray box with just the URL."
            href="/blog/how-to-write-og-tags-social-media"
          />

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            SEO, CTR, and social metadata together
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Strong Open Graph tags do not replace technical SEO, but they align
            how your story appears in feeds with how you want the page to rank
            and convert. Keep canonical URLs, redirects, and HTTPS consistent:
            our{" "}
            <Link
              href="/website/canonical-tag-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              canonical tag checker
            </Link>{" "}
            and{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>{" "}
            help ensure <code className="font-mono text-sm">og:url</code> and
            user-facing links land on the right 200 OK HTML. For readability of
            the body copy that supports both SEO and social blurbs, try the{" "}
            <Link
              href="/seo/readability-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              readability score checker
            </Link>{" "}
            and{" "}
            <Link
              href="/seo/keyword-density"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              keyword density checker
            </Link>{" "}
            when you refine drafts before publishing.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and where your data goes
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Tag generation and HTML upload run in your browser: we do not store
            your copy or uploaded files on a server for this tool. Clipboard copy
            uses the browser clipboard API. When you later test a live URL in our
            Open Graph preview, that feature fetches the page from our
            infrastructure with the same safety rules as other website utilities.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            More SEO tools on this site
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browse the full{" "}
            <Link
              href="/#seo-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SEO tools
            </Link>{" "}
            section for robots.txt, sitemaps, UTM builders, and more, or open a
            focused utility below.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {relatedSeoTools.slice(0, 12).map((tool) => (
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
            {ogTagGeneratorFaqItems.map((item) => (
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
