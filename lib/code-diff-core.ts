export type DiffChunk =
  | { type: "equal"; line: string }
  | { type: "delete"; line: string }
  | { type: "insert"; line: string };

/** Keeps peak memory predictable for browser tabs (flat LCS table). */
export const CODE_DIFF_MAX_LINES = 2000;

export type CodeDiffResult =
  | { ok: true; chunks: DiffChunk[] }
  | { ok: false; error: string };

function splitLines(text: string): string[] {
  return text.replace(/\r\n/g, "\n").split("\n");
}

/**
 * Line-based diff using longest-common-subsequence length table and backtracking.
 * Highlights unchanged lines, deletions (left), and insertions (right) for reviews.
 */
export function computeLineDiff(oldText: string, newText: string): CodeDiffResult {
  const a = splitLines(oldText);
  const b = splitLines(newText);
  if (a.length > CODE_DIFF_MAX_LINES || b.length > CODE_DIFF_MAX_LINES) {
    return {
      ok: false,
      error: `Each side is limited to ${CODE_DIFF_MAX_LINES.toLocaleString()} lines. Paste a smaller section or split the file.`,
    };
  }

  const m = a.length;
  const n = b.length;
  const cols = n + 1;
  const dp = new Int32Array((m + 1) * cols);

  for (let i = m - 1; i >= 0; i--) {
    const row = i * cols;
    const rowNext = (i + 1) * cols;
    for (let j = n - 1; j >= 0; j--) {
      if (a[i] === b[j]) {
        dp[row + j] = 1 + dp[rowNext + j + 1];
      } else {
        dp[row + j] = Math.max(dp[rowNext + j], dp[row + j + 1]);
      }
    }
  }

  const chunks: DiffChunk[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      chunks.push({ type: "equal", line: a[i] });
      i += 1;
      j += 1;
    } else if (dp[(i + 1) * cols + j] >= dp[i * cols + (j + 1)]) {
      chunks.push({ type: "delete", line: a[i] });
      i += 1;
    } else {
      chunks.push({ type: "insert", line: b[j] });
      j += 1;
    }
  }
  while (i < m) {
    chunks.push({ type: "delete", line: a[i] });
    i += 1;
  }
  while (j < n) {
    chunks.push({ type: "insert", line: b[j] });
    j += 1;
  }

  return { ok: true, chunks };
}
