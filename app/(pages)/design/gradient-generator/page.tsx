import type { Metadata } from "next";
import Link from "next/link";
import { GradientGeneratorTool } from "./gradient-generator-tool";
import { gradientGeneratorFaqItems } from "@/lib/gradient-generator-faq";
import { toolSections } from "@/lib/tool-catalog";

const designTools =
  toolSections.find((s) => s.id === "design-color-tools")?.tools ?? [];
const relatedTools = designTools.filter(
  (t) => t.href !== "/design/gradient-generator",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/design/gradient-generator",
  },
};

export default function GradientGeneratorPage() {
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
            <span className="text-foreground">Gradient generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            CSS gradient generator — linear and radial blends with copy-ready
            background CSS
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This free{" "}
            <strong className="font-medium text-foreground">
              CSS gradient generator online
            </strong>{" "}
            helps you compose{" "}
            <strong className="font-medium text-foreground">
              linear-gradient
            </strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">
              radial-gradient
            </strong>{" "}
            values for hero sections, buttons, cards, and overlays. Tune{" "}
            <strong className="font-medium text-foreground">color stops</strong>
            ,{" "}
            <strong className="font-medium text-foreground">angles</strong>, and{" "}
            <strong className="font-medium text-foreground">
              radial centers
            </strong>
            , preview the result instantly, optionally{" "}
            <strong className="font-medium text-foreground">
              sample colors from an image
            </strong>{" "}
            (upload icon), then copy either the raw gradient function or a full{" "}
            <code className="rounded bg-zinc-200/80 px-1 font-mono text-sm dark:bg-zinc-800">
              background-image
            </code>{" "}
            line using the{" "}
            <strong className="font-medium text-foreground">copy icon</strong>.
            Everything runs in your browser; images are not sent to our servers.
            For solid colors and HEX or RGB conversion, open the{" "}
            <Link
              href="/design/color-picker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color picker and converter
            </Link>
            . For accessibility of text on colored backgrounds, use the{" "}
            <Link
              href="/design/contrast-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color contrast checker
            </Link>
            . Browse all utilities in the{" "}
            <Link
              href="/#design-color-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              design and color tools
            </Link>{" "}
            section on the home page.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <GradientGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why use a gradient generator for web UI and marketing pages
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Gradients add depth and hierarchy without extra image requests when
            you implement them with CSS{" "}
            <strong className="font-medium text-foreground">
              background-image
            </strong>
            . Designers often explore{" "}
            <strong className="font-medium text-foreground">
              brand gradients
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              mesh-style hero backgrounds
            </strong>
            , and subtle{" "}
            <strong className="font-medium text-foreground">
              glassmorphism overlays
            </strong>
            . A visual builder shortens the loop between “try this angle” and
            “paste into Tailwind or CSS modules.” Pair gradients with palettes
            from the{" "}
            <Link
              href="/design/palette-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              color palette generator
            </Link>{" "}
            when you need harmony rules like complementary or triadic schemes
            before you commit to stop positions.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Search intent around{" "}
            <strong className="font-medium text-foreground">
              CSS linear gradient generator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              radial gradient CSS
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              gradient background generator
            </strong>{" "}
            usually maps to the same workflow: set stops, preview, copy. This
            page documents that flow below and in the FAQ, with structured data
            so search engines can surface how-to steps alongside the tool.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this gradient maker (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Pick{" "}
                <strong className="font-medium text-foreground">Linear</strong>{" "}
                for a directional blend or{" "}
                <strong className="font-medium text-foreground">Radial</strong>{" "}
                for a spotlight-style blend from a center point.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                For linear mode, drag the{" "}
                <strong className="font-medium text-foreground">angle</strong>{" "}
                slider (0°–360°). For radial mode, choose{" "}
                <strong className="font-medium text-foreground">circle</strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">ellipse</strong>{" "}
                and adjust{" "}
                <strong className="font-medium text-foreground">center X/Y</strong>{" "}
                to move the origin.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Edit each{" "}
                <strong className="font-medium text-foreground">color stop</strong>
                : use the swatch and hex field, set the percentage along the
                gradient, and use{" "}
                <strong className="font-medium text-foreground">Add stop</strong>{" "}
                for up to five stops. Remove stops you do not need (minimum
                two).
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Optional: click{" "}
                <strong className="font-medium text-foreground">
                  Upload image
                </strong>{" "}
                (upload icon) to load a photo; the tool samples three horizontal
                bands into new stops so your gradient matches the image mood.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                When the live preview matches your intent, press{" "}
                <strong className="font-medium text-foreground">
                  Copy gradient
                </strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">
                  Copy background-image
                </strong>{" "}
                (copy icon) to place CSS on the clipboard.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Linear vs radial gradients in production CSS
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">
              Linear gradients
            </strong>{" "}
            are ideal for full-bleed section backgrounds, progress indicators, and
            text fades when combined with{" "}
            <code className="rounded bg-zinc-100 px-1 font-mono text-sm dark:bg-zinc-900">
              background-clip: text
            </code>
            .{" "}
            <strong className="font-medium text-foreground">
              Radial gradients
            </strong>{" "}
            suit vignettes, avatar rings, and soft highlights. Both are
            resolution-independent and work well with dark mode if you tune
            stops for sufficient contrast—validate pairs with the contrast
            checker linked above. If you need many stops and fine control in
            one long declaration, the{" "}
            <Link
              href="/design/css-gradient"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSS gradient
            </Link>{" "}
            page in this catalog focuses on multi-stop workflows; this tool
            optimizes for quick two- to five-stop designs and photo sampling.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Performance and SEO notes for gradient-heavy pages
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Pure CSS gradients avoid extra HTTP requests compared to large
            background PNGs or JPEGs, which supports{" "}
            <strong className="font-medium text-foreground">
              Core Web Vitals
            </strong>{" "}
            budgets when you replace bitmap heroes. For SEO, decorative
            gradients should stay in CSS rather than baked into text images so
            copy stays crawlable. If you export assets for social previews, use
            the{" "}
            <Link
              href="/website/open-graph-preview"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph preview
            </Link>{" "}
            tool to verify how titles and images appear when you share landing
            pages built with these styles.
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
            {gradientGeneratorFaqItems.map((item) => (
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
