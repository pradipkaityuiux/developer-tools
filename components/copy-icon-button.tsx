"use client";

import { Check, Copy } from "lucide-react";

type CopyIconButtonProps = {
  copied: boolean;
  onClick: () => void;
  disabled?: boolean;
  title: string;
  "aria-label": string;
  /** corner = overlay on multiline fields (textarea/pre); inline = end of a single-line row */
  placement?: "corner" | "inline";
  className?: string;
};

export function CopyIconButton({
  copied,
  onClick,
  disabled,
  title,
  "aria-label": ariaLabel,
  placement = "inline",
  className = "",
}: CopyIconButtonProps) {
  const placementClass =
    placement === "corner"
      ? "absolute right-2 top-2 border-zinc-200 bg-zinc-50/95 backdrop-blur-sm hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950/95 dark:hover:bg-zinc-900"
      : "inline-flex shrink-0 border-zinc-300 bg-white hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center rounded-md border p-1.5 text-foreground transition-colors disabled:pointer-events-none disabled:opacity-40 ${placementClass} ${className}`.trim()}
    >
      {copied ? (
        <Check
          className="size-[1.125rem] text-emerald-600 dark:text-emerald-400"
          aria-hidden
        />
      ) : (
        <Copy className="size-[1.125rem]" aria-hidden />
      )}
    </button>
  );
}
