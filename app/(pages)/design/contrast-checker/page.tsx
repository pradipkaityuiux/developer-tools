import type { Metadata } from "next";
import Link from "next/link";
import { ContrastCheckerTool } from "./contrast-checker-tool";
import { contrastCheckerFaqItems } from "@/lib/contrast-checker-faq";
import { toolSections } from "@/lib/tool-catalog";

const designTools =
  toolSections.find((s) => s.id === "design-color-tools")?.tools ?? [];
const relatedTools = designTools.filter(
  (t) => t.href !== "/design/contrast-checker",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/design/contrast-checker",
  },
};

export default function ContrastCheckerPage() {
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
            <span className="text-foreground">Color contrast checker</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            WCAG color contrast checker — AA and AAA ratios for text and UI
            backgrounds
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online color contrast checker
            </strong>{" "}
            to validate{" "}
            <strong className="font-medium text-foreground">
              text color vs background color
            </strong>{" "}
            pairs against{" "}
            <strong className="font-medium text-foreground">
              WCAG 2.1 contrast ratios
            </strong>
            . Enter{" "}
            <strong className="font-medium text-foreground">HEX</strong> values,
            use native{" "}
            <strong className="font-medium text-foreground">
              color pickers
            </strong>
            , and see whether your combination passes{" "}
            <strong className="font-medium text-foreground">AA</strong> or{" "}
            <strong className="font-medium text-foreground">AAA</strong> for{" "}
            <strong className="font-medium text-foreground">normal text</strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">large text</strong>.
            Copy foreground, background, or the numeric ratio with one click.
            Optional:{" "}
            <strong className="font-medium text-foreground">
              upload a screenshot
            </strong>{" "}
            and sample pixels into the text or background slot—everything runs in
            your browser, so brand palettes and customer UI mockups stay private.
            Pair this tool with the{" "}
            <Link
              href="/design/color-picker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color picker and converter
            </Link>
            , explore harmonies in the{" "}
            <Link
              href="/design/palette-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color palette generator
            </Link>
            , and preview inclusive palettes with the{" "}
            <Link
              href="/design/color-blindness-simulator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color blindness simulator
            </Link>
            . Browse all utilities in{" "}
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
        <ContrastCheckerTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why contrast ratio matters for accessibility, SEO, and brand trust
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Search engines increasingly reward pages that work well for real
            users, and readable text is a core part of that story.{" "}
            <strong className="font-medium text-foreground">
              Accessible color contrast
            </strong>{" "}
            helps people with low vision, color deficiency, or glare on mobile
            screens actually use your interface. Teams also search for{" "}
            <strong className="font-medium text-foreground">
              WCAG AA contrast
            </strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">
              WCAG AAA contrast
            </strong>{" "}
            when they need procurement or legal alignment, or when they ship
            design systems with documented tokens. This page uses the same sRGB
            luminance steps defined in the Web Content Accessibility Guidelines
            so your numbers line up with audits and browser tools.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Designers often pair a{" "}
            <strong className="font-medium text-foreground">
              primary brand color
            </strong>{" "}
            with neutrals; developers implement those as CSS variables. Before
            merging, run each{" "}
            <strong className="font-medium text-foreground">
              heading and body pair
            </strong>{" "}
            through a contrast checker. For gradients and hero images, test the
            lightest and darkest regions behind copy. When you need lighter or
            darker steps from one hue, the{" "}
            <Link
              href="/design/tint-shade-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              tint and shade generator
            </Link>{" "}
            builds a predictable scale; bring those HEX codes back here to
            confirm ratios.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this WCAG contrast checker (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Set <strong className="font-medium text-foreground">text</strong>{" "}
                (foreground) and{" "}
                <strong className="font-medium text-foreground">background</strong>{" "}
                colors using the pickers or by typing{" "}
                <strong className="font-medium text-foreground">HEX</strong>{" "}
                (three or six-digit forms such as #f4f4f5 or #abc). Press Enter
                or blur the field to apply.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read the live preview and the{" "}
                <strong className="font-medium text-foreground">
                  contrast ratio
                </strong>{" "}
                (for example 7.12:1). Rows below show whether you meet{" "}
                <strong className="font-medium text-foreground">AA</strong> and{" "}
                <strong className="font-medium text-foreground">AAA</strong> for
                normal and large text, with minimum thresholds shown.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use <strong className="font-medium text-foreground">Swap colors</strong>{" "}
                if you pasted the pair reversed. Use the copy icon beside each
                HEX field or{" "}
                <strong className="font-medium text-foreground">
                  Copy contrast ratio
                </strong>{" "}
                to paste values into Figma variables, CSS, or tickets.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Optional: click{" "}
                <strong className="font-medium text-foreground">
                  Upload image
                </strong>{" "}
                (upload icon) or drag a mockup into the dashed area. Choose
                whether clicks apply to the text or background color, then
                click the image canvas to sample a pixel.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Normal text vs large text thresholds (quick reference)
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            For standard body copy and most UI labels, aim for at least{" "}
            <strong className="font-medium text-foreground">4.5:1</strong> for
            WCAG AA and{" "}
            <strong className="font-medium text-foreground">7:1</strong> for
            AAA. For{" "}
            <strong className="font-medium text-foreground">large text</strong>{" "}
            (approximately 18pt regular or 14pt bold and larger), AA allows{" "}
            <strong className="font-medium text-foreground">3:1</strong> and AAA
            allows <strong className="font-medium text-foreground">4.5:1</strong>.
            Icons and thin strokes that act as text still need sufficient
            separation from adjacent colors—when in doubt, measure the worst
            neighboring pair.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Gradients, shadows, and dark mode
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            This tool measures two solid sRGB colors. For{" "}
            <strong className="font-medium text-foreground">
              linear and radial gradients
            </strong>
            , test the stops behind your text. The{" "}
            <Link
              href="/design/gradient-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              gradient generator
            </Link>{" "}
            and{" "}
            <Link
              href="/design/css-gradient"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSS gradient generator
            </Link>{" "}
            help you iterate visually; export HEX stops and verify them here.
            For <strong className="font-medium text-foreground">dark mode</strong>
            , repeat checks because swapped surfaces change both luminance and
            perceived hue.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related design and color tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Explore the full{" "}
            <Link
              href="/#design-color-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              design and color tools
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
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            If you are tuning shadows and depth, the{" "}
            <Link
              href="/design/box-shadow-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              box shadow generator
            </Link>{" "}
            complements flat color checks—still verify any text sitting on
            tinted surfaces.
          </p>
        </article>

        <section className="mt-16 max-w-3xl" aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            Frequently asked questions
          </h2>
          <dl className="mt-6 space-y-4">
            {contrastCheckerFaqItems.map((item) => (
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
