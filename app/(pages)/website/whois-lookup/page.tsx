import type { Metadata } from "next";
import Link from "next/link";
import { WhoisLookupTool } from "./whois-lookup-tool";
import { whoisLookupFaqItems } from "@/lib/whois-lookup-faq";
import { toolSections } from "@/lib/tool-catalog";

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/website/whois-lookup",
  },
};

const websiteTools =
  toolSections.find((s) => s.id === "website-url-tools")?.tools ?? [];
const relatedTools = websiteTools.filter(
  (t) => t.href !== "/website/whois-lookup",
);

export default function WhoisLookupPage() {
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
            <span className="text-foreground">WHOIS lookup</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            WHOIS lookup: domain registration and RDAP details
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Run a fast, browser-friendly{" "}
            <strong className="font-medium text-foreground">
              WHOIS-style domain lookup
            </strong>{" "}
            backed by{" "}
            <strong className="font-medium text-foreground">RDAP</strong>{" "}
            (Registration Data Access Protocol). See{" "}
            <strong className="font-medium text-foreground">registrar</strong>{" "}
            information when published,{" "}
            <strong className="font-medium text-foreground">
              EPP-style status
            </strong>{" "}
            flags, delegated{" "}
            <strong className="font-medium text-foreground">
              nameservers
            </strong>
            , and registry{" "}
            <strong className="font-medium text-foreground">
              registration events
            </strong>{" "}
            — useful for{" "}
            <strong className="font-medium text-foreground">SEO research</strong>
            , brand protection, mergers and acquisitions due diligence, and
            incident response.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <WhoisLookupTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            How to use this WHOIS lookup tool
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Paste a{" "}
            <strong className="text-foreground">registered domain</strong> like{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-900">
              example.com
            </code>{" "}
            or a full marketing URL—we normalize input and query the correct
            registry RDAP service for that{" "}
            <strong className="text-foreground">top-level domain (TLD)</strong>.
            Results appear as structured fields instead of a raw WHOIS text blob,
            which makes it easier to scan{" "}
            <strong className="text-foreground">expiry-related dates</strong>,{" "}
            <strong className="text-foreground">transfer locks</strong>, and DNS
            delegation. When you also need live resolution data, follow up with
            our{" "}
            <Link
              href="/website/dns-lookup"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              DNS lookup tool
            </Link>{" "}
            for A, AAAA, MX, TXT, and other record types as they propagate on
            the public internet. For numeric addresses, use{" "}
            <Link
              href="/website/ip-lookup"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              IP address lookup
            </Link>{" "}
            instead—this WHOIS page is for domain names and hostnames.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            WHOIS vs RDAP: what you are seeing
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Classic{" "}
            <strong className="text-foreground">WHOIS</strong> often meant a
            line-oriented response on TCP port 43.{" "}
            <strong className="text-foreground">RDAP</strong> is the standardized
            HTTP-based successor: registries return{" "}
            <strong className="text-foreground">JSON</strong> with explicit
            fields for events, entities, and links. For your workflow the
            distinction rarely matters—both expose{" "}
            <strong className="text-foreground">public registration metadata</strong>
            —but RDAP is easier to keep consistent across{" "}
            <strong className="text-foreground">gTLDs</strong> and many{" "}
            <strong className="text-foreground">ccTLDs</strong>. If a field is
            missing, it is usually due to{" "}
            <strong className="text-foreground">privacy redaction</strong>{" "}
            (especially post-GDPR) or registry policy, not because the lookup
            failed silently.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Practical guide: domain status and SEO trust signals
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Search engines and users indirectly care about registration hygiene:
            long-lived domains with stable DNS and clean transfer policies can
            correlate with trust, while frequent registrar churn or odd
            nameserver patterns may warrant a closer look during a{" "}
            <strong className="text-foreground">link audit</strong> or partner
            review. Use WHOIS/RDAP alongside our{" "}
            <Link
              href="/website/domain-age-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              domain age checker
            </Link>{" "}
            when you want a quick read on how long a name has been registered,
            and our{" "}
            <Link
              href="/website/ssl-certificate-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SSL certificate checker
            </Link>{" "}
            to confirm TLS issuance aligns with the brand you expect on the
            hostname you are investigating.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Security, phishing, and vendor due diligence
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Security teams use{" "}
            <strong className="text-foreground">domain registration lookups</strong>{" "}
            to compare a suspicious hostname against known corporate registrars,
            spot young domains used in credential phishing, or validate that an
            acquisition target controls the right portfolio. RDAP responses may
            include{" "}
            <strong className="text-foreground">legal notices</strong> from the
            registry—read them before drawing conclusions, especially for
            ccTLDs with local rules. This tool only queries public RDAP
            endpoints; it does not bypass authentication or access non-public
            data.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and concepts this page covers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Throughout this guide we reference common searches such as{" "}
            <strong className="text-foreground">WHOIS lookup</strong>,{" "}
            <strong className="text-foreground">domain registration search</strong>
            , <strong className="text-foreground">ICANN RDAP</strong>,{" "}
            <strong className="text-foreground">registrar identification</strong>,{" "}
            <strong className="text-foreground">domain expiry date</strong>,{" "}
            <strong className="text-foreground">nameserver delegation</strong>,{" "}
            and{" "}
            <strong className="text-foreground">
              EPP domain status codes
            </strong>{" "}
            (client/server hold, transfer lock, renew period). Use the vocabulary
            that matches your team—product, marketing, IT, or legal—and always
            confirm contract-critical dates in your registrar console.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related free tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Browse the full{" "}
            <Link
              href="/#website-url-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              website and URL tools
            </Link>{" "}
            section on the home page, or open a focused utility below. Pairing
            WHOIS with{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect tracing
            </Link>{" "}
            and{" "}
            <Link
              href="/website/http-header-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HTTP header inspection
            </Link>{" "}
            helps you correlate ownership signals with live web behavior.
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
            {whoisLookupFaqItems.map((item) => (
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
