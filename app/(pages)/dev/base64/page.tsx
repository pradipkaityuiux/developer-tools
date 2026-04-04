import type { Metadata } from "next";
import Link from "next/link";
import { Base64Tool } from "./base64-tool";
import { base64FaqItems } from "@/lib/base64-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/base64");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/base64",
  },
};

export default function Base64Page() {
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
            <span className="text-foreground">Base64 encoder &amp; decoder</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Base64 encoder and decoder — UTF-8 text, files, and URL-safe output
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              Base64 encoder online
            </strong>{" "}
            to turn{" "}
            <strong className="font-medium text-foreground">
              UTF-8 strings and files
            </strong>{" "}
            into standard or{" "}
            <strong className="font-medium text-foreground">
              URL-safe Base64 (Base64URL)
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              decode Base64 back to text
            </strong>{" "}
            with support for whitespace, missing padding, and{" "}
            <strong className="font-medium text-foreground">data URIs</strong>{" "}
            (
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              data:...;base64,...
            </code>
            ). Developers use Base64 for JSON fields, Basic auth construction,
            email MIME, embedding small assets, and comparing blobs with diffs.
            Everything runs{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            . Pair it with the{" "}
            <Link
              href="/dev/url-encoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              URL encoder and decoder
            </Link>{" "}
            for query strings, the{" "}
            <Link
              href="/dev/jwt-decoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JWT decoder
            </Link>{" "}
            for three-part tokens. Use{" "}
            <strong className="font-medium text-foreground">Encode file</strong>{" "}
            in the tool above for images and other binaries when you need a raw
            Base64 string (for example to build a{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              data:
            </code>{" "}
            URI manually).
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <Base64Tool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            What is Base64 and why teams still rely on it
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="font-medium text-foreground">Base64</strong> is
            a binary-to-text encoding defined in{" "}
            <strong className="font-medium text-foreground">RFC 4648</strong>.
            It maps every three bytes of input to four ASCII characters from a
            64-character alphabet, typically{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              A–Z a–z 0–9 + /
            </code>{" "}
            with{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              =
            </code>{" "}
            padding at the end when the byte length is not a multiple of three.
            The result is safe to embed in JSON strings, XML, headers, and URLs
            (with escaping or a URL-safe alphabet). It does{" "}
            <strong className="font-medium text-foreground">not</strong>{" "}
            encrypt data—anyone can reverse it—so treat it as a transport
            representation, not a secret vault.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Product and platform engineers encounter Base64 when APIs return
            thumbnails, PDFs, or signatures as string fields; when DevOps stores
            kubeconfigs or certificates in environment variables; and when
            front-end developers inline tiny SVG or PNG assets as{" "}
            <strong className="font-medium text-foreground">data URIs</strong>{" "}
            for prototypes. For structured API bodies that mix Base64 with JSON,
            validate and pretty-print with our{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter &amp; validator
            </Link>{" "}
            after you paste samples from logs.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this Base64 tool (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">Encode:</strong>{" "}
                Paste UTF-8 text (including emoji and non-Latin scripts) into the
                box, optionally check{" "}
                <strong className="font-medium text-foreground">
                  URL-safe Base64
                </strong>{" "}
                if your consumer expects{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  - _
                </code>{" "}
                instead of{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  + /
                </code>
                , then click{" "}
                <strong className="font-medium text-foreground">
                  Encode UTF-8 → Base64
                </strong>
                . Enable line wrapping when you want readable 76-character rows
                for docs or PEM-style display.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">Decode:</strong>{" "}
                Paste Base64 (with or without line breaks). The tool strips{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  data:...;base64,
                </code>{" "}
                prefixes, ignores whitespace, accepts URL-safe alphabets, and
                restores padding when possible. Click{" "}
                <strong className="font-medium text-foreground">
                  Decode Base64 → UTF-8
                </strong>
                . If the payload is not valid UTF-8 text, you may see replacement
                characters—use a hex or file workflow for raw binary inspection.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  Encode a file:
                </strong>{" "}
                Use{" "}
                <strong className="font-medium text-foreground">
                  Encode file
                </strong>{" "}
                to read a local file and output its Base64 without uploading it.
                Combine with URL-safe mode when you build tokens or filenames.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">Copy</strong>{" "}
                sends the current editor contents to the clipboard for curl,
                Postman, Terraform variables, or tickets. Use{" "}
                <strong className="font-medium text-foreground">
                  Load sample text
                </strong>{" "}
                to try encoding quickly.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            UTF-8 vs raw btoa — keywords that explain the difference
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Searchers often look for{" "}
            <strong className="font-medium text-foreground">
              Base64 encode Unicode
            </strong>{" "}
            or{" "}
            <strong className="font-medium text-foreground">
              btoa UTF-8
            </strong>{" "}
            because the browser&apos;s{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              btoa
            </code>{" "}
            only accepts code units in the Latin-1 range. Real-world APIs almost
            always mean &quot;encode the UTF-8 bytes of this string.&quot; This
            page follows that convention so{" "}
            <strong className="font-medium text-foreground">
              internationalized text
            </strong>{" "}
            and symbols encode the same way server-side libraries do in Node,
            Go, and Python.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Standard Base64 vs Base64URL in JWTs and APIs
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="font-medium text-foreground">JSON Web Tokens</strong>{" "}
            use Base64URL for the header and payload segments: no padding{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              =
            </code>
            , and{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              +/
            </code>{" "}
            replaced by{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              -_
            </code>
            . Toggle URL-safe mode here when you want matching output for tests
            or documentation. To inspect decoded JSON inside a token without
            verifying signatures, open the{" "}
            <Link
              href="/dev/jwt-decoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JWT decoder
            </Link>
            . For checksums and fingerprints of decoded bytes, use the{" "}
            <Link
              href="/dev/hash-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              hash generator
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Data URIs, HTML, and performance-minded embedding
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            A{" "}
            <strong className="font-medium text-foreground">data URI</strong>{" "}
            combines a MIME type with inline Base64, for example{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs break-all dark:bg-zinc-900">
              data:image/svg+xml;base64,...
            </code>
            . They are convenient for prototypes and email templates but can
            bloat HTML and hurt caching for large assets on public sites—prefer
            URLs and CDNs for production media. When you work on page markup
            alongside assets, the{" "}
            <Link
              href="/dev/html-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML formatter
            </Link>{" "}
            helps keep templates readable.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Security, privacy, and compliance notes
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Because encoding is reversible, never treat Base64 as protection for
            personal data in logs or URLs. Prefer redaction and access controls.
            This tool keeps processing client-side, which helps when you handle
            credentials or pre-production payloads you do not want on a shared
            service. For public URL safety and crawler behavior, review headers
            and redirects with our{" "}
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
            when debugging links that carry encoded parameters.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Explore the full{" "}
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
            {base64FaqItems.map((item) => (
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
