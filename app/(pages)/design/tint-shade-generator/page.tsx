import type { Metadata } from "next";
import Link from "next/link";
import { TintShadeGeneratorTool } from "./tint-shade-generator-tool";
import { tintShadeFaqItems } from "@/lib/tint-shade-faq";
import { toolSections } from "@/lib/tool-catalog";

const designTools =
  toolSections.find((s) => s.id === "design-color-tools")?.tools ?? [];
const relatedTools = designTools.filter(
  (t) => t.href !== "/design/tint-shade-generator",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/design/tint-shade-generator",
  },
};

export default function TintShadeGeneratorPage() {
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
            <span className="text-foreground">Tint &amp; shade generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Tint &amp; shade generator — lighter tints and darker shades from
            one brand color
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online tint and shade generator
            </strong>{" "}
            to turn a single{" "}
            <strong className="font-medium text-foreground">hex color</strong>{" "}
            into a full{" "}
            <strong className="font-medium text-foreground">
              UI color scale
            </strong>
            :{" "}
            <strong className="font-medium text-foreground">tints</strong>{" "}
            (mixes toward white) on the left, your exact{" "}
            <strong className="font-medium text-foreground">base swatch</strong>{" "}
            in the center, and{" "}
            <strong className="font-medium text-foreground">shades</strong>{" "}
            (mixes toward black) on the right. Designers search for{" "}
            <strong className="font-medium text-foreground">
              tint color generator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              shade generator from hex
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              brand color ramp
            </strong>{" "}
            when documenting buttons, surfaces, and focus rings—this page
            produces those steps in seconds and copies production-ready values.
            Everything runs{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            . Pair the ramp with our{" "}
            <Link
              href="/design/contrast-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color contrast checker
            </Link>{" "}
            for WCAG text pairs, explore harmony with the{" "}
            <Link
              href="/design/palette-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color palette generator
            </Link>
            , and browse the full{" "}
            <Link
              href="/#design-color-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              design and color tools
            </Link>{" "}
            catalog on the home page.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <TintShadeGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why tints and shades matter for design systems and product UI
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            A single brand hex is rarely enough for production interfaces. You
            need{" "}
            <strong className="font-medium text-foreground">
              lighter backgrounds
            </strong>{" "}
            for cards and hover affordances,{" "}
            <strong className="font-medium text-foreground">
              darker fills
            </strong>{" "}
            for pressed states and borders, and predictable steps so engineers
            can map tokens like{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              --color-primary-600
            </code>{" "}
            without guessing. This{" "}
            <strong className="font-medium text-foreground">
              tint and shade tool
            </strong>{" "}
            builds that ramp by{" "}
            <strong className="font-medium text-foreground">
              linear RGB mixing
            </strong>{" "}
            with white and black—an approach that matches how many teams describe
            scales in brand guidelines and keeps the entire family visually tied
            to the same hue.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            If you also need{" "}
            <strong className="font-medium text-foreground">
              complementary or triadic palettes
            </strong>
            , start the base hue here, then open the{" "}
            <Link
              href="/design/palette-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              palette generator
            </Link>{" "}
            for multi-hue exploration. For gradients between two stops, use the{" "}
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
            tool. When you need raw channel conversions (HEX, RGB, HSL), the{" "}
            <Link
              href="/design/color-picker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color picker and converter
            </Link>{" "}
            stays in the same workflow.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this tint and shade generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Pick a{" "}
                <strong className="font-medium text-foreground">
                  base color
                </strong>{" "}
                with the native color input or type a six-digit hex. The center
                swatch always matches that exact value.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Optionally click{" "}
                <strong className="font-medium text-foreground">
                  Sample from image
                </strong>{" "}
                (upload icon) and choose a PNG, JPEG, or WebP—the tool averages
                opaque pixels in the tab and sets the result as your base—ideal
                for matching a logo or screenshot.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Set{" "}
                <strong className="font-medium text-foreground">
                  steps per side
                </strong>{" "}
                between 3 and 12. Higher values give more intermediate stops for
                dense dashboards; lower values keep documentation short.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click any swatch to copy its HEX (copy icon on hover), or use{" "}
                <strong className="font-medium text-foreground">
                  Copy all HEX
                </strong>{" "}
                /{" "}
                <strong className="font-medium text-foreground">
                  Copy CSS variables
                </strong>{" "}
                for token files. Rename the generated{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  --brand-*
                </code>{" "}
                names to match your system.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Before shipping text on colored surfaces, run candidate pairs
                through the{" "}
                <Link
                  href="/design/contrast-checker"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  WCAG contrast checker
                </Link>{" "}
                so body copy and labels meet AA or AAA where required.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and workflows this page supports
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Teams search for{" "}
            <strong className="font-medium text-foreground">
              make color lighter online
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              darken hex color
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              primary color scale
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              CSS custom properties from palette
            </strong>
            . This page answers those intents with a single interactive ramp,
            optional image sampling, and clipboard-friendly output—no account and
            no server-side color upload for the core generator.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and accessibility notes
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Image sampling uses the Canvas API inside your browser; images are not
            sent to our servers for color extraction. The base contrast numbers
            shown are simplified references against pure white and black—always
            validate real UI pairs. For inclusive visuals beyond contrast, the{" "}
            <Link
              href="/design/color-blindness-simulator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color blindness simulator
            </Link>{" "}
            helps preview palettes for common color-vision differences.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related design and color tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Explore more from the{" "}
            <Link
              href="/#design-color-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              design &amp; color tools
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
            {tintShadeFaqItems.map((item) => (
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
