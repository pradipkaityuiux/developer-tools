/**
 * Unix/Vixie-style 5-field cron: minute hour day-of-month month day-of-week.
 * When both DOM and DOW are restricted (not *), a time matches if either field matches (OR).
 */

const MONTH_NAMES: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

const DOW_NAMES: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

export type CronExplainResult =
  | { ok: true; parts: string[]; human: string[]; warnings: string[] }
  | { ok: false; error: string };

export type CronNextRunsResult =
  | { ok: true; runs: Date[] }
  | { ok: false; error: string };

function normalizePart(p: string): string {
  return p.trim().toLowerCase();
}

function parseIntStrict(s: string): number | null {
  const n = parseInt(s, 10);
  if (!Number.isFinite(n) || String(n) !== s) return null;
  return n;
}

/** Expand one cron field into a sorted unique set of allowed values. */
function expandField(
  raw: string,
  min: number,
  max: number,
  aliases: Record<string, number> | null,
  fieldLabel: string,
): { values: Set<number> | null; isStar: boolean; error?: string } {
  const part = normalizePart(raw);
  if (part === "" || part === "?")
    return { error: `Empty or unsupported token in ${fieldLabel}`, values: null, isStar: false };
  if (part === "*") return { values: null, isStar: true };

  const values = new Set<number>();
  const segments = part.split(",");

  for (const seg of segments) {
    const s = seg.trim();
    if (!s) return { error: `Invalid empty segment in ${fieldLabel}`, values: null, isStar: false };

    if (s.includes("/")) {
      const [rangePart, stepStr] = s.split("/");
      const step = parseIntStrict(stepStr.trim());
      if (step === null || step < 1)
        return { error: `Invalid step in ${fieldLabel}: ${s}`, values: null, isStar: false };

      let start = min;
      let end = max;
      if (rangePart === "*") {
        // */n
      } else if (rangePart.includes("-")) {
        const [a, b] = rangePart.split("-");
        const lo = resolveToken(a.trim(), min, max, aliases);
        const hi = resolveToken(b.trim(), min, max, aliases);
        if (lo === null || hi === null)
          return { error: `Invalid range in ${fieldLabel}: ${s}`, values: null, isStar: false };
        start = lo;
        end = hi;
      } else {
        const single = resolveToken(rangePart.trim(), min, max, aliases);
        if (single === null)
          return { error: `Invalid value in ${fieldLabel}: ${s}`, values: null, isStar: false };
        start = single;
        end = max;
      }

      for (let v = start; v <= end; v += step) {
        if (v < min || v > max)
          return { error: `Value out of range in ${fieldLabel}: ${v}`, values: null, isStar: false };
        values.add(v);
      }
      continue;
    }

    if (s.includes("-")) {
      const [a, b] = s.split("-");
      const lo = resolveToken(a.trim(), min, max, aliases);
      const hi = resolveToken(b.trim(), min, max, aliases);
      if (lo === null || hi === null)
        return { error: `Invalid range in ${fieldLabel}: ${s}`, values: null, isStar: false };
      if (lo > hi)
        return { error: `Range low > high in ${fieldLabel}: ${s}`, values: null, isStar: false };
      for (let v = lo; v <= hi; v++) values.add(v);
      continue;
    }

    const v = resolveToken(s, min, max, aliases);
    if (v === null) return { error: `Invalid value in ${fieldLabel}: ${s}`, values: null, isStar: false };
    values.add(v);
  }

  return { values, isStar: false };
}

function resolveToken(
  token: string,
  min: number,
  max: number,
  aliases: Record<string, number> | null,
): number | null {
  const n = parseIntStrict(token);
  if (n !== null) {
    if (n < min || n > max) return null;
    return n;
  }
  const key = token.toLowerCase();
  if (aliases && key in aliases) {
    const v = aliases[key]!;
    if (v < min || v > max) return null;
    return v;
  }
  return null;
}

function expandDow(raw: string): { values: Set<number> | null; isStar: boolean; error?: string } {
  const part = normalizePart(raw);
  if (part === "*") return { values: null, isStar: true };
  // Normalize 7 -> 0 for Sunday in sets
  const base = expandField(raw, 0, 7, DOW_NAMES, "day-of-week");
  if (base.error || base.isStar || !base.values) return base;
  const normalized = new Set<number>();
  for (const v of base.values) {
    normalized.add(v === 7 ? 0 : v);
  }
  return { values: normalized, isStar: false };
}

export function splitCronExpression(expr: string): string[] | null {
  const parts = expr.trim().split(/\s+/).filter(Boolean);
  if (parts.length !== 5) return null;
  return parts;
}

type ParsedCron = {
  minute: { star: boolean; set: Set<number> | null };
  hour: { star: boolean; set: Set<number> | null };
  dom: { star: boolean; set: Set<number> | null };
  month: { star: boolean; set: Set<number> | null };
  dow: { star: boolean; set: Set<number> | null };
};

function parseCron(expr: string): { ok: true; parsed: ParsedCron } | { ok: false; error: string } {
  const parts = splitCronExpression(expr);
  if (!parts)
    return {
      ok: false,
      error:
        "Expected exactly 5 fields: minute hour day-of-month month day-of-week (space-separated).",
    };

  const m = expandField(parts[0]!, 0, 59, null, "minute");
  if (m.error) return { ok: false, error: m.error };
  const h = expandField(parts[1]!, 0, 23, null, "hour");
  if (h.error) return { ok: false, error: h.error };
  const dom = expandField(parts[2]!, 1, 31, null, "day-of-month");
  if (dom.error) return { ok: false, error: dom.error };
  const mo = expandField(parts[3]!, 1, 12, MONTH_NAMES, "month");
  if (mo.error) return { ok: false, error: mo.error };
  const dow = expandDow(parts[4]!);
  if (dow.error) return { ok: false, error: dow.error };

  return {
    ok: true,
    parsed: {
      minute: { star: m.isStar, set: m.values },
      hour: { star: h.isStar, set: h.values },
      dom: { star: dom.isStar, set: dom.values },
      month: { star: mo.isStar, set: mo.values },
      dow: { star: dow.isStar, set: dow.values },
    },
  };
}

function matchesValue(star: boolean, set: Set<number> | null, v: number): boolean {
  if (star) return true;
  return set?.has(v) ?? false;
}

/** Vixie: if both DOM and DOW restricted, match if either matches. */
function matchesDomDow(
  parsed: ParsedCron,
  dayOfMonth: number,
  dayOfWeek: number,
): boolean {
  const domR = !parsed.dom.star;
  const dowR = !parsed.dow.star;
  const domOk = matchesValue(parsed.dom.star, parsed.dom.set, dayOfMonth);
  const dowOk = matchesValue(parsed.dow.star, parsed.dow.set, dayOfWeek);
  if (domR && dowR) return domOk || dowOk;
  if (domR) return domOk;
  if (dowR) return dowOk;
  return true;
}

function matchesDateTime(parsed: ParsedCron, d: Date): boolean {
  const minute = d.getMinutes();
  const hour = d.getHours();
  const dom = d.getDate();
  const month = d.getMonth() + 1;
  const dow = d.getDay();

  if (!matchesValue(parsed.minute.star, parsed.minute.set, minute)) return false;
  if (!matchesValue(parsed.hour.star, parsed.hour.set, hour)) return false;
  if (!matchesValue(parsed.month.star, parsed.month.set, month)) return false;
  if (!matchesDomDow(parsed, dom, dow)) return false;
  return true;
}

function describeList(values: number[], singular: string, plural: string): string {
  if (values.length === 0) return "";
  if (values.length <= 3) return values.join(", ");
  return `${values.slice(0, 3).join(", ")}, … (${values.length} ${plural})`;
}

function dowName(d: number): string {
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d] ?? String(d);
}

function minutePhrase(parsed: ParsedCron): string {
  if (parsed.minute.star) return "every minute";
  const arr = [...(parsed.minute.set ?? [])].sort((a, b) => a - b);
  if (arr.length === 1) return `minute ${arr[0]}`;
  return `minutes ${describeList(arr, "minute", "values")}`;
}

function hourPhrase(parsed: ParsedCron): string {
  if (parsed.hour.star) return "every hour";
  const arr = [...(parsed.hour.set ?? [])].sort((a, b) => a - b);
  if (arr.length === 1) return `hour ${arr[0]} (24-hour clock)`;
  return `hours ${describeList(arr, "hour", "values")} (24h)`;
}

export function explainCron(expr: string): CronExplainResult {
  const r = parseCron(expr);
  if (!r.ok) return { ok: false, error: r.error };
  const { parsed } = r;

  const parts = splitCronExpression(expr)!;
  const human: string[] = [];
  const warnings: string[] = [];

  if (parsed.minute.star && parsed.hour.star) {
    human.push("Runs at every minute boundary (all hours, all days that match the calendar rules below).");
  } else if (parsed.minute.star && !parsed.hour.star) {
    human.push(
      `Runs every minute during ${hourPhrase(parsed)} (when the date rules below match).`,
    );
  } else if (!parsed.minute.star && parsed.hour.star) {
    human.push(
      `Runs at ${minutePhrase(parsed)} past the hour, every hour (when the date rules below match).`,
    );
  } else {
    human.push(
      `Runs when the clock shows ${minutePhrase(parsed)} and ${hourPhrase(parsed)} (when the date rules below match).`,
    );
  }

  const domR = !parsed.dom.star;
  const dowR = !parsed.dow.star;
  if (domR && dowR) {
    const domArr = [...(parsed.dom.set ?? [])].sort((a, b) => a - b);
    const dowArr = [...(parsed.dow.set ?? [])].sort((a, b) => a - b);
    human.push(
      `Calendar filter: on day-of-month ${describeList(domArr, "day", "days")} or on ${dowArr.map(dowName).join(", ")} (standard cron OR—either condition can trigger).`,
    );
    warnings.push(
      "Both day-of-month and day-of-week are set: most cron daemons run when either field matches, not when both match.",
    );
  } else if (domR) {
    const domArr = [...(parsed.dom.set ?? [])].sort((a, b) => a - b);
    human.push(`Calendar filter: day(s) of month ${describeList(domArr, "day", "days")}.`);
  } else if (dowR) {
    const dowArr = [...(parsed.dow.set ?? [])].sort((a, b) => a - b);
    human.push(`Calendar filter: ${dowArr.map(dowName).join(", ")}.`);
  } else {
    human.push("Calendar filter: any day of the month and any weekday.");
  }

  if (parsed.month.star) {
    human.push("Month filter: January through December (all months).");
  } else {
    const moArr = [...(parsed.month.set ?? [])].sort((a, b) => a - b);
    human.push(`Month filter: ${describeList(moArr, "month", "months")}.`);
  }

  return { ok: true, parts, human, warnings };
}

const MAX_ITER = 2_500_000;

export function nextCronRuns(expr: string, from: Date, count: number): CronNextRunsResult {
  const r = parseCron(expr);
  if (!r.ok) return { ok: false, error: r.error };
  const { parsed } = r;

  const runs: Date[] = [];
  const start = new Date(from);
  start.setSeconds(0, 0);
  start.setMilliseconds(0);
  // Move to next minute if we're mid-minute and `from` was exact? Include current minute if it matches.
  let cur = new Date(start);
  let iter = 0;

  while (runs.length < count && iter < MAX_ITER) {
    iter++;
    if (matchesDateTime(parsed, cur)) {
      runs.push(new Date(cur));
    }
    cur = new Date(cur.getTime() + 60_000);
  }

  if (runs.length < count && iter >= MAX_ITER)
    return {
      ok: false,
      error:
        "Could not find enough upcoming runs within search limits—try a less restrictive expression.",
    };

  return { ok: true, runs };
}
