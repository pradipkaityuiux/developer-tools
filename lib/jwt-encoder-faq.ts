export const jwtEncoderFaqItems: { question: string; answer: string }[] = [
  {
    question: "What does this JWT encoder do?",
    answer:
      'It builds a three-part JSON Web Token (JWS compact) from JSON header and payload objects, then signs the "header.payload" string with HMAC-SHA256 (HS256) using your secret. The output is a standard JWT string you can paste into Authorization headers, Postman, or test harnesses.',
  },
  {
    question: "Which algorithms are supported?",
    answer:
      'Only HS256 (HMAC with SHA-256) is supported here—the header\'s alg field is set to HS256 for signing. RS256, ES256, and asymmetric keys require different key material and are not implemented on this page.',
  },
  {
    question: "Is my secret sent to your servers?",
    answer:
      "No. Signing runs in your browser with the Web Crypto API. The secret and JSON never leave your device unless you copy them elsewhere or your browser syncs clipboard history to the cloud.",
  },
  {
    question: "Is this safe for production tokens?",
    answer:
      "This page is for development and API testing. Production systems should issue tokens from a hardened authorization server, store secrets in a vault, rotate keys, and validate audience, issuer, expiry, and signature on every request. Do not embed long-lived shared secrets in client apps.",
  },
  {
    question: "Why does my API reject the token this tool generated?",
    answer:
      "Common causes: wrong secret, clock skew on exp, audience (aud) or issuer (iss) mismatch, or the API expecting a different algorithm (for example RS256). Compare your claims with the provider docs and verify the exact signing key the resource server uses.",
  },
  {
    question: "How is this different from your JWT decoder?",
    answer:
      "The decoder reads existing tokens without verifying signatures. This encoder creates a new HS256-signed JWT from JSON you supply. Use the decoder to inspect tokens returned by identity providers; use this encoder when you need a quick signed sample for integration tests.",
  },
  {
    question: "Can I upload header and payload from files?",
    answer:
      "Yes. Use the upload controls next to each field to load .json or text files from disk. Files are read locally in the browser—nothing is uploaded to our infrastructure.",
  },
  {
    question: "Which related tools should I use?",
    answer:
      "Verify HMAC behavior with the HMAC generator, format JSON with the JSON formatter, debug tokens with the JWT decoder, and explore Base64URL segments with the Base64 encoder—all linked from this site’s developer and security tool sections.",
  },
];
