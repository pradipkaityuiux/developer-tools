/**
 * Client-side helpers for OAuth 2.0 authorization code + PKCE (RFC 6749, RFC 7636).
 * Used by the OAuth 2.0 flow visualizer; keep logic framework-agnostic.
 */

export type BuildAuthorizeParams = {
  authorizeEndpoint: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  state: string;
  codeChallenge?: string;
  codeChallengeMethod?: "S256" | "plain";
};

export type BuildAuthorizeResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export function buildAuthorizationUrl(
  params: BuildAuthorizeParams,
): BuildAuthorizeResult {
  let base: URL;
  try {
    base = new URL(params.authorizeEndpoint.trim());
  } catch {
    return { ok: false, error: "Invalid authorization endpoint URL." };
  }
  if (!params.clientId.trim()) {
    return { ok: false, error: "client_id is required." };
  }
  if (!params.redirectUri.trim()) {
    return { ok: false, error: "redirect_uri is required." };
  }
  if (!params.state.trim()) {
    return { ok: false, error: "state is required (use a random value to prevent CSRF)." };
  }

  base.searchParams.set("response_type", "code");
  base.searchParams.set("client_id", params.clientId.trim());
  base.searchParams.set("redirect_uri", params.redirectUri.trim());
  if (params.scope.trim()) {
    base.searchParams.set("scope", params.scope.trim());
  }
  base.searchParams.set("state", params.state.trim());
  if (params.codeChallenge?.trim()) {
    base.searchParams.set("code_challenge", params.codeChallenge.trim());
    base.searchParams.set(
      "code_challenge_method",
      params.codeChallengeMethod ?? "S256",
    );
  }
  return { ok: true, url: base.toString() };
}

export type CallbackParseResult = {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
};

export function parseAuthorizationCallback(input: string): CallbackParseResult {
  const trimmed = input.trim();
  let search = "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const u = new URL(trimmed);
      search = u.search.startsWith("?") ? u.search.slice(1) : u.search;
    } catch {
      return {};
    }
  } else if (trimmed.startsWith("?")) {
    search = trimmed.slice(1);
  } else {
    search = trimmed;
  }
  const p = new URLSearchParams(search);
  return {
    code: p.get("code") ?? undefined,
    state: p.get("state") ?? undefined,
    error: p.get("error") ?? undefined,
    error_description: p.get("error_description") ?? undefined,
  };
}

export type TokenExchangeParams = {
  code: string;
  redirectUri: string;
  clientId: string;
  clientSecret?: string;
  codeVerifier?: string;
};

export function buildTokenExchangeFormBody(params: TokenExchangeParams): string {
  const p = new URLSearchParams();
  p.set("grant_type", "authorization_code");
  p.set("code", params.code.trim());
  p.set("redirect_uri", params.redirectUri.trim());
  p.set("client_id", params.clientId.trim());
  if (params.clientSecret?.trim()) {
    p.set("client_secret", params.clientSecret.trim());
  }
  if (params.codeVerifier?.trim()) {
    p.set("code_verifier", params.codeVerifier.trim());
  }
  return p.toString();
}

/** Bash-safe single-quoted literal (handles embedded `'`). */
function bashSingleQuoted(s: string): string {
  return `'${s.replace(/'/g, `'"'"'`)}'`;
}

export function buildTokenExchangeCurl(
  tokenEndpoint: string,
  formBody: string,
): { ok: true; command: string } | { ok: false; error: string } {
  let u: URL;
  try {
    u = new URL(tokenEndpoint.trim());
  } catch {
    return { ok: false, error: "Invalid token endpoint URL." };
  }
  const url = u.toString();
  return {
    ok: true,
    command: `curl -sS -X POST ${bashSingleQuoted(url)} \\\n  -H ${bashSingleQuoted("Content-Type: application/x-www-form-urlencoded")} \\\n  --data-raw ${bashSingleQuoted(formBody)}`,
  };
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    bin += String.fromCharCode(bytes[i]!);
  }
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** RFC 7636: 43–128 char code_verifier from unreserved characters. */
export function randomCodeVerifier(byteLength = 32): string {
  const array = new Uint8Array(byteLength);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < byteLength; i++) array[i] = Math.floor(Math.random() * 256);
  }
  return bytesToBase64Url(array);
}

export function randomState(byteLength = 16): string {
  return randomCodeVerifier(byteLength);
}

export async function pkceChallengeFromVerifier(
  verifier: string,
): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw new Error("Web Crypto is not available.");
  }
  const digest = await crypto.subtle.digest("SHA-256", data);
  return bytesToBase64Url(new Uint8Array(digest));
}

export async function generatePkcePair(): Promise<{
  verifier: string;
  challenge: string;
}> {
  const verifier = randomCodeVerifier(32);
  const challenge = await pkceChallengeFromVerifier(verifier);
  return { verifier, challenge };
}

export const OAUTH2_VISUALIZER_EXPORT_VERSION = 1 as const;

export type OAuth2VisualizerExport = {
  version: typeof OAUTH2_VISUALIZER_EXPORT_VERSION;
  authorizeEndpoint: string;
  tokenEndpoint: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  usePkce: boolean;
};

export function parseVisualizerConfigJson(
  text: string,
): { ok: true; data: OAuth2VisualizerExport } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "File is not valid JSON." };
  }
  if (!parsed || typeof parsed !== "object") {
    return { ok: false, error: "JSON root must be an object." };
  }
  const o = parsed as Record<string, unknown>;
  if (o.version !== OAUTH2_VISUALIZER_EXPORT_VERSION) {
    return { ok: false, error: "Unsupported config version." };
  }
  const fields = [
    "authorizeEndpoint",
    "tokenEndpoint",
    "clientId",
    "redirectUri",
    "scope",
  ] as const;
  for (const k of fields) {
    if (typeof o[k] !== "string") {
      return { ok: false, error: `Missing or invalid string field: ${k}.` };
    }
  }
  if (typeof o.usePkce !== "boolean") {
    return { ok: false, error: "usePkce must be a boolean." };
  }
  return {
    ok: true,
    data: {
      version: OAUTH2_VISUALIZER_EXPORT_VERSION,
      authorizeEndpoint: o.authorizeEndpoint as string,
      tokenEndpoint: o.tokenEndpoint as string,
      clientId: o.clientId as string,
      redirectUri: o.redirectUri as string,
      scope: o.scope as string,
      usePkce: o.usePkce,
    },
  };
}
