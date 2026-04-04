export const urlEncoderFaqItems: { question: string; answer: string }[] = [
  {
    question: "What is the difference between URL encoding and Base64?",
    answer:
      "URL encoding (percent-encoding) replaces unsafe or reserved characters with a % followed by two hex digits so text fits in query strings, paths, and fragments per RFC 3986. Base64 represents binary as ASCII letters, digits, and symbols—common for attachments and data URIs, not for general URL text. Use this page for percent-encoding; use the site’s Base64 tool when you need binary-safe transport in text protocols.",
  },
  {
    question: "When should I use encodeURIComponent vs encodeURI?",
    answer:
      "Use encodeURIComponent for a single query parameter value, form field, or path segment where nearly every reserved character must be escaped. Use encodeURI when you have an almost-complete URL and only need to escape characters that are illegal in URIs while keeping structure characters like slashes, question marks, and colons where appropriate. Misusing encodeURI on a lone parameter value often leaves & and = unescaped and breaks parsers.",
  },
  {
    question: "Is my text sent to your servers?",
    answer:
      "No. Encoding and decoding run entirely in your browser with the same APIs your app would use (encodeURIComponent, decodeURIComponent, encodeURI, decodeURI). Nothing is uploaded unless you copy or share the result yourself.",
  },
  {
    question: "Why does decode fail with URI malformed?",
    answer:
      "decodeURIComponent throws when it sees an incomplete percent sequence (a lone %), invalid hex digits after %, or UTF-8 sequences that do not decode cleanly. Fix stray % characters, ensure pairs like %20 are complete, and try treating + as a space if the string came from application/x-www-form-urlencoded data.",
  },
  {
    question: "How do I handle plus signs (+) in query strings?",
    answer:
      "In HTML form submissions, spaces are often encoded as + and decodeURIComponent does not convert + to a space. Enable the “Treat + as space” option before decoding, or replace + with space manually, then decode. When building new query strings, prefer %20 for spaces inside encodeURIComponent output for consistency.",
  },
  {
    question: "Does URL encoding encrypt or hide secrets?",
    answer:
      "No. Percent-encoding is reversible and not confidentiality. Anyone can decode the string. For secrets use proper encryption, TLS in transit, and server-side storage—never rely on encoding alone.",
  },
  {
    question: "Can I encode non-ASCII characters like emojis or accented letters?",
    answer:
      "Yes. JavaScript encodes Unicode using UTF-8 bytes in percent form (for example café becomes sequences starting with %C3). The decoder reconstructs the original Unicode string. Very long strings may slow the tab slightly, but typical snippets and URLs work fine.",
  },
  {
    question: "Which related tools pair well with URL encoding?",
    answer:
      "Inspect live URLs and redirects with the redirect chain checker and HTTP header checker; validate SSL and DNS when debugging broken links; use the Base64 encoder for binary payloads; decode JWT segments separately with the JWT decoder when tokens appear in query strings—all available in this project’s Website and Code tool sections.",
  },
];
