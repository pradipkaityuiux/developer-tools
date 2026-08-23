import type { Metadata } from "next";
import Link from "next/link";
import { MimeTypeLookupTool } from "./mime-type-lookup-tool";
import { mimeTypeLookupFaqItems } from "@/lib/mime-type-lookup-faq";
import { toolSections } from "@/lib/tool-catalog";

const apiToolboxTools =
  toolSections.find((s) => s.id === "api-developer-toolbox")?.tools ?? [];
const relatedTools = apiToolboxTools.filter(
  (t) => t.href !== "/api-toolbox/mime-type-lookup",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/api-toolbox/mime-type-lookup",
  },
};

export default function MimeTypeLookupPage() {
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
            <span className="text-foreground">MIME type lookup</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            MIME type lookup — map file extensions to Content-Type for APIs,
            uploads, and HTTP headers
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              MIME type lookup tool
            </strong>{" "}
            to resolve{" "}
            <strong className="font-medium text-foreground">
              file extensions
            </strong>{" "}
            to common{" "}
            <strong className="font-medium text-foreground">
              Content-Type
            </strong>{" "}
            values, or paste a{" "}
            <strong className="font-medium text-foreground">media type</strong>{" "}
            to see typical extensions. It helps when you configure{" "}
            <strong className="font-medium text-foreground">
              multipart uploads
            </strong>
            , document{" "}
            <strong className="font-medium text-foreground">REST APIs</strong>,
            set <strong className="font-medium text-foreground">fetch</strong>{" "}
            headers, and align with{" "}
            <strong className="font-medium text-foreground">
              OpenAPI content types
            </strong>
            . Copy results with the{" "}
            <strong className="font-medium text-foreground">copy icon</strong>;
            use{" "}
            <strong className="font-medium text-foreground">Upload file</strong>{" "}
            with the{" "}
            <strong className="font-medium text-foreground">upload icon</strong>{" "}
            to compare the browser&apos;s{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              File.type
            </code>{" "}
            with the catalog. Everything runs in your browser—no server round
            trip for lookups. For raw HTTP testing, pair this with the{" "}
            <Link
              href="/api-toolbox/http-request-builder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP request builder
            </Link>{" "}
            and{" "}
            <Link
              href="/api-toolbox/http-status-codes"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP status code reference
            </Link>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <MimeTypeLookupTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            What is MIME type lookup and why do developers need it?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">MIME types</strong>{" "}
            (also called{" "}
            <strong className="font-medium text-foreground">media types</strong>
            ) label bytes:{" "}
            <strong className="font-medium text-foreground">
              application/json
            </strong>{" "}
            for JSON APIs,{" "}
            <strong className="font-medium text-foreground">text/csv</strong>{" "}
            for spreadsheets,{" "}
            <strong className="font-medium text-foreground">image/webp</strong>{" "}
            for modern images, and hundreds of others registered with IANA or
            de facto in frameworks. Teams search for{" "}
            <strong className="font-medium text-foreground">
              MIME type by extension
            </strong>{" "}
            when they set{" "}
            <strong className="font-medium text-foreground">
              Content-Type headers
            </strong>
            , validate uploads, or write OpenAPI{" "}
            <strong className="font-medium text-foreground">content</strong>{" "}
            blocks. Reverse lookup—finding extensions for a{" "}
            <strong className="font-medium text-foreground">
              Content-Type string
            </strong>
            —helps when you inherit a header without sample filenames.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Keywords that match this page include{" "}
            <strong className="font-medium text-foreground">
              extension to MIME
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              Content-Type lookup
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              media type finder
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              API upload MIME
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              multipart form data type
            </strong>
            . The catalog focuses on formats common in web, mobile, and API
            development—not every experimental vendor type is listed.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this MIME type lookup (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Enter a{" "}
                <strong className="font-medium text-foreground">
                  filename or path
                </strong>{" "}
                (for example{" "}
                <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
                  dist/bundle.js
                </code>
                ), a bare{" "}
                <strong className="font-medium text-foreground">
                  extension
                </strong>{" "}
                like{" "}
                <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
                  wasm
                </code>{" "}
                or{" "}
                <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
                  .yaml
                </code>
                , or a full{" "}
                <strong className="font-medium text-foreground">MIME type</strong>{" "}
                for reverse lookup. Compound suffixes such as{" "}
                <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
                  .tar.gz
                </code>{" "}
                are recognized before the final segment alone.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click the{" "}
                <strong className="font-medium text-foreground">
                  copy icon
                </strong>{" "}
                next to the primary MIME type or extension list to paste into
                headers, tickets, or OpenAPI YAML. Use{" "}
                <strong className="font-medium text-foreground">Copy list</strong>{" "}
                when multiple extensions share one type.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Optional: use{" "}
                <strong className="font-medium text-foreground">
                  Upload file
                </strong>{" "}
                to load a local file name into the field and read{" "}
                <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
                  File.type
                </code>{" "}
                from the browser. Compare it with the catalog when debugging
                mismatches between client and server.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                When you need to inspect or format API payloads after choosing
                types, use the{" "}
                <Link
                  href="/api-toolbox/api-response-formatter"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  API response formatter
                </Link>{" "}
                or{" "}
                <Link
                  href="/dev/json-formatter"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  JSON formatter
                </Link>
                . For OpenAPI specs, open the{" "}
                <Link
                  href="/api-toolbox/openapi-viewer"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  OpenAPI / Swagger viewer
                </Link>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Content-Type headers, uploads, and API contracts
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            HTTP uses{" "}
            <strong className="font-medium text-foreground">Content-Type</strong>{" "}
            to describe request and response bodies. For{" "}
            <strong className="font-medium text-foreground">
              multipart/form-data
            </strong>
            , each part can carry its own type. CDNs and object stores often
            infer or override types from extensions or magic bytes—your
            lookup here is a starting point, not a replacement for server
            configuration. For rate limits and quotas after you ship the API,
            see the{" "}
            <Link
              href="/api-toolbox/rate-limit-calculator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              API rate limit calculator
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Lookup runs in your browser. The upload button reads{" "}
            <strong className="font-medium text-foreground">metadata</strong>{" "}
            (name, size, reported type) only; file contents are not sent to our
            servers for this page.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related API developer toolbox tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browse the full{" "}
            <Link
              href="/#api-developer-toolbox"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              API developer toolbox
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
            {mimeTypeLookupFaqItems.map((item) => (
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
