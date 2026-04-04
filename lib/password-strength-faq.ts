export const passwordStrengthFaqItems: { question: string; answer: string }[] =
  [
    {
      question: "What is password entropy and why does this meter use it?",
      answer:
        "Entropy measures unpredictability in bits. This tool estimates bits from your password length and the mix of character classes (lowercase, uppercase, digits, symbols, and non-ASCII). Higher entropy usually means more guesses for a brute-force attacker. We also apply small penalties for patterns like keyboard walks, long digit runs, and known weak passwords—similar in spirit to strength meters in browsers, but with transparent numbers you can reason about.",
    },
    {
      question: "How accurate are crack-time estimates?",
      answer:
        "They are illustrative only. Real attackers use dictionaries, credential stuffing, phishing, and GPU farms—not pure brute force alone. The three rates (about 1,000 guesses per second for throttled online attacks, 1 billion per second for strong offline hashing, and 1 trillion per second for an extreme scenario) bracket common discussions in security literature. Actual risk depends on how your service hashes passwords (bcrypt, Argon2, scrypt), peppering, rate limits, and whether the hash leaked. Tune work factors for your stack using vendor docs and test environments.",
    },
    {
      question: "Does this tool upload my password to your servers?",
      answer:
        "No. Analysis runs entirely in your browser after the page loads. Nothing you type is transmitted to us for scoring. For generating new random secrets without typing patterns, use the password generator in the Developer tools section.",
    },
    {
      question: "Why might a long passphrase still show a warning?",
      answer:
        "Length helps, but predictable structure does not. Famous lyrics, sports teams, and keyboard paths can appear in attacker wordlists even when they are long. A random sentence of unrelated words (a correct horse battery staple style) or a random string from a generator is usually safer than a clever phrase people might guess.",
    },
    {
      question: "What length and complexity should I use for important accounts?",
      answer:
        "Prefer unique, long secrets per site—often 16 characters or more for web passwords, stored in a password manager. Enable multi-factor authentication wherever offered. For API keys and encryption passphrases, follow vendor guidance. When you need symmetric crypto helpers, browse the Security & Encryption tools section on the home page for AES and related utilities as they are published.",
    },
    {
      question: "How is this different from Have I Been Pwned or breach checks?",
      answer:
        "This page scores structure and entropy locally. It does not query breach databases. Even a strong-looking password is unsafe if it was reused on a site that leaked hashes. Use unique passwords per service and monitor breaches separately.",
    },
  ];
