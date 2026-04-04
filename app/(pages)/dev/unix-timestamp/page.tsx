import type { Metadata } from "next";
import Link from "next/link";
import { UnixTimestampTool } from "./unix-timestamp-tool";
import { unixTimestampFaqItems } from "@/lib/unix-timestamp-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/unix-timestamp");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/unix-timestamp",
  },
};

export default function UnixTimestampPage() {
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
            <span className="text-foreground">Unix timestamp converter</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Unix timestamp converter — epoch seconds, milliseconds, UTC, and
            local time
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              Unix timestamp converter online
            </strong>{" "}
            to translate{" "}
            <strong className="font-medium text-foreground">
              POSIX / Unix epoch
            </strong>{" "}
            values into{" "}
            <strong className="font-medium text-foreground">
              human-readable dates
            </strong>
            , compare{" "}
            <strong className="font-medium text-foreground">UTC ISO 8601</strong>{" "}
            with your{" "}
            <strong className="font-medium text-foreground">
              local time zone
            </strong>
            , and go the other way—from a calendar pick or pasted{" "}
            <strong className="font-medium text-foreground">ISO string</strong>{" "}
            back to{" "}
            <strong className="font-medium text-foreground">
              Unix seconds and milliseconds
            </strong>
            . Everything runs{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            , which suits log triage, API payloads, and database columns without
            uploading sensitive data. For token timelines, continue with the{" "}
            <Link
              href="/dev/jwt-decoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JWT decoder
            </Link>
            ; for recurring jobs, pair this page with the{" "}
            <Link
              href="/dev/cron-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              cron expression generator
            </Link>{" "}
            and{" "}
            <Link
              href="/dev/cron-explainer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              cron explainer
            </Link>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <UnixTimestampTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why developers still live in Unix time
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            The{" "}
            <strong className="font-medium text-foreground">Unix epoch</strong>{" "}
            is the instant 1970-01-01T00:00:00Z. Storing instants as integers
            avoids ambiguous string formats, sorts naturally, and matches what
            you see in{" "}
            <strong className="font-medium text-foreground">
              Linux logs
            </strong>
            , many{" "}
            <strong className="font-medium text-foreground">SQL databases</strong>
            , and most{" "}
            <strong className="font-medium text-foreground">JSON APIs</strong>.
            The recurring confusion is whether a field counts{" "}
            <strong className="font-medium text-foreground">seconds</strong> or{" "}
            <strong className="font-medium text-foreground">milliseconds</strong>
            —off by three orders of magnitude, dates look centuries wrong. This
            tool makes the unit explicit and shows both representations so you
            can paste once and verify against Grafana, CloudWatch, or Splunk
            without mental arithmetic.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            When you work across regions, keep{" "}
            <strong className="font-medium text-foreground">UTC</strong> as the
            contract in storage and transport, then render local time only in UIs.
            If you need to sanity-check headers or caching, our{" "}
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
            complement timestamp review for deployments and CDN debugging.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this Unix timestamp converter (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  Epoch → readable:
                </strong>{" "}
                Paste a numeric value from logs or JSON. Choose{" "}
                <strong className="font-medium text-foreground">Auto</strong> if
                you are unsure: values with up to ten digits in the magnitude are
                treated as{" "}
                <strong className="font-medium text-foreground">seconds</strong>;
                longer digit runs default to{" "}
                <strong className="font-medium text-foreground">
                  milliseconds
                </strong>
                . Override with explicit Seconds or Milliseconds when the API
                contract is known.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read the{" "}
                <strong className="font-medium text-foreground">local</strong>{" "}
                line for how the instant appears on your machine, and the{" "}
                <strong className="font-medium text-foreground">
                  UTC ISO 8601
                </strong>{" "}
                string for canonical comparisons. Copy either form for tickets or
                documentation.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Use current time
                </strong>{" "}
                to drop in the present instant as Unix seconds—handy when you
                draft{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  exp
                </code>{" "}
                examples or reproduce bug reports.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  Readable → epoch:
                </strong>{" "}
                Use the{" "}
                <strong className="font-medium text-foreground">
                  datetime-local
                </strong>{" "}
                control for wall-clock times in your zone, or paste an absolute{" "}
                <strong className="font-medium text-foreground">ISO 8601</strong>{" "}
                value (including{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  Z
                </code>{" "}
                or offsets). When the ISO field is non-empty, it takes precedence
                over the picker.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Copy{" "}
                <strong className="font-medium text-foreground">
                  Unix seconds
                </strong>{" "}
                for languages and claims that expect ten-digit fields, or{" "}
                <strong className="font-medium text-foreground">
                  Unix milliseconds
                </strong>{" "}
                for JavaScript{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  Date.now()
                </code>{" "}
                style APIs.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Seconds vs milliseconds: quick reference
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="font-medium text-foreground">
              Unix seconds
            </strong>{" "}
            appear in OpenID Connect metadata, many OAuth2 JWT claims, C{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              time_t
            </code>{" "}
            conventions, and PostgreSQL{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              EXTRACT(EPOCH ...)
            </code>{" "}
            results (often double, but conceptually seconds).{" "}
            <strong className="font-medium text-foreground">
              Milliseconds
            </strong>{" "}
            dominate browser JavaScript, some mobile SDKs, and streams where
            sub-second ordering matters. If you divide milliseconds by one
            thousand you should recover the second count—when you cannot, suspect
            nanoseconds (rare in JSON) or a stringly-typed bug.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            ISO 8601, time zones, and daylight saving
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Strings such as{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              2026-04-04T14:30:00Z
            </code>{" "}
            pin an unambiguous instant. Without a zone suffix, browsers interpret
            datetime strings in a history-sensitive way; the picker path on this
            page is meant for{" "}
            <strong className="font-medium text-foreground">local intent</strong>
            . For production systems, prefer storing UTC plus a known offset or
            using a library like Temporal once widely adopted. When you serialize
            configuration, our{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter
            </Link>{" "}
            and{" "}
            <Link
              href="/dev/yaml-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              YAML to JSON
            </Link>{" "}
            tools help validate the surrounding document while you adjust
            timestamps.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            SEO, analytics, and event pipelines
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Marketing engineers comparing{" "}
            <strong className="font-medium text-foreground">
              Google Analytics
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">Snowplow</strong>, or
            warehouse export timestamps can normalize on this page before joining
            to CRM data. If you are validating sitemap or indexing timing, the{" "}
            <Link
              href="/seo/sitemap-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              XML sitemap generator
            </Link>{" "}
            and{" "}
            <Link
              href="/seo/robots-txt-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              robots.txt generator
            </Link>{" "}
            live alongside developer utilities in this project so you can move
            between technical SEO artifacts and low-level time debugging without
            leaving the same toolkit.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
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
            {unixTimestampFaqItems.map((item) => (
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
