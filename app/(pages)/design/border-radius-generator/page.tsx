import type { Metadata } from "next";
import Link from "next/link";
import { BorderRadiusGeneratorTool } from "./border-radius-generator-tool";
import { borderRadiusFaqItems } from "@/lib/border-radius-faq";
import { toolSections } from "@/lib/tool-catalog";

const designTools =
  toolSections.find((s) => s.id === "design-color-tools")?.tools ?? [];
const relatedTools = designTools.filter(
  (t) => t.href !== "/design/border-radius-generator",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/design/border-radius-generator",
  },
};

export default function BorderRadiusGeneratorPage() {
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
            <Link
              href="/#design-color-tools"
              className="hover:text-foreground"
            >
              Design &amp; color tools
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span className="text-foreground">Border radius generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Border radius generator — CSS corner radii with live preview and
            copy-ready shorthand
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              border radius generator online
            </strong>{" "}
            to craft{" "}
            <strong className="font-medium text-foreground">
              border-radius
            </strong>{" "}
            values for{" "}
            <strong className="font-medium text-foreground">cards</strong>,{" "}
            <strong className="font-medium text-foreground">modals</strong>,{" "}
            <strong className="font-medium text-foreground">buttons</strong>,
            and{" "}
            <strong className="font-medium text-foreground">
              image frames
            </strong>
            . Adjust{" "}
            <strong className="font-medium text-foreground">
              top-left, top-right, bottom-right, and bottom-left
            </strong>{" "}
            in{" "}
            <strong className="font-medium text-foreground">px</strong>,{" "}
            <strong className="font-medium text-foreground">rem</strong>, or{" "}
            <strong className="font-medium text-foreground">percent</strong>,
            or link corners for a single control. Use{" "}
            <strong className="font-medium text-foreground">Pill</strong> for
            the standard{" "}
            <code className="rounded bg-zinc-200/80 px-1 font-mono text-sm dark:bg-zinc-800">
              9999px
            </code>{" "}
            chip pattern.{" "}
            <strong className="font-medium text-foreground">
              Upload image
            </strong>{" "}
            (upload icon) to preview how a photo looks inside rounded bounds;
            press{" "}
            <strong className="font-medium text-foreground">Copy CSS</strong>{" "}
            (copy icon) for optimized shorthand. Everything runs locally in your
            browser. For shadows around the same component, pair output with the{" "}
            <Link
              href="/design/box-shadow-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              box shadow generator
            </Link>
            ; for fills and gradients behind the radius, try the{" "}
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
            tool. Explore the full{" "}
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
        <BorderRadiusGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why a dedicated border-radius tool helps design systems and handoff
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Product teams express{" "}
            <strong className="font-medium text-foreground">radius scales</strong>{" "}
            in design tokens—often 2, 4, 8, 12, 16 px or rem equivalents. Engineers
            still need the exact{" "}
            <strong className="font-medium text-foreground">
              border-radius shorthand
            </strong>{" "}
            that matches mockups when corners are not uniform (for example a
            card with only the top corners rounded). Guessing the four-value
            order or whether two-value shorthand applies slows code review. This
            page shows the live shape, emits minimal CSS, and documents the
            clockwise corner order so{" "}
            <strong className="font-medium text-foreground">
              CSS border radius generator
            </strong>{" "}
            searches resolve to a repeatable workflow. Combine radii with
            accessible color choices from the{" "}
            <Link
              href="/design/color-picker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color picker
            </Link>{" "}
            and verify text contrast with the{" "}
            <Link
              href="/design/contrast-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              contrast checker
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this border radius CSS generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Choose{" "}
                <strong className="font-medium text-foreground">px</strong>,{" "}
                <strong className="font-medium text-foreground">rem</strong>, or{" "}
                <strong className="font-medium text-foreground">%</strong>. Use
                rem when your design system ties radii to typography; use % for
                circular avatars or fluid shapes where the box size changes.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Enable{" "}
                <strong className="font-medium text-foreground">
                  Link all corners
                </strong>{" "}
                for a single slider, or disable it to set each corner on its own
                (order: top-left, top-right, bottom-right, bottom-left).
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">Pill</strong>{" "}
                when you need a capsule button or tag: output becomes{" "}
                <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
                  border-radius: 9999px;
                </code>
                , which is the usual pattern for horizontal pills of any width.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Optional: use{" "}
                <strong className="font-medium text-foreground">
                  Upload image
                </strong>{" "}
                to drop a screenshot or photo into the preview so you can see
                clipping against a checkerboard. Remove the image when you are
                done.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use quick presets (None through{" "}
                <strong className="font-medium text-foreground">24px</strong>
                ) to snap to common pixel radii; values convert to your active
                unit. Then press{" "}
                <strong className="font-medium text-foreground">Copy CSS</strong>{" "}
                and paste into stylesheets, Tailwind arbitrary values, or token
                files.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Border radius vs layout: Flexbox, Grid, and shadows
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Rounding affects paint, not document flow. Structure content first in
            the{" "}
            <Link
              href="/design/flexbox-playground"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Flexbox playground
            </Link>{" "}
            or{" "}
            <Link
              href="/design/css-grid-playground"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSS grid playground
            </Link>
            , then apply{" "}
            <strong className="font-medium text-foreground">
              border-radius
            </strong>{" "}
            on the container or image. Depth and elevation usually come from{" "}
            <Link
              href="/design/box-shadow-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              box-shadow
            </Link>{" "}
            layered with your radii so cards read clearly in light and dark
            themes.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            SEO and performance: CSS radii instead of bitmap corners
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Vector-friendly{" "}
            <strong className="font-medium text-foreground">
              rounded corners
            </strong>{" "}
            scale with resolution and zoom without extra PNG or WebP assets.
            That supports fast LCP when you avoid oversized full-bleed images
            for simple rounding. Keep decorative gradients in CSS when possible
            using the{" "}
            <Link
              href="/design/gradient-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              gradient generator
            </Link>{" "}
            so marketing copy stays selectable and accessible. For inclusive
            color palettes before you lock radii globally, generate scales with
            the{" "}
            <Link
              href="/design/tint-shade-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              tint and shade generator
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related design and developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
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
            {borderRadiusFaqItems.map((item) => (
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
