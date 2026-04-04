import type { Metadata } from "next";
import Link from "next/link";
import { XmlFormatterTool } from "./xml-formatter-tool";
import { xmlFormatterFaqItems } from "@/lib/xml-formatter-faq";
import { toolSections } from "@/lib/tool-catalog";

export const dynamic = "force-static";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/xml-formatter");

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/xml-formatter",
  },
};

export default function XmlFormatterPage() {
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
            <span className="text-foreground">XML formatter &amp; validator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            XML formatter &amp; validator — beautify, minify, and check
            well-formed XML
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online XML formatter
            </strong>{" "}
            to{" "}
            <strong className="font-medium text-foreground">
              pretty-print XML
            </strong>{" "}
            with consistent indentation,{" "}
            <strong className="font-medium text-foreground">minify XML</strong>{" "}
            for compact payloads, or{" "}
            <strong className="font-medium text-foreground">
              validate XML syntax
            </strong>{" "}
            before it hits feeds, integrations, or build pipelines. Parsing runs
            entirely in your browser, so you get fast feedback and actionable
            parse errors without uploading files. After a successful check, read
            lightweight{" "}
            <strong className="font-medium text-foreground">
              structure insight
            </strong>{" "}
            (root element, depth, and tag frequency) to understand large configs
            and API responses at a glance—ideal for{" "}
            <strong className="font-medium text-foreground">RSS and Atom</strong>
            , legacy SOAP, Android XML resources, SVG stored as XML, and CI
            templates that must stay syntactically sound.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <XmlFormatterTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            How to use this XML formatter and validator
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Paste any UTF-8 XML document into the input panel, then choose an
            action.{" "}
            <strong className="font-medium text-foreground">
              Format / beautify
            </strong>{" "}
            rebuilds the tree with two-space indentation and readable line
            breaks—great for code review, diffs, and documentation.{" "}
            <strong className="font-medium text-foreground">Minify</strong>{" "}
            removes non-essential whitespace between tags while keeping text
            node content intact, which helps when you need a smaller payload for
            logs or transport.{" "}
            <strong className="font-medium text-foreground">Validate only</strong>{" "}
            confirms{" "}
            <strong className="font-medium text-foreground">
              well-formed XML
            </strong>{" "}
            (balanced tags, legal entities, single root) and surfaces browser
            parser messages you can trace back to a line or token. When
            validation succeeds, the structure card summarizes the document so
            you can spot unexpected wrappers or duplicated nodes before you ship.
            Use{" "}
            <strong className="font-medium text-foreground">Copy</strong> on the
            output to grab the result for tickets, chats, or repositories.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            When to format XML versus JSON or YAML
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Many teams still exchange{" "}
            <strong className="font-medium text-foreground">enterprise XML</strong>{" "}
            for invoices, identity protocols, and feed syndication, while newer
            services prefer JSON or YAML for configs. If you are converting
            between shapes, start with a clean XML tree here, then use our{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter &amp; validator
            </Link>
            ,{" "}
            <Link
              href="/dev/yaml-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              YAML to JSON converter
            </Link>
            , or{" "}
            <Link
              href="/dev/json-to-yaml"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON to YAML converter
            </Link>{" "}
            once payloads are valid in those formats. For markup-heavy content
            that targets browsers rather than strict XML parsers, the{" "}
            <Link
              href="/dev/html-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTML formatter &amp; minifier
            </Link>{" "}
            is usually a better fit than forcing HTML through an XML-only tool.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            XML best practices for feeds, APIs, and configs
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Declare encoding when files leave your editor (
            <span className="font-mono text-sm text-foreground">
              UTF-8
            </span>{" "}
            is the modern default) and keep a single document root. Prefer
            explicit namespaces for mixed vocabularies so consumers do not guess
            prefixes. When whitespace between elements is meaningful to your
            domain, diff carefully after minify. Pair syntactic checks with
            contract tests in your stack for schema-level rules this page does
            not enforce. If you work alongside web operations, our{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>{" "}
            and{" "}
            <Link
              href="/website/response-code-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              response code checker
            </Link>{" "}
            help verify how XML responses are served over the wire (
            <strong className="font-medium text-foreground">
              Content-Type
            </strong>
            , caching, and status codes).
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and limitations
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Formatting and validation execute locally with the same XML parser
            your browser uses for{" "}
            <strong className="font-medium text-foreground">text/xml</strong>{" "}
            documents, so content is not sent to our API for this tool. That
            makes it appropriate for quick redaction-friendly cleanup, with the
            usual caveat that anyone shoulder-surfing still sees your screen.
            This utility confirms{" "}
            <strong className="font-medium text-foreground">
              well-formedness
            </strong>
            , not full XSD/DTD/RNG schema compliance. Byte-for-byte canonical
            output for digital signatures may differ from your source tool’s
            serializer; verify with your security requirements when signatures
            matter.
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
              code &amp; developer tools
            </Link>{" "}
            section on the home page, or jump to a related formatter below.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {relatedTools.slice(0, 10).map((tool) => (
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
            {xmlFormatterFaqItems.map((item) => (
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
