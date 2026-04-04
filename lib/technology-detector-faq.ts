export const technologyDetectorFaqItems: { question: string; answer: string }[] =
  [
    {
      question: "What does the website technology detector identify?",
      answer:
        "It fetches the public HTML of a URL you provide and scans the document plus HTTP response headers for fingerprints of common CMS platforms (WordPress, Shopify, Webflow, and others), JavaScript frameworks and meta-frameworks (Next.js, Nuxt, Gatsby, and heuristic signals for React/Vue/Angular), CDNs and edge hosts (Cloudflare, Fastly, Vercel, Netlify), analytics and tag managers (Google Tag Manager, GA4, Meta Pixel, Hotjar, Plausible, Matomo), marketing widgets (HubSpot, Intercom), payments (Stripe, PayPal), fonts, and some security widgets like reCAPTCHA. Results are best-effort clues for research—not a guaranteed inventory of every dependency.",
    },
    {
      question: "Is technology detection 100% accurate?",
      answer:
        "No. Sites can minify or obfuscate scripts, load technologies only after login, use server-side rendering with few client fingerprints, or block automated fetches. A missing hit does not prove a stack is absent; a heuristic hit (especially for generic frameworks) can occasionally be a false positive. Cross-check with our HTTP header checker, SSL certificate checker, and manual inspection when decisions matter.",
    },
    {
      question: "Why do some results say “heuristic”?",
      answer:
        "Heuristic matches rely on common DOM attributes or strings that many sites share. They are useful for quick triage but weaker than vendor-specific script URLs, meta generators, or distinctive headers. Treat low-confidence rows as hints to verify, not proof.",
    },
    {
      question: "Can this detect technologies behind a login wall?",
      answer:
        "Usually not. This tool requests the URL you supply as an anonymous client. If the server returns a login page, paywall, or interstitial, fingerprints reflect that surface—not the authenticated application behind it.",
    },
    {
      question: "Does this work on SPAs and client-rendered sites?",
      answer:
        "Partially. You see whatever HTML the server returns on the first response. Pure client-rendered bundles may expose fewer strings until JavaScript runs in a real browser. For redirect and delivery issues, pair this scan with our redirect chain checker and response code checker.",
    },
    {
      question: "How is this different from Wappalyzer or BuiltWith?",
      answer:
        "Those products maintain large proprietary databases and often use browser extensions or deeper crawling. This free tool uses a focused, transparent ruleset over one fetch—fast and privacy-conscious for quick competitive checks, but not a full replacement for paid reconnaissance platforms.",
    },
    {
      question: "Will you store the URLs I scan?",
      answer:
        "The tool does not present a history of your past scans. Like most websites, hosting and network providers may log requests for reliability and abuse prevention according to their own policies.",
    },
    {
      question: "What if the fetch fails or times out?",
      answer:
        "Some hosts block non-browser user agents, require specific cookies, or rate-limit datacenter IPs. Try again later, confirm the URL loads in your browser, and verify DNS with our DNS lookup tool if the hostname is new or recently changed.",
    },
  ];
