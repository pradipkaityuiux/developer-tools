import type { Metadata } from "next";
import Link from "next/link";
import { CssGradientTool } from "./css-gradient-tool";
import { cssGradientFaqItems } from "@/lib/css-gradient-faq";
import { toolSections } from "@/lib/tool-catalog";

const designTools =
  toolSections.find((s) => s.id === "design-color-tools")?.tools ?? [];
const relatedTools = designTools.filter((t) => t.href !== "/design/css-gradient");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/design/css-gradient",
  },
};

export default function CssGradientPage() {
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
            <span className="text-foreground">CSS Gradient Generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            CSS Gradient Generator — multi-stop linear and radial gradients with
            keywords and repeating CSS
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              multi-stop CSS gradient generator online
            </strong>{" "}
            to compose{" "}
            <strong className="font-medium text-foreground">
              linear-gradient
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              radial-gradient
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              repeating-linear-gradient
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              repeating-radial-gradient
            </strong>{" "}
            declarations for hero sections, cards, buttons, and mesh-style
            backgrounds. Set up to twelve{" "}
            <strong className="font-medium text-foreground">color stops</strong>{" "}
            with exact percentages, choose{" "}
            <strong className="font-medium text-foreground">
              degree angles
            </strong>{" "}
            or standard{" "}
            <strong className="font-medium text-foreground">
              CSS direction keywords
            </strong>{" "}
            (for example{" "}
            <code className="rounded bg-zinc-200/80 px-1 font-mono text-sm dark:bg-zinc-800">
              to bottom right
            </code>
            ), optionally{" "}
            <strong className="font-medium text-foreground">
              sample colors from an image
            </strong>{" "}
            (upload icon), preview live, then copy with the{" "}
            <strong className="font-medium text-foreground">copy icon</strong>.
            Processing stays in your browser. For faster two- to five-stop
            workflows, try the{" "}
            <Link
              href="/design/gradient-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Gradient Generator
            </Link>
            . Explore the full{" "}
            <Link
              href="/#design-color-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              design and color tools
            </Link>{" "}
            list on the home page.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <CssGradientTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            What is a multi-stop CSS gradient and when to use one
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            A{" "}
            <strong className="font-medium text-foreground">
              multi-stop gradient
            </strong>{" "}
            transitions through several colors along a line (linear) or from a
            center (radial). Unlike a simple two-color fade, many stops let you
            mimic{" "}
            <strong className="font-medium text-foreground">
              brand rainbows
            </strong>
            , sunset palettes, metallic highlights, and data-viz style ramps
            without raster images. Searchers often look for{" "}
            <strong className="font-medium text-foreground">
              CSS gradient generator with multiple colors
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              gradient color stops
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              repeating gradient CSS
            </strong>
            —this page targets those intents with editable stops, optional
            repetition, and copy-ready output.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Pair gradients with solid tokens from the{" "}
            <Link
              href="/design/color-picker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color picker and converter
            </Link>{" "}
            and validate text contrast using the{" "}
            <Link
              href="/design/contrast-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color contrast checker
            </Link>{" "}
            when typography sits on top of your background.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Angles versus direction keywords in linear-gradient
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            The CSS Images specification allows either a{" "}
            <strong className="font-medium text-foreground">
              bearing in degrees
            </strong>{" "}
            (0° points up; 90° points right) or{" "}
            <strong className="font-medium text-foreground">
              side keywords
            </strong>{" "}
            such as{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              to right
            </code>{" "}
            and{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              to bottom left
            </code>
            . Degrees are ideal when you are matching a design tool’s rotation
            value; keywords read clearly in code review and design handoff. This
            tool lets you flip between both without losing your stop list.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Repeating gradients for stripes, textures, and rhythm
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">
              repeating-linear-gradient
            </strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">
              repeating-radial-gradient
            </strong>{" "}
            tile the color-stop pattern—useful for subtle stripes, debug-style
            backgrounds, and decorative borders when combined with{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              background-size
            </code>
            . Preview here until the rhythm matches your component; then paste
            into your stylesheet or utility framework.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this CSS Gradient Generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Choose{" "}
                <strong className="font-medium text-foreground">Linear</strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">Radial</strong>
                . Enable{" "}
                <strong className="font-medium text-foreground">
                  Repeating gradient
                </strong>{" "}
                when you need tiled repeating CSS functions.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                For linear gradients, pick{" "}
                <strong className="font-medium text-foreground">
                  Angle (deg)
                </strong>{" "}
                and move the slider, or switch to{" "}
                <strong className="font-medium text-foreground">
                  Direction keywords
                </strong>{" "}
                and tap a{" "}
                <strong className="font-medium text-foreground">to …</strong>{" "}
                preset.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                For radial gradients, select{" "}
                <strong className="font-medium text-foreground">circle</strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">ellipse</strong>{" "}
                and adjust{" "}
                <strong className="font-medium text-foreground">
                  center X/Y
                </strong>{" "}
                until the spotlight fits your layout.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Edit{" "}
                <strong className="font-medium text-foreground">
                  color stops
                </strong>
                : use the swatch and hex field, set percentages,{" "}
                <strong className="font-medium text-foreground">Add stop</strong>{" "}
                (up to twelve), or remove extras. Optional:{" "}
                <strong className="font-medium text-foreground">
                  Upload image
                </strong>{" "}
                (upload icon) to seed stops from photo bands.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                When the live preview looks right, use{" "}
                <strong className="font-medium text-foreground">
                  Copy gradient
                </strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">
                  Copy background-image
                </strong>{" "}
                (copy icon) to copy CSS to the clipboard.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            CSS formatting and maintenance in larger codebases
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Long gradient strings are easier to maintain when you align stops with
            design tokens or run the output through the{" "}
            <Link
              href="/dev/css-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSS formatter
            </Link>{" "}
            for consistent wrapping. For component libraries, consider extracting
            the gradient into a CSS variable or theme key so marketing and
            product surfaces stay synchronized.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related design and developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            More from the{" "}
            <Link
              href="/#design-color-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              design and color tools
            </Link>{" "}
            category:
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
            {cssGradientFaqItems.map((item) => (
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
