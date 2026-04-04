export const dnsLookupFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is a DNS lookup tool?",
    answer:
      "A DNS lookup tool asks the public DNS system for records attached to a hostname or domain—such as A/AAAA (addresses), MX (mail), TXT (verification and SPF/DKIM), NS (nameservers), CNAME (aliases), and SOA (zone authority). It helps you verify propagation, email setup, and hosting configuration.",
  },
  {
    question: "What is the difference between A and AAAA records?",
    answer:
      "A records map a name to an IPv4 address. AAAA records map a name to an IPv6 address. Modern stacks often publish both so clients can choose the best path. If one is missing, some users or networks may still reach you only over the other family.",
  },
  {
    question: "Why would I check MX records?",
    answer:
      "MX records tell the internet which mail servers accept email for your domain. Wrong or stale MX values cause bounced mail, deliverability issues, or messages routing to the wrong provider. After changing email hosts, MX checks confirm the world sees the new targets.",
  },
  {
    question: "What are TXT records used for?",
    answer:
      "TXT records store arbitrary text at DNS and commonly hold SPF, DKIM, DMARC, domain verification tokens for SaaS, and ACME challenges for certificates. Multiple TXT strings may exist on one name; your provider usually tells you exactly what to publish.",
  },
  {
    question: "Can I look up DNS for a subdomain?",
    answer:
      "Yes. Enter the full hostname, for example www.example.com, api.example.com, or _dmarc.example.com. The resolver returns whatever records exist at that exact name (or inherited defaults where applicable).",
  },
  {
    question: "Why does my CNAME query return no data?",
    answer:
      "Many apex domains (example.com) cannot use a CNAME alongside other record types under DNS rules, so registrars often use ALIAS/ANAME at the provider instead. CNAME is common on subdomains like www. If you expect a CNAME but see none, check whether the provider uses flattening or A/AAAA at the apex.",
  },
  {
    question: "How is this different from WHOIS?",
    answer:
      "DNS lookup reads live resolver data for nameservice records. WHOIS reads registration metadata (registrar, dates, contacts where published). Use DNS for mail and hosting troubleshooting; use WHOIS for ownership and renewal research. Our site offers both tools in the website utilities section.",
  },
  {
    question: "Why might results differ from my local computer?",
    answer:
      "DNS is distributed: resolvers cache answers for the TTL, anycast routes differ, and split-horizon DNS can return internal views to office networks. This tool queries from our server’s resolver path, which reflects a public perspective—useful for what the broader internet likely sees after propagation.",
  },
];
