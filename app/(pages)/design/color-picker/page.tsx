import type { Metadata } from "next";
import Link from "next/link";
import { ColorPickerTool } from "./color-picker-tool";
import { colorPickerFaqItems } from "@/lib/color-picker-faq";
import { toolSections } from "@/lib/tool-catalog";

const designTools =
  toolSections.find((s) => s.id === "design-color-tools")?.tools ?? [];
const relatedTools = designTools.filter((t) => t.href !== "/design/color-picker");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/design/color-picker",
  },
};

export default function ColorPickerPage() {
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
            <span className="text-foreground">Color picker &amp; converter</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Color picker &amp; converter — HEX, RGB, HSL &amp; CMYK for web and
            print handoff
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online color picker
            </strong>{" "}
            to choose a color, read exact{" "}
            <strong className="font-medium text-foreground">
              HEX, RGB, HSL, and CMYK
            </strong>{" "}
            values, and{" "}
            <strong className="font-medium text-foreground">
              copy CSS-ready strings
            </strong>{" "}
            with one click. Adjust channels numerically, use the native color
            control, try{" "}
            <strong className="font-medium text-foreground">
              Sample from screen
            </strong>{" "}
            where the EyeDropper API exists, or{" "}
            <strong className="font-medium text-foreground">
              upload an image
            </strong>{" "}
            and click to sample a pixel from mockups and screenshots. Everything
            runs in your browser for privacy-friendly{" "}
            <strong className="font-medium text-foreground">
              color conversion
            </strong>
            . Pair this page with our{" "}
            <Link
              href="/design/contrast-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color contrast checker
            </Link>{" "}
            for WCAG text pairs, the{" "}
            <Link
              href="/design/palette-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color palette generator
            </Link>{" "}
            for harmonies, and the{" "}
            <Link
              href="/design/gradient-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              gradient generator
            </Link>{" "}
            for CSS backgrounds. Browse more in{" "}
            <Link
              href="/#design-color-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Design &amp; color tools
            </Link>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <ColorPickerTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why designers and developers use a HEX, RGB, HSL, and CMYK converter
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Product teams juggle{" "}
            <strong className="font-medium text-foreground">
              design tokens
            </strong>
            , Figma specs, CSS, and print briefs. A single{" "}
            <strong className="font-medium text-foreground">brand color</strong>{" "}
            might be noted as{" "}
            <strong className="font-medium text-foreground">HEX</strong> in a
            repo,{" "}
            <strong className="font-medium text-foreground">
              rgb() or hsl()
            </strong>{" "}
            in stylesheets, and{" "}
            <strong className="font-medium text-foreground">CMYK</strong> for
            brochures. This tool keeps those views in sync: pick once, copy the
            format your stack needs. Searchers often look for{" "}
            <strong className="font-medium text-foreground">
              HEX to RGB converter
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              RGB to HSL online
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              RGB to CMYK for print
            </strong>
            —the math here matches common sRGB conversions used on the web, with
            clear copy buttons so you do not retype values by hand.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            For{" "}
            <strong className="font-medium text-foreground">
              accessibility workflows
            </strong>
            , picking a foreground or background is only half the job; you still
            need contrast ratios against neighboring colors. After you lock a
            hue here, open the{" "}
            <Link
              href="/design/contrast-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              WCAG contrast checker
            </Link>{" "}
            to validate AA/AAA targets. To explore{" "}
            <strong className="font-medium text-foreground">
              complementary or triadic sets
            </strong>{" "}
            from a base swatch, use the{" "}
            <Link
              href="/design/palette-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              palette generator
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this color picker (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Choose a color with the{" "}
                <strong className="font-medium text-foreground">
                  native color input
                </strong>
                , or type a{" "}
                <strong className="font-medium text-foreground">
                  HEX code
                </strong>{" "}
                (three- or six-digit). The large swatch updates live.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Fine-tune{" "}
                <strong className="font-medium text-foreground">R, G, B</strong>{" "}
                (0–255),{" "}
                <strong className="font-medium text-foreground">H, S, L</strong>,
                or{" "}
                <strong className="font-medium text-foreground">C, M, Y, K</strong>{" "}
                fields—all representations stay linked to the same sRGB color.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Press{" "}
                <strong className="font-medium text-foreground">Copy</strong>{" "}
                (with the copy icon) beside HEX, RGB, HSL, or CMYK to copy that
                string to the clipboard for CSS, Slack, or tickets.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                On Chromium browsers, try{" "}
                <strong className="font-medium text-foreground">
                  Sample from screen
                </strong>{" "}
                to use the system eyedropper on any pixel on your display.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Upload image
                </strong>{" "}
                (upload icon), select a raster image, then click the preview to
                sample a pixel—ideal for matching UI colors from screenshots.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            CMYK vs screen color: what to tell your print vendor
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Monitors emit light (RGB); ink on paper absorbs it (CMYK). Any{" "}
            <strong className="font-medium text-foreground">
              RGB to CMYK conversion
            </strong>{" "}
            is a model, not a guarantee of how a specific press will look. Use
            the CMYK copy here as a{" "}
            <strong className="font-medium text-foreground">
              starting reference
            </strong>{" "}
            and always follow up with a physical proof and your printer&apos;s ICC
            profile. For purely digital work—websites, apps, and Figma—stick to
            HEX or RGB/HSL in{" "}
            <strong className="font-medium text-foreground">sRGB</strong>.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related design tools on this site
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Explore the full{" "}
            <Link
              href="/#design-color-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Design &amp; color tools
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
            {colorPickerFaqItems.map((item) => (
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
