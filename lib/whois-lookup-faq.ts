export const whoisLookupFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is a WHOIS lookup?",
    answer:
      "WHOIS (historically a text protocol) exposes registration and DNS delegation metadata for domain names. This tool uses RDAP (Registration Data Access Protocol) over HTTPS—the modern JSON replacement—to show registrar, important dates, domain status flags, and nameservers when the registry publishes them.",
  },
  {
    question: "Is this the same as legacy port-43 WHOIS?",
    answer:
      "Functionally similar for many public data elements, but we query RDAP web services instead of raw WHOIS sockets. RDAP is standardized, easier to parse, and aligns with how most major registries expose data today. Some fields may still be redacted for privacy under GDPR or registry policy.",
  },
  {
    question: "Why is registrant contact information missing?",
    answer:
      "Many registries and registrars redact personal data in public RDAP/WHOIS results. You will often see registrar details and technical nameservers while legal registrant fields show as withheld or replaced with anonymized contacts. That is expected and not a bug in this lookup.",
  },
  {
    question: "Should I enter example.com or https://example.com?",
    answer:
      "Either works. We take the hostname from a pasted URL or accept a bare domain. Paths, query strings, and fragments are ignored. For best results with country-code and second-level zones, enter the exact registered domain (for example the same string you would use in DNS).",
  },
  {
    question: "What is the difference between WHOIS and DNS lookup?",
    answer:
      "DNS lookup answers “what records does the world resolve right now?” (A, MX, TXT, and so on). WHOIS/RDAP answers “who is the registrar, what are policy statuses, and what did the registry record about registration?” Use both together: DNS for live resolution, WHOIS for ownership context and expiry research.",
  },
  {
    question: "Can I look up any TLD?",
    answer:
      "We follow the official IANA RDAP bootstrap list. If a TLD has no RDAP server listed yet, lookup will fail with a clear message. Major gTLDs and many ccTLDs are supported; coverage improves as registries adopt RDAP.",
  },
  {
    question: "How accurate are creation and expiry dates?",
    answer:
      "Dates come from the registry’s RDAP payload. Registrars may show slightly different renewal or grace dates in their dashboards. Always treat public RDAP as authoritative for registry-reported events, but confirm billing and auto-renew settings with your registrar before transfers or sunsets.",
  },
  {
    question: "Is automated domain lookup allowed here?",
    answer:
      "This page is meant for human research, due diligence, and troubleshooting. Bulk scraping or hammering the API may be rate-limited or blocked to keep the service fair. For production monitoring, use registry-approved channels or a commercial data provider with proper contracts.",
  },
];
