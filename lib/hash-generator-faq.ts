export const hashGeneratorFaqItems: { question: string; answer: string }[] = [
  {
    question: "What does this online hash generator do?",
    answer:
      "You type or paste any text and the tool shows MD5, SHA-1, SHA-256, and SHA-512 digests of that text encoded as UTF-8. Each value is a fixed-length hexadecimal string you can copy for checksums, API examples, or local testing. All hashing runs in your browser.",
  },
  {
    question: "Is my input sent to your servers?",
    answer:
      "No. MD5 uses a local JavaScript library and SHA-family hashes use the Web Crypto API inside your tab. Nothing is uploaded unless you use another tool on this site that explicitly makes network requests.",
  },
  {
    question: "Why do MD5 and SHA-1 show warnings in security docs?",
    answer:
      "MD5 and SHA-1 are fast but cryptographically broken for collision resistance: attackers can craft two different inputs with the same hash. Do not use them for passwords, signatures, or TLS. They remain common for legacy checksums, cache keys, and non-adversarial file integrity where a stronger algorithm is not required.",
  },
  {
    question: "Which algorithm should I use for file or release checksums today?",
    answer:
      "Prefer SHA-256 or SHA-512. Publishers, package managers, and modern APIs usually document SHA-256 fingerprints. If you need to compare with an older manifest that only lists MD5, you can still compute MD5 here—but plan to migrate verify steps to SHA-256 when upstream allows it.",
  },
  {
    question: "Does whitespace and newline matter?",
    answer:
      "Yes. Every character—including spaces, tabs, and line breaks—is part of the UTF-8 byte sequence before hashing. A trailing newline changes the digest. If your checksum does not match, compare raw bytes or normalize line endings in your editor.",
  },
  {
    question: "Why does my hash differ from hashing the same string in another tool?",
    answer:
      "Encoding is the usual cause. This page hashes UTF-8 bytes. Some tools hash UTF-16 code units, Latin-1, or add a BOM. Another tool might hash a file including a final newline you did not paste. Align encoding and exact bytes to get matching digests.",
  },
  {
    question: "Can I hash binary or files here?",
    answer:
      "This page is optimized for text. For uploaded files and binary checksums, use a dedicated file hash utility when it is available in the catalog, or hash files locally with openssl or your OS tools. For Base64 payloads, decode with our Base64 decoder first if you need raw bytes.",
  },
  {
    question: "What related tools pair well with hashing?",
    answer:
      "Use the Base64 encoder and decoder for transport encoding, the URL encoder for percent-encoding query data, the JWT decoder to inspect signed payloads (verification still needs the secret or public key), and the UUID generator when you need unique identifiers instead of digests of content.",
  },
];
