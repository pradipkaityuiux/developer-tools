import type { Metadata } from "next";
import Link from "next/link";
import { OAuth2FlowVisualizerTool } from "./oauth2-flow-visualizer-tool";
import { oauth2FlowVisualizerFaqItems } from "@/lib/oauth2-flow-visualizer-faq";
import { toolSections } from "@/lib/tool-catalog";

const apiTools =
  toolSections.find((s) => s.id === "api-developer-toolbox")?.tools ?? [];
const relatedTools = apiTools.filter(
  (t) => t.href !== "/api-toolbox/oauth2-flow-visualizer",
);

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/api-toolbox/oauth2-flow-visualizer",
  },
};

export default function OAuth2FlowVisualizerPage() {
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
              href="/#api-developer-toolbox"
              className="hover:text-foreground"
            >
              API developer toolbox
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span className="text-foreground">OAuth 2.0 flow visualizer</span>
          </nav>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            OAuth 2.0 flow visualizer — authorization code, PKCE, and token
            exchange
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Use this free{" "}
            <strong className="font-medium text-foreground">
              OAuth 2.0 flow visualizer
            </strong>{" "}
            to learn how the{" "}
            <strong className="font-medium text-foreground">
              authorization code grant
            </strong>{" "}
            works end to end: the browser visits your{" "}
            <strong className="font-medium text-foreground">
              authorization endpoint
            </strong>{" "}
            with{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              response_type=code
            </code>
            , the user signs in, the redirect carries an{" "}
            <strong className="font-medium text-foreground">
              authorization code
            </strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">state</strong>, and
            your app exchanges the code at the{" "}
            <strong className="font-medium text-foreground">
              token endpoint
            </strong>{" "}
            for{" "}
            <strong className="font-medium text-foreground">
              access tokens
            </strong>{" "}
            (and often a{" "}
            <strong className="font-medium text-foreground">refresh token</strong>{" "}
            in confidential flows). Toggle{" "}
            <strong className="font-medium text-foreground">PKCE</strong> to see{" "}
            <strong className="font-medium text-foreground">
              code_verifier
            </strong>{" "}
            and{" "}
            <strong className="font-medium text-foreground">
              code_challenge
            </strong>{" "}
            for public clients and SPAs. Everything runs locally—pair it with
            our{" "}
            <Link
              href="/dev/jwt-decoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JWT decoder
            </Link>{" "}
            for OIDC{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-sm dark:bg-zinc-900">
              id_token
            </code>{" "}
            inspection and the{" "}
            <Link
              href="/dev/url-encoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              URL encoder
            </Link>{" "}
            when debugging redirect URIs.
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <OAuth2FlowVisualizerTool />

        <article className="mt-14 max-w-3xl text-foreground">
          <h2 className="text-xl font-semibold tracking-tight">
            Why visualize OAuth 2.0 flows?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Teams implementing{" "}
            <strong className="font-medium text-foreground">login</strong>,{" "}
            <strong className="font-medium text-foreground">SSO</strong>, or{" "}
            <strong className="font-medium text-foreground">
              API access tokens
            </strong>{" "}
            constantly revisit the same questions: which parameters belong on
            the authorize URL, how{" "}
            <strong className="font-medium text-foreground">redirect_uri</strong>{" "}
            matching works, why{" "}
            <strong className="font-medium text-foreground">state</strong>{" "}
            matters for CSRF, and when to add{" "}
            <strong className="font-medium text-foreground">PKCE</strong>. A
            dedicated{" "}
            <strong className="font-medium text-foreground">
              OAuth 2.0 debugging
            </strong>{" "}
            helper turns RFC prose into concrete strings you can diff against
            network traces, Postman collections, and framework logs—without
            sending credentials through a third-party backend.
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This page focuses on the{" "}
            <strong className="font-medium text-foreground">
              authorization code flow
            </strong>
            , which is the recommended pattern for web apps, mobile apps, and
            most OpenID Connect sign-in. Implicit and password grants are
            largely deprecated for new user-facing flows; if you maintain legacy
            clients, compare their parameters against what you generate here and
            migrate toward code + PKCE where possible.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            How to use this OAuth 2.0 flow visualizer (step by step)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <span className="text-foreground">
                Fill in your{" "}
                <strong className="font-medium text-foreground">
                  authorization endpoint
                </strong>{" "}
                and{" "}
                <strong className="font-medium text-foreground">
                  token endpoint
                </strong>{" "}
                from your provider&apos;s docs (Auth0, Okta, Azure AD, Keycloak,
                Cognito, or custom OIDC servers). Use{" "}
                <strong className="font-medium text-foreground">
                  Upload config JSON
                </strong>{" "}
                if you already saved a non-secret profile, or{" "}
                <strong className="font-medium text-foreground">
                  Load sample values
                </strong>{" "}
                to see the shape of each field.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Set{" "}
                <strong className="font-medium text-foreground">client_id</strong>
                ,{" "}
                <strong className="font-medium text-foreground">
                  redirect_uri
                </strong>
                , and{" "}
                <strong className="font-medium text-foreground">scope</strong>.
                The redirect URI must match your app registration exactly,
                including trailing slashes and scheme. Click{" "}
                <strong className="font-medium text-foreground">New</strong>{" "}
                beside <strong className="font-medium text-foreground">state</strong>{" "}
                for a fresh CSRF token per attempt.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Keep{" "}
                <strong className="font-medium text-foreground">PKCE</strong>{" "}
                enabled for public clients. Copy the{" "}
                <strong className="font-medium text-foreground">
                  authorization request URL
                </strong>{" "}
                only when testing against{" "}
                <strong className="font-medium text-foreground">
                  your own authorization server
                </strong>
                —never ask end users to sign in to production accounts on
                untrusted domains.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                After redirect, paste the full callback URL or query string. The
                tool extracts the{" "}
                <strong className="font-medium text-foreground">code</strong>{" "}
                and shows the returned{" "}
                <strong className="font-medium text-foreground">state</strong>{" "}
                so you can verify it matches what you stored before redirect.
              </span>
            </li>
            <li>
              <span className="text-foreground">
                Optionally add a{" "}
                <strong className="font-medium text-foreground">
                  client_secret
                </strong>{" "}
                for confidential server-side clients. Copy the{" "}
                <strong className="font-medium text-foreground">
                  application/x-www-form-urlencoded
                </strong>{" "}
                body or the{" "}
                <strong className="font-medium text-foreground">curl</strong>{" "}
                example and run it from your machine or paste into the{" "}
                <Link
                  href="/api-toolbox/http-request-builder"
                  className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
                >
                  HTTP request builder
                </Link>
                .
              </span>
            </li>
          </ol>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Keywords: OAuth 2.0 authorization code, PKCE, and OpenID Connect
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Engineers search for{" "}
            <strong className="font-medium text-foreground">
              OAuth 2.0 authorization code flow explained
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              PKCE code_challenge
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">
              OAuth redirect_uri mismatch
            </strong>
            , and{" "}
            <strong className="font-medium text-foreground">
              OpenID Connect token endpoint
            </strong>{" "}
            when integrating identity providers. This tool surfaces those pieces
            explicitly:{" "}
            <strong className="font-medium text-foreground">
              response_type=code
            </strong>
            ,{" "}
            <strong className="font-medium text-foreground">state</strong>,{" "}
            <strong className="font-medium text-foreground">
              code_challenge_method=S256
            </strong>
            , and the token request body with{" "}
            <strong className="font-medium text-foreground">
              grant_type=authorization_code
            </strong>
            . For JSON token responses, use the{" "}
            <Link
              href="/dev/json-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JSON formatter
            </Link>{" "}
            and{" "}
            <Link
              href="/api-toolbox/api-response-formatter"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              API response formatter
            </Link>{" "}
            to pretty-print responses from your token endpoint.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Security notes for production OAuth deployments
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Treat this page as a{" "}
            <strong className="font-medium text-foreground">
              teaching and debugging aid
            </strong>
            : it does not validate tokens, enforce TLS, or implement your
            provider&apos;s quirks (JWT client assertions, mTLS, or PAR). Never
            embed live client secrets in front-end apps; keep secrets on the
            server, rotate them, and use short-lived access tokens. When you
            issue or verify JWTs yourself, cross-check algorithms and signing
            keys with the{" "}
            <Link
              href="/security/jwt-encoder"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              JWT encoder
            </Link>{" "}
            in controlled test environments only.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight">
            Related API and developer tools
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Browse the full{" "}
            <Link
              href="/#api-developer-toolbox"
              className="font-medium text-foreground underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:hover:decoration-zinc-500"
            >
              API developer toolbox
            </Link>{" "}
            on the home page. Highlights:
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
            {oauth2FlowVisualizerFaqItems.map((item) => (
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
