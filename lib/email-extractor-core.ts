/**
 * Extract RFC-ish email addresses from plain text or HTML-ish blobs.
 * Deduplicates case-insensitively while preserving the first-seen spelling.
 */

const EMAIL_RE =
  /[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}/g;

const MAILTO_RE = /mailto:([^?#'"\s>]+)/gi;

function tryDecodeMailtoPart(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function stripHtmlish(input: string): string {
  let s = input.replace(/<script[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, " ");
  s = s.replace(/<[^>]+>/g, " ");
  return s;
}

function addEmail(
  raw: string,
  seen: Set<string>,
  ordered: string[],
): void {
  const trimmed = raw.trim();
  if (!trimmed || !trimmed.includes("@")) return;
  const key = trimmed.toLowerCase();
  if (seen.has(key)) return;
  seen.add(key);
  ordered.push(trimmed);
}

/**
 * Returns unique emails in first-seen order (case-insensitive dedupe).
 */
export function extractEmailsFromText(input: string): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];

  // Visible text first (reading order after tag strip), then mailto-only hrefs.
  const plain = stripHtmlish(input);
  let m: RegExpExecArray | null;
  EMAIL_RE.lastIndex = 0;
  while ((m = EMAIL_RE.exec(plain)) !== null) {
    addEmail(m[0], seen, ordered);
  }

  MAILTO_RE.lastIndex = 0;
  while ((m = MAILTO_RE.exec(input)) !== null) {
    addEmail(tryDecodeMailtoPart(m[1]), seen, ordered);
  }

  return ordered;
}

export type EmailListSeparator = "newline" | "comma" | "semicolon";

export function formatEmailList(
  emails: string[],
  mode: EmailListSeparator,
): string {
  if (emails.length === 0) return "";
  if (mode === "newline") return emails.join("\n");
  if (mode === "comma") return emails.join(", ");
  return emails.join("; ");
}
