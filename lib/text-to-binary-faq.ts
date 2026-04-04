export const textToBinaryFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is text-to-binary conversion used for?",
    answer:
      "It shows how characters become bytes under UTF-8, which helps students, interview prep, and demos. Developers also use it to sanity-check payloads, compare encodings, or generate bit patterns for documentation. It is not a substitute for encryption or secure secrets handling.",
  },
  {
    question: "Does this tool use ASCII or UTF-8?",
    answer:
      "Output is always UTF-8 at the byte level: each Unicode scalar value may use one to four bytes. Plain English letters match classic 7-bit ASCII codes in the first byte, but emoji and many non-Latin scripts use multiple bytes. Decoding assumes the bit stream is valid UTF-8.",
  },
  {
    question: "Why does my decoded text show an error?",
    answer:
      "The bit string length must be a multiple of eight, and the resulting bytes must form valid UTF-8. Common issues are missing bits, extra spaces interpreted as nothing (only 0 and 1 count), copy-paste truncation, or trying to decode arbitrary binary as text. Fix the bit groups and try again.",
  },
  {
    question: "What is the difference between spaced and compact binary output?",
    answer:
      "Spaced mode inserts a single space between each 8-bit byte so you can read or compare bytes easily. Compact mode concatenates all bits into one long string with no separators—useful for minimal paste buffers or certain exercises. Decoding accepts both formats.",
  },
  {
    question: "Is my text uploaded to your servers?",
    answer:
      "No. Encoding and decoding run entirely in your browser. File upload uses the File API to read local text into the textarea; nothing is sent to this site’s backend unless you use another tool that explicitly performs network requests.",
  },
  {
    question: "How does binary relate to Base64 or hexadecimal?",
    answer:
      "They are all ways to represent raw bytes as text. Binary is the most verbose (eight characters per byte if you count only 0/1). Hex packs four bits per symbol; Base64 packs six bits per symbol. Use this page when you need bit-level clarity; use a Base64 or hex tool when you need shorter strings for configs or APIs.",
  },
  {
    question: "Can I use this for secret messages or passwords?",
    answer:
      "Binary encoding is reversible and offers no security—anyone can decode it. For passwords use a dedicated password generator and a proper key derivation or hashing stack in your application. For real secrecy use modern encryption from vetted libraries, not bit-string obfuscation.",
  },
  {
    question: "Which related tools pair well with a binary converter?",
    answer:
      "After inspecting bit patterns, you might normalize text with a whitespace remover, reverse strings for puzzles with a text reverser, or study other encodings such as ROT13 or Caesar cipher for classical ciphers—all available in the Text and String Tools section on this site.",
  },
];
