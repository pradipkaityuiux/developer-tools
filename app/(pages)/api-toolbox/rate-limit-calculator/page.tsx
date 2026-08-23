import type { Metadata } from "next";
import Link from "next/link";
import { RateLimitCalculatorTool } from "./rate-limit-calculator-tool";
import { rateLimitCalculatorFaqItems } from "@/lib/rate-limit-calculator-faq";
import { toolSections } from "@/lib/tool-catalog";

const apiToolbox =
  toolSections.find((s) => s.id === "api-developer-toolbox")?.tools ?? [];
const relatedTools = apiToolbox.filter(
  (t) => t.href !== "/api-toolbox/rate-limit-calculator",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/api-toolbox/rate-limit-calculator",
  },
};

export default function RateLimitCalculatorPage() {
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
            <span className="text-foreground">API rate limit calculator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            API rate limit calculator — pace requests per minute against a daily
            quota
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              API rate limit calculator
            </strong>{" "}
            when your provider publishes both a{" "}
            <strong className="font-medium text-foreground">
              per-minute throughput
            </strong>{" "}
            (requests per minute, RPM) and a{" "}
            <strong className="font-medium text-foreground">
              daily API call budget
            </strong>
            . Enter your target sustained RPM and the daily cap: the tool shows
            the{" "}
            <strong className="font-medium text-foreground">
              average RPM that consumes the quota evenly
            </strong>{" "}
            across 24 hours, projects how many calls a full day at your RPM would
            make, and estimates{" "}
            <strong className="font-medium text-foreground">
              how long until you hit the daily wall
            </strong>{" "}
            when you are over pace. It also suggests{" "}
            <strong className="font-medium text-foreground">
              even spacing between requests
            </strong>{" "}
            in seconds—useful for schedulers, queues, and client-side throttles.
            Everything runs{" "}
            <strong className="font-medium text-foreground">
              locally in the browser
            </strong>
            . When you need to debug live traffic, pair these numbers with our{" "}
            <Link
              href="/api-toolbox/http-request-builder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP request builder
            </Link>{" "}
            and the{" "}
            <Link
              href="/api-toolbox/http-status-codes"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP status code reference
            </Link>{" "}
            for{" "}
            <strong className="font-medium text-foreground">
              429 Too Many Requests
            </strong>{" "}
            responses.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <RateLimitCalculatorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why model RPM together with a daily quota?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Many SaaS and cloud APIs expose{" "}
            <strong className="font-medium text-foreground">
              multiple independent limits
            </strong>
            : a short-window ceiling (per second or per minute) to protect
            backends from bursts, and a longer{" "}
            <strong className="font-medium text-foreground">
              daily or monthly allowance
            </strong>{" "}
            tied to your plan. You can stay under the per-minute cap and still
            burn the daily budget in a few hours if traffic is aggressive, or you
            can be safe on the daily line while occasionally tripping a burst
            rule. This page focuses on the relationship between{" "}
            <strong className="font-medium text-foreground">
              sustained requests per minute
            </strong>{" "}
            and a{" "}
            <strong className="font-medium text-foreground">
              24-hour call budget
            </strong>{" "}
            so engineers and SREs can answer: &quot;If we ship this job at X RPM,
            do we finish the day under quota?&quot;
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            The math uses{" "}
            <strong className="font-medium text-foreground">
              1,440 minutes per day
            </strong>{" "}
            (24 × 60). That matches how many teams back-of-the-envelope{" "}
            <strong className="font-medium text-foreground">
              API rate planning
            </strong>
            , even when the vendor implements a rolling 24-hour window or UTC
            midnight reset—always confirm semantics in the provider&apos;s
            documentation. For contract design and error payloads, browsing an{" "}
            <Link
              href="/api-toolbox/openapi-viewer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              OpenAPI / Swagger
            </Link>{" "}
            definition alongside this calculator keeps limits and response shapes
            aligned.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this API pacing calculator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Find your provider&apos;s documented{" "}
                <strong className="font-medium text-foreground">
                  requests per minute
                </strong>{" "}
                (or convert{" "}
                <strong className="font-medium text-foreground">
                  requests per second
                </strong>{" "}
                to RPM by multiplying by 60). Enter that as your working
                sustained RPM unless you intentionally plan lower.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Enter the{" "}
                <strong className="font-medium text-foreground">
                  daily quota
                </strong>{" "}
                in total calls allowed per 24 hours for the key or workspace you
                are sizing.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read{" "}
                <strong className="font-medium text-foreground">
                  average RPM for the daily quota
                </strong>
                —that is the steady pace that uses exactly one daily allowance if
                spread perfectly across the day.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                If projected daily calls exceed the quota, note{" "}
                <strong className="font-medium text-foreground">
                  time until the daily budget is exhausted
                </strong>{" "}
                at your RPM. Use{" "}
                <strong className="font-medium text-foreground">Copy report</strong>{" "}
                to paste numbers into runbooks or tickets.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Optionally use{" "}
                <strong className="font-medium text-foreground">Load JSON</strong>{" "}
                to import a saved{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  requestsPerMinute
                </code>{" "}
                and{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  dailyQuota
                </code>{" "}
                pair for repeat scenarios.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Rate limiting, throttling, and HTTP semantics
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            When a client exceeds a limit, servers often return{" "}
            <strong className="font-medium text-foreground">
              HTTP 429 Too Many Requests
            </strong>
            . Some APIs add{" "}
            <strong className="font-medium text-foreground">Retry-After</strong>,{" "}
            <strong className="font-medium text-foreground">X-RateLimit-*</strong>
            , or vendor-specific headers. Implement{" "}
            <strong className="font-medium text-foreground">
              exponential backoff with jitter
            </strong>{" "}
            so retries do not synchronize and amplify load. This calculator does
            not model retry amplification—treat its output as a baseline for steady
            traffic. For header inspection on a live URL, the{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>{" "}
            complements local pacing math.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and search intent this page covers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Teams search for an{" "}
            <strong className="font-medium text-foreground">
              API rate limit calculator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              RPM to daily quota converter
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              requests per minute vs daily limit
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              API throttling planner
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              how long until I hit my API daily limit
            </strong>
            . This tool answers pacing questions for{" "}
            <strong className="font-medium text-foreground">
              REST and GraphQL integrations
            </strong>
            , batch jobs, and webhook fan-out where both burst and daily caps
            matter. It does not replace vendor dashboards or replace reading{" "}
            <strong className="font-medium text-foreground">
              OAuth token rate limits
            </strong>{" "}
            for auth endpoints—see our{" "}
            <Link
              href="/api-toolbox/oauth2-flow-visualizer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              OAuth 2.0 flow visualizer
            </Link>{" "}
            for auth design context.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related free API developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browse the full{" "}
            <Link
              href="/#api-developer-toolbox"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              API developer toolbox
            </Link>{" "}
            on the home page, or open a focused utility below.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {relatedTools.slice(0, 12).map((tool) => (
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
            {rateLimitCalculatorFaqItems.map((item) => (
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
