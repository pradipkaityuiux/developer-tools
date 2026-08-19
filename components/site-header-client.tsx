"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { ToolEntry, ToolSection } from "@/lib/tool-catalog";
import { GlobalToolSearchOverlay } from "@/components/global-tool-search-overlay";
import Image from "next/image";

type SiteHeaderClientProps = {
  tools: ToolEntry[];
  sections: ToolSection[];
};

export function SiteHeaderClient({ tools, sections }: SiteHeaderClientProps) {
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const closeMega = useCallback(() => setMegaOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    if (!megaOpen && !searchOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [megaOpen, searchOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setSearchOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-200/90 bg-white/90 backdrop-blur-md dark:border-zinc-800/90 dark:bg-zinc-950/90">
        <div className="relative mx-auto flex h-14 max-w-6xl items-center px-4 sm:px-6">
          <div className="flex flex-1 justify-start">
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setMegaOpen((o) => !o);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:hover:bg-zinc-800 dark:focus-visible:outline-zinc-100"
              aria-expanded={megaOpen}
              aria-controls="site-mega-menu"
              aria-label={megaOpen ? "Close menu" : "Open menu"}
            >
              {megaOpen ? (
                <X className="h-5 w-5" aria-hidden />
              ) : (
                <Menu className="h-5 w-5" aria-hidden />
              )}
            </button>
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Link
              href="/"
              className="pointer-events-auto inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground hover:opacity-80"
            >
              <span className="relative h-8 w-8 shrink-0">
                <Image
                  src="/Logo-light.png"
                  alt=""
                  width={32}
                  height={32}
                  className="dark:hidden"
                />
                <Image
                  src="/Logo.png"
                  alt=""
                  width={32}
                  height={32}
                  className="hidden dark:block"
                />
              </span>
              <span>Zero Snippet</span>
            </Link>
          </div>

          <div className="flex flex-1 gap-3 justify-end">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-base font-normal tracking-tight text-foreground hover:opacity-80"
            >Blogs</Link>
            <button
              type="button"
              onClick={() => {
                setMegaOpen(false);
                setSearchOpen(true);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:hover:bg-zinc-800 dark:focus-visible:outline-zinc-100"
              aria-label="Search tools"
            >
              <Search className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {megaOpen ? (
        <div
          id="site-mega-menu"
          className="fixed inset-x-0 bottom-0 top-14 z-40 flex flex-col bg-background/95 backdrop-blur-sm dark:bg-zinc-950/95"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div
            className="absolute inset-0 bg-black/30 dark:bg-black/50"
            aria-hidden
            onClick={closeMega}
          />
          <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 pb-6 pt-4 sm:px-6">
            <nav
              className="mt-4 max-h-[min(100dvh-5.5rem,calc(100vh-5.5rem))] flex-1 overflow-y-auto overscroll-contain rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
              aria-label="Tools by category"
            >
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {sections.map((section) => (
                  <section
                    key={section.id}
                    className="px-4 py-5 sm:px-6"
                    aria-labelledby={`mega-${section.id}`}
                  >
                    <h2
                      id={`mega-${section.id}`}
                      className="text-base font-semibold tracking-tight text-foreground"
                    >
                      {section.title}
                    </h2>
                    <ul className="mt-3 grid list-none gap-1 sm:grid-cols-2 lg:grid-cols-3">
                      {section.tools.map((tool) => (
                        <li key={tool.href}>
                          <Link
                            href={tool.href}
                            onClick={closeMega}
                            className="block rounded-lg px-2 py-2 text-sm text-foreground transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
                          >
                            <span className="font-medium">{tool.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </nav>
          </div>
        </div>
      ) : null}

      <GlobalToolSearchOverlay
        open={searchOpen}
        onClose={closeSearch}
        tools={tools}
      />
    </>
  );
}
