"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type CronFields,
  CRON_PRESETS,
  buildCronString,
  describeCron,
} from "@/lib/cron-generator-core";

function rangeSelectOptions(
  from: number,
  to: number,
  starLabel = "Every (*)",
): { value: string; label: string }[] {
  const opts: { value: string; label: string }[] = [
    { value: "*", label: starLabel },
  ];
  for (let i = from; i <= to; i++) {
    opts.push({ value: String(i), label: String(i) });
  }
  return opts;
}

const MINUTE_EXTRA: { value: string; label: string }[] = [
  { value: "*/5", label: "Every 5 min (*/5)" },
  { value: "*/10", label: "Every 10 min (*/10)" },
  { value: "*/15", label: "Every 15 min (*/15)" },
  { value: "*/30", label: "Every 30 min (*/30)" },
];

const DOW_OPTIONS: { value: string; label: string }[] = [
  { value: "*", label: "Any day (*)" },
  { value: "1-5", label: "Weekdays Mon–Fri (1-5)" },
  { value: "0", label: "Sunday (0)" },
  { value: "1", label: "Monday (1)" },
  { value: "2", label: "Tuesday (2)" },
  { value: "3", label: "Wednesday (3)" },
  { value: "4", label: "Thursday (4)" },
  { value: "5", label: "Friday (5)" },
  { value: "6", label: "Saturday (6)" },
];

const MONTH_OPTIONS: { value: string; label: string }[] = [
  { value: "*", label: "Every month (*)" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const DEFAULT_FIELDS: CronFields = {
  minute: "0",
  hour: "9",
  dom: "*",
  month: "*",
  dow: "1-5",
};

export function CronGeneratorTool() {
  const [fields, setFields] = useState<CronFields>(DEFAULT_FIELDS);
  const [copyHint, setCopyHint] = useState<string | null>(null);

  const cronLine = useMemo(() => buildCronString(fields), [fields]);
  const description = useMemo(() => describeCron(fields), [fields]);

  useEffect(() => {
    if (!copyHint) return;
    const t = window.setTimeout(() => setCopyHint(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyHint]);

  function setField<K extends keyof CronFields>(key: K, value: CronFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function copyCron() {
    try {
      await navigator.clipboard.writeText(cronLine);
      setCopyHint("Cron copied to clipboard");
    } catch {
      setCopyHint("Copy blocked — select the expression manually");
    }
  }

  const hourOpts = rangeSelectOptions(0, 23, "Every hour (*)");
  const domOpts = rangeSelectOptions(1, 31, "Every day (*)");

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-sm font-medium text-foreground">Quick presets</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Tap a preset to load common schedules; then fine-tune the fields
            below.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CRON_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setFields({ ...p.fields })}
                className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800 sm:text-sm"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Minute</span>
            <select
              value={fields.minute}
              onChange={(e) => setField("minute", e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            >
              <option value="*">Every minute (*)</option>
              {MINUTE_EXTRA.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
              {Array.from({ length: 60 }, (_, i) => String(i)).map((m) => (
                <option key={m} value={m}>
                  :{pad2(m)} (minute {m})
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Hour</span>
            <select
              value={fields.hour}
              onChange={(e) => setField("hour", e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            >
              {hourOpts.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.value === "*" ? o.label : `${o.value}:00 (24h)`}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">
              Day of month
            </span>
            <select
              value={fields.dom}
              onChange={(e) => setField("dom", e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            >
              {domOpts.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Month</span>
            <select
              value={fields.month}
              onChange={(e) => setField("month", e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            >
              {MONTH_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
            <span className="text-sm font-medium text-foreground">
              Day of week
            </span>
            <select
              value={fields.dow}
              onChange={(e) => setField("dow", e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-600"
            >
              {DOW_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Cron expression
              </span>
              <p className="mt-1 break-all font-mono text-base font-medium text-foreground sm:text-lg">
                {cronLine}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
            </div>
            <button
              type="button"
              onClick={copyCron}
              className="shrink-0 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Copy expression
            </button>
          </div>
          {copyHint ? (
            <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
              {copyHint}
            </p>
          ) : null}
          <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
            Order: minute · hour · day-of-month · month · day-of-week. Confirm
            field order and time zone with your scheduler (Linux crontab,
            Kubernetes, GitHub Actions, AWS, etc.).
          </p>
        </div>
      </div>
    </div>
  );
}

function pad2(s: string): string {
  return s.length >= 2 ? s : `0${s}`;
}
