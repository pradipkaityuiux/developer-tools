"use client";

import { Check, Copy, Minus, Plus, Upload } from "lucide-react";
import type { CSSProperties } from "react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type JustifyItems = "start" | "end" | "center" | "stretch";
type AlignItems = "start" | "end" | "center" | "stretch";
type GridContentAlignment =
  | "normal"
  | "start"
  | "end"
  | "center"
  | "stretch"
  | "space-between"
  | "space-around"
  | "space-evenly";
type GridAutoFlow = "row" | "column" | "row dense" | "column dense";

export type GridItemState = {
  id: string;
  colStart: number;
  colSpan: number;
  rowStart: number;
  rowSpan: number;
};

const ITEM_COLORS = [
  "bg-indigo-500",
  "bg-fuchsia-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-sky-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-lime-600",
  "bg-orange-500",
  "bg-cyan-600",
  "bg-pink-500",
  "bg-teal-500",
];

const COLUMN_PRESETS: { label: string; value: string }[] = [
  { label: "3 × 1fr (equal)", value: "repeat(3, minmax(0, 1fr))" },
  { label: "4 × 1fr (equal)", value: "repeat(4, minmax(0, 1fr))" },
  { label: "12-column tracks", value: "repeat(12, minmax(0, 1fr))" },
  { label: "Sidebar + main", value: "240px minmax(0, 1fr)" },
  { label: "Thirds (1fr 2fr 1fr)", value: "1fr 2fr 1fr" },
  {
    label: "Auto-fill cards",
    value: "repeat(auto-fill, minmax(140px, 1fr))",
  },
  { label: "Custom…", value: "__custom__" },
];

const ROW_PRESETS: { label: string; value: string }[] = [
  { label: "3 rows (min 56px)", value: "repeat(3, minmax(56px, auto))" },
  { label: "4 rows (min 48px)", value: "repeat(4, minmax(48px, auto))" },
  { label: "2 tall rows", value: "repeat(2, minmax(120px, auto))" },
  { label: "Single auto row", value: "auto" },
  { label: "Custom…", value: "__custom__" },
];

function randomId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Split a track list on spaces that are not inside parentheses. */
function splitTopLevelTracks(s: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let cur = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]!;
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if ((ch === " " || ch === "\t") && depth === 0) {
      if (cur.trim()) parts.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts.filter(Boolean);
}

/**
 * Best-effort column count for placing new items in row-major order
 * (must match repeat(N, …) or explicit track lists).
 */
function estimateColumnCount(template: string): number {
  const t = template.trim();
  const repeatNum = /^repeat\(\s*(\d+)/i.exec(t);
  if (repeatNum) return clamp(parseInt(repeatNum[1]!, 10), 1, 24);
  if (/auto-fill|auto-fit/i.test(t)) return 4;
  const tracks = splitTopLevelTracks(t);
  if (tracks.length >= 1) return clamp(tracks.length, 1, 24);
  return 4;
}

function placementOverlaps(
  a: { colStart: number; colSpan: number; rowStart: number; rowSpan: number },
  b: { colStart: number; colSpan: number; rowStart: number; rowSpan: number },
): boolean {
  const aColEnd = a.colStart + a.colSpan - 1;
  const aRowEnd = a.rowStart + a.rowSpan - 1;
  const bColEnd = b.colStart + b.colSpan - 1;
  const bRowEnd = b.rowStart + b.rowSpan - 1;
  return !(
    aColEnd < b.colStart ||
    bColEnd < a.colStart ||
    aRowEnd < b.rowStart ||
    bRowEnd < a.rowStart
  );
}

/** First 1×1 cell that does not overlap existing items (row-major scan). */
function findFirstFreeCell(
  items: GridItemState[],
  cols: number,
  maxRows: number,
): { colStart: number; rowStart: number } {
  const candidate = {
    colStart: 1,
    colSpan: 1,
    rowStart: 1,
    rowSpan: 1,
  };
  for (let row = 1; row <= maxRows; row++) {
    for (let col = 1; col <= cols; col++) {
      candidate.colStart = col;
      candidate.rowStart = row;
      let overlaps = false;
      for (const it of items) {
        if (placementOverlaps(candidate, it)) {
          overlaps = true;
          break;
        }
      }
      if (!overlaps) {
        return { colStart: col, rowStart: row };
      }
    }
  }
  let maxBottom = 0;
  for (const it of items) {
    maxBottom = Math.max(maxBottom, it.rowStart + it.rowSpan - 1);
  }
  return { colStart: 1, rowStart: maxBottom + 1 };
}

export const GRID_LAYOUT_JSON_VERSION = 1 as const;

export type GridLayoutExport = {
  version: typeof GRID_LAYOUT_JSON_VERSION;
  columnTemplate: string;
  rowTemplate: string;
  gapRow: number;
  gapCol: number;
  justifyItems: JustifyItems;
  alignItems: AlignItems;
  justifyContent: GridContentAlignment;
  alignContent: GridContentAlignment;
  autoFlow: GridAutoFlow;
  items: Array<{
    colStart: number;
    colSpan: number;
    rowStart: number;
    rowSpan: number;
  }>;
};

export function buildGridCss(args: {
  className: string;
  columnTemplate: string;
  rowTemplate: string;
  gapRow: number;
  gapCol: number;
  justifyItems: JustifyItems;
  alignItems: AlignItems;
  justifyContent: GridContentAlignment;
  alignContent: GridContentAlignment;
  autoFlow: GridAutoFlow;
  items: GridItemState[];
}): string {
  const {
    className,
    columnTemplate,
    rowTemplate,
    gapRow,
    gapCol,
    justifyItems,
    alignItems,
    justifyContent,
    alignContent,
    autoFlow,
    items,
  } = args;
  const lines: string[] = [];
  lines.push(`.${className} {`);
  lines.push(`  display: grid;`);
  lines.push(`  grid-template-columns: ${columnTemplate};`);
  lines.push(`  grid-template-rows: ${rowTemplate};`);
  lines.push(
    gapRow === gapCol
      ? `  gap: ${gapRow}px;`
      : `  gap: ${gapRow}px ${gapCol}px;`,
  );
  lines.push(`  justify-items: ${justifyItems};`);
  lines.push(`  align-items: ${alignItems};`);
  lines.push(`  justify-content: ${justifyContent};`);
  lines.push(`  align-content: ${alignContent};`);
  lines.push(`  grid-auto-flow: ${autoFlow};`);
  lines.push(`}`);
  items.forEach((item, i) => {
    lines.push(``);
    lines.push(`.${className} > :nth-child(${i + 1}) {`);
    lines.push(`  grid-column: ${item.colStart} / span ${item.colSpan};`);
    lines.push(`  grid-row: ${item.rowStart} / span ${item.rowSpan};`);
    lines.push(`}`);
  });
  return lines.join("\n");
}

function makeDefaultItems(): GridItemState[] {
  const placements: Omit<GridItemState, "id">[] = [
    { colStart: 1, colSpan: 1, rowStart: 1, rowSpan: 1 },
    { colStart: 2, colSpan: 1, rowStart: 1, rowSpan: 1 },
    { colStart: 3, colSpan: 1, rowStart: 1, rowSpan: 1 },
    { colStart: 4, colSpan: 1, rowStart: 1, rowSpan: 1 },
    { colStart: 1, colSpan: 1, rowStart: 2, rowSpan: 1 },
    { colStart: 2, colSpan: 2, rowStart: 2, rowSpan: 1 },
  ];
  return placements.map((p) => ({ ...p, id: randomId() }));
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parseImportedLayout(text: string): Partial<GridLayoutExport> | null {
  try {
    const data = JSON.parse(text) as unknown;
    if (!isRecord(data)) return null;
    if (data.version !== GRID_LAYOUT_JSON_VERSION) return null;
    return data as Partial<GridLayoutExport>;
  } catch {
    return null;
  }
}

const DEFAULT_GRID_ITEMS = makeDefaultItems();

export function CssGridPlaygroundTool() {
  const [columnPreset, setColumnPreset] = useState(COLUMN_PRESETS[1]!.value);
  const [columnCustom, setColumnCustom] = useState(
    "repeat(4, minmax(0, 1fr))",
  );
  const [rowPreset, setRowPreset] = useState(ROW_PRESETS[0]!.value);
  const [rowCustom, setRowCustom] = useState(
    "repeat(3, minmax(56px, auto))",
  );
  const [gapRow, setGapRow] = useState(12);
  const [gapCol, setGapCol] = useState(16);
  const [justifyItems, setJustifyItems] =
    useState<JustifyItems>("stretch");
  const [alignItems, setAlignItems] = useState<AlignItems>("stretch");
  const [justifyContent, setJustifyContent] =
    useState<GridContentAlignment>("start");
  const [alignContent, setAlignContent] =
    useState<GridContentAlignment>("start");
  const [autoFlow, setAutoFlow] = useState<GridAutoFlow>("row");
  const [items, setItems] = useState<GridItemState[]>(DEFAULT_GRID_ITEMS);
  const [selectedId, setSelectedId] = useState<string | null>(
    () => DEFAULT_GRID_ITEMS[0]!.id,
  );
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const columnTemplate =
    columnPreset === "__custom__" ? columnCustom : columnPreset;
  const rowTemplate = rowPreset === "__custom__" ? rowCustom : rowPreset;

  const selected = items.find((x) => x.id === selectedId) ?? items[0] ?? null;

  const cssText = useMemo(
    () =>
      buildGridCss({
        className: "grid-container",
        columnTemplate,
        rowTemplate,
        gapRow,
        gapCol,
        justifyItems,
        alignItems,
        justifyContent,
        alignContent,
        autoFlow,
        items,
      }),
    [
      columnTemplate,
      rowTemplate,
      gapRow,
      gapCol,
      justifyItems,
      alignItems,
      justifyContent,
      alignContent,
      autoFlow,
      items,
    ],
  );

  const containerStyle = useMemo(
    () =>
      ({
        display: "grid",
        gridTemplateColumns: columnTemplate,
        gridTemplateRows: rowTemplate,
        gap: `${gapRow}px ${gapCol}px`,
        justifyItems,
        alignItems,
        justifyContent,
        alignContent,
        gridAutoFlow: autoFlow,
        minHeight: 280,
      }) as CSSProperties,
    [
      columnTemplate,
      rowTemplate,
      gapRow,
      gapCol,
      justifyItems,
      alignItems,
      justifyContent,
      alignContent,
      autoFlow,
    ],
  );

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copyCss = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cssText);
      setCopied(true);
    } catch {
      /* ignore */
    }
  }, [cssText]);

  const exportPayload = useCallback((): GridLayoutExport => {
    return {
      version: GRID_LAYOUT_JSON_VERSION,
      columnTemplate,
      rowTemplate,
      gapRow,
      gapCol,
      justifyItems,
      alignItems,
      justifyContent,
      alignContent,
      autoFlow,
      items: items.map(({ colStart, colSpan, rowStart, rowSpan }) => ({
        colStart,
        colSpan,
        rowStart,
        rowSpan,
      })),
    };
  }, [
    columnTemplate,
    rowTemplate,
    gapRow,
    gapCol,
    justifyItems,
    alignItems,
    justifyContent,
    alignContent,
    autoFlow,
    items,
  ]);

  const applyImported = useCallback((data: Partial<GridLayoutExport>) => {
    if (typeof data.columnTemplate === "string") {
      const match = COLUMN_PRESETS.find((p) => p.value === data.columnTemplate);
      if (match && match.value !== "__custom__") {
        setColumnPreset(match.value);
      } else {
        setColumnPreset("__custom__");
        setColumnCustom(data.columnTemplate);
      }
    }
    if (typeof data.rowTemplate === "string") {
      const match = ROW_PRESETS.find((p) => p.value === data.rowTemplate);
      if (match && match.value !== "__custom__") {
        setRowPreset(match.value);
      } else {
        setRowPreset("__custom__");
        setRowCustom(data.rowTemplate);
      }
    }
    if (typeof data.gapRow === "number") setGapRow(clamp(data.gapRow, 0, 64));
    if (typeof data.gapCol === "number") setGapCol(clamp(data.gapCol, 0, 64));
    if (data.justifyItems) setJustifyItems(data.justifyItems);
    if (data.alignItems) setAlignItems(data.alignItems);
    if (data.justifyContent) setJustifyContent(data.justifyContent);
    if (data.alignContent) setAlignContent(data.alignContent);
    if (data.autoFlow) setAutoFlow(data.autoFlow);
    if (Array.isArray(data.items) && data.items.length > 0) {
      const next: GridItemState[] = data.items.map((it) => ({
        id: randomId(),
        colStart: clamp(Number(it.colStart) || 1, 1, 24),
        colSpan: clamp(Number(it.colSpan) || 1, 1, 12),
        rowStart: clamp(Number(it.rowStart) || 1, 1, 24),
        rowSpan: clamp(Number(it.rowSpan) || 1, 1, 12),
      }));
      setItems(next);
      setSelectedId(next[0]!.id);
    }
  }, []);

  const onPickFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      setImportError(null);
      try {
        const text = await file.text();
        const parsed = parseImportedLayout(text);
        if (!parsed || typeof parsed.columnTemplate !== "string") {
          setImportError(
            "Invalid file. Export JSON from this page (version 1) and try again.",
          );
          return;
        }
        applyImported(parsed);
      } catch {
        setImportError("Could not read the file.");
      }
    },
    [applyImported],
  );

  const updateSelected = useCallback(
    (patch: Partial<GridItemState>) => {
      if (!selected) return;
      setItems((prev) =>
        prev.map((x) => (x.id === selected.id ? { ...x, ...patch } : x)),
      );
    },
    [selected],
  );

  const addItem = useCallback(() => {
    let newId: string | null = null;
    setItems((prev) => {
      if (prev.length >= 12) return prev;
      const cols = estimateColumnCount(columnTemplate);
      const { colStart, rowStart } = findFirstFreeCell(prev, cols, 24);
      newId = randomId();
      const next: GridItemState = {
        id: newId,
        colStart,
        colSpan: 1,
        rowStart,
        rowSpan: 1,
      };
      return [...prev, next];
    });
    if (newId) setSelectedId(newId);
  }, [columnTemplate]);

  const removeItem = useCallback(() => {
    if (items.length <= 2) return;
    const removeId = selected?.id ?? items[items.length - 1]!.id;
    const next = items.filter((x) => x.id !== removeId);
    setItems(next);
    if (!next.some((x) => x.id === selectedId)) {
      setSelectedId(next[0]!.id);
    }
  }, [items, selected?.id, selectedId]);

  const reset = useCallback(() => {
    setColumnPreset(COLUMN_PRESETS[1]!.value);
    setColumnCustom("repeat(4, minmax(0, 1fr))");
    setRowPreset(ROW_PRESETS[0]!.value);
    setRowCustom("repeat(3, minmax(56px, auto))");
    setGapRow(12);
    setGapCol(16);
    setJustifyItems("stretch");
    setAlignItems("stretch");
    setJustifyContent("start");
    setAlignContent("start");
    setAutoFlow("row");
    const fresh = makeDefaultItems();
    setItems(fresh);
    setSelectedId(fresh[0]!.id);
    setImportError(null);
  }, []);

  const downloadJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(exportPayload(), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "css-grid-playground-layout.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [exportPayload]);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:items-start">
        <div className="space-y-4 lg:sticky lg:top-4 lg:z-10 lg:self-start">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              Grid items
            </span>
            <button
              type="button"
              onClick={addItem}
              disabled={items.length >= 12}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-medium text-foreground hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
            >
              <Plus className="size-4 shrink-0" aria-hidden />
              Add item
            </button>
            <button
              type="button"
              onClick={removeItem}
              disabled={items.length <= 2}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-medium text-foreground hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
            >
              <Minus className="size-4 shrink-0" aria-hidden />
              Remove
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
            >
              Reset demo
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={onPickFile}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
            >
              <Upload className="size-4 shrink-0" aria-hidden />
              Upload JSON
            </button>
            <button
              type="button"
              onClick={downloadJson}
              className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
            >
              Download JSON
            </button>
          </div>
          {importError && (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {importError}
            </p>
          )}

          <div
            className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-600 dark:bg-zinc-900/40"
            role="group"
            aria-label="Live CSS Grid preview"
          >
            <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <div style={containerStyle}>
                {items.map((item, i) => {
                  const itemStyle: CSSProperties = {
                    gridColumn: `${item.colStart} / span ${item.colSpan}`,
                    gridRow: `${item.rowStart} / span ${item.rowSpan}`,
                  };
                  const active = item.id === selected?.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      style={itemStyle}
                      className={`flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-sm transition-[box-shadow,outline] ${
                        ITEM_COLORS[i % ITEM_COLORS.length]
                      } ${
                        active
                          ? "ring-2 ring-offset-2 ring-zinc-900 ring-offset-white dark:ring-zinc-100 dark:ring-offset-zinc-950"
                          : "hover:brightness-110"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
              Click a numbered cell to edit its grid-column and grid-row span.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-foreground">
              Tracks
            </legend>
            <div>
              <label
                htmlFor="grid-cols-preset"
                className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                grid-template-columns
              </label>
              <select
                id="grid-cols-preset"
                value={
                  COLUMN_PRESETS.some(
                    (p) => p.value === columnPreset && p.value !== "__custom__",
                  )
                    ? columnPreset
                    : "__custom__"
                }
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "__custom__") {
                    const effective =
                      columnPreset === "__custom__"
                        ? columnCustom
                        : columnPreset;
                    setColumnCustom(effective);
                    setColumnPreset("__custom__");
                  } else {
                    setColumnPreset(v);
                    setColumnCustom(v);
                  }
                }}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                {COLUMN_PRESETS.map((p) => (
                  <option key={p.label} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              {columnPreset === "__custom__" && (
                <textarea
                  value={columnCustom}
                  onChange={(e) => setColumnCustom(e.target.value)}
                  rows={2}
                  spellCheck={false}
                  className="mt-2 w-full resize-y rounded-lg border border-zinc-200 bg-white p-2 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-950"
                  aria-label="Custom grid-template-columns"
                />
              )}
            </div>
            <div>
              <label
                htmlFor="grid-rows-preset"
                className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                grid-template-rows
              </label>
              <select
                id="grid-rows-preset"
                value={
                  ROW_PRESETS.some(
                    (p) => p.value === rowPreset && p.value !== "__custom__",
                  )
                    ? rowPreset
                    : "__custom__"
                }
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "__custom__") {
                    const effective =
                      rowPreset === "__custom__" ? rowCustom : rowPreset;
                    setRowCustom(effective);
                    setRowPreset("__custom__");
                  } else {
                    setRowPreset(v);
                    setRowCustom(v);
                  }
                }}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                {ROW_PRESETS.map((p) => (
                  <option key={p.label} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              {rowPreset === "__custom__" && (
                <textarea
                  value={rowCustom}
                  onChange={(e) => setRowCustom(e.target.value)}
                  rows={2}
                  spellCheck={false}
                  className="mt-2 w-full resize-y rounded-lg border border-zinc-200 bg-white p-2 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-950"
                  aria-label="Custom grid-template-rows"
                />
              )}
            </div>
            <div>
              <label
                htmlFor="grid-auto-flow"
                className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                grid-auto-flow
              </label>
              <select
                id="grid-auto-flow"
                value={autoFlow}
                onChange={(e) =>
                  setAutoFlow(e.target.value as GridAutoFlow)
                }
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                <option value="row">row</option>
                <option value="column">column</option>
                <option value="row dense">row dense</option>
                <option value="column dense">column dense</option>
              </select>
            </div>
          </fieldset>

          <fieldset className="space-y-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <legend className="text-sm font-semibold text-foreground">
              Gap & alignment
            </legend>
            <div>
              <label
                htmlFor="gap-row"
                className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                Row gap: {gapRow}px
              </label>
              <input
                id="gap-row"
                type="range"
                min={0}
                max={48}
                value={gapRow}
                onChange={(e) => setGapRow(Number(e.target.value))}
                className="mt-2 w-full accent-foreground"
              />
            </div>
            <div>
              <label
                htmlFor="gap-col"
                className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                Column gap: {gapCol}px
              </label>
              <input
                id="gap-col"
                type="range"
                min={0}
                max={48}
                value={gapCol}
                onChange={(e) => setGapCol(Number(e.target.value))}
                className="mt-2 w-full accent-foreground"
              />
            </div>
            <div>
              <label
                htmlFor="justify-items"
                className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                justify-items
              </label>
              <select
                id="justify-items"
                value={justifyItems}
                onChange={(e) =>
                  setJustifyItems(e.target.value as JustifyItems)
                }
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                <option value="stretch">stretch</option>
                <option value="start">start</option>
                <option value="end">end</option>
                <option value="center">center</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="align-items"
                className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                align-items
              </label>
              <select
                id="align-items"
                value={alignItems}
                onChange={(e) => setAlignItems(e.target.value as AlignItems)}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                <option value="stretch">stretch</option>
                <option value="start">start</option>
                <option value="end">end</option>
                <option value="center">center</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="justify-content"
                className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                justify-content
              </label>
              <select
                id="justify-content"
                value={justifyContent}
                onChange={(e) =>
                  setJustifyContent(e.target.value as GridContentAlignment)
                }
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                <option value="normal">normal</option>
                <option value="start">start</option>
                <option value="end">end</option>
                <option value="center">center</option>
                <option value="stretch">stretch</option>
                <option value="space-between">space-between</option>
                <option value="space-around">space-around</option>
                <option value="space-evenly">space-evenly</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="align-content"
                className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                align-content
              </label>
              <select
                id="align-content"
                value={alignContent}
                onChange={(e) =>
                  setAlignContent(e.target.value as GridContentAlignment)
                }
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                <option value="normal">normal</option>
                <option value="start">start</option>
                <option value="end">end</option>
                <option value="center">center</option>
                <option value="stretch">stretch</option>
                <option value="space-between">space-between</option>
                <option value="space-around">space-around</option>
                <option value="space-evenly">space-evenly</option>
              </select>
            </div>
          </fieldset>

          {selected && (
            <fieldset className="space-y-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
              <legend className="text-sm font-semibold text-foreground">
                Selected item (
                {items.findIndex((x) => x.id === selected.id) + 1})
              </legend>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="col-start"
                    className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                  >
                    Column start
                  </label>
                  <input
                    id="col-start"
                    type="number"
                    min={1}
                    max={24}
                    value={selected.colStart}
                    onChange={(e) =>
                      updateSelected({
                        colStart: clamp(Number(e.target.value) || 1, 1, 24),
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  />
                </div>
                <div>
                  <label
                    htmlFor="col-span"
                    className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                  >
                    Column span
                  </label>
                  <input
                    id="col-span"
                    type="number"
                    min={1}
                    max={12}
                    value={selected.colSpan}
                    onChange={(e) =>
                      updateSelected({
                        colSpan: clamp(Number(e.target.value) || 1, 1, 12),
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  />
                </div>
                <div>
                  <label
                    htmlFor="row-start"
                    className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                  >
                    Row start
                  </label>
                  <input
                    id="row-start"
                    type="number"
                    min={1}
                    max={24}
                    value={selected.rowStart}
                    onChange={(e) =>
                      updateSelected({
                        rowStart: clamp(Number(e.target.value) || 1, 1, 24),
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  />
                </div>
                <div>
                  <label
                    htmlFor="row-span"
                    className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                  >
                    Row span
                  </label>
                  <input
                    id="row-span"
                    type="number"
                    min={1}
                    max={12}
                    value={selected.rowSpan}
                    onChange={(e) =>
                      updateSelected({
                        rowSpan: clamp(Number(e.target.value) || 1, 1, 12),
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  />
                </div>
              </div>
            </fieldset>
          )}
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label
            htmlFor="grid-css-output"
            className="text-sm font-semibold text-foreground"
          >
            Generated CSS
          </label>
          <button
            type="button"
            onClick={copyCss}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            {copied ? (
              <Check className="size-4 shrink-0" aria-hidden />
            ) : (
              <Copy className="size-4 shrink-0" aria-hidden />
            )}
            {copied ? "Copied" : "Copy CSS"}
          </button>
        </div>
        <textarea
          id="grid-css-output"
          readOnly
          value={cssText}
          rows={16}
          className="mt-2 w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50 p-4 font-mono text-xs leading-relaxed text-foreground dark:border-zinc-800 dark:bg-zinc-950"
          spellCheck={false}
        />
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Rename{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
            .grid-container
          </code>{" "}
          to match your markup. Child rules use{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
            :nth-child
          </code>{" "}
          in DOM order. Use{" "}
          <strong className="font-medium text-foreground">Download JSON</strong>{" "}
          to save this layout and{" "}
          <strong className="font-medium text-foreground">Upload JSON</strong>{" "}
          (upload icon) to restore it.
        </p>
      </div>
    </div>
  );
}
