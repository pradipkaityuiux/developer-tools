import type { Metadata } from "next";
import Link from "next/link";
import { SvgOptimizerTool } from "./svg-optimizer-tool";
import { svgOptimizerFaqItems } from "@/lib/svg-optimizer-faq";
import { toolSections } from "@/lib/tool-catalog";

const fileTools =
  toolSections.find((s) => s.id === "file-data-tools")?.tools ?? [];
const relatedTools = fileTools.filter((t) => t.href !== "/files/svg-optimizer");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/files/svg-optimizer",
  },
};

export default function SvgOptimizerPage() {
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
            <span className="text-foreground">SVG optimizer</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            SVG optimizer — minify and clean vector markup for smaller, faster
            icons and illustrations
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              SVG minifier online
            </strong>{" "}
            to shrink logos, icons, and UI graphics before you commit them to a
            repo or inline them in HTML and components. The tool removes
            comments, strips whitespace between tags, optionally drops{" "}
            <strong className="font-medium text-foreground">metadata</strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">
              design-tool noise
            </strong>{" "}
            (common in Inkscape, Sketch, and Figma exports), shortens hex colors,
            and blocks{" "}
            <strong className="font-medium text-foreground">
              script injection
            </strong>{" "}
            in the output. Everything runs{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>{" "}
            with DOMParser—your files are not uploaded. After optimization, use
            the{" "}
            <Link
              href="/files/image-to-base64"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image to Base64
            </Link>{" "}
            helper when you need a{" "}
            <strong className="font-medium text-foreground">data URI</strong> for
            CSS or email, or open the{" "}
            <Link
              href="/files/image-compressor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image compressor
            </Link>{" "}
            for raster PNG and JPEG. Browse every utility in the{" "}
            <Link
              href="/#file-data-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              file and data tools
            </Link>{" "}
            section on the home page.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <SvgOptimizerTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why teams minify SVG for production websites and apps
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="font-medium text-foreground">Scalable Vector
            Graphics</strong> stay crisp at any resolution, which makes them
            ideal for icons, logos, charts, and illustrations. Exported files
            often contain verbose whitespace, XML comments, editor metadata, and
            redundant attributes that do not change how browsers paint the shape.
            An{" "}
            <strong className="font-medium text-foreground">SVG optimizer</strong>{" "}
            trims that overhead so payloads are smaller, diffs in Git are
            cleaner, and pages parse slightly less text—especially when you ship
            dozens of inline symbols. This complements raster workflows handled
            by the{" "}
            <Link
              href="/files/image-resizer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image resizer
            </Link>{" "}
            and{" "}
            <Link
              href="/files/image-converter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image format converter
            </Link>{" "}
            when your art direction mixes vector and bitmap assets.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Searchers look for{" "}
            <strong className="font-medium text-foreground">
              compress SVG online
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              clean SVG from Figma
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              reduce SVG file size
            </strong>{" "}
            without installing desktop apps. This page targets those workflows
            with paste-or-upload input, optional metadata stripping, and a
            one-click{" "}
            <strong className="font-medium text-foreground">copy</strong> action
            beside the output (with the standard copy icon). If you need to
            verify binary integrity of any downloaded asset, follow up with the{" "}
            <Link
              href="/files/file-hash"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              file hash checker
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this SVG minifier (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Upload SVG
                </strong>{" "}
                (upload icon), drag a file into the dashed drop zone, or paste
                raw markup into the input editor. The root element should be{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  &lt;svg&gt;
                </code>
                .
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Choose cleanup options:{" "}
                <strong className="font-medium text-foreground">
                  Remove metadata
                </strong>{" "}
                drops the{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-900">
                  metadata
                </code>{" "}
                element;{" "}
                <strong className="font-medium text-foreground">
                  Strip editor attributes
                </strong>{" "}
                removes common tool-specific namespaces and attributes. Scripts
                are always stripped from the output.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Review the{" "}
                <strong className="font-medium text-foreground">preview</strong>{" "}
                and byte comparison. When the graphic looks correct, press{" "}
                <strong className="font-medium text-foreground">Copy</strong>{" "}
                next to the optimized textarea to place minified SVG on the
                clipboard.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Paste into your codebase, CMS, or sprite sheet. Use{" "}
                <strong className="font-medium text-foreground">Clear</strong> to
                reset and process another file.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            SVG optimization vs accessibility and SEO
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Removing metadata rarely affects visuals. If you rely on{" "}
            <strong className="font-medium text-foreground">
              title or desc
            </strong>{" "}
            elements for screen readers, keep your source file in version
            control and only strip what you have validated. For{" "}
            <strong className="font-medium text-foreground">SEO</strong>, inline
            SVGs can include structured text, but decorative icons should use
            appropriate ARIA patterns in the surrounding HTML. This utility does
            not rewrite paths or merge shapes; it focuses on safe, reversible
            hygiene tasks you can audit quickly in the preview.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Security notes for SVG you did not author
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            SVG is XML. Malicious files may embed scripts or external references.
            This tool removes{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              script
            </code>{" "}
            tags and event-handler attributes such as{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              onload
            </code>
            , but you should still treat third-party SVG like any untrusted
            markup: review diffs, serve with a tight Content-Security-Policy where
            possible, and prefer referencing static assets from your own CDN.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related file and developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Explore the full{" "}
            <Link
              href="/#file-data-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              file and data tools
            </Link>{" "}
            list. Highlights:
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
            <li>
              <Link
                href="/dev/base64"
                className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
              >
                Base64 encoder &amp; decoder
              </Link>
              {" — "}
              <span className="text-zinc-600 dark:text-zinc-400">
                Encode text or files to Base64 when you need URL-safe variants
                beyond inline images.
              </span>
            </li>
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
            {svgOptimizerFaqItems.map((item) => (
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
