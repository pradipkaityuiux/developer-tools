/** Escape a string for use inside a RegExp source (literal find mode). */
export function escapeRegExpLiteral(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export type FindReplaceMode = "literal" | "regex";

export type FindReplaceInput = {
  text: string;
  find: string;
  replace: string;
  mode: FindReplaceMode;
  /** When mode is literal: match exact casing. */
  literalCaseSensitive: boolean;
  /** When mode is regex: appended after we ensure global replace (g). */
  regexExtraFlags: string;
};

export type FindReplaceResult =
  | { ok: true; output: string; matchCount: number }
  | { ok: false; error: string; output: string; matchCount: 0 };

function normalizeRegexFlags(extra: string): string {
  const allowed = new Set(["i", "m", "s", "u", "y", "d"]);
  const out: string[] = ["g"];
  for (const ch of extra) {
    if (allowed.has(ch) && ch !== "g" && !out.includes(ch)) out.push(ch);
  }
  return out.join("");
}

export function performFindReplace(input: FindReplaceInput): FindReplaceResult {
  const { text, find, replace, mode, literalCaseSensitive, regexExtraFlags } =
    input;

  if (find === "") {
    return {
      ok: false,
      error: "Enter text or a pattern to find.",
      output: text,
      matchCount: 0,
    };
  }

  if (mode === "literal") {
    const flags = literalCaseSensitive ? "g" : "gi";
    let re: RegExp;
    try {
      re = new RegExp(escapeRegExpLiteral(find), flags);
    } catch {
      return {
        ok: false,
        error: "Could not build a search pattern from the find field.",
        output: text,
        matchCount: 0,
      };
    }
    const matches = text.match(re);
    const matchCount = matches?.length ?? 0;
    const output = text.replace(re, replace);
    return { ok: true, output, matchCount };
  }

  try {
    const flags = normalizeRegexFlags(regexExtraFlags);
    const re = new RegExp(find, flags);
    const matches = text.match(re);
    const matchCount = matches?.length ?? 0;
    const output = text.replace(re, replace);
    return { ok: true, output, matchCount };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid regular expression.";
    return {
      ok: false,
      error: msg,
      output: text,
      matchCount: 0,
    };
  }
}
