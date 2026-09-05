import type { Metadata } from "next";
import Link from "next/link";
import { ToolSearch } from "@/components/tool-search";
import { ToolIcon } from "@/components/tool-icon";
import { HeroCommitGrid } from "@/components/hero-commit-grid";
import { allTools, toolSections, totalToolCount } from "@/lib/tool-catalog";

export const metadata: Metadata = {
  title: "Free developer tools — JSON, regex, SEO, color, and 100+ utilities",
  description:
    "Browse 100 free online tools for developers and marketers: website checks, code formatters, text utilities, files, design, security, and SEO — fast, client-side friendly utilities.",
  openGraph: {
    title: "Free developer tools — 100+ online utilities",
    description:
      "Website, code, text, file, design, security, and SEO tools in one place. Pick a tool and go.",
  },
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="relative border-b border-zinc-200/80 bg-zinc-50/80 dark:border-zinc-800/80 dark:bg-zinc-950">
        <HeroCommitGrid />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Online tools for building, shipping, and optimizing the web
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {totalToolCount} curated utilities organized by category—format data,
            check URLs, tune SEO, work with text and files, and more. Each tile
            links to a dedicated tool page.
          </p>
          <ToolSearch tools={allTools} />
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-16 sm:gap-20">
          {toolSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              className="scroll-mt-8"
            >
              <h2
                id={`${section.id}-heading`}
                className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
              >
                {section.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {section.tools.length}{" "}
                {section.tools.length === 1 ? "tool" : "tools"}
              </p>

              <ul className="mt-6 grid list-none gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {section.tools.map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      className="group relative flex h-full flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-orange-500 hover:bg-zinc-50/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-orange-500 dark:hover:bg-zinc-900/80 dark:focus-visible:outline-zinc-100"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-medium text-foreground">
                          {tool.name}
                        </span>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/20 text-orange-500 transition-transform duration-200 group-hover:scale-110 dark:bg-orange-500/20 dark:text-orange-400">
                          <ToolIcon name={tool.icon} className="h-4 w-4" />
                        </div>
                      </div>
                      <span className="mt-3 block text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {tool.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
