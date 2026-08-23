import type { Metadata } from "next";
import Link from "next/link";
import { JwtEncoderTool } from "./jwt-encoder-tool";
import { jwtEncoderFaqItems } from "@/lib/jwt-encoder-faq";
import { toolSections } from "@/lib/tool-catalog";
import { BlogCard } from "@/components/blog-card";

const securityTools =
  toolSections.find((s) => s.id === "security-encryption-tools")?.tools ?? [];
const relatedTools = securityTools.filter((t) => t.href !== "/security/jwt-encoder");

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/security/jwt-encoder",
  },
};

export default function JwtEncoderPage() {
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
            <span className="text-foreground">JWT encoder</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            JWT encoder online — HS256 HMAC signatures for API mocks and auth QA
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              JWT encoder online
            </strong>{" "}
            to{" "}
            <strong className="font-medium text-foreground">
              create HS256-signed JSON Web Tokens
            </strong>{" "}
            from editable{" "}
            <strong className="font-medium text-foreground">header</strong> and{" "}
            <strong className="font-medium text-foreground">payload</strong>{" "}
            JSON. The tool forms the standard{" "}
            <strong className="font-medium text-foreground">
              JWS compact serialization
            </strong>{" "}
            (three Base64URL segments), then signs{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              header.payload
            </code>{" "}
            with{" "}
            <strong className="font-medium text-foreground">
              HMAC-SHA256 (HS256)
            </strong>{" "}
            using your UTF-8 secret—ideal when you need a{" "}
            <strong className="font-medium text-foreground">
              Bearer token sample
            </strong>{" "}
            for{" "}
            <strong className="font-medium text-foreground">Postman</strong>,{" "}
            <strong className="font-medium text-foreground">curl</strong>, or{" "}
            <strong className="font-medium text-foreground">integration tests</strong>{" "}
            that mirror symmetric-key APIs. Signing runs{" "}
            <strong className="font-medium text-foreground">
              in your browser via Web Crypto
            </strong>
            ; use the <strong className="font-medium text-foreground">Upload</strong>{" "}
            controls to pull JSON fixtures from disk and the{" "}
            <strong className="font-medium text-foreground">Copy</strong> control on
            the result to move tokens into clients. Cross-check issued tokens with our{" "}
            <Link
              href="/dev/jwt-decoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JWT decoder
            </Link>
            , tighten JSON with the{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter &amp; validator
            </Link>
            , and browse every{" "}
            <Link
              href="/#security-encryption-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              security &amp; encryption tool
            </Link>{" "}
            from the home page.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <JwtEncoderTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why teams need a JWT encoder during development
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Microservices and SPAs increasingly rely on{" "}
            <strong className="font-medium text-foreground">JSON Web Tokens</strong>{" "}
            for{" "}
            <strong className="font-medium text-foreground">
              stateless authorization
            </strong>
            . When a gateway expects{" "}
            <strong className="font-medium text-foreground">
              Authorization: Bearer
            </strong>{" "}
            with a symmetric HS256 token, engineers need a fast way to mint{" "}
            <strong className="font-medium text-foreground">signed samples</strong>{" "}
            that match their test fixtures—without deploying a full identity
            server. A{" "}
            <strong className="font-medium text-foreground">
              JWT generator HS256
            </strong>{" "}
            workflow fills that gap: you control{" "}
            <strong className="font-medium text-foreground">registered claims</strong>{" "}
            like{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              exp
            </code>
            ,{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              iss
            </code>
            , and{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              aud
            </code>
            , plus private names your API understands. This page is not a
            substitute for a production{" "}
            <strong className="font-medium text-foreground">
              OAuth 2.0 / OpenID Connect
            </strong>{" "}
            issuer—it helps you reproduce token shape and signature math locally.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How HS256 signing works (short guide)
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            HS256 uses a shared secret: the same key material signs the token and
            verifies it on the resource server. The JWT header normally declares{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              alg: HS256
            </code>
            . The signing input is the ASCII string of the first two segments
            joined by a dot, without a trailing dot. The signature is the
            HMAC-SHA256 digest of that string, Base64URL-encoded as the third
            segment. If you need raw HMAC digests outside the JWT layout, compare
            results with the{" "}
            <Link
              href="/security/hmac-generator"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              HMAC generator
            </Link>{" "}
            in the same security toolkit.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this JWT encoder (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Edit the <strong className="font-medium text-foreground">header</strong>{" "}
                JSON. The default includes{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  typ: JWT
                </code>{" "}
                and HS256; this tool enforces HS256 signing even if you omit{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  alg
                </code>
                . Optional: click{" "}
                <strong className="font-medium text-foreground">Upload</strong> next
                to the field to load a saved header JSON file from your machine.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Edit the <strong className="font-medium text-foreground">payload</strong>{" "}
                JSON with claims your tests require—often{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  sub
                </code>
                ,{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  iat
                </code>
                , and{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
                  exp
                </code>{" "}
                as Unix seconds. Upload a JSON file if you keep golden payloads in
                repo fixtures.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Enter the <strong className="font-medium text-foreground">secret</strong>{" "}
                string your verifier will use. It must match byte-for-byte what the
                server expects (UTF-8 encoding). Use disposable values for screenshots
                and demos.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Click <strong className="font-medium text-foreground">Sign &amp; build JWT</strong>
                . Copy the token with the <strong className="font-medium text-foreground">Copy</strong>{" "}
                button (copy icon) and attach it to HTTP requests. Decode the same
                string with the{" "}
                <Link
                  href="/dev/jwt-decoder"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  JWT decoder
                </Link>{" "}
                to confirm header and payload round-tripped.
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords and search intents this page covers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Developers often search for an{" "}
            <strong className="font-medium text-foreground">online JWT maker</strong>,{" "}
            <strong className="font-medium text-foreground">HS256 token generator</strong>,{" "}
            <strong className="font-medium text-foreground">JWT sign with secret</strong>, or{" "}
            <strong className="font-medium text-foreground">HMAC JWT tool</strong> when
            wiring middleware or mocking APIs. Related workflows include{" "}
            <strong className="font-medium text-foreground">Postman JWT</strong>{" "}
            presets,{" "}
            <strong className="font-medium text-foreground">Express jwt.verify</strong>{" "}
            smoke tests, and teaching the difference between symmetric and asymmetric
            signing. For Base64URL building blocks outside the JWT wrapper, use the{" "}
            <Link
              href="/dev/base64"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              Base64 encoder &amp; decoder
            </Link>
            .
          </p>

          <BlogCard
            title="What Is a JWT and How Does It Actually Work?"
            description="If you've worked on anything involving login systems or APIs, you've almost certainly run into JWTs, even if nobody ever properly explained what they are."
            href="/blog/what-is-a-jwt-explained"
          />

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Security and limitations
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            This utility only implements{" "}
            <strong className="font-medium text-foreground">HS256</strong>. It does not
            issue refresh tokens, manage JWKS rotation, or validate{" "}
            <strong className="font-medium text-foreground">aud</strong> /{" "}
            <strong className="font-medium text-foreground">iss</strong> for you—your
            API must still enforce policy. Encrypted tokens (JWE) and RSA/ECDSA
            algorithms are out of scope. Never paste production secrets into shared
            machines; prefer CI secrets stores and short-lived test keys. When
            evaluating password strength for human-chosen shared secrets, use the{" "}
            <Link
              href="/security/password-strength"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              password strength meter
            </Link>{" "}
            before reusing strings across environments.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related security &amp; encryption tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Highlights from the catalog (also listed on the{" "}
            <Link
              href="/#security-encryption-tools"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              home page security section
            </Link>
            ):
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
            {jwtEncoderFaqItems.map((item) => (
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
