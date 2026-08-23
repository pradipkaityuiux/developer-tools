import type { Metadata } from "next";
import Link from "next/link";
import { NumberConverterTool } from "./number-converter-tool";
import { numberConverterFaqItems } from "@/lib/number-converter-faq";
import { toolSections } from "@/lib/tool-catalog";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/number-converter");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/number-converter",
  },
};

export default function NumberConverterPage() {
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
            <span className="text-foreground">Number system converter</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Number system converter — binary, octal, decimal, and hexadecimal
            integers
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              radix converter online
            </strong>{" "}
            to translate the same whole number across{" "}
            <strong className="font-medium text-foreground">base 2</strong>{" "}
            (binary),{" "}
            <strong className="font-medium text-foreground">base 8</strong>{" "}
            (octal),{" "}
            <strong className="font-medium text-foreground">base 10</strong>{" "}
            (decimal), and{" "}
            <strong className="font-medium text-foreground">base 16</strong>{" "}
            (hexadecimal). Parsing uses{" "}
            <strong className="font-medium text-foreground">JavaScript BigInt</strong>
            , so large bit masks and pointer-sized values stay exact—unlike
            floating-point shortcuts that round past{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              Number.MAX_SAFE_INTEGER
            </code>
            . Accepts familiar{" "}
            <strong className="font-medium text-foreground">
              C-style prefixes
            </strong>{" "}
            (
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              0b
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              0o
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              0x
            </code>
            ), strips underscores and spaces inside digit runs, and formats
            outputs you can{" "}
            <strong className="font-medium text-foreground">
              copy with one click
            </strong>
            . Optional{" "}
            <strong className="font-medium text-foreground">
              binary nibble grouping
            </strong>{" "}
            aligns long strings with hex nybbles for dump-style reading.
            Everything runs{" "}
            <strong className="font-medium text-foreground">
              in your browser
            </strong>
            . Pair it with the{" "}
            <Link
              href="/dev/base64"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Base64 encoder and decoder
            </Link>{" "}
            when you need byte encoding rather than a numeric radix change, and
            the{" "}
            <Link
              href="/dev/unix-timestamp"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Unix timestamp converter
            </Link>{" "}
            when logs mix decimal epochs with hex file offsets.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <NumberConverterTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why binary, octal, decimal, and hex still matter in 2026
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">
              Binary representation
            </strong>{" "}
            is how hardware exposes registers and buses.{" "}
            <strong className="font-medium text-foreground">Octal</strong>{" "}
            lingers in Unix file permission triples (
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              chmod 755
            </code>
            ).{" "}
            <strong className="font-medium text-foreground">Decimal</strong>{" "}
            is the human default for business logic and APIs.{" "}
            <strong className="font-medium text-foreground">
              Hexadecimal
            </strong>{" "}
            compresses bits 4:1—ideal for memory addresses,{" "}
            <strong className="font-medium text-foreground">CSS colors</strong>
            , UUID fragments, and crypto fingerprints. A single{" "}
            <strong className="font-medium text-foreground">
              number base converter
            </strong>{" "}
            short-circuits mental arithmetic when you jump between a serial
            console, a web palette, and a REST JSON body.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Searchers often look for{" "}
            <strong className="font-medium text-foreground">
              binary to decimal calculator
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              hex to binary translator
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              octal to decimal online
            </strong>
            —this page covers all of those flows from one input field by fixing
            the source radix first, then exposing every target radix at once.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this number system converter (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  Choose input base:
                </strong>{" "}
                Use the dropdown for binary, octal, decimal, or hex. The parser
                then knows whether letters{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  a–f
                </code>{" "}
                are valid and which digit range applies.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  Type or paste:
                </strong>{" "}
                Include optional prefixes when they help—
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  0xff
                </code>
                ,{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  0b1010
                </code>
                ,{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  0o12
                </code>
                . Underscores and interior spaces are removed so copied literals
                from Rust, Verilog, or markdown tables still parse.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">
                  Tune display:
                </strong>{" "}
                Enable{" "}
                <strong className="font-medium text-foreground">
                  nibble grouping
                </strong>{" "}
                when you want spaced binary that lines up with hex columns.
                Toggle{" "}
                <strong className="font-medium text-foreground">
                  uppercase hex
                </strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">0x</strong>{" "}
                labels when your style guide or compiler expects them.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                <strong className="font-medium text-foreground">Copy:</strong>{" "}
                Use the clipboard icon beside each output. For bulk values
                stored in a repo,{" "}
                <strong className="font-medium text-foreground">
                  Load from file
                </strong>{" "}
                reads a local text file into the input without uploading it.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            BigInt accuracy vs double-precision shortcuts
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Many “online calculator” widgets coerce inputs through IEEE-754
            doubles. That breaks past{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              2^53 - 1
            </code>
            , which is painful when you work with 64-bit flags, large counters,
            or synthesized addresses. This tool keeps the mathematical value in{" "}
            <strong className="font-medium text-foreground">BigInt</strong>{" "}
            end-to-end so{" "}
            <strong className="font-medium text-foreground">
              binary ↔ hex ↔ decimal
            </strong>{" "}
            round trips stay bit-exact for integers. It does not attempt
            fractions—if you need floating radix conversion, rely on your
            language’s numeric tower or a scientific calculator with explicit
            precision controls.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Radix conversion in real workflows
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">
              Front-end developers
            </strong>{" "}
            jump between decimal RGB components and{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              #RRGGBB
            </code>{" "}
            hex.{" "}
            <strong className="font-medium text-foreground">
              Firmware engineers
            </strong>{" "}
            correlate register maps given in hex with oscilloscope traces
            labeled in binary.{" "}
            <strong className="font-medium text-foreground">
              Security reviewers
            </strong>{" "}
            compare decimal CVE scores with hex offsets in disassemblers. When a
            log line prints both decimal milliseconds and hex object ids, the{" "}
            <Link
              href="/dev/unix-timestamp"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Unix timestamp converter
            </Link>{" "}
            complements this page for the time half of the puzzle.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Prefixes, literals, and language quirks
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            JavaScript uses{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              0x
            </code>{" "}
            for hex and{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              0b
            </code>{" "}
            for binary literals; Python 3 accepts{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              0o
            </code>{" "}
            for octal. C and C++ lean on{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              0
            </code>
            -leading octal in older code but prefer explicit prefixes in modern
            style. This converter normalizes those markers after you select the
            correct base so you can paste snippets from Stack Overflow answers
            without manual scrubbing—then validate surrounding syntax with the{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter &amp; validator
            </Link>{" "}
            when the value sits inside API traffic.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            When Base64 is the right tool instead
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">Base64</strong>{" "}
            encodes arbitrary bytes into a text alphabet; it is not another
            integer radix. If you need to ship binary blobs through JSON or
            email, switch to the{" "}
            <Link
              href="/dev/base64"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Base64 encoder and decoder
            </Link>
            . If you need digests of strings, use the{" "}
            <Link
              href="/dev/hash-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              hash generator
            </Link>
            . If you are parsing structured tokens, the{" "}
            <Link
              href="/dev/jwt-decoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JWT decoder
            </Link>{" "}
            inspects Base64URL segments without verifying signatures.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Testing digit patterns and parsers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            When you build lexers or CLI flags that accept multiple bases,
            golden tests often need both valid and invalid strings. After you
            sketch a regex, exercise it in the{" "}
            <Link
              href="/dev/regex-tester"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              regex tester &amp; debugger
            </Link>{" "}
            with samples copied from this converter so expected conversions and
            error cases stay synchronized.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Privacy and classroom use
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Because conversion happens locally, students can work through{" "}
            <strong className="font-medium text-foreground">
              CS101 radix homework
            </strong>{" "}
            on a locked-down lab machine without creating accounts. Interview
            candidates can sanity-check hand-derived values before whiteboarding.
            Nothing leaves the tab unless you copy it yourself—handy when
            practicing with proprietary register values.
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
            {numberConverterFaqItems.map((item) => (
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
