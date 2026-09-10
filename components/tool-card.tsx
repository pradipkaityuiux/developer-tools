"use client";

import { useRouter } from "next/navigation";
import { ToolIcon } from "@/components/tool-icon";
import type { ToolEntry } from "@/lib/tool-catalog";

export function ToolCard({ tool }: { tool: ToolEntry }) {
  const router = useRouter();

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(tool.href)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(tool.href);
        }
      }}
      className="group relative flex h-full cursor-pointer flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-orange-500 hover:bg-zinc-50/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-orange-500 dark:hover:bg-zinc-900/80 dark:focus-visible:outline-zinc-100"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-medium text-foreground">{tool.name}</span>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/20 text-orange-500 transition-transform duration-200 group-hover:scale-110 dark:bg-orange-500/20 dark:text-orange-400">
          <ToolIcon name={tool.icon} className="h-4 w-4" />
        </div>
      </div>
      <span className="mt-3 block text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {tool.description}
      </span>
    </div>
  );
}
