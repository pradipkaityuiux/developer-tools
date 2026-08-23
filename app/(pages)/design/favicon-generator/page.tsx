import type { Metadata } from "next";
import Link from "next/link";
import { FaviconGeneratorTool } from "./favicon-generator-tool";
import { faviconGeneratorFaqItems } from "@/lib/favicon-generator-faq";
import { toolSections } from "@/lib/tool-catalog";

const designTools =
  toolSections.find((s) => s.id === "design-color-tools")?.tools ?? [];
const relatedTools = designTools.filter(
  (t) => t.href !== "/design/favicon-generator",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/design/favicon-generator",
  },
};

export default function FaviconGeneratorPage() {
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
            <span className="text-foreground">Favicon generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Favicon generator online — favicon.ico plus PNG pack for browser
            tabs, Apple Touch Icon, and PWA manifests
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              favicon generator
            </strong>{" "}
            to turn a{" "}
            <strong className="font-medium text-foreground">
              logo, screenshot, or text monogram
            </strong>{" "}
            into a production-ready{" "}
            <strong className="font-medium text-foreground">favicon.ico</strong>{" "}
            (with embedded{" "}
            <strong className="font-medium text-foreground">
              16×16, 32×32, and 48×48
            </strong>{" "}
            PNG frames) and matching{" "}
            <strong className="font-medium text-foreground">
              PNG exports at 180×180, 192×192, and 512×512
            </strong>{" "}
            for{" "}
            <strong className="font-medium text-foreground">
              apple-touch-icon
            </strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">
              Android / manifest
            </strong>{" "}
            use cases. Click{" "}
            <strong className="font-medium text-foreground">Upload image</strong>{" "}
            (with the upload icon) for raster artwork, or switch to text mode for
            quick lettermarks. Use{" "}
            <strong className="font-medium text-foreground">
              Copy HTML snippet
            </strong>{" "}
            (with the copy icon) for{" "}
            <strong className="font-medium text-foreground">
              link rel=&quot;icon&quot;
            </strong>{" "}
            tags you can paste into HTML,{" "}
            <strong className="font-medium text-foreground">Next.js</strong>{" "}
            layouts, or other frameworks. All processing stays{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            . Pair icons with our{" "}
            <Link
              href="/website/open-graph-preview"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph preview
            </Link>{" "}
            and{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            when you polish how your site looks in search and social shares.
            Browse every{" "}
            <Link
              href="/#design-color-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              design and color tool
            </Link>{" "}
            from the home page.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <FaviconGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why favicons still matter for brand, UX, and SEO hygiene
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Searchers and power users still scan tab strips and bookmark bars for
            recognizable{" "}
            <strong className="font-medium text-foreground">site icons</strong>.
            A crisp{" "}
            <strong className="font-medium text-foreground">
              favicon.ico and PNG set
            </strong>{" "}
            signals polish, helps users return to your app among dozens of tabs,
            and aligns with how browsers pick icons for history, shortcuts, and
            install prompts. Teams migrating to{" "}
            <strong className="font-medium text-foreground">Next.js App Router</strong>{" "}
            sometimes rely on file-based{" "}
            <strong className="font-medium text-foreground">app/icon</strong>{" "}
            conventions; static or multi-framework projects still ship explicit{" "}
            <strong className="font-medium text-foreground">&lt;link&gt;</strong>{" "}
            tags. This page targets queries like{" "}
            <strong className="font-medium text-foreground">
              favicon generator from image
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              create favicon.ico online
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              apple touch icon size
            </strong>{" "}
            with a single workflow: generate, download, copy tags, deploy.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            For{" "}
            <strong className="font-medium text-foreground">
              progressive web apps
            </strong>
            , manifest icons at{" "}
            <strong className="font-medium text-foreground">192</strong> and{" "}
            <strong className="font-medium text-foreground">512</strong> pixels
            remain common defaults; iOS home-screen shortcuts favor a high-resolution{" "}
            <strong className="font-medium text-foreground">180×180</strong>{" "}
            asset. Supplying both legacy ICO and modern PNGs avoids surprises
            across Windows, macOS, Chrome, Safari, and mobile shells.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this favicon generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Choose <strong className="font-medium text-foreground">From image</strong>{" "}
                or <strong className="font-medium text-foreground">From text</strong>.
                For logos, use the{" "}
                <strong className="font-medium text-foreground">Upload image</strong>{" "}
                control (upload icon). PNG with transparency works well; avoid SVG
                here because canvas rasterization is not wired for vectors in this
                tool.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                For images, pick{" "}
                <strong className="font-medium text-foreground">Cover</strong> to
                fill the square (edges may crop) or{" "}
                <strong className="font-medium text-foreground">Contain</strong> to
                show the full graphic with a configurable pad color—useful for
                wordmarks on white or dark headers.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                For text, enter one to eight characters (initials or a glyph),
                choose a font stack and weight, then set background and ink
                colors for contrast. Short strings stay legible at{" "}
                <strong className="font-medium text-foreground">16×16</strong>.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Download <strong className="font-medium text-foreground">favicon.ico</strong>{" "}
                and each labeled PNG. Place them in{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-900">
                  public/
                </code>{" "}
                or your CDN. Click{" "}
                <strong className="font-medium text-foreground">
                  Copy HTML snippet
                </strong>{" "}
                (copy icon) and paste into your global head or root layout; rename
                paths if your host uses a subdirectory.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                After deploy, hard-refresh or clear site data to bypass aggressive
                favicon caching. When tuning page metadata, use the{" "}
                <Link
                  href="/website/meta-tags-extractor"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  meta tags extractor
                </Link>{" "}
                on a staging URL and preview social cards with the{" "}
                <Link
                  href="/website/open-graph-preview"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  Open Graph preview
                </Link>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            ICO vs PNG: what this tool emits and how to reference it
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            The downloaded{" "}
            <strong className="font-medium text-foreground">favicon.ico</strong>{" "}
            bundles multiple resolutions so older desktop browsers and shortcuts can
            choose a suitable frame. Standalone{" "}
            <strong className="font-medium text-foreground">PNG</strong> files stay
            sharp for high-DPI tabs and for explicit{" "}
            <strong className="font-medium text-foreground">type=&quot;image/png&quot;</strong>{" "}
            link elements. The copied snippet lists conventional filenames (
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-900">
              favicon-32x32.png
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-900">
              apple-touch-icon.png
            </code>
            , etc.); rename to match your repo as long as{" "}
            <strong className="font-medium text-foreground">href</strong> values
            line up.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Internal tools that pair with a new favicon rollout
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Once your tab icon is set, you may still tune the rest of the visual
            system: export harmonious colors with the{" "}
            <Link
              href="/design/palette-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color palette generator
            </Link>
            , check contrast with the{" "}
            <Link
              href="/design/contrast-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              WCAG contrast checker
            </Link>
            , and prepare hero backgrounds using the{" "}
            <Link
              href="/design/gradient-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              gradient generator
            </Link>{" "}
            or{" "}
            <Link
              href="/design/css-gradient"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSS gradient
            </Link>{" "}
            tools. For production assets, the{" "}
            <Link
              href="/files/image-compressor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image compressor
            </Link>{" "}
            and{" "}
            <Link
              href="/files/image-resizer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image resizer
            </Link>{" "}
            help keep large marketing images fast without touching your favicon
            workflow here.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related design and color tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            More from the{" "}
            <Link
              href="/#design-color-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              design and color tools
            </Link>{" "}
            section:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {relatedTools.map((tool) => (
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
            {faviconGeneratorFaqItems.map((item) => (
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
