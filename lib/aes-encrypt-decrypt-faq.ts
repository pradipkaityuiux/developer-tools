export const aesEncryptDecryptFaqItems: { question: string; answer: string }[] =
  [
    {
      question:
        "What does this AES encrypt and decrypt tool do in the browser?",
      answer:
        "You enter a passphrase and optional PBKDF2 iteration count, then encrypt UTF-8 text into a single-line ciphertext bundle using AES-256 in GCM mode with a random salt and IV. Decrypt reverses the process using the Web Crypto API. The iteration count is embedded in the bundle so you do not have to remember it when decrypting.",
    },
    {
      question: "Is my passphrase or message sent to your servers?",
      answer:
        "No. Key derivation, encryption, and decryption run entirely in your browser tab after the page loads. Nothing is uploaded to this site for this tool.",
    },
    {
      question: "Why AES-256-GCM and PBKDF2?",
      answer:
        "AES-256-GCM provides authenticated encryption: tampering is detected when decrypting. PBKDF2 with SHA-256 stretches a human passphrase into a strong 256-bit key and uses a random salt so identical passphrases do not produce identical keys.",
    },
    {
      question: "What is inside the v1: ciphertext string?",
      answer:
        "The bundle is version 1, then Base64 of: 16-byte salt, 4-byte iteration count, 12-byte AES-GCM IV, and the ciphertext (which includes the authentication tag). Do not edit the string by hand.",
    },
    {
      question: "Can I use this for production secrets or regulated data?",
      answer:
        "This page is aimed at developers learning formats and testing locally. Production systems should use vetted libraries, secure key management, threat modeling, and compliance review—not a generic browser demo.",
    },
    {
      question: "Why does decryption fail with an error?",
      answer:
        "Usually the passphrase differs, whitespace was trimmed incorrectly, the bundle was corrupted, or the string was not produced by this tool. GCM also fails if ciphertext was altered.",
    },
    {
      question: "How does this relate to password hashing or JWT signing?",
      answer:
        "Encryption hides data with a key; password storage normally uses one-way hashes like bcrypt. JWTs are often signed (HMAC or RSA), not AES-encrypted in the same way. Use the right primitive for each job.",
    },
    {
      question: "Which other tools pair with AES testing?",
      answer:
        "Use the hash generator for checksums, Base64 tools for transport encoding, the HMAC generator for symmetric signatures, the JWT encoder for token experiments, and the password strength meter when evaluating passphrases.",
    },
  ];
