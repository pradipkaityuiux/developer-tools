"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";
import {
  analyzeRateLimit,
  formatDurationMinutes,
  formatReportText,
} from "@/lib/rate-limit-calculator-core";

const DEFAULT_RPM = 120;
const DEFAULT_DAILY = 50_000;

export function RateLimitCalculatorTool() {
  const rpmId = useId();
  const dailyId = useId();
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [requestsPerMinute, setRequestsPerMinute] = useState(String(DEFAULT_RPM));
  const [dailyQuota, setDailyQuota] = useState(String(DEFAULT_DAILY));
  const [fileError, setFileError] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);

  const parsed = useMemo(() => {
    const rpm = Number.parseFloat(requestsPerMinute.replace(/,/g, ""));
    const daily = Number.parseFloat(dailyQuota.replace(/,/g, ""));
    return {
      rpm: Number.isFinite(rpm) ? rpm : NaN,
      daily: Number.isFinite(daily) ? daily : NaN,
    };
  }, [requestsPerMinute, dailyQuota]);

  const result = useMemo(() => {
    if (!Number.isFinite(parsed.rpm) || !Number.isFinite(parsed.daily)) {
      return null;
    }
    return analyzeRateLimit({
      requestsPerMinute: parsed.rpm,
      dailyQuota: parsed.daily,
    });
  }, [parsed.rpm, parsed.daily]);

  const reportText = useMemo(
    () => (result ? formatReportText(result) : ""),
    [result],
  );

  async function copyReport() {
    if (!reportText) return;
    try {
      await navigator.clipboard.writeText(reportText);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setFileError("Clipboard blocked. Copy the summary manually.");
      setTimeout(() => setFileError(null), 4000);
    }
  }

  function onUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const body = typeof reader.result === "string" ? reader.result : "";
      try {
        const data = JSON.parse(body) as {
          requestsPerMinute?: unknown;
          dailyQuota?: unknown;
        };
        if (typeof data.requestsPerMinute === "number") {
          setRequestsPerMinute(String(data.requestsPerMinute));
        }
        if (typeof data.dailyQuota === "number") {
          setDailyQuota(String(data.dailyQuota));
        }
        if (
          typeof data.requestsPerMinute !== "number" &&
          typeof data.dailyQuota !== "number"
        ) {
          setFileError(
            'Expected JSON with numeric "requestsPerMinute" and/or "dailyQuota".',
          );
        }
      } catch {
        setFileError("Invalid JSON. Use an object like {\"requestsPerMinute\":120,\"dailyQuota\":50000}.");
      }
    };
    reader.onerror = () => setFileError("Could not read the file.");
    reader.readAsText(file);
    e.target.value = "";
  }

  const invalid =
    !Number.isFinite(parsed.rpm) ||
    !Number.isFinite(parsed.daily) ||
    parsed.rpm < 0 ||
    parsed.daily < 0;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium text-foreground">Inputs</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Enter your target sustained{" "}
              <strong className="font-medium text-foreground">requests per minute</strong>{" "}
              and your provider&apos;s{" "}
              <strong className="font-medium text-foreground">daily call budget</strong>{" "}
              (calls allowed per 24 hours).
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <input
              id={fileId}
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={onUploadFile}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <Upload className="size-4 shrink-0" aria-hidden />
              Load JSON
            </button>
            <button
              type="button"
              disabled={!result || invalid}
              onClick={copyReport}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              {copyDone ? (
                <Check className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
              ) : (
                <Copy className="size-4 shrink-0" aria-hidden />
              )}
              {copyDone ? "Copied" : "Copy report"}
            </button>
          </div>
        </div>

        {fileError ? (
          <p className="text-sm text-amber-700 dark:text-amber-400" role="status">
            {fileError}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={rpmId} className="block text-sm font-medium text-foreground">
              Requests per minute (RPM)
            </label>
            <input
              id={rpmId}
              inputMode="decimal"
              value={requestsPerMinute}
              onChange={(e) => {
                setRequestsPerMinute(e.target.value);
                setFileError(null);
              }}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400/30 focus:border-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-950 dark:focus:border-zinc-500"
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor={dailyId} className="block text-sm font-medium text-foreground">
              Daily quota (calls / 24h)
            </label>
            <input
              id={dailyId}
              inputMode="decimal"
              value={dailyQuota}
              onChange={(e) => {
                setDailyQuota(e.target.value);
                setFileError(null);
              }}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400/30 focus:border-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-950 dark:focus:border-zinc-500"
              autoComplete="off"
            />
          </div>
        </div>

        {invalid ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Enter non-negative numbers for both fields.
          </p>
        ) : result ? (
          <div className="space-y-4 rounded-lg border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/40">
            <h3 className="text-sm font-semibold text-foreground">Pacing summary</h3>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-md border border-zinc-200/80 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950">
                <dt className="text-zinc-500 dark:text-zinc-400">
                  Average RPM to use full daily quota evenly
                </dt>
                <dd className="mt-1 font-mono text-base font-medium text-foreground">
                  {result.dailyQuota === 0
                    ? "—"
                    : result.averageRpmForDailyQuota.toLocaleString(undefined, {
                        maximumFractionDigits: 4,
                      })}
                </dd>
              </div>
              <div className="rounded-md border border-zinc-200/80 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950">
                <dt className="text-zinc-500 dark:text-zinc-400">
                  Projected daily calls at current RPM
                </dt>
                <dd className="mt-1 font-mono text-base font-medium text-foreground">
                  {Math.round(result.projectedDailyAtCurrentRpm).toLocaleString()}
                </dd>
              </div>
              <div className="rounded-md border border-zinc-200/80 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950 sm:col-span-2">
                <dt className="text-zinc-500 dark:text-zinc-400">
                  Versus daily quota
                </dt>
                <dd className="mt-1 font-mono text-base font-medium text-foreground">
                  {result.dailyQuota === 0 ? (
                    "Set a daily quota to compare."
                  ) : (
                    <>
                      {result.deltaVersusDailyQuota >= 0 ? "+" : ""}
                      {Math.round(result.deltaVersusDailyQuota).toLocaleString()} calls{" "}
                      <span className="text-zinc-500 dark:text-zinc-400">
                        (
                        {result.exceedsDailyQuota
                          ? "over budget if sustained all day"
                          : "under budget if sustained all day"}
                        )
                      </span>
                    </>
                  )}
                </dd>
              </div>
              {result.exceedsDailyQuota &&
              result.minutesUntilBudgetExhausted != null ? (
                <div className="rounded-md border border-amber-200/90 bg-amber-50 px-3 py-2 dark:border-amber-900/60 dark:bg-amber-950/40 sm:col-span-2">
                  <dt className="text-amber-900 dark:text-amber-200">
                    Time until daily budget exhausted at this RPM
                  </dt>
                  <dd className="mt-1 font-mono text-base font-semibold text-amber-950 dark:text-amber-100">
                    {formatDurationMinutes(result.minutesUntilBudgetExhausted)} (
                    {result.minutesUntilBudgetExhausted.toFixed(2)} min)
                  </dd>
                </div>
              ) : null}
              {result.dailyQuota > 0 && !result.exceedsDailyQuota ? (
                <div className="rounded-md border border-emerald-200/90 bg-emerald-50 px-3 py-2 dark:border-emerald-900/60 dark:bg-emerald-950/40 sm:col-span-2">
                  <dt className="text-emerald-900 dark:text-emerald-200">
                    Daily wall (steady RPM)
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-emerald-950 dark:text-emerald-100">
                    At this RPM you do not exceed the daily quota over a full 24h
                    window. Consider burst limits separately if your provider also
                    caps short windows.
                  </dd>
                </div>
              ) : null}
              <div className="rounded-md border border-zinc-200/80 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950">
                <dt className="text-zinc-500 dark:text-zinc-400">
                  Even spacing at quota pace (optional)
                </dt>
                <dd className="mt-1 font-mono text-base text-foreground">
                  {result.secondsBetweenRequestsAtAveragePace != null
                    ? `${result.secondsBetweenRequestsAtAveragePace.toFixed(3)}s between requests`
                    : "—"}
                </dd>
              </div>
              <div className="rounded-md border border-zinc-200/80 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950">
                <dt className="text-zinc-500 dark:text-zinc-400">
                  Even spacing at current RPM
                </dt>
                <dd className="mt-1 font-mono text-base text-foreground">
                  {result.secondsBetweenRequestsAtCurrentRpm != null
                    ? `${result.secondsBetweenRequestsAtCurrentRpm.toFixed(3)}s between requests`
                    : "—"}
                </dd>
              </div>
            </dl>

            <div>
              <h4 className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Text report
              </h4>
              <pre className="mt-2 max-h-48 overflow-auto rounded-md border border-zinc-200 bg-white p-3 font-mono text-xs leading-relaxed text-foreground dark:border-zinc-700 dark:bg-zinc-950">
                {reportText}
              </pre>
            </div>
          </div>
        ) : null}

        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Load JSON format:{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
            {`{"requestsPerMinute":120,"dailyQuota":50000}`}
          </code>
        </p>
      </div>
    </div>
  );
}
