export type BlankLinesMode = "keep" | "collapse" | "remove";

export type WhitespaceRemoverOptions = {
  trimDocument: boolean;
  trimEachLine: boolean;
  collapseHorizontal: boolean;
  blankLines: BlankLinesMode;
};

const HORIZONTAL_RUN = /[\t \u00a0]+/g;

/**
 * Split on common newline sequences (CRLF, LF, CR).
 */
export function splitLines(text: string): string[] {
  return text.split(/\r\n|\r|\n/);
}

/**
 * Trim document edges, optionally trim each line, collapse horizontal runs of
 * spaces/tabs/NBSP, and adjust blank-line runs per blankLines mode.
 */
export function normalizeWhitespace(
  text: string,
  opts: WhitespaceRemoverOptions,
): string {
  let lines = splitLines(text).map((line) => {
    let s = line;
    if (opts.collapseHorizontal) {
      s = s.replace(HORIZONTAL_RUN, " ");
    }
    if (opts.trimEachLine) {
      s = s.trim();
    }
    return s;
  });

  if (opts.blankLines === "remove") {
    lines = lines.filter((l) => l.length > 0);
  } else if (opts.blankLines === "collapse") {
    const compressed: string[] = [];
    let prevEmpty = false;
    for (const line of lines) {
      const empty = line.length === 0;
      if (empty) {
        if (!prevEmpty) compressed.push("");
        prevEmpty = true;
      } else {
        compressed.push(line);
        prevEmpty = false;
      }
    }
    lines = compressed;
  }

  let result = lines.join("\n");
  if (opts.trimDocument) {
    result = result.trim();
  }
  return result;
}
