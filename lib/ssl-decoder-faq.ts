export const sslDecoderFaqItems: { question: string; answer: string }[] = [
  {
    question: "What does this SSL certificate decoder show?",
    answer:
      "It parses one or more PEM-encoded X.509 certificates (the text between BEGIN CERTIFICATE and END CERTIFICATE) and displays the subject and issuer distinguished names, serial number, validity window (notBefore and notAfter), signature algorithm, public key type, Subject Alternative Name (SAN) entries when present, Basic Constraints, Key Usage, and Extended Key Usage extensions. It can also show a SHA-256 fingerprint of each certificate’s DER encoding for quick comparison with openssl or browser views.",
  },
  {
    question: "Does this tool verify that a certificate is trusted or correctly signed?",
    answer:
      "No. Decoding reads structure and metadata from the certificate bytes; it does not build a chain to a trusted root, check revocation (CRL/OCSP), or validate signatures against issuer keys. For live HTTPS endpoints, use your browser, openssl verify, or the SSL certificate checker tool that fetches the served chain from a URL.",
  },
  {
    question: "Is my certificate sent to your servers?",
    answer:
      "No. Parsing runs entirely in your browser with JavaScript. PEM text stays in the page unless you copy it elsewhere or use another tool that performs network requests.",
  },
  {
    question: "What PEM formats are supported?",
    answer:
      "Standard PKIX certificates in PEM form: lines starting with -----BEGIN CERTIFICATE----- and ending with -----END CERTIFICATE-----. You can paste a full PEM chain (multiple blocks); each block is decoded separately. Private keys, CSRs, PKCS#7 bundles without PEM certificate blocks, or DER-only blobs are not the focus of this page—export or convert to PEM first.",
  },
  {
    question: "How do Subject Alternative Names (SANs) relate to the Common Name?",
    answer:
      "Modern browsers and clients primarily match hostnames against SAN DNS names; the legacy Common Name (CN) in the subject is still shown for compatibility. If you inspect a server certificate, expect to see dns names (and sometimes IP or email entries) listed under SAN when the certificate follows current best practices.",
  },
  {
    question: "Why does validity show expired or not yet valid when my site works?",
    answer:
      "You might be viewing a different certificate than the one the edge serves (multiple certs in a chain, old file on disk, or a staging copy). Clock skew, cached connections, or a replaced cert can also confuse quick checks. Compare serial numbers and fingerprints with what the server presents, for example using the SSL certificate checker on a live URL.",
  },
  {
    question: "Can I use this for client certificates or code-signing certs?",
    answer:
      "Yes, if they are X.509 certificates in PEM form. The decoder shows the same fields; Extended Key Usage may list purposes such as client authentication or code signing when the extension is present. Always follow your organization’s policies for handling authentication and signing material.",
  },
  {
    question: "Which related tools should I use next?",
    answer:
      "Inspect certificates served over HTTPS with the SSL certificate checker, review HTTP security headers with the security headers checker, generate or inspect RSA keys with the RSA key pair generator, and experiment with JWTs using the JWT encoder—all linked from the security and encryption tools section on the home page.",
  },
];
