export const rot13FaqItems: { question: string; answer: string }[] = [
  {
    question: "What is ROT13?",
    answer:
      "ROT13 (rotate by 13 places) is a simple letter substitution cipher on the Latin alphabet: each letter A–Z is replaced by the letter 13 positions later, wrapping from Z to A. Because 13 is half of 26, the same operation encodes and decodes—running ROT13 twice returns the original text.",
  },
  {
    question: "Is ROT13 secure encryption?",
    answer:
      "No. ROT13 is obfuscation for puzzles, Usenet spoilers, and learning—not confidentiality. Anyone can decode it instantly. For real secrets use modern cryptography and key management, not substitution ciphers.",
  },
  {
    question: "Does this tool send my text to a server?",
    answer:
      "No. The encoder runs entirely in your browser. Paste text or load a local .txt file; nothing is uploaded unless you use another page that explicitly performs network requests.",
  },
  {
    question: "What characters does ROT13 change?",
    answer:
      "Only ASCII letters A–Z and a–z are rotated. Digits, spaces, punctuation, Unicode letters outside basic Latin, and emoji are left unchanged so mixed content and filenames stay readable where expected.",
  },
  {
    question: "Why do people still use ROT13?",
    answer:
      "It is a zero-setup way to hide plot points in forums, teach how ciphers work, solve quick CTF or puzzle clues, or demo that reversible transforms are not the same as encryption. It also appears in legacy jokes and Easter eggs.",
  },
  {
    question: "How is ROT13 different from a Caesar cipher?",
    answer:
      "ROT13 is Caesar cipher with a fixed shift of 13. A general Caesar tool lets you pick any shift (1–25). ROT13 is special because encoding and decoding use the same step. For arbitrary shifts, use a dedicated Caesar cipher utility when available in the Text and String Tools section.",
  },
  {
    question: "Can I process a whole file?",
    answer:
      "Yes. Use Upload .txt to read UTF-8 plain text, then copy the transformed output. Very large files may slow the tab; for huge logs prefer a local script or stream-based tool.",
  },
  {
    question: "Which related tools pair well with ROT13?",
    answer:
      "Use the text case converter for capitalization changes, the HTML entity encoder for markup-safe strings, the regex tester for pattern-based edits, or a word counter when you are editing articles and need length limits—all linked from this site’s Text and Developer sections.",
  },
];
