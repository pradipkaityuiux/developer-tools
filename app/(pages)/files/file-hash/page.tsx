import type { Metadata } from "next";
import Link from "next/link";
import { FileHashTool } from "./file-hash-tool";
import { fileHashFaqItems } from "@/lib/file-hash-faq";
import { toolSections } from "@/lib/tool-catalog";

const fileTools =
  toolSections.find((s) => s.id === "file-data-tools")?.tools ?? [];
const relatedTools = fileTools.filter((t) => t.href !== "/files/file-hash");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/files/file-hash",
  },
};

export default function FileHashPage() {
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
            <span className="text-foreground">File hash checker</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            File hash checker — MD5, SHA-1, and SHA-256 checksums for uploads
            and release verification
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              online file hash checker
            </strong>{" "}
            to compute{" "}
            <strong className="font-medium text-foreground">MD5</strong>,{" "}
            <strong className="font-medium text-foreground">SHA-1</strong>, and{" "}
            <strong className="font-medium text-foreground">SHA-256</strong>{" "}
            digests from the exact bytes of any file you select—installers, ZIP
            exports, disk images, CSV dumps, firmware, or media. You get
            lowercase hexadecimal strings you can paste next to vendor
            checksums, CI artifacts, and internal{" "}
            <strong className="font-medium text-foreground">
              integrity verification
            </strong>{" "}
            docs. Everything runs{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            : the File API loads data locally, SHA-family hashes use{" "}
            <strong className="font-medium text-foreground">Web Crypto</strong>,
            and MD5 uses the same vetted library as our{" "}
            <Link
              href="/dev/hash-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              text hash generator
            </Link>
            —so nothing is uploaded for hashing. When you need to embed small
            assets as strings instead of checksums, use the{" "}
            <Link
              href="/files/image-to-base64"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image to Base64
            </Link>{" "}
            tool; when you only inspect photo metadata, open the{" "}
            <Link
              href="/files/image-metadata"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image metadata viewer
            </Link>
            . More utilities live in our{" "}
            <Link
              href="/#file-data-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              file and data tools
            </Link>{" "}
            catalog on the home page.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <FileHashTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            What is a file checksum and when teams verify MD5 or SHA-256
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            A{" "}
            <strong className="font-medium text-foreground">
              cryptographic hash
            </strong>{" "}
            maps an entire file to a short fingerprint.{" "}
            <strong className="font-medium text-foreground">MD5</strong> (128
            bits), <strong className="font-medium text-foreground">SHA-1</strong>{" "}
            (160 bits), and <strong className="font-medium text-foreground">
              SHA-256
            </strong>{" "}
            (256 bits) are one-way: you cannot recover the file from the digest,
            but you can confirm whether two copies are bitwise identical.
            Security teams deprecate MD5 and SHA-1 for signatures and passwords,
            yet release engineers still publish{" "}
            <strong className="font-medium text-foreground">
              download checksums
            </strong>{" "}
            because they catch truncated HTTP responses, bad USB copies, and
            mistaken attachments. Modern guides increasingly standardize on{" "}
            <strong className="font-medium text-foreground">SHA-256</strong>;
            this page shows all three so you can match whatever a README or
            package index still lists.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Searchers often look for{" "}
            <strong className="font-medium text-foreground">
              calculate MD5 of file online
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              SHA256 hash file
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              verify ISO checksum
            </strong>
            . The workflow is identical: hash the bytes you actually have, then
            compare case-insensitively to the published hex string (we output
            lowercase for consistency). For hashing UTF-8 strings instead of
            raw files—JWT fixtures, cache keys, or API samples—keep the{" "}
            <Link
              href="/dev/hash-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              hash generator
            </Link>{" "}
            open in another tab.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this file hash checker (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Upload file
                </strong>{" "}
                or drag a file into the dashed drop zone. There is no file-type
                filter—binaries, archives, documents, and datasets all work.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Wait for the status line to finish. Large files take longer
                because the whole file is read into memory for digest
                computation; if you hit the on-page limit, switch to a desktop
                utility that streams from disk.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Compare each digest with the publisher’s documentation. If they
                only publish one algorithm, ignore the others or use them as a
                cross-check for your own records.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Press the{" "}
                <strong className="font-medium text-foreground">Copy</strong>{" "}
                buttons (with the copy icon) beside MD5, SHA-1, or SHA-256, or
                use{" "}
                <strong className="font-medium text-foreground">
                  Copy all checksums
                </strong>{" "}
                for a multi-line block. Use{" "}
                <strong className="font-medium text-foreground">Clear</strong>{" "}
                before hashing another path.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Integrity vs. authenticity: what hashing proves
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Matching a checksum proves your bits equal the reference bits at the
            time someone generated that reference—it does not prove the file is
            safe, licensed, or unmodified by an attacker who also controls the
            download page. Combine{" "}
            <strong className="font-medium text-foreground">
              hash verification
            </strong>{" "}
            with HTTPS, signed releases (GPG or Sigstore), and organizational
            policies. Inside CI, store expected digests as secrets or lockfile
            metadata and fail pipelines on mismatch.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and limits for sensitive exports
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Because processing stays in-tab, you avoid sending proprietary CSV
            or database dumps to random cloud converters. Very large files can
            still stress RAM; prefer command-line{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              certutil
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              shasum
            </code>
            , or{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              Get-FileHash
            </code>{" "}
            when hashing multi-gigabyte artifacts regularly. For tabular QA
            after hashing, pair with the{" "}
            <Link
              href="/files/csv-viewer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV viewer
            </Link>{" "}
            or{" "}
            <Link
              href="/files/csv-deduplicator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              CSV deduplicator
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related file and developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Browse the full{" "}
            <Link
              href="/#file-data-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              file and data tools
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
            <li>
              <Link
                href="/dev/hash-generator"
                className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
              >
                Hash generator (text)
              </Link>
              {" — "}
              <span className="text-zinc-600 dark:text-zinc-400">
                MD5, SHA-1, SHA-256, and SHA-512 from UTF-8 strings for APIs and
                tests.
              </span>
            </li>
            <li>
              <Link
                href="/dev/base64"
                className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
              >
                Base64 encoder &amp; decoder
              </Link>
              {" — "}
              <span className="text-zinc-600 dark:text-zinc-400">
                Encode arbitrary files or text when payloads—not checksums—must
                travel as ASCII.
              </span>
            </li>
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
            {fileHashFaqItems.map((item) => (
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
