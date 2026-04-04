"use client";

import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Copy,
  Upload,
} from "lucide-react";
import {
  detectDelimiter,
  padRowsToUniformWidth,
  parseDelimitedText,
  serializeDelimitedRows,
} from "@/lib/csv-parse";

type DelimiterOption = "auto" | "," | ";" | "\t" | "|";

const delimiterLabels: Record<Exclude<DelimiterOption, "auto">, string> = {
  ",": "Comma",
  ";": "Semicolon",
  "\t": "Tab",
  "|": "Pipe",
};

const SAMPLE = `product,sku,price,stock,in_stock
Widget A,W-A-1,19.99,42,true
Widget B,W-B-2,29.50,7,true
"Special, comma",S-99,15.00,0,false
`;

function quotesBalanced(text: string): boolean {
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        i++;
        continue;
      }
      inQuotes = !inQuotes;
    }
  }
  return !inQuotes;
}

export function CsvViewerTool() {
  const inputId = useId();
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [csvText, setCsvText] = useState(SAMPLE);
  const [delimiter, setDelimiter] = useState<DelimiterOption>("auto");
  const [hasHeader, setHasHeader] = useState(true);
  const [filterQuery, setFilterQuery] = useState("");
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [exportFilteredOnly, setExportFilteredOnly] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);

  const effectiveDelimiter = useMemo(() => {
    if (delimiter !== "auto") return delimiter;
    return detectDelimiter(csvText);
  }, [delimiter, csvText]);

  const quoteWarning = useMemo(() => {
    if (!csvText.trim()) return null;
    return quotesBalanced(csvText)
      ? null
      : "Warning: quotes may be unbalanced; verify fields match your source file.";
  }, [csvText]);

  const rows = useMemo(() => {
    if (!csvText.trim()) return [];
    const raw = parseDelimitedText(csvText, effectiveDelimiter);
    return padRowsToUniformWidth(raw);
  }, [csvText, effectiveDelimiter]);

  const colCount = rows[0]?.length ?? 0;

  const bodyStart = hasHeader ? 1 : 0;

  const bodyRowIndices = useMemo(() => {
    const n = rows.length - bodyStart;
    let idx = Array.from({ length: n }, (_, i) => i + bodyStart);
    const q = filterQuery.trim().toLowerCase();
    if (q) {
      idx = idx.filter((ri) =>
        rows[ri]!.some((cell) => cell.toLowerCase().includes(q)),
      );
    }
    if (sortCol !== null && sortCol >= 0 && sortCol < colCount) {
      idx = [...idx].sort((ra, rb) => {
        const va = rows[ra]![sortCol] ?? "";
        const vb = rows[rb]![sortCol] ?? "";
        const c = va.localeCompare(vb, undefined, {
          numeric: true,
          sensitivity: "base",
        });
        return sortDir === "asc" ? c : -c;
      });
    }
    return idx;
  }, [rows, bodyStart, filterQuery, sortCol, sortDir, colCount]);

  const updateCell = useCallback(
    (rowIndex: number, colIndex: number, value: string) => {
      setCsvText((prev) => {
        const parsed = padRowsToUniformWidth(
          parseDelimitedText(prev, effectiveDelimiter),
        );
        if (!parsed[rowIndex]) return prev;
        const next = parsed.map((r) => [...r]);
        const padTo = Math.max(colIndex + 1, ...next.map((r) => r.length));
        while (next[rowIndex]!.length < padTo) {
          next[rowIndex]!.push("");
        }
        next[rowIndex]![colIndex] = value;
        const uniform = padRowsToUniformWidth(next);
        return serializeDelimitedRows(uniform, effectiveDelimiter);
      });
    },
    [effectiveDelimiter],
  );

  const onSortHeaderClick = useCallback(
    (col: number) => {
      if (sortCol === col) {
        if (sortDir === "asc") setSortDir("desc");
        else {
          setSortCol(null);
          setSortDir("asc");
        }
      } else {
        setSortCol(col);
        setSortDir("asc");
      }
    },
    [sortCol, sortDir],
  );

  const exportText = useMemo(() => {
    let toExport: string[][];
    if (exportFilteredOnly) {
      if (hasHeader && rows[0]) {
        toExport = [rows[0], ...bodyRowIndices.map((i) => rows[i]!)];
      } else {
        toExport = bodyRowIndices.map((i) => rows[i]!);
      }
    } else {
      toExport = rows;
    }
    return serializeDelimitedRows(toExport, effectiveDelimiter);
  }, [exportFilteredOnly, hasHeader, rows, bodyRowIndices, effectiveDelimiter]);

  const copyCsv = useCallback(async () => {
    if (!exportText) return;
    setCopyHint(null);
    setCopyDone(false);
    try {
      await navigator.clipboard.writeText(exportText);
      setCopyHint("Copied to clipboard.");
      setCopyDone(true);
      window.setTimeout(() => {
        setCopyHint(null);
        setCopyDone(false);
      }, 2000);
    } catch {
      setCopyHint(
        "Clipboard not available—select the output in Raw CSV and copy manually.",
      );
    }
  }, [exportText]);

  const downloadCsv = useCallback(() => {
    if (!exportText) return;
    const blob = new Blob([exportText], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edited.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [exportText]);

  const onFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      setCsvText(text);
    };
    reader.onerror = () => {
      setFileError("Could not read the file.");
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const loadSample = useCallback(() => {
    setCsvText(SAMPLE);
    setFilterQuery("");
    setSortCol(null);
    setFileError(null);
  }, []);

  const headerLabels = useMemo(() => {
    if (colCount === 0) return [];
    if (hasHeader && rows[0]) {
      return rows[0]!.map((h, i) => (h.trim() === "" ? `Column ${i + 1}` : h));
    }
    return Array.from({ length: colCount }, (_, i) => `Column ${i + 1}`);
  }, [rows, hasHeader, colCount]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <label
                htmlFor={inputId}
                className="block text-sm font-medium text-foreground"
              >
                CSV / TSV text
              </label>
              <textarea
                id={inputId}
                value={csvText}
                onChange={(e) => {
                  setCsvText(e.target.value);
                  setFileError(null);
                }}
                spellCheck={false}
                rows={10}
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
                placeholder="Paste CSV or TSV here…"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileRef}
                id={fileId}
                type="file"
                accept=".csv,.tsv,.txt,text/csv,text/plain"
                className="sr-only"
                onChange={onFile}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <Upload className="size-4 shrink-0" aria-hidden />
                Upload CSV
              </button>
              <button
                type="button"
                onClick={loadSample}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                Load sample
              </button>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Delimiter:{" "}
                <span className="font-medium text-foreground">
                  {delimiter === "auto"
                    ? `Auto (${delimiterLabels[effectiveDelimiter as Exclude<DelimiterOption, "auto">]})`
                    : delimiterLabels[delimiter as Exclude<DelimiterOption, "auto">]}
                </span>
              </span>
            </div>
          </div>

          <div className="w-full shrink-0 space-y-3 lg:w-56">
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-foreground">
                Delimiter
              </legend>
              <select
                value={delimiter}
                onChange={(e) =>
                  setDelimiter(e.target.value as DelimiterOption)
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="auto">Auto-detect</option>
                <option value=",">Comma</option>
                <option value=";">Semicolon</option>
                <option value="\t">Tab</option>
                <option value="|">Pipe</option>
              </select>
            </fieldset>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={hasHeader}
                onChange={(e) => setHasHeader(e.target.checked)}
                className="rounded border-zinc-400"
              />
              First row is header
            </label>

            <div>
              <label
                htmlFor="csv-filter"
                className="text-sm font-medium text-foreground"
              >
                Filter rows
              </label>
              <input
                id="csv-filter"
                type="search"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search in any cell…"
                className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={exportFilteredOnly}
                onChange={(e) => setExportFilteredOnly(e.target.checked)}
                className="rounded border-zinc-400"
              />
              Export filtered rows only
            </label>
          </div>
        </div>

        {fileError ? (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
            {fileError}
          </p>
        ) : null}

        {quoteWarning ? (
          <p
            className="mt-4 text-sm text-amber-700 dark:text-amber-400"
            role="status"
          >
            {quoteWarning}
          </p>
        ) : null}

        <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          {rows.length === 0
            ? "No rows parsed."
            : `${rows.length} row(s), ${colCount} column(s). Showing ${hasHeader ? Math.max(0, bodyRowIndices.length) : bodyRowIndices.length} data row(s) in the table.`}
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-medium text-foreground">Table</h2>
          <div className="flex flex-wrap items-center gap-2">
            {copyHint ? (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {copyHint}
              </span>
            ) : null}
            <button
              type="button"
              onClick={copyCsv}
              disabled={!exportText}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {copyDone ? (
                <Check className="size-4 shrink-0" aria-hidden />
              ) : (
                <Copy className="size-4 shrink-0" aria-hidden />
              )}
              Copy CSV
            </button>
            <button
              type="button"
              onClick={downloadCsv}
              disabled={!exportText}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Download .csv
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          {colCount === 0 ? (
            <p className="p-6 text-sm text-zinc-500 dark:text-zinc-400">
              Add CSV text above to see the table.
            </p>
          ) : (
            <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80">
                  <th
                    scope="col"
                    className="sticky left-0 z-10 border-r border-zinc-200 bg-zinc-50 px-2 py-2 font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/80"
                  >
                    #
                  </th>
                  {Array.from({ length: colCount }, (_, col) => (
                    <th
                      key={col}
                      scope="col"
                      className="border-r border-zinc-200 px-2 py-2 font-medium text-foreground last:border-r-0 dark:border-zinc-800"
                    >
                      <div className="flex min-w-0 items-center gap-1">
                        {hasHeader && rows[0] ? (
                          <input
                            type="text"
                            value={rows[0]![col] ?? ""}
                            onChange={(e) =>
                              updateCell(0, col, e.target.value)
                            }
                            className="min-w-0 flex-1 rounded border border-transparent bg-white px-1.5 py-1 font-mono text-xs font-medium text-foreground outline-none focus:border-zinc-300 focus:ring-1 dark:bg-zinc-950 dark:focus:border-zinc-600"
                            aria-label={`Header column ${col + 1}`}
                          />
                        ) : (
                          <span className="min-w-0 flex-1 truncate">
                            {headerLabels[col]}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => onSortHeaderClick(col)}
                          className="inline-flex shrink-0 items-center rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-foreground dark:hover:bg-zinc-800"
                          aria-label={`Sort by column ${col + 1}`}
                        >
                          {sortCol === col ? (
                            sortDir === "asc" ? (
                              <ArrowUp className="size-3.5" aria-hidden />
                            ) : (
                              <ArrowDown className="size-3.5" aria-hidden />
                            )
                          ) : (
                            <ChevronDown className="size-3.5 opacity-40" aria-hidden />
                          )}
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRowIndices.map((ri, displayIdx) => (
                  <tr
                    key={`${ri}-${displayIdx}`}
                    className="border-b border-zinc-100 dark:border-zinc-800/80"
                  >
                    <th
                      scope="row"
                      className="sticky left-0 border-r border-zinc-200 bg-white px-2 py-1.5 text-xs font-normal text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      {ri + 1}
                    </th>
                    {rows[ri]!.map((cell, ci) => (
                      <td
                        key={ci}
                        className="border-r border-zinc-100 px-0 py-0 dark:border-zinc-800/80"
                      >
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => updateCell(ri, ci, e.target.value)}
                          className="w-full min-w-[6rem] bg-transparent px-2 py-1.5 font-mono text-xs text-foreground outline-none focus:bg-zinc-50 focus:ring-1 focus:ring-inset focus:ring-zinc-300 dark:focus:bg-zinc-900 dark:focus:ring-zinc-600"
                          aria-label={`Row ${ri + 1}, ${headerLabels[ci] ?? `column ${ci + 1}`}`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        <h2 className="text-sm font-medium text-foreground">Raw CSV (export)</h2>
        <textarea
          readOnly
          value={exportText}
          rows={8}
          className="mt-3 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-sm text-foreground dark:border-zinc-800 dark:bg-zinc-900/50"
        />
      </div>
    </div>
  );
}
