import type { Metadata } from "next";
import Link from "next/link";
import { HttpStatusCodesTool } from "./http-status-codes-tool";
import { httpStatusCodesFaqItems } from "@/lib/http-status-codes-faq";
import { toolSections } from "@/lib/tool-catalog";

export const dynamic = "force-static";

const apiTools =
  toolSections.find((s) => s.id === "api-developer-toolbox")?.tools ?? [];
const relatedTools = apiTools.filter(
  (t) => t.href !== "/api-toolbox/http-status-codes",
);

export const metadata: Metadata = {
  alternates: {
    canonical: "/api-toolbox/http-status-codes",
  },
};

export default function HttpStatusCodesPage() {
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
            <span className="text-foreground">HTTP status code reference</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            HTTP status code reference — meanings, causes, and fixes for APIs,
            SEO, and ops
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              HTTP status code lookup
            </strong>{" "}
            to decode{" "}
            <strong className="font-medium text-foreground">
              1xx through 5xx responses
            </strong>
            : each entry includes a{" "}
            <strong className="font-medium text-foreground">
              plain-English summary
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              typical causes in production
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              what to do next
            </strong>{" "}
            when debugging APIs, CDNs, crawlers, or browser DevTools. Filter by{" "}
            <strong className="font-medium text-foreground">
              informational, success, redirection, client error, and server error
            </strong>{" "}
            classes; search by code, phrase, or symptom; import a server or
            access log to focus on codes your traffic actually hits. Everything
            runs in your browser—no account and no upload to our servers when you
            use search, copy, or local file import.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <HttpStatusCodesTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            How to use this HTTP status code reference
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Start with the{" "}
            <strong className="text-foreground">search field</strong> when you
            remember a symptom (“gateway timeout”, “rate limit”) but not the exact
            number. Use the{" "}
            <strong className="text-foreground">class filters</strong> (1xx–5xx)
            when you already know whether you are dealing with success, redirects,
            client mistakes, or upstream failures. Click{" "}
            <strong className="text-foreground">Copy</strong> on any card to
            paste a structured explanation into tickets, runbooks, or Slack.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="text-foreground">Import log</strong> accepts plain
            text from <code className="text-sm text-foreground">.txt</code>,{" "}
            <code className="text-sm text-foreground">.log</code>, or similar
            exports. We scan for three-digit codes in the{" "}
            <strong className="text-foreground">100–599</strong> range and narrow
            the list to codes that appear in both your file and this reference—ideal
            after copying a slice of nginx, Apache, API gateway, or application
            logs. Clear the import anytime to return to the full table.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Guide: HTTP status classes at a glance
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <strong className="text-foreground">1xx informational</strong> —
              Interim responses; the client should wait for a final status. Common
              in upgrades, expect-continue flows, and early hints.
            </li>
            <li>
              <strong className="text-foreground">2xx success</strong> — The server
              accepted and processed the request.{" "}
              <strong>200 OK</strong> is the default for successful GET;{" "}
              <strong>201 Created</strong> and <strong>204 No Content</strong> are
              frequent in REST APIs.
            </li>
            <li>
              <strong className="text-foreground">3xx redirection</strong> — Further
              action is needed, usually following a <code>Location</code> header.
              <strong> 301/308</strong> signal permanent moves;{" "}
              <strong>302/307</strong> are treated as temporary in most stacks.
            </li>
            <li>
              <strong className="text-foreground">4xx client errors</strong> — The
              request was invalid, unauthorized, forbidden, not found, or rejected
              by policy (for example <strong>400</strong>, <strong>401</strong>,{" "}
              <strong>403</strong>, <strong>404</strong>, <strong>429</strong>).
            </li>
            <li>
              <strong className="text-foreground">5xx server errors</strong> — The
              origin or an upstream failed after accepting the request (
              <strong>500</strong>, <strong>502</strong>, <strong>503</strong>,{" "}
              <strong>504</strong>, and related codes).
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            SEO, redirects, and crawlers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Search engines use HTTP status codes together with headers and body
            content to decide whether to index a URL, follow a redirect, or drop a
            page from the index. Permanent redirects consolidate signals toward
            the target; soft or temporary behavior can leave duplicate URLs in
            play. When you audit a live URL, use our{" "}
            <Link
              href="/website/response-code-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP status code checker
            </Link>{" "}
            for the final status after redirects, the{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>{" "}
            for every hop, and the{" "}
            <Link
              href="/seo/redirect-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect type checker
            </Link>{" "}
            when you need to label 301 versus 302 behavior for SEO reporting.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            APIs, JSON payloads, and documentation
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            REST and GraphQL gateways often return 4xx for caller mistakes and 5xx
            when dependencies fail—pair status codes with structured error bodies so
            clients can act. When you document APIs, align status codes with{" "}
            <Link
              href="/api-toolbox/openapi-viewer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              OpenAPI / Swagger
            </Link>{" "}
            definitions and validate payloads with the{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter
            </Link>{" "}
            before publishing examples. For raw HTTP experiments, the{" "}
            <Link
              href="/api-toolbox/http-request-builder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP request builder
            </Link>{" "}
            helps reproduce what you see in logs.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Headers, TLS, and “why doesn’t this match curl?”
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Status codes describe the HTTP layer only. If you need{" "}
            <strong className="text-foreground">Cache-Control</strong>,{" "}
            <strong className="text-foreground">Set-Cookie</strong>, or security
            headers on the final response, use the{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>
            . For certificate issues that surface as TLS or handshake errors before
            a clean HTTP status is visible, validate the host with the{" "}
            <Link
              href="/website/ssl-certificate-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SSL certificate checker
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related tools in the API developer toolbox
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Browse the full{" "}
            <Link
              href="/#api-developer-toolbox"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              API developer toolbox
            </Link>{" "}
            section on the home page, or open a focused utility below.
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
            {httpStatusCodesFaqItems.map((item) => (
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
