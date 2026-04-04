import type { Metadata } from "next";
import Link from "next/link";
import { TextToBinaryTool } from "./text-to-binary-tool";
import { textToBinaryFaqItems } from "@/lib/text-to-binary-faq";
import { toolSections } from "@/lib/tool-catalog";

const textTools =
  toolSections.find((s) => s.id === "text-string-tools")?.tools ?? [];
const relatedTools = textTools.filter((t) => t.href !== "/text/text-to-binary");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/text/text-to-binary",
  },
};

export default function TextToBinaryPage() {
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
            <span className="text-foreground">Text to binary converter</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Text to binary converter online — UTF-8 encode and decode
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              text to binary converter
            </strong>{" "}
            to turn any Unicode string into{" "}
            <strong className="font-medium text-foreground">
              8-bit binary groups per UTF-8 byte
            </strong>{" "}
            or to read a stream of{" "}
            <strong className="font-medium text-foreground">zeros and ones</strong>{" "}
            back into readable characters. Choose{" "}
            <strong className="font-medium text-foreground">
              spaced bytes
            </strong>{" "}
            for teaching slides and cheat sheets, or{" "}
            <strong className="font-medium text-foreground">compact</strong>{" "}
            output when you need a single uninterrupted bit string. Paste prose,
            code comments, or emoji-heavy UI copy; everything is processed{" "}
            <strong className="font-medium text-foreground">
              locally in your browser
            </strong>
            . When you are done experimenting with bits, compare other encodings
            with our{" "}
            <Link
              href="/dev/base64"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Base64 encoder and decoder
            </Link>{" "}
            and browse the full{" "}
            <Link
              href="/#text-string-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Text and String Tools
            </Link>{" "}
            collection on the home page.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <TextToBinaryTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why a dedicated binary string converter still matters
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Compilers and runtimes already speak binary, but humans learn faster
            when they can see each byte spelled out as{" "}
            <strong className="font-medium text-foreground">
              text to binary online
            </strong>{" "}
            examples. Instructors use spaced groups to explain ASCII versus
            multi-byte UTF-8; interview candidates verify endianness intuition;
            technical writers paste illustrative bit patterns next to protocol
            diagrams. Unlike heavyweight IDEs, this page stays focused: one
            textarea in, one out, optional file load, and a strict decoder that
            explains when UTF-8 rules reject a candidate bit sequence.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this converter (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Choose{" "}
                <strong className="font-medium text-foreground">
                  Text → binary
                </strong>{" "}
                to encode or{" "}
                <strong className="font-medium text-foreground">
                  Binary → text
                </strong>{" "}
                to decode. Encoding always interprets the left box as UTF-8
                plaintext; decoding strips every character except{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  0
                </code>{" "}
                and{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  1
                </code>
                , so you can paste columns from docs or logs without manual
                cleanup.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                For encoding, set{" "}
                <strong className="font-medium text-foreground">
                  Byte spacing
                </strong>{" "}
                to spaces between bytes for readability, or compact mode for a
                dense string. Decoding accepts both automatically.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Paste content or click{" "}
                <strong className="font-medium text-foreground">
                  Upload .txt
                </strong>{" "}
                to load a local plain-text file. Use{" "}
                <strong className="font-medium text-foreground">
                  Load sample
                </strong>{" "}
                for a UTF-8 demo that includes a newline and an emoji, which
                expands to multiple bytes in binary form.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Copy output
                </strong>{" "}
                (with the copy icon) to move binary or decoded text into notes,
                slides, or tickets. Use{" "}
                <strong className="font-medium text-foreground">Clear</strong>{" "}
                when you want a fresh buffer.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                If decoding fails, check that the total number of significant
                bits is divisible by eight and that bytes form valid UTF-8.
                After fixing prose spacing issues, the{" "}
                <Link
                  href="/text/whitespace-remover"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  whitespace remover
                </Link>{" "}
                can help normalize pasted blobs before you re-encode.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and learning paths this page supports
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            People often search for a{" "}
            <strong className="font-medium text-foreground">
              binary translator for text
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              string to binary generator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              binary to ASCII converter
            </strong>{" "}
            (ASCII is the single-byte subset of UTF-8 for basic Latin), or{" "}
            <strong className="font-medium text-foreground">
              how to write letters in binary
            </strong>
            . This tool answers all of those by showing true UTF-8 bytes: English
            letters match classic 7-bit codes, while symbols outside Basic Latin
            consume two or more bytes—exactly what modern apps store on disk. If
            you are chaining exercises, try the{" "}
            <Link
              href="/text/text-reverser"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              text reverser
            </Link>{" "}
            on a phrase, then encode the result to compare bit patterns before
            and after reversal.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            UTF-8, security, and when not to use binary obfuscation
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Binary encoding is reversible by anyone who copies the string—it is
            not encryption. For classroom Caesar shifts or ROT13 demos, use the{" "}
            <Link
              href="/text/caesar-cipher"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Caesar cipher tool
            </Link>{" "}
            or{" "}
            <Link
              href="/text/rot13"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              ROT13 encoder
            </Link>{" "}
            instead of mistaking bit strings for secrecy. For production APIs,
            prefer established binary-to-text formats: compare this page’s output
            mentally with what you get from the{" "}
            <Link
              href="/dev/base64"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Base64 tool
            </Link>{" "}
            or hex dumps in your debugger—same bytes, different spellings.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Limitations compared with hex editors and protocol analyzers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This utility targets human-readable Unicode text, not arbitrary file
            contents. Large binaries, images, or compressed blobs should be opened
            in a hex editor or analyzed with packet tools; decoding random bytes
            as UTF-8 will often fail by design. For embedding small assets in
            markup, the{" "}
            <Link
              href="/files/image-to-base64"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              image to Base64 converter
            </Link>{" "}
            is a better fit than stretching megabytes into ones and zeros in a
            textarea.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related text and string tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Explore more utilities under{" "}
            <Link
              href="/#text-string-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Text and String Tools
            </Link>
            . Highlights beyond this page:
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
            {textToBinaryFaqItems.map((item) => (
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
