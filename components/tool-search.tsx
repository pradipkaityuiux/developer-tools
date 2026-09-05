"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ToolEntry } from "@/lib/tool-catalog";
import { ToolIcon } from "@/components/tool-icon";

function matchesQuery(tool: ToolEntry, raw: string): boolean {
  const q = raw.trim().toLowerCase();
  if (!q) return false;
  const haystack = `${tool.name} ${tool.description}`.toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);
  return tokens.every((t) => haystack.includes(t));
}

type ToolSearchPanelProps = {
  tools: ToolEntry[];
  className?: string;
  /** Focus the input when mounted (e.g. global search dialog). */
  autoFocus?: boolean;
  /** Called after navigating to a tool (e.g. close overlay). */
  onNavigate?: () => void;
};

const MAX_RESULTS = 20;

export function ToolSearchPanel({
  tools,
  className = "",
  autoFocus = false,
  onNavigate,
}: ToolSearchPanelProps) {
  const router = useRouter();
  const uid = useId();
  const inputId = `tool-search-input${uid}`;
  const listboxId = `tool-search-results${uid}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return tools.filter((t) => matchesQuery(t, query)).slice(0, MAX_RESULTS);
  }, [query, tools]);

  const goTo = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      onNavigate?.();
      router.push(href);
    },
    [router, onNavigate],
  );

  useEffect(() => {
    if (!autoFocus) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [autoFocus]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const showList = open && query.trim().length > 0 && results.length > 0;

  return (
    <div ref={containerRef} className={`relative max-w-xl ${className}`}>
      <label htmlFor={inputId} className="sr-only">
        Search tools by name or keyword
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="search"
        autoComplete="off"
        placeholder="Search tools by name or keyword…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (!showList) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, results.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter" && results[activeIndex]) {
            e.preventDefault();
            goTo(results[activeIndex].href);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none placeholder:text-zinc-400 focus-visible:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:focus-visible:border-orange-500 dark:focus-visible:ring-orange-500/20"
        aria-expanded={showList}
        aria-controls={showList ? listboxId : undefined}
        aria-autocomplete="list"
        role="combobox"
      />

      {query.trim() && open && results.length === 0 ? (
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          No tools match that search.
        </p>
      ) : null}

      {showList ? (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 z-50 mt-1.5 max-h-80 w-full overflow-auto rounded-xl border border-zinc-200 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-950/95"
        >
          {results.map((tool, index) => (
            <li key={tool.href} role="presentation">
              <Link
                href={tool.href}
                role="option"
                aria-selected={index === activeIndex}
                className={`group flex items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  index === activeIndex
                    ? "bg-zinc-100 dark:bg-zinc-800/80"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                  onNavigate?.();
                }}
              >
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-foreground block truncate">
                    {tool.name}
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {tool.description}
                  </span>
                </div>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-orange-500/20 text-orange-500 transition-transform duration-200 group-hover:scale-110 dark:bg-orange-500/20 dark:text-orange-400">
                  <ToolIcon name={tool.icon} className="h-3.5 w-3.5" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

type ToolSearchProps = {
  tools: ToolEntry[];
};

/** Home hero search: full width with top margin. */
export function ToolSearch({ tools }: ToolSearchProps) {
  return <ToolSearchPanel tools={tools} className="mt-6" />;
}
