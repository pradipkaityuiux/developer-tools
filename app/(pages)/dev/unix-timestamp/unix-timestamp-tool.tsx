"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CopyIconButton } from "@/components/copy-icon-button";

type UnitMode = "auto" | "seconds" | "milliseconds";

function digitsOnlySigned(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (!/^-?\d+$/.test(t)) return null;
  return t;
}

function interpretUnixDigits(digits: string, mode: UnitMode): number | null {
  const absStr = digits.startsWith("-") ? digits.slice(1) : digits;
  const len = absStr.length;
  const n = Number(digits);
  if (!Number.isFinite(n)) return null;

  let ms: number;
  if (mode === "seconds") {
    ms = n * 1000;
  } else if (mode === "milliseconds") {
    ms = n;
  } else if (len <= 10) {
    ms = n * 1000;
  } else {
    ms = n;
  }

  if (!Number.isFinite(ms)) return null;
  if (ms > Number.MAX_SAFE_INTEGER || ms < Number.MIN_SAFE_INTEGER) return null;
  return ms;
}

function formatOutputs(ms: number): {
  localLong: string;
  utcIso: string;
  unixSec: string;
  unixMs: string;
} | null {
  if (!Number.isFinite(ms)) return null;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return null;

  const localLong = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(d);

  return {
    localLong,
    utcIso: d.toISOString(),
    unixSec: String(Math.floor(ms / 1000)),
    unixMs: String(ms),
  };
}

function copyFeedback(
  setHint: (s: string | null) => void,
  value: string,
) {
  void (async () => {
    try {
      await navigator.clipboard.writeText(value);
      setHint("Copied");
    } catch {
      setHint("Copy blocked — select manually");
    }
  })();
}

export function UnixTimestampTool() {
  const [unixInput, setUnixInput] = useState("1704067200");
  const [unitMode, setUnitMode] = useState<UnitMode>("auto");
  const [isoInput, setIsoInput] = useState("");
  const [localPicker, setLocalPicker] = useState("");
  const [copyHint, setCopyHint] = useState<string | null>(null);

  useEffect(() => {
    if (!copyHint) return;
    const t = window.setTimeout(() => setCopyHint(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyHint]);

  const unixParsed = useMemo(() => {
    const digits = digitsOnlySigned(unixInput);
    if (!digits) {
      return { ok: false as const, message: "Enter digits only (optional leading -)." };
    }
    const ms = interpretUnixDigits(digits, unitMode);
    if (ms === null) {
      return {
        ok: false as const,
        message: "Value is outside the safe range for this browser.",
      };
    }
    const out = formatOutputs(ms);
    if (!out) {
      return { ok: false as const, message: "Invalid date for that instant." };
    }
    return { ok: true as const, ms, ...out };
  }, [unixInput, unitMode]);

  const reverseParsed = useMemo(() => {
    const isoTrim = isoInput.trim();
    let d: Date | null = null;
    if (isoTrim) {
      d = new Date(isoTrim);
      if (Number.isNaN(d.getTime())) {
        return {
          ok: false as const,
          message: "ISO string did not parse. Try YYYY-MM-DDTHH:mm:ss.sssZ.",
        };
      }
    } else if (localPicker) {
      d = new Date(localPicker);
      if (Number.isNaN(d.getTime())) {
        return { ok: false as const, message: "Pick a valid local date and time." };
      }
    } else {
      return {
        ok: false as const,
        message: "Choose a local date/time or paste an ISO 8601 string.",
      };
    }
    const ms = d.getTime();
    return {
      ok: true as const,
      utcIso: d.toISOString(),
      localLong: new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeStyle: "long",
      }).format(d),
      unixSec: String(Math.floor(ms / 1000)),
      unixMs: String(ms),
    };
  }, [isoInput, localPicker]);

  const setNow = useCallback(() => {
    const s = Math.floor(Date.now() / 1000);
    setUnixInput(String(s));
    setUnitMode("seconds");
  }, []);

  const loadSampleMs = useCallback(() => {
    setUnixInput("1704067200000");
    setUnitMode("milliseconds");
  }, []);

  const fieldClass =
    "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div className="flex flex-col gap-10">
        <section aria-labelledby="unix-to-human-heading">
          <h2
            id="unix-to-human-heading"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Unix epoch → human-readable time
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Paste seconds, milliseconds, or use Auto (≤10 digit magnitude as
            seconds, longer as milliseconds).
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <label htmlFor="unix-input" className="text-sm font-medium text-foreground">
                Unix value
              </label>
              <input
                id="unix-input"
                type="text"
                inputMode="numeric"
                value={unixInput}
                onChange={(e) => setUnixInput(e.target.value)}
                className={fieldClass}
                placeholder="e.g. 1704067200 or 1704067200000"
                spellCheck={false}
                autoComplete="off"
              />
            </div>
            <fieldset className="flex flex-wrap gap-3 sm:pb-0.5">
              <legend className="sr-only">Unit</legend>
              {(
                [
                  ["auto", "Auto"],
                  ["seconds", "Seconds"],
                  ["milliseconds", "Milliseconds"],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
                >
                  <input
                    type="radio"
                    name="unit"
                    value={value}
                    checked={unitMode === value}
                    onChange={() => setUnitMode(value)}
                    className="border-zinc-300 text-zinc-900 dark:border-zinc-600"
                  />
                  {label}
                </label>
              ))}
            </fieldset>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={setNow}
              className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Use current time
            </button>
            <button
              type="button"
              onClick={loadSampleMs}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Load sample (ms)
            </button>
          </div>

          <div
            className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50/80 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/40"
            role="status"
            aria-live="polite"
          >
            {unixParsed.ok ? (
              <dl className="space-y-3 text-sm">
                {(
                  [
                    ["Local", unixParsed.localLong],
                    ["UTC (ISO 8601)", unixParsed.utcIso],
                    ["Unix seconds", unixParsed.unixSec],
                    ["Unix milliseconds", unixParsed.unixMs],
                  ] as const
                ).map(([label, val]) => (
                  <div key={label} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <dt className="shrink-0 font-medium text-zinc-700 dark:text-zinc-300">
                      {label}
                    </dt>
                    <dd className="flex min-w-0 flex-1 items-center justify-end gap-2">
                      <span className="break-all font-mono text-foreground">{val}</span>
                      <CopyIconButton
                        placement="inline"
                        copied={false}
                        onClick={() => copyFeedback(setCopyHint, val)}
                        title="Copy value"
                        aria-label="Copy value"
                      />
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-red-700 dark:text-red-400">{unixParsed.message}</p>
            )}
          </div>
        </section>

        <hr className="border-zinc-200 dark:border-zinc-800" />

        <section aria-labelledby="human-to-unix-heading">
          <h2
            id="human-to-unix-heading"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Date &amp; time → Unix epoch
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Pick a local date/time, or paste ISO 8601 (UTC with{" "}
            <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">Z</code> or an
            offset)—ISO overrides the picker when non-empty.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="local-dt" className="text-sm font-medium text-foreground">
                Local date &amp; time
              </label>
              <input
                id="local-dt"
                type="datetime-local"
                value={localPicker}
                onChange={(e) => setLocalPicker(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="iso-input" className="text-sm font-medium text-foreground">
                ISO 8601 (optional)
              </label>
              <input
                id="iso-input"
                type="text"
                value={isoInput}
                onChange={(e) => setIsoInput(e.target.value)}
                className={fieldClass}
                placeholder="2026-04-04T12:00:00.000Z"
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          </div>

          <div
            className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50/80 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/40"
            role="status"
            aria-live="polite"
          >
            {reverseParsed.ok ? (
              <dl className="space-y-3 text-sm">
                {(
                  [
                    ["Interpreted local display", reverseParsed.localLong],
                    ["UTC (ISO 8601)", reverseParsed.utcIso],
                    ["Unix seconds", reverseParsed.unixSec],
                    ["Unix milliseconds", reverseParsed.unixMs],
                  ] as const
                ).map(([label, val]) => (
                  <div key={label} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <dt className="shrink-0 font-medium text-zinc-700 dark:text-zinc-300">
                      {label}
                    </dt>
                    <dd className="flex min-w-0 flex-1 items-center justify-end gap-2">
                      <span className="break-all font-mono text-foreground">{val}</span>
                      <CopyIconButton
                        placement="inline"
                        copied={false}
                        onClick={() => copyFeedback(setCopyHint, val)}
                        title="Copy value"
                        aria-label="Copy value"
                      />
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-amber-800 dark:text-amber-200/90">
                {reverseParsed.message}
              </p>
            )}
          </div>
        </section>
      </div>

      {copyHint ? (
        <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400" role="status">
          {copyHint}
        </p>
      ) : null}
    </div>
  );
}
