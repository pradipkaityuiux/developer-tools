export const securityHeadersCheckerFaqItems: {
  question: string;
  answer: string;
}[] = [
  {
    question: "What is a security headers checker?",
    answer:
      "It fetches a public HTTPS page (or analyzes headers you paste) and scores common HTTP security headers—such as HSTS, CSP, X-Content-Type-Options, frame protection, and Referrer-Policy—so you can harden responses before attackers probe them.",
  },
  {
    question: "How is this different from a generic HTTP header checker?",
    answer:
      "Our general HTTP header checker lists every response header for debugging. This tool focuses on security signals, explains gaps in plain language, and assigns a grade. Use both together: raw inspection for detail, this page for prioritization.",
  },
  {
    question: "Does the scan follow redirects?",
    answer:
      "Yes. We resolve redirects up to a safe hop limit and evaluate headers from the final response, matching how browsers and many clients see your site. For a hop-by-hop list, use the redirect chain checker.",
  },
  {
    question: "Why might my score differ from Mozilla Observatory or similar tools?",
    answer:
      "Different scanners weight headers differently, use different probes (GET vs HEAD, user-agent, geography), and may test multiple paths. Treat this score as a guided checklist, not a certification—align with your threat model and compliance requirements.",
  },
  {
    question: "Which headers matter most for production web apps?",
    answer:
      "Typically: HTTPS with HSTS, a strict Content-Security-Policy, X-Content-Type-Options: nosniff, clickjacking controls via CSP frame-ancestors or X-Frame-Options, and Referrer-Policy. Permissions-Policy and COOP/CORP add defense-in-depth for sensitive applications.",
  },
  {
    question: "Can I analyze headers without fetching a live URL?",
    answer:
      "Yes. Paste raw header lines (for example from curl -I or a proxy) or upload a small text file. Analysis runs in your session so you can review staging configs without exposing internal hosts to our fetcher.",
  },
  {
    question: "Can I check localhost or private IP addresses?",
    answer:
      "Live URL scans only allow public http(s) hosts that resolve to non-private addresses—the same SSRF protections as our other website tools. For private environments, use paste/upload mode with headers copied from your server or proxy.",
  },
  {
    question: "How do I fix a missing Content-Security-Policy?",
    answer:
      "Start with a minimal policy (for example default-src 'self'), use nonces or hashes for scripts instead of unsafe-inline where possible, and iterate using report-only mode first. Our CSP builder helps draft a policy you can paste into server config.",
  },
];
