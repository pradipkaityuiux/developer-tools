import type { Metadata } from "next";
import Link from "next/link";
import { UrlEncoderTool } from "./url-encoder-tool";
import { urlEncoderFaqItems } from "@/lib/url-encoder-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/url-encoder");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/url-encoder",
  },
};

export default function UrlEncoderPage() {
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
            <span className="text-foreground">URL encoder &amp; decoder</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            URL encoder and decoder — percent-encoding for APIs, links, and forms
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              URL encoder online
            </strong>{" "}
            to{" "}
            <strong className="font-medium text-foreground">
              percent-encode query parameters
            </strong>
            , path segments, and arbitrary Unicode text with the same{" "}
            <strong className="font-medium text-foreground">
              encodeURIComponent
            </strong>{" "}
            rules your frontend and Node stacks rely on—or switch to{" "}
            <strong className="font-medium text-foreground">encodeURI</strong>{" "}
            when you are normalizing a mostly complete{" "}
            <strong className="font-medium text-foreground">URI</strong>. The{" "}
            <strong className="font-medium text-foreground">URL decoder</strong>{" "}
            reverses <strong className="font-medium text-foreground">%XX</strong>{" "}
            sequences with{" "}
            <strong className="font-medium text-foreground">
              decodeURIComponent
            </strong>
            , optional{" "}
            <strong className="font-medium text-foreground">
              plus-as-space
            </strong>{" "}
            handling for{" "}
            <strong className="font-medium text-foreground">
              application/x-www-form-urlencoded
            </strong>{" "}
            data, and copy-friendly output. Everything runs client-side—ideal for
            OAuth redirect URIs, analytics pixels, email templates, and log lines
            you cannot ship to a third party. Pair it with the{" "}
            <Link
              href="/dev/base64"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Base64 encoder
            </Link>{" "}
            for binary-safe payloads and the{" "}
            <Link
              href="/dev/jwt-decoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JWT decoder
            </Link>{" "}
            when tokens travel in fragments or query strings.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <UrlEncoderTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why URL encoding matters for developers and SEO
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">
              Percent-encoding
            </strong>{" "}
            is how HTTP, HTML forms, and JavaScript keep reserved characters from
            colliding with URL syntax. Spaces, ampersands, hashes, and non-ASCII
            letters must become <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">%</code>
            -prefixed byte sequences so servers, CDNs, and crawlers parse{" "}
            <strong className="font-medium text-foreground">query strings</strong>{" "}
            predictably. Getting encoding wrong produces double-encoded links,
            broken <strong className="font-medium text-foreground">UTM</strong>{" "}
            tags, and 400 responses from strict APIs. For live pages, validate
            outbound URLs with our{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>{" "}
            and{" "}
            <Link
              href="/website/broken-link-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              broken link checker
            </Link>
            ; for headers and caches, follow with the{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>
            .
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This page focuses on{" "}
            <strong className="font-medium text-foreground">RFC 3986</strong>
            -style encoding as implemented in browsers—parallel to what you get
            from <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">URLSearchParams</code>{" "}
            for individual values. It does not replace TLS or certificate
            hygiene; when URLs point at production hosts, confirm certificates
            with the{" "}
            <Link
              href="/website/ssl-certificate-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SSL certificate checker
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            encodeURIComponent vs encodeURI (quick reference)
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">
              encodeURIComponent
            </strong>{" "}
            escapes almost every reserved character, which is what you want for a
            single <strong className="font-medium text-foreground">name=value</strong>{" "}
            pair’s value, a slug with slashes you must hide, or arbitrary text
            embedded in a path segment.{" "}
            <strong className="font-medium text-foreground">encodeURI</strong>{" "}
            leaves delimiters such as <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">/</code>,{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">?</code>, and{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">#</code>{" "}
            unescaped so the skeleton of a URL stays readable—useful when you
            paste a nearly valid URL that only needs a few illegal characters
            fixed. When unsure, default to{" "}
            <strong className="font-medium text-foreground">
              encodeURIComponent
            </strong>{" "}
            for each dynamic segment, then assemble the final string in code.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this URL encoder and decoder (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Choose <strong className="font-medium text-foreground">Encode (query & segments)</strong>{" "}
                for API parameters, slugs, and arbitrary strings; choose{" "}
                <strong className="font-medium text-foreground">Encode (full URI)</strong>{" "}
                for mostly formed URLs; choose <strong className="font-medium text-foreground">Decode</strong>{" "}
                to expand <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">%XX</code>{" "}
                sequences back to Unicode.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Paste your text into <strong className="font-medium text-foreground">Input</strong>{" "}
                or click <strong className="font-medium text-foreground">Load sample</strong>{" "}
                to experiment. For decoding HTML form data, enable{" "}
                <strong className="font-medium text-foreground">Treat + as space</strong>.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Press <strong className="font-medium text-foreground">Encode</strong> or{" "}
                <strong className="font-medium text-foreground">Decode</strong>{" "}
                to populate <strong className="font-medium text-foreground">Output</strong>.{" "}
                Use <strong className="font-medium text-foreground">Copy output</strong>{" "}
                for curl, Postman, or CMS fields.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click <strong className="font-medium text-foreground">Swap to input</strong>{" "}
                when you need a second pass—for example decode, edit, then
                re-encode with a different mode.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Common pitfalls: double encoding, raw ampersands, and UTF-8
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">Double encoding</strong>{" "}
            happens when a framework already encodes a value and you encode again
            before concatenating—servers see <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">%2520</code>{" "}
            instead of <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">%20</code>. Decode once with this tool to
            confirm the intermediate shape, then encode exactly once at the
            boundary you control. Raw <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">&amp;</code>{" "}
            inside a value breaks query parsing unless encoded as{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">%26</code>.{" "}
            <strong className="font-medium text-foreground">Unicode</strong>{" "}
            characters become multi-byte UTF-8 percent sequences; that is normal
            and preferred over legacy non-UTF-8 encodings in modern APIs.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            JSON, APIs, and structured data workflows
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            REST and GraphQL gateways often log percent-encoded URLs inside JSON.
            When you need to inspect payloads before encoding URL fields, run them
            through the{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter
            </Link>{" "}
            first, copy the string value, then encode or decode here. For
            marketing URLs embedded in JSON-LD, keep characters consistent with
            the visible <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">href</code>{" "}
            users click so crawlers and humans see the same destination.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browse the full{" "}
            <Link
              href="/#code-developer-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              code and developer tools
            </Link>{" "}
            catalog. Highlights:
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
            {urlEncoderFaqItems.map((item) => (
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
