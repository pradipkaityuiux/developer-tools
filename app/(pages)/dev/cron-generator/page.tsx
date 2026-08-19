import type { Metadata } from "next";
import Link from "next/link";
import { CronGeneratorTool } from "./cron-generator-tool";
import { cronGeneratorFaqItems } from "@/lib/cron-generator-faq";
import { toolSections } from "@/lib/tool-catalog";
import { BlogCard } from "@/components/blog-card";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/cron-generator");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/cron-generator",
  },
};

export default function CronGeneratorPage() {
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
            <span className="text-foreground">Cron expression generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Cron expression generator — build 5-field schedules with a
            human-readable summary
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              cron expression generator
            </strong>{" "}
            to assemble a valid{" "}
            <strong className="font-medium text-foreground">
              five-field cron schedule
            </strong>{" "}
            (minute, hour, day of month, month, day of week) without memorizing
            every special character. Start from{" "}
            <strong className="font-medium text-foreground">
              common presets
            </strong>{" "}
            — every 5 or 15 minutes, hourly, daily, weekdays, weekly, monthly —
            then refine fields with dropdowns. The tool shows the exact{" "}
            <strong className="font-medium text-foreground">crontab string</strong>{" "}
            and a{" "}
            <strong className="font-medium text-foreground">
              plain-English explanation
            </strong>{" "}
            so you can paste into{" "}
            <strong className="font-medium text-foreground">Linux crontab</strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              Kubernetes CronJobs
            </strong>
            , CI schedules, or cloud rules with confidence. Everything runs{" "}
            <strong className="font-medium text-foreground">
              locally in the browser
            </strong>
            —no cron strings are uploaded. When you need to sanity-check times
            after deployment, pair the expression with our{" "}
            <Link
              href="/dev/unix-timestamp"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Unix timestamp converter
            </Link>{" "}
            for log correlation.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <CronGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            What is a cron expression generator?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            A{" "}
            <strong className="font-medium text-foreground">
              cron expression generator
            </strong>{" "}
            is a focused UI that maps the schedule you have in mind — “every
            weekday at 9 AM,” “every 15 minutes,” “first of the month at
            midnight” — into the compact syntax schedulers expect. Instead of
            hand-editing five positions and worrying whether{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              *
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              */15
            </code>
            , or day-of-week versus day-of-month is correct, you pick values from
            labeled controls and copy a single line. This page targets the
            widespread{" "}
            <strong className="font-medium text-foreground">
              Vixie-style five-field
            </strong>{" "}
            format used by Unix{" "}
            <strong className="font-medium text-foreground">crontab</strong> and
            many libraries; some products add seconds or use UTC-only
            interpretation, so always confirm against your host’s docs.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            If you already have a string and want the reverse workflow — paste,
            explain, and see upcoming run times — use our companion{" "}
            <Link
              href="/dev/cron-explainer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Cron Expression Explainer
            </Link>
            . For repetitive string patterns in logs or configs, the{" "}
            <Link
              href="/dev/regex-tester"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              regex tester
            </Link>{" "}
            helps validate extractors before you wire them into jobs.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this cron schedule builder (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Click a{" "}
                <strong className="font-medium text-foreground">
                  quick preset
                </strong>{" "}
                that matches your intent (for example{" "}
                <strong className="font-medium text-foreground">
                  every 15 minutes
                </strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">
                  weekdays 9:00 AM
                </strong>
                ). Presets load all five fields so you start from a known-good{" "}
                <strong className="font-medium text-foreground">
                  cron schedule
                </strong>
                .
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Adjust{" "}
                <strong className="font-medium text-foreground">minute</strong>{" "}
                and{" "}
                <strong className="font-medium text-foreground">hour</strong>{" "}
                for wall-clock time in 24-hour form. Use{" "}
                <strong className="font-medium text-foreground">
                  day of month
                </strong>{" "}
                and{" "}
                <strong className="font-medium text-foreground">month</strong>{" "}
                for annual or monthly jobs, and{" "}
                <strong className="font-medium text-foreground">
                  day of week
                </strong>{" "}
                when the job should track weekdays or a single weekday (
                <strong className="font-medium text-foreground">
                  Sunday = 0
                </strong>{" "}
                in this convention).
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read the{" "}
                <strong className="font-medium text-foreground">
                  human-readable summary
                </strong>{" "}
                under the expression. It is designed for the most common
                patterns (fixed times, steps like{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  */5
                </code>
                , weekday ranges). Unusual combinations still show the raw five
                fields so you can cross-check documentation.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Press{" "}
                <strong className="font-medium text-foreground">
                  Copy expression
                </strong>{" "}
                and paste into your target:{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  crontab -e
                </code>
                , a manifest{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  schedule
                </code>{" "}
                field, or a managed scheduler UI. Verify{" "}
                <strong className="font-medium text-foreground">time zone</strong>{" "}
                (UTC vs local) so production matches what you expect.
              </span>
            </li>
          </ol>

          <BlogCard
            title="Cron Job Syntax Explained: A Beginner-Friendly Guide"
            description="This guide walks through exactly how cron syntax works, field by field, with real examples you can copy and adapt."
            href="/blog/cron-job-syntax-explained"
          />
          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Cron field cheat sheet (minute through weekday)
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="font-medium text-foreground">Minute</strong>{" "}
            (0–59): use{" "}
            <code className="font-mono text-sm">*</code> for every minute,{" "}
            <code className="font-mono text-sm">*/n</code> for every{" "}
            <em>n</em> minutes, or a fixed value for “at this minute past the
            hour.”{" "}
            <strong className="font-medium text-foreground">Hour</strong>{" "}
            (0–23):{" "}
            <code className="font-mono text-sm">*</code> means every hour when
            combined with a repeating minute pattern, or pin the clock hour for
            daily jobs.{" "}
            <strong className="font-medium text-foreground">
              Day of month
            </strong>{" "}
            (1–31) and{" "}
            <strong className="font-medium text-foreground">month</strong>{" "}
            (1–12) narrow which calendar dates qualify.{" "}
            <strong className="font-medium text-foreground">Day of week</strong>{" "}
            (0–6, Sunday first) selects weekdays or a single weekday; the
            preset{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              1-5
            </code>{" "}
            encodes Monday through Friday. When both day-of-month and day-of-week
            are constrained, some engines combine them with OR semantics — keep
            one field as{" "}
            <code className="font-mono text-sm">*</code> unless you have tested
            your platform’s rule.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Where generated cron expressions are used
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="font-medium text-foreground">
              Infrastructure and apps
            </strong>{" "}
            rely on cron for backups, report generation, cache warming, and
            certificate renewal checks.{" "}
            <strong className="font-medium text-foreground">Kubernetes</strong>{" "}
            CronJobs accept a five-field line in{" "}
            <code className="font-mono text-sm">spec.schedule</code>.{" "}
            <strong className="font-medium text-foreground">
              GitHub Actions
            </strong>{" "}
            uses a similar but not identical{" "}
            <code className="font-mono text-sm">on.schedule</code> syntax — always
            compare with official examples.{" "}
            <strong className="font-medium text-foreground">AWS EventBridge</strong>{" "}
            and other clouds often document six-field variants including
            seconds. The string you build here is a strong starting point; align
            field count and wildcards with each provider. When your pipeline
            stores schedules in{" "}
            <strong className="font-medium text-foreground">JSON or YAML</strong>
            , validate the surrounding file with our{" "}
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
            tools so deploy-time typos do not mask a bad schedule.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and search intent this page covers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Teams look for a{" "}
            <strong className="font-medium text-foreground">
              crontab generator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              online cron maker
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              schedule builder for Linux
            </strong>{" "}
            when they want fast, correct strings without reading man pages under
            pressure. Related queries include{" "}
            <strong className="font-medium text-foreground">
              every X minutes cron
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              weekday cron expression
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              run at midnight cron
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              Kubernetes schedule examples
            </strong>
            . This generator emphasizes clarity: you always see both the machine
            syntax and a short narrative you can paste into runbooks or tickets.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related free developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Browse the full{" "}
            <Link
              href="/#code-developer-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              code and developer tools
            </Link>{" "}
            section on the home page, or open a focused utility below.
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
            {cronGeneratorFaqItems.map((item) => (
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
