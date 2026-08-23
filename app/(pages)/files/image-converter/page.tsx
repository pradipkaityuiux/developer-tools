import type { Metadata } from "next";
import Link from "next/link";
import { ImageConverterTool } from "./image-converter-tool";
import { imageConverterFaqItems } from "@/lib/image-converter-faq";
import { toolSections } from "@/lib/tool-catalog";

const fileTools =
  toolSections.find((s) => s.id === "file-data-tools")?.tools ?? [];
const relatedTools = fileTools.filter(
  (t) => t.href !== "/files/image-converter",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/files/image-converter",
  },
};

export default function ImageConverterPage() {
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
            <span className="text-foreground">Image format converter</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Image format converter — JPG, PNG &amp; WebP for CMS, email, and fast
            pages
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This free{" "}
            <strong className="font-medium text-foreground">
              online image format converter
            </strong>{" "}
            lets you switch between{" "}
            <strong className="font-medium text-foreground">JPEG</strong>,{" "}
            <strong className="font-medium text-foreground">PNG</strong>, and{" "}
            <strong className="font-medium text-foreground">WebP</strong>{" "}
            without installing Photoshop or ImageMagick. Pick an output codec,
            tune{" "}
            <strong className="font-medium text-foreground">
              JPEG and WebP quality
            </strong>
            , preview the result, then{" "}
            <strong className="font-medium text-foreground">download</strong> a
            new file or{" "}
            <strong className="font-medium text-foreground">
              copy the image
            </strong>{" "}
            to the clipboard. Everything uses the{" "}
            <strong className="font-medium text-foreground">
              Canvas API in your browser
            </strong>
            —useful when a{" "}
            <strong className="font-medium text-foreground">
              CMS only accepts JPG
            </strong>
            , marketing needs{" "}
            <strong className="font-medium text-foreground">
              email-safe JPEGs
            </strong>
            , or engineering wants{" "}
            <strong className="font-medium text-foreground">
              WebP for LCP
            </strong>{" "}
            without a build pipeline. Combine this page with the{" "}
            <Link
              href="/files/image-compressor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image compressor
            </Link>
            ,{" "}
            <Link
              href="/files/image-resizer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image resizer
            </Link>
            , and{" "}
            <Link
              href="/files/image-to-base64"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image to Base64
            </Link>{" "}
            tools from our{" "}
            <Link
              href="/#file-data-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              file and data tools
            </Link>{" "}
            catalog.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <ImageConverterTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why teams convert image formats (JPG vs PNG vs WebP)
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">JPEG</strong> is the
            default for photographs and many email templates because files stay
            small and every client renders it. It does not store transparency,
            so logos with alpha are usually exported as{" "}
            <strong className="font-medium text-foreground">PNG</strong>.{" "}
            <strong className="font-medium text-foreground">PNG</strong> is
            lossless and supports alpha, which makes it ideal for UI screenshots,
            icons on arbitrary backgrounds, and crisp text in graphics.{" "}
            <strong className="font-medium text-foreground">WebP</strong>{" "}
            combines lossy and lossless modes with often smaller bytes than JPEG
            or PNG—popular for responsive sites and CDNs when you control
            formats end-to-end. This{" "}
            <strong className="font-medium text-foreground">
              JPG PNG WebP converter
            </strong>{" "}
            helps you align exports with each channel without leaving the
            browser.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Searchers look for{" "}
            <strong className="font-medium text-foreground">
              convert PNG to JPG online
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              WebP to PNG
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              change image format for WordPress
            </strong>
            . The workflow is the same: decode locally, re-encode to the target
            MIME type, and download. When you only need to inspect dimensions or
            EXIF before converting, open the{" "}
            <Link
              href="/files/image-metadata"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image metadata viewer
            </Link>{" "}
            first, then return here for the actual transcoding step.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this image format converter (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Upload image
                </strong>{" "}
                or drag a raster file into the dashed drop zone. Common inputs
                include{" "}
                <strong className="font-medium text-foreground">PNG</strong>,{" "}
                <strong className="font-medium text-foreground">JPEG</strong>,{" "}
                <strong className="font-medium text-foreground">WebP</strong>,
                and <strong className="font-medium text-foreground">GIF</strong>{" "}
                frames the browser can decode.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Under <strong className="font-medium text-foreground">
                  Output format
                </strong>
                , choose{" "}
                <strong className="font-medium text-foreground">WebP</strong>,{" "}
                <strong className="font-medium text-foreground">JPEG</strong>,
                or{" "}
                <strong className="font-medium text-foreground">PNG</strong>.
                For JPEG or WebP, move the{" "}
                <strong className="font-medium text-foreground">Quality</strong>{" "}
                slider to balance sharpness versus file size; PNG ignores quality
                because it is lossless.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Compare <strong className="font-medium text-foreground">
                  Original
                </strong>{" "}
                and <strong className="font-medium text-foreground">
                  Converted preview
                </strong>
                , and read the output size line to see whether you saved bytes.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Press <strong className="font-medium text-foreground">
                  Download
                </strong>{" "}
                to save{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-900">
                  .jpg
                </code>
                ,{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-900">
                  .png
                </code>
                , or{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-900">
                  .webp
                </code>{" "}
                beside your original basename, or use{" "}
                <strong className="font-medium text-foreground">
                  Copy image
                </strong>{" "}
                (with the copy icon) to paste into tools that accept clipboard
                images.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Transparency, email HTML, and CMS uploads
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            When you{" "}
            <strong className="font-medium text-foreground">
              convert PNG to JPG
            </strong>
            , transparent pixels are composited on{" "}
            <strong className="font-medium text-foreground">white</strong> so
            email clients and legacy CMS fields get a predictable matte. If you
            need a different background, export PNG or WebP instead, or edit in a
            design tool before converting. For{" "}
            <strong className="font-medium text-foreground">
              vector logos
            </strong>
            , the{" "}
            <Link
              href="/files/svg-optimizer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SVG optimizer
            </Link>{" "}
            complements this raster workflow when SVG remains the source of
            truth.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and performance notes
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Images never leave your tab, which matters for screenshots of staging
            environments or pre-release marketing assets. Very large bitmaps can
            stress memory; if the tab feels slow, use the{" "}
            <Link
              href="/files/image-resizer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image resizer
            </Link>{" "}
            to reduce dimensions before format conversion. To verify a downloaded
            file after handoff, the{" "}
            <Link
              href="/files/file-hash"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              file hash checker
            </Link>{" "}
            computes MD5, SHA-1, and SHA-256 locally.
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
            section on the home page. Highlights:
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
                files on disk.
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
            {imageConverterFaqItems.map((item) => (
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
