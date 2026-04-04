export const passwordGeneratorFaqItems: { question: string; answer: string }[] =
  [
    {
      question: "Is this password generator cryptographically secure?",
      answer:
        "Passwords are built from random indices sampled using your browser’s crypto.getRandomValues API (uniform reduction), not Math.random. That is appropriate for strong secrets in typical web threat models. For regulated environments, follow your security team’s policy and prefer OS or HSM-backed generators where mandated.",
    },
    {
      question: "Are my passwords sent to your servers?",
      answer:
        "No. Generation, copying, and optional file loading for extra characters all run in your browser tab. This page does not upload generated passwords unless you manually paste them elsewhere.",
    },
    {
      question: "What does “exclude ambiguous characters” remove?",
      answer:
        "It drops characters that are easy to misread out loud or on some fonts—commonly 0, O, o, 1, l, I, and the vertical bar. Your final charset may shrink; if a required character class becomes empty, widen your options or turn off that exclusion.",
    },
    {
      question: "How do I generate many passwords for test accounts?",
      answer:
        "Set “How many passwords” to the batch size (up to 500), tune length and character sets, then click Generate passwords. Use Copy all to paste into spreadsheets, seed scripts, or tickets. For structured fake users (names, emails), pair output with the dummy data generator in the developer tools catalog.",
    },
    {
      question: "Can I add my own symbols or non-Latin characters?",
      answer:
        "Yes. Type or paste characters into “Extra characters”, or click Load charset file to read a UTF-8 text file—every distinct code point in the file is merged into the alphabet (whitespace is skipped). Useful for locale-specific rules or internal policy symbol lists.",
    },
    {
      question: "Why enforce at least one character from each selected type?",
      answer:
        "If you enable uppercase, lowercase, numbers, and symbols, a purely random string might miss a class (especially with short lengths). The tool guarantees one pick from each enabled pool that still has characters after exclusions, then fills the rest randomly and shuffles, so policy checks like “must include a symbol” are satisfied when those sets are non-empty.",
    },
    {
      question: "Is a long password always better than a complex one?",
      answer:
        "Length and alphabet size both add entropy. A longer password from a smaller charset can beat a short password with symbols, depending on the numbers. The tool shows an approximate entropy estimate. Prefer unique passwords per site and a password manager rather than reusing one strong string everywhere.",
    },
    {
      question: "Which other tools complement password generation?",
      answer:
        "Use the hash generator for checksums of arbitrary text (not for storing user passwords), the Base64 encoder for binary-safe strings, the UUID generator for opaque IDs, and the URL encoder when embedding secrets in query strings during tests—each is linked from the code and developer tools section.",
    },
  ];
