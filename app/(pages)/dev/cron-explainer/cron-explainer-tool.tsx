"use client";

import { useMemo, useState } from "react";
import {
  explainCron,
  nextCronRuns,
  splitCronExpression,
} from "@/lib/cron-explainer-core";

const SAMPLE = "0 9 * * 1-5";

const FIELD_LABELS = [
  "Minute (0–59)",
  "Hour (0–23)",
  "Day of month (1–31)",
  "Month (1–12 or JAN–DEC)",
  "Day of week (0–7, SUN–SAT; 0/7 = Sunday)",
] as const;

export function CronExplainerTool() {
  const [text, setText] = useState(SAMPLE);

  const trimmed = text.trim();
  const explain = useMemo(() => explainCron(trimmed), [trimmed]);
  const parts = useMemo(() => splitCronExpression(trimmed), [trimmed]);

  const from = useMemo(() => new Date(), []);
  const nextRuns = useMemo(() => {
    if (!explain.ok) return null;
    return nextCronRuns(trimmed, from, 12);
  }, [trimmed, explain, from]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="cron-input"
            className="block text-sm font-medium text-foreground"
          >
            Cron expression (5 fields)
          </label>
          <textarea
            id="cron-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            rows={3}
            className="mt-1.5 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            placeholder="0 9 * * 1-5"
          />
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            Order: minute · hour · day-of-month · month · day-of-week. One space
            between fields.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setText("")}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setText(SAMPLE)}
            className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Load sample
          </button>
        </div>

        {!trimmed ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
            Paste a cron expression or load the sample.
          </p>
        ) : !explain.ok ? (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            <p className="font-medium">Could not parse cron</p>
            <p className="mt-1 font-mono text-xs break-all opacity-90">
              {explain.error}
            </p>
          </div>
        ) : (
          <>
            <div
              className="rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200"
              role="status"
            >
              <p className="font-medium">Valid 5-field cron</p>
            </div>

            {parts ? (
              <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full min-w-[280px] text-left text-sm">
                  <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80">
                    <tr>
                      <th className="px-3 py-2 font-medium text-foreground">
                        Field
                      </th>
                      <th className="px-3 py-2 font-medium text-foreground">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {parts.map((p, i) => (
                      <tr key={FIELD_LABELS[i]}>
                        <td className="px-3 py-2 text-zinc-600 dark:text-zinc-400">
                          {FIELD_LABELS[i]}
                        </td>
                        <td className="px-3 py-2 font-mono text-foreground">
                          {p}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            <div>
              <h3 className="text-sm font-medium text-foreground">
                Plain-language summary
              </h3>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {explain.human.map((line, i) => (
                  <li key={i} className="text-foreground">
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            {explain.warnings.length > 0 ? (
              <div
                className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/35 dark:text-amber-100"
                role="note"
              >
                <p className="font-medium">Heads-up</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {explain.warnings.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div>
              <h3 className="text-sm font-medium text-foreground">
                Next run times (local)
              </h3>
              {nextRuns && !nextRuns.ok ? (
                <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                  {nextRuns.error}
                </p>
              ) : nextRuns && nextRuns.ok ? (
                <ol className="mt-2 list-decimal space-y-1 pl-5 font-mono text-sm text-zinc-700 dark:text-zinc-300">
                  {nextRuns.runs.map((d) => (
                    <li key={d.toISOString()}>
                      {d.toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </li>
                  ))}
                </ol>
              ) : null}
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                Calculated from when you loaded or changed this page; refresh to
                re-anchor “now.” Uses your device timezone.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
