import Link from "next/link";
import { ThemeSelect } from "./theme-select";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/90 bg-white/90 backdrop-blur-md dark:border-zinc-800/90 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground hover:opacity-80"
        >
          Zero Snippet
        </Link>
        <ThemeSelect />
      </div>
    </header>
  );
}
