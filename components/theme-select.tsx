"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const options = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

export function ThemeSelect() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) {
    return (
      <span
        className="inline-block h-9 min-w-[8.5rem] rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
        aria-hidden
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="theme-select" className="sr-only">
        Theme
      </label>
      <select
        id="theme-select"
        value={theme ?? "light"}
        onChange={(e) => setTheme(e.target.value)}
        className="h-9 min-w-[8.5rem] cursor-pointer rounded-md border border-zinc-200 bg-white px-2.5 text-sm text-foreground shadow-sm outline-none transition-colors hover:border-zinc-300 focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600 dark:focus-visible:ring-zinc-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
