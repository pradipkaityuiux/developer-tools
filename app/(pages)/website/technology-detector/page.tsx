import type { Metadata } from "next";
import Link from "next/link";
import { TechnologyDetectorTool } from "./technology-detector-tool";
import { technologyDetectorFaqItems } from "@/lib/technology-detector-faq";
import { toolSections } from "@/lib/tool-catalog";

const websiteTools =
  toolSections.find((s) => s.id === "website-url-tools")?.tools ?? [];
const relatedTools = websiteTools.filter(
  (t) => t.href !== "/website/technology-detector",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/website/technology-detector",
  },
};

export default function TechnologyDetectorPage() {
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
            <span className="text-foreground">Website technology detector</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Website technology detector for CMS, frameworks, analytics &amp; CDNs
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Run a free{" "}
            <strong className="font-medium text-foreground">
              website stack check
            </strong>{" "}
            on any public page. Our{" "}
            <strong className="font-medium text-foreground">
              technology fingerprint scanner
            </strong>{" "}
            downloads the HTML response, inspects{" "}
            <strong className="font-medium text-foreground">
              HTTP headers
            </strong>{" "}
            and inline markup, and surfaces likely{" "}
            <strong className="font-medium text-foreground">CMS platforms</strong>{" "}
            (WordPress, Shopify, Webflow, and more),{" "}
            <strong className="font-medium text-foreground">
              JavaScript frameworks
            </strong>{" "}
            and meta-frameworks (Next.js, Nuxt, Gatsby, plus cautious heuristics
            for React and Vue),{" "}
            <strong className="font-medium text-foreground">
              analytics &amp; tag managers
            </strong>{" "}
            (Google Tag Manager, GA4, Meta Pixel, Hotjar, Plausible, Matomo),{" "}
            <strong className="font-medium text-foreground">
              CDN &amp; edge hosts
            </strong>{" "}
            (Cloudflare, Fastly, Vercel, Netlify),{" "}
            <strong className="font-medium text-foreground">
              marketing widgets
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">font CDNs</strong>,
            and common{" "}
            <strong className="font-medium text-foreground">
              security embeds
            </strong>{" "}
            such as reCAPTCHA—ideal for{" "}
            <strong className="font-medium text-foreground">
              competitive research
            </strong>
            , agency pitches, and due diligence before migrations.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <TechnologyDetectorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            What is a website technology detector?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            A{" "}
            <strong className="font-medium text-foreground">
              website technology detector
            </strong>{" "}
            (sometimes called a{" "}
            <strong className="font-medium text-foreground">
              stack checker
            </strong>{" "}
            or{" "}
            <strong className="font-medium text-foreground">
              built-with style scanner
            </strong>
            ) automates the boring parts of answering: &quot;What powers this
            page?&quot; Instead of manually viewing source and memorizing script
            hostnames, you fetch a representative URL once and compare the
            response against a curated rule list spanning{" "}
            <strong className="font-medium text-foreground">CMS footprints</strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              framework markers
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              analytics vendors
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              infrastructure headers
            </strong>
            . The output is investigative signal—fast, transparent, and easy to
            cross-check—not a legal warranty about every dependency in a
            production bundle.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Teams use these scans for{" "}
            <strong className="font-medium text-foreground">SEO audits</strong>{" "}
            (understanding tag weight and render paths),{" "}
            <strong className="font-medium text-foreground">sales research</strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              security questionnaires
            </strong>{" "}
            that ask which third parties touch PII pages, and{" "}
            <strong className="font-medium text-foreground">
              migration planning
            </strong>{" "}
            when you need to know whether a prospect is already on Shopify,
            Webflow, or a headless React stack. Pair this page with our{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>{" "}
            for raw cache, security, and CORS values, the{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>{" "}
            when you care about title tags and Open Graph, and the{" "}
            <Link
              href="/website/ssl-certificate-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SSL certificate checker
            </Link>{" "}
            to validate TLS before you trust a redirect-heavy marketing domain.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this technology detector (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Pick a{" "}
                <strong className="font-medium text-foreground">
                  public URL
                </strong>{" "}
                that reflects the experience you want to study—often the
                marketing homepage, a popular landing page, or a docs portal.
                Authenticated dashboards and JSON APIs typically expose fewer
                marketing scripts than consumer pages.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Paste the address into the field (
                <strong className="font-medium text-foreground">https://</strong>{" "}
                is optional). Click{" "}
                <strong className="font-medium text-foreground">
                  Detect technologies
                </strong>
                . We resolve DNS with the same{" "}
                <strong className="font-medium text-foreground">
                  SSRF protections
                </strong>{" "}
                as our other URL tools, follow redirects safely, and cap how
                much HTML we parse so scans stay responsive.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read grouped results:{" "}
                <strong className="font-medium text-foreground">CMS</strong>,{" "}
                <strong className="font-medium text-foreground">frameworks</strong>
                ,{" "}
                <strong className="font-medium text-foreground">analytics</strong>
                ,{" "}
                <strong className="font-medium text-foreground">CDN</strong>, and
                more. Each hit includes a short{" "}
                <strong className="font-medium text-foreground">evidence</strong>{" "}
                string plus a{" "}
                <strong className="font-medium text-foreground">
                  confidence band
                </strong>{" "}
                (high, medium, low). Treat low-confidence framework rows as
                prompts to verify manually.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Follow up with specialized tools. Use the{" "}
                <Link
                  href="/website/redirect-chain-checker"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  redirect chain checker
                </Link>{" "}
                if marketing domains bounce through country or device rules, the{" "}
                <Link
                  href="/website/response-code-checker"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  response code checker
                </Link>{" "}
                for quick status validation, and the{" "}
                <Link
                  href="/website/dns-lookup"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  DNS lookup tool
                </Link>{" "}
                when a brand-new hostname has not propagated yet.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            CMS detection: WordPress, Shopify, Webflow, and beyond
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Content systems leave durable clues:{" "}
            <strong className="font-medium text-foreground">
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                meta name=&quot;generator&quot;
              </code>
            </strong>{" "}
            tags, predictable asset paths such as{" "}
            <strong className="font-medium text-foreground">/wp-content/</strong>
            , Shopify CDN hostnames, or Webflow data attributes. Our detector
            prioritizes vendor-specific URLs and headers over generic strings so
            you see fewer noisy matches. When you need registration timelines to
            complement stack research, open the{" "}
            <Link
              href="/website/domain-age-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              domain age checker
            </Link>{" "}
            and{" "}
            <Link
              href="/website/whois-lookup"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              WHOIS lookup
            </Link>{" "}
            for registrar-level context.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Framework fingerprints: Next.js, Nuxt, Gatsby, and SPAs
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Modern frameworks often embed recognizable markers—
            <strong className="font-medium text-foreground">Next.js</strong>{" "}
            may ship{" "}
            <strong className="font-medium text-foreground">/_next/static/</strong>{" "}
            assets or structured bootstrap payloads, while{" "}
            <strong className="font-medium text-foreground">Nuxt</strong> and{" "}
            <strong className="font-medium text-foreground">Gatsby</strong>{" "}
            advertise their runtimes in predictable ways. Single-page apps that
            hydrate entirely in the browser can look &quot;empty&quot; to a
            single fetch; that absence is itself a clue to try a different route
            or inspect network waterfalls locally. Combine this scan with our{" "}
            <Link
              href="/website/open-graph-preview"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Open Graph preview
            </Link>{" "}
            and{" "}
            <Link
              href="/website/canonical-tag-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              canonical tag checker
            </Link>{" "}
            when you are judging how seriously a team invests in share cards and
            indexation hygiene.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Analytics, tags, and third-party risk
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Marketing stacks are easiest to spot because vendors want stable
            endpoints—think{" "}
            <strong className="font-medium text-foreground">
              Google Tag Manager
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">GA4</strong>,{" "}
            <strong className="font-medium text-foreground">Meta Pixel</strong>,{" "}
            <strong className="font-medium text-foreground">Hotjar</strong>, or{" "}
            <strong className="font-medium text-foreground">Plausible</strong>.
            Seeing a tag does not tell you whether it fires on every page,
            respects consent banners, or loads only after interaction; it simply
            confirms the snippet is present in the HTML we retrieved. For
            crawlability side effects, also run the{" "}
            <Link
              href="/website/robots-txt-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              robots.txt checker
            </Link>{" "}
            and{" "}
            <Link
              href="/website/broken-link-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              broken link checker
            </Link>{" "}
            on representative templates.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            CDN and edge detection (Cloudflare, Fastly, Vercel, Netlify)
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Infrastructure often announces itself in headers—
            <strong className="font-medium text-foreground">CF-Ray</strong> for{" "}
            <strong className="font-medium text-foreground">Cloudflare</strong>,{" "}
            <strong className="font-medium text-foreground">x-vercel-id</strong>{" "}
            on{" "}
            <strong className="font-medium text-foreground">Vercel</strong>,{" "}
            <strong className="font-medium text-foreground">
              x-nf-request-id
            </strong>{" "}
            on{" "}
            <strong className="font-medium text-foreground">Netlify</strong>, or{" "}
            <strong className="font-medium text-foreground">x-served-by</strong>{" "}
            hints for{" "}
            <strong className="font-medium text-foreground">Fastly</strong>.
            These signals explain why two visually similar sites behave differently
            under cache busting, bot management, or regional routing. When you
            also need IP-level context for an origin you discover, use our{" "}
            <Link
              href="/website/ip-lookup"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              IP address lookup
            </Link>{" "}
            after resolving A/AAAA records with DNS tools.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Limitations every stack checker shares
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            No remote scanner can see inside private networks, execute arbitrary
            JavaScript, or bypass bot challenges meant for humans. Hosts that
            throttle datacenter IPs may return sparse HTML; sites that split
            experiments by cookie will show only one variant per request. Use this
            utility as a{" "}
            <strong className="font-medium text-foreground">
              first-pass reconnaissance
            </strong>{" "}
            layer, then validate in your browser devtools or a dedicated RUM
            product when stakes are high.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related free tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Explore the full{" "}
            <Link
              href="/#website-url-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              website and URL tools
            </Link>{" "}
            collection for more utilities, or jump to a focused checker below.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {relatedTools.slice(0, 12).map((tool) => (
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
            {technologyDetectorFaqItems.map((item) => (
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
