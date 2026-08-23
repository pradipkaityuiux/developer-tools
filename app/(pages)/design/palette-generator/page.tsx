import type { Metadata } from "next";
import Link from "next/link";
import { PaletteGeneratorTool } from "./palette-generator-tool";
import { paletteGeneratorFaqItems } from "@/lib/palette-generator-faq";
import { toolSections } from "@/lib/tool-catalog";

const designTools =
  toolSections.find((s) => s.id === "design-color-tools")?.tools ?? [];
const relatedTools = designTools.filter(
  (t) => t.href !== "/design/palette-generator",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/design/palette-generator",
  },
};

export default function PaletteGeneratorPage() {
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
            <span className="text-foreground">Color palette generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Color palette generator online — complementary, triadic, analogous,
            and monochrome schemes from one base hue
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online color palette generator
            </strong>{" "}
            to turn a single{" "}
            <strong className="font-medium text-foreground">
              brand color or sampled photo
            </strong>{" "}
            into production-ready{" "}
            <strong className="font-medium text-foreground">
              HEX swatches
            </strong>{" "}
            for{" "}
            <strong className="font-medium text-foreground">
              complementary, triadic, analogous, and monochromatic
            </strong>{" "}
            harmonies. Adjust{" "}
            <strong className="font-medium text-foreground">
              HSL (hue, saturation, lightness)
            </strong>{" "}
            with sliders, paste{" "}
            <strong className="font-medium text-foreground">#RRGGBB</strong>{" "}
            values, or click{" "}
            <strong className="font-medium text-foreground">
              Upload image
            </strong>{" "}
            (with the upload icon) to average pixels from a mood-board asset.
            Every swatch includes a{" "}
            <strong className="font-medium text-foreground">
              copy icon button
            </strong>{" "}
            for one-click HEX, plus{" "}
            <strong className="font-medium text-foreground">
              copy entire palette rows
            </strong>{" "}
            as comma-separated codes or{" "}
            <strong className="font-medium text-foreground">
              CSS custom properties
            </strong>
            . Processing stays{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            —ideal for design systems, marketing sites, and SaaS dashboards.
            Pair results with the{" "}
            <Link
              href="/design/contrast-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              WCAG contrast checker
            </Link>
            , the{" "}
            <Link
              href="/design/color-picker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color picker and converter
            </Link>{" "}
            for RGB and HSL strings, and the{" "}
            <Link
              href="/design/tint-shade-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              tint and shade generator
            </Link>{" "}
            when you need a fuller lightness scale. Explore all{" "}
            <Link
              href="/#design-color-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              design and color tools
            </Link>{" "}
            from the home page.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <PaletteGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why harmony palettes matter for branding and UI systems
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Random HEX values are hard to defend in design reviews. A{" "}
            <strong className="font-medium text-foreground">
              structured color palette
            </strong>{" "}
            anchored to one hue keeps marketing, product, and engineering aligned
            on which accents belong together.{" "}
            <strong className="font-medium text-foreground">
              Complementary schemes
            </strong>{" "}
            emphasize opposition on the color wheel—great for alerts and primary
            buttons on neutral shells.{" "}
            <strong className="font-medium text-foreground">
              Triadic palettes
            </strong>{" "}
            distribute energy across three primaries, which helps data
            visualizations and multi-state components stay distinct.{" "}
            <strong className="font-medium text-foreground">
              Analogous palettes
            </strong>{" "}
            feel calm because neighboring hues blend smoothly—common in editorial
            layouts and health or finance brands.{" "}
            <strong className="font-medium text-foreground">
              Monochrome ramps
            </strong>{" "}
            fix hue and saturation while stepping lightness, which mirrors how
            teams define surface layers, borders, and disabled states in a single
            brand color.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Searchers often look for{" "}
            <strong className="font-medium text-foreground">
              complementary color generator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              triadic color scheme maker
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              extract palette from image
            </strong>
            . This page combines those workflows: mathematical HSL rotations for
            harmonies, optional bitmap sampling for inspiration, and copyable
            output for handoff. Harmony alone does not guarantee accessible
            text—always validate pairs against WCAG contrast targets before
            shipping production CSS.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this palette generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Set your{" "}
                <strong className="font-medium text-foreground">
                  base color
                </strong>{" "}
                with the native color picker, type a HEX code such as{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-900">
                  #0ea5e9
                </code>
                , or move the{" "}
                <strong className="font-medium text-foreground">
                  hue, saturation, and lightness
                </strong>{" "}
                sliders until the anchor matches your brand guidelines.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Optionally click{" "}
                <strong className="font-medium text-foreground">
                  Upload image
                </strong>{" "}
                to average colors from a logo, screenshot, or mood board. Refine
                the result with sliders if the photo skews gray or brown.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Review the four sections—{" "}
                <strong className="font-medium text-foreground">
                  complementary, triadic, analogous, and monochrome
                </strong>
                . Use the{" "}
                <strong className="font-medium text-foreground">Copy</strong>{" "}
                control (with the copy icon) on each swatch, or copy an entire row
                as a HEX list or{" "}
                <strong className="font-medium text-foreground">
                  CSS variables
                </strong>{" "}
                block for your stylesheet or token JSON.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Paste values into Figma variables, Tailwind theme extensions, or
                design tokens. Before finalizing UI text colors, run the same HEX
                values through the{" "}
                <Link
                  href="/design/contrast-checker"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  contrast checker
                </Link>{" "}
                and preview states with the{" "}
                <Link
                  href="/design/color-blindness-simulator"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  color blindness simulator
                </Link>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            HSL, HEX, and why we rotate hue for harmonies
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            This tool computes harmonies in{" "}
            <strong className="font-medium text-foreground">HSL space</strong>{" "}
            and converts to{" "}
            <strong className="font-medium text-foreground">sRGB HEX</strong> for
            interoperability. Rotating{" "}
            <strong className="font-medium text-foreground">hue</strong> by fixed
            degrees (for example 180° for complements, 120° steps for triads)
            matches how designers are taught the color wheel. Saturation and
            lightness stay tied to your base for each harmony group so palettes
            feel cohesive; the{" "}
            <strong className="font-medium text-foreground">monochrome</strong>{" "}
            section instead steps lightness while locking hue and saturation,
            which is the usual pattern for neutral-adjacent UI layers.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Internal tools that complete a color workflow
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            After you export HEX codes, convert them to other formats with the{" "}
            <Link
              href="/design/color-picker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color picker and converter
            </Link>
            , build gradients for hero sections with the{" "}
            <Link
              href="/design/gradient-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              gradient generator
            </Link>{" "}
            or{" "}
            <Link
              href="/design/css-gradient"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSS gradient
            </Link>{" "}
            tools, and prototype shadows and radii with the{" "}
            <Link
              href="/design/box-shadow-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              box shadow
            </Link>{" "}
            and{" "}
            <Link
              href="/design/border-radius-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              border radius
            </Link>{" "}
            generators. For web performance and SEO audits unrelated to color,
            browse{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP headers
            </Link>{" "}
            and{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags
            </Link>{" "}
            utilities when you ship landing pages that showcase your new palette.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related design and color tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Highlights from the{" "}
            <Link
              href="/#design-color-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              design and color tools
            </Link>{" "}
            section:
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
            {paletteGeneratorFaqItems.map((item) => (
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
