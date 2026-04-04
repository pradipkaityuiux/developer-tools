import type { Metadata } from "next";
import Link from "next/link";
import { IpLookupTool } from "./ip-lookup-tool";
import { ipLookupFaqItems } from "@/lib/ip-lookup-faq";
import { toolSections } from "@/lib/tool-catalog";

const websiteTools =
  toolSections.find((s) => s.id === "website-url-tools")?.tools ?? [];
const relatedTools = websiteTools.filter((t) => t.href !== "/website/ip-lookup");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/website/ip-lookup",
  },
};

export default function IpLookupPage() {
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
            <span className="text-foreground">IP address lookup</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            IP address lookup for geolocation, ISP, ASN & reverse DNS
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Run a free{" "}
            <strong className="font-medium text-foreground">
              public IP lookup
            </strong>{" "}
            on any routable{" "}
            <strong className="font-medium text-foreground">IPv4</strong> or{" "}
            <strong className="font-medium text-foreground">IPv6</strong>{" "}
            address. You get{" "}
            <strong className="font-medium text-foreground">
              country and region
            </strong>{" "}
            hints, city and postal fields when available,{" "}
            <strong className="font-medium text-foreground">timezone</strong>{" "}
            metadata,{" "}
            <strong className="font-medium text-foreground">ISP</strong> and
            organization labels,{" "}
            <strong className="font-medium text-foreground">ASN</strong> data,
            optional{" "}
            <strong className="font-medium text-foreground">
              reverse DNS (PTR)
            </strong>{" "}
            hostnames, and lightweight{" "}
            <strong className="font-medium text-foreground">
              security classification
            </strong>{" "}
            flags—ideal for{" "}
            <strong className="font-medium text-foreground">
              network troubleshooting
            </strong>
            , marketing compliance checks, and quick fraud triage alongside your
            own logs.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <IpLookupTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            What is an IP address lookup?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            An{" "}
            <strong className="font-medium text-foreground">
              IP address lookup
            </strong>{" "}
            translates a machine-oriented number—the{" "}
            <strong className="font-medium text-foreground">
              Internet Protocol
            </strong>{" "}
            address assigned to an interface on the public routing system—into
            human-readable context. That context usually blends{" "}
            <strong className="font-medium text-foreground">
              routing registry
            </strong>{" "}
            and commercial{" "}
            <strong className="font-medium text-foreground">
              geolocation databases
            </strong>
            , so you can see which country or network is most often associated
            with that address, without needing access to your visitor&apos;s
            device.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This page focuses on{" "}
            <strong className="font-medium text-foreground">
              analyst-friendly summaries
            </strong>
            : where traffic is commonly seen, which organization announces the
            prefix, and whether a{" "}
            <strong className="font-medium text-foreground">PTR record</strong>{" "}
            exists. It complements hostname-oriented workflows—when you start
            from a domain, use our{" "}
            <Link
              href="/website/dns-lookup"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              DNS lookup tool
            </Link>{" "}
            for A, AAAA, MX, and TXT records, and our{" "}
            <Link
              href="/website/whois-lookup"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              WHOIS lookup
            </Link>{" "}
            when you care about registration rather than raw IP metadata.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this IP lookup (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Confirm you have a{" "}
                <strong className="font-medium text-foreground">
                  public address
                </strong>
                . Addresses inside{" "}
                <strong className="font-medium text-foreground">
                  RFC 1918
                </strong>{" "}
                private space, loopback, or link-local IPv6 cannot be placed on
                the global Internet and are blocked here on purpose.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Paste{" "}
                <strong className="font-medium text-foreground">
                  dotted decimal IPv4
                </strong>{" "}
                (for example{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  8.8.8.8
                </code>
                ) or{" "}
                <strong className="font-medium text-foreground">
                  colon hexadecimal IPv6
                </strong>
                . Bracketed IPv6 from URLs (such as{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  [::1]
                </code>{" "}
                —which is still loopback and will be rejected) is accepted when
                you copy the brackets; we normalize the value before lookup.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click{" "}
                <strong className="font-medium text-foreground">
                  Look up IP
                </strong>
                . The server validates input, fetches enriched metadata, and
                runs a{" "}
                <strong className="font-medium text-foreground">
                  reverse DNS
                </strong>{" "}
                query so you can compare provider branding with geolocation
                fields.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Interpret results conservatively. If you need to verify a live
                HTTP endpoint, follow with our{" "}
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
                </Link>{" "}
                on the hostname you discovered.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            IPv4 vs IPv6 lookups
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <strong className="font-medium text-foreground">IPv4</strong>{" "}
            addresses are 32-bit values shown as four octets.{" "}
            <strong className="font-medium text-foreground">IPv6</strong>{" "}
            addresses are 128-bit values shown as eight groups (with
            compression rules such as{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              ::
            </code>
            ). Both forms are valid inputs. Some databases lag on sparse IPv6
            deployments, so treat{" "}
            <strong className="font-medium text-foreground">IPv6 geolocation</strong>{" "}
            as especially approximate and cross-check with your own telemetry
            when decisions matter.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            ASN, ISP, and organization fields explained
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            The{" "}
            <strong className="font-medium text-foreground">
              Autonomous System Number (ASN)
            </strong>{" "}
            identifies a network that participates in global routing policy with
            a single numbered AS.{" "}
            <strong className="font-medium text-foreground">ISP</strong> and{" "}
            <strong className="font-medium text-foreground">organization</strong>{" "}
            strings are curated labels tied to that data—useful for grouping
            traffic by carrier or cloud, not for pinpointing individuals. When
            you audit TLS endpoints, you can correlate ASNs with certificate
            subjects using our{" "}
            <Link
              href="/website/ssl-certificate-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              SSL certificate checker
            </Link>{" "}
            to ensure hostname and chain data still match your expectations.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Reverse DNS (PTR) and why it is often blank
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            A{" "}
            <strong className="font-medium text-foreground">PTR record</strong>{" "}
            maps an IP back to a hostname. Many providers omit PTR for client
            pools, use generic names, or delegate differently for IPv6. Empty
            PTR output therefore does not imply a suspicious address—only that no
            useful name was published. When PTR exists, it can speed up log
            reading and help you align addresses with known SaaS egress ranges.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            IP lookup for SEO, marketing, and compliance
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Search-engine and analytics teams sometimes sample visitor IPs
            (where privacy law permits) to understand{" "}
            <strong className="font-medium text-foreground">
              country mix
            </strong>{" "}
            or to debug CDN routing. This utility gives you the same style of
            enrichment without installing desktop software. Combine it with our{" "}
            <Link
              href="/website/redirect-chain-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              redirect chain checker
            </Link>{" "}
            when you suspect geo or device rules are sending users through extra
            hops, and with the{" "}
            <Link
              href="/website/broken-link-checker"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              broken link checker
            </Link>{" "}
            when localized URLs break after a migration.
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
            section for more utilities, or open a focused checker below.
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
            {ipLookupFaqItems.map((item) => (
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
