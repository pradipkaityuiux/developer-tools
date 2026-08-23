import type { Metadata } from "next";
import Link from "next/link";
import { JsonToYamlTool } from "./json-to-yaml-tool";
import { jsonToYamlFaqItems } from "@/lib/json-to-yaml-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/json-to-yaml");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/json-to-yaml",
  },
};

export default function JsonToYamlPage() {
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
              href="/#code-developer-tools"
              className="hover:text-foreground"
            >
              Code &amp; developer tools
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span className="text-foreground">JSON to YAML</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            JSON to YAML converter for configs, Kubernetes &amp; APIs
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              JSON to YAML converter online
            </strong>{" "}
            when you need human-readable{" "}
            <strong className="font-medium text-foreground">YAML</strong> from
            strict{" "}
            <strong className="font-medium text-foreground">JSON</strong>{" "}
            documents. It is built for{" "}
            <strong className="font-medium text-foreground">
              Kubernetes manifests
            </strong>
            , Helm-style data,{" "}
            <strong className="font-medium text-foreground">
              Docker Compose
            </strong>{" "}
            snippets, CI variables, and internal{" "}
            <strong className="font-medium text-foreground">
              configuration management
            </strong>
            . Parsing and{" "}
            <strong className="font-medium text-foreground">YAML generation</strong>{" "}
            run in your browser—ideal when you must keep{" "}
            <strong className="font-medium text-foreground">
              payloads off the server
            </strong>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <JsonToYamlTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why convert JSON to YAML?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">JSON</strong> is
            the lingua franca of REST APIs, browser storage, and many build
            pipelines.{" "}
            <strong className="font-medium text-foreground">YAML</strong>{" "}
            appears everywhere operations teams work:{" "}
            <strong className="font-medium text-foreground">Kustomize</strong>{" "}
            overlays, sample objects in the Kubernetes documentation, Ansible
            inventories, and GitHub Actions workflows written by hand. When you
            receive or generate JSON but your target expects YAML, a reliable{" "}
            <strong className="font-medium text-foreground">
              JSON-to-YAML transformation
            </strong>{" "}
            saves manual retyping and reduces indentation mistakes.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This page is also a practical companion to our{" "}
            <Link
              href="/dev/yaml-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              YAML to JSON converter
            </Link>{" "}
            for round-tripping configs, and to the{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter and validator
            </Link>{" "}
            when you need to fix invalid JSON before you convert.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this JSON to YAML tool (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste a complete JSON document—an object{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  {"{ }"}
                </code>{" "}
                or an array{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  [ ]
                </code>
                . You can start from{" "}
                <strong className="font-medium text-foreground">
                  Use sample
                </strong>{" "}
                to see a small ConfigMap-style example.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Choose{" "}
                <strong className="font-medium text-foreground">
                  Sort keys (A–Z)
                </strong>{" "}
                if you want deterministic ordering for{" "}
                <strong className="font-medium text-foreground">Git diffs</strong>
                ; leave it off to preserve key order as closely as the runtime
                allows.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Pick{" "}
                <strong className="font-medium text-foreground">
                  two- or four-space indentation
                </strong>{" "}
                to match your style guide or linter defaults.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Convert to YAML
                </strong>
                . Read any error message at the bottom—usually a missing comma,
                trailing comma, or non-JSON syntax such as comments.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use{" "}
                <strong className="font-medium text-foreground">Copy YAML</strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">
                  Download .yaml
                </strong>{" "}
                to move the result into your editor, merge request, or cluster
                workflow.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            JSON vs YAML: what changes in the output?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Structurally, the{" "}
            <strong className="font-medium text-foreground">data model</strong>{" "}
            stays the same: strings, numbers, booleans, null, objects, and
            arrays map cleanly between formats. Visually, YAML drops many braces
            in favor of indentation, may inline simple objects as flow mappings,
            and can represent multiline strings with block scalars once you edit
            the file by hand. Because JSON has no comments, this converter will
            not add <code className="font-mono text-sm">#</code> lines for you;
            add them after conversion if your tooling allows.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Kubernetes, Helm, and cloud-native workflows
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Platform teams often sketch resources in YAML, but automation and
            APIs emit JSON—for example when you export an object from a control
            plane or transform OpenAPI examples. Converting those blobs into YAML
            makes them easier to read in code review and to align with in-repo
            conventions. Always run{" "}
            <strong className="font-medium text-foreground">
              kubectl apply --dry-run
            </strong>{" "}
            or your admission tests before applying converted manifests to
            production; semantic validation is outside the scope of a pure format
            converter.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Tabular and API data: JSON to CSV
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            When your JSON is primarily a list of records for spreadsheets or
            BI tools rather than nested config, the{" "}
            <Link
              href="/dev/json-to-csv"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON to CSV converter
            </Link>{" "}
            may be a better fit than YAML. CSV preserves row semantics; YAML
            preserves hierarchical structure.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and security notes
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Because conversion executes locally in the browser, you reduce the
            risk of leaking tokens compared to sending config to a third-party
            API. You should still treat any textarea as sensitive: clear it when
            you are done, avoid screen sharing secrets, and prefer redacted
            samples when asking teammates for help.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Explore the full{" "}
            <Link
              href="/#code-developer-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              code and developer tools
            </Link>{" "}
            section on the homepage, or open one of the utilities below.
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
            {jsonToYamlFaqItems.map((item) => (
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
