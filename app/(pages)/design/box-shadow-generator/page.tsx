import type { Metadata } from "next";
import Link from "next/link";
import { BoxShadowGeneratorTool } from "./box-shadow-generator-tool";
import { boxShadowGeneratorFaqItems } from "@/lib/box-shadow-generator-faq";
import { toolSections } from "@/lib/tool-catalog";

const designTools =
  toolSections.find((s) => s.id === "design-color-tools")?.tools ?? [];
const relatedTools = designTools.filter(
  (t) => t.href !== "/design/box-shadow-generator",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/design/box-shadow-generator",
  },
};

export default function BoxShadowGeneratorPage() {
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
            <span className="text-foreground">Box shadow generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            CSS box shadow generator — offset, blur, spread, color, inset, and
            copy-ready declarations
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online box shadow generator
            </strong>{" "}
            to design{" "}
            <strong className="font-medium text-foreground">
              drop shadows and inset shadows
            </strong>{" "}
            for cards, buttons, and modals without guessing pixel values. Adjust{" "}
            <strong className="font-medium text-foreground">
              horizontal and vertical offset
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              blur radius and spread
            </strong>
            , pick a{" "}
            <strong className="font-medium text-foreground">
              shadow color with opacity
            </strong>
            , and toggle{" "}
            <strong className="font-medium text-foreground">inset</strong> for
            pressed or recessed UI. The live preview updates instantly;{" "}
            <strong className="font-medium text-foreground">
              Copy CSS
            </strong>{" "}
            (with the copy icon) pastes a complete{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-900">
              box-shadow
            </code>{" "}
            line into Figma handoffs, Storybook, or your stylesheet. Optionally{" "}
            <strong className="font-medium text-foreground">
              upload a background image
            </strong>{" "}
            (upload icon) to judge contrast on real photography or dashboards.
            Everything runs in your browser—no account. Pair shadows with the{" "}
            <Link
              href="/design/border-radius-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              border radius generator
            </Link>
            ,{" "}
            <Link
              href="/design/gradient-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              gradient generator
            </Link>
            , and{" "}
            <Link
              href="/design/color-picker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color picker
            </Link>{" "}
            for cohesive UI kits. Browse all{" "}
            <Link
              href="/#design-color-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              design and color tools
            </Link>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <BoxShadowGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why use a dedicated box shadow generator for CSS?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            The{" "}
            <strong className="font-medium text-foreground">
              box-shadow
            </strong>{" "}
            syntax packs several numbers into one declaration: offsets, blur,
            spread, and color. Tweaking in DevTools is fast, but teams also need{" "}
            <strong className="font-medium text-foreground">
              repeatable elevation scales
            </strong>{" "}
            —for example “card resting,” “dropdown,” and “modal” shadows—that
            look right in light and dark themes. A visual{" "}
            <strong className="font-medium text-foreground">
              CSS shadow generator
            </strong>{" "}
            lets designers and developers agree on the same values, export one
            line of CSS, and document tokens without manual rounding errors.
            Searchers often look for{" "}
            <strong className="font-medium text-foreground">
              drop shadow generator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              inset shadow CSS
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              card shadow generator
            </strong>
            ; this page focuses on standards-based{" "}
            <strong className="font-medium text-foreground">
              box-shadow
            </strong>{" "}
            only (not SVG filters or text-shadow), so the output drops straight
            into component CSS.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How blur, spread, and opacity interact
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">Blur</strong>{" "}
            softens the shadow—high blur with small offset yields a diffuse
            ambient lift.{" "}
            <strong className="font-medium text-foreground">Spread</strong>{" "}
            expands or contracts the shadow before blurring: positive spread
            thickens the silhouette (useful for subtle borders made from
            shadow), negative spread tightens the halo for crisp, Apple-style
            elevations.{" "}
            <strong className="font-medium text-foreground">Opacity</strong>{" "}
            here scales the alpha channel of your chosen color so you can keep
            brand hue and only change strength—handy when the same RGBA token
            must work on both white cards and tinted surfaces. For accessible
            text on colored panels, validate contrast with the{" "}
            <Link
              href="/design/contrast-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color contrast checker
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this box shadow generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Start from a{" "}
                <strong className="font-medium text-foreground">preset</strong>{" "}
                (soft card, floating, crisp drop, or inset well) or set{" "}
                <strong className="font-medium text-foreground">offset X/Y</strong>
                ,{" "}
                <strong className="font-medium text-foreground">blur</strong>, and{" "}
                <strong className="font-medium text-foreground">spread</strong>{" "}
                manually.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Choose <strong className="font-medium text-foreground">shadow color</strong>{" "}
                with the color picker or hex field, then adjust{" "}
                <strong className="font-medium text-foreground">opacity</strong>{" "}
                for subtle elevation on dark backgrounds.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Enable{" "}
                <strong className="font-medium text-foreground">Inset shadow</strong>{" "}
                when you need an inner recess (buttons, wells) instead of a
                floating card.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Optionally click{" "}
                <strong className="font-medium text-foreground">
                  Upload background
                </strong>{" "}
                to preview the shadow on your own image; use{" "}
                <strong className="font-medium text-foreground">
                  Clear background
                </strong>{" "}
                to reset.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">Copy CSS</strong>{" "}
                to copy{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-900">
                  box-shadow: …;
                </code>{" "}
                into your codebase or design specs.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Layering shadows with gradients and radius
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Production UIs often combine{" "}
            <strong className="font-medium text-foreground">
              box-shadow
            </strong>{" "}
            with{" "}
            <strong className="font-medium text-foreground">
              border-radius
            </strong>{" "}
            and soft gradients. After you lock a shadow, round corners with the{" "}
            <Link
              href="/design/border-radius-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              border radius generator
            </Link>
            , build hero backgrounds using the{" "}
            <Link
              href="/design/css-gradient"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSS gradient generator
            </Link>{" "}
            or{" "}
            <Link
              href="/design/gradient-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              gradient generator
            </Link>
            , and keep brand hues aligned with the{" "}
            <Link
              href="/design/palette-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color palette generator
            </Link>
            . For raw stylesheet cleanup, use the{" "}
            <Link
              href="/dev/css-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSS formatter
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and workflows this tool supports
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Teams search for{" "}
            <strong className="font-medium text-foreground">
              material elevation CSS
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              neumorphism shadow
            </strong>{" "}
            (soft inset/outset combos),{" "}
            <strong className="font-medium text-foreground">
              tailwind shadow token
            </strong>{" "}
            references, and{" "}
            <strong className="font-medium text-foreground">
              copy paste box shadow
            </strong>
            . This generator emphasizes a single, clear declaration you can
            split into design tokens or extend with comma-separated layers in
            your own Sass or CSS variables. It does not replace full design
            tools, but it is ideal for quick handoffs and documentation pages.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related design tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            More from the{" "}
            <Link
              href="/#design-color-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              design and color tools
            </Link>{" "}
            collection:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {relatedTools.slice(0, 14).map((tool) => (
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
            {boxShadowGeneratorFaqItems.map((item) => (
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
