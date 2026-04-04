/** Minutes in a 24-hour calendar day (used for daily quota math). */
export const MINUTES_PER_DAY = 1440;

export type RateLimitInputs = {
  requestsPerMinute: number;
  dailyQuota: number;
};

export type RateLimitResult = {
  requestsPerMinute: number;
  dailyQuota: number;
  /** Average requests/minute to consume the full daily quota evenly across 24h. */
  averageRpmForDailyQuota: number;
  /** If you sustained `requestsPerMinute` for a full day, total calls. */
  projectedDailyAtCurrentRpm: number;
  /** `projectedDailyAtCurrentRpm - dailyQuota` (negative = under budget). */
  deltaVersusDailyQuota: number;
  /** True when sustained RPM would exceed the daily cap. */
  exceedsDailyQuota: boolean;
  /** Minutes until the daily budget is exhausted at this RPM, if RPM > 0 and would exceed quota; otherwise null. */
  minutesUntilBudgetExhausted: number | null;
  /** Even spacing between requests (seconds) at `averageRpmForDailyQuota`. */
  secondsBetweenRequestsAtAveragePace: number | null;
  /** Even spacing between requests (seconds) at current RPM. */
  secondsBetweenRequestsAtCurrentRpm: number | null;
};

function clampNonNegative(n: number): number {
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

export function analyzeRateLimit(inputs: RateLimitInputs): RateLimitResult | null {
  const rpm = clampNonNegative(inputs.requestsPerMinute);
  const daily = clampNonNegative(inputs.dailyQuota);

  if (daily === 0 && rpm === 0) {
    return {
      requestsPerMinute: rpm,
      dailyQuota: daily,
      averageRpmForDailyQuota: 0,
      projectedDailyAtCurrentRpm: 0,
      deltaVersusDailyQuota: 0,
      exceedsDailyQuota: false,
      minutesUntilBudgetExhausted: null,
      secondsBetweenRequestsAtAveragePace: null,
      secondsBetweenRequestsAtCurrentRpm: null,
    };
  }

  const averageRpmForDailyQuota =
    daily > 0 ? daily / MINUTES_PER_DAY : 0;
  const projectedDailyAtCurrentRpm = rpm * MINUTES_PER_DAY;
  const deltaVersusDailyQuota = projectedDailyAtCurrentRpm - daily;
  const exceedsDailyQuota = projectedDailyAtCurrentRpm > daily && daily > 0;

  let minutesUntilBudgetExhausted: number | null = null;
  if (daily > 0 && rpm > 0 && exceedsDailyQuota) {
    minutesUntilBudgetExhausted = daily / rpm;
  }

  const secondsBetweenRequestsAtAveragePace =
    averageRpmForDailyQuota > 0 ? 60 / averageRpmForDailyQuota : null;
  const secondsBetweenRequestsAtCurrentRpm =
    rpm > 0 ? 60 / rpm : null;

  return {
    requestsPerMinute: rpm,
    dailyQuota: daily,
    averageRpmForDailyQuota,
    projectedDailyAtCurrentRpm,
    deltaVersusDailyQuota,
    exceedsDailyQuota,
    minutesUntilBudgetExhausted,
    secondsBetweenRequestsAtAveragePace,
    secondsBetweenRequestsAtCurrentRpm,
  };
}

export function formatDurationMinutes(totalMinutes: number): string {
  if (!Number.isFinite(totalMinutes) || totalMinutes < 0) return "—";
  const totalSeconds = Math.round(totalMinutes * 60);
  if (totalSeconds < 1) return "<1s";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 && h === 0 && m === 0) parts.push(`${s}s`);
  else if (s > 0 && h + m > 0) parts.push(`${s}s`);
  return parts.join(" ") || "0s";
}

export function formatReportText(result: RateLimitResult): string {
  const lines: string[] = [
    "API rate limit pacing summary",
    "—",
    `Requests per minute (input): ${result.requestsPerMinute}`,
    `Daily quota (calls / 24h): ${result.dailyQuota}`,
    `Average RPM to use full daily quota evenly: ${result.averageRpmForDailyQuota.toFixed(4)}`,
    `Projected daily calls at current RPM: ${result.projectedDailyAtCurrentRpm}`,
  ];
  if (result.dailyQuota > 0) {
    lines.push(
      `Versus daily quota: ${result.deltaVersusDailyQuota >= 0 ? "+" : ""}${Math.round(result.deltaVersusDailyQuota)} calls`,
    );
  }
  if (result.exceedsDailyQuota && result.minutesUntilBudgetExhausted != null) {
    lines.push(
      `Time until daily budget exhausted at this RPM: ${formatDurationMinutes(result.minutesUntilBudgetExhausted)} (${result.minutesUntilBudgetExhausted.toFixed(2)} min)`,
    );
  } else if (result.dailyQuota > 0 && !result.exceedsDailyQuota) {
    lines.push(
      "At this RPM you stay within the daily quota if sustained all day.",
    );
  }
  if (result.secondsBetweenRequestsAtAveragePace != null) {
    lines.push(
      `Even pacing for daily quota: ~${result.secondsBetweenRequestsAtAveragePace.toFixed(3)}s between requests`,
    );
  }
  if (result.secondsBetweenRequestsAtCurrentRpm != null) {
    lines.push(
      `Even pacing at current RPM: ~${result.secondsBetweenRequestsAtCurrentRpm.toFixed(3)}s between requests`,
    );
  }
  return lines.join("\n");
}
