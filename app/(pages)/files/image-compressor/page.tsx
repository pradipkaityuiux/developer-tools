import type { Metadata } from "next";
import Link from "next/link";
import { ImageCompressorTool } from "./image-compressor-tool";
import { imageCompressorFaqItems } from "@/lib/image-compressor-faq";
import { toolSections } from "@/lib/tool-catalog";

const fileTools =
  toolSections.find((s) => s.id === "file-data-tools")?.tools ?? [];
const relatedTools = fileTools.filter(
  (t) => t.href !== "/files/image-compressor",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/files/image-compressor",
  },
};

export default function ImageCompressorPage() {
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
            <span className="text-foreground">Image compressor</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Image compressor online — shrink JPEG and PNG with quality control
            and before/after size stats
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online image compressor
            </strong>{" "}
            to reduce{" "}
            <strong className="font-medium text-foreground">
              JPG and PNG file size
            </strong>{" "}
            before you publish to the web, send email attachments, or upload to a
            CMS. Pick{" "}
            <strong className="font-medium text-foreground">
              JPEG output with an adjustable quality slider
            </strong>{" "}
            for photographs and screenshots where small artifacts are acceptable,
            or{" "}
            <strong className="font-medium text-foreground">
              PNG for lossless re-encoding
            </strong>{" "}
            when you need sharp edges on UI captures. The tool shows{" "}
            <strong className="font-medium text-foreground">
              original vs compressed bytes
            </strong>
            , side-by-side previews,{" "}
            <strong className="font-medium text-foreground">
              copy-to-clipboard stats
            </strong>{" "}
            (with the copy icon), and a download button—everything runs{" "}
            <strong className="font-medium text-foreground">
              locally in your browser
            </strong>{" "}
            using the Canvas API, so files are not uploaded to our servers. Pair
            this workflow with the{" "}
            <Link
              href="/files/image-resizer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image resizer
            </Link>{" "}
            when you need different pixel dimensions, the{" "}
            <Link
              href="/files/image-converter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image format converter
            </Link>{" "}
            for WebP targets, and the{" "}
            <Link
              href="/files/image-to-base64"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image to Base64
            </Link>{" "}
            tool when an API or HTML template expects inline data. Browse all{" "}
            <Link
              href="/#file-data-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              file and data tools
            </Link>{" "}
            for CSV utilities, hashes, and SVG cleanup.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <ImageCompressorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why compress images for the web, email, and product uploads
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Large photos and retina screenshots inflate page weight, slow{" "}
            <strong className="font-medium text-foreground">
              Largest Contentful Paint (LCP)
            </strong>
            , and cost mobile users data. Marketing teams hit attachment limits
            in email; developers exceed CMS upload caps. An{" "}
            <strong className="font-medium text-foreground">
              image size reducer
            </strong>{" "}
            helps you hit engineering and design budgets without opening desktop
            apps. This page focuses on{" "}
            <strong className="font-medium text-foreground">
              client-side JPEG compression
            </strong>{" "}
            with a clear quality control and honest byte counts so you can
            decide when the trade-off is worth it.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Searchers often look for{" "}
            <strong className="font-medium text-foreground">
              compress JPG online
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              PNG optimizer
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              reduce photo MB size
            </strong>
            . In the browser,{" "}
            <strong className="font-medium text-foreground">
              PNG compression without third-party codecs
            </strong>{" "}
            is fundamentally different from JPEG: standard canvas PNG export is
            lossless, so dramatic savings usually come from choosing JPEG for
            photographic content or from specialized offline tools. Here you get
            transparent numbers: if PNG grows, switch to JPEG or lower the
            quality slider until the preview still looks acceptable.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this image compressor (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Upload image
                </strong>{" "}
                (with the upload icon) or drag a file into the dashed drop zone.
                JPEG and PNG are the primary workflows; other raster types work
                when the browser can decode them.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Under{" "}
                <strong className="font-medium text-foreground">
                  Output format
                </strong>
                , choose{" "}
                <strong className="font-medium text-foreground">JPEG</strong>{" "}
                to enable the quality slider (40–100%). Choose{" "}
                <strong className="font-medium text-foreground">PNG</strong> when
                you need lossless output—there is no quality dial for PNG in the
                standard Canvas API.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Compare the{" "}
                <strong className="font-medium text-foreground">original</strong>{" "}
                and{" "}
                <strong className="font-medium text-foreground">
                  compressed preview
                </strong>{" "}
                panels and read the byte summary. Use{" "}
                <strong className="font-medium text-foreground">
                  Copy stats
                </strong>{" "}
                to paste before/after sizes into tickets, or{" "}
                <strong className="font-medium text-foreground">Download</strong>{" "}
                to save{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-900">
                  *-compressed.jpg
                </code>{" "}
                or{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-900">
                  *-compressed.png
                </code>
                .
              </span>
            </li>
            <li>
              <span className="text-foreground">
                If the compressed file is larger than the original (common for
                already-optimized JPEGs or certain PNGs), try a lower JPEG
                quality, or resize dimensions with the{" "}
                <Link
                  href="/files/image-resizer"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  image resizer
                </Link>{" "}
                before compressing again.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            JPEG quality, transparency, and when PNG still wins
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="font-medium text-foreground">JPEG</strong> uses
            lossy compression: lowering quality removes high-frequency detail.
            That is ideal for camera photos and noisy screenshots.{" "}
            <strong className="font-medium text-foreground">PNG</strong> is
            lossless and supports alpha, which matters for logos, diagrams, and
            UI with transparency. When you export JPEG from a transparent PNG,
            this tool composites against a{" "}
            <strong className="font-medium text-foreground">white</strong>{" "}
            background—standard for quick web workflows. For EXIF and camera
            metadata without re-exporting pixels, open the{" "}
            <Link
              href="/files/image-metadata"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image metadata viewer
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            SEO, Core Web Vitals, and caching keywords teams search for
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Publishing blogs, landing pages, and docs with unoptimized hero images
            hurts{" "}
            <strong className="font-medium text-foreground">
              Core Web Vitals
            </strong>{" "}
            and crawl budgets when HTML is bloated with inline assets. Use this
            compressor for quick checks, then ensure your CDN or framework serves
            responsive widths and modern formats where supported. Validate HTTP
            behavior with our{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>{" "}
            and{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>{" "}
            when debugging image URLs in production.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Integrity, SVG, and vector workflows
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            After you download compressed binaries, verify checksums with the{" "}
            <Link
              href="/files/file-hash"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              file hash checker
            </Link>{" "}
            when pipelines require proof of file identity. For SVG icons and
            illustrations, raster compression does not apply—use the{" "}
            <Link
              href="/files/svg-optimizer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SVG optimizer
            </Link>{" "}
            to minify XML and reduce path bloat instead.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related file and media tools
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
            {imageCompressorFaqItems.map((item) => (
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
