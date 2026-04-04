import { parseDelimitedText } from "@/lib/csv-parse";

export type CommaSeparatorMode = "join" | "split";

export type QuoteStyle = "minimal" | "always";

export interface JoinOptions {
  delimiter: string;
  trimLines: boolean;
  skipEmptyLines: boolean;
  quoteStyle: QuoteStyle;
}

export interface SplitOptions {
  delimiter: string;
  trimValues: boolean;
  blankLineBetweenRows: boolean;
}

function formatField(
  field: string,
  delimiter: string,
  quoteStyle: QuoteStyle,
): string {
  const needsQuote =
    quoteStyle === "always" ||
    field.includes('"') ||
    field.includes(delimiter) ||
    field.includes("\n") ||
    field.includes("\r");
  if (!needsQuote) return field;
  return `"${field.replace(/"/g, '""')}"`;
}

export function joinLinesToDelimited(input: string, opts: JoinOptions): string {
  const lines = input.split(/\r\n|\r|\n/);
  const items: string[] = [];
  for (const line of lines) {
    const v = opts.trimLines ? line.trim() : line;
    if (opts.skipEmptyLines && v === "") continue;
    items.push(v);
  }
  if (items.length === 0) return "";
  return items
    .map((f) => formatField(f, opts.delimiter, opts.quoteStyle))
    .join(opts.delimiter);
}

export function splitDelimitedToLines(
  input: string,
  opts: SplitOptions,
): string {
  const rows = parseDelimitedText(input, opts.delimiter);
  const out: string[] = [];
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r]!;
    for (const cell of row) {
      const v = opts.trimValues ? cell.trim() : cell;
      out.push(v);
    }
    if (opts.blankLineBetweenRows && r < rows.length - 1) {
      out.push("");
    }
  }
  return out.join("\n");
}

export function countInputLines(text: string): number {
  if (text === "") return 0;
  return text.split(/\r\n|\r|\n/).length;
}
