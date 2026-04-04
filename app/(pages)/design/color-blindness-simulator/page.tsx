import type { Metadata } from "next";
import Link from "next/link";
import { ColorBlindnessTool } from "./color-blindness-tool";
import { colorBlindnessFaqItems } from "@/lib/color-blindness-faq";
import { toolSections } from "@/lib/tool-catalog";

const designTools =
  toolSections.find((s) => s.id === "design-color-tools")?.tools ?? [];
const relatedTools = designTools.filter(
  (t) => t.href !== "/design/color-blindness-simulator",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/design/color-blindness-simulator",
  },
};

export default function ColorBlindnessSimulatorPage() {
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
            <span className="text-foreground">Color blindness simulator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Color blindness simulator — preview images and palettes for
            inclusive design
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This free{" "}
            <strong className="font-medium text-foreground">
              online color blindness simulator
            </strong>{" "}
            helps you preview{" "}
            <strong className="font-medium text-foreground">
              color vision deficiency (CVD)
            </strong>{" "}
            effects on{" "}
            <strong className="font-medium text-foreground">mockups</strong>,{" "}
            <strong className="font-medium text-foreground">charts</strong>, and{" "}
            <strong className="font-medium text-foreground">brand palettes</strong>
            . Upload an image with the{" "}
            <strong className="font-medium text-foreground">Upload</strong>{" "}
            control (Lucide upload icon), or paste{" "}
            <strong className="font-medium text-foreground">HEX</strong> colors
            to compare original vs simulated swatches. Models cover{" "}
            <strong className="font-medium text-foreground">protanopia</strong>
            ,{" "}
            <strong className="font-medium text-foreground">deuteranopia</strong>
            , and{" "}
            <strong className="font-medium text-foreground">tritanopia</strong>
            -style views plus optional{" "}
            <strong className="font-medium text-foreground">grayscale</strong>{" "}
            for designs that must not rely on hue alone. Copy simulated values
            with the{" "}
            <strong className="font-medium text-foreground">copy icon</strong>{" "}
            on palette exports. Processing stays in your browser—pair results
            with the{" "}
            <Link
              href="/design/contrast-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              WCAG color contrast checker
            </Link>
            , the{" "}
            <Link
              href="/design/palette-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color palette generator
            </Link>
            , and the{" "}
            <Link
              href="/design/color-picker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color picker and converter
            </Link>
            . Browse every utility in{" "}
            <Link
              href="/#design-color-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Design and Color Tools
            </Link>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <ColorBlindnessTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why teams use a CVD simulator before shipping UI and data graphics
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Roughly{" "}
            <strong className="font-medium text-foreground">
              one in twelve men
            </strong>{" "}
            of Northern European descent has some form of red–green color
            deficiency; rates vary by population. Interfaces that distinguish
            states only with red vs green, or charts that encode categories
            solely with saturated hues, fail for many users. A{" "}
            <strong className="font-medium text-foreground">
              color blind simulator online
            </strong>{" "}
            catches collisions early: legend colors that collapse together,
            error banners that disappear against backgrounds, and dashboard
            tiles that look identical under{" "}
            <strong className="font-medium text-foreground">deuteranopia</strong>
            . Simulation does not replace{" "}
            <strong className="font-medium text-foreground">
              WCAG contrast testing
            </strong>{" "}
            for text—that is what our contrast checker is for—or feedback from
            color blind users, but it is a fast, repeatable design QA step.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Keywords teams search for include{" "}
            <strong className="font-medium text-foreground">
              simulate color blindness for designers
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              inclusive color palette
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              accessible data visualization
            </strong>
            . This page targets those intents with client-side previews and
            copyable outputs so you can document decisions in Figma, Notion, or
            GitHub issues without sending assets to a server.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this color blindness simulator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Choose a{" "}
                <strong className="font-medium text-foreground">
                  simulation mode
                </strong>
                : red–green (protanopia or deuteranopia), blue–yellow
                (tritanopia), achromatopsia (luminance only), or normal as a
                reference baseline.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Adjust{" "}
                <strong className="font-medium text-foreground">severity</strong>{" "}
                for the red–green and blue–yellow models. Mild settings help when
                you suspect your audience includes anomalous trichromacy; full
                severity approximates dichromatic appearance on standard displays.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                On the{" "}
                <strong className="font-medium text-foreground">
                  Image preview
                </strong>{" "}
                tab, click the dashed area or use the upload icon to load a
                raster image. Compare the original and simulated canvases
                side by side. Use{" "}
                <strong className="font-medium text-foreground">Clear image</strong>{" "}
                to reset.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                On the{" "}
                <strong className="font-medium text-foreground">
                  Palette swatches
                </strong>{" "}
                tab, paste HEX codes (from the{" "}
                <Link
                  href="/design/tint-shade-generator"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  tint and shade generator
                </Link>{" "}
                or your design system). Use{" "}
                <strong className="font-medium text-foreground">
                  Copy simulated HEX list
                </strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">
                  Copy CSS comment block
                </strong>{" "}
                with the Lucide copy icon for handoff.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Models, monitors, and limitations
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            The transforms use published{" "}
            <strong className="font-medium text-foreground">
              Machado-style matrices
            </strong>{" "}
            in{" "}
            <strong className="font-medium text-foreground">linear sRGB</strong>
            , which matches how many accessibility tools reason about displays.
            Your monitor calibration, night mode, and wide-gamut profiles all
            change what you see; simulation is best for{" "}
            <strong className="font-medium text-foreground">
              relative comparison
            </strong>{" "}
            between design options. Always add non-color redundancy: labels,
            icons, patterns in fills, and table position—not hue alone.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related design and accessibility tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Explore the full{" "}
            <Link
              href="/#design-color-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Design and Color Tools
            </Link>{" "}
            section. Highlights:
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
                <span>{tool.description}</span>
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
            {colorBlindnessFaqItems.map((item) => (
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
