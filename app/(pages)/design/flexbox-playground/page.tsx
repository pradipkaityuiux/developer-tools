import type { Metadata } from "next";
import Link from "next/link";
import { FlexboxPlaygroundTool } from "./flexbox-playground-tool";
import { flexboxPlaygroundFaqItems } from "@/lib/flexbox-playground-faq";
import { toolSections } from "@/lib/tool-catalog";

const designTools =
  toolSections.find((s) => s.id === "design-color-tools")?.tools ?? [];
const relatedTools = designTools.filter(
  (t) => t.href !== "/design/flexbox-playground",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/design/flexbox-playground",
  },
};

export default function FlexboxPlaygroundPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-zinc-200/80 bg-zinc-50/80 dark:border-zinc-800/80 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <nav className="text-sm text-zinc-500 dark:text-zinc-400">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span className="text-foreground">Flexbox playground</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Flexbox playground — interactive CSS flex layout lab with live preview
            and copyable styles
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This free{" "}
            <strong className="font-medium text-foreground">
              online flexbox playground
            </strong>{" "}
            helps you learn and ship{" "}
            <strong className="font-medium text-foreground">
              CSS Flexible Box Layout
            </strong>{" "}
            without memorizing every keyword. Adjust{" "}
            <strong className="font-medium text-foreground">
              flex-direction
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">flex-wrap</strong>,{" "}
            <strong className="font-medium text-foreground">
              justify-content
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">align-items</strong>,{" "}
            <strong className="font-medium text-foreground">
              align-content
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">gap</strong> on the
            container, then click any demo item to tune{" "}
            <strong className="font-medium text-foreground">flex-grow</strong>,{" "}
            <strong className="font-medium text-foreground">flex-shrink</strong>
            ,{" "}
            <strong className="font-medium text-foreground">flex-basis</strong>,{" "}
            <strong className="font-medium text-foreground">align-self</strong>,
            and{" "}
            <strong className="font-medium text-foreground">order</strong>. The
            preview updates immediately; use{" "}
            <strong className="font-medium text-foreground">Copy CSS</strong>{" "}
            (copy icon) to paste production rules into your codebase. Everything
            runs{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            . For two-dimensional templates, continue with the{" "}
            <Link
              href="/design/css-grid-playground"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSS Grid playground
            </Link>
            ; for accessible color pairs on top of your layout, use the{" "}
            <Link
              href="/design/contrast-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color contrast checker
            </Link>
            . Browse the full{" "}
            <Link
              href="/#design-color-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              design and color tools
            </Link>{" "}
            on the home page.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <FlexboxPlaygroundTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why developers use a flexbox playground for real UI work
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Searchers look for a{" "}
            <strong className="font-medium text-foreground">
              flexbox visualizer
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              flexbox sandbox
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              CSS flex generator
            </strong>{" "}
            because flexbox behavior depends on{" "}
            <strong className="font-medium text-foreground">
              main axis vs cross axis
            </strong>
            , whether items wrap, and how{" "}
            <strong className="font-medium text-foreground">
              free space
            </strong>{" "}
            is distributed. Toggling{" "}
            <strong className="font-medium text-foreground">
              justify-content: space-between
            </strong>{" "}
            next to{" "}
            <strong className="font-medium text-foreground">center</strong> in a
            live preview is faster than editing CSS in DevTools and losing your
            place. This page targets those workflows with numbered demo items,
            clear container controls, and a textarea that mirrors what you would
            ship—plus optional cleanup of your broader stylesheet with our{" "}
            <Link
              href="/dev/css-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSS formatter and minifier
            </Link>
            .
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Common product tasks—{" "}
            <strong className="font-medium text-foreground">
              responsive navigation
            </strong>
            , splitting a toolbar into left and right groups, vertically
            centering icons beside text, and building equal-height card
            footers—are all flexbox-shaped problems. Pair this lab with the{" "}
            <Link
              href="/design/border-radius-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              border radius generator
            </Link>{" "}
            and{" "}
            <Link
              href="/design/box-shadow-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              box shadow generator
            </Link>{" "}
            when you are polishing cards and buttons built with flex rows.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Flexbox guide: main axis, cross axis, and when wrapping matters
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            In{" "}
            <strong className="font-medium text-foreground">
              flex-direction: row
            </strong>
            , the main axis runs horizontally and{" "}
            <strong className="font-medium text-foreground">
              justify-content
            </strong>{" "}
            spreads items along that line. In{" "}
            <strong className="font-medium text-foreground">column</strong>, the
            main axis is vertical, so justify-content affects vertical packing
            instead—often surprising the first time you prototype a dashboard.
            The cross axis is perpendicular:{" "}
            <strong className="font-medium text-foreground">
              align-items
            </strong>{" "}
            lines up items on that axis for each row or column. When{" "}
            <strong className="font-medium text-foreground">
              flex-wrap
            </strong>{" "}
            is <strong className="font-medium text-foreground">wrap</strong> or{" "}
            <strong className="font-medium text-foreground">
              wrap-reverse
            </strong>
            , you get multiple flex lines;{" "}
            <strong className="font-medium text-foreground">
              align-content
            </strong>{" "}
            controls how those lines are spaced along the cross axis (useful for
            chip lists and tag clouds). Use the playground to flip direction and
            wrap while watching the same numbered items move.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this flexbox playground (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Under{" "}
                <strong className="font-medium text-foreground">Container</strong>
                , set{" "}
                <strong className="font-medium text-foreground">
                  flex-direction
                </strong>{" "}
                and{" "}
                <strong className="font-medium text-foreground">flex-wrap</strong>
                , then choose{" "}
                <strong className="font-medium text-foreground">
                  justify-content
                </strong>
                ,{" "}
                <strong className="font-medium text-foreground">
                  align-items
                </strong>
                , and{" "}
                <strong className="font-medium text-foreground">
                  align-content
                </strong>
                . Adjust the <strong className="font-medium text-foreground">gap</strong>{" "}
                slider for consistent spacing without margins on every child.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click a colored box in the preview to select it. In{" "}
                <strong className="font-medium text-foreground">
                  Selected item
                </strong>
                , change{" "}
                <strong className="font-medium text-foreground">flex-grow</strong>{" "}
                and{" "}
                <strong className="font-medium text-foreground">
                  flex-shrink
                </strong>
                , pick a{" "}
                <strong className="font-medium text-foreground">
                  flex-basis
                </strong>{" "}
                mode (<strong className="font-medium text-foreground">auto</strong>
                , <strong className="font-medium text-foreground">0</strong>, or a
                custom pixel width), and optionally override{" "}
                <strong className="font-medium text-foreground">align-self</strong>{" "}
                or <strong className="font-medium text-foreground">order</strong>.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use{" "}
                <strong className="font-medium text-foreground">Add item</strong>{" "}
                and <strong className="font-medium text-foreground">Remove</strong>{" "}
                to change how many flex items participate—up to twelve—then{" "}
                <strong className="font-medium text-foreground">Reset demo</strong>{" "}
                to restore the starter layout.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Scroll to <strong className="font-medium text-foreground">Generated CSS</strong>{" "}
                and press{" "}
                <strong className="font-medium text-foreground">Copy CSS</strong>{" "}
                (copy icon). Rename{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  .flex-container
                </code>{" "}
                to match your component class or styled wrapper.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Flexbox vs CSS Grid for page layout
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Flexbox excels at distributing items in a single row or column and
            handling variable content (think form fields that grow, icons that
            stay fixed). Grid excels at two-dimensional areas and explicit tracks.
            Many production pages use Grid for the outer shell and Flexbox inside
            cards and headers. After you settle flex behavior here, open the{" "}
            <Link
              href="/design/css-grid-playground"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSS Grid playground
            </Link>{" "}
            when you need template columns and row spans. For background decoration
            on flex children, the{" "}
            <Link
              href="/design/gradient-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              gradient generator
            </Link>{" "}
            pairs well with flex rows and hero sections.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related design and developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            More utilities from our catalog:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {relatedTools.map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  {tool.name}
                </Link>
                {" — "}
                <span className="text-zinc-600 dark:text-zinc-400">
                  {tool.description}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <section className="mt-16 max-w-3xl" aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            Frequently asked questions
          </h2>
          <dl className="mt-6 space-y-4">
            {flexboxPlaygroundFaqItems.map((item) => (
              <div
                key={item.question}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <dt className="font-medium text-foreground">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </div>
  );
}
