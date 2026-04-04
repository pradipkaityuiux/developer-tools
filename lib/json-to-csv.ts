const ARRAY_WRAPPER_KEYS = [
  "data",
  "items",
  "results",
  "records",
  "rows",
  "values",
  "list",
] as const;

export type JsonToCsvDelimiter = "," | ";";

export type JsonToCsvResult =
  | { ok: true; csv: string; columnCount: number; rowCount: number }
  | { ok: false; error: string };

function unwrapArrayRoot(parsed: unknown): unknown[] | null {
  if (Array.isArray(parsed)) return parsed;
  if (parsed !== null && typeof parsed === "object") {
    const o = parsed as Record<string, unknown>;
    for (const key of ARRAY_WRAPPER_KEYS) {
      const v = o[key];
      if (Array.isArray(v)) return v;
    }
  }
  return null;
}

function cellValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function escapeField(raw: string, delimiter: JsonToCsvDelimiter): string {
  const needsQuote =
    raw.includes('"') ||
    raw.includes("\r") ||
    raw.includes("\n") ||
    raw.includes(delimiter);
  if (!needsQuote) return raw;
  return `"${raw.replace(/"/g, '""')}"`;
}

function collectOrderedKeys(rows: Record<string, unknown>[]): string[] {
  const seen = new Set<string>();
  const keys: string[] = [];
  for (const row of rows) {
    for (const k of Object.keys(row)) {
      if (!seen.has(k)) {
        seen.add(k);
        keys.push(k);
      }
    }
  }
  return keys;
}

/**
 * Parse user JSON and produce RFC 4180-style CSV with the given delimiter.
 */
export function jsonTextToCsv(
  text: string,
  delimiter: JsonToCsvDelimiter,
): JsonToCsvResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, error: "Paste JSON to convert—an array of objects works best." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return {
      ok: false,
      error:
        "Invalid JSON. Check for trailing commas, single quotes, or unescaped characters—try our JSON formatter first if you need to clean the payload.",
    };
  }

  const arr = unwrapArrayRoot(parsed);
  if (arr === null) {
    return {
      ok: false,
      error:
        "Root value must be a JSON array, or an object containing an array under data, items, results, records, rows, values, or list.",
    };
  }

  if (arr.length === 0) {
    return { ok: false, error: "The array is empty—there are no rows to export." };
  }

  const rows: Record<string, unknown>[] = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item !== null && typeof item === "object" && !Array.isArray(item)) {
      rows.push(item as Record<string, unknown>);
    } else {
      rows.push({ value: item });
    }
  }

  const keys = collectOrderedKeys(rows);
  if (keys.length === 0) {
    return { ok: false, error: "No object keys found to use as CSV columns." };
  }

  const headerLine = keys.map((k) => escapeField(k, delimiter)).join(delimiter);
  const bodyLines = rows.map((row) =>
    keys
      .map((k) => escapeField(cellValue(row[k]), delimiter))
      .join(delimiter),
  );

  const csv = [headerLine, ...bodyLines].join("\r\n");
  return {
    ok: true,
    csv,
    columnCount: keys.length,
    rowCount: rows.length,
  };
}
