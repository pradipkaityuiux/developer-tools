import type { Metadata } from "next";
import Link from "next/link";
import { HtaccessGeneratorTool } from "./htaccess-generator-tool";
import { htaccessGeneratorFaqItems } from "@/lib/htaccess-generator-faq";
import { toolSections } from "@/lib/tool-catalog";

const securityTools =
  toolSections.find((s) => s.id === "security-encryption-tools")?.tools ?? [];
const relatedTools = securityTools.filter(
  (t) => t.href !== "/security/htaccess-generator",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/security/htaccess-generator",
  },
};

export default function HtaccessGeneratorPage() {
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
            <span className="text-foreground">.htaccess generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            .htaccess generator — Apache redirects, HTTPS, caching, and security
            headers
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This free{" "}
            <strong className="font-medium text-foreground">
              online .htaccess generator
            </strong>{" "}
            helps you assemble common{" "}
            <strong className="font-medium text-foreground">
              Apache configuration snippets
            </strong>{" "}
            for{" "}
            <strong className="font-medium text-foreground">
              HTTP to HTTPS redirects
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              apex versus www canonicalization
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">301 URL moves</strong>
            ,{" "}
            <strong className="font-medium text-foreground">hotlink protection</strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              mod_expires browser caching
            </strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">mod_deflate gzip</strong>
            , plus{" "}
            <strong className="font-medium text-foreground">
              baseline security headers
            </strong>{" "}
            and blocking access to typical sensitive paths. Rules are composed in
            your browser—you can{" "}
            <strong className="font-medium text-foreground">copy</strong>,{" "}
            <strong className="font-medium text-foreground">download</strong>, or{" "}
            <strong className="font-medium text-foreground">upload</strong> an
            existing file to edit. After deployment, validate behavior with the{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>{" "}
            and{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>
            , and review TLS with the{" "}
            <Link
              href="/website/ssl-certificate-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SSL certificate checker
            </Link>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <HtaccessGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why use an .htaccess file for Apache hosting?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            On Apache,{" "}
            <strong className="font-medium text-foreground">.htaccess</strong>{" "}
            lets you override server behavior per directory when{" "}
            <strong className="font-medium text-foreground">AllowOverride</strong>{" "}
            allows it. That is ideal on{" "}
            <strong className="font-medium text-foreground">shared hosting</strong>{" "}
            where you cannot edit the main virtual host file. Teams also commit a
            root <strong className="font-medium text-foreground">.htaccess</strong>{" "}
            so redirects and caching travel with the site. This page targets{" "}
            <strong className="font-medium text-foreground">Apache 2.4</strong>{" "}
            patterns (<strong className="font-medium text-foreground">
              Require all denied
            </strong>
            , <strong className="font-medium text-foreground">mod_rewrite</strong>
            , <strong className="font-medium text-foreground">mod_headers</strong>
            )—always confirm module availability on your host.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Search intent around{" "}
            <strong className="font-medium text-foreground">
              htaccess redirect 301
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              force SSL htaccess
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              redirect www to non-www
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              disable directory listing
            </strong>{" "}
            maps to concrete toggles here. For policy headers that belong at the
            edge or load balancer, compare output with a{" "}
            <strong className="font-medium text-foreground">CSP</strong> or CDN
            dashboard—the{" "}
            <Link
              href="/dev/url-encoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              URL encoder
            </Link>{" "}
            can help when you embed long query strings in rules or tests.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this .htaccess generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Set <strong className="font-medium text-foreground">HTTPS</strong>
                , <strong className="font-medium text-foreground">www</strong>{" "}
                preference, and whether to strip{" "}
                <strong className="font-medium text-foreground">
                  trailing slashes
                </strong>
                . Enter your real hostname in{" "}
                <strong className="font-medium text-foreground">
                  primary host
                </strong>{" "}
                before enabling hotlink protection.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Choose security options: block common{" "}
                <strong className="font-medium text-foreground">.env</strong> and{" "}
                <strong className="font-medium text-foreground">.git</strong>{" "}
                exposure, turn off{" "}
                <strong className="font-medium text-foreground">
                  directory indexes
                </strong>
                , and add optional{" "}
                <strong className="font-medium text-foreground">
                  security headers
                </strong>{" "}
                (frame options, nosniff, referrer policy).
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Tune performance:{" "}
                <strong className="font-medium text-foreground">gzip</strong> via{" "}
                <strong className="font-medium text-foreground">mod_deflate</strong>
                , asset caching via{" "}
                <strong className="font-medium text-foreground">mod_expires</strong>
                , and <strong className="font-medium text-foreground">UTF-8</strong>{" "}
                charset. Add an optional{" "}
                <strong className="font-medium text-foreground">ErrorDocument 404</strong>{" "}
                path if your stack uses a static error page.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Add <strong className="font-medium text-foreground">301</strong>{" "}
                rows for migrations. Use{" "}
                <strong className="font-medium text-foreground">Upload</strong> to
                load an existing file, edit in the preview, then{" "}
                <strong className="font-medium text-foreground">Copy</strong> or{" "}
                <strong className="font-medium text-foreground">Download</strong>.{" "}
                <strong className="font-medium text-foreground">Reset to form</strong>{" "}
                reapplies the current form state if you edited manually.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and topics this generator covers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            The output touches{" "}
            <strong className="font-medium text-foreground">mod_rewrite</strong>,{" "}
            <strong className="font-medium text-foreground">mod_alias</strong>{" "}
            fallbacks when rewrite is off,{" "}
            <strong className="font-medium text-foreground">mod_headers</strong>,{" "}
            <strong className="font-medium text-foreground">mod_expires</strong>, and{" "}
            <strong className="font-medium text-foreground">mod_deflate</strong>{" "}
            behind <strong className="font-medium text-foreground">&lt;IfModule&gt;</strong>{" "}
            guards so missing modules do not always fatal-error. For PEM inspection
            unrelated to Apache but common in the same workflows, use the{" "}
            <Link
              href="/security/ssl-decoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SSL certificate decoder
            </Link>{" "}
            and for signing experiments the{" "}
            <Link
              href="/security/rsa-key-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              RSA key pair generator
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Migrations, SEO, and redirect testing
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            When you move content, search engines care that{" "}
            <strong className="font-medium text-foreground">301 redirects</strong>{" "}
            point to the canonical URL and that HTTPS and host variants converge.
            After you ship an .htaccess, re-check status codes from both HTTP and
            HTTPS, and from www and non-www variants. Our{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>{" "}
            surfaces hop counts—long chains dilute PageRank and slow navigation.
            Pair with the{" "}
            <Link
              href="/website/canonical-tag-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              canonical tag checker
            </Link>{" "}
            when HTML-level canonicals must agree with server redirects.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related security and encryption tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browse the full{" "}
            <Link
              href="/#security-encryption-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              security and encryption tools
            </Link>{" "}
            catalog. Highlights:
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
            {htaccessGeneratorFaqItems.map((item) => (
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
