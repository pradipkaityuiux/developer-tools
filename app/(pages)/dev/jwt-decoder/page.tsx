import type { Metadata } from "next";
import Link from "next/link";
import { JwtDecoderTool } from "./jwt-decoder-tool";
import { jwtDecoderFaqItems } from "@/lib/jwt-decoder-faq";
import { toolSections } from "@/lib/tool-catalog";
import { BlogCard } from "@/components/blog-card";

const devTools =
  toolSections.find((s) => s.id === "code-developer-tools")?.tools ?? [];
const relatedTools = devTools.filter((t) => t.href !== "/dev/jwt-decoder");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/dev/jwt-decoder",
  },
};

export default function JwtDecoderPage() {
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
            <span className="text-foreground">JWT decoder</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            JWT decoder online — read header, payload, and expiry (no signature
            check)
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              JWT decoder online
            </strong>{" "}
            to{" "}
            <strong className="font-medium text-foreground">
              Base64URL-decode JSON Web Tokens
            </strong>{" "}
            in the common{" "}
            <strong className="font-medium text-foreground">
              JWS compact
            </strong>{" "}
            shape (three dot-separated parts). Inspect{" "}
            <strong className="font-medium text-foreground">alg</strong>,{" "}
            <strong className="font-medium text-foreground">typ</strong>, and{" "}
            <strong className="font-medium text-foreground">kid</strong> in the
            header, then browse claims such as{" "}
            <strong className="font-medium text-foreground">sub</strong>,{" "}
            <strong className="font-medium text-foreground">aud</strong>,{" "}
            <strong className="font-medium text-foreground">iss</strong>, and{" "}
            <strong className="font-medium text-foreground">scope</strong> in the
            payload. The page highlights{" "}
            <strong className="font-medium text-foreground">exp</strong>,{" "}
            <strong className="font-medium text-foreground">nbf</strong>, and{" "}
            <strong className="font-medium text-foreground">iat</strong> so you
            can sanity-check{" "}
            <strong className="font-medium text-foreground">
              token lifetime
            </strong>{" "}
            during{" "}
            <strong className="font-medium text-foreground">
              OAuth 2.0
            </strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">
              OpenID Connect
            </strong>{" "}
            debugging. Everything runs{" "}
            <strong className="font-medium text-foreground">
              client-side in your browser
            </strong>
            —no upload—so staging tokens stay off shared backends. Pair it with
            our{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter &amp; validator
            </Link>{" "}
            after you copy decoded claims, and use the{" "}
            <Link
              href="/dev/unix-timestamp"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Unix timestamp converter
            </Link>{" "}
            when you compare epoch values from logs and gateways.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <JwtDecoderTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why decode JWTs during development?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            A{" "}
            <strong className="font-medium text-foreground">
              JSON Web Token
            </strong>{" "}
            packages claims that APIs and browsers exchange after login. When a
            request fails with{" "}
            <strong className="font-medium text-foreground">401</strong> or{" "}
            <strong className="font-medium text-foreground">403</strong>, teams
            often need a fast{" "}
            <strong className="font-medium text-foreground">
              JWT payload decoder
            </strong>{" "}
            to confirm scopes, tenant IDs, and expiry without spelunking through
            proprietary dashboards. This utility answers: “What did the issuer
            put in the token?”—not “Should my API trust it?” Trust requires{" "}
            <strong className="font-medium text-foreground">
              cryptographic verification
            </strong>{" "}
            with the right keys, which belongs in your{" "}
            <strong className="font-medium text-foreground">
              authorization server
            </strong>{" "}
            middleware, API gateway, or backend framework.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Because decoding is only Base64URL + JSON, it is safe for structure
            inspection but{" "}
            <strong className="font-medium text-foreground">
              trivial to forge
            </strong>{" "}
            if verification is skipped. Treat this page like a multimeter: great
            for signal tracing, not a substitute for production{" "}
            <strong className="font-medium text-foreground">authZ</strong>{" "}
            checks. When you normalize other wire formats, open the{" "}
            <Link
              href="/dev/base64"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Base64 encoder &amp; decoder
            </Link>{" "}
            for raw segments or the{" "}
            <Link
              href="/dev/url-encoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              URL encoder &amp; decoder
            </Link>{" "}
            when tokens travel in query strings.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this JWT decoder (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Paste the full token into the textarea—usually an{" "}
                <strong className="font-medium text-foreground">
                  access token
                </strong>{" "}
                or{" "}
                <strong className="font-medium text-foreground">
                  ID token
                </strong>{" "}
                from{" "}
                <strong className="font-medium text-foreground">
                  Authorization: Bearer
                </strong>{" "}
                headers. The field accepts a leading{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  Bearer
                </code>{" "}
                prefix; whitespace is trimmed automatically.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Read the decoded{" "}
                <strong className="font-medium text-foreground">header</strong>{" "}
                JSON for{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  alg
                </code>
                ,{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  typ
                </code>
                , and optional{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  kid
                </code>{" "}
                (key id). Then review the{" "}
                <strong className="font-medium text-foreground">payload</strong>{" "}
                for audience, subject, roles, and custom claims your product
                relies on.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Check the coloured status line for{" "}
                <strong className="font-medium text-foreground">exp</strong> and{" "}
                <strong className="font-medium text-foreground">nbf</strong>{" "}
                relative to your system clock. Refresh tokens, skew-tolerant
                servers, or cached sessions may still behave differently—this is
                a developer hint, not an authorization decision.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Use{" "}
                <strong className="font-medium text-foreground">Copy</strong> on
                each panel to move JSON into VS Code, Postman, or tickets. For
                large claim sets, continue editing with the{" "}
                <Link
                  href="/dev/json-formatter"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  JSON formatter
                </Link>{" "}
                or diff changes with the{" "}
                <Link
                  href="/dev/code-diff"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  code diff checker
                </Link>
                .
              </span>
            </li>
          </ol>

          <BlogCard
            title="How to Decode a JWT Token and Check If It's Expired"
            description="You don't need the secret key to read a JWT's payload. The signature (the third segment) is what requires the secret key to verify. But the payload itself is just base64-encoded JSON, which anyone can decode without any special access."
            href="/blog/decode-jwt-check-expired"
          />

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            JWT decoder keywords teams search for
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Engineers often look for an{" "}
            <strong className="font-medium text-foreground">
              online JWT parser
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              JWT inspector
            </strong>
            , or{" "}
            <strong className="font-medium text-foreground">
              decode JWT Base64URL
            </strong>{" "}
            when tracing mobile apps, SPAs, and microservices. Related searches
            include{" "}
            <strong className="font-medium text-foreground">
              OIDC ID token decode
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              OAuth access token claims
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              JWT exp checker
            </strong>
            . This page documents those workflows explicitly and keeps processing
            local so regulated teams can avoid SaaS uploads for routine
            inspection.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Header claims: alg, typ, kid, and why they matter
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            The header tells verifiers which algorithm and key material to use.
            Libraries must reject unexpected{" "}
            <strong className="font-medium text-foreground">alg</strong> values
            (especially{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              none
            </code>
            ) to prevent algorithm confusion attacks. The optional{" "}
            <strong className="font-medium text-foreground">kid</strong> points
            to a JWK in your issuer’s JWKS document so rotating keys does not
            break every client at once. Seeing these fields clearly helps when
            you compare tokens from staging vs production issuers or debug
            multi-tenant setups. For hashing and fingerprint ideas outside JWT,
            see the{" "}
            <Link
              href="/dev/hash-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              hash generator
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Payload claims: registered, public, and private names
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            JWT payloads combine{" "}
            <strong className="font-medium text-foreground">
              registered claim names
            </strong>{" "}
            (like{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              iss
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              sub
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              aud
            </code>
            ) with vendor-specific fields. Public names should be documented in
            registries; private names are agreements between your frontend and
            API. Decoding reveals structure but not truth—always reconcile claims
            with your identity provider and server-side policy. If you export
            claim snapshots to YAML configs, round-trip through{" "}
            <Link
              href="/dev/yaml-to-json"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              YAML to JSON
            </Link>{" "}
            to validate shape before deployment.
          </p>

          <BlogCard
            title="What is a JWT and How Does It Actually Work?"
            description="If you've worked on anything involving login systems or APIs, you've almost certainly run into JWTs, even if nobody ever properly explained what they are."
            href="/blog/what-is-a-jwt-explained"
          />

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Limitations: no JWE, no signature or encryption verification
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <strong className="font-medium text-foreground">
              Encrypted JWTs (JWE)
            </strong>{" "}
            use five segments and require decryption keys—this tool does not
            decrypt ciphertext. It also ignores the signature segment entirely,
            so tampered tokens still decode. For production, use maintained
            libraries, validate issuer and audience, enforce clock skew, and fetch
            keys over TLS from a trusted JWKS endpoint. When you test cron-based
            token rotation jobs, schedule math belongs in the{" "}
            <Link
              href="/dev/cron-explainer"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              cron expression explainer
            </Link>{" "}
            rather than JWT math alone.
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
            {jwtDecoderFaqItems.map((item) => (
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
