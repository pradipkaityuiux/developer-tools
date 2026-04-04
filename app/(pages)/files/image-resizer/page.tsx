import type { Metadata } from "next";
import Link from "next/link";
import { ImageResizerTool } from "./image-resizer-tool";
import { imageResizerFaqItems } from "@/lib/image-resizer-faq";
import { toolSections } from "@/lib/tool-catalog";

const fileTools =
  toolSections.find((s) => s.id === "file-data-tools")?.tools ?? [];
const relatedTools = fileTools.filter((t) => t.href !== "/files/image-resizer");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/files/image-resizer",
  },
};

export default function ImageResizerPage() {
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
            <span className="text-foreground">Image resizer</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Image resizer online — scale by percentage or exact pixels without
            uploading to a server
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online image resizer
            </strong>{" "}
            to change{" "}
            <strong className="font-medium text-foreground">
              width and height
            </strong>{" "}
            for PNG, JPEG, WebP, and GIF files entirely in your browser. Choose{" "}
            <strong className="font-medium text-foreground">
              percentage scaling
            </strong>{" "}
            for proportional thumbnails or{" "}
            <strong className="font-medium text-foreground">
              exact pixel dimensions
            </strong>{" "}
            with an optional{" "}
            <strong className="font-medium text-foreground">
              aspect ratio lock
            </strong>{" "}
            so screenshots and product photos do not stretch. Export{" "}
            <strong className="font-medium text-foreground">PNG</strong>,{" "}
            <strong className="font-medium text-foreground">JPEG</strong>, or{" "}
            <strong className="font-medium text-foreground">WebP</strong>, tune{" "}
            <strong className="font-medium text-foreground">JPEG quality</strong>
            , then{" "}
            <strong className="font-medium text-foreground">download</strong> the
            file or{" "}
            <strong className="font-medium text-foreground">
              copy the image
            </strong>{" "}
            to the clipboard where your browser allows it. Processing uses the
            HTML Canvas API—nothing is sent to our infrastructure. For smaller
            byte sizes after resizing, follow up with the{" "}
            <Link
              href="/files/image-compressor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image compressor
            </Link>
            ; for format changes use the{" "}
            <Link
              href="/files/image-converter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image format converter
            </Link>
            ; for data URIs try the{" "}
            <Link
              href="/files/image-to-base64"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image to Base64 converter
            </Link>
            . Browse every utility in{" "}
            <Link
              href="/#file-data-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              File and Data Tools
            </Link>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <ImageResizerTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why resize images in the browser for SEO, email, and social assets
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Page speed signals and{" "}
            <strong className="font-medium text-foreground">
              Core Web Vitals
            </strong>{" "}
            reward appropriately sized raster assets. Uploading a 4000px-wide
            hero into a CMS that displays it at 1200px wastes bytes and decoding
            work. A quick{" "}
            <strong className="font-medium text-foreground">
              resize photo online
            </strong>{" "}
            step—paired with compression—aligns pixel dimensions to real
            layout breakpoints. Marketing teams also need{" "}
            <strong className="font-medium text-foreground">
              resize image for email
            </strong>{" "}
            and ad specs without installing desktop suites. This tool targets
            those workflows while keeping files on-device, which matters for
            NDAs, unreleased products, and support screenshots that include
            customer data.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            People often search for{" "}
            <strong className="font-medium text-foreground">
              change image dimensions
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              scale image by percentage
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              shrink PNG for website
            </strong>
            . Percentage mode answers “make this half size” requests; pixel mode
            answers strict platform requirements such as fixed avatar or
            marketplace image slots. When you only need to inspect camera EXIF
            or GPS fields instead of changing pixels, open the{" "}
            <Link
              href="/files/image-metadata"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image metadata viewer
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this image resizer (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Upload image
                </strong>{" "}
                (with the upload icon) or drag a file into the dashed drop zone.
                Supported inputs are typical raster types your browser can
                decode—PNG, JPEG, WebP, and GIF work well.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Review the <strong className="font-medium text-foreground">
                  original preview
                </strong>{" "}
                and native width × height. Pick{" "}
                <strong className="font-medium text-foreground">Percentage</strong>{" "}
                and move the slider (1–400%) for uniform scaling, or{" "}
                <strong className="font-medium text-foreground">
                  Exact pixels
                </strong>{" "}
                to type target width and height.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                In pixel mode, keep{" "}
                <strong className="font-medium text-foreground">
                  Lock aspect ratio
                </strong>{" "}
                checked to avoid stretching; uncheck only when you intentionally
                need non-uniform scaling.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Choose an{" "}
                <strong className="font-medium text-foreground">
                  output format
                </strong>
                . Use PNG or WebP when you need transparency; use JPEG for photos
                where alpha is unnecessary and adjust{" "}
                <strong className="font-medium text-foreground">
                  JPEG quality
                </strong>{" "}
                to balance size and artifacts.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Confirm the live preview and output dimensions, then click{" "}
                <strong className="font-medium text-foreground">
                  Download resized
                </strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">
                  Copy image
                </strong>{" "}
                (copy icon). If clipboard copy is blocked, download the file and
                attach it manually.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Pixel math, aspect ratio, and quality trade-offs
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Uniform scaling multiplies both axes by the same factor, preserving
            geometry. When you unlock aspect ratio and set different width and
            height multipliers, the canvas stretches content—useful for rare
            layout corrections but usually undesirable for photography. JPEG is
            lossy: each re-encode can introduce additional artifacts, so prefer
            exporting JPEG from the original once when possible, or use PNG/WebP
            for intermediate steps. After resizing, run the{" "}
            <Link
              href="/files/image-compressor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image compressor
            </Link>{" "}
            when you need the smallest acceptable file for production.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy, GIF animation, and SVG
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Because decoding and drawing happen locally, you can resize internal
            UI captures without exposing them to a third-party API. Animated GIFs
            decode to a single raster frame on canvas, so motion is not preserved;
            treat this page as a{" "}
            <strong className="font-medium text-foreground">
              static image resizer
            </strong>
            . SVG is vector markup—this workflow targets bitmaps. For SVG
            cleanup and size reduction, use the{" "}
            <Link
              href="/files/svg-optimizer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SVG optimizer
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related file and data tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Explore the full{" "}
            <Link
              href="/#file-data-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              file and data tools
            </Link>{" "}
            section. Highlights:
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
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Working with CSV exports or feeds after batch-processing images?
            Try the{" "}
            <Link
              href="/files/csv-viewer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV viewer and editor
            </Link>{" "}
            or{" "}
            <Link
              href="/files/csv-deduplicator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV deduplicator
            </Link>{" "}
            when cleaning product catalogs.
          </p>
        </article>

        <section className="mt-16 max-w-3xl" aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            Frequently asked questions
          </h2>
          <dl className="mt-6 space-y-4">
            {imageResizerFaqItems.map((item) => (
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
