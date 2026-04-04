import {
  coerceCsvCell,
  padRowsToUniformWidth,
  parseDelimitedText,
} from "@/lib/csv-parse";

export type SqlDialect = "ansi" | "mysql" | "sqlserver";

export type InsertFormat = "per-row" | "batched";

export function quoteSqlIdentifier(name: string, dialect: SqlDialect): string {
  const n = name.trim() || "imported_data";
  switch (dialect) {
    case "ansi":
      return `"${n.replace(/"/g, '""')}"`;
    case "mysql":
      return `\`${n.replace(/`/g, "``")}\``;
    case "sqlserver":
      return `[${n.replace(/]/g, "]]")}]`;
    default:
      return `"${n.replace(/"/g, '""')}"`;
  }
}

function sqlStringLiteral(s: string): string {
  return `'${s.replace(/'/g, "''")}'`;
}

export function formatSqlValue(raw: string, typed: boolean): string {
  if (!typed) {
    return sqlStringLiteral(raw);
  }
  const v = coerceCsvCell(raw);
  if (v === null) return "NULL";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : sqlStringLiteral(String(v));
  if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
  return sqlStringLiteral(v);
}

/** Header-aware column list and data rows (padded to uniform width). */
export function getColumnsAndDataRows(
  rows: string[][],
  hasHeader: boolean,
): { columns: string[]; dataRows: string[][] } {
  const padded = padRowsToUniformWidth(rows);
  if (padded.length === 0) return { columns: [], dataRows: [] };
  const width = padded[0]!.length;

  if (!hasHeader) {
    return {
      columns: Array.from({ length: width }, (_, i) => `column_${i + 1}`),
      dataRows: padded,
    };
  }

  const headers = padded[0]!.map((h, idx) => {
    const key = h.trim();
    return key === "" ? `column_${idx + 1}` : key;
  });
  const seen = new Map<string, number>();
  const uniqueHeaders = headers.map((h) => {
    const n = seen.get(h) ?? 0;
    seen.set(h, n + 1);
    return n === 0 ? h : `${h}_${n + 1}`;
  });

  return { columns: uniqueHeaders, dataRows: padded.slice(1) };
}

export function buildInsertStatements(
  columns: string[],
  dataRows: string[][],
  options: {
    tableName: string;
    dialect: SqlDialect;
    typed: boolean;
    format: InsertFormat;
    batchSize: number;
    trailingSemicolons: boolean;
  },
): string {
  const table = quoteSqlIdentifier(options.tableName, options.dialect);
  const colList = columns
    .map((c) => quoteSqlIdentifier(c, options.dialect))
    .join(", ");

  const rowTuple = (r: string[]) => {
    const cells = columns.map((_, i) =>
      formatSqlValue(r[i] ?? "", options.typed),
    );
    return `(${cells.join(", ")})`;
  };

  const semi = options.trailingSemicolons ? ";" : "";

  if (columns.length === 0) {
    return `-- No columns detected. Paste CSV with at least one column.${semi ? "\n" : ""}`;
  }

  if (dataRows.length === 0) {
    return `-- No data rows to insert (header only or empty file).${semi ? "\n" : ""}`;
  }

  if (options.format === "per-row") {
    return dataRows
      .map(
        (r) => `INSERT INTO ${table} (${colList}) VALUES ${rowTuple(r)}${semi}`,
      )
      .join("\n");
  }

  const size = Math.max(1, options.batchSize);
  const chunks: string[][][] = [];
  for (let i = 0; i < dataRows.length; i += size) {
    chunks.push(dataRows.slice(i, i + size));
  }

  return chunks
    .map((chunk) => {
      const values = chunk.map(rowTuple).join(",\n  ");
      return `INSERT INTO ${table} (${colList}) VALUES\n  ${values}${semi}`;
    })
    .join("\n\n");
}

export function csvTextToInsertSql(
  csvText: string,
  delimiter: string,
  hasHeader: boolean,
  typed: boolean,
  options: {
    tableName: string;
    dialect: SqlDialect;
    format: InsertFormat;
    batchSize: number;
    trailingSemicolons: boolean;
  },
): string {
  if (!csvText.trim()) {
    return "-- Paste CSV or upload a file to generate INSERT statements.\n";
  }

  const rows = parseDelimitedText(csvText, delimiter);
  const { columns, dataRows } = getColumnsAndDataRows(rows, hasHeader);
  return buildInsertStatements(columns, dataRows, { ...options, typed });
}
