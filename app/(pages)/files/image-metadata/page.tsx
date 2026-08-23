import type { Metadata } from "next";
import Link from "next/link";
import { ImageMetadataTool } from "./image-metadata-tool";
import { imageMetadataFaqItems } from "@/lib/image-metadata-faq";
import { toolSections } from "@/lib/tool-catalog";

const fileTools =
  toolSections.find((s) => s.id === "file-data-tools")?.tools ?? [];
const relatedTools = fileTools.filter((t) => t.href !== "/files/image-metadata");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/files/image-metadata",
  },
};

export default function ImageMetadataPage() {
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
            <span className="text-foreground">Image metadata viewer</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Image metadata viewer — online EXIF inspector for camera, lens, GPS,
            and exposure
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This free{" "}
            <strong className="font-medium text-foreground">
              image metadata viewer online
            </strong>{" "}
            helps photographers, developers, and analysts read{" "}
            <strong className="font-medium text-foreground">EXIF</strong>,{" "}
            <strong className="font-medium text-foreground">TIFF tags</strong>,{" "}
            and related embedded headers from{" "}
            <strong className="font-medium text-foreground">JPEG</strong>,{" "}
            <strong className="font-medium text-foreground">PNG</strong>,{" "}
            <strong className="font-medium text-foreground">WebP</strong>,{" "}
            <strong className="font-medium text-foreground">GIF</strong>, and{" "}
            <strong className="font-medium text-foreground">TIFF</strong>-style
            images—without uploading files to a backend. You see{" "}
            <strong className="font-medium text-foreground">
              decoded pixel dimensions
            </strong>
            , a live preview when the browser can decode the format, grouped
            fields for{" "}
            <strong className="font-medium text-foreground">
              camera body and lens
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              shutter speed, aperture, and ISO
            </strong>
            , capture timestamps,{" "}
            <strong className="font-medium text-foreground">GPS coordinates</strong>{" "}
            when present, and a flat list of remaining tags. Use{" "}
            <strong className="font-medium text-foreground">Copy summary</strong>{" "}
            or{" "}
            <strong className="font-medium text-foreground">Copy JSON</strong>{" "}
            (with Lucide copy icons) for tickets, CMS notes, or evidence logs.
            Pair this workflow with the{" "}
            <Link
              href="/files/image-to-base64"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image to Base64 converter
            </Link>{" "}
            when you need a data URI after inspection, the{" "}
            <Link
              href="/files/file-hash"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              file hash checker
            </Link>{" "}
            for integrity fingerprints, and the{" "}
            <Link
              href="/files/image-compressor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image compressor
            </Link>{" "}
            when you must shrink assets before delivery. Browse every utility in
            our{" "}
            <Link
              href="/#file-data-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              file and data tools
            </Link>{" "}
            catalog from the home page.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <ImageMetadataTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            What is EXIF metadata and why teams inspect it
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">EXIF</strong> is a
            common way cameras and phones store technical metadata inside image
            files: manufacturer, model, lens identifiers, exposure triangle
            values, flash and metering modes, timestamps, orientation, and
            sometimes{" "}
            <strong className="font-medium text-foreground">GPS latitude and longitude</strong>
            . Marketing and editorial teams run an{" "}
            <strong className="font-medium text-foreground">EXIF viewer</strong>{" "}
            before publishing stock or user-generated content to avoid leaking
            location. Engineering teams use{" "}
            <strong className="font-medium text-foreground">
              photo metadata online
            </strong>{" "}
            readers to debug CMS imports, verify export pipelines, and compare
            how tools strip tags. Security and journalism workflows treat EXIF as
            one signal—not proof of authenticity—because fields can be edited or
            removed.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Searchers often look for{" "}
            <strong className="font-medium text-foreground">JPEG EXIF viewer</strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              PNG metadata extractor
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              image forensics EXIF
            </strong>{" "}
            keywords. This page focuses on fast, privacy-preserving inspection:
            parse locally, preview when possible, group the most actionable
            fields, and expose everything else for advanced review.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this EXIF metadata viewer (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Upload image
                </strong>{" "}
                (Lucide upload icon) or drag a file onto the dashed area. The
                tool accepts standard raster types your browser can read.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Wait for{" "}
                <strong className="font-medium text-foreground">
                  Reading metadata…
                </strong>{" "}
                to finish. Review the preview and{" "}
                <strong className="font-medium text-foreground">
                  decoded width × height
                </strong>{" "}
                from the bitmap decoder—useful when comparing to EXIF{" "}
                <strong className="font-medium text-foreground">ImageWidth</strong>{" "}
                fields that may describe the sensor prior to rotation.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Scan grouped sections:{" "}
                <strong className="font-medium text-foreground">
                  Camera &amp; lens
                </strong>
                ,{" "}
                <strong className="font-medium text-foreground">Exposure</strong>,{" "}
                <strong className="font-medium text-foreground">
                  Dates &amp; time
                </strong>
                ,{" "}
                <strong className="font-medium text-foreground">GPS</strong>, and{" "}
                <strong className="font-medium text-foreground">
                  Software &amp; dimensions
                </strong>
                . Expand your review with{" "}
                <strong className="font-medium text-foreground">
                  All other tags
                </strong>{" "}
                for the complete flattened dictionary returned by the parser.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Press{" "}
                <strong className="font-medium text-foreground">
                  Copy summary
                </strong>{" "}
                for a plain-text report, or{" "}
                <strong className="font-medium text-foreground">Copy JSON</strong>{" "}
                for structured data (binary fields are summarized for safety).
                Use{" "}
                <strong className="font-medium text-foreground">Clear</strong> to
                load another image.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            GPS, privacy, and social exports
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            When GPS IFD data exists, this tool shows coordinates and related
            fields so you can decide whether to strip them. Many mobile apps now
            remove{" "}
            <strong className="font-medium text-foreground">location EXIF</strong>{" "}
            by default, but DSLR and mirrorless JPEGs often retain rich tags. If
            you need to share pixels without metadata, re-export through an
            editor that strips EXIF or use a dedicated scrubbing workflow; our{" "}
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
            pages describe other client-side image utilities that complement a
            metadata-first review.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Limitations: stripped files, screenshots, and RAW containers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            If platforms removed EXIF, you will see dimensions but few tags.
            Screenshots and synthetic graphics typically lack camera exposure
            blocks. Some proprietary RAW bundles are not fully decodable in the
            browser; desktop DAM tools remain the source of truth for those
            formats. When you only need tabular data from a CSV export alongside
            filenames, the{" "}
            <Link
              href="/files/csv-viewer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV viewer
            </Link>{" "}
            can help reconcile spreadsheet columns with on-disk assets after you
            rename files.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related file and developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
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
                Encode text or small binaries when APIs expect Base64 instead of
                raw EXIF inspection output.
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
            {imageMetadataFaqItems.map((item) => (
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
