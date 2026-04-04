export const oauth2FlowVisualizerFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What does the OAuth 2.0 Flow Visualizer do?",
    answer:
      "It helps you learn and debug the authorization code flow: you enter your authorization and token endpoint URLs, client id, redirect URI, and scopes, then the tool builds the authorize URL, explains the redirect back with an authorization code, and formats the token exchange (including optional PKCE). Everything runs in your browser—no tokens are sent to this site’s servers.",
  },
  {
    question: "Does this tool perform real OAuth requests?",
    answer:
      "No. It only composes URLs and form bodies so you can copy them into your own app, curl, or API client (for example the HTTP Request Builder in this catalog). Your authorization server receives requests only from tools you run yourself.",
  },
  {
    question: "What is PKCE and when should I use it?",
    answer:
      "PKCE (Proof Key for Code Exchange, RFC 7636) adds a code_verifier and code_challenge so that intercepted authorization codes cannot be exchanged without the original verifier. Public clients—mobile apps and single-page apps without a confidential backend—should use PKCE. Confidential server-side clients often still use PKCE as defense in depth.",
  },
  {
    question: "Why is the state parameter required?",
    answer:
      "The state value should be unpredictable and tied to the user’s session. After redirect, your app compares the returned state to the stored value to mitigate cross-site request forgery on the redirect. This tool reminds you to set state; generate a new random value per login attempt.",
  },
  {
    question: "Can I use this for OpenID Connect?",
    answer:
      "Yes. OIDC builds on OAuth 2.0: use scope values like openid profile email, request response_type=code, and after token exchange you typically receive an id_token alongside access_token. Decode ID tokens locally with the site’s JWT decoder for inspection only—always validate signatures and claims on the server.",
  },
  {
    question: "Why might token exchange fail with invalid_grant?",
    answer:
      "Common causes: authorization code already used or expired, redirect_uri mismatch between authorize and token steps, wrong client_id, clock skew, or PKCE code_verifier not matching the original code_challenge. Compare exact redirect URIs (including trailing slashes) with your app registration.",
  },
  {
    question: "Is it safe to paste production client secrets here?",
    answer:
      "Avoid pasting live secrets into any third-party web page. Prefer staging credentials, redacted examples, or run this tool offline in your own fork. The client secret field is for composing curl examples; it is not uploaded by this page.",
  },
  {
    question: "Which related tools should I use next?",
    answer:
      "Use the URL encoder for tricky redirect URIs, the JWT decoder to inspect OIDC id_tokens after exchange, the JSON formatter for token responses, and the API Developer Toolbox’s HTTP Request Builder to POST to the token endpoint—links are on this page and in the home catalog.",
  },
];
