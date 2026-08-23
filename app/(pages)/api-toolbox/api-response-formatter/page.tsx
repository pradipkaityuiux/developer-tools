import type { Metadata } from "next";
import Link from "next/link";
import { ApiResponseFormatterTool } from "./api-response-formatter-tool";
import { apiResponseFormatterFaqItems } from "@/lib/api-response-formatter-faq";
import { toolSections } from "@/lib/tool-catalog";

const apiToolboxTools =
  toolSections.find((s) => s.id === "api-developer-toolbox")?.tools ?? [];
const relatedTools = apiToolboxTools.filter(
  (t) => t.href !== "/api-toolbox/api-response-formatter",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/api-toolbox/api-response-formatter",
  },
};

export default function ApiResponseFormatterPage() {
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
            <span className="text-foreground">API response formatter</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            API response formatter — JSON and XML pretty-print, validate, and
            tree view
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This free{" "}
            <strong className="font-medium text-foreground">
              API response formatter online
            </strong>{" "}
            helps you work with{" "}
            <strong className="font-medium text-foreground">
              REST and GraphQL JSON payloads
            </strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">
              SOAP or XML-RPC style XML
            </strong>{" "}
            in one place. Paste a raw body from{" "}
            <strong className="font-medium text-foreground">
              HTTP clients
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              webhook deliveries
            </strong>
            , or integration logs to{" "}
            <strong className="font-medium text-foreground">
              pretty-print API responses
            </strong>
            , run a quick{" "}
            <strong className="font-medium text-foreground">
              JSON or XML syntax check
            </strong>
            , and open a{" "}
            <strong className="font-medium text-foreground">
              collapsible tree viewer
            </strong>{" "}
            for nested objects and elements. Processing stays in the
            browser—ideal when you debug staging tokens, compare vendor
            payloads, or document example responses next to our{" "}
            <Link
              href="/api-toolbox/http-request-builder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP request builder
            </Link>{" "}
            and the dedicated{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter
            </Link>{" "}
            or{" "}
            <Link
              href="/dev/xml-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              XML formatter
            </Link>{" "}
            when you need format-specific workflows.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <ApiResponseFormatterTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why use a dedicated API response formatter?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Modern integrations return large nested graphs: pagination wrappers,
            error envelopes, and vendor-specific extensions. A focused{" "}
            <strong className="font-medium text-foreground">
              REST API response viewer
            </strong>{" "}
            turns opaque blobs into structured views so you can confirm field
            names, array cardinality, and null handling before you update SDKs or
            ETL jobs. When your stack still serves XML—legacy enterprise APIs,
            SAML metadata, RSS-like feeds—the same page behaves as an{" "}
            <strong className="font-medium text-foreground">
              XML response formatter
            </strong>{" "}
            with a strict parser so malformed markup surfaces immediately
            instead of failing downstream.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Security-minded teams prefer{" "}
            <strong className="font-medium text-foreground">
              client-side formatting
            </strong>{" "}
            for payloads that may contain PII, session identifiers, or signed
            assertions. Because nothing is uploaded, you can safely inspect
            redacted samples from production-like environments while pairing
            with our{" "}
            <Link
              href="/dev/jwt-decoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JWT decoder
            </Link>{" "}
            when tokens appear inside JSON bodies.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this formatter (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Pick{" "}
                <strong className="font-medium text-foreground">Auto</strong>{" "}
                unless you need to force{" "}
                <strong className="font-medium text-foreground">JSON</strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">XML</strong>{" "}
                (for example when debugging Content-Type mismatches). Auto
                treats inputs that start with “&lt;” as XML and otherwise prefers
                JSON when it parses cleanly.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Paste the response body into the textarea, or use{" "}
                <strong className="font-medium text-foreground">
                  Upload file
                </strong>{" "}
                for saved exports. Avoid pasting secrets into shared machines;
                copy only what you need for structure review.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Format &amp; validate
                </strong>{" "}
                to rewrite with two-space indentation when the payload is
                valid. Errors call out JSON positions or the browser’s XML
                parser message so you can fix commas, entities, or tags.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use{" "}
                <strong className="font-medium text-foreground">Minify</strong>{" "}
                for compact lines suitable for queues, archived HAR snippets, or
                attachment to tickets.{" "}
                <strong className="font-medium text-foreground">Copy</strong>{" "}
                grabs the current editor text after any transform.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Expand the{" "}
                <strong className="font-medium text-foreground">
                  JSON tree
                </strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">
                  XML element tree
                </strong>{" "}
                to walk nested structures. Use{" "}
                <strong className="font-medium text-foreground">
                  Expand all
                </strong>{" "}
                for a full outline, or{" "}
                <strong className="font-medium text-foreground">
                  Collapse to root
                </strong>{" "}
                to reset.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            JSON vs XML in real API workflows
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">JSON</strong>{" "}
            dominates public REST and GraphQL transports: strict parsing,
            predictable types, and easy mapping to JavaScript and mobile
            clients.{" "}
            <strong className="font-medium text-foreground">XML</strong> remains
            common in regulated industries, SOAP services, and document-style
            payloads with mixed content. Carrying both parsers behind one{" "}
            <strong className="font-medium text-foreground">
              API debugging tool
            </strong>{" "}
            reduces tab churn when you switch between partners or versions.
            When you only need XML depth editing, the{" "}
            <Link
              href="/dev/xml-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              standalone XML formatter
            </Link>{" "}
            offers paired input/output panes; when you only need JSON, the{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter
            </Link>{" "}
            page stays a fast default.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Webhooks, retries, and SEO-adjacent payloads
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Operations teams often inspect{" "}
            <strong className="font-medium text-foreground">
              webhook JSON bodies
            </strong>{" "}
            after signature verification to confirm idempotency keys and event
            types. Formatting here makes diffing retry deliveries easier before
            you route data to BI or CRM systems. Content and growth engineers
            sometimes extract fragments destined for{" "}
            <strong className="font-medium text-foreground">JSON-LD</strong> or
            headless CMS sync—validate those snippets here, then validate live
            URLs with our{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            or{" "}
            <Link
              href="/seo/schema-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              schema markup generator
            </Link>{" "}
            when you publish structured data.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related API and developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browse the full{" "}
            <Link
              href="/#api-developer-toolbox"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              API developer toolbox
            </Link>{" "}
            for request builders, OpenAPI viewers, and HTTP references.
            Highlights:
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
            {apiResponseFormatterFaqItems.map((item) => (
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
