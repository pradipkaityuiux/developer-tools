import type { Metadata } from "next";
import Link from "next/link";
import { CronExplainerTool } from "./cron-explainer-tool";
import { cronExplainerFaqItems } from "@/lib/cron-explainer-faq";
import { toolSections } from "@/lib/tool-catalog";
import { BlogCard } from "@/components/blog-card";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/cron-explainer");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/cron-explainer",
  },
};

export default function CronExplainerPage() {
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
            <span className="text-foreground">Cron expression explainer</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Cron expression explainer — plain English, field breakdown, next run
            times
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              cron expression explainer online
            </strong>{" "}
            to decode{" "}
            <strong className="font-medium text-foreground">
              five-field Unix cron
            </strong>{" "}
            strings: see each of{" "}
            <strong className="font-medium text-foreground">
              minute, hour, day-of-month, month, and day-of-week
            </strong>{" "}
            in a table, read a{" "}
            <strong className="font-medium text-foreground">
              human-readable schedule summary
            </strong>
            , and preview{" "}
            <strong className="font-medium text-foreground">
              upcoming execution times
            </strong>{" "}
            in your local timezone. When both{" "}
            <strong className="font-medium text-foreground">
              DOM and DOW are specific
            </strong>
            , the tool warns about the classic{" "}
            <strong className="font-medium text-foreground">
              Vixie-style OR rule
            </strong>{" "}
            so you do not misread inherited{" "}
            <strong className="font-medium text-foreground">crontab</strong>{" "}
            lines. Parsing stays in your browser—paste from{" "}
            <strong className="font-medium text-foreground">
              Linux cron, Kubernetes CronJob, serverless schedules, or CI
            </strong>{" "}
            without uploading secrets. Pair decoding with our{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter
            </Link>{" "}
            for pipeline configs and the{" "}
            <Link
              href="/dev/regex-tester"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              regex tester
            </Link>{" "}
            when schedules embed pattern-heavy names.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <CronExplainerTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why use a cron schedule explainer?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Operations and platform engineers constantly ask{" "}
            <strong className="font-medium text-foreground">
              what does this cron expression mean
            </strong>{" "}
            when onboarding to a legacy server, reviewing Terraform or Helm, or
            auditing GitHub Actions and cloud function triggers. A dedicated{" "}
            <strong className="font-medium text-foreground">
              cron translator
            </strong>{" "}
            turns opaque stars, slashes, and comma lists into sentences you can
            share with security, support, and product teams. Unlike a wall of
            documentation, you paste the exact string and immediately see{" "}
            <strong className="font-medium text-foreground">
              whether a job is daily, weekly, or something stranger
            </strong>
            , plus a short list of{" "}
            <strong className="font-medium text-foreground">
              next cron run times
            </strong>{" "}
            to sanity-check intent before you change production.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            If you also validate deployment artifacts, keep{" "}
            <Link
              href="/dev/yaml-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              YAML and JSON
            </Link>{" "}
            consistent across environments, and use our{" "}
            <Link
              href="/dev/sql-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SQL formatter
            </Link>{" "}
            when cron jobs touch reporting queries.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How the five cron fields work (quick guide)
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Standard{" "}
            <strong className="font-medium text-foreground">
              Unix crontab format
            </strong>{" "}
            uses five columns, left to right:{" "}
            <strong className="font-medium text-foreground">minute</strong>{" "}
            (0–59),{" "}
            <strong className="font-medium text-foreground">hour</strong>{" "}
            (0–23),{" "}
            <strong className="font-medium text-foreground">
              day of month
            </strong>{" "}
            (1–31),{" "}
            <strong className="font-medium text-foreground">month</strong>{" "}
            (1–12 or JAN–DEC), and{" "}
            <strong className="font-medium text-foreground">
              day of week
            </strong>{" "}
            (0–7 or SUN–SAT, where 0 and 7 often both mean Sunday). An asterisk{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              *
            </code>{" "}
            means &quot;every&quot; for that column. Ranges like{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              1-5
            </code>
            , steps like{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              */15
            </code>
            , and lists like{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              1,15
            </code>{" "}
            combine the usual way. This page does not cover Quartz-only tokens
            such as{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              ?
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              L
            </code>
            , or six-field second-level schedules.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            The day-of-month vs day-of-week OR rule
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            The most common misunderstanding in{" "}
            <strong className="font-medium text-foreground">
              cron expression meaning
            </strong>{" "}
            threads is how two specific calendar columns interact. On typical
            Vixie-style cron, when{" "}
            <strong className="font-medium text-foreground">
              both day-of-month and day-of-week are restricted
            </strong>{" "}
            (neither is{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              *
            </code>
            ), the job runs if{" "}
            <strong className="font-medium text-foreground">either</strong>{" "}
            matches—not only when both match. That is why{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              30 4 1,15 * 5
            </code>{" "}
            fires at 4:30 AM on the 1st and 15th{" "}
            <strong className="font-medium text-foreground">and</strong> every
            Friday. Our explainer surfaces that warning whenever it applies so
            your{" "}
            <strong className="font-medium text-foreground">
              schedule audit
            </strong>{" "}
            catches surprises before a deploy.
          </p>
          <BlogCard
            title="Cron Job Syntax Explained: A Beginner-Friendly Guide"
            description="This guide walks through exactly how cron syntax works, field by field, with real examples you can copy and adapt."
            href="/blog/cron-job-syntax-explained"
          />

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this cron explainer (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste a single line with five fields—often copied from{" "}
                <strong className="font-medium text-foreground">
                  crontab -e
                </strong>
                , a dashboard, or infrastructure-as-code. Click{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                (
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  0 9 * * 1-5
                </code>
                ) for 09:00 on weekdays.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read the field table to confirm each column lines up with what
                your platform expects (some UIs hide seconds or use UTC labels).
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Review the plain-language bullets and any amber{" "}
                <strong className="font-medium text-foreground">Heads-up</strong>{" "}
                callouts—especially for combined DOM and DOW constraints.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Compare{" "}
                <strong className="font-medium text-foreground">
                  next run times
                </strong>{" "}
                against your expectations. Remember they use your browser&apos;s
                local timezone; production hosts may differ—align with{" "}
                <strong className="font-medium text-foreground">TZ</strong> or
                orchestrator settings before you rely on them for alerts.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                When you need to inspect URLs your batch jobs call, use the{" "}
                <Link
                  href="/website/http-header-checker"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  HTTP header checker
                </Link>{" "}
                or{" "}
                <Link
                  href="/website/redirect-chain-checker"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  redirect chain checker
                </Link>{" "}
                on the same site to verify endpoints your cron hits.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords teams search for (and how this page maps to them)
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            People look for a{" "}
            <strong className="font-medium text-foreground">
              crontab explainer
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              cron schedule reader
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              human readable cron
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              decode cron online
            </strong>{" "}
            when docs are scattered across Linux man pages, cloud vendor
            consoles, and SaaS job runners. This utility targets those intents
            with an interactive field table, narrative summary, and projected
            runs without sign-up. For structured data work adjacent to batch
            jobs, the{" "}
            <Link
              href="/dev/csv-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV to JSON
            </Link>{" "}
            and{" "}
            <Link
              href="/dev/json-to-csv"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON to CSV
            </Link>{" "}
            converters help normalize exports your cron produces or consumes.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Timezones, DST, and production checklists
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            A{" "}
            <strong className="font-medium text-foreground">
              cron expression checker
            </strong>{" "}
            in the browser explains intent, but runtime still depends on where
            the scheduler runs. Containers may default to UTC while your laptop
            shows local time; daylight saving shifts can move wall-clock hours
            even when UTC offsets look stable. Treat this page as a{" "}
            <strong className="font-medium text-foreground">
              design-time explainer
            </strong>
            , then confirm with your platform&apos;s execution logs or a staging
            trigger. For external reachability checks tied to maintenance
            windows, our{" "}
            <Link
              href="/website/response-code-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP response code checker
            </Link>{" "}
            complements that workflow.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Limitations vs full orchestrators
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Kubernetes, AWS EventBridge, and managed cron products sometimes
            extend or subset classic syntax. This tool implements the widespread
            five-field rules plus month and weekday names—enough for many{" "}
            <strong className="font-medium text-foreground">
              Linux cron expression
            </strong>{" "}
            examples. It does not evaluate{" "}
            <strong className="font-medium text-foreground">
              @yearly, @monthly, @weekly
            </strong>{" "}
            shorthands or per-user timezone files. When vendors disagree, trust
            their docs and use this explainer as a first pass only.
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
            {cronExplainerFaqItems.map((item) => (
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
