"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ToolEntry } from "@/lib/tool-catalog";

function matchesQuery(tool: ToolEntry, raw: string): boolean {
  const q = raw.trim().toLowerCase();
  if (!q) return false;
  const haystack = `${tool.name} ${tool.description}`.toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);
  return tokens.every((t) => haystack.includes(t));
}

type ToolSearchProps = {
  tools: ToolEntry[];
};

const MAX_RESULTS = 20;

export function ToolSearch({ tools }: ToolSearchProps) {
  const router = useRouter();
  const uid = useId();
  const inputId = `tool-search-input${uid}`;
  const listboxId = `tool-search-results${uid}`;
  const containerRef = useRef<HTMLDivElement>(null);
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
      router.push(href);
    },
    [router],
  );

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
    <div ref={containerRef} className="relative mt-6 max-w-xl">
      <label htmlFor={inputId} className="sr-only">
        Search tools by name or keyword
      </label>
      <input
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
        className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none placeholder:text-zinc-400 focus-visible:border-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:focus-visible:border-zinc-500 dark:focus-visible:ring-zinc-600"
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
          className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
        >
          {results.map((tool, index) => (
            <li key={tool.href} role="presentation">
              <Link
                href={tool.href}
                role="option"
                aria-selected={index === activeIndex}
                className={`block px-3 py-2.5 text-sm transition-colors ${
                  index === activeIndex
                    ? "bg-zinc-100 dark:bg-zinc-800"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
              >
                <span className="font-medium text-foreground">{tool.name}</span>
                <span className="mt-0.5 block text-xs leading-snug text-zinc-500 dark:text-zinc-400">
                  {tool.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
