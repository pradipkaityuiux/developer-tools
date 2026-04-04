export const ipLookupFaqItems: { question: string; answer: string }[] = [
  {
    question: "What does this IP address lookup tool show?",
    answer:
      "Enter a public IPv4 or IPv6 address to see high-level geolocation (country, region, city when available), network owner hints such as ISP and organization, ASN when reported by our data provider, reverse DNS (PTR) hostnames when they exist, and basic flags that describe common hosting or anonymity signals where data is available.",
  },
  {
    question: "Is IP geolocation exact?",
    answer:
      "No. Geolocation is inferred from routing and registry data, not GPS. Results can be wrong for mobile carriers, VPNs, anycast networks, or corporate NAT. Treat city-level fields as approximate and use the output for triage and research—not legal proof of a person's location.",
  },
  {
    question: "Can I look up private IPs like 192.168.x.x or 10.x.x.x?",
    answer:
      "No. Those addresses are not globally routable on the public Internet, so public geolocation databases do not map them meaningfully. This tool rejects private, loopback, and link-local ranges and asks for a public address instead.",
  },
  {
    question: "How is this different from a WHOIS lookup?",
    answer:
      "WHOIS focuses on domain registration contacts, registrar, and nameservers—useful for ownership research. IP lookup emphasizes where traffic is often seen to originate and which network announces the prefix. Pair both when you investigate infrastructure: start with our WHOIS lookup for domains and this tool for raw IPs.",
  },
  {
    question: "Does an IP lookup reveal personal identity?",
    answer:
      "Not by itself. An IP identifies a connection point on a network, not a named individual. ISPs can map IPs to subscribers under legal process, but this public tool only shows aggregated network and location-style metadata.",
  },
  {
    question: "Why is reverse DNS empty for some IPs?",
    answer:
      "PTR records are optional. Many providers skip them, use generic names, or restrict responses. When no PTR exists or resolution fails, the hostname section stays blank even though the address is valid.",
  },
  {
    question: "Can I use this for fraud or security triage?",
    answer:
      "Yes, as one signal among many. Combine IP metadata with user behavior, device signals, and your own logs. Security flags in the response are heuristic and can be wrong—verify critical decisions with additional checks.",
  },
  {
    question: "Do you store the IPs I look up?",
    answer:
      "This tool does not show you a personal history of past lookups. Like most websites, infrastructure providers may log HTTP traffic for reliability and abuse prevention according to their own practices.",
  },
  {
    question: "What if the lookup fails or times out?",
    answer:
      "Third-party geolocation services can rate-limit, block, or return errors for unusual ranges. Retry after a moment, confirm the address format (IPv6 can include colons and sometimes brackets), and ensure you are not mixing a domain name—use our DNS lookup tool for hostnames instead.",
  },
];
