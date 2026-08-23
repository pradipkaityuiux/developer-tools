import type { Metadata } from "next";
import Link from "next/link";
import { OpenGraphPreviewTool } from "./open-graph-preview-tool";
import { openGraphPreviewFaqItems } from "@/lib/open-graph-preview-faq";
import { toolSections } from "@/lib/tool-catalog";

export const dynamic = "force-static";

const websiteTools =
  toolSections.find((s) => s.id === "website-url-tools")?.tools ?? [];
const relatedTools = websiteTools.filter(
  (t) => t.href !== "/website/open-graph-preview",
);

export const metadata: Metadata = {
  alternates: {
    canonical: "/website/open-graph-preview",
  },
};

export default function OpenGraphPreviewPage() {
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
            <span className="text-foreground">Open Graph preview</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Open Graph preview for social link cards &amp; unfurls
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Paste any public page to generate an{" "}
            <strong className="font-medium text-foreground">
              Open Graph preview
            </strong>{" "}
            before you tweet, post, or drop a link in Slack. We read{" "}
            <strong className="font-medium text-foreground">og:title</strong>,{" "}
            <strong className="font-medium text-foreground">
              og:description
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">og:image</strong>,{" "}
            <strong className="font-medium text-foreground">og:url</strong>, and{" "}
            <strong className="font-medium text-foreground">
              Twitter Card
            </strong>{" "}
            fields from the HTML, then show a compact{" "}
            <strong className="font-medium text-foreground">
              social share card
            </strong>{" "}
            plus a field-by-field breakdown. Use it for{" "}
            <strong className="font-medium text-foreground">
              Facebook link previews
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              LinkedIn post previews
            </strong>
            , messaging apps that unfurl URLs, and any workflow where{" "}
            <strong className="font-medium text-foreground">
              link preview quality
            </strong>{" "}
            affects clicks and trust.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <OpenGraphPreviewTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            How to use this Open Graph checker
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Enter a full URL or a hostname; if you skip{" "}
            <span className="font-mono text-sm">https://</span> we assume HTTPS.
            Click{" "}
            <strong className="font-medium text-foreground">Preview</strong> to
            fetch the document from our infrastructure (with the same{" "}
            <strong className="font-medium text-foreground">
              public URL safety checks
            </strong>{" "}
            as our other website tools). The top panel approximates how a{" "}
            <strong className="font-medium text-foreground">
              rich link preview
            </strong>{" "}
            might look: hostname, title, description, and cover image when{" "}
            <span className="font-mono text-sm">og:image</span> resolves. Below,
            compare raw{" "}
            <strong className="font-medium text-foreground">
              Open Graph protocol
            </strong>{" "}
            values side by side with{" "}
            <strong className="font-medium text-foreground">
              Twitter meta tags
            </strong>{" "}
            and HTML fallbacks (
            <span className="font-mono text-sm">&lt;title&gt;</span> and{" "}
            <span className="font-mono text-sm">meta description</span>
            ). Iterate in your CMS or framework until every field you care about
            is populated and images load over HTTPS with sensible dimensions.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Open Graph tags: a practical guide for marketers and developers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            At minimum, most teams implement{" "}
            <strong className="font-medium text-foreground">og:title</strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">
              og:description
            </strong>{" "}
            to control the headline and body copy of an unfurl.{" "}
            <strong className="font-medium text-foreground">og:image</strong>{" "}
            should be an absolute URL to a raster image platforms can fetch;
            relative paths only work if the base URL is unambiguous.{" "}
            <strong className="font-medium text-foreground">og:url</strong>{" "}
            should point at the canonical share target when you have
            duplicates or tracking parameters stripped. Optional{" "}
            <strong className="font-medium text-foreground">og:type</strong> and{" "}
            <strong className="font-medium text-foreground">
              og:site_name
            </strong>{" "}
            help categorization and branding in some clients. Pair this page with
            the{" "}
            <Link
              href="/website/canonical-tag-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              canonical tag checker
            </Link>{" "}
            when you want <span className="font-mono text-sm">og:url</span> and{" "}
            <span className="font-mono text-sm">rel=canonical</span> to agree,
            and the{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>{" "}
            if marketing links hop through shorteners before landing on tagged
            HTML.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Twitter Cards, Slack, and other unfurl engines
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Many products read Twitter&apos;s{" "}
            <span className="font-mono text-sm">twitter:*</span> namespace first,
            then fall back to Open Graph. We surface{" "}
            <strong className="font-medium text-foreground">
              twitter:card
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              twitter:title
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              twitter:description
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              twitter:image
            </strong>{" "}
            so you can spot mismatches—for example a long{" "}
            <span className="font-mono text-sm">summary_large_image</span> crop
            that looks fine on one network but tight on another. Remember that
            each platform caches: after you fix tags, you may need their
            debugger or a cache-busting image URL to see updates immediately.
            When a preview works here but not in production, verify{" "}
            <strong className="font-medium text-foreground">
              HTTP status and headers
            </strong>{" "}
            with our{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>{" "}
            and confirm the page returns{" "}
            <strong className="font-medium text-foreground">200 HTML</strong>{" "}
            without bot-blocking that might differ per user agent.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            SEO, CTR, and when Open Graph still matters
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Open Graph metadata is not a replacement for on-page SEO, but it
            aligns how your story appears in organic snippets and social feeds.
            A strong{" "}
            <strong className="font-medium text-foreground">
              meta description
            </strong>{" "}
            supports both search result blurbs and fallback unfurls when{" "}
            <span className="font-mono text-sm">og:description</span> is absent.
            Technical hygiene still matters: serve pages over{" "}
            <strong className="font-medium text-foreground">HTTPS</strong> with a
            valid certificate—our{" "}
            <Link
              href="/website/ssl-certificate-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SSL certificate checker
            </Link>{" "}
            helps before launch—and keep internal links healthy with the{" "}
            <Link
              href="/website/broken-link-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              broken link checker
            </Link>{" "}
            on key templates.             For a broader tag inventory (including robots and viewport),
            pair this page with the{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            for full-document head markup while this tool emphasizes
            share-oriented Open Graph and Twitter fields.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Limitations and honest expectations
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            We parse the initial server HTML up to a size limit—pages that
            inject Open Graph only after heavy client-side JavaScript may look
            empty here and to crawlers. Image previews in your browser depend on
            third-party servers allowing the request; a tag can be correct while
            the image fails to render due to hotlink protection or CORS. Results
            reflect what our fetch sees from the public internet, not logged-in
            or geo-gated content. Use the preview as a fast{" "}
            <strong className="font-medium text-foreground">
              Open Graph debugger
            </strong>
            -style signal, then validate in each network you rely on.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related free website tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Explore every utility in the{" "}
            <Link
              href="/#website-url-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              website and URL tools
            </Link>{" "}
            section, or open a focused checker below.
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
            {openGraphPreviewFaqItems.map((item) => (
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
