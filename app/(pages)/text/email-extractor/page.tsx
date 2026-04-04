import type { Metadata } from "next";
import Link from "next/link";
import { EmailExtractorTool } from "./email-extractor-tool";
import { emailExtractorFaqItems } from "@/lib/email-extractor-faq";
import { toolSections } from "@/lib/tool-catalog";

const textTools =
  toolSections.find((s) => s.id === "text-string-tools")?.tools ?? [];
const relatedTools = textTools.filter(
  (t) => t.href !== "/text/email-extractor",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/text/email-extractor",
  },
};

export default function EmailExtractorPage() {
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
            <span className="text-foreground">Email extractor</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Email extractor online — pull addresses from text and HTML,
            deduplicate, export
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online email extractor
            </strong>{" "}
            to build a{" "}
            <strong className="font-medium text-foreground">
              deduplicated email list
            </strong>{" "}
            from messy sources: forwarded threads, CRM dumps, scraped HTML,
            newsletter footers, or log lines. It finds visible addresses and{" "}
            <strong className="font-medium text-foreground">mailto:</strong>{" "}
            targets, merges them, and removes duplicates using{" "}
            <strong className="font-medium text-foreground">
              case-insensitive matching
            </strong>
            . Export{" "}
            <strong className="font-medium text-foreground">
              one email per line
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              comma-separated
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              semicolon-separated
            </strong>{" "}
            blocks for spreadsheets and web forms. Everything runs{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            . When the same page also contains hyperlinks you need separately,
            follow up with our{" "}
            <Link
              href="/text/url-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              URL extractor
            </Link>{" "}
            and explore the full{" "}
            <Link
              href="/#text-string-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Text and String Tools
            </Link>{" "}
            catalog on the home page.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <EmailExtractorTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why a dedicated email address extractor still matters
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Spreadsheets and IDEs can search for an{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              @
            </code>{" "}
            symbol, but they rarely understand HTML attributes, strip duplicate
            rows, and format output for a CRM paste field in one step. A focused{" "}
            <strong className="font-medium text-foreground">
              email parser online
            </strong>{" "}
            shortens the path from raw copy to a{" "}
            <strong className="font-medium text-foreground">
              clean recipient list
            </strong>
            . Combine it with the{" "}
            <Link
              href="/text/duplicate-line-remover"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              duplicate line remover
            </Link>{" "}
            when your source is already one address per line but contains
            repeats from merged files.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this email extractor (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste plain text, HTML source, or a mixed export into the editor.
                Alternatively click{" "}
                <strong className="font-medium text-foreground">
                  Upload file
                </strong>{" "}
                to load{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  .txt
                </code>
                ,{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  .html
                </code>
                , or Markdown. Use{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                to see mailto links and duplicate handling.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Check the{" "}
                <strong className="font-medium text-foreground">
                  unique address count
                </strong>{" "}
                and the read-only output panel. Enable{" "}
                <strong className="font-medium text-foreground">
                  Sort A–Z
                </strong>{" "}
                when you want alphabetical order for reviews or approvals.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Choose{" "}
                <strong className="font-medium text-foreground">
                  one per line
                </strong>{" "}
                for column pastes, or{" "}
                <strong className="font-medium text-foreground">comma</strong> /{" "}
                <strong className="font-medium text-foreground">semicolon</strong>{" "}
                modes for single-field imports. Click{" "}
                <strong className="font-medium text-foreground">Copy list</strong>{" "}
                to move the block to your clipboard.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                For line-level cleanup first—extra spaces or blank rows—run the{" "}
                <Link
                  href="/text/whitespace-remover"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  whitespace remover
                </Link>{" "}
                or{" "}
                <Link
                  href="/text/find-replace"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  find and replace tool
                </Link>{" "}
                before pasting here when exports contain noisy delimiters.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and workflows this page supports
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            People search for an{" "}
            <strong className="font-medium text-foreground">
              email scraper from text
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              extract emails from HTML
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              remove duplicate emails
            </strong>
            , or a{" "}
            <strong className="font-medium text-foreground">
              privacy-friendly email parser
            </strong>{" "}
            that avoids uploading inboxes to the cloud. Operations teams paste
            vendor PDFs converted to text; engineers grep build logs; marketers
            consolidate webinar registrants. After you have a delimiter-heavy
            blob, the{" "}
            <Link
              href="/text/comma-separator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              comma separator tool
            </Link>{" "}
            can reshape lists without retyping.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            HTML, mailto links, and extraction limits
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Script and style blocks are discarded before the text pass so inline
            JavaScript is less likely to pollute results.{" "}
            <strong className="font-medium text-foreground">mailto:</strong>{" "}
            href values are decoded and merged with addresses found in the
            remaining text. The matcher is heuristic: it does not guarantee RFC
            5322 compliance, validate domains, or read text embedded in images.
            Treat output as a draft for human review, not as verified
            deliverability data.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Compliance, consent, and responsible outreach
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Extracting addresses is only the technical step. Sending bulk mail
            requires appropriate consent, accurate unsubscribe handling, and
            respect for regional rules such as CAN-SPAM, GDPR, and CASL. Use
            suppression lists and double-check that each contact expects your
            message. This site does not store pasted content; your organization
            remains responsible for how lists are sourced and used.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related text, file, and data tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Continue in{" "}
            <Link
              href="/#text-string-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Text and String Tools
            </Link>{" "}
            or branch into structured data utilities:
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
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            For tabular exports, open the{" "}
            <Link
              href="/files/csv-viewer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV viewer and editor
            </Link>{" "}
            or{" "}
            <Link
              href="/files/csv-deduplicator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV deduplicator
            </Link>{" "}
            when addresses live inside multi-column sheets rather than raw text.
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
            {emailExtractorFaqItems.map((item) => (
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
