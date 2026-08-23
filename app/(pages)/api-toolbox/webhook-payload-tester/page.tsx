import type { Metadata } from "next";
import Link from "next/link";
import { WebhookPayloadTesterTool } from "./webhook-payload-tester-tool";
import { webhookPayloadTesterFaqItems } from "@/lib/webhook-payload-tester-faq";
import { toolSections } from "@/lib/tool-catalog";

const apiToolbox =
  toolSections.find((s) => s.id === "api-developer-toolbox")?.tools ?? [];
const relatedTools = apiToolbox.filter(
  (t) => t.href !== "/api-toolbox/webhook-payload-tester",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/api-toolbox/webhook-payload-tester",
  },
};

export default function WebhookPayloadTesterPage() {
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
            <span className="text-foreground">Webhook payload tester</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Webhook payload tester — local POST body log for debugging without a
            public URL
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This free{" "}
            <strong className="font-medium text-foreground">
              webhook payload tester
            </strong>{" "}
            helps you practice{" "}
            <strong className="font-medium text-foreground">
              inbound HTTP webhook debugging
            </strong>{" "}
            when you cannot point Stripe, Slack, or GitHub at localhost or when
            request-bin style services are blocked. Paste or{" "}
            <strong className="font-medium text-foreground">
              upload a raw POST body
            </strong>
            , set{" "}
            <strong className="font-medium text-foreground">
              Content-Type and headers
            </strong>
            , validate JSON, then{" "}
            <strong className="font-medium text-foreground">
              record samples in your browser&apos;s localStorage
            </strong>{" "}
            with timestamps and labels—nothing is uploaded to our servers. Use
            quick templates inspired by{" "}
            <strong className="font-medium text-foreground">
              payment and GitHub-style webhooks
            </strong>
            , copy any event as JSON for tickets, and cross-check formatting with
            our{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter
            </Link>{" "}
            when you need a full tree view. For outbound API calls and headers,
            see the{" "}
            <Link
              href="/api-toolbox/http-request-builder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP request builder
            </Link>{" "}
            in the same toolbox.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <WebhookPayloadTesterTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why webhook payload testing matters for integrations
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Product and platform webhooks are{" "}
            <strong className="font-medium text-foreground">
              asynchronous HTTP POST callbacks
            </strong>{" "}
            carrying JSON, form-encoded, or XML bodies. Teams search for{" "}
            <strong className="font-medium text-foreground">
              webhook debugging
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              Stripe webhook test payload
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              GitHub webhook example
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              verify webhook signature locally
            </strong>{" "}
            when wiring billing, CI, or chat bots. A capture URL is not always
            available on locked-down networks; this page gives you a structured
            place to{" "}
            <strong className="font-medium text-foreground">
              rehearse Content-Types, header lines, and raw bytes
            </strong>{" "}
            before you trust idempotency keys and HMAC verification in
            production.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Keywords integrators use—
            <strong className="font-medium text-foreground">
              webhook replay
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              inbound payload log
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              POST body inspector
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              API event simulation
            </strong>
            —match what you do here: label events, keep a chronological local log,
            and export JSON for diffing or documentation. When you need to browse
            large API responses without recording them as webhooks, use the{" "}
            <Link
              href="/api-toolbox/api-response-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              API response formatter
            </Link>
            . For OpenAPI contracts that describe both REST paths and webhook
            schemas, open the{" "}
            <Link
              href="/api-toolbox/openapi-viewer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              OpenAPI / Swagger viewer
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this webhook payload tester
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Enter an{" "}
                <strong className="font-medium text-foreground">event label</strong>{" "}
                (for example the provider and event type) so your local log stays
                readable when you accumulate many samples.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Choose a{" "}
                <strong className="font-medium text-foreground">
                  Content-Type
                </strong>{" "}
                or set a custom value for vendor-specific media types. Add optional{" "}
                <strong className="font-medium text-foreground">
                  headers one per line
                </strong>{" "}
                (signature, idempotency, tracing) to mirror production.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Paste the{" "}
                <strong className="font-medium text-foreground">raw body</strong>{" "}
                or use{" "}
                <strong className="font-medium text-foreground">Upload file</strong>{" "}
                for .json or .txt captures. For JSON, watch the inline validation
                message and use{" "}
                <strong className="font-medium text-foreground">Format JSON</strong>{" "}
                for readable indentation before recording.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Record to local log
                </strong>{" "}
                to append an entry. Use{" "}
                <strong className="font-medium text-foreground">Copy JSON</strong>{" "}
                on any row to share a full snapshot, or{" "}
                <strong className="font-medium text-foreground">Copy body</strong>{" "}
                from the editor for quick clipboard work.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                When you graduate to live traffic, cross-reference{" "}
                <strong className="font-medium text-foreground">
                  HTTP status codes
                </strong>{" "}
                with our{" "}
                <Link
                  href="/api-toolbox/http-status-codes"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  HTTP status code reference
                </Link>{" "}
                and tune retry behavior with the{" "}
                <Link
                  href="/api-toolbox/rate-limit-calculator"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  API rate limit calculator
                </Link>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Internal links and companion tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Cryptographic signing for webhook verification often reuses patterns
            from general{" "}
            <strong className="font-medium text-foreground">HMAC</strong> utilities.
            Experiment on our{" "}
            <Link
              href="/security/hmac-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HMAC generator
            </Link>{" "}
            with test keys only. If you serialize webhook bodies to Base64 for
            logging pipelines, the{" "}
            <Link
              href="/dev/base64"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Base64 encoder
            </Link>{" "}
            stays client-side. For OAuth-connected APIs that also emit webhooks,
            review flows in the{" "}
            <Link
              href="/api-toolbox/oauth2-flow-visualizer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              OAuth 2.0 flow visualizer
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related API developer toolbox utilities
          </h2>
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
                <span>{tool.description}</span>
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
            {webhookPayloadTesterFaqItems.map((item) => (
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
