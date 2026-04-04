"use client";

import { X } from "lucide-react";
import { ToolSearchPanel } from "@/components/tool-search";
import type { ToolEntry } from "@/lib/tool-catalog";

type GlobalToolSearchOverlayProps = {
  open: boolean;
  onClose: () => void;
  tools: ToolEntry[];
};

export function GlobalToolSearchOverlay({
  open,
  onClose,
  tools,
}: GlobalToolSearchOverlayProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col bg-black/50 backdrop-blur-[2px] dark:bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
    >
      <div className="absolute inset-0" aria-hidden onClick={onClose} />
      <div className="relative z-10 mx-auto mt-[max(1rem,8vh)] w-full max-w-xl px-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-700 dark:bg-zinc-950">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-foreground">Search tools</p>
            <button
              type="button"
              onClick={onClose}
              className="-m-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-foreground dark:hover:bg-zinc-800"
              aria-label="Close search"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <ToolSearchPanel
            tools={tools}
            className="mt-3"
            autoFocus
            onNavigate={onClose}
          />
        </div>
      </div>
    </div>
  );
}
