import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 font-mono text-sm leading-relaxed">
      <p className="text-zinc-500 dark:text-zinc-400">404</p>
      <h1 className="mt-2 text-base font-semibold tracking-tight text-foreground">
        Page not found
      </h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        This URL does not match any route. The tool or page may not be built yet.
      </p>
      <p className="mt-10">
        <Link
          href="/"
          className="underline decoration-zinc-400 underline-offset-4 hover:decoration-foreground"
        >
          ← Home
        </Link>
      </p>
    </div>
  );
}
