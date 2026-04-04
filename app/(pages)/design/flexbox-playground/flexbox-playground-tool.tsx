"use client";

import { Check, Copy, Minus, Plus } from "lucide-react";
import type { CSSProperties } from "react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
type JustifyContent =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
type AlignItems = "stretch" | "flex-start" | "flex-end" | "center" | "baseline";
type AlignContent =
  | "stretch"
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
type AlignSelf =
  | "auto"
  | "stretch"
  | "flex-start"
  | "flex-end"
  | "center"
  | "baseline";
type BasisMode = "auto" | "zero" | "custom";

export type FlexItemState = {
  id: string;
  flexGrow: number;
  flexShrink: number;
  basisMode: BasisMode;
  basisPx: number;
  alignSelf: AlignSelf;
  order: number;
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

function randomId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function basisCss(mode: BasisMode, basisPx: number): string {
  if (mode === "auto") return "auto";
  if (mode === "zero") return "0";
  return `${clamp(basisPx, 0, 999)}px`;
}

export function buildFlexboxCss(args: {
  className: string;
  direction: FlexDirection;
  wrap: FlexWrap;
  justifyContent: JustifyContent;
  alignItems: AlignItems;
  alignContent: AlignContent;
  gapPx: number;
  items: FlexItemState[];
}): string {
  const {
    className,
    direction,
    wrap,
    justifyContent,
    alignItems,
    alignContent,
    gapPx,
    items,
  } = args;
  const lines: string[] = [];
  lines.push(`.${className} {`);
  lines.push(`  display: flex;`);
  lines.push(`  flex-direction: ${direction};`);
  lines.push(`  flex-wrap: ${wrap};`);
  lines.push(`  justify-content: ${justifyContent};`);
  lines.push(`  align-items: ${alignItems};`);
  lines.push(`  align-content: ${alignContent};`);
  lines.push(`  gap: ${gapPx}px;`);
  lines.push(`}`);
  items.forEach((item, i) => {
    const basis = basisCss(item.basisMode, item.basisPx);
    const flexLine = `  flex: ${item.flexGrow} ${item.flexShrink} ${basis};`;
    lines.push(``);
    lines.push(`.${className} > :nth-child(${i + 1}) {`);
    lines.push(flexLine);
    if (item.alignSelf !== "auto") {
      lines.push(`  align-self: ${item.alignSelf};`);
    }
    if (item.order !== 0) {
      lines.push(`  order: ${item.order};`);
    }
    lines.push(`}`);
  });
  return lines.join("\n");
}

const DEFAULT_ITEMS: FlexItemState[] = [
  {
    id: randomId(),
    flexGrow: 0,
    flexShrink: 1,
    basisMode: "auto",
    basisPx: 80,
    alignSelf: "auto",
    order: 0,
  },
  {
    id: randomId(),
    flexGrow: 1,
    flexShrink: 1,
    basisMode: "zero",
    basisPx: 80,
    alignSelf: "auto",
    order: 0,
  },
  {
    id: randomId(),
    flexGrow: 0,
    flexShrink: 1,
    basisMode: "custom",
    basisPx: 96,
    alignSelf: "auto",
    order: 0,
  },
  {
    id: randomId(),
    flexGrow: 0,
    flexShrink: 1,
    basisMode: "auto",
    basisPx: 80,
    alignSelf: "auto",
    order: 0,
  },
];

export function FlexboxPlaygroundTool() {
  const [direction, setDirection] = useState<FlexDirection>("row");
  const [wrap, setWrap] = useState<FlexWrap>("nowrap");
  const [justifyContent, setJustifyContent] =
    useState<JustifyContent>("flex-start");
  const [alignItems, setAlignItems] = useState<AlignItems>("stretch");
  const [alignContent, setAlignContent] = useState<AlignContent>("stretch");
  const [gapPx, setGapPx] = useState(12);
  const [items, setItems] = useState<FlexItemState[]>(DEFAULT_ITEMS);
  const [selectedId, setSelectedId] = useState<string | null>(
    () => DEFAULT_ITEMS[0]!.id,
  );
  const [copied, setCopied] = useState(false);

  const selected = items.find((x) => x.id === selectedId) ?? items[0] ?? null;

  const cssText = useMemo(
    () =>
      buildFlexboxCss({
        className: "flex-container",
        direction,
        wrap,
        justifyContent,
        alignItems,
        alignContent,
        gapPx,
        items,
      }),
    [
      direction,
      wrap,
      justifyContent,
      alignItems,
      alignContent,
      gapPx,
      items,
    ],
  );

  const containerStyle = useMemo(
    () =>
      ({
        display: "flex",
        flexDirection: direction,
        flexWrap: wrap,
        justifyContent,
        alignItems,
        alignContent,
        gap: `${gapPx}px`,
        minHeight: direction.startsWith("column") ? 280 : 160,
        minWidth: direction.startsWith("row") ? "100%" : undefined,
      }) as CSSProperties,
    [direction, wrap, justifyContent, alignItems, alignContent, gapPx],
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

  const updateSelected = useCallback(
    (patch: Partial<FlexItemState>) => {
      if (!selected) return;
      setItems((prev) =>
        prev.map((x) => (x.id === selected.id ? { ...x, ...patch } : x)),
      );
    },
    [selected],
  );

  const addItem = useCallback(() => {
    if (items.length >= 12) return;
    const next: FlexItemState = {
      id: randomId(),
      flexGrow: 0,
      flexShrink: 1,
      basisMode: "auto",
      basisPx: 80,
      alignSelf: "auto",
      order: 0,
    };
    setItems((s) => [...s, next]);
    setSelectedId(next.id);
  }, [items.length]);

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
    setDirection("row");
    setWrap("nowrap");
    setJustifyContent("flex-start");
    setAlignItems("stretch");
    setAlignContent("stretch");
    setGapPx(12);
    const fresh = DEFAULT_ITEMS.map((x) => ({ ...x, id: randomId() }));
    setItems(fresh);
    setSelectedId(fresh[0]!.id);
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              Flex items
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
          </div>

          <div
            className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-600 dark:bg-zinc-900/40"
            role="group"
            aria-label="Live flexbox preview"
          >
            <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <div style={containerStyle}>
                {items.map((item, i) => {
                  const basis = basisCss(item.basisMode, item.basisPx);
                  const itemStyle: CSSProperties = {
                    flexGrow: item.flexGrow,
                    flexShrink: item.flexShrink,
                    flexBasis: basis,
                    alignSelf: item.alignSelf === "auto" ? "auto" : item.alignSelf,
                    order: item.order,
                  };
                  const active = item.id === selected?.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      style={itemStyle}
                      className={`flex min-h-[52px] min-w-[52px] items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-sm transition-[box-shadow,outline] ${
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
              Click a colored box to edit that item&apos;s flex properties.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-foreground">
              Container
            </legend>
            <div>
              <label
                htmlFor="flex-direction"
                className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                flex-direction
              </label>
              <select
                id="flex-direction"
                value={direction}
                onChange={(e) =>
                  setDirection(e.target.value as FlexDirection)
                }
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                <option value="row">row</option>
                <option value="row-reverse">row-reverse</option>
                <option value="column">column</option>
                <option value="column-reverse">column-reverse</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="flex-wrap"
                className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                flex-wrap
              </label>
              <select
                id="flex-wrap"
                value={wrap}
                onChange={(e) => setWrap(e.target.value as FlexWrap)}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                <option value="nowrap">nowrap</option>
                <option value="wrap">wrap</option>
                <option value="wrap-reverse">wrap-reverse</option>
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
                  setJustifyContent(e.target.value as JustifyContent)
                }
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                <option value="flex-start">flex-start</option>
                <option value="flex-end">flex-end</option>
                <option value="center">center</option>
                <option value="space-between">space-between</option>
                <option value="space-around">space-around</option>
                <option value="space-evenly">space-evenly</option>
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
                <option value="flex-start">flex-start</option>
                <option value="flex-end">flex-end</option>
                <option value="center">center</option>
                <option value="baseline">baseline</option>
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
                  setAlignContent(e.target.value as AlignContent)
                }
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                <option value="stretch">stretch</option>
                <option value="flex-start">flex-start</option>
                <option value="flex-end">flex-end</option>
                <option value="center">center</option>
                <option value="space-between">space-between</option>
                <option value="space-around">space-around</option>
                <option value="space-evenly">space-evenly</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="gap-range"
                className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
              >
                gap: {gapPx}px
              </label>
              <input
                id="gap-range"
                type="range"
                min={0}
                max={48}
                value={gapPx}
                onChange={(e) => setGapPx(Number(e.target.value))}
                className="mt-2 w-full accent-foreground"
              />
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
                    htmlFor="flex-grow"
                    className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                  >
                    flex-grow
                  </label>
                  <input
                    id="flex-grow"
                    type="number"
                    min={0}
                    max={8}
                    value={selected.flexGrow}
                    onChange={(e) =>
                      updateSelected({
                        flexGrow: clamp(Number(e.target.value) || 0, 0, 8),
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  />
                </div>
                <div>
                  <label
                    htmlFor="flex-shrink"
                    className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                  >
                    flex-shrink
                  </label>
                  <input
                    id="flex-shrink"
                    type="number"
                    min={0}
                    max={8}
                    value={selected.flexShrink}
                    onChange={(e) =>
                      updateSelected({
                        flexShrink: clamp(Number(e.target.value) || 0, 0, 8),
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="basis-mode"
                  className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  flex-basis
                </label>
                <select
                  id="basis-mode"
                  value={selected.basisMode}
                  onChange={(e) =>
                    updateSelected({
                      basisMode: e.target.value as BasisMode,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                >
                  <option value="auto">auto</option>
                  <option value="zero">0</option>
                  <option value="custom">custom (px)</option>
                </select>
                {selected.basisMode === "custom" && (
                  <input
                    type="number"
                    min={0}
                    max={999}
                    value={selected.basisPx}
                    onChange={(e) =>
                      updateSelected({
                        basisPx: clamp(Number(e.target.value) || 0, 0, 999),
                      })
                    }
                    className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
                    aria-label="Flex basis in pixels"
                  />
                )}
              </div>
              <div>
                <label
                  htmlFor="align-self"
                  className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  align-self
                </label>
                <select
                  id="align-self"
                  value={selected.alignSelf}
                  onChange={(e) =>
                    updateSelected({
                      alignSelf: e.target.value as AlignSelf,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                >
                  <option value="auto">auto (inherit)</option>
                  <option value="stretch">stretch</option>
                  <option value="flex-start">flex-start</option>
                  <option value="flex-end">flex-end</option>
                  <option value="center">center</option>
                  <option value="baseline">baseline</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="order"
                  className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  order
                </label>
                <input
                  id="order"
                  type="number"
                  min={-12}
                  max={12}
                  value={selected.order}
                  onChange={(e) =>
                    updateSelected({
                      order: clamp(Number(e.target.value) || 0, -12, 12),
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
                />
              </div>
            </fieldset>
          )}
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label
            htmlFor="flexbox-css-output"
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
          id="flexbox-css-output"
          readOnly
          value={cssText}
          rows={14}
          className="mt-2 w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50 p-4 font-mono text-xs leading-relaxed text-foreground dark:border-zinc-800 dark:bg-zinc-950"
          spellCheck={false}
        />
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Rename{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
            .flex-container
          </code>{" "}
          to match your markup. Child rules use{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-900">
            :nth-child
          </code>{" "}
          so order matches the DOM.
        </p>
      </div>
    </div>
  );
}
