"use client";

import { useMemo, useState, type ReactNode } from "react";

type FlagId = "g" | "i" | "m" | "s" | "u" | "y" | "d";

const FLAG_OPTIONS: { id: FlagId; label: string; hint: string }[] = [
  { id: "g", label: "g", hint: "Global — all matches" },
  { id: "i", label: "i", hint: "Ignore case" },
  { id: "m", label: "m", hint: "Multiline ^ $" },
  { id: "s", label: "s", hint: "Dotall — . matches newline" },
  { id: "u", label: "u", hint: "Unicode" },
  { id: "y", label: "y", hint: "Sticky" },
  { id: "d", label: "d", hint: "Indices" },
];

type RegexMatchRow = {
  index: number;
  full: string;
  numbered: string[];
  named: Record<string, string>;
};

function buildFlags(selected: Record<FlagId, boolean>): string {
  return FLAG_OPTIONS.filter((f) => selected[f.id])
    .map((f) => f.id)
    .join("");
}

function runRegex(
  pattern: string,
  flags: string,
  subject: string,
): { error: string | null; matches: RegexMatchRow[] } {
  let re: RegExp;
  try {
    re = new RegExp(pattern || "(?:)", flags);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { error: msg, matches: [] };
  }

  const matches: RegexMatchRow[] = [];

  if (re.global) {
    re.lastIndex = 0;
    try {
      for (const m of subject.matchAll(re)) {
        if (m.index === undefined) continue;
        const numbered = m.slice(1).map((v) => (v === undefined ? "" : String(v)));
        const named =
          m.groups !== undefined
            ? Object.fromEntries(
                Object.entries(m.groups).map(([k, v]) => [
                  k,
                  v === undefined ? "" : String(v),
                ]),
              )
            : {};
        matches.push({
          index: m.index,
          full: m[0],
          numbered,
          named,
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { error: msg, matches: [] };
    }
    return { error: null, matches };
  }

  re.lastIndex = 0;
  let m: RegExpExecArray | null;
  try {
    m = re.exec(subject);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { error: msg, matches: [] };
  }

  if (m) {
    const numbered = m.slice(1).map((v) => (v === undefined ? "" : String(v)));
    const named =
      m.groups !== undefined
        ? Object.fromEntries(
            Object.entries(m.groups).map(([k, v]) => [
              k,
              v === undefined ? "" : String(v),
            ]),
          )
        : {};
    matches.push({
      index: m.index,
      full: m[0],
      numbered,
      named,
    });
  }

  return { error: null, matches };
}

function HighlightedSubject({
  subject,
  matches,
}: {
  subject: string;
  matches: RegexMatchRow[];
}) {
  const nodes = useMemo(() => {
    if (!subject) return null;
    if (matches.length === 0) {
      return <span className="whitespace-pre-wrap break-all">{subject}</span>;
    }

    const spans: { start: number; end: number }[] = [];
    for (const m of matches) {
      const end = m.index + m.full.length;
      if (m.full.length === 0) {
        spans.push({ start: m.index, end: m.index });
        continue;
      }
      spans.push({ start: m.index, end });
    }

    spans.sort((a, b) => a.start - b.start);

    const merged: { start: number; end: number }[] = [];
    for (const s of spans) {
      const last = merged[merged.length - 1];
      if (!last || s.start > last.end) {
        merged.push({ ...s });
      } else {
        last.end = Math.max(last.end, s.end);
      }
    }

    const parts: ReactNode[] = [];
    let cursor = 0;
    let partId = 0;
    for (const span of merged) {
      if (span.start > cursor) {
        parts.push(
          <span key={partId++} className="whitespace-pre-wrap break-all">
            {subject.slice(cursor, span.start)}
          </span>,
        );
      }
      if (span.end > span.start) {
        parts.push(
          <mark
            key={partId++}
            className="rounded-sm bg-amber-200/90 px-0.5 text-foreground dark:bg-amber-500/35"
          >
            {subject.slice(span.start, span.end)}
          </mark>,
        );
      } else {
        parts.push(
          <span
            key={partId++}
            className="inline-block w-0 border-l-2 border-amber-500 align-baseline"
            title="Zero-width match"
          />
        );
      }
      cursor = Math.max(cursor, span.end);
      if (span.end === span.start && cursor < subject.length) {
        cursor = span.start + 1;
      }
    }
    if (cursor < subject.length) {
      parts.push(
        <span key={partId++} className="whitespace-pre-wrap break-all">
          {subject.slice(cursor)}
        </span>,
      );
    }

    return <>{parts}</>;
  }, [subject, matches]);

  return (
    <div className="max-h-64 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-sm dark:border-zinc-800 dark:bg-zinc-900/80">
      {nodes}
    </div>
  );
}

export function RegexTesterTool() {
  const [pattern, setPattern] = useState(String.raw`\b(\w+)\s+\1\b`);
  const [subject, setSubject] = useState(
    "The the quick brown fox jumps over the lazy dog.\nLine two: hello hello world.",
  );
  const [flags, setFlags] = useState<Record<FlagId, boolean>>({
    g: true,
    i: true,
    m: false,
    s: false,
    u: false,
    y: false,
    d: false,
  });

  const flagStr = buildFlags(flags);

  const { error, matches } = useMemo(
    () => runRegex(pattern, flagStr, subject),
    [pattern, flagStr, subject],
  );

  function toggleFlag(id: FlagId) {
    setFlags((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label
              htmlFor="regex-pattern"
              className="block text-sm font-medium text-foreground"
            >
              Regular expression pattern
            </label>
            <textarea
              id="regex-pattern"
              name="pattern"
              rows={4}
              spellCheck={false}
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder="Enter pattern (without delimiters)"
            />
            <fieldset className="mt-4">
              <legend className="text-sm font-medium text-foreground">Flags</legend>
              <div className="mt-2 flex flex-wrap gap-3">
                {FLAG_OPTIONS.map((f) => (
                  <label
                    key={f.id}
                    className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                  >
                    <input
                      type="checkbox"
                      checked={flags[f.id]}
                      onChange={() => toggleFlag(f.id)}
                      className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-900"
                    />
                    <span className="font-mono font-medium text-foreground">
                      {f.label}
                    </span>
                    <span className="hidden text-xs sm:inline">— {f.hint}</span>
                  </label>
                ))}
              </div>
              <p className="mt-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                Active flags:{" "}
                <span className="text-foreground">{flagStr || "(none)"}</span>
              </p>
            </fieldset>
          </div>

          <div>
            <label
              htmlFor="regex-subject"
              className="block text-sm font-medium text-foreground"
            >
              Test string (subject)
            </label>
            <textarea
              id="regex-subject"
              name="subject"
              rows={10}
              spellCheck={false}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              placeholder="Paste sample text to match against"
            />
          </div>
        </div>

        {error ? (
          <p
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            <strong className="font-medium">Pattern error:</strong> {error}
          </p>
        ) : null}

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-foreground">
            Highlighted matches
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Matches use a warm highlight; zero-width matches show a thin marker at
            the position.
          </p>
          <div className="mt-2">
            <HighlightedSubject subject={subject} matches={matches} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <h2 className="text-sm font-semibold text-foreground">Match list</h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {error
            ? "Fix the pattern to see matches."
            : matches.length === 0
              ? "No matches for the current pattern and subject."
              : `${matches.length} match${matches.length === 1 ? "" : "es"} found.`}
        </p>

        {!error && matches.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-2 pr-4 font-medium text-zinc-500 dark:text-zinc-400">
                    #
                  </th>
                  <th className="py-2 pr-4 font-medium text-zinc-500 dark:text-zinc-400">
                    Index
                  </th>
                  <th className="py-2 pr-4 font-medium text-zinc-500 dark:text-zinc-400">
                    Full match
                  </th>
                  <th className="py-2 font-medium text-zinc-500 dark:text-zinc-400">
                    Groups
                  </th>
                </tr>
              </thead>
              <tbody>
                {matches.map((row, i) => (
                  <tr
                    key={`${row.index}-${i}-${row.full}`}
                    className="border-b border-zinc-100 dark:border-zinc-800/80"
                  >
                    <td className="py-2.5 pr-4 align-top text-zinc-500 dark:text-zinc-400">
                      {i + 1}
                    </td>
                    <td className="py-2.5 pr-4 align-top font-mono text-xs text-foreground">
                      {row.index}
                    </td>
                    <td className="py-2.5 pr-4 align-top font-mono text-xs break-all text-foreground">
                      {row.full === "" ? (
                        <span className="text-zinc-400">(empty)</span>
                      ) : (
                        row.full
                      )}
                    </td>
                    <td className="py-2.5 align-top text-xs text-foreground">
                      {Object.keys(row.named).length > 0 ? (
                        <dl className="space-y-1">
                          {Object.entries(row.named).map(([k, v]) => (
                            <div key={k}>
                              <dt className="inline font-medium text-zinc-500 dark:text-zinc-400">
                                {k}:{" "}
                              </dt>
                              <dd className="inline font-mono break-all">
                                {v === "" ? (
                                  <span className="text-zinc-400">(empty)</span>
                                ) : (
                                  v
                                )}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      ) : row.numbered.length > 0 ? (
                        <ol className="list-decimal space-y-1 pl-4 font-mono">
                          {row.numbered.map((g, gi) => (
                            <li key={gi}>
                              {g === "" ? (
                                <span className="text-zinc-400">(empty)</span>
                              ) : (
                                g
                              )}
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
