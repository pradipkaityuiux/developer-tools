export const jwtDecoderFaqItems: { question: string; answer: string }[] = [
  {
    question: "What does this JWT decoder do?",
    answer:
      "It splits a JSON Web Token (JWS compact form) into header and payload, Base64URL-decodes those segments, and pretty-prints the JSON. It can read standard time claims (exp, nbf, iat) and show whether a token appears expired relative to your browser clock. It does not verify signatures or trust the issuer—you should never treat decoded content alone as proof of authenticity.",
  },
  {
    question: "Does this tool verify the JWT signature?",
    answer:
      "No. Signature verification needs the correct secret or public key and usually runs on your server or in a trusted library. This page is for debugging and inspection only: reading alg, kid, sub, scopes, and expiry during development. For production auth, validate tokens with your framework (e.g. jose, jsonwebtoken, Auth0, Cognito) and reject invalid signatures before trusting claims.",
  },
  {
    question: "Is my token sent to your servers?",
    answer:
      "No. Parsing and decoding run entirely in your browser with JavaScript. The token never leaves your device unless you copy it elsewhere or use another tool that performs network requests.",
  },
  {
    question: "Why does my token show as expired when the app still works?",
    answer:
      "Clock skew, refresh tokens, or server-side session logic may keep you signed in after an access token’s exp. Some APIs issue short-lived access tokens and rotate them silently. Also confirm you decoded the same token the API receives—query params and cookies sometimes differ from what you paste here.",
  },
  {
    question: "What is the difference between JWT, JWS, and JWE?",
    answer:
      "JWT is the umbrella term. JWS is a signed token (typically three Base64URL segments: header, payload, signature). JWE is encrypted and has more segments. This decoder targets common three-part JWS tokens used in OAuth 2.0 and OpenID Connect. Encrypted JWE tokens are not supported on this page.",
  },
  {
    question: "Can I decode refresh tokens or API keys here?",
    answer:
      "You can paste any string that matches the JWS layout, but you should avoid pasting production secrets into third-party sites. Prefer local tools, redacted samples, or tokens from staging. Pair inspection with our Base64 encoder and JSON formatter when you are debugging encoding issues—not when handling live credentials.",
  },
  {
    question: "How do exp, nbf, and iat work?",
    answer:
      "exp (expiration time), nbf (not before), and iat (issued at) are NumericDate values: seconds since Unix epoch unless your library maps them differently. This tool interprets them as UTC and compares exp and nbf to the current time for a quick sanity check only.",
  },
  {
    question: "Which related tools should I use next?",
    answer:
      "Format decoded JSON with the JSON formatter and validator, convert timestamps with the Unix timestamp converter, debug URL-safe encoding with the Base64 encoder and decoder, and pretty-print SQL or YAML when your token flows through APIs documented in those formats—all linked from the code and developer tools section on the home page.",
  },
];
