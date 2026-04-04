export const caesarCipherFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is a Caesar cipher?",
    answer:
      "The Caesar cipher is one of the oldest substitution ciphers: each letter in the Latin alphabet is shifted forward or backward by a fixed number of positions (the key). Spaces, numbers, punctuation, and non-Latin characters are usually left unchanged. It is easy to break by frequency analysis, so it is useful for learning, puzzles, and lightweight obfuscation—not for real secrecy.",
  },
  {
    question: "How do I encrypt and decrypt with this tool?",
    answer:
      "Choose Encrypt to shift letters forward by your shift value, or Decrypt to shift them backward by the same value. Enter a shift from 0 through 25 (values wrap modulo 26). Decrypting with shift N is the same as encrypting with shift 26 minus N.",
  },
  {
    question: "Is my message sent to a server?",
    answer:
      "No. The transformation runs entirely in your browser. Paste text or upload a local plain-text file; nothing is transmitted for encoding unless you use another page that explicitly performs network requests.",
  },
  {
    question: "Does the Caesar cipher change uppercase and lowercase differently?",
    answer:
      "This tool preserves case: uppercase letters stay in A–Z and lowercase in a–z, each shifted within its own alphabet. Accented letters and letters outside basic Latin are left as-is so you can see what would need normalization in a stricter implementation.",
  },
  {
    question: "What shift should I use?",
    answer:
      "Any integer works; the effective shift is taken modulo 26. Shift 0 leaves text unchanged. Historically, Caesar is often described with shift 3. For CTF-style challenges, try small shifts first or compare with a known word.",
  },
  {
    question: "How is this different from ROT13?",
    answer:
      "ROT13 is a fixed Caesar shift of 13 on letters; encrypting twice returns the original text. A general Caesar cipher lets you pick any shift 0–25. When the ROT13 encoder page is available in this site’s Text and String Tools, you can use it for that special case.",
  },
  {
    question: "Can I process a whole .txt file?",
    answer:
      "Yes. Use Upload .txt to load UTF-8 plain text, set shift and mode, then copy the result. Very large files may slow the tab; for huge logs, prefer a local script or editor.",
  },
  {
    question: "Is the Caesar cipher secure?",
    answer:
      "No. With only 25 non-trivial shifts, brute force is trivial. Frequency analysis breaks it quickly on natural language. Use modern encryption (for example AES via established libraries) when you need confidentiality.",
  },
  {
    question: "Which related tools work well with cipher demos?",
    answer:
      "Use the text diff checker to compare ciphertext versions, the word counter if you are writing explanations or keys, and the duplicate line remover when cleaning word lists before testing shifts. The JSON formatter helps when your payload is structured data.",
  },
];
