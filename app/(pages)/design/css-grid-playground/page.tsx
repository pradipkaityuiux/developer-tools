import type { Metadata } from "next";
import Link from "next/link";
import { CssGridPlaygroundTool } from "./css-grid-playground-tool";
import { cssGridPlaygroundFaqItems } from "@/lib/css-grid-playground-faq";
import { toolSections } from "@/lib/tool-catalog";

const designTools =
  toolSections.find((s) => s.id === "design-color-tools")?.tools ?? [];
const relatedTools = designTools.filter(
  (t) => t.href !== "/design/css-grid-playground",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/design/css-grid-playground",
  },
};

export default function CssGridPlaygroundPage() {
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
            <span className="text-foreground">CSS Grid playground</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            CSS Grid playground — interactive grid template lab with live preview,
            copyable CSS, and JSON layout import
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This free{" "}
            <strong className="font-medium text-foreground">
              online CSS Grid playground
            </strong>{" "}
            helps you prototype{" "}
            <strong className="font-medium text-foreground">
              grid-template-columns
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              grid-template-rows
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">gap</strong>,{" "}
            <strong className="font-medium text-foreground">
              justify-items
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">align-items</strong>,{" "}
            <strong className="font-medium text-foreground">
              justify-content
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">align-content</strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              grid-auto-flow
            </strong>{" "}
            without guessing in DevTools. Click any numbered cell to edit{" "}
            <strong className="font-medium text-foreground">grid-column</strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">grid-row</strong>{" "}
            using start lines and spans. Use{" "}
            <strong className="font-medium text-foreground">Copy CSS</strong>{" "}
            (copy icon) for production rules; use{" "}
            <strong className="font-medium text-foreground">Upload JSON</strong>{" "}
            (upload icon) to restore a saved layout. Everything runs{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            . For one-dimensional rows and toolbars, pair this with the{" "}
            <Link
              href="/design/flexbox-playground"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Flexbox playground
            </Link>
            ; for accessible text and UI colors, use the{" "}
            <Link
              href="/design/contrast-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color contrast checker
            </Link>
            . Browse all{" "}
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
        <CssGridPlaygroundTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why use a CSS Grid playground for real interface work?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Teams search for a{" "}
            <strong className="font-medium text-foreground">
              CSS Grid generator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              grid layout visualizer
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              interactive grid tutorial
            </strong>{" "}
            because track sizing and placement interact: changing{" "}
            <strong className="font-medium text-foreground">fr</strong> units,{" "}
            <strong className="font-medium text-foreground">minmax()</strong>, or{" "}
            <strong className="font-medium text-foreground">repeat()</strong>{" "}
            shifts every line number. A live preview makes it obvious how{" "}
            <strong className="font-medium text-foreground">
              implicit rows
            </strong>{" "}
            grow when children need more space, and how{" "}
            <strong className="font-medium text-foreground">dense packing</strong>{" "}
            backfills holes when you use{" "}
            <strong className="font-medium text-foreground">
              grid-auto-flow: dense
            </strong>
            . This page targets those workflows with presets, custom track lists,
            per-item spans, and copy-ready CSS. When your stylesheet grows, clean
            it up with the{" "}
            <Link
              href="/dev/css-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSS formatter and minifier
            </Link>
            .
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Common product patterns—{" "}
            <strong className="font-medium text-foreground">
              dashboard shells
            </strong>
            , marketing sections with asymmetric columns, image galleries, and
            responsive card grids—map naturally to Grid. After you lock the outer
            grid, polish inner components with the{" "}
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
            </Link>
            , and add depth with the{" "}
            <Link
              href="/design/gradient-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              gradient generator
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            CSS Grid guide: tracks, lines, gaps, and alignment
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="font-medium text-foreground">
              grid-template-columns
            </strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">
              grid-template-rows
            </strong>{" "}
            define explicit tracks. Between and around them,{" "}
            <strong className="font-medium text-foreground">gap</strong> (or{" "}
            <strong className="font-medium text-foreground">row-gap</strong> /{" "}
            <strong className="font-medium text-foreground">column-gap</strong>)
            inserts gutters without margin hacks.{" "}
            <strong className="font-medium text-foreground">Line numbers</strong>{" "}
            start at 1 from the start edge; this tool generates{" "}
            <strong className="font-medium text-foreground">
              grid-column: &lt;start&gt; / span &lt;n&gt;
            </strong>{" "}
            and the same for rows so you can reason about spans without counting
            every line by hand.{" "}
            <strong className="font-medium text-foreground">
              justify-items
            </strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">align-items</strong>{" "}
            align each item inside its grid area;{" "}
            <strong className="font-medium text-foreground">
              justify-content
            </strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">align-content</strong>{" "}
            distribute extra space when the grid is smaller than the container—
            for example centering a fixed-width grid in a wide viewport.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this CSS Grid playground (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Under <strong className="font-medium text-foreground">Tracks</strong>
                , choose column and row presets (
                <strong className="font-medium text-foreground">
                  repeat(4, minmax(0, 1fr))
                </strong>
                , sidebar layouts,{" "}
                <strong className="font-medium text-foreground">auto-fill</strong>
                , and more) or switch to{" "}
                <strong className="font-medium text-foreground">Custom</strong> and
                paste your own track list. Set{" "}
                <strong className="font-medium text-foreground">
                  grid-auto-flow
                </strong>{" "}
                for row-first, column-first, or dense packing.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Under{" "}
                <strong className="font-medium text-foreground">
                  Gap &amp; alignment
                </strong>
                , adjust row and column gaps, then tune{" "}
                <strong className="font-medium text-foreground">
                  justify-items
                </strong>
                , <strong className="font-medium text-foreground">align-items</strong>
                , <strong className="font-medium text-foreground">
                  justify-content
                </strong>
                , and{" "}
                <strong className="font-medium text-foreground">align-content</strong>{" "}
                to match your design spec.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click a numbered cell in the preview. Under{" "}
                <strong className="font-medium text-foreground">
                  Selected item
                </strong>
                , set <strong className="font-medium text-foreground">
                  column start
                </strong>
                , <strong className="font-medium text-foreground">
                  column span
                </strong>
                , <strong className="font-medium text-foreground">row start</strong>
                , and{" "}
                <strong className="font-medium text-foreground">row span</strong>.
                Use <strong className="font-medium text-foreground">Add item</strong>{" "}
                and <strong className="font-medium text-foreground">Remove</strong>{" "}
                (up to twelve items) or{" "}
                <strong className="font-medium text-foreground">Reset demo</strong>{" "}
                to restore the starter grid.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Open <strong className="font-medium text-foreground">
                  Generated CSS
                </strong>{" "}
                and press{" "}
                <strong className="font-medium text-foreground">Copy CSS</strong>{" "}
                (copy icon). Rename{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  .grid-container
                </code>{" "}
                to your BEM or utility class name.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Optional: click{" "}
                <strong className="font-medium text-foreground">
                  Download JSON
                </strong>{" "}
                to save the full layout, then use{" "}
                <strong className="font-medium text-foreground">Upload JSON</strong>{" "}
                (upload icon) later to continue editing the same structure.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            CSS Grid vs Flexbox: practical split for production apps
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Grid is the default choice for{" "}
            <strong className="font-medium text-foreground">
              page-level layout
            </strong>{" "}
            and two-dimensional regions where both axes matter at once. Flexbox
            stays ideal for distributing a row of chips, aligning a label beside
            an input, or building a sticky footer inside a card. Ship the outer
            structure here, then open the{" "}
            <Link
              href="/design/flexbox-playground"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Flexbox playground
            </Link>{" "}
            for the inner one-dimensional details. For multi-stop backgrounds on
            grid areas, the{" "}
            <Link
              href="/design/css-gradient"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSS gradient generator
            </Link>{" "}
            exports matching gradient syntax.
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
            {cssGridPlaygroundFaqItems.map((item) => (
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
