export const domainAgeCheckerFaqItems: { question: string; answer: string }[] =
  [
    {
      question: "What is domain age and why does it matter?",
      answer:
        "Domain age usually means how long a domain name has been continuously registered, often measured from the original registration date in RDAP/WHOIS-style records. Teams reference it for quick trust heuristics, competitive research, and SEO context—alongside content quality, backlinks, and technical health—not as a single ranking guarantee.",
    },
    {
      question: "How does this domain age checker work?",
      answer:
        "You enter a hostname (with or without https://). We resolve DNS to ensure the name does not point at non-public networks, then query public RDAP data via rdap.org so registry responses stay consistent across many TLDs. When a subdomain has no separate registration record, we may walk up labels toward the apex (for example www.example.com → example.com) until a match is found.",
    },
    {
      question: "Is domain age the same as website launch date?",
      answer:
        "No. Registration date reflects when the domain was created in the DNS namespace; the site could have launched later, changed owners, or sat parked. For live-page signals, combine this check with our HTTP header checker, redirect chain checker, and SSL certificate checker.",
    },
    {
      question: "Why is my subdomain not found until I use the root domain?",
      answer:
        "Many registries publish one RDAP object for the registrable apex name. Deep subdomains (blog.shop.example.com) may not have their own registration row, so the tool retries by removing leftmost labels until it reaches a plausible apex. Country-code rules vary; when in doubt, type the exact registrable domain you see at your registrar.",
    },
    {
      question: "Does older always mean better for SEO?",
      answer:
        "Search engines emphasize usefulness, relevance, and trust signals—not a domain birthday alone. Age can correlate with longevity and brand history, but thin content, spam, or poor technical SEO can outweigh it. Use domain age as one data point in a broader audit that includes content, Core Web Vitals, and link quality.",
    },
    {
      question: "What if RDAP shows privacy or missing registrar details?",
      answer:
        "Registries and registrars redact personal data under GDPR and similar laws, but many responses still include registration and expiry timestamps. If a field is absent, the registry may omit it for that TLD; try again later or cross-check with your registrar dashboard.",
    },
    {
      question: "Can I look up any TLD?",
      answer:
        "We rely on public RDAP routing. Most gTLDs and many ccTLDs work, but some registries lag, block automated clients, or require manual portals. If lookup fails, verify spelling, try the apex domain, and confirm the TLD publishes RDAP.",
    },
    {
      question: "How should I use this alongside WHOIS or DNS tools?",
      answer:
        "Use this page for fast age and lifecycle timestamps from RDAP, pair with our DNS lookup when you need A/AAAA/MX/TXT answers, and use registrar consoles for billing contacts. Together they cover naming, routing, and registration metadata without confusing one layer for another.",
    },
  ];
