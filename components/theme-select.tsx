"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themes = [
  { value: "light" as const, label: "Light", Icon: Sun },
  { value: "dark" as const, label: "Dark", Icon: Moon },
  { value: "system" as const, label: "System", Icon: Monitor },
];

export function ThemeFloatingToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) {
    return (
      <div
        className="fixed bottom-4 right-4 z-[90] flex h-11 w-[7.25rem] rounded-full border border-zinc-200 bg-white/90 shadow-lg backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-900/90"
        aria-hidden
      />
    );
  }

  const active = theme ?? "light";

  return (
    <div
      className="fixed bottom-4 right-4 z-[90] flex items-center gap-0.5 rounded-full border border-zinc-200 bg-white/95 p-1 shadow-lg backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-900/95"
      role="group"
      aria-label="Theme"
    >
      {themes.map(({ value, label, Icon }) => {
        const isOn = active === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100 ${
              isOn
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-foreground"
            }`}
            aria-pressed={isOn}
            aria-label={label}
            title={label}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
