import type { Metadata } from "next";
import Link from "next/link";
import { HttpRequestBuilderTool } from "./http-request-builder-tool";
import { httpRequestBuilderFaqItems } from "@/lib/http-request-builder-faq";
import { toolSections } from "@/lib/tool-catalog";

const apiTools =
  toolSections.find((s) => s.id === "api-developer-toolbox")?.tools ?? [];
const relatedTools = apiTools.filter(
  (t) => t.href !== "/api-toolbox/http-request-builder",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/api-toolbox/http-request-builder",
  },
};

export default function HttpRequestBuilderPage() {
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
            <span className="text-foreground">HTTP request builder</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            HTTP request builder — test REST APIs with fetch, headers, and JSON
            bodies
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online HTTP client
            </strong>{" "}
            to{" "}
            <strong className="font-medium text-foreground">
              compose REST requests
            </strong>{" "}
            in the browser: pick{" "}
            <strong className="font-medium text-foreground">
              GET, POST, PUT, PATCH, DELETE, HEAD, or OPTIONS
            </strong>
            , edit{" "}
            <strong className="font-medium text-foreground">
              request headers
            </strong>
            , attach a{" "}
            <strong className="font-medium text-foreground">
              JSON or form body
            </strong>
            , then send with the{" "}
            <strong className="font-medium text-foreground">
              Fetch API
            </strong>{" "}
            and read{" "}
            <strong className="font-medium text-foreground">
              status codes, timing, and response headers
            </strong>
            . Copy{" "}
            <strong className="font-medium text-foreground">curl</strong>{" "}
            equivalents for CI and teammates. Pair it with our{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter
            </Link>
            ,{" "}
            <Link
              href="/api-toolbox/http-status-codes"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP status code reference
            </Link>
            , and{" "}
            <Link
              href="/api-toolbox/mime-type-lookup"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              MIME type lookup
            </Link>{" "}
            when you document APIs and troubleshoot integrations.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <HttpRequestBuilderTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why use a browser-based HTTP request builder?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Modern backends expose{" "}
            <strong className="font-medium text-foreground">
              REST and HTTP APIs
            </strong>{" "}
            for mobile apps, SPAs, and partner integrations. Debugging those
            contracts means repeating the same{" "}
            <strong className="font-medium text-foreground">
              authenticated requests
            </strong>{" "}
            with slightly different paths, query strings, or JSON payloads. A
            lightweight{" "}
            <strong className="font-medium text-foreground">
              REST client in the tab
            </strong>{" "}
            reduces context switching: you stay next to documentation, tickets,
            and DevTools. Unlike server-side proxies, this tool sends traffic
            from <em>your</em> browser, so you see real{" "}
            <strong className="font-medium text-foreground">CORS</strong>{" "}
            behavior—the same surface your frontend hits.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Product engineers use it to verify{" "}
            <strong className="font-medium text-foreground">
              pagination, filtering, and error shapes
            </strong>
            . Platform teams pair it with{" "}
            <Link
              href="/dev/jwt-decoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JWT decoding
            </Link>{" "}
            when debugging bearer tokens, and with{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header inspection
            </Link>{" "}
            when validating caching and security headers on public URLs.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this HTTP request builder (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Enter a full{" "}
                <strong className="font-medium text-foreground">
                  https:// or http:// URL
                </strong>{" "}
                pointing at your API route or test echo service. Use{" "}
                <strong className="font-medium text-foreground">
                  Sample GET
                </strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">
                  Sample POST JSON
                </strong>{" "}
                to load a working example against{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  httpbin.org
                </code>{" "}
                when your network permits.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Choose an{" "}
                <strong className="font-medium text-foreground">
                  HTTP method
                </strong>
                . Use{" "}
                <strong className="font-medium text-foreground">GET</strong> for
                idempotent reads,{" "}
                <strong className="font-medium text-foreground">POST</strong>{" "}
                for creates and non-idempotent actions,{" "}
                <strong className="font-medium text-foreground">PUT</strong> or{" "}
                <strong className="font-medium text-foreground">PATCH</strong>{" "}
                for updates, and{" "}
                <strong className="font-medium text-foreground">DELETE</strong>{" "}
                for removals.{" "}
                <strong className="font-medium text-foreground">HEAD</strong>{" "}
                returns headers only;{" "}
                <strong className="font-medium text-foreground">OPTIONS</strong>{" "}
                is often used for CORS preflight discovery.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Add or edit{" "}
                <strong className="font-medium text-foreground">
                  request headers
                </strong>
                : typical keys include{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  Authorization
                </code>
                ,{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  Accept
                </code>
                , and{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  Content-Type
                </code>
                . Remove rows you do not need; the list may be empty if the
                endpoint requires no custom headers.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                For methods that accept an entity body, pick{" "}
                <strong className="font-medium text-foreground">JSON</strong>{" "}
                (with automatic{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  application/json
                </code>{" "}
                when missing),{" "}
                <strong className="font-medium text-foreground">raw</strong> text
                for XML or NDJSON, or{" "}
                <strong className="font-medium text-foreground">
                  form URL-encoded
                </strong>{" "}
                key/value pairs. Use{" "}
                <strong className="font-medium text-foreground">
                  Upload file
                </strong>{" "}
                to load a saved payload from disk.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Toggle{" "}
                <strong className="font-medium text-foreground">
                  Include (cookies)
                </strong>{" "}
                only when you intentionally send cookies to the target origin and
                the API allows credentialed CORS. Otherwise leave credentials
                omitted.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">Send</strong>.
                Review{" "}
                <strong className="font-medium text-foreground">
                  HTTP status
                </strong>
                , elapsed{" "}
                <strong className="font-medium text-foreground">
                  milliseconds
                </strong>
                , and response headers. Copy the response body or headers, or
                copy the generated{" "}
                <strong className="font-medium text-foreground">curl</strong>{" "}
                command for scripts and runbooks.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            CORS, preflight, and when “Failed to fetch” appears
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browsers enforce the{" "}
            <strong className="font-medium text-foreground">
              same-origin policy
            </strong>
            . Cross-origin calls succeed only if the server responds with
            appropriate{" "}
            <strong className="font-medium text-foreground">
              Access-Control-*
            </strong>{" "}
            headers. Non-simple requests (for example JSON with custom headers)
            may trigger an{" "}
            <strong className="font-medium text-foreground">
              OPTIONS preflight
            </strong>{" "}
            before your real method runs. If the API does not allow your
            origin,{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              fetch
            </code>{" "}
            fails with a network error even though the same URL works in curl.
            That is expected: use server-side calls, an API gateway, or a
            development proxy when you control the backend. Our{" "}
            <Link
              href="/seo/redirect-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect checker
            </Link>{" "}
            and{" "}
            <Link
              href="/website/response-code-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              response code checker
            </Link>{" "}
            help validate URLs and status codes from a server context when you
            need a second opinion.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Security and privacy notes
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Requests are issued from your machine to the destination you
            specify. Do not paste production secrets into shared screen
            recordings. Prefer short-lived tokens, rotate keys if you suspect
            leakage, and redact{" "}
            <strong className="font-medium text-foreground">
              Authorization
            </strong>{" "}
            headers before exporting curl snippets to tickets. For structured
            data hygiene after the call, run bodies through the{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter
            </Link>{" "}
            or{" "}
            <Link
              href="/api-toolbox/api-response-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              API response formatter
            </Link>{" "}
            when you publish examples.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related API developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browse the full{" "}
            <Link
              href="/#api-developer-toolbox"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              API developer toolbox
            </Link>{" "}
            on the home page for formatters, references, and calculators.
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
            {httpRequestBuilderFaqItems.map((item) => (
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
