export const imageToBase64FaqItems: { question: string; answer: string }[] = [
  {
    question: "What is a Base64 image or image data URI?",
    answer:
      "A data URI embeds file bytes directly in a URL-like string: data:image/png;base64,<payload>. The payload is the image encoded with Base64 (RFC 4648). Browsers and many APIs accept this format for small icons, inline CSS backgrounds, and JSON fields without a separate file fetch.",
  },
  {
    question: "Is my image uploaded to your servers?",
    answer:
      "No. The FileReader API reads the file only inside your browser tab and converts it to a data URL locally. Nothing is transmitted to our backend for this conversion.",
  },
  {
    question: "When should I use a data URI instead of a normal image URL?",
    answer:
      "Data URIs are handy for prototypes, email HTML, single-file demos, and tiny assets (favicons, small SVG/PNG). For large photos on public websites, prefer hosted URLs and caching (CDN) so HTML stays small and browsers can cache images separately.",
  },
  {
    question: "Why is the Base64 string longer than the original file size?",
    answer:
      "Base64 expands binary data by about 4/3, and the data: prefix adds overhead. That is expected—Base64 is a text-safe transport format, not compression.",
  },
  {
    question: "Can I use this output in CSS background-image?",
    answer:
      "Yes. Use the full data URI inside url(...), for example: background-image: url(\"data:image/svg+xml;base64,...\"); Our tool copies the complete string so you can paste it into stylesheets or component props.",
  },
  {
    question: "Does this work for SVG, GIF, WebP, and AVIF?",
    answer:
      "Yes—any image type the browser can read via FileReader is supported; the MIME type in the data URI reflects the file (e.g. image/webp). Very large files may be slow or hit memory limits in the tab; consider compression or external hosting for big assets.",
  },
  {
    question: "How is this different from the general Base64 encoder?",
    answer:
      "This page is optimized for images: live preview, MIME-aware data URIs, and one-click copy of the full data: string or raw Base64 only. For UTF-8 text, JWT segments, or URL-safe Base64URL, use the general Base64 encoder on the developer tools page.",
  },
];
