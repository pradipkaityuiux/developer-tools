import type { Metadata } from "next";
import Link from "next/link";
import { ImageToBase64Tool } from "./image-to-base64-tool";
import { imageToBase64FaqItems } from "@/lib/image-to-base64-faq";
import { toolSections } from "@/lib/tool-catalog";

const fileTools =
  toolSections.find((s) => s.id === "file-data-tools")?.tools ?? [];
const relatedTools = fileTools.filter((t) => t.href !== "/files/image-to-base64");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/files/image-to-base64",
  },
};

export default function ImageToBase64Page() {
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
            <span className="text-foreground">Image to Base64 converter</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Image to Base64 converter — data URI generator for inline HTML, CSS,
            and APIs
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              image to Base64 online
            </strong>{" "}
            tool to turn local PNG, JPEG, WebP, GIF, or SVG files into a{" "}
            <strong className="font-medium text-foreground">
              data URI (data:image/...;base64,...)
            </strong>{" "}
            or a{" "}
            <strong className="font-medium text-foreground">
              raw Base64 string
            </strong>{" "}
            for JSON payloads and backends. You get a{" "}
            <strong className="font-medium text-foreground">live preview</strong>
            , optional{" "}
            <strong className="font-medium text-foreground">
              PEM-style line wrapping
            </strong>{" "}
            for readable docs, and{" "}
            <strong className="font-medium text-foreground">
              copy-to-clipboard
            </strong>{" "}
            actions—everything runs{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>{" "}
            with the FileReader API, so screenshots and brand assets are not
            uploaded to our servers. Pair this workflow with the{" "}
            <Link
              href="/dev/base64"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Base64 encoder and decoder
            </Link>{" "}
            when you need UTF-8 text, URL-safe Base64URL, or JWT-style segments
            instead of images. When you are ready to shrink files before
            inlining, bookmark the{" "}
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
            pages from our{" "}
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
        <ImageToBase64Tool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            What is Base64 image encoding and when teams use data URIs
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="font-medium text-foreground">Base64</strong> maps
            binary bytes to ASCII text (RFC 4648). For images, wrapping that
            string in{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              data:&lt;mime&gt;;base64,&lt;payload&gt;
            </code>{" "}
            produces a{" "}
            <strong className="font-medium text-foreground">data URI</strong>{" "}
            you can paste into an{" "}
            <strong className="font-medium text-foreground">
              HTML img src
            </strong>
            , a{" "}
            <strong className="font-medium text-foreground">
              CSS background-image
            </strong>{" "}
            url, or a fetch-free prototype. Product engineers also paste{" "}
            <strong className="font-medium text-foreground">
              Base64 image strings
            </strong>{" "}
            into REST or GraphQL JSON when an API expects inline bytes; DevOps
            templates sometimes embed small icons in YAML or Helm values. This
            page focuses on{" "}
            <strong className="font-medium text-foreground">
              encode image to Base64
            </strong>{" "}
            workflows with correct MIME detection from the file you select.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Searchers often look for{" "}
            <strong className="font-medium text-foreground">
              convert image to Base64 online
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              PNG to Base64
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              Base64 favicon
            </strong>{" "}
            generators. The mechanics are the same: read the file as a data URL,
            then either use the entire string for inline embedding or strip the
            prefix when a service wants only the payload. For checksums of
            original files (not the Base64 text), use the{" "}
            <Link
              href="/files/file-hash"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              file hash
            </Link>{" "}
            utility after you export assets from design tools.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this image to Base64 converter (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Upload image
                </strong>{" "}
                or drag a file into the dashed drop zone. The tool accepts
                browser-decodable images such as{" "}
                <strong className="font-medium text-foreground">PNG</strong>,{" "}
                <strong className="font-medium text-foreground">JPEG</strong>,{" "}
                <strong className="font-medium text-foreground">WebP</strong>,{" "}
                <strong className="font-medium text-foreground">GIF</strong>, or{" "}
                <strong className="font-medium text-foreground">SVG</strong>.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Review the <strong className="font-medium text-foreground">
                  preview
                </strong>{" "}
                and filename/size metadata. The{" "}
                <strong className="font-medium text-foreground">
                  Full data URI
                </strong>{" "}
                box contains the complete string for{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-900">
                  &lt;img src=&quot;...&quot;&gt;
                </code>{" "}
                or{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-900">
                  url(&quot;...&quot;)
                </code>
                .
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use{" "}
                <strong className="font-medium text-foreground">
                  Base64 only
                </strong>{" "}
                when your API documentation asks for the payload without the{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-900">
                  data:
                </code>{" "}
                prefix. Enable{" "}
                <strong className="font-medium text-foreground">
                  Wrap Base64 at 76 characters
                </strong>{" "}
                when you want email-style line breaks in README files; leave it
                off for compact single-line JSON.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Press the{" "}
                <strong className="font-medium text-foreground">Copy</strong>{" "}
                buttons (with the copy icon) next to each field to place the
                value on the clipboard. Use{" "}
                <strong className="font-medium text-foreground">Clear</strong> to
                reset and encode another asset.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Performance, SEO, and email: when inlining helps or hurts
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Data URIs remove extra HTTP requests for tiny assets, which can help
            simple landing experiments and{" "}
            <strong className="font-medium text-foreground">
              above-the-fold
            </strong>{" "}
            icons. They also inflate HTML size because Base64 is roughly 33%
            larger than raw bytes, which can work against{" "}
            <strong className="font-medium text-foreground">Core Web Vitals</strong>{" "}
            if you inline large photos. For production sites, prefer cached URLs
            and responsive images; use this tool for{" "}
            <strong className="font-medium text-foreground">
              Base64 encode image
            </strong>{" "}
            tasks in design handoffs, Storybook fixtures, or CMS fields that
            only accept strings. Marketing teams embedding graphics in{" "}
            <strong className="font-medium text-foreground">email HTML</strong>{" "}
            often need exactly this format—test in real clients because some
            limit total message weight.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and security reminders for screenshots
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Base64 does not encrypt—anyone with the string can decode the image.
            Because conversion happens locally, you reduce exposure compared to
            uploading sensitive UI captures to random cloud converters. Still,
            follow your company policy for PII in screenshots. For structured
            metadata about images (dimensions, EXIF) without inlining bytes,
            explore the{" "}
            <Link
              href="/files/image-metadata"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image metadata
            </Link>{" "}
            viewer when you only need file facts.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related file and developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Browse the full{" "}
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
                Encode UTF-8 text and arbitrary files to Base64, decode strings,
                and toggle URL-safe Base64URL for tokens.
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
            {imageToBase64FaqItems.map((item) => (
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
