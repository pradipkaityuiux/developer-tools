export const hmacGeneratorFaqItems: { question: string; answer: string }[] = [
  {
    question: "What does this HMAC generator compute?",
    answer:
      "It computes HMAC-SHA256 or HMAC-SHA512 over your message using a secret key. Both the secret and the message are encoded as UTF-8 bytes before the HMAC step, which matches how most webhook providers document their signatures. You can read the result as lowercase hexadecimal or standard Base64.",
  },
  {
    question: "Is my secret or message uploaded to a server?",
    answer:
      "No. The tool uses the Web Crypto API inside your browser tab only. Nothing is sent to our servers for signing. Still avoid pasting production secrets on shared or untrusted machines—screen capture and clipboard history remain risks.",
  },
  {
    question: "Why does my signature not match the API or webhook?",
    answer:
      "Usually the payload bytes differ: trailing newlines, pretty-printed JSON vs minified, different UTF-8 normalization, or the service hashes the raw request body while you edited a copy. Some providers prefix the digest (for example sha256=) or use Base64 while others use hex. Confirm the exact message string and encoding their docs specify.",
  },
  {
    question: "Should I use HMAC-SHA256 or HMAC-SHA512?",
    answer:
      "HMAC-SHA256 is the default for most webhooks and APIs today. HMAC-SHA512 produces a longer tag and is fine when a platform requires it or you want a larger output with the same keyed construction. Both are keyed hashes; pick what your integration documentation mandates.",
  },
  {
    question: "How is this different from a plain SHA-256 hash?",
    answer:
      "A plain SHA-256 hash has no secret: anyone can recompute it from the message. HMAC includes a secret key, so only parties with the key can produce or verify the same tag. Use plain hashes for checksums; use HMAC when you need authenticity with a shared secret.",
  },
  {
    question: "Can I use a binary key or key imported from Base64?",
    answer:
      "This page treats the secret field as UTF-8 text, which matches many dev tutorials and test keys. If your service gives you a Base64-encoded key, decode it elsewhere and paste the resulting bytes as extended characters, or use a CLI that imports raw key bytes. Adding raw hex key entry is a possible future enhancement.",
  },
  {
    question: "What related tools help with signatures and encoding?",
    answer:
      "Use the hash generator for unkeyed digests, Base64 tools when transports wrap binary, the JSON formatter to inspect canonical payloads before signing, and AES or RSA tools on this site when you need encryption or asymmetric keys instead of symmetric HMAC tags.",
  },
];
