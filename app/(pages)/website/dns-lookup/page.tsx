import type { Metadata } from "next";
import Link from "next/link";
import { DnsLookupTool } from "./dns-lookup-tool";
import { dnsLookupFaqItems } from "@/lib/dns-lookup-faq";
import { toolSections } from "@/lib/tool-catalog";

export const dynamic = "force-static";

const websiteTools =
  toolSections.find((s) => s.id === "website-url-tools")?.tools ?? [];
const relatedTools = websiteTools.filter((t) => t.href !== "/website/dns-lookup");

export const metadata: Metadata = {
  alternates: {
    canonical: "/website/dns-lookup",
  },
};

export default function DnsLookupPage() {
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
            <span className="text-foreground">DNS lookup</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            DNS lookup for A, AAAA, MX, TXT, CNAME, NS &amp; SOA
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Run a fast, browser-based{" "}
            <strong className="font-medium text-foreground">
              DNS record lookup
            </strong>{" "}
            against public resolvers. Inspect{" "}
            <strong className="font-medium text-foreground">
              IPv4 and IPv6 addresses
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">mail exchangers</strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              TXT strings for SPF and DKIM
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">CNAME aliases</strong>
            ,{" "}
            <strong className="font-medium text-foreground">nameserver delegation</strong>
            , and{" "}
            <strong className="font-medium text-foreground">SOA authority</strong>{" "}
            fields—ideal when you are validating a migration, debugging deliverability,
            or confirming{" "}
            <strong className="font-medium text-foreground">
              DNS propagation
            </strong>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <DnsLookupTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            How to use this DNS lookup tool
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Type the hostname your users type in the browser (for example{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-900">
              www.example.com
            </code>
            ) or paste a full page URL—we extract the host automatically. Choose a
            single{" "}
            <strong>DNS record type</strong> when you already know what you need, or
            select <strong>all common types</strong> to snapshot the public view of
            your zone in one pass. After you run a lookup, compare the answers with
            your DNS provider&apos;s editor and with our{" "}
            <Link
              href="/website/whois-lookup"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              WHOIS lookup
            </Link>{" "}
            when you need registrar context alongside live records.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            DNS record types this tool explains
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <strong className="text-foreground">A</strong> — maps the name to one
              or more <strong>IPv4 addresses</strong>. Essential for traditional
              hosting and CDN front doors.
            </li>
            <li>
              <strong className="text-foreground">AAAA</strong> — same role as A,
              but for <strong>IPv6</strong>. Dual-stack publishing improves reach on
              modern networks.
            </li>
            <li>
              <strong className="text-foreground">MX</strong> — ordered list of{" "}
              <strong>mail servers</strong> with priorities. Misconfigured MX is a
              leading cause of bounced or spoofed mail.
            </li>
            <li>
              <strong className="text-foreground">TXT</strong> — arbitrary text used
              for <strong>SPF</strong>, <strong>DKIM</strong>, <strong>DMARC</strong>,
              and SaaS domain verification. Large providers often split long strings
              into multiple chunks; we show both joined and chunked views.
            </li>
            <li>
              <strong className="text-foreground">CNAME</strong> — points a hostname
              at another canonical name. Rare on bare apex domains because of
              co-existence rules; common on <code className="text-sm">www</code> and
              app subdomains.
            </li>
            <li>
              <strong className="text-foreground">NS</strong> — lists authoritative{" "}
              <strong>nameservers</strong>. Mismatched NS data at the parent zone and
              your DNS host is a frequent copy-paste mistake after transfers.
            </li>
            <li>
              <strong className="text-foreground">SOA</strong> — administrative
              metadata: primary nameserver, responsible mailbox, serial, and timing
              fields used for zone transfers and refresh logic.
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            When to pair DNS lookup with other checks
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            DNS tells you <em>where</em> traffic should go; transport security tells
            you <em>how safely</em> it arrives. After MX or A records change, verify
            TLS with our{" "}
            <Link
              href="/website/ssl-certificate-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SSL certificate checker
            </Link>{" "}
            and confirm HTTP behavior using the{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header checker
            </Link>{" "}
            or{" "}
            <Link
              href="/website/response-code-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              response code checker
            </Link>
            . If marketing links redirect through chains, follow hops with the{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>
            . For crawler-facing rules, review{" "}
            <Link
              href="/website/robots-txt-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              robots.txt
            </Link>{" "}
            and HTML metadata via the{" "}
            <Link
              href="/website/meta-tags-extractor"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              meta tags extractor
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Practical DNS troubleshooting guide
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Start by confirming the <strong>exact hostname</strong> users hit—apex
            versus <code className="text-sm">www</code> versus a regional subdomain.
            Run <strong>ALL</strong> lookups after any DNS edit, then narrow to the
            specific type that matters (for example MX after moving email). Remember
            that resolvers cache answers for the record&apos;s TTL, so identical
            panels at two offices may disagree for minutes or hours. If public DNS
            shows stale data but your authoritative DNS UI is correct, wait for TTL
            decay or flush local caches only as a diagnostic step—end users still
            depend on global resolver behavior.
          </p>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Email authentication stacks almost always require coherent{" "}
            <strong>TXT</strong> publishing: one SPF policy per aligned domain,
            selector-based DKIM records from your ESP, and a DMARC policy hosted on{" "}
            <code className="text-sm">_dmarc.</code>
            When TXT verification for a SaaS product fails, re-run a TXT lookup on
            the precise name the vendor specifies—many dashboards hide the leading
            underscore hostnames beginners expect at the zone root.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related free tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browse the full{" "}
            <Link
              href="/#website-url-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              website and URL tools
            </Link>{" "}
            collection, or open a focused checker below.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {relatedTools.slice(0, 10).map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  {tool.name}
                </Link>
                {" — "}
                <span>{tool.description}</span>
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
            {dnsLookupFaqItems.map((item) => (
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
