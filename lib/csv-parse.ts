/**
 * RFC 4180–style delimited text parser (commas, semicolons, tabs, pipes).
 * Handles quoted fields and escaped quotes ("").
 */
export function parseDelimitedText(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let i = 0;
  let inQuotes = false;
  const len = text.length;

  const isRowEmpty = (r: string[]) =>
    r.length === 0 ||
    (r.length === 1 && r[0]?.trim() === "") ||
    r.every((c) => c.trim() === "");

  const pushRow = () => {
    row.push(field);
    field = "";
    if (!isRowEmpty(row)) {
      rows.push(row);
    }
    row = [];
  };

  while (i < len) {
    const c = text[i]!;

    if (inQuotes) {
      if (c === '"') {
        if (i + 1 < len && text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }

    if (c === delimiter) {
      row.push(field);
      field = "";
      i++;
      continue;
    }

    if (c === "\r") {
      i++;
      continue;
    }

    if (c === "\n") {
      pushRow();
      i++;
      continue;
    }

    field += c;
    i++;
  }

  row.push(field);
  if (!isRowEmpty(row)) {
    rows.push(row);
  }

  return rows;
}

export function detectDelimiter(sample: string): string {
  const head = sample.split(/\r?\n/).slice(0, 8).join("\n");
  if (!head.trim()) return ",";

  const candidates: { d: string; label: string }[] = [
    { d: ",", label: "comma" },
    { d: ";", label: "semicolon" },
    { d: "\t", label: "tab" },
    { d: "|", label: "pipe" },
  ];

  let best = ",";
  let bestCols = 0;

  for (const { d } of candidates) {
    const rows = parseDelimitedText(head, d);
    if (rows.length < 1) continue;
    const firstLen = rows[0]?.length ?? 0;
    if (firstLen < 2) continue;
    const consistent = rows.every((r) => r.length === firstLen);
    const score = consistent ? firstLen * rows.length : firstLen;
    if (score > bestCols) {
      bestCols = score;
      best = d;
    }
  }

  return best;
}

/** Coerce a single CSV cell for typed JSON/SQL output (numbers, booleans, empty → null). */
export function coerceCsvCell(value: string): string | number | boolean | null {
  const t = value.trim();
  if (t === "") return null;
  if (/^(true|false)$/i.test(t)) return t.toLowerCase() === "true";
  if (/^-?\d+$/.test(t)) return Number.parseInt(t, 10);
  if (/^-?\d+\.\d+$/.test(t)) {
    const n = Number(t);
    return Number.isFinite(n) ? n : value;
  }
  return value;
}

export function rowsToJsonObjects(
  rows: string[][],
  hasHeader: boolean,
  typed: boolean,
): Record<string, string | number | boolean | null>[] {
  if (rows.length === 0) return [];

  if (!hasHeader) {
    const width = Math.max(...rows.map((r) => r.length), 0);
    return rows.map((r) => {
      const obj: Record<string, string | number | boolean | null> = {};
      for (let c = 0; c < width; c++) {
        const raw = r[c] ?? "";
        obj[`column_${c + 1}`] = typed ? coerceCsvCell(raw) : raw;
      }
      return obj;
    });
  }

  const headers = rows[0]!.map((h, idx) => {
    const key = h.trim();
    return key === "" ? `column_${idx + 1}` : key;
  });
  const seen = new Map<string, number>();
  const uniqueHeaders = headers.map((h) => {
    const n = seen.get(h) ?? 0;
    seen.set(h, n + 1);
    return n === 0 ? h : `${h}_${n + 1}`;
  });

  const out: Record<string, string | number | boolean | null>[] = [];
  for (let r = 1; r < rows.length; r++) {
    const line = rows[r]!;
    const obj: Record<string, string | number | boolean | null> = {};
    for (let c = 0; c < uniqueHeaders.length; c++) {
      const raw = line[c] ?? "";
      obj[uniqueHeaders[c]!] = typed ? coerceCsvCell(raw) : raw;
    }
    out.push(obj);
  }
  return out;
}

export function rowsToJsonArrays(rows: string[][], typed: boolean): unknown[][] {
  return rows.map((r) =>
    r.map((cell) => (typed ? coerceCsvCell(cell) : cell)),
  );
}

/** RFC 4180-style field serialization for one delimiter (comma, tab, etc.). */
function formatDelimitedField(field: string, delimiter: string): string {
  const needsQuote =
    field.includes('"') ||
    field.includes(delimiter) ||
    field.includes("\n") ||
    field.includes("\r");
  if (!needsQuote) return field;
  return `"${field.replace(/"/g, '""')}"`;
}

/** Turn a 2D grid back into delimited text (e.g. CSV export). */
export function serializeDelimitedRows(
  rows: string[][],
  delimiter: string,
): string {
  if (rows.length === 0) return "";
  return rows
    .map((row) =>
      row.map((cell) => formatDelimitedField(cell, delimiter)).join(delimiter),
    )
    .join("\n");
}

/** Pad ragged rows so every row has the same number of columns. */
export function padRowsToUniformWidth(rows: string[][]): string[][] {
  if (rows.length === 0) return [];
  const maxCols = Math.max(0, ...rows.map((r) => r.length));
  return rows.map((r) => {
    if (r.length >= maxCols) return [...r];
    return [...r, ...Array(maxCols - r.length).fill("")];
  });
}
