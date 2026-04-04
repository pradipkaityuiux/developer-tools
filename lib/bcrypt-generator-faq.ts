export const bcryptGeneratorFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is bcrypt and why is it used for passwords?",
    answer:
      "bcrypt is a password-hashing function designed to be slow and to include a per-password salt. Unlike fast digests (MD5, SHA-256), bcrypt’s cost factor lets you tune how much CPU time each hash takes, which makes offline guessing attacks more expensive. Stored hashes look like modular crypt strings starting with $2a$, $2b$, or $2y$ and include the cost and salt in the string.",
  },
  {
    question: "What bcrypt cost factor (salt rounds) should I use?",
    answer:
      "Choose the highest cost your server can afford under peak login traffic, then re-benchmark yearly. Many teams use 10–12 on general-purpose hardware; higher values increase security margin but also latency for legitimate users. This tool lets you try 4–15 locally—use lower costs while iterating in tests and raise the factor for production systems after load testing.",
  },
  {
    question: "Does bcrypt hash the full password I paste?",
    answer:
      "bcrypt only considers the first 72 bytes of the password (UTF-8 bytes, not characters). Longer strings are silently truncated. If you need to support very long passphrases, pre-hash with a fast algorithm or use Argon2 with parameters suited to your threat model—consult your framework’s guidance.",
  },
  {
    question: "Is it safe to generate bcrypt hashes in the browser?",
    answer:
      "This page runs bcryptjs entirely in your browser for development and learning: nothing is sent to our servers. You should still avoid pasting real production secrets on shared or untrusted machines (screen capture and shoulder surfing still apply). For production user sign-up, hashing should happen on a trusted server or in a controlled backend, not in client-side JavaScript alone.",
  },
  {
    question: "How do I verify a password against an existing bcrypt hash?",
    answer:
      "Use the Verify tab: paste the plaintext in one field and the stored bcrypt hash in the other, then click Compare. bcrypt.compare uses the cost and salt embedded in the hash string, so you do not re-specify rounds when checking passwords.",
  },
  {
    question: "What is the difference between $2a$, $2b$, and $2y$ prefixes?",
    answer:
      "These are version markers in the modular crypt format. Implementations historically differed around null-byte handling and minor bugs; modern libraries accept and emit these variants. For interoperability, store whatever your framework generates and use the same library family on verify. bcryptjs produces hashes compatible with common OpenBSD-style parsers.",
  },
  {
    question: "Why is my hash different every time for the same password?",
    answer:
      "bcrypt generates a random salt for each hash, so two hashes of the same password will look different but both verify correctly. The salt is embedded in the output string after the cost field—never strip it when storing hashes in your database.",
  },
  {
    question: "How does bcrypt relate to fast hash generators like SHA-256?",
    answer:
      "SHA-256 is a fast cryptographic hash for integrity and fingerprints; it is not appropriate for storing passwords by itself. bcrypt is deliberately slow and salted for password storage. Use our SHA-family hash generator when you need checksums of files or strings, and use bcrypt (or Argon2) when modeling password storage.",
  },
  {
    question: "Can I upload a file instead of typing the password?",
    answer:
      "Yes. Click Upload (with the upload icon) to load a UTF-8 text file into the password field—useful for long test vectors or pasted secrets from a local file. The file is read only inside your browser.",
  },
];
