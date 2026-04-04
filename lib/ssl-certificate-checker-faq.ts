export const sslCertificateCheckerFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What does this SSL certificate checker show?",
    answer:
      "Enter a public domain or HTTPS URL. We open a TLS connection to the host (default port 443 unless you specify another in the URL), read the server certificate chain, and report validity dates, issuer, subject, Subject Alternative Names (SANs), fingerprints, TLS protocol version, and whether the chain validates against public trust stores on our server.",
  },
  {
    question: "Why does HTTP URL still check port 443?",
    answer:
      "TLS certificates protect HTTPS traffic. If you paste http://example.com without a port, we still probe example.com on port 443 so you can inspect the certificate browsers use for HTTPS—even when the scheme you typed is plain HTTP.",
  },
  {
    question: "Can I see expired or mis-issued certificates?",
    answer:
      "Yes. We connect with certificate validation relaxed so we can still display leaf and intermediate details. You will see expiry status and our server’s trust evaluation (authorized or not, plus the authorization error when validation fails).",
  },
  {
    question: "Is this the same as browser padlock information?",
    answer:
      "It is similar: you see the same certificate fields browsers use (names, dates, issuer). Browsers may cache pins, use CT logs, or apply enterprise policies, so always confirm critical changes in your target browsers and operating systems too.",
  },
  {
    question: "Do you store domains or certificate data?",
    answer:
      "The check runs on demand for troubleshooting. Treat this as a quick operational signal, not a compliance audit log. Avoid entering sensitive internal hostnames; private IPs and local names are blocked.",
  },
  {
    question: "What is a certificate chain?",
    answer:
      "Servers usually send a leaf certificate for your domain plus one or more intermediate certificates that link to a root trusted by clients. A broken or incomplete chain can cause warnings even if the leaf certificate is valid.",
  },
  {
    question: "What are Subject Alternative Names (SANs)?",
    answer:
      "SANs list hostnames the certificate is valid for (for example www.example.com and example.com). Modern HTTPS relies on SANs; the legacy Common Name (CN) alone is not enough for every client.",
  },
  {
    question: "How often should I check TLS expiry?",
    answer:
      "Most teams monitor automatically (APM, uptime, or certificate managers). For manual checks, review production hosts after any migration or CDN change and at least monthly for smaller sites. Combine this tool with DNS and redirect checks from our website utilities for fuller coverage.",
  },
];
