import type { Metadata } from "next";
import Link from "next/link";
import { GitignoreGeneratorTool } from "./gitignore-generator-tool";
import { gitignoreGeneratorFaqItems } from "@/lib/gitignore-generator-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter(
  (t) => t.href !== "/dev/gitignore-generator",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/gitignore-generator",
  },
};

export default function GitignoreGeneratorPage() {
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
            <span className="text-foreground">.gitignore generator</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            .gitignore generator online — build a tailored ignore file for your
            stack
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This free{" "}
            <strong className="font-medium text-foreground">
              .gitignore generator
            </strong>{" "}
            helps you combine ignore rules for{" "}
            <strong className="font-medium text-foreground">Node.js</strong>,{" "}
            <strong className="font-medium text-foreground">Next.js</strong>,{" "}
            <strong className="font-medium text-foreground">Python</strong>,{" "}
            <strong className="font-medium text-foreground">Rust</strong>,{" "}
            <strong className="font-medium text-foreground">Go</strong>,{" "}
            <strong className="font-medium text-foreground">Java</strong>,{" "}
            <strong className="font-medium text-foreground">.NET</strong>,{" "}
            <strong className="font-medium text-foreground">Terraform</strong>,{" "}
            <strong className="font-medium text-foreground">Docker</strong>,{" "}
            <strong className="font-medium text-foreground">macOS</strong>,{" "}
            <strong className="font-medium text-foreground">Windows</strong>,{" "}
            <strong className="font-medium text-foreground">Linux</strong>, and
            popular{" "}
            <strong className="font-medium text-foreground">IDEs</strong>. Rules
            merge in your browser—ideal when you bootstrap a repo, onboard a
            team, or teach what belongs in version control versus local build
            output. Pair it with the{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter
            </Link>{" "}
            for committed config samples, the{" "}
            <Link
              href="/dev/uuid-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              UUID generator
            </Link>{" "}
            for fixtures, and the{" "}
            <Link
              href="/dev/password-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              password generator
            </Link>{" "}
            for disposable local credentials—never commit real secrets.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <GitignoreGeneratorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why a .gitignore file matters for every Git repository
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Git tracks files you tell it to add. Without a{" "}
            <strong className="font-medium text-foreground">.gitignore</strong>,
            it is easy to accidentally commit{" "}
            <strong className="font-medium text-foreground">
              dependency folders
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              compiler output
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">log files</strong>,
            and{" "}
            <strong className="font-medium text-foreground">OS metadata</strong>
            . That inflates clones, leaks machine-specific paths, and sometimes
            exposes{" "}
            <strong className="font-medium text-foreground">
              environment files
            </strong>{" "}
            that should stay private. A shared ignore file encodes team policy:
            what is reproducible from source (install, build) stays out of
            history; what documents intent (README, CI config) stays in.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Search intent around{" "}
            <strong className="font-medium text-foreground">
              gitignore generator online
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              Node gitignore
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              Python gitignore
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              Next.js gitignore
            </strong>{" "}
            usually means “give me a safe default fast.” This page does that
            with explicit sections you can toggle, then refine in the preview
            before you{" "}
            <strong className="font-medium text-foreground">download</strong> or{" "}
            <strong className="font-medium text-foreground">copy</strong>. For
            release hygiene, also scan your deployed URLs with the{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>{" "}
            and{" "}
            <Link
              href="/website/ssl-certificate-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SSL certificate checker
            </Link>
            —those concerns are separate from ignore rules but part of the same
            shipping mindset.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this .gitignore generator (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Check the boxes that match your{" "}
                <strong className="font-medium text-foreground">OS</strong>,{" "}
                <strong className="font-medium text-foreground">language</strong>
                ,{" "}
                <strong className="font-medium text-foreground">framework</strong>
                , and{" "}
                <strong className="font-medium text-foreground">tooling</strong>.
                Use a preset such as{" "}
                <strong className="font-medium text-foreground">
                  Next.js kit
                </strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">
                  Python kit
                </strong>{" "}
                if you want a one-click baseline.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read the{" "}
                <strong className="font-medium text-foreground">preview</strong>.
                Each block starts with a comment header so you know where rules
                came from. Delete overlaps or add project-specific globs
                directly in the textarea.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Optional: click{" "}
                <strong className="font-medium text-foreground">Upload</strong>{" "}
                to load an existing{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  .gitignore
                </code>{" "}
                from disk, then merge mentally with new checkboxes or use{" "}
                <strong className="font-medium text-foreground">
                  Reset to selections
                </strong>{" "}
                to rebuild from the UI.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use the{" "}
                <strong className="font-medium text-foreground">copy</strong>{" "}
                control or{" "}
                <strong className="font-medium text-foreground">Download</strong>{" "}
                to save{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  .gitignore
                </code>{" "}
                at your repository root. Commit it, and run{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  git status
                </code>{" "}
                to confirm junk no longer appears as untracked noise.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and stacks this generator covers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Templates include patterns people search for alongside{" "}
            <strong className="font-medium text-foreground">
              gitignore Terraform
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              Docker gitignore
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">Rust cargo</strong>,{" "}
            <strong className="font-medium text-foreground">Go vendor</strong>,{" "}
            <strong className="font-medium text-foreground">Ruby bundler</strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              PHP Composer
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              .NET bin and obj
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">Swift Xcode</strong>,{" "}
            <strong className="font-medium text-foreground">Flutter</strong>, and
            low-level{" "}
            <strong className="font-medium text-foreground">C/C++</strong>{" "}
            build trees. Editors cover{" "}
            <strong className="font-medium text-foreground">VS Code</strong> and{" "}
            <strong className="font-medium text-foreground">JetBrains</strong>{" "}
            with selective keep rules for shared workspace settings. If you work
            mostly in structured data, round-trip YAML with the{" "}
            <Link
              href="/dev/yaml-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              YAML to JSON
            </Link>{" "}
            tool before you commit examples.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Secrets, .env files, and what .gitignore cannot fix alone
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Many stacks ignore{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              .env
            </code>{" "}
            so local API keys never hit Git by accident. That only works if the
            file was never tracked. Rotate keys if a secret was pushed, and use
            server-side scanning in CI. This page does not store your preview;
            still avoid pasting production credentials into shared machines.
            For random test passwords, use the{" "}
            <Link
              href="/dev/password-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              password generator
            </Link>{" "}
            and document format expectations with the{" "}
            <Link
              href="/dev/regex-tester"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              regex tester
            </Link>{" "}
            when you validate user input in apps.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Browse the full{" "}
            <Link
              href="/#code-developer-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              code and developer tools
            </Link>{" "}
            section. Highlights:
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
            {gitignoreGeneratorFaqItems.map((item) => (
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
