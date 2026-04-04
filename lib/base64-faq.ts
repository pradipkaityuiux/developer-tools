export const base64FaqItems: { question: string; answer: string }[] = [
  {
    question: "What is Base64 and when do developers use it?",
    answer:
      "Base64 encodes binary data as ASCII text using 64 safe characters (A–Z, a–z, 0–9, +, /, with padding =). It is common in JSON APIs, email MIME parts, embedding small assets as data URIs, storing blobs in databases or env vars, and debugging authentication headers. It is encoding, not encryption—anyone can decode it.",
  },
  {
    question: "Is my text or file uploaded to your servers?",
    answer:
      "No. Encoding and decoding run entirely in your browser with the Web Crypto–friendly APIs available in modern tabs (TextEncoder, FileReader, btoa/atob). Nothing is sent to our backend unless you navigate away or use another feature that explicitly calls an API.",
  },
  {
    question: "Why does btoa fail on Unicode or emoji in some tools?",
    answer:
      "JavaScript’s btoa treats strings as Latin-1 code units. Characters outside that range throw. This tool encodes UTF-8 bytes to Base64 first, so international text, symbols, and emoji work the same way most APIs expect (UTF-8 payload, then Base64).",
  },
  {
    question: "What is URL-safe Base64 and when should I use it?",
    answer:
      "URL-safe variants (often called Base64URL) replace + with - and / with _ and may omit padding = so strings fit cleanly in query parameters, JWT segments, and filenames without extra escaping. Use standard Base64 when an API spec explicitly requires RFC 4648 default alphabet and padding.",
  },
  {
    question: "How do I decode a data:image/...;base64,... string?",
    answer:
      "Paste the full data URI into the decoder. The tool strips the prefix and decodes the payload. For images you will see binary-looking UTF-8 replacement characters in the text area—use the file or hex workflow in your editor if you need raw bytes; for text assets the result should read normally.",
  },
  {
    question: "Can Base64 be used for security or secrets?",
    answer:
      "Base64 obscures content slightly but provides no confidentiality. Do not rely on it to protect passwords or tokens. For secrets use proper encryption, key management, and transport security (HTTPS). Pair conceptual learning with our hash generator for checksums and the JWT decoder for structured tokens—not for verifying signatures in production.",
  },
  {
    question: "Why is the encoded output longer than the input?",
    answer:
      "Base64 expands binary data by roughly 4/3 because each group of three bytes becomes four ASCII characters. Padding may add one or two = characters at the end. That expansion is expected and why you gzip or compress before encoding when size matters.",
  },
  {
    question: "Which related tools pair with Base64 on this site?",
    answer:
      "Use the URL encoder and decoder for percent-encoding query strings, the JWT decoder when payloads are three Base64URL segments, the JSON formatter for pretty-printing API bodies that contain Base64 fields, and Encode file on this page when you need Base64 from local images or other files without uploading them to a server.",
  },
];
