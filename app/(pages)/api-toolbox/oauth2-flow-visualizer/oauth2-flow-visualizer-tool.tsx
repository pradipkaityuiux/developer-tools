"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Copy, Download, Upload } from "lucide-react";
import {
  buildAuthorizationUrl,
  buildTokenExchangeCurl,
  buildTokenExchangeFormBody,
  generatePkcePair,
  OAUTH2_VISUALIZER_EXPORT_VERSION,
  parseAuthorizationCallback,
  parseVisualizerConfigJson,
  randomState,
  type OAuth2VisualizerExport,
} from "@/lib/oauth2-flow-visualizer-core";

const MAX_FILE_BYTES = 32 * 1024;

const DEFAULT_ENDPOINTS = {
  authorizeEndpoint: "https://authorization.example.com/oauth/authorize",
  tokenEndpoint: "https://authorization.example.com/oauth/token",
  clientId: "demo-public-client",
  redirectUri: "https://myapp.example.com/oauth/callback",
  scope: "openid profile email",
};

const FLOW_STEPS = [
  {
    id: 1,
    title: "Authorize",
    short: "User agent opens the authorization URL with response_type=code.",
  },
  {
    id: 2,
    title: "Consent",
    short: "Resource owner signs in and approves scopes at the authorization server.",
  },
  {
    id: 3,
    title: "Redirect",
    short: "Browser returns to redirect_uri with ?code=…&state=… (or ?error=…).",
  },
  {
    id: 4,
    title: "Token",
    short: "Your backend or secure client POSTs the code to the token endpoint.",
  },
] as const;

export function OAuth2FlowVisualizerTool() {
  const uploadId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [authorizeEndpoint, setAuthorizeEndpoint] = useState(
    DEFAULT_ENDPOINTS.authorizeEndpoint,
  );
  const [tokenEndpoint, setTokenEndpoint] = useState(
    DEFAULT_ENDPOINTS.tokenEndpoint,
  );
  const [clientId, setClientId] = useState(DEFAULT_ENDPOINTS.clientId);
  const [redirectUri, setRedirectUri] = useState(DEFAULT_ENDPOINTS.redirectUri);
  const [scope, setScope] = useState(DEFAULT_ENDPOINTS.scope);
  const [oauthState, setOauthState] = useState("");
  const [usePkce, setUsePkce] = useState(true);
  const [codeVerifier, setCodeVerifier] = useState("");
  const [codeChallenge, setCodeChallenge] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [callbackInput, setCallbackInput] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [highlightStep, setHighlightStep] = useState<number>(1);
  const [importNote, setImportNote] = useState<string | null>(null);
  const [copyKey, setCopyKey] = useState<string | null>(null);

  useEffect(() => {
    setOauthState(randomState());
  }, []);

  useEffect(() => {
    if (!usePkce) {
      setCodeVerifier("");
      setCodeChallenge("");
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const pair = await generatePkcePair();
        if (!cancelled) {
          setCodeVerifier(pair.verifier);
          setCodeChallenge(pair.challenge);
        }
      } catch {
        if (!cancelled) {
          setCodeVerifier("");
          setCodeChallenge("");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [usePkce]);

  useEffect(() => {
    if (!copyKey) return;
    const t = window.setTimeout(() => setCopyKey(null), 2000);
    return () => window.clearTimeout(t);
  }, [copyKey]);

  const authorizeBuilt = useMemo(
    () =>
      buildAuthorizationUrl({
        authorizeEndpoint,
        clientId,
        redirectUri,
        scope,
        state: oauthState,
        codeChallenge: usePkce ? codeChallenge : undefined,
        codeChallengeMethod: usePkce ? "S256" : undefined,
      }),
    [
      authorizeEndpoint,
      clientId,
      redirectUri,
      scope,
      oauthState,
      usePkce,
      codeChallenge,
    ],
  );

  const parsedCallback = useMemo(
    () => parseAuthorizationCallback(callbackInput),
    [callbackInput],
  );

  useEffect(() => {
    if (parsedCallback.code) setAuthCode(parsedCallback.code);
  }, [parsedCallback.code]);

  const tokenBody = useMemo(() => {
    const code = authCode.trim();
    if (!code) return "";
    return buildTokenExchangeFormBody({
      code,
      redirectUri,
      clientId,
      clientSecret: clientSecret.trim() || undefined,
      codeVerifier: usePkce ? codeVerifier : undefined,
    });
  }, [authCode, redirectUri, clientId, clientSecret, usePkce, codeVerifier]);

  const curlBuilt = useMemo(() => {
    if (!tokenBody) return { ok: false as const, error: "Missing authorization code." };
    return buildTokenExchangeCurl(tokenEndpoint, tokenBody);
  }, [tokenEndpoint, tokenBody]);

  const copyText = useCallback(async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyKey(key);
    } catch {
      setCopyKey("error");
    }
  }, []);

  function regenerateStateAndPkce() {
    setOauthState(randomState());
    if (usePkce) {
      void regeneratePkceOnly();
    }
  }

  async function regeneratePkceOnly() {
    try {
      const pair = await generatePkcePair();
      setCodeVerifier(pair.verifier);
      setCodeChallenge(pair.challenge);
    } catch {
      /* ignore */
    }
  }

  function exportConfig(): OAuth2VisualizerExport {
    return {
      version: OAUTH2_VISUALIZER_EXPORT_VERSION,
      authorizeEndpoint,
      tokenEndpoint,
      clientId,
      redirectUri,
      scope,
      usePkce,
    };
  }

  function downloadConfigJson() {
    const blob = new Blob([JSON.stringify(exportConfig(), null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "oauth2-flow-visualizer-config.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    setImportNote(null);
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setImportNote(
        `File is larger than ${Math.round(MAX_FILE_BYTES / 1024)} KB.`,
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      const parsed = parseVisualizerConfigJson(text);
      if (!parsed.ok) {
        setImportNote(parsed.error);
        return;
      }
      const d = parsed.data;
      setAuthorizeEndpoint(d.authorizeEndpoint);
      setTokenEndpoint(d.tokenEndpoint);
      setClientId(d.clientId);
      setRedirectUri(d.redirectUri);
      setScope(d.scope);
      setUsePkce(d.usePkce);
      setOauthState(randomState());
      setImportNote("Loaded OAuth2 visualizer config from file.");
    };
    reader.onerror = () => setImportNote("Could not read that file.");
    reader.readAsText(file, "utf-8");
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
      <div
        className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300"
        role="status"
      >
        <strong className="font-medium text-foreground">Privacy:</strong> URLs and
        form bodies are built only in your browser. This page does not send your
        client secret or tokens to any server.
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-foreground">
          Authorization code flow (overview)
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Follow the numbered steps. Use the highlight control to focus each phase
          while you read the generated URLs and curl example.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {FLOW_STEPS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setHighlightStep(s.id)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                highlightStep === s.id
                  ? "border-foreground bg-foreground text-background"
                  : "border-zinc-300 bg-white text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              }`}
            >
              {s.id}. {s.title}
            </button>
          ))}
        </div>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FLOW_STEPS.map((s) => (
            <li
              key={s.id}
              className={`rounded-lg border p-3 text-sm transition-colors ${
                highlightStep === s.id
                  ? "border-foreground/40 bg-zinc-50 dark:bg-zinc-900/80"
                  : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
              }`}
            >
              <span className="font-medium text-foreground">{s.title}</span>
              <p className="mt-1.5 leading-relaxed text-zinc-600 dark:text-zinc-400">
                {s.short}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <input
          ref={fileRef}
          id={uploadId}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          onChange={onFileChange}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          <Upload className="size-4 shrink-0" aria-hidden />
          Upload config JSON
        </button>
        <button
          type="button"
          onClick={downloadConfigJson}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          <Download className="size-4 shrink-0" aria-hidden />
          Download config
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthorizeEndpoint(DEFAULT_ENDPOINTS.authorizeEndpoint);
            setTokenEndpoint(DEFAULT_ENDPOINTS.tokenEndpoint);
            setClientId(DEFAULT_ENDPOINTS.clientId);
            setRedirectUri(DEFAULT_ENDPOINTS.redirectUri);
            setScope(DEFAULT_ENDPOINTS.scope);
            setCallbackInput("");
            setAuthCode("");
            setClientSecret("");
            setUsePkce(true);
            regenerateStateAndPkce();
            setImportNote("Reset to sample endpoints.");
          }}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          Load sample values
        </button>
      </div>
      {importNote && (
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{importNote}</p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Endpoints &amp; client</h3>
          <div>
            <label
              htmlFor="oauth-auth-url"
              className="block text-sm font-medium text-foreground"
            >
              Authorization endpoint
            </label>
            <input
              id="oauth-auth-url"
              type="url"
              value={authorizeEndpoint}
              onChange={(e) => setAuthorizeEndpoint(e.target.value)}
              autoComplete="off"
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            />
          </div>
          <div>
            <label
              htmlFor="oauth-token-url"
              className="block text-sm font-medium text-foreground"
            >
              Token endpoint
            </label>
            <input
              id="oauth-token-url"
              type="url"
              value={tokenEndpoint}
              onChange={(e) => setTokenEndpoint(e.target.value)}
              autoComplete="off"
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            />
          </div>
          <div>
            <label
              htmlFor="oauth-client-id"
              className="block text-sm font-medium text-foreground"
            >
              Client ID
            </label>
            <input
              id="oauth-client-id"
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              autoComplete="off"
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            />
          </div>
          <div>
            <label
              htmlFor="oauth-redirect"
              className="block text-sm font-medium text-foreground"
            >
              Redirect URI (must match app registration)
            </label>
            <input
              id="oauth-redirect"
              type="url"
              value={redirectUri}
              onChange={(e) => setRedirectUri(e.target.value)}
              autoComplete="off"
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            />
          </div>
          <div>
            <label
              htmlFor="oauth-scope"
              className="block text-sm font-medium text-foreground"
            >
              Scope
            </label>
            <input
              id="oauth-scope"
              type="text"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              autoComplete="off"
              placeholder="openid profile email"
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            />
          </div>
          <div>
            <label
              htmlFor="oauth-state"
              className="block text-sm font-medium text-foreground"
            >
              state (CSRF token)
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                id="oauth-state"
                type="text"
                value={oauthState}
                onChange={(e) => setOauthState(e.target.value)}
                autoComplete="off"
                className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
              />
              <button
                type="button"
                onClick={() => setOauthState(randomState())}
                className="shrink-0 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                New
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={usePkce}
                onChange={(e) => setUsePkce(e.target.checked)}
                className="size-4 rounded border-zinc-300 text-foreground focus:ring-zinc-500"
              />
              Use PKCE (recommended for public clients)
            </label>
          </div>
          {usePkce && (
            <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  code_verifier
                </span>
                <button
                  type="button"
                  onClick={() => void regeneratePkceOnly()}
                  className="text-xs font-medium text-foreground underline hover:no-underline"
                >
                  Regenerate pair
                </button>
              </div>
              <pre className="max-h-24 overflow-auto whitespace-pre-wrap break-all font-mono text-xs text-foreground">
                {codeVerifier || "—"}
              </pre>
              <div className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                code_challenge (S256)
              </div>
              <pre className="max-h-20 overflow-auto whitespace-pre-wrap break-all font-mono text-xs text-foreground">
                {codeChallenge || "—"}
              </pre>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                Step 1 — Authorization request URL
              </h3>
              {authorizeBuilt.ok && (
                <button
                  type="button"
                  onClick={() => void copyText("auth", authorizeBuilt.url)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  {copyKey === "auth" ? (
                    <Check className="size-3.5 text-emerald-600" aria-hidden />
                  ) : (
                    <Copy className="size-3.5" aria-hidden />
                  )}
                  Copy URL
                </button>
              )}
            </div>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Open this URL in a browser only when testing your own authorization
              server—never send real user credentials through untrusted sites.
            </p>
            {!authorizeBuilt.ok ? (
              <p
                className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"
                role="status"
              >
                {authorizeBuilt.error}
              </p>
            ) : (
              <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs leading-relaxed text-foreground dark:border-zinc-800 dark:bg-zinc-900/50 sm:text-sm">
                {authorizeBuilt.url}
              </pre>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Step 2 — Redirect callback (paste query string or full URL)
            </h3>
            <textarea
              value={callbackInput}
              onChange={(e) => setCallbackInput(e.target.value)}
              rows={4}
              spellCheck={false}
              placeholder="https://myapp.example.com/oauth/callback?code=AUTH_CODE&state=..."
              className="mt-2 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none ring-zinc-400 focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:ring-zinc-600"
            />
            {parsedCallback.error && (
              <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                OAuth error: {parsedCallback.error}
                {parsedCallback.error_description
                  ? ` — ${parsedCallback.error_description}`
                  : ""}
              </p>
            )}
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="oauth-code-manual"
                  className="block text-xs font-medium text-zinc-500 dark:text-zinc-400"
                >
                  Authorization code (or edit manually)
                </label>
                <input
                  id="oauth-code-manual"
                  type="text"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  autoComplete="off"
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
                />
              </div>
              <div>
                <span className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  state returned
                </span>
                <p className="mt-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-sm text-foreground dark:border-zinc-800 dark:bg-zinc-900/50">
                  {parsedCallback.state ?? "—"}
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Compare returned state with the value you stored before redirect.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                Step 3 — Token exchange (application/x-www-form-urlencoded)
              </h3>
              {tokenBody && (
                <button
                  type="button"
                  onClick={() => void copyText("body", tokenBody)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  {copyKey === "body" ? (
                    <Check className="size-3.5 text-emerald-600" aria-hidden />
                  ) : (
                    <Copy className="size-3.5" aria-hidden />
                  )}
                  Copy body
                </button>
              )}
            </div>
            <div className="mt-2">
              <label
                htmlFor="oauth-client-secret"
                className="block text-xs font-medium text-zinc-500 dark:text-zinc-400"
              >
                Client secret (optional — confidential clients only; never ship to
                browsers)
              </label>
              <input
                id="oauth-client-secret"
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                autoComplete="off"
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-zinc-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            {!tokenBody ? (
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Enter an authorization code above to generate the POST body.
              </p>
            ) : (
              <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-all rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs text-foreground dark:border-zinc-800 dark:bg-zinc-900/50">
                {tokenBody}
              </pre>
            )}
            {curlBuilt.ok && (
              <div className="mt-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">
                    Example curl (bash)
                  </span>
                  <button
                    type="button"
                    onClick={() => void copyText("curl", curlBuilt.command)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-foreground hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  >
                    {copyKey === "curl" ? (
                      <Check className="size-3.5 text-emerald-600" aria-hidden />
                    ) : (
                      <Copy className="size-3.5" aria-hidden />
                    )}
                    Copy curl
                  </button>
                </div>
                <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs leading-relaxed text-foreground dark:border-zinc-800 dark:bg-zinc-900/50">
                  {curlBuilt.command}
                </pre>
              </div>
            )}
            {!curlBuilt.ok && tokenBody ? (
              <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                {curlBuilt.error}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
