export const fileHashFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is a file hash and why verify downloads with MD5 or SHA-256?",
    answer:
      "A file hash (digest) is a fixed-length fingerprint of a file’s exact bytes. If even one bit changes, the hash usually changes completely. Publishers publish MD5, SHA-1, or SHA-256 checksums so you can confirm your copy matches theirs after a download, mirror sync, or USB transfer. SHA-256 is preferred today; MD5 and SHA-1 remain common on older release pages and legacy tooling.",
  },
  {
    question: "Are my files uploaded to your servers?",
    answer:
      "No. The File API reads bytes into an ArrayBuffer inside your browser tab. MD5 runs locally via a small library; SHA-1 and SHA-256 use the Web Crypto API. Nothing is sent to our backend for hashing.",
  },
  {
    question: "How is this different from the text hash generator on the site page?",
    answer:
      "The hash generator hashes UTF-8 text you type or paste. This page hashes raw file bytes exactly as stored on disk—ideal for installers, disk images, CSV exports, and firmware. For string payloads and API examples, use the text-based hash generator instead.",
  },
  {
    question: "Why might my hash not match the publisher’s checksum?",
    answer:
      "Common causes: a partial or corrupted download, extracting archives that alter line endings, editing the file after download, comparing against a hash of a different version, or the publisher documenting a hash of the zipped bundle while you hashed the inner file. Re-download, confirm which artifact the checksum covers, and compare the same algorithm (e.g. both SHA-256).",
  },
  {
    question: "Is MD5 or SHA-1 safe for passwords or signatures?",
    answer:
      "No. MD5 and SHA-1 are not suitable for password storage or digital signatures because collision attacks exist in adversarial settings. They are still widely used for non-cryptographic checksums and legacy verification. Prefer SHA-256 when publishers offer it.",
  },
  {
    question: "Is there a maximum file size?",
    answer:
      "Very large files are read fully into memory in the tab, which can be slow or fail on low-memory devices. This page enforces a 200 MB soft limit with a clear error message; for multi-gigabyte ISOs, use a desktop checksum utility or command-line tools that stream from disk.",
  },
  {
    question: "Can I hash binary files, not just text?",
    answer:
      "Yes. Any file type is supported: executables, images, PDFs, databases, and more. The digest always reflects the exact byte sequence of the file you selected.",
  },
];
